import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ConditionService } from '@server/resources/condition';

export default async function get(req: ExpressRequest, res: ExpressResponse) {
  const id = req.params.condition;

  const condition = await ConditionService.get(id);

  if (!condition) {
    return res.status(404).send();
  }

  return res.send(condition);
}
