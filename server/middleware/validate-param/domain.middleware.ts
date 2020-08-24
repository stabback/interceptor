import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService } from '@server/resources/domain';
import { ErrorService } from '@server/resources/error';

import baseValidationMiddleware from './base';

export default function (req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
  const validation = baseValidationMiddleware(
    'domain',
    DomainService,
    req,
  );

  if (validation.errors.length > 0) {
    return res.status(validation.status).send(
      ErrorService.buildPayload(validation.errors),
    );
  }

  return next();
}
