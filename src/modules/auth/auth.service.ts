import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import { User } from '../users/entities/user.entity';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { RoleEnum } from 'src/modules/roles/roles.enum';
import { StatusEnum } from 'src/modules/statuses/statuses.enum';
import { Status } from 'src/modules/statuses/entities/status.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { Driver } from '../users/entities/driver.entity';
import { DriverService } from './../users/services/driver.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private driverService: DriverService,
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
    onlyAdmin: boolean,
  ): Promise<{ token: string; user: User | Driver }> {
    const passenger = await this.usersService.findOne({
      email: loginDto.email,
    });

    const driver = await this.driverService.findOne({
      email: loginDto.email,
    });

    if (
      (!passenger && !driver) ||
      (passenger &&
        driver &&
        !(
          onlyAdmin ? [RoleEnum.admin] : [RoleEnum.user] && [RoleEnum.driver]
        ).includes(passenger.role.id || driver.role.id))
    ) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      passenger.password || driver.password,
    );

    if (isValidPassword) {
      const token = await this.jwtService.sign({
        id: passenger.id || driver.driver_id,
        role: passenger.role || driver.role,
      });

      return { token, user: passenger && driver };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async register(dto: AuthRegisterLoginDto): Promise<{ user: User | Driver }> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.usersService.create({
      ...dto,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      role: {
        id: RoleEnum.user || RoleEnum.driver,
      } as Role,
      status: {
        id: StatusEnum.inactive,
      } as Status,
      hash,
    });

    return {
      user: user,
    };
  }
}
