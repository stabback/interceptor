import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService } from '@server/resources/domain';
import { ErrorService } from '@server/resources/error';
import { validateRequiredParams } from '@server/utils';

export default function create(req: ExpressRequest, res: ExpressResponse) {
  const { name, url, key } = req.body;

  const errors = validateRequiredParams({ name, url, key }, 'CREATE_DOMAIN_VALIDATION_ERROR', res);
  if (errors.length > 0) { return res; }

  if (DomainService.items.some((d) => d.data.key === key)) {
    errors.push(
      ErrorService.create(
        'POST_DOMAIN_DUPLICATE_KEY',
        `Domains must have a unique key.  The key ${key} is in use.`,
      ),
    );

    return res.status(400).send(ErrorService.buildPayload(errors));
  }

  const domain = DomainService.create(name, url, key);

  return res.status(201).send(domain.asResponse);
}
