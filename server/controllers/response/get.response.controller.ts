import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Response, ResponseService } from '@server/resources/response';

export default function get(req: ExpressRequest, res: ExpressResponse) {
  const response = ResponseService.get(req.params.response) as Response;

  res.send(response.asResponse);
}
