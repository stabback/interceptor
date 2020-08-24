import { generateModule } from '@client/utils/store/generate-module';
import { Resource, ResourceName, PatchOperation } from '@definitions';
import { UserData } from '@server/resources/user';
import { Module } from 'vuex';
import { ResourceState, RootState } from '@client/utils/store/resource-module';

export type User = Resource< ResourceName.user, UserData >;
export type UserState = ResourceState< User >;

const baseModule = generateModule< User >('user');

export const userModule: Module< UserState, RootState > = {
  ...baseModule,
  actions: {
    ...baseModule.actions,

    selectResponse({ dispatch }, payload: {
            intercept: string;
            response: string;
            user: string;
        }) {
      const operation: PatchOperation = {
        path: `/data/intercepts/${payload.intercept}`,
        op: 'replace',
      };

      if (payload.response !== 'USE_DEFAULT') {
        operation.value = payload.response;
      } else {
        operation.op = 'remove';
      }

      return dispatch('update', {
        identifier: payload.user,
        operations: [operation],
      });
    },
  },
};
