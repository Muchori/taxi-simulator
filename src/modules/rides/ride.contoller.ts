import { Ride } from 'src/modules/rides/entities/ride.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RideService } from './ride.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Ride')
@Controller({
  path: 'ride',
  version: '1',
})
export class RideController {
  constructor(private readonly rideService: RideService) { }

  @Post(':passengerId/:driverId')
  @HttpCode(HttpStatus.OK)
  async createRide(
    @Body() createRideDto: CreateRideDto,
    @Param('passengerId') passengerId: string,
    @Param('driverId') driverId: string,
  ): Promise<Ride> {
    createRideDto.driverId = driverId;
    createRideDto.passengerId = passengerId;

    const ride = await this.rideService.createRide(createRideDto);

    return ride;
  }

  @Get('ongoing')
  @HttpCode(HttpStatus.OK)
  async ongoing(): Promise<Ride[]> {
    return await this.rideService.ongoing();
  }

  @Patch('/:rideId/stop')
  @HttpCode(HttpStatus.OK)
  async stop(@Param('rideId') rideId: string) {
    return await this.rideService.stop(rideId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Ride[]> {
    return await this.rideService.findAll();
  }
}
