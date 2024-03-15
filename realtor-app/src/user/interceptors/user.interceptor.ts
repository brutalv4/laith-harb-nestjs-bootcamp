import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')?.[1];
    const user = jwt.decode(token);

    request['user'] = user;
    return next.handle();
  }
}
