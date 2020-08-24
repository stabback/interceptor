import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { resourceModule } from '@client/store/resource';
import { RootState } from '@client/utils/store/resource-module';

Vue.use(Vuex);

const store: StoreOptions< RootState > = {
  state: {
    version: 1,
  },
  modules: {
    resource: resourceModule,
  },
};

export default new Vuex.Store(store);
