import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService } from '@server/resources/domain';
import { Intercept, InterceptService } from '@server/resources/intercept';

export default function remove(req: ExpressRequest, res: ExpressResponse) {
  // Validation must be performed as middleware
  const intercept = InterceptService.get(req.params.intercept) as Intercept;

  InterceptService.remove(intercept.id);

  DomainService.items.forEach((domain) => {
    domain.removeIntercept(intercept.id);
  });

  DomainService.save();

  res.status(204).send();
}
