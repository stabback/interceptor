import { Module } from 'vuex';

import { RootState } from '@client/utils/store/resource-module';
import { conditionModule } from './condition';
import { domainModule } from './domain';
import { interceptModule } from './intercept';
import { responseModule } from './response';
import { snapshotModule } from './snapshot';
import { userModule } from './user';
import { ResourceModuleState } from './ResourceModuleState';

export const resourceModule: Module< ResourceModuleState, RootState > = {
  namespaced: true,
  modules: {
    condition: conditionModule,
    domain: domainModule,
    intercept: interceptModule,
    response: responseModule,
    snapshot: snapshotModule,
    user: userModule,
  },
};
