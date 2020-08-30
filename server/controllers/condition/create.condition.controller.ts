import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ConditionService } from '@server/resources/condition';
import { ServerErrorService } from '@server/resources/server-error';
import { InterceptService } from '@server/resources/intercept';
import { validateRequiredParams } from '@server/utils';

export default async function create(req: ExpressRequest, res: ExpressResponse) {
  const {
    conditionType,
    rule,
    intercept: interceptId,
  } = req.body;

  const errors = await validateRequiredParams({ conditionType, rule }, 'CREATE_CONDITION_VALIDATION_ERROR', res);
  if (errors.length > 0) { return res; }

  const condition = await ConditionService.create(
    conditionType,
    rule,
  );

  const intercept = await InterceptService.get(interceptId);

  if (!intercept) {
    return res.status(400).send(
      await ServerErrorService.create(
        'CREATE_CONDITION_INTERCEPT_NOT_FOUND',
        'The intercept you are attempting to add a condition to was not found',
      ),
    );
  }

  try {
    await intercept.addCondition(condition);
  } catch (e) {
    return res.status(400).send(
      await ServerErrorService.create(
        'CREATE_CONDITION_COULD_NOT_ADD_TO_INTERCEPT',
        e,
      ),
    );
  }

  condition.save();
  intercept.save();

  return res.status(201).send(condition);
}
