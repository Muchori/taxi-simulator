import {
  Controller,
  Get,
  Body,
  Res,
  Param,
  HttpStatus,
  NotFoundException,
  Delete,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../dto/create-user.dto';
import { IUsers } from '../interfaces/users.interface';
import { UsersService } from '../services/users.service';
@ApiBearerAuth()
@ApiTags('Passengers')
@Controller({
  path: 'passenger',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  public async create(@Res() res, @Body() userDto: UserDto): Promise<any> {
    try {
      await this.usersService.registerPassenger(userDto);

      return res.status(HttpStatus.CREATED).json({
        userDto,
        message: 'Passenger registration successfully!',
        status: HttpStatus.CREATED,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Passenger not registred!',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Get()
  public async findAllUser(): Promise<IUsers[]> {
    return this.usersService.findAll();
  }

  @Get('/:passengerId')
  public async findOneUser(
    @Param('passengerId') passengerId: string,
  ): Promise<IUsers> {
    return this.usersService.findById(passengerId);
  }

  @Get('/:passengerId/profile')
  public async getUser(
    @Res() res,
    @Param('passengerId') passengerId: string,
  ): Promise<IUsers> {
    const user = await this.usersService.findById(passengerId);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return res.status(HttpStatus.OK).json({
      user: user,
      status: HttpStatus.OK,
    });
  }

  @Delete('/:passengerId')
  public async deleteUser(
    @Param('passengerId') passengerId: string,
  ): Promise<void> {
    const user = this.usersService.deleteUser(passengerId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return user;
  }
}
