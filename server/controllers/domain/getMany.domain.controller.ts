import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService } from '@server/resources/domain';

export default async function getMany(req: ExpressRequest, res: ExpressResponse) {
  const domains = await DomainService.getAll();

  return res.send({ items: domains });
}
