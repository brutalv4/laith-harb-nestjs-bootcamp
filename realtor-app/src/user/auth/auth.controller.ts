import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { User, UserInfo } from '../decorators/user.decorator';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }

      const { email, productKey } = body;
      const validProductKey = this.authService.productKey(email, userType);
      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        productKey,
      );
      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }

    return this.authService.signup(body, userType);
  }

  @Post('signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post('key')
  generateProductKey(@Body() body: GenerateProductKeyDto) {
    return this.authService.generateProductKey(body);
  }

  @Get('me')
  me(@User() user: UserInfo) {
    return user;
  }
}
