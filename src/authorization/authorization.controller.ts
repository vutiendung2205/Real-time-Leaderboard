import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthorizationService } from './authorization.service';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { LoginAuthorizationDto } from './dto/login-authorization.dto';
import RequestWithUser from './interfaces/requestWithUser-interface';
import { LocalAuthorizationGuard } from './localAuthorization.guard';

@Controller('auth')
export class AuthorizationController {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthorizationGuard)
  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginAuthorizationDto,
    @Request() request: RequestWithUser,
  ) {
    console.log('🚀 ~ AuthorizationController ~ request:', request);
    console.log('🚀 ~ AuthorizationController ~ loginUserDto:', loginUserDto);
    const { user } = request;
    const accessTokenCookie =
      this.authorizationService.getCookieWithAccessToken(user.id);
    const refreshTokenCookie =
      this.authorizationService.getCookieWithRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(user.refreshToken, user.id);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);
    return user;
    // return this.authorizationService.login(loginUserDto);
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

    await this.usersService.setCurrentRefreshToken(user.refreshToken, user.id);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);

    // Omit password and refreshToken from the response
    const { password, refreshToken: _, ...userWithoutSensitiveData } = user;

    return userWithoutSensitiveData;
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
