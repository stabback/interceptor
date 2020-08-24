/* Manage condition */

import { Router } from 'express';

import domainController from '@server/controllers/domain/domain.controller';
import interceptController from '@server/controllers/intercept/intercept.controller';

import {
  validateDomain,
} from '@server/middleware';

const domainRouter = Router();

domainRouter.get('/', domainController.getMany);
domainRouter.post('/', domainController.create);
domainRouter.get('/:domain', validateDomain, domainController.get);
domainRouter.delete('/:domain', validateDomain, domainController.remove);
domainRouter.patch('/:domain', validateDomain, domainController.update);
domainRouter.get('/:domain/intercept', validateDomain, interceptController.getMany);

export default domainRouter;
