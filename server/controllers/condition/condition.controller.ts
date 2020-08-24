import create from './create.condition.controller';
import get from './get.condition.controller';
import getMany from './getMany.condition.controller';
import remove from './remove.condition.controller';

const conditionController = {
  create, get, getMany, remove,
};

export default conditionController;
