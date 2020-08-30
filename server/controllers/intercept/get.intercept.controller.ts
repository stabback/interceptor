import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { InterceptService } from '@server/resources/intercept';

export default async function get(req: ExpressRequest, res: ExpressResponse) {
  const id = req.params.intercept;

  let intercept;
  try {
    intercept = await InterceptService.get(id);
  } catch (e) {
    console.error(e);
  }

  if (!intercept) {
    return res.status(404).send();
  }

  return res.send(intercept);
}
