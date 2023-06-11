import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AppService } from './app.service';
import { buildResult } from './utils/result';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('ConfigService')
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = context.switchToHttp().getRequest().headers;
    if (!headers['utoken']) {
      throw new HttpException(
        buildResult(-1, '授权验证错误,请传递token header', {}),
        HttpStatus.OK,
      );
      return false;
    }
    const token = headers['utoken'];
    const user = this.configService.get('user');

    const isFind = user.find((n) => {
      return n.hex === token;
    });

    if (!isFind) {
      throw new HttpException(
        buildResult(-1, '校验token失败，未授权访问', {}),
        HttpStatus.OK,
      );
    }

    // 附加到单次请求上

    // 兼容multer
    const req = context.switchToHttp().getRequest();
    if (req) {
      req.res.locals = req.res.locals || {};
      req.res.locals['user'] = isFind;
    }
    req.res.locals.user = isFind;
    return true;
  }
}
