import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ErrorService } from '@server/resources/error';
import { UserService } from '@server/resources/user';
import { validateRequiredParams } from '@server/utils';

export default function create(req: ExpressRequest, res: ExpressResponse) {
  const { key } = req.body;

  const errors = validateRequiredParams({ key }, 'CREATE_USER_VALIDATION_ERROR', res);
  if (errors.length > 0) { return res; }

  if (UserService.items.some((u) => u.data.key === key)) {
    errors.push(
      ErrorService.create(
        'POST_USER_DUPLICATE_KEY',
        `Users must have a unique key.  The key ${key} is in use.`,
      ),
    );

    return res.status(400).send(ErrorService.buildPayload(errors));
  }

  const user = UserService.create(key);

  return res.status(201).send(user.asResponse);
}
