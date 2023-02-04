import { Driver } from './../users/entities/driver.entity';
import { User } from './../users/entities/user.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from './entities/ride.entity';
import { Point } from 'geojson';
import { Status } from '../statuses/entities/status.entity';
import { StatusEnum } from '../statuses/statuses.enum';

@Injectable()
export class RideService {
  constructor(
    @InjectRepository(Ride)
    private readonly rideRepository: Repository<Ride>,
  ) { }

  async createRide(createRideDto: CreateRideDto): Promise<Ride> {
    const pickupPoint: Point = {
      type: 'Point',
      coordinates: [
        createRideDto.pickupPoint.longitude,
        createRideDto.pickupPoint.latitude,
      ],
    };

    const destination: Point = {
      type: 'Point',
      coordinates: [
        createRideDto.destination.longitude,
        createRideDto.destination.latitude,
      ],
    };

    const ride = await this.rideRepository.create({
      ...createRideDto,
      pickupPoint,
      destination,
      status: {
        id: StatusEnum.inactive,
      } as Status,
    });

    await this.rideRepository.insert(ride);

    return ride;
  }
}
