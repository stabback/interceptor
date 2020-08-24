import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Condition, ConditionService } from '@server/resources/condition';

export default function get(req: ExpressRequest, res: ExpressResponse) {
  const condition = ConditionService.get(req.params.condition) as Condition;

  res.send(condition.asResponse);
}
