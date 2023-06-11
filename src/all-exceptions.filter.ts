import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('###过滤器捕捉###', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    super.catch(exception, host);
  }
}
