import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Ride } from './entities/ride.entity';
import { RideController } from './ride.contoller';
import { RideService } from './ride.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ride])],
  controllers: [RideController],
  providers: [RideService],
  exports: [RideService],
})
export class RideModule { }
