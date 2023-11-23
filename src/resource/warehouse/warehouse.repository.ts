import { Injectable } from "@nestjs/common";
import { Warehouse } from "src/database/entities/warehouse.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class WarehouseRepository extends Repository<Warehouse> {
  constructor(private readonly dataSource: DataSource) {
    super(Warehouse, dataSource.createEntityManager());
  }
}