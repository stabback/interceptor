import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { UserService } from '@server/resources/user';

export default function getMany(req: ExpressRequest, res: ExpressResponse) {
  const users = UserService.items;

  return res.send(UserService.buildPayload(users));
}
