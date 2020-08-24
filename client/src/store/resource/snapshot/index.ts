import { call } from '@client/utils/store/generate-actions';
import { generateModule } from '@client/utils/store/generate-module';
import { Resource, ResourceName } from '@definitions';
import { SnapshotData } from '@server/resources/snapshot';
import { Module } from 'vuex';
import { ResourceState, RootState } from '@client/utils/store/resource-module';

export type Snapshot = Resource< ResourceName.snapshot, SnapshotData >;
export type SnapshotState = ResourceState< Snapshot >;

const baseModule = generateModule< Snapshot >('snapshot');

export const snapshotModule: Module< SnapshotState, RootState > = {
  ...baseModule,
  actions: {
    ...baseModule.actions,

    async restore({ commit }, id: string) {
      console.log('Restoring', id);

      await call(
        commit,
        `/command/snapshot/${id}/restore`,
        { method: 'POST' },
      );

      // operation.path = `/data/snapshot/${id}/restore`;

      // return dispatch('update', {
      //     identifier: payload.user,
      //     operations: [ operation ],
      // });
    },
  },
};
