/* Manage condition */

import { Router } from 'express';

import userController from '@server/controllers/user/user.controller';

const userRouter = Router();

userRouter.get('/', userController.getMany);
userRouter.post('/', userController.create);
userRouter.get('/:user', userController.get);
userRouter.patch('/:user', userController.update);
userRouter.delete('/:user', userController.remove);

export default userRouter;
