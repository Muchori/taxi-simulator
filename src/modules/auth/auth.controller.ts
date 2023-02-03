import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  public async adminLogin(@Body() loginDTO: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDTO, true);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('passenger/login')
  @HttpCode(HttpStatus.OK)
  public async uaerLogin(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDto, false);
  }
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('driver/login')
  @HttpCode(HttpStatus.OK)
  public async driverLogin(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateDriverLogin(loginDto, false);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: AuthRegisterLoginDto) {
    return this.service.register(createUserDto);
  }
}
