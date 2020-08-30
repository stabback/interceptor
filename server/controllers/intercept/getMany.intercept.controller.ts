import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService } from '@server/resources/domain';
import { InterceptService } from '@server/resources/intercept';
import { ServerErrorService } from '@server/resources/server-error';

export default async function getMany(req: ExpressRequest, res: ExpressResponse) {
  let intercepts;

  if (req.params.domain) {
    let domain;
    try {
      domain = await DomainService.getByIdentifier(req.params.domain);
    } catch (e) {
      return res.status(400).send(
        await ServerErrorService.create(
          'GET_INTERCEPTS_BY_DOMAIN_BAD_ID',
          'The id provided for the domain is not valid',
        ),
      );
    }

    if (!domain) {
      return res.status(404).send();
    }
    domain.populate('intercepts');
    await domain.execPopulate();

    intercepts = domain.intercepts;
  } else {
    intercepts = await InterceptService.getAll();
  }

  return res.send({ items: intercepts });
}
