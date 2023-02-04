import { Driver } from './../users/entities/driver.entity';
import { User } from './../users/entities/user.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Ride } from './entities/ride.entity';
import { Point } from 'geojson';
import { Status } from '../statuses/entities/status.entity';
import { StatusEnum } from '../statuses/statuses.enum';
import { RideStatus } from './status';
import { IPaginationOptions } from 'src/utils/types/pagination-options';

@Injectable()
export class RideService {
  constructor(
    @InjectRepository(Ride)
    private readonly rideRepository: Repository<Ride>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) { }

  async createRide(createRideDto: CreateRideDto): Promise<Ride> {
    const passenger = await this.userRepository.findOne({
      where: {
        id: createRideDto.passengerId,
      },
    });
    const driver = await this.driverRepository.findOne({
      where: {
        driver_id: createRideDto.driverId,
      },
    });

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

    const ride = new Ride();
    ride.pickupPoint = pickupPoint;
    ride.destination = destination;
    ride.driver = driver;
    ride.user = passenger;
    ride.status = RideStatus.ongoing;

    return await this.rideRepository.save(ride);
  }

  async ongoing(): Promise<Ride[]> {
    return await this.rideRepository.find({
      where: {
        status: RideStatus.done,
      },
    });
  }

  async stop(rideId: string): Promise<UpdateResult> {
    return await this.rideRepository.update(rideId, {
      status: RideStatus.done,
    });
  }

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return this.rideRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }
}
