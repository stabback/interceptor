/* Manage condition */

import { Router } from 'express';

import userController from '@server/controllers/user/user.controller';
import { validateUser } from '@server/middleware';

const userRouter = Router();

userRouter.get('/', userController.getMany);
userRouter.post('/', userController.create);
userRouter.get('/:user', validateUser, userController.get);
userRouter.patch('/:user', validateUser, userController.update);
userRouter.delete('/:user', validateUser, userController.remove);

export default userRouter;
