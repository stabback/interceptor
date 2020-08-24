/* Manage condition */

import { Router } from 'express';

import conditionController from '@server/controllers/condition/condition.controller';

import {
  validateCondition, validateIntercept,
} from '@server/middleware';

const conditionRouter = Router();

conditionRouter.get('/', conditionController.getMany);
conditionRouter.post('/', validateIntercept, conditionController.create);
conditionRouter.get('/:condition', validateCondition, conditionController.get);
conditionRouter.delete('/:condition', validateCondition, conditionController.remove);

export default conditionRouter;
