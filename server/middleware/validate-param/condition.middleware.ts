import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ConditionService } from '@server/resources/condition';
import { ErrorService } from '@server/resources/error';
import { InterceptService } from '@server/resources/intercept';

import baseValidationMiddleware from './base';

export default function validateCondition(
  req: ExpressRequest, res: ExpressResponse, next: NextFunction,
) {
  const validation = baseValidationMiddleware(
    'condition',
    ConditionService,
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

  if (req.params.intercept) {
    const intercept = InterceptService.get(req.params.intercept);

    if (!intercept) {
      throw new Error('Intercept was not found even though it should have been validated');
    }

    if (!intercept.data.conditions.includes(validation.item.id)) {
      res.status(404);
      return res.send(
        ErrorService.buildPayload([
          ErrorService.create(
            'GET_RESPONSE_NOT_FOUND_ON_DOMAIN',
            `No condition with key [${req.params.condition}]
                        was found on the intercept [${req.params.intercept}].`,
          ),
        ]),
      );
    }
  }

  return next();
}
