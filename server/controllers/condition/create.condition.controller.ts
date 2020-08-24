import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ConditionService, ConditionType } from '@server/resources/condition';
import { ErrorService } from '@server/resources/error';
import { Intercept, InterceptService } from '@server/resources/intercept';
import { validateRequiredParams } from '@server/utils';

export default function create(req: ExpressRequest, res: ExpressResponse) {
  const { type, rule, intercept: interceptId } = req.body;

  // Validation must be performed as middleware
  const intercept = InterceptService.get(interceptId) as Intercept;

  if (intercept.locked) {
    return res.status(400).send(ErrorService.buildPayload([
      ErrorService.create(
        'CREATE_CONDITION_INTERCEPT_LOCKED',
        'The intercept you are attempting to modify is locked and cannot have its conditions modified',
      ),
    ]));
  }

  const errors = validateRequiredParams({ type, rule }, 'CREATE_CONDITION_VALIDATION_ERROR', res);
  if (errors.length > 0) { return res; }

  if (!Object.values(ConditionType).includes(type)) {
    errors.push(
      ErrorService.create(
        'CREATE_CONDITION_UNKOWN_TYPE',
        `The supplied type is not a valid type - ${type}`,
      ),
    );
    return res.status(400).send(ErrorService.buildPayload(errors));
  }

  const condition = ConditionService.create(type, rule);

  intercept.addCondition(condition.id);

  InterceptService.save();

  return res.status(201).send(condition.asResponse);
}
