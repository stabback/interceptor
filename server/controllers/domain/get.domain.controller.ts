import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Domain, DomainService } from '@server/resources/domain';

export default function get(req: ExpressRequest, res: ExpressResponse) {
  const domain = (
        DomainService.get(req.params.domain) || DomainService.getByKey(req.params.domain)
    ) as Domain;

  return res.send(domain.asResponse);
}
