import { Driver } from './../../users/entities/driver.entity';
import { Point } from 'geojson';
import { User } from 'src/modules/users/entities/user.entity';
import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from 'src/modules/statuses/entities/status.entity';

@Entity('Ride')
export class Ride extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  rideId: string;

  @ManyToOne(() => Status, {
    eager: true,
  })
  status?: Status;

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

  // @OneToOne(() => Driver, (driver) => driver.user, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'id' })
  // driver: Driver;

  // @OneToOne(() => User, (user) => user.ride, { onDelete: 'CASCADE' })
  // user: User;
}
