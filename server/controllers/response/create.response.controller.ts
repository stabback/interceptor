import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ErrorService } from '@server/resources/error';
import { Intercept, InterceptService } from '@server/resources/intercept';
import { ResponseService } from '@server/resources/response';
import { validateRequiredParams } from '@server/utils';

export default function create(req: ExpressRequest, res: ExpressResponse) {
  const { name, intercept: interceptId } = req.body;

  // Validation must be performed as middleware
  const intercept = InterceptService.get(interceptId) as Intercept;

  const errors = validateRequiredParams({ name }, 'CREATE_RESPONSE_VALIDATION_ERROR');

  if (intercept.data.responses.map((id) => ResponseService.get(id)).some(
    (r) => r && r.data.name === name,
  )) {
    errors.push(ErrorService.create(
      'CREATE_RESPONSE_DUPLICATE_NAME',
      'Response names must be unique.  This intercept already has a response by that name.',
    ));
  }

  if (errors.length > 0) {
    return res.status(400).send(ErrorService.buildPayload(errors));
  }

  const status = req.body.status || 200;
  const headers = req.body.headers || {};
  const { body } = req.body;
  const delay = req.body.delay || 200;

  const response = ResponseService.create(name, status, headers, body, delay);
  intercept.addResponse(response.id);
  InterceptService.save();

  return res.status(201).send(response.asResponse);
}
