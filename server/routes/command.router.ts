import { Router } from 'express';

import conditionRouter from './command/condition.router';
import domainRouter from './command/domain.router';
import interceptRouter from './command/intercept.router';
import responseRouter from './command/response.router';
import snapshotRouter from './command/snapshot.router';
import userRouter from './command/user.router';

const router = Router();

router.use('/intercept', interceptRouter);
router.use('/domain', domainRouter);
router.use('/response', responseRouter);
router.use('/user', userRouter);
router.use('/condition', conditionRouter);
router.use('/snapshot', snapshotRouter);

export default router;
