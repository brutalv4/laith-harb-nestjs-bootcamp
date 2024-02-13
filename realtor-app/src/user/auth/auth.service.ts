import { ConflictException, Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { SignupDto } from '../dtos/auth.dto';
import { PrismaService } from './../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ email, password, name, phone }: SignupDto) {
    const userExists = !!(await this.prismaService.user.findUnique({
      where: { email },
    }));

    if (userExists) {
      throw new ConflictException('user with given email already exits');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });

    return user;
  }
}
