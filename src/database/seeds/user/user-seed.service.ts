import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(Users)
    private repository: Repository<Users>,
  ) { }

  async run() {
    const admin = await this.repository.create({
      name: 'Super Admin',
      password: 'secret',
      email: 'admin@admin.com',
      // name: 'Super Admin',
      // email: 'admin@admin.com',
      // phoneNumber: '070123456789',
      // password: 'secret',
    });

    const adminExists = await this.repository.findOne({
      where: { email: 'admin@admin.com' },
    });

    if (!adminExists) {
      await this.repository.save(admin);
    }
  }
}
