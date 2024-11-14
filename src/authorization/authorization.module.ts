import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    // JwtModule.register({
    //   secret: `${process.env.JWT_SECRET}`,
    //   signOptions: { expiresIn: '7d' },
    // }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, LocalStrategy],
})
export class AuthorizationModule {}
