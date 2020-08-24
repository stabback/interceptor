import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { InterceptService } from '@server/resources/intercept';
import { Response, ResponseService } from '@server/resources/response';

export default function remove(req: ExpressRequest, res: ExpressResponse) {
  // Validation must be performed as middleware
  const response = ResponseService.get(req.params.response) as Response;

  ResponseService.remove(response.id);

  InterceptService.items.forEach((intercept) => {
    intercept.removeResponse(response.id);
  });

  InterceptService.save();

  res.status(204).send();
}
