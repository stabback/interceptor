import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { User, UserService } from '@server/resources/user';

export default function remove(req: ExpressRequest, res: ExpressResponse) {
  // Validation must be performed as middleware
  const user = UserService.get(req.params.user) as User;

  UserService.remove(user.id);

  res.status(204).send();
}
