/* Manage condition */

import { Router } from 'express';

import conditionController from '@server/controllers/condition/condition.controller';
import interceptController from '@server/controllers/intercept/intercept.controller';
import responseController from '@server/controllers/response/response.controller';

const interceptRouter = Router();

interceptRouter.get('/', interceptController.getMany);
interceptRouter.post('/', interceptController.create);
interceptRouter.get('/:intercept', interceptController.get);
interceptRouter.delete('/:intercept', interceptController.remove);
interceptRouter.patch('/:intercept', interceptController.update);
interceptRouter.get('/:intercept/condition', conditionController.getMany);
interceptRouter.get('/:intercept/response', responseController.getMany);

export default interceptRouter;
