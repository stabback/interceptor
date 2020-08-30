import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ServerErrorService, ServerErrorDocument } from '@server/resources/server-error';
import { UserService } from '@server/resources/user';
import applyPatchOperations from '@server/utils/apply-patch-operations/apply-patch-operations';
import { Operation } from 'fast-json-patch';
import { InterceptService } from '@server/resources/intercept';
import { Types } from 'mongoose';

export default async function update(req: ExpressRequest, res: ExpressResponse) {
  const identifier = req.params.user;
  const user = await UserService.getByIdentifier(identifier);

  if (!user) {
    return res.status(404).send();
  }

  // Verify the patch format
  if (!req.body.updates || !Array.isArray(req.body.updates)) {
    return res.status(400).send(
      await ServerErrorService.create(
        'UPDATE_USER_BAD_FORMAT',
        'Body must contain an array of patch operations',
      ),
    );
  }

  const errors: ServerErrorDocument[] = [];
  req.body.updates.forEach(async (operation: Operation) => {
    if (
      /\/intercepts\/(.+)/.test(operation.path)
            && (operation.op === 'add' || operation.op === 'replace')
    ) {
      const interceptId = operation.path.split('/').pop();
      const responseId = operation.value;

      let intercept;
      try {
        intercept = await InterceptService.get(Types.ObjectId(interceptId));
      } catch (e) {
        errors.push(
          await ServerErrorService.create(
            'UPDATE_USER_BAD_ID',
            `Intercept ID not valid - ${interceptId}`,
          ),
        );
      }

      if (!intercept) {
        errors.push(
          await ServerErrorService.create(
            'UPDATE_USER_UNKNOWN_INTERCEPT',
            `Intercept ID not found - ${interceptId}`,
          ),
        );

        // Null responses are OK - they are pass through.
      } else if (!intercept.responses.includes(responseId) && responseId !== null) {
        errors.push(
          await ServerErrorService.create(
            'UPDATE_USER_INVALID_RESPONSE',
            `Response ID is not found on intercept - ${responseId}`,
          ),
        );
      }
    }
  });

  if (errors.length > 0) {
    return res.status(400).send(
      errors,
    );
  }

  try {
    await applyPatchOperations(user, req.body.updates);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).send(
        await ServerErrorService.create(
          'UPDATE_USER_DUPLICATE_KEY',
          'You are attempting to update a users key to another users key.',
        ),
      );
    }

    return res.status(500).send(
      await ServerErrorService.create(
        'UPDATE_USER_UNKOWN_ERROR',
        `Could not apply update - ${e}`,
      ),
    );
  }

  const updatedUser = await UserService.getByIdentifier(user.id);
  return res.send(updatedUser);
}
