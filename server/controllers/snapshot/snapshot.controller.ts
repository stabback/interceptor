import create from './create.snapshot.controller';
import get from './get.snapshot.controller';
import getMany from './getMany.snapshot.controller';
import remove from './remove.snapshot.controller';
import restore from './restore.snapshot.controller';

const snapshotController = {
  create, get, getMany, remove, restore,
};

export default snapshotController;
