import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService } from '@server/resources/domain';
import { ServerErrorService } from '@server/resources/server-error';
import applyPatchOperations from '@server/utils/apply-patch-operations/apply-patch-operations';

export default async function update(req: ExpressRequest, res: ExpressResponse) {
  const identifier = req.params.domain;
  const domain = await DomainService.getByIdentifier(identifier);

  if (!domain) {
    return res.status(404).send();
  }

  if (!req.body.updates || !Array.isArray(req.body.updates)) {
    return res.status(400).send(
      await ServerErrorService.create(
        'UPDATE_DOMAIN_BAD_FORMAT',
        'Body must contain an array of patch operations',
      ),
    );
  }

  try {
    await applyPatchOperations(domain, req.body.updates);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).send(
        await ServerErrorService.create(
          'UPDATE_DOMAIN_DUPLICATE_KEY',
          `You are attempting to update a domains key or url to another domains key or url - ${e}`,
        ),
      );
    }

    return res.status(500).send(
      await ServerErrorService.create(
        'UPDATE_DOMAIN_UNKOWN_ERROR',
        `Could not apply update - ${e}`,
      ),
    );
  }

  const updatedDomain = await DomainService.getByIdentifier(domain.id);
  return res.send(updatedDomain);
}
