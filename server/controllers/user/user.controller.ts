import create from './create.user.controller';
import get from './get.user.controller';
import getMany from './getMany.user.controller';
import remove from './remove.user.controller';
import update from './update.user.controller';

const userController = {
  create, get, getMany, remove, update,
};

export default userController;
