/* Manage condition */

import { Router } from 'express';

import snapshotController from '@server/controllers/snapshot/snapshot.controller';
import { validateSnapshot } from '@server/middleware';

const snapshotRouter = Router();

snapshotRouter.post('/', snapshotController.create);
snapshotRouter.get('/', snapshotController.getMany);
snapshotRouter.get('/:snapshot', validateSnapshot, snapshotController.get);
snapshotRouter.delete('/:snapshot', validateSnapshot, snapshotController.remove);
snapshotRouter.post('/:snapshot/restore', validateSnapshot, snapshotController.restore);

export default snapshotRouter;
