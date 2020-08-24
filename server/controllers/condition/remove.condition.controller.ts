import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Condition, ConditionService } from '@server/resources/condition';
import { InterceptService } from '@server/resources/intercept';

export default function remove(req: ExpressRequest, res: ExpressResponse) {
  // Validation must be performed as middleware
  const condition = ConditionService.get(req.params.condition) as Condition;

  ConditionService.remove(condition.id);

  InterceptService.items.forEach((intercept) => {
    intercept.removeCondition(condition.id);
  });

  InterceptService.save();

  res.status(204).send();
}
