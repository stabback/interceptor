import { Router } from 'express';

import * as AdminController from '@server/controllers/admin';

const router = Router();

router.delete('/reset', AdminController.reset);
router.post('/hydrate', AdminController.hydrate);

export default router;
