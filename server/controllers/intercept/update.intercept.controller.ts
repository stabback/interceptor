import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ServerErrorService } from '@server/resources/server-error';
import { InterceptService } from '@server/resources/intercept';
import { Operation } from 'fast-json-patch';
import applyPatchOperations from '@server/utils/apply-patch-operations/apply-patch-operations';

export default async function update(req: ExpressRequest, res: ExpressResponse) {
  const id = req.params.intercept;
  let intercept;
  try {
    intercept = await InterceptService.get(id);
  } catch (e) {
    return res.status(400).send(
      await ServerErrorService.create(
        'UPDATE_INTERCEPT_BAD_INTERCEPT_ID',
        'The Id for this intercept does is not valid',
      ),
    );
  }

  if (!intercept) {
    return res.status(404).send();
  }

  if (!req.body.updates || !Array.isArray(req.body.updates)) {
    return res.status(400).send(
      await ServerErrorService.create(
        'UPDATE_INTERCEPT_BAD_FORMAT',
        'Body must contain an array of patch operations',
      ),
    );
  }

  if (req.body.updates.some((operation: Operation) => operation.path !== '/locked')) {
    return res.status(400).send(
      await ServerErrorService.create(
        'UPDATE_INTERCEPT_INVALID_OPERATION',
        'Intercepts may only have their lock status changed',
      ),
    );
  }

  try {
    await applyPatchOperations(intercept, req.body.updates);
  } catch (e) {
    console.error(e);
    return res.status(400).send(
      ServerErrorService.create(
        'UPDATE_INTERCEPT_UNKOWN_ERROR',
        `Could not apply update - ${e}`,
      ),
    );
  }

  const updatedIntercept = await InterceptService.get(intercept.id);
  return res.send(updatedIntercept);
}
