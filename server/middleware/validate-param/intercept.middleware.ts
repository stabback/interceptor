import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService } from '@server/resources/domain';
import { ErrorService } from '@server/resources/error';
import { InterceptService } from '@server/resources/intercept';

import baseValidationMiddleware from './base';

export default function validateIntercept(
  req: ExpressRequest, res: ExpressResponse, next: NextFunction,
) {
  const validation = baseValidationMiddleware(
    'intercept',
    InterceptService,
    req,
  );

  if (validation.errors.length > 0) {
    res.status(validation.status);
    return res.send(
      ErrorService.buildPayload(validation.errors),
    );
  }

  if (!validation.item) {
    throw new Error('The validation service should have provided an error when this item could not be found');
  }

  if (req.params.domain) {
    const domain = DomainService.get(req.params.domain);

    if (!domain) {
      throw new Error('Domain was not found even though it should have been validated');
    }

    if (!domain.data.intercepts.includes(validation.item.id)) {
      res.status(404);
      return res.send(
        ErrorService.buildPayload([
          ErrorService.create(
            'GET_INTERCEPT_NOT_FOUND_ON_DOMAIN',
            `No intercept with key [${req.params.intercept}] was found on the domain [${req.params.domain}].`,
          ),
        ]),
      );
    }
  }

  return next();
}
