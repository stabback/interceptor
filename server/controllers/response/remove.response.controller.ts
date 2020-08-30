import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ResponseService } from '@server/resources/response';

export default async function remove(req: ExpressRequest, res: ExpressResponse) {
  const id = req.params.response;

  await ResponseService.remove(id);

  return res.status(204).send();
}
