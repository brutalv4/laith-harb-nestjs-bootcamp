import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { User, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { PrismaService } from './../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ email, password, name, phone }: SignupDto) {
    const userExists = !!(await this.findUserByEmail(email));
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

    return this.signJwt(user);
  }

  async signin({ email, password }: SigninDto) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', 400);
    }

    return this.signJwt(user);
  }

  async generateProductKey({ email, userType }: GenerateProductKeyDto) {
    return {
      productKey: await bcrypt.hash(
        `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`,
        10,
      ),
    };
  }

  private findUserByEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  private signJwt(user: User) {
    return {
      token: jwt.sign(
        { name: user.name, id: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: 3600000,
        },
      ),
    };
  }
}
