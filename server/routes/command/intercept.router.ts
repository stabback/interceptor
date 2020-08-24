/* Manage condition */

import { Router } from 'express';

import conditionController from '@server/controllers/condition/condition.controller';
import interceptController from '@server/controllers/intercept/intercept.controller';
import responseController from '@server/controllers/response/response.controller';

import {
  validateDomain, validateIntercept,
} from '@server/middleware';

const interceptRouter = Router();

interceptRouter.get('/', interceptController.getMany);
interceptRouter.post('/', validateDomain, interceptController.create);
interceptRouter.get('/:intercept', validateIntercept, interceptController.get);
interceptRouter.delete('/:intercept', validateIntercept, interceptController.remove);
interceptRouter.patch('/:intercept', validateIntercept, interceptController.update);
interceptRouter.get('/:intercept/condition', validateIntercept, conditionController.getMany);
interceptRouter.get('/:intercept/response', validateIntercept, responseController.getMany);

export default interceptRouter;
