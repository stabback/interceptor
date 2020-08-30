import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService } from '@server/resources/domain';

export default async function remove(req: ExpressRequest, res: ExpressResponse) {
  const identifier = req.params.domain;

  await DomainService.removeByIdentifier(identifier);

  res.status(204).send();
}
