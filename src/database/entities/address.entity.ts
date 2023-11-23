import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract/abstract.entity';

@Entity()
export class Address extends AbstractEntity {
  @Column()
  zip: string;

  @Column()
  city: string;

  @Column()
  number: number;

  @Column()
  state: string;

  @Column()
  street: string;

  @Column()
  country: string;
}
