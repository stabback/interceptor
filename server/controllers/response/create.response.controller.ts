import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ServerErrorService } from '@server/resources/server-error';
import { InterceptService } from '@server/resources/intercept';
import { ResponseService } from '@server/resources/response';
import { validateRequiredParams } from '@server/utils';

export default async function create(req: ExpressRequest, res: ExpressResponse) {
  const {
    name,
    intercept: interceptId,
    body,
    headers,
    status,
    delay,
  } = req.body;

  const errors = await validateRequiredParams({ name }, 'CREATE_DOMAIN_VALIDATION_ERROR', res);
  if (errors.length > 0) { return res; }

  const response = await ResponseService.create(
    name, body, headers, status, delay,
  );

  const intercept = await InterceptService.get(interceptId);

  if (!intercept) {
    return res.status(400).send(
      await ServerErrorService.create(
        'CREATE_RESPONSE_INTERCEPT_NOT_FOUND',
        'The intercept you are attempting to add a response to was not found',
      ),
    );
  }

  try {
    await intercept.addResponse(response);
  } catch (e) {
    return res.status(400).send(
      await ServerErrorService.create(
        'CREATE_RESPONSE_COULD_NOT_ADD_TO_INTERCEPT',
        e,
      ),
    );
  }

  await response.save();
  await intercept.save();

  return res.status(201).send(response);
}
