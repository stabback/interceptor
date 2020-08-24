import { generateModule } from '@client/utils/store/generate-module';
import { Resource, ResourceName } from '@definitions';
import { ResponseData } from '@server/resources/response';
import { Module } from 'vuex';
import { ResourceState, RootState } from '@client/utils/store/resource-module';

export type Response = Resource< ResourceName.response, ResponseData >;
export type ResponseState = ResourceState< Response >;

const baseModule = generateModule< Response >('response');

export const responseModule: Module<ResponseState, RootState> = {
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
