import { DriverUpdateDto } from './../dto/driver-update.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserProfileDto } from '../dto/user-profile.dto';
import { IUsers } from '../interfaces/users.interface';
import { DriverService } from '../services/driver.service';
import { DriverDto } from '../dto/create-driver.dto';
import { log } from 'console';

@ApiBearerAuth()
@ApiTags('Drivers')
@Controller({
  path: 'driver',
  version: '1',
})
export class DriverController {
  constructor(private readonly driverService: DriverService) { }

  @Post()
  public async create(@Res() res, @Body() driverDto: DriverDto): Promise<any> {
    try {
      await this.driverService.registerDriver(driverDto);

      return res.status(HttpStatus.CREATED).json({
        driverDto,
        message: 'Driver registration successfully!',
        status: HttpStatus.CREATED,
      });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Driver not registred!',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Get()
  public async findAllUser(): Promise<IUsers[]> {
    return this.driverService.findAll();
  }

  @Get('/:driverId')
  public async findOneUser(@Param('userId') userId: string): Promise<IUsers> {
    return this.driverService.findById(userId);
  }

  @Get('/:driverId/profile')
  public async getUser(
    @Res() res,
    @Param('driverId') driverId: string,
  ): Promise<IUsers> {
    const user = await this.driverService.findById(driverId);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return res.status(HttpStatus.OK).json({
      user: user,
      status: HttpStatus.OK,
    });
  }

  @Put('/:driverId/profile')
  public async updateProfileUser(
    @Res() res,
    @Param('driverId') driverId: string,
    @Body() userProfileDto: UserProfileDto,
  ): Promise<any> {
    try {
      await this.driverService.updateProfileDriver(driverId, userProfileDto);

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

  @Put('/:driverId')
  public async updateUser(
    @Res() res,
    @Param('driverId') driverId: string,
    @Body() driverUpdateDto: DriverUpdateDto,
  ) {
    try {
      await this.driverService.updateDriver(driverId, driverUpdateDto);

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

  @Delete('/:driverId')
  public async deleteUser(@Param('driverId') driverId: string): Promise<void> {
    const user = this.driverService.deleteDriver(driverId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post(':driverId/suspend')
  async suspend(@Param('id') driver_id: string): Promise<string> {
    await this.driverService.suspend(driver_id);

    return 'success';
  }

  @HttpCode(HttpStatus.OK)
  @Post(':driverId/remove-suspend')
  async removeSuspend(@Param('id') driver_id: string): Promise<string> {
    await this.driverService.removeSuspend(driver_id);

    return 'success';
  }
}
