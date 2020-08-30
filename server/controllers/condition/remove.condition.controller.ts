import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ConditionService } from '@server/resources/condition';

export default async function remove(req: ExpressRequest, res: ExpressResponse) {
  const id = req.params.condition;

  await ConditionService.remove(id);

  return res.status(204).send();
}
