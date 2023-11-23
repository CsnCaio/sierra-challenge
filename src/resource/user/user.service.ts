import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { DeepPartial } from 'typeorm';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly repository: UserRepository,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.repository.findOne({ where: { email: createUserDto.email } }) !== null;
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const user = this.repository.create(createUserDto as DeepPartial<User>);
    return this.repository.save(user);
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    try {
      const user = await this.repository.findOneOrFail({ where: { id } });
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findOneByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const newUser = this.repository.merge(user, updateUserDto as DeepPartial<User>);
    return this.repository.save(newUser);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.repository.remove(user);
  }
}
