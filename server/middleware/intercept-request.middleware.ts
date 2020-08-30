import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import {
  DomainService,
} from '@server/resources/domain';
import { InterceptDocument } from '@server/resources/intercept';
import { ResponseService } from '@server/resources/response';
import { UserService } from '@server/resources/user';
import { Types } from 'mongoose';

export default async function (req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
  // Get the user
  const user = await UserService.getByIdentifier(req.params.user);
  if (!user) {
    return res.status(404).send();
  }
  res.setHeader('X-Interceptor-User', user.id);


  // Get the domain
  const domain = await DomainService.getByIdentifier(req.params.domain);
  if (!domain) {
    return res.status(404).send();
  }
  res.setHeader('X-Interceptor-Domain', domain.id);


  // Find the first intercept that matches this request
  domain.populate('intercepts');
  await domain.execPopulate();

  const intercepts = domain.intercepts as InterceptDocument[];

  const intercept = intercepts.find(
    async (thisIntercept) => {
      if (thisIntercept) {
        const result = await thisIntercept.test(req);
        return result;
      }
      return false;
    },
  );

  if (!intercept) {
    return next();
  }

  res.setHeader('X-Interceptor-Intercept', intercept.id);


  // Select the response to return
  let response;

  // Check if the user has selected a response already
  const userSetting = user.intercepts ? user.intercepts[intercept.id] : null;

  if (userSetting) {
    response = await ResponseService.get(userSetting as Types.ObjectId);
    if (response) {
      res.setHeader('X-Interceptor-Response-Source', 'user');
    }
  }

  // If not, check if there is a default response
  if (!response && intercept.defaultResponse) {
    response = await ResponseService.get(intercept.defaultResponse as Types.ObjectId);
    if (response) {
      res.setHeader('X-Interceptor-Response-Source', 'intercept-default');
    }
  }

  // If not, pass the response through
  if (!response) {
    return next();
  }

  res.setHeader('X-Interceptor-Response', response.id);

  return response.send(res);
}
