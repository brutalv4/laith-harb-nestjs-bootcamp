import { UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

class UserDto {
  @IsEmail()
  email: string;
}

export class SigninDto extends UserDto {
  @IsString()
  password: string;
}

export class SignupDto extends SigninDto {
  @MinLength(5)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, {
    message: 'phone must be a valid phone number',
  })
  phone: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
}

export class GenerateProductKeyDto extends UserDto {
  @IsEnum(UserType)
  userType: UserType;
}
