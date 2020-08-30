import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService } from '@server/resources/domain';

export default async function get(req: ExpressRequest, res: ExpressResponse) {
  const identifier = req.params.domain;

  const domain = await DomainService.getByIdentifier(identifier);

  if (!domain) {
    return res.status(404).send();
  }

  return res.send(domain);
}
