import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Ride } from 'src/modules/rides/entities/ride.entity';

@Entity()
export class Users {
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

  @OneToOne(() => Ride, (ride) => ride.user, { onDelete: 'CASCADE' })
  ride: Ride;
}
