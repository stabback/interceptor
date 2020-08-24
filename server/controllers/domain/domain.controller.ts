import create from './create.domain.controller';
import get from './get.domain.controller';
import getMany from './getMany.domain.controller';
import remove from './remove.domain.controller';
import update from './update.domain.controller';

const domainController = {
  create,
  get,
  getMany,
  remove,
  update,
};

export default domainController;
