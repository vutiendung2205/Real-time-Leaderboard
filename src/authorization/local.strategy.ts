import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authorizationService: AuthorizationService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  async validate(email: string, password: string): Promise<UserEntity> {
    console.log('🚀 ~ LocalStrategy ~ validate ~ password:', password);
    console.log('🚀 ~ LocalStrategy ~ validate ~ email:', email);
    return this.authorizationService.getAuthenticatedUser(email, password);
  }
}
