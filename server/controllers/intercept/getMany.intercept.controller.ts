import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Domain, DomainService } from '@server/resources/domain';
import { InterceptService } from '@server/resources/intercept';

export default function getMany(req: ExpressRequest, res: ExpressResponse) {
  let intercepts = InterceptService.items;

  if (req.params.domain) {
    const domain = (
            DomainService.get(req.params.domain) || DomainService.getByKey(req.params.domain)
        ) as Domain;

    intercepts = intercepts.filter((intercept) => domain.data.intercepts.includes(intercept.id));
  }

  res.send(InterceptService.buildPayload(intercepts));
}
