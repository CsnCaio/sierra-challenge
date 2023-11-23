import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract/abstract.entity';

@Entity()
export class Address extends AbstractEntity {
  @Column()
  latitude: string;

  @Column()
  longitude: string;
}
