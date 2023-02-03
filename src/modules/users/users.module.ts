import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { Driver } from './entities/driver.entity';
import { DriverController } from './controllers/driver.controller';
import { DriverService } from './services/driver.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Driver])],
  controllers: [UsersController, DriverController],
  providers: [IsExist, IsNotExist, UsersService, DriverService],
  exports: [UsersService, DriverService],
})
export class UsersModule {}
