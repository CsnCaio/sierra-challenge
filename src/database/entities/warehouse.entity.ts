import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from "typeorm";
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

  @Column()
  managerId: number;

  @ManyToOne(() => User, (table) => table.managedWarehouses)
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @Column()
  isActive: boolean;

  @Column()
  addressId: number;

  @OneToOne(() => Address, (table) => table.id, {
    nullable: false,
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn({ name: 'addressId' })
  address: Address;
}