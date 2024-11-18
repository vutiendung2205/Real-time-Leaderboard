import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthorizationService } from './authorization.service';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { JwtAuthorizationGuard } from './guards/jwt-authorization.guard';
import { LocalAuthorizationGuard } from './guards/local-authorization.guard';
import RequestWithUser from './interfaces/requestWithUser-interface';

@Controller('auth')
export class AuthorizationController {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthorizationGuard)
  @Post('login')
  async loginUser(@Request() request: RequestWithUser) {
    const { user } = request;
    console.log('🚀 ~ AuthorizationController ~ loginUser ~ user:', user);
    const accessTokenCookie =
      this.authorizationService.getCookieWithAccessToken(user.id);
    const refreshTokenCookie =
      this.authorizationService.getCookieWithRefreshToken(user.id);

    await this.usersService.setRefreshToken(user.refreshToken, user.id);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);
    return user;
  }

  @Post('register')
  async create(
    @Body() createAuthorizationDto: CreateAuthorizationDto,
    @Request() request: RequestWithUser,
  ) {
    const user = await this.authorizationService.register(
      createAuthorizationDto,
    );

    const accessTokenCookie =
      this.authorizationService.getCookieWithAccessToken(user.id);
    const refreshTokenCookie =
      this.authorizationService.getCookieWithRefreshToken(user.id);

    await this.usersService.setRefreshToken(user.refreshToken, user.id);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);

    // Omit password and refreshToken from the response
    const { password, refreshToken: _, ...userWithoutSensitiveData } = user;

    return userWithoutSensitiveData;
  }

  @UseGuards(JwtAuthorizationGuard)
  @Get('logout')
  async logOut(@Request() request: RequestWithUser) {
    const { user } = request;
    await this.usersService.removeRefreshToken(user.id);
    request.res.setHeader(
      'Set-Cookie',
      this.authorizationService.getCookiesForLogOut(),
    );
  }

  @UseGuards(JwtAuthorizationGuard)
  @Get('me')
  async getMe(@Request() request: RequestWithUser) {
    const { user } = request;
    console.log('🚀 ~ AuthorizationController ~ getMe ~ user:', user);
    return this.usersService.getById(user.id);
  }
}
