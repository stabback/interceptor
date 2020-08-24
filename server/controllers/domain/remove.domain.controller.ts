import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Domain, DomainService } from '@server/resources/domain';

export default function remove(req: ExpressRequest, res: ExpressResponse) {
  // Validation must be performed as middleware
  const domain = DomainService.get(req.params.domain) as Domain;

  DomainService.remove(domain.id);

  res.status(204).send();
}
