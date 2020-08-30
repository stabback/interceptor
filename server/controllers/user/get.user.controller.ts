import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { UserService } from '@server/resources/user';

export default async function get(req: ExpressRequest, res: ExpressResponse) {
  const identifier = req.params.user;

  const user = await UserService.getByIdentifier(identifier);

  if (!user) {
    return res.status(404).send();
  }

  return res.send(user);
}
