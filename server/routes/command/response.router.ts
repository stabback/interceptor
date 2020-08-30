/* Manage condition */

import { Router } from 'express';

import responseController from '@server/controllers/response/response.controller';

const responseRouter = Router();

responseRouter.get('/', responseController.getMany);
responseRouter.post('/', responseController.create);
responseRouter.get('/:response', responseController.get);
responseRouter.delete('/:response', responseController.remove);

export default responseRouter;
