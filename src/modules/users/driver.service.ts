import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Driver } from './entities/driver.entity';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(createProfileDto: CreateUserDto) {
    const driver = this.driverRepository.create(createProfileDto);
    await this.driverRepository.insert(driver);

    return driver;

    // return this.driverRepository.save(
    //   this.driverRepository.create(createProfileDto),
    // );
  }

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return this.driverRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<Driver>) {
    return this.driverRepository.findOne({
      where: fields,
    });
  }

  async update(driver_id: number, updateProfileDto: UpdateUserDto) {
    return await this.driverRepository.save(
      this.driverRepository.create({
        driver_id,
        ...updateProfileDto,
      }),
    );
  }

  async suspend(driver_id: number): Promise<UpdateResult> {
    return await this.driverRepository.update(driver_id, { isActive: false });
  }

  async removeSuspend(driver_id: number): Promise<UpdateResult> {
    return await this.driverRepository.update(driver_id, {
      isActive: true,
    });
  }

  async delete(driver_id: number) {
    const result = await this.findOne({ driver_id: driver_id });

    if (!result) {
      throw new NotFoundException('Driver not found');
    }

    return this.driverRepository.remove(result);
    //await this.driverRepository.softDelete(driver_id);
  }
}
