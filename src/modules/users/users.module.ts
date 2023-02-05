import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { Users } from './entities/user.entity';
import { Driver } from './entities/driver.entity';
import { DriverController } from './controllers/driver.controller';
import { DriverService } from './services/driver.service';
import { BcryptService } from 'src/shared/bcrypt.service';
import { HashingService } from 'src/shared/hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Driver])],
  controllers: [UsersController, DriverController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    UsersService,
    DriverService,
  ],
  exports: [UsersService, DriverService],
})
export class UsersModule { }
