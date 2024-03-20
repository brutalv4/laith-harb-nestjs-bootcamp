import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Request } from 'express';

export interface UserInfo {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

export const User = createParamDecorator((_, ctx: ExecutionContextHost) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request['user'];
});
