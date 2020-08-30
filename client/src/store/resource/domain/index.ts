import { generateModule } from '@client/utils/store/generate-module';
import { SerializedDomain } from '@server/resources/domain';
import { Module } from 'vuex';
import { ResourceState, RootState } from '@client/utils/store/resource-module';

export type Domain = SerializedDomain;
export type DomainState = ResourceState< Domain >;

const baseModule = generateModule< Domain >('domain');

export const domainModule: Module< DomainState, RootState > = {
  ...baseModule,
  actions: {
    ...baseModule.actions,

    async hydrate({ commit, dispatch, rootGetters }, domain: Domain) {
      commit('fetching');

      const interceptCalls = [];
      for (const intercept of domain.data.intercepts) {
        interceptCalls.push(
          // TODO rewrite this not to mix promises and async syntax
          // eslint-disable-next-line no-async-promise-executor
          new Promise(async (resolve) => {
            await dispatch('resource/intercept/get', intercept, { root: true });
            const i = rootGetters['resource/intercept/item'](intercept);
            await dispatch('resource/intercept/hydrate', i, { root: true });
            resolve();
          }),
        );
      }

      await Promise.all(interceptCalls);

      commit('fetched', { status: 200 });
    },
  },
};
