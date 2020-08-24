import create from './create.response.controller';
import get from './get.response.controller';
import getMany from './getMany.response.controller';
import remove from './remove.response.controller';

const responseController = {
  create, get, getMany, remove,
};

export default responseController;
