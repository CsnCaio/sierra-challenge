import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from 'src/database/entities/warehouse.entity';
import { DeepPartial } from 'typeorm';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseRepository } from './warehouse.repository';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(WarehouseRepository) private readonly repository: WarehouseRepository,
  ) { }

  async create(createWarehouseDto: CreateWarehouseDto, userId: number) {
    const payload = { ...createWarehouseDto, managerId: userId };

    const warehouse = this.repository.create(payload as DeepPartial<Warehouse>);
    return this.repository.save(warehouse);
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    try {
      const warehouse = await this.repository.findOneOrFail({ where: { id } });
      return warehouse;
    } catch (error) {
      throw new NotFoundException('Warehouse not found');
    }
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto, userId: number) {
    const warehouse = await this.findOne(id);

    const payload = { ...updateWarehouseDto, managerId: userId };

    const updatedWarehouse = this.repository.merge(warehouse, payload as DeepPartial<Warehouse>);
    return this.repository.save(updatedWarehouse);
  }

  async remove(id: number) {
    const warehouse = await this.findOne(id);
    return this.repository.remove(warehouse);
  }
}
