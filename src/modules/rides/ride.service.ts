import { User } from './../users/entities/user.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Ride } from './entities/ride.entity';
import { Point } from 'geojson';

@Injectable()
export class RideService {
  constructor(
    @InjectRepository(Ride)
    private readonly rideRepository: Repository<Ride>,
  ) {}

  async ride(
    user: User,
    createRideDto: CreateRideDto,
  ): Promise<{ result: InsertResult }> {
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

    const ride = this.rideRepository.create({
      ...createRideDto,
      pickupPoint,
      destination,
      user,
    });

    const result = await this.rideRepository.insert(ride);

    return { result };
  }
}
