import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { Users } from './entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { Driver } from './entities/driver.entity';
import { DriverController } from './controllers/driver.controller';
import { DriverService } from './services/driver.service';
import { BcryptService } from 'src/shared/bcrypt.service';
import { HashingService } from 'src/shared/hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Driver])],
  controllers: [UsersController, DriverController],
  providers: [
    UsersService,
    DriverService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [UsersService, DriverService],
})
export class UsersModule { }
