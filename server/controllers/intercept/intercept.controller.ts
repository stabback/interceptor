import create from './create.intercept.controller';
import get from './get.intercept.controller';
import getMany from './getMany.intercept.controller';
import remove from './remove.intercept.controller';
import update from './update.intercept.controller';

const interceptController = {
  create, get, getMany, remove, update,
};

export default interceptController;
