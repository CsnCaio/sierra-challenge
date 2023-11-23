import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique
} from 'typeorm';
import { AbstractEntity } from './abstract/abstract.entity';
import { Address } from './address.entity';
import { User } from './user.entity';

@Entity()
export class Customer extends AbstractEntity {
  @Column()
  @Index()
  name: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ unique: true, length: 254 })
  @Unique('customer_email_unique', ['email'])
  email: string;

  @Column()
  addressId: number;

  @OneToOne(() => Address, (table) => table.id, {
    nullable: false,
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @Column()
  createdById: number;

  @ManyToOne(() => User, (table) => table.id)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;
}
