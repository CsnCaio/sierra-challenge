import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract/abstract.entity';

@Entity()
export class Address extends AbstractEntity {
  @Column()
  zip: string;

  @Column()
  city: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  street: string;

  @Column()
  country: string;
}
