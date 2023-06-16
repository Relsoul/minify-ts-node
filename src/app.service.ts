import { Inject, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    @Inject('ConfigService')
    private configService: ConfigService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async deleteFile(path) {
    let res;
    try {
      res = await fs.remove(path);
    } catch (e) {
      return Promise.reject(new Error(e));
    }
    return Promise.resolve(res);
  }

  hasAllowQuery(queryList) {
    const allowQuery = ['w', 'h', 'f'];
    const _returnKeys = [];
    for (const i of queryList) {
      if (allowQuery.includes(i)) {
        _returnKeys.push(i);
      }
    }
    return _returnKeys;
  }

  hasSupportImageExt(originPath) {
    const fileExt = path.parse(originPath).ext;
    const imgExt = this.configService.get('compressImageOpt.imgExt');
    const removeDotExt = fileExt.toLowerCase().replace('.', '');
    return imgExt.includes(removeDotExt);
  }

  buildSharpOpt(originPath) {
    const compressImageOpt = this.configService.get('compressImageOpt');
    const fileExt = path.parse(originPath).ext;
    const removeDotExt = fileExt.toLowerCase().replace('.', '');
    const width = compressImageOpt.width;
    const quality = compressImageOpt.quality || 80;
    let format = compressImageOpt.format;
    // 判断原始图片是否支持

    const allowFormat = this.configService.get('compressImageOpt.allowFormat');
    if (allowFormat.includes(removeDotExt)) {
      if (!format) {
        format = removeDotExt;
      }
    } else {
      format = removeDotExt;
    }

    return {
      width,
      quality,
      format,
    };
  }

  async uploadSharpCompress({ width, originPath, format, quality }) {
    const name = path.parse(originPath).name;
    const fileExt = path.parse(originPath).ext;
    const removeDotExt = fileExt.toLowerCase().replace('.', '');

    const bakFileName = name + '-sharp-' + uuidv4();
    let formatFilePath = originPath.replace(name, bakFileName);

    if (removeDotExt !== format) {
      // 重命名
      formatFilePath = formatFilePath.replace(fileExt, '.' + format);
    }

    await sharp(originPath)
      .resize({ width, withoutEnlargement: true })
      .toFormat(format, {
        quality: quality,
      })
      .toFile(formatFilePath);
    // rename
    let returnPath;
    if (removeDotExt === format) {
      // 未转换格式则覆盖原文件
      await fs.move(formatFilePath, originPath, { overwrite: true });
      returnPath = originPath;
    } else {
      // 如果转换格式的话则删除原文件
      await fs.remove(originPath);
      returnPath = formatFilePath;
    }

    return {
      formatFilePath: returnPath,
    };
  }
}
