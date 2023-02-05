import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(Users)
    private repository: Repository<Users>,
  ) { }

  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt();
    return hash(data, salt);
  }

  async run() {
    const pass = 'secret';

    const hash = await this.hash(pass);
    const admin = await this.repository.save(
      this.repository.create({
        name: 'Super Admin',
        email: 'admin@gmail.com',
        password: hash,
        phoneNumber: '0701234567',
      }),
    );

    const adminExists = await this.repository.findOne({
      where: { email: 'admin@gmail.com' },
    });

    if (!adminExists) {
      await this.repository.save(admin);
    }
  }
}
