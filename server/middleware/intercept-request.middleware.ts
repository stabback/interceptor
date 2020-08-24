import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ErrorService } from '@server/resources/error';

import { Domain, DomainService } from '@server/resources/domain';
import { InterceptService } from '@server/resources/intercept';
import { ResponseService } from '@server/resources/response';
import { User, UserService } from '@server/resources/user';

export default function (req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
  // Validation must be done in prior middlewares
  const user = UserService.getByKey(req.params.user) as User;
  const domain = DomainService.getByKey(req.params.domain) as Domain;
  const intercept = domain.data.intercepts.map(
    (id) => InterceptService.get(id),
  ).find(
    (m) => m && m.test(req),
  );

  res.setHeader('X-Interceptor-Domain', domain.id);
  res.setHeader('X-Interceptor-User', user.id);

  if (!intercept) {
    return next();
  }

  res.setHeader('X-Interceptor-Intercept', intercept.id);

  let responseId = '';
  if (user.data.intercepts[intercept.id]) {
    responseId = user.data.intercepts[intercept.id];
    res.setHeader('X-Interceptor-Response-Source', 'user');
  } else if (intercept.data.defaultResponse) {
    responseId = intercept.data.defaultResponse;
    res.setHeader('X-Interceptor-Response-Source', 'intercept-default');
  }

  if (responseId === '') {
    return next();
  }

  res.setHeader('X-Interceptor-Response', responseId);
  const response = ResponseService.get(responseId);

  if (!response) {
    return res.status(500).send(ErrorService.buildPayload([
      ErrorService.create(
        'CALL_MATCHED_INTERCEPT_MISSING_RESPONSE',
        `Request matched intercept ${intercept.id} and
                ${responseId} was to be returned, but could not be found.`,
      ),
    ]));
  }
  const r = response.send(res);
  return r;
}
