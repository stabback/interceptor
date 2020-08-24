import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { User, UserService } from '@server/resources/user';

export default function get(req: ExpressRequest, res: ExpressResponse) {
  const user = (
        UserService.getByKey(req.params.user) || UserService.get(req.params.user)
    ) as User;

  return res.send(user.asResponse);
}
