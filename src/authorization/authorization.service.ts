import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { LoginAuthorizationDto } from './dto/login-authorization.dto';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginUserDto: LoginAuthorizationDto): Promise<object> {
    const payload = await this.validateUser(loginUserDto);

    if (!payload) {
      throw new HttpException(
        'There is no user corresponding to the email address.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const accessToken = this.jwtService.sign(payload);
    return {
      user: payload,
      accessToken: accessToken,
    };
  }

  async register(createAuthorizationDto: CreateAuthorizationDto) {
    if (
      await this.usersService.findOne({ email: createAuthorizationDto.email })
    ) {
      throw new HttpException(
        `User with email ${createAuthorizationDto.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    } else if (
      await this.usersService.findOne({
        username: createAuthorizationDto.username,
      })
    ) {
      throw new HttpException(
        `User with username ${createAuthorizationDto.username} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const hashPassword = await bcrypt.hashSync(
        createAuthorizationDto.password,
        10,
      );
      const newUser: UserEntity = await this.usersService.create({
        ...createAuthorizationDto,
        password: hashPassword,
      });

      // create refresh token for new user
      const refreshToken = this.getCookieWithRefreshToken(newUser.id);
      const hashedRefreshToken = await bcrypt.hashSync(refreshToken.token, 10);

      newUser.refreshToken = hashedRefreshToken;

      return newUser;
    }
  }

  async validateUser(loginUserDto: LoginAuthorizationDto): Promise<any> {
    const user: UserEntity = await this.usersService.findOne({
      email: loginUserDto.email,
    });

    if (user && bcrypt.compareSync(loginUserDto.password, user.password)) {
      const userInformation = {
        email: user.email,
        userName: user.username,
      };
      return userInformation;
    }
    return null;
  }

  public getCookieWithAccessToken(userId: string) {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
  }

  public getCookieWithRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
    return {
      cookie,
      token,
    };
  }

  public async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.usersService.getByEmail(email);

      const isPasswordMatching = await bcrypt.compareSync(
        password,
        user.password,
      );

      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
