import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ErrorService } from '@server/resources/error';
import { UserService } from '@server/resources/user';

import baseValidationMiddleware from './base';

export default function (req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
  const validation = baseValidationMiddleware(
    'user',
    UserService,
    req,
  );

  if (validation.errors.length > 0) {
    return res.status(validation.status).send(
      ErrorService.buildPayload(validation.errors),
    );
  }

  return next();
}
