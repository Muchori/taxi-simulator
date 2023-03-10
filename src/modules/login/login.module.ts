import { Driver } from './../users/entities/driver.entity';
import { DriverService } from './../users/services/driver.service';
import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BcryptService } from 'src/shared/bcrypt.service';
import { HashingService } from 'src/shared/hashing.service';
import { Users } from '../users/entities/user.entity';
import { UsersService } from '../users/services/users.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users, Driver]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    LoginService,
    UsersService,
    DriverService,
  ],
  controllers: [LoginController],
})
export class LoginModule { }
