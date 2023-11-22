import { Column, Entity, Index, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract/abstract.entity";
import { Warehouse } from "./warehouse.entity";

@Entity()
export class User extends AbstractEntity {
  @Column()
  name: string;

  // https://www.rfc-editor.org/errata/eid1690#:~:text=It%20should%20say%3A,total%20length%20of%20320%20characters.
  @Column({ unique: true, length: 254 })
  @Index('idx_user_email')
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  revoked: boolean;

  @OneToMany(() => Warehouse, (table) => table.manager)
  managedWarehouses: Warehouse[];
}