import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { InterceptService } from '@server/resources/intercept';

export default async function remove(req: ExpressRequest, res: ExpressResponse) {
  const id = req.params.intercept;

  await InterceptService.remove(id);

  return res.status(204).send();
}
