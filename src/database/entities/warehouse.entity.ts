import { Column, Entity, Index, JoinTable, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AbstractEntity } from "./abstract/abstract.entity";
import { Address } from "./address.entity";
import { User } from "./user.entity";

@Entity()
export class Warehouse extends AbstractEntity {
  @Column()
  @Index()
  name: string;

  @Column()
  capacity: number;

  @Column()
  currentInventory: number;

  @ManyToOne(() => User, (table) => table.managedWarehouses)
  manager: User;

  @Column()
  isActive: boolean;

  @OneToOne(() => Address)
  address: Address;
}