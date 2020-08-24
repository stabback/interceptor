import { BaseService } from '@server/resources/base';

import { User } from './user.model';

export class UserServiceClass extends BaseService< User > {
  constructor() {
    super(
      'user',
      User,
    );
  }

  public create(key: string): User {
    if (this.items.some((u) => u.data.key === key)) {
      throw new Error(`Attempting to create a user with a key that already exists - ${key}`);
    }

    const user = new User({
      key,
      intercepts: {},
    });

    this.items = [
      ...this.items,
      user,
    ];

    return user;
  }

  public getByKey(key: string) {
    return this.getByDataKey('key', key);
  }
}

const userService = new UserServiceClass();

export default userService;
