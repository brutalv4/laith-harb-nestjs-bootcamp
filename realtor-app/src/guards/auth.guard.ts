import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JWTPayload {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const roles: UserType[] =
      this.reflector.getAllAndOverride('roles', [
        ctx.getClass(),
        ctx.getHandler(),
      ]) ?? [];

    if (!roles.length) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest<IncomingMessage>();
    const token = request.headers.authorization?.split('Bearer ').pop();

    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
      const { user_type: userType } = await this.prismaService.user.findUnique({
        where: { id },
      });

      return roles.includes(userType);
    } catch {
      return false;
    }
  }
}
