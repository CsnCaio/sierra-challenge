import { SecurityUtil } from 'src/utils/security.util';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from '../user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<any> {
    const user: User = event.entity;
    if (user.password) {
      user.password = await SecurityUtil.hash(user.password);
    }
  }
}
