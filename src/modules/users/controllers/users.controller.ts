import {
  Controller,
  Put,
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
import { UserProfileDto } from '../dto/user-profile.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
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
      await this.usersService.register(userDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Driver registration successfully!',
        status: HttpStatus.CREATED,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Driver not registration!',
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

  @Put('/:passengerId/profile')
  public async updateProfileUser(
    @Res() res,
    @Param('passengerId') passengerId: string,
    @Body() userProfileDto: UserProfileDto,
  ): Promise<any> {
    try {
      await this.usersService.updateProfileUser(passengerId, userProfileDto);

      return res.status(HttpStatus.OK).json({
        message: 'User Updated successfully!',
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User not updated!',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Put('/:passengerId')
  public async updateUser(
    @Res() res,
    @Param('passengerId') passengerId: string,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    try {
      await this.usersService.updateUser(passengerId, userUpdateDto);

      return res.status(HttpStatus.OK).json({
        message: 'User Updated successfully!',
        status: 200,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User not updated!',
        status: 400,
      });
    }
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
