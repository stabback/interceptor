import { generateModule } from '@client/utils/store/generate-module';
import { Resource, ResourceName } from '@definitions';
import { InterceptData } from '@server/resources/intercept';
import { Module } from 'vuex';
import { ResourceState, RootState } from '@client/utils/store/resource-module';

export type Intercept = Resource< ResourceName.intercept, InterceptData >;
export type InterceptState = ResourceState< Intercept >;

const baseModule = generateModule< Intercept >('intercept');

export const interceptModule: Module< InterceptState, RootState > = {
  ...baseModule,
  actions: {
    ...baseModule.actions,

    async create(ctx, payload) {
      const item = await baseModule.actions.create(ctx, payload);
      await ctx.dispatch('resource/domain/get', payload.domain, { root: true });
      return item;
    },

    async hydrate({ commit, dispatch }, intercept: Intercept) {
      commit('fetching');

      const responseCalls = [];
      for (const response of intercept.data.responses) {
        responseCalls.push(
          dispatch('resource/response/get', response, { root: true }),
        );
      }

      const conditionCalls = [];
      for (const condition of intercept.data.conditions) {
        conditionCalls.push(
          dispatch('resource/condition/get', condition, { root: true }),
        );
      }

      await Promise.all([
        ...responseCalls,
        ...conditionCalls,
      ]);

      commit('fetched', { status: 200 });
    },
  },
};
