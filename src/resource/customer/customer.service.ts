import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/database/entities/customer.entity';
import { DeepPartial } from 'typeorm';
import { CustomerRepository } from './customer.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { WarehouseService } from '../warehouse/warehouse.service';
import { GeometryUtil } from 'src/utils/geometry.util';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerRepository) private readonly repository: CustomerRepository,
    private readonly warehouseService: WarehouseService
  ) { }

  async create(createCustomerDto: CreateCustomerDto, userId: number) {
    const customerExists = await this.repository.findOne({ where: { email: createCustomerDto.email } }) !== null;
    if (customerExists) {
      throw new BadRequestException('Customer already exists');
    }

    const payload = { ...createCustomerDto, createdById: userId };

    const customer = this.repository.create(payload as DeepPartial<Customer>);
    return this.repository.save(customer);
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    try {
      const customer = await this.repository.findOneOrFail({ where: { id }, relations: ['address'] });
      return customer;
    } catch (error) {
      throw new NotFoundException('Customer not found');
    }
  }

  async findOneByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto, userId: number) {
    const customer = await this.findOne(id);

    const payload = { ...updateCustomerDto, createdById: userId };

    const updatedCustomer = this.repository.merge(customer, payload as DeepPartial<Customer>);
    return this.repository.save(updatedCustomer);
  }

  async remove(id: number) {
    const customer = await this.findOne(id);
    return this.repository.remove(customer);
  }

  async getWarehouseDistance(customerId: number, warehouseId: number) {
    const customer = await this.findOne(customerId);
    const customerLatLng = { lat: +customer.address.latitude, lng: +customer.address.longitude };

    const warehouse = await this.warehouseService.findOne(warehouseId);
    const warehouseLatLng = { lat: +warehouse.address.latitude, lng: +warehouse.address.longitude };

    const distance = GeometryUtil.getDistance(customerLatLng, warehouseLatLng);

    return { distanceInMeters: distance };
  }
}
