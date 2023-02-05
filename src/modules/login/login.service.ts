import { DriverService } from './../users/services/driver.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import { HashingService } from 'src/shared/hashing.service';
import { IUsers } from '../users/interfaces/users.interface';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly driverService: DriverService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashingService: HashingService,
  ) { }

  private async findUserByEmail(loginDto: LoginDto): Promise<IUsers> {
    return (
      (await this.usersService.findByEmail(loginDto.email)) ||
      (await this.driverService.findByEmail(loginDto.email))
    );
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<any | { status: number; message: string }> {
    return this.findUserByEmail(loginDto)
      .then(async (userData) => {
        if (!userData) {
          throw new UnauthorizedException();
        }

        const passwordIsValid = await this.hashingService.compare(
          loginDto.password,
          userData.password,
        );

        if (!passwordIsValid == true) {
          return {
            message: 'Authentication failed. Wrong password',
            status: HttpStatus.BAD_REQUEST,
          };
        }

        return await this.signToken({
          name: userData.name,
          email: userData.email,
          id: userData.id,
          phoneNumber: userData.phoneNumber,
        });
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });
  }

  private async signToken(payload: ActiveUserData) {
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken: accessToken,
      user: payload,
      status: HttpStatus.OK,
    };
  }

  public async validateUserByJwt(payload: JwtPayload) {
    // This will be used when the user has already logged in and has a JWT
    const user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return this.createJwtPayload(user);
  }

  protected createJwtPayload(user) {
    const data: JwtPayload = {
      email: user.email,
    };

    const jwt = this.jwtService.sign(data);

    return {
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_TTL'),
      token: jwt,
    };
  }
}
