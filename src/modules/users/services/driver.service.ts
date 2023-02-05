import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserDto } from '../dto/create-user.dto';
import { Driver } from '../entities/driver.entity';
import { UserProfileDto } from '../dto/user-profile.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { Users } from '../entities/user.entity';
import { IUsers } from '../interfaces/users.interface';

@Injectable()
export class DriverService {
  hashingService: any;
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) { }

  public async findAll(): Promise<Driver[]> {
    return await this.driverRepository.find();
  }

  public async findByEmail(email: string): Promise<Users> {
    const driver = await this.driverRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!driver) {
      throw new NotFoundException(`Driver ${email} not found`);
    }

    return driver;
  }

  public async findById(userId: string): Promise<Driver> {
    const user = await this.driverRepository.findOneBy(userId);

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return user;
  }

  public async create(userDto: UserDto): Promise<IUsers> {
    try {
      return await this.driverRepository.save(userDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByEmail(email: string): Promise<Users> {
    try {
      const driver = await this.driverRepository.findOneBy({ email: email });
      driver.password = await this.hashingService.hash(
        Math.random().toString(36).slice(-8),
      );

      return await this.driverRepository.save(driver);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByPassword(
    email: string,
    password: string,
  ): Promise<Users> {
    try {
      const driver = await this.driverRepository.findOneBy({ email: email });
      driver.password = await this.hashingService.hash(password);

      return await this.driverRepository.save(driver);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateProfileDriver(
    id: string,
    userProfileDto: UserProfileDto,
  ): Promise<Driver> {
    try {
      const driver = await this.driverRepository.findOneBy({ id });
      driver.name = userProfileDto.name;
      driver.email = userProfileDto.email;
      driver.phoneNumber = userProfileDto.phoneNumber;

      return await this.driverRepository.save(driver);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateDriver(
    id: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<UpdateResult> {
    try {
      const driver = await this.driverRepository.update(id, {
        ...userUpdateDto,
      });

      if (!driver) {
        throw new NotFoundException(`User #${id} does not exist`);
      }

      return driver;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteDriver(id: string): Promise<void> {
    const driver = await this.findById(id);
    await this.driverRepository.remove(driver);
  }

  async suspend(driver_id: string): Promise<UpdateResult> {
    return await this.driverRepository.update(driver_id, { suspended: false });
  }

  async removeSuspend(driver_id: string): Promise<UpdateResult> {
    return await this.driverRepository.update(driver_id, {
      suspended: true,
    });
  }
}
