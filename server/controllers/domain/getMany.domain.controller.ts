import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService } from '@server/resources/domain';

export default function getMany(req: ExpressRequest, res: ExpressResponse) {
  const domains = DomainService.items;

  return res.send(DomainService.buildPayload(domains));
}
