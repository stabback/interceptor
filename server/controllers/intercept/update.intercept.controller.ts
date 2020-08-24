import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { applyPatch, Operation } from 'fast-json-patch';

import { ErrorService } from '@server/resources/error';
import { Intercept, InterceptService } from '@server/resources/intercept';

export default function update(req: ExpressRequest, res: ExpressResponse) {
  const intercept = InterceptService.get(req.params.intercept)as Intercept;

  const body = req.body as Operation;

  if (!Array.isArray(body)) {
    return res.status(400).send(
      ErrorService.buildPayload([
        ErrorService.create(
          'UPDATE_INTERCEPT_BAD_FORMAT',
          'Body is not an array of patch operations',
        ),
      ]),
    );
  }

  if (body.some((operation) => operation.path !== '/data/locked')) {
    return res.status(400).send(
      ErrorService.buildPayload([
        ErrorService.create(
          'UPDATE_INTERCEPT_INVALID_OPERATION',
          'Intercepts may only have their lock status changed',
        ),
      ]),
    );
  }

  try {
    applyPatch(intercept, body);
  } catch (e) {
    console.error(e);
    return res.status(400).send(
      ErrorService.buildPayload([
        ErrorService.create(
          'UPDATE_INTERCEPT_UNKOWN_ERROR',
          `Could not apply operation - ${e}`,
        ),
      ]),
    );
  }

  InterceptService.save();

  return res.status(200).send(intercept.asResponse);
}
