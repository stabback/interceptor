import { generateModule } from '@client/utils/store/generate-module';
import { Resource, ResourceName } from '@definitions';
import { ConditionData } from '@server/resources/condition';
import { Module } from 'vuex';
import { ResourceState, RootState } from '@client/utils/store/resource-module';

export type Condition = Resource< ResourceName.condition, ConditionData >;
export type ConditionState = ResourceState< Condition >;

const baseModule = generateModule< Condition >('condition');

export const conditionModule: Module< ConditionState, RootState> = {
  ...baseModule,
  actions: {
    ...baseModule.actions,

    async create(ctx, payload) {
      const item = await baseModule.actions.create(ctx, payload);
      await ctx.dispatch('resource/intercept/get', payload.intercept, { root: true });
      return item;
    },
  },
};
