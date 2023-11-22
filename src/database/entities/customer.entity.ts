import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne
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
  birthDate?: Date;

  @Column({ unique: true, length: 254 })
  email: string;

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

  @OneToOne(() => User)
  @JoinColumn()
  createdBy: User;
}
