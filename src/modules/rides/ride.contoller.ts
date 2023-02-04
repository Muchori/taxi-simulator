import { User } from 'src/modules/users/entities/user.entity';
import { Ride } from 'src/modules/rides/entities/ride.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import { Body, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, SerializeOptions, UseGuards } from '@nestjs/common';
import { RideService } from './ride.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { Driver } from '../users/entities/driver.entity';
import { infinityPagination } from 'src/utils/infinity-pagination';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.admin)
@ApiTags('Ride')
@Controller({
  path: 'ride',
  version: '1',
})
export class RideController {
  constructor(private readonly rideService: RideService) { }

  @Post(':id/:id')
  async createRide(
    @Body() createRideDto: CreateRideDto,
    @Query('passenger_id') passenger_id: number,
    @Query('driver_id') driver_id: number,
  ): Promise<Ride> {
    createRideDto.driverId = driver_id;
    createRideDto.passengerId = passenger_id;

    const ride = await this.rideService.createRide(
      passenger_id,
      driver_id,
      createRideDto,
    );

    console.log(ride);

    return ride;
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.rideService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }
}
