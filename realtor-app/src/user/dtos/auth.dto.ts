import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SigninDto {
  @IsEmail()
  email: string;

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
}
