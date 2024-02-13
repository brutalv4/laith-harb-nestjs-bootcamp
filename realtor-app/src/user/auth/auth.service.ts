import { ConflictException, Injectable } from '@nestjs/common';

import { SignupDto } from '../dtos/auth.dto';
import { PrismaService } from './../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ email }: SignupDto) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (user) {
      throw new ConflictException('user with given email already exits');
    }
  }
}
