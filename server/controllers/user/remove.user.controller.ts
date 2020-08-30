import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { UserService } from '@server/resources/user';

export default async function remove(req: ExpressRequest, res: ExpressResponse) {
  const identifier = req.params.user;

  await UserService.removeByIdentifier(identifier);

  return res.status(204).send();
}
