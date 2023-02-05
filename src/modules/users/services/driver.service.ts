import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import { IUsers } from '../interfaces/users.interface';
import { DriverDto } from '../dto/create-driver.dto';
import { HashingService } from 'src/shared/hashing.service';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly hashingService: HashingService,
  ) { }

  public async findAll(): Promise<Driver[]> {
    return await this.driverRepository.find();
  }

  public async findByEmail(email: string): Promise<Driver> {
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
    const user = await this.driverRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return user;
  }

  public async createDriver(driverDto: DriverDto): Promise<IUsers> {
    try {
      return await this.driverRepository.save(driverDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async registerDriver(driverDto: DriverDto): Promise<IUsers> {
    driverDto.password = await this.hashingService.hash(driverDto.password);

    return await this.createDriver(driverDto);
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
