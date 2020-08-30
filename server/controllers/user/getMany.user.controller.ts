import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { UserService } from '@server/resources/user';

export default async function getMany(req: ExpressRequest, res: ExpressResponse) {
  const users = await UserService.getAll();

  return res.send({ items: users });
}
