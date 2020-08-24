import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ConditionService } from '@server/resources/condition';
import { Intercept, InterceptService } from '@server/resources/intercept';

export default function getMany(req: ExpressRequest, res: ExpressResponse) {
  let conditions = ConditionService.items;

  if (req.params.intercept) {
    const intercept = InterceptService.get(req.params.intercept) as Intercept;

    conditions = conditions.filter((condition) => intercept.data.conditions.includes(condition.id));
  }

  res.send(ConditionService.buildPayload(conditions));
}
