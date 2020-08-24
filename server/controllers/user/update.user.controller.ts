import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { applyPatch, Operation } from 'fast-json-patch';

import { ApiError, ErrorService } from '@server/resources/error';
import { InterceptService } from '@server/resources/intercept';
import { User, UserService } from '@server/resources/user';

export default function update(req: ExpressRequest, res: ExpressResponse) {
  const user = (
        UserService.getByKey(req.params.user) || UserService.get(req.params.user)
    ) as User;

  const body = req.body as Operation;

  if (!Array.isArray(body)) {
    return res.status(400).send(
      ErrorService.buildPayload([
        ErrorService.create(
          'UPDATE_USER_BAD_FORMAT',
          'Body is not an array of patch operations',
        ),
      ]),
    );
  }

  const errors: ApiError[] = [];

  body.forEach((operation) => {
    if (
      /\/intercepts\/(.+)/.test(operation.path)
            && (operation.op === 'add' || operation.op === 'replace')
    ) {
      const interceptId = operation.path.split('/').pop();
      const responseId = operation.value;

      const intercept = InterceptService.get(interceptId);

      if (!intercept) {
        errors.push(
          ErrorService.create(
            'UPDATE_USER_UNKNOWN_INTERCEPT',
            `Intercept ID not found - ${interceptId}`,
          ),
        );

        // Null responses are OK - they are pass through.
      } else if (!intercept.data.responses.includes(responseId) && responseId !== null) {
        errors.push(
          ErrorService.create(
            'UPDATE_USER_INVALID_RESPONSE',
            `Response ID is not found on intercept - ${responseId}`,
          ),
        );
      }
    }
  });

  if (errors.length > 0) {
    return res.status(400).send(
      ErrorService.buildPayload(errors),
    );
  }

  try {
    applyPatch(user, body);
  } catch (e) {
    console.error(e);
    return res.status(400).send(
      ErrorService.buildPayload([
        ErrorService.create(
          'UPDATE_USER_UNKOWN_ERROR',
          `Could not apply operation - ${e}`,
        ),
      ]),
    );
  }

  UserService.save();

  return res.send(user.asResponse);
}
