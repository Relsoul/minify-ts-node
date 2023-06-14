import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
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

async function deleteFile(path) {
  let res;
  try {
    res = await fs.remove(path);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
  return Promise.resolve(res);
}

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

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('filepond', { storage }))
  @UseGuards(AuthGuard)
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req) {
    // const req = ctx.req;
    const fileInfo = path.parse(req.file.filename);
    const accept = this.configService.get('accept');
    const keys = Object.keys(accept);
    const isFind = keys.find((n) => {
      const reg = new RegExp(n);
      const isAccept = reg.test(fileInfo.ext.toLowerCase());
      return isAccept;
    });

    if (!isFind) {
      await deleteFile(req.file.path);
      throw new HttpException(
        buildResult(-1, `文件不被接受，请传递${keys.join(',')}类型的文件`, {}),
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const confAcceptItem = accept[isFind];

    if (req.file.size / (1024 * 1024) > confAcceptItem.maxSize) {
      await deleteFile(req.file.path);
      throw new HttpException(
        buildResult(-1, `文件大小超出${confAcceptItem.maxSize}M`, {}),
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const host = this.configService.get('host');

    return buildResult(1, '上传成功', {
      filename: req.file.filename,
      url: path.join(host, req.res.locals.__userProjectPath, req.file.filename),
    });
  }
}
