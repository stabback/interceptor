import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ServerErrorService } from '@server/resources/server-error';
import { UserService } from '@server/resources/user';
import { validateRequiredParams } from '@server/utils';

export default async function create(req: ExpressRequest, res: ExpressResponse) {
  const { key } = req.body;

  const errors = await validateRequiredParams({ key }, 'CREATE_USER_VALIDATION_ERROR', res);
  if (errors.length > 0) { return res; }
  let user;

  try {
    user = await UserService.create(key);
  } catch (e) {
    const error = await ServerErrorService.create(e, 'CREATE_USER_ERROR');
    return res.status(400).send(error);
  }

  return res.status(201).send(user);
}
