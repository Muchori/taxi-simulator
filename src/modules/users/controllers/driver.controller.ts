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
import { UserUpdateDto } from '../dto/user-update.dto';
import { IUsers } from '../interfaces/users.interface';
import { DriverService } from '../services/driver.service';

@ApiBearerAuth()
@ApiTags('Drivers')
@Controller({
  path: 'driver',
  version: '1',
})
export class DriverController {
  constructor(private readonly driverService: DriverService) { }

  @Get()
  public async findAllUser(): Promise<IUsers[]> {
    return this.driverService.findAll();
  }

  @Get('/:userId')
  public async findOneUser(@Param('userId') userId: string): Promise<IUsers> {
    return this.driverService.findById(userId);
  }

  @Get('/:userId/profile')
  public async getUser(
    @Res() res,
    @Param('userId') userId: string,
  ): Promise<IUsers> {
    const user = await this.driverService.findById(userId);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return res.status(HttpStatus.OK).json({
      user: user,
      status: HttpStatus.OK,
    });
  }

  @Put('/:userId/profile')
  public async updateProfileUser(
    @Res() res,
    @Param('userId') userId: string,
    @Body() userProfileDto: UserProfileDto,
  ): Promise<any> {
    try {
      await this.driverService.updateProfileDriver(userId, userProfileDto);

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

  @Put('/:userId')
  public async updateUser(
    @Res() res,
    @Param('userId') userId: string,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    try {
      await this.driverService.updateDriver(userId, userUpdateDto);

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

  @Delete('/:userId')
  public async deleteUser(@Param('userId') userId: string): Promise<void> {
    const user = this.driverService.deleteDriver(userId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/suspend')
  async suspend(@Param('id') driver_id: string): Promise<string> {
    await this.driverService.suspend(driver_id);

    return 'success';
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/remove-suspend')
  async removeSuspend(@Param('id') driver_id: string): Promise<string> {
    await this.driverService.removeSuspend(driver_id);

    return 'success';
  }
}
