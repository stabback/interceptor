import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ErrorService } from '@server/resources/error';
import { SnapshotService } from '@server/resources/snapshot';

import baseValidationMiddleware from './base';

export default function validateSnapshot(
  req: ExpressRequest, res: ExpressResponse, next: NextFunction,
) {
  const validation = baseValidationMiddleware(
    'snapshot',
    SnapshotService,
    req,
  );

  if (validation.errors.length > 0) {
    return res.status(validation.status).send(
      ErrorService.buildPayload(validation.errors),
    );
  }

  return next();
}
