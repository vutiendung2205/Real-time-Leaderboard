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
  @Post('log-in')
  async loginUser(@Request() request: RequestWithUser) {
    const { user } = request;
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
    console.log('🚀 ~ AuthorizationController ~ logOut ~ request:', request);
    const { user } = request;
    // await this.usersService.removeRefreshToken(user.id);
  }

  // @Post()
  // create(@Body() createAuthorizationDto: CreateAuthorizationDto) {
  //   return this.authorizationService.create(createAuthorizationDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authorizationService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authorizationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthorizationDto: UpdateAuthorizationDto) {
  //   return this.authorizationService.update(+id, updateAuthorizationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authorizationService.remove(+id);
  // }
}
