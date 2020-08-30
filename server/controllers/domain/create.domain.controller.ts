import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService, Domain } from '@server/resources/domain';
import { ServerErrorService } from '@server/resources/server-error';
import { validateRequiredParams } from '@server/utils';

export default async function create(req: ExpressRequest, res: ExpressResponse) {
  const { name, url, key } = req.body;

  const errors = await validateRequiredParams({ name, url, key }, 'CREATE_DOMAIN_VALIDATION_ERROR', res);
  if (errors.length > 0) { return res; }

  let domain;

  const existingDomain = await Domain.find({ key });

  if (existingDomain.length > 0) {
    return res.status(400).send(
      await ServerErrorService.create(
        'CREATE_DOMAIN_ERROR_DUPLICATE_KEY',
        'Domain keys must be unique',
      ),
    );
  }

  try {
    domain = await DomainService.create(name, url, key);
  } catch (e) {
    const error = await ServerErrorService.create('CREATE_DOMAIN_ERROR', e);
    return res.status(500).send(error);
  }

  return res.status(201).send(domain);
}
