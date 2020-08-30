import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ResponseService } from '@server/resources/response';

export default async function get(req: ExpressRequest, res: ExpressResponse) {
  const id = req.params.response;

  const response = await ResponseService.get(id);

  if (!response) {
    return res.status(404).send();
  }

  return res.send(response);
}
