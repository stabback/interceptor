/* Manage condition */

import { Router } from 'express';

import conditionController from '@server/controllers/condition/condition.controller';

const conditionRouter = Router();

conditionRouter.get('/', conditionController.getMany);
conditionRouter.post('/', conditionController.create);
conditionRouter.get('/:condition', conditionController.get);
conditionRouter.delete('/:condition', conditionController.remove);

export default conditionRouter;
