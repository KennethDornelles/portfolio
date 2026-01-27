import { Injectable } from '@nestjs/common';
import { IUsersRepository } from './repositories/users.repository.interface';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: IUsersRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.passwordHash, salt);

    return this.usersRepository.create({
      ...data,
      passwordHash,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    if (data.passwordHash && typeof data.passwordHash === 'string') {
        const salt = await bcrypt.genSalt();
        data.passwordHash = await bcrypt.hash(data.passwordHash, salt);
    }
    return this.usersRepository.update(id, data);
  }
}
