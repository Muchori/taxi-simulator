import { User } from 'src/modules/users/entities/user.entity';
import { Ride } from 'src/modules/rides/entities/ride.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RideService } from './ride.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { Driver } from '../users/entities/driver.entity';

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
    @Param('passenger_id') passenger_id: number,
    @Param('driver_id') driver_id: number,
    @Body() createRideDto: CreateRideDto,
  ): Promise<Ride> {
    const ride = await this.rideService.createRide(createRideDto);

    return ride;
  }
}
