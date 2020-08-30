import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ConditionService } from '@server/resources/condition';
import { InterceptService } from '@server/resources/intercept';

export default async function getMany(req: ExpressRequest, res: ExpressResponse) {
  let conditions;

  if (req.params.intercept) {
    const intercept = await InterceptService.get(req.params.intercept);
    if (!intercept) {
      return res.status(404).send();
    }

    intercept.populate('conditions');
    await intercept.execPopulate();

    conditions = intercept.conditions;
  } else {
    conditions = await ConditionService.getAll();
  }

  return res.send({ items: conditions });
}
