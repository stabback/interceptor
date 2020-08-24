import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Intercept, InterceptService } from '@server/resources/intercept';
import { ResponseService } from '@server/resources/response';

export default function getMany(req: ExpressRequest, res: ExpressResponse) {
  let responses = ResponseService.items;

  if (req.params.intercept) {
    const intercept = InterceptService.get(req.params.intercept) as Intercept;

    responses = responses.filter((response) => intercept.data.responses.includes(response.id));
  }

  res.send(ResponseService.buildPayload(responses));
}
