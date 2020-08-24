import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Domain, DomainService } from '@server/resources/domain';
import { ErrorService } from '@server/resources/error';
import { InterceptService } from '@server/resources/intercept';
import { validateRequiredParams } from '@server/utils';

export default function create(req: ExpressRequest, res: ExpressResponse) {
  const { name, domain: domainId } = req.body;

  const domain = DomainService.get(domainId) as Domain;

  if (!domain) {
    return res.status(400).send(ErrorService.buildPayload([
      ErrorService.create(
        'CREATE_INTERCEPT_INCORRECT_DOMAIN',
        'The supplied domain is not an ID',
      ),
    ]));
  }

  const conditions = req.body.conditions || [];
  const responses = req.body.responses || [];

  const errors = validateRequiredParams({ name }, 'CREATE_INTERCEPT_VALIDATION_ERROR', res);
  if (errors.length > 0) { return res; }

  const nameExists = domain.data.intercepts.some((i) => {
    const I = InterceptService.get(i);
    return (I && I.data.name === name);
  });

  if (nameExists) {
    return res.status(400).send(ErrorService.buildPayload([
      ErrorService.create(
        'CREATE_INTERCEPT_DUPLICATE_NAME',
        'Intercept names must be unique per domain',
      ),
    ]));
  }

  const intercept = InterceptService.create(name, conditions, responses);
  domain.addIntercept(intercept.id);
  DomainService.save();

  return res.status(201).send(intercept.asResponse);
}
