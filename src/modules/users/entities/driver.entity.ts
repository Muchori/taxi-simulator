import { Expose, Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from 'src/modules/roles/entities/role.entity';
import { Status } from 'src/modules/statuses/entities/status.entity';
import { EntityHelper } from 'src/utils/entity-helper';
import { Ride } from 'src/modules/rides/entities/ride.entity';

@Entity()
export class Driver extends EntityHelper {
  @PrimaryGeneratedColumn()
  driver_id: number;

  @Column({ unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Index()
  @Column({ type: 'boolean', default: false, nullable: false })
  suspended: boolean;

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Index()
  @Column({ nullable: true })
  firstName: string | null;

  @Index()
  @Column({ nullable: true })
  lastName: string | null;

  @Index()
  @Column({ unique: true, nullable: true })
  phoneNumber: string | null;

  @ManyToOne(() => Role, {
    eager: true,
  })
  role?: Role | null;

  @ManyToOne(() => Status, {
    eager: true,
  })
  status?: Status;

  // @OneToOne(() => User, (user) => user.driver, { onDelete: 'CASCADE' })
  // user: User;

  @OneToOne(() => Ride, (ride) => ride.driver, { onDelete: 'CASCADE' })
  ride: Ride;

  @Column({ nullable: true })
  @Index()
  @Exclude({ toPlainOnly: true })
  hash: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
