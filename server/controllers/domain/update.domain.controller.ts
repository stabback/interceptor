import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { applyPatch, Operation } from 'fast-json-patch';

import { Domain, DomainService } from '@server/resources/domain';
import { ErrorService } from '@server/resources/error';

export default function update(req: ExpressRequest, res: ExpressResponse) {
  const domain = DomainService.get(req.params.domain)as Domain;

  const body = req.body as Operation;

  if (!Array.isArray(body)) {
    return res.status(400).send(
      ErrorService.buildPayload([
        ErrorService.create(
          'UPDATE_DOMAIN_BAD_FORMAT',
          'Body is not an array of patch operations',
        ),
      ]),
    );
  }

  try {
    applyPatch(domain, body);
  } catch (e) {
    console.error(e);
    return res.status(400).send(
      ErrorService.buildPayload([
        ErrorService.create(
          'UPDATE_DOMAIN_UNKOWN_ERROR',
          `Could not apply operation - ${e}`,
        ),
      ]),
    );
  }

  DomainService.save();

  return res.send(domain.asResponse);
}
