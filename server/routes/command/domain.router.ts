/* Manage condition */

import { Router } from 'express';

import domainController from '@server/controllers/domain/domain.controller';
import interceptController from '@server/controllers/intercept/intercept.controller';

const domainRouter = Router();

domainRouter.get('/', domainController.getMany);
domainRouter.post('/', domainController.create);
domainRouter.get('/:domain', domainController.get);
domainRouter.delete('/:domain', domainController.remove);
domainRouter.patch('/:domain', domainController.update);
domainRouter.get('/:domain/intercept', interceptController.getMany);

export default domainRouter;
