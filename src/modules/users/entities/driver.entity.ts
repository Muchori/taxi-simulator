import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Ride } from 'src/modules/rides/entities/ride.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  phoneNumber: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  suspended?: boolean;

  @OneToOne(() => Ride, (ride) => ride.driver, { onDelete: 'CASCADE' })
  ride: Ride;
}
