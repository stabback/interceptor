/* Manage condition */

import { Router } from 'express';

import responseController from '@server/controllers/response/response.controller';

import {
  validateIntercept, validateResponse,
} from '@server/middleware';

const responseRouter = Router();

responseRouter.get('/', responseController.getMany);
responseRouter.post('/', validateIntercept, responseController.create);
responseRouter.get('/:response', validateResponse, responseController.get);
responseRouter.delete('/:response', validateResponse, responseController.remove);

export default responseRouter;
