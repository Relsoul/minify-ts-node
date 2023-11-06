import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Next,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { buildResult } from './utils/result';
import * as multer from 'multer';
import * as moment from 'moment';
import { AuthGuard } from './auth.guard';
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import * as sharp from 'sharp';
import { globSync } from 'glob';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('destination');
    const locals = req.res.locals;
    const __userPath = `${locals.user.name}/${moment().format('YYYY-MM-DD')}`;
    const __filePath = `../public/uploads/${__userPath}`;
    const userPath = path.join(__dirname, __filePath);
    const userProjectPath = `/public/uploads/${__userPath}`;
    locals['__userPath'] = userPath;
    locals['__userProjectPath'] = userProjectPath;
    fs.ensureDirSync(userPath);
    cb(null, userPath);
  },
  filename: function (req, file, cb) {
    console.log('filename');
    const locals = req.res.locals;
    const fileInfo = path.parse(file.originalname);
    locals['__fileExt'] = fileInfo.ext;
    cb(null, uuidv4() + fileInfo.ext);
  },
});

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('ConfigService')
    private configService: ConfigService,
  ) {}

  @Get('/public/*')
  async renderFile(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Req() req: Request,
  ) {
    const originalUrl = req.path;
    const filePath = path.join(__dirname, '../', originalUrl);

    const keys = Object.keys(req.query);
    const allowQuery = this.appService.hasAllowQuery(keys);
    if (allowQuery.length > 0) {
      const exists = await fs.pathExists(filePath);
      if (!exists) {
        return res.sendStatus(404);
      }
      const queryData = {};
      for (const i of allowQuery) {
        const val = req.query[i];
        queryData[i] = val;
      }
      const fileBuffer = await fs.readFile(filePath);
      const resizeOpt = {
        width: queryData['w'] ? parseInt(queryData['w']) : null,
        height: queryData['h'] ? parseInt(queryData['h']) : null,
      };
      const formatList = this.configService.get('compressImageOpt.allowFormat');
      const _pathParse = path.parse(filePath);
      const originExt = _pathParse.ext.toLowerCase().replace('.', '');
      const format = queryData['f'] || originExt;
      if (queryData['f']) {
        if (!formatList.includes(queryData['f'])) {
          return res.sendStatus(400);
        }
      }

      const semiTransparentRedPng = await sharp(fileBuffer)
        .resize(resizeOpt)
        .toFormat(format)
        .toBuffer();
      res.setHeader('Content-Type', `image/${format}`);
      return res.send(semiTransparentRedPng);
    }

    console.log('public');
    res.sendFile(filePath);
  }

  @Get('/')
  getHello(): string {
    return 'minify upload start success';
  }
  @Get('/optimize')
  @UseGuards(AuthGuard)
  async optimize() {
    const files = globSync(
      path.join(__dirname, '../public/uploads/**/*.{jpg,png,jpeg,webp}'),
    );
    const optimizeList = [];
    const optimizeListError = [];
    console.log('files', files);
    for (const originPath of files) {
      const { width, quality, format } =
        this.appService.buildSharpOpt(originPath);
      let formatFilePath;
      try {
        const res = await this.appService.uploadSharpCompress({
          width,
          quality,
          format,
          originPath,
        });
        formatFilePath = res.formatFilePath;
      } catch (e) {
        optimizeListError.push(originPath);
        console.error('优化失败', e);
        continue;
      }

      optimizeList.push(formatFilePath);
    }
    return buildResult(1, '优化完毕', { optimizeList, optimizeListError });
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('filepond', { storage }))
  @UseGuards(AuthGuard)
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req) {
    // const req = ctx.req;
    const fileInfo = path.parse(req.file.filename);
    const accept = this.configService.get('accept');
    let fullFilePath = path.join(
      req.res.locals.__userProjectPath,
      req.file.filename,
    );
    const keys = Object.keys(accept);
    const isFind = keys.find((n) => {
      const reg = new RegExp(n);
      const isAccept = reg.test(fileInfo.ext.toLowerCase());
      return isAccept;
    });

    if (!isFind) {
      await this.appService.deleteFile(req.file.path);
      throw new HttpException(
        buildResult(-1, `文件不被接受，请传递${keys.join(',')}类型的文件`, {}),
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const confAcceptItem = accept[isFind];

    if (req.file.size / (1024 * 1024) > confAcceptItem.maxSize) {
      await this.appService.deleteFile(req.file.path);
      throw new HttpException(
        buildResult(-1, `文件大小超出${confAcceptItem.maxSize}M`, {}),
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    // 压缩图片
    const originPath = path.join(__dirname, '../', fullFilePath);
    const compressImage = this.configService.get('compressImage');

    if (compressImage && this.appService.hasSupportImageExt(originPath)) {
      // 判断原始图片是否支持

      const { width, quality, format } =
        this.appService.buildSharpOpt(originPath);

      const { formatFilePath } = await this.appService.uploadSharpCompress({
        width,
        quality,
        format,
        originPath,
      });
      const _path = path.parse(formatFilePath);
      const _oPath = path.parse(fullFilePath);

      fullFilePath = `${_oPath.dir}/${_path.base}`;
    }

    const host = this.configService.get('host');

    return buildResult(1, '上传成功', {
      filename: req.file.filename,
      url: host + fullFilePath.replace('/public', 'public'),
    });
  }
}
