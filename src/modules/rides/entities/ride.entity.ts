import { Driver } from './../../users/entities/driver.entity';
import { Point } from 'geojson';
import { User } from 'src/modules/users/entities/user.entity';
import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RideStatus } from '../status';

@Entity('Ride')
export class Ride extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  rideId: string;

  @Column({
    type: 'enum',
    enum: RideStatus,
    nullable: false,
    default: RideStatus.ongoing,
  })
  status?: string;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  pickupPoint: Point;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  destination: Point;

  @OneToOne(() => Driver, (driver) => driver.ride, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @OneToOne(() => User, (user) => user.ride, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'passenger_id' })
  user: User;
}
