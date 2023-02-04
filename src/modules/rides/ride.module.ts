import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Ride } from './entities/ride.entity';
import { RideController } from './ride.contoller';
import { RideService } from './ride.service';
import { Driver } from '../users/entities/driver.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ride, Driver, User])],
  controllers: [RideController],
  providers: [RideService],
  exports: [RideService],
})
export class RideModule { }
