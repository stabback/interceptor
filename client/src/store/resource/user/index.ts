import { generateModule } from '@client/utils/store/generate-module';

import { Module } from 'vuex';
import { ResourceState, RootState } from '@client/utils/store/resource-module';
import { SerializedUser } from '@server/resources/user';
import { ReplaceOperation, RemoveOperation } from 'fast-json-patch';

export type User = SerializedUser;
export type UserState = ResourceState<User>;

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
      const path = `/intercepts/${payload.intercept}`;
      let operation: ReplaceOperation<string> | RemoveOperation;

      if (payload.response !== 'USE_DEFAULT') {
        operation = {
          path,
          value: payload.response,
          op: 'replace',
        };
      } else {
        operation = {
          op: 'remove',
          path,
        };
      }

      return dispatch('update', {
        identifier: payload.user,
        operations: [operation],
      });
    },
  },
};
