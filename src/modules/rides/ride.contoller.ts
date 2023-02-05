import { Ride } from 'src/modules/rides/entities/ride.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { RideService } from './ride.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
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
  @HttpCode(HttpStatus.OK)
  async createRide(
    @Body() createRideDto: CreateRideDto,
    @Query('passenger_id') passenger_id: string,
    @Query('driver_id') driver_id: string,
  ): Promise<Ride> {
    createRideDto.driverId = driver_id;
    createRideDto.passengerId = passenger_id;

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
