import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    console.log('signup');
  }
}
