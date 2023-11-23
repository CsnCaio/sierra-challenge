import { Injectable } from "@nestjs/common";
import { Customer } from "src/database/entities/customer.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CustomerRepository extends Repository<Customer> {
  constructor(private readonly dataSource: DataSource) {
    super(Customer, dataSource.createEntityManager());
  }
}