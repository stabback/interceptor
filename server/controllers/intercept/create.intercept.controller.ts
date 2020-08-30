import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { DomainService } from '@server/resources/domain';
import { ServerErrorService } from '@server/resources/server-error';
import { InterceptService } from '@server/resources/intercept';
import { validateRequiredParams } from '@server/utils';

export default async function create(req: ExpressRequest, res: ExpressResponse) {
  const {
    name,
    conditions,
    responses,
    domain: domainId,
  } = req.body;

  const errors = await validateRequiredParams({ name }, 'CREATE_DOMAIN_VALIDATION_ERROR', res);
  if (errors.length > 0) { return res; }

  const intercept = await InterceptService.create(name, conditions, responses, false);

  const domain = await DomainService.getByIdentifier(domainId);

  if (!domain) {
    return res.status(400).send(
      await ServerErrorService.create(
        'CREATE_INTERCEPT_DOMAIN_NOT_FOUND',
        'The domain you are attempting to add an intercept to was not found',
      ),
    );
  }

  try {
    await domain.addIntercept(intercept);
  } catch (e) {
    return res.status(400).send(
      await ServerErrorService.create(
        'CREATE_INTERCEPT_COULD_NOT_ADD_TO_DOMAIN',
        e,
      ),
    );
  }

  await intercept.save();
  await domain.save();

  return res.status(201).send(intercept);
}
