import { Injectable } from "@nestjs/common";
import { User } from "src/database/entities/user.entity";
import { Repository, DataSource } from "typeorm";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}