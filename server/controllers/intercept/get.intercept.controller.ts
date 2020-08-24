import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Intercept, InterceptService } from '@server/resources/intercept';

export default function get(req: ExpressRequest, res: ExpressResponse) {
  const intercept = InterceptService.get(req.params.intercept) as Intercept;

  return res.send(intercept.asResponse);
}
