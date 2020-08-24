// Allow param reassign in mutations
/* eslint-disable no-param-reassign */

import { BaseResource } from '@definitions';
import Vue from 'vue';
import { ResourceMutations } from './resource-module';

export function generateMutations< Resource extends BaseResource >():
  ResourceMutations<Resource> {
  return {
    remove(s, id: string) {
      Vue.delete(s.items, id);
    },
    saveItem(s, item: Resource) {
      Vue.set(s.items, item.id, item);
    },
    saveItems(s, items: Resource[]) {
      items.forEach((item) => {
        Vue.set(s.items, item.id, item);
      });
    },
    removeAll(s) {
      s.items = {};
    },
    fetching(s) {
      s.meta.fetching = true;
      s.meta.failed = false;
      s.meta.status = null;
      s.meta.errors = [];
    },
    fetched(s, payload: { status: number }) {
      s.meta.fetching = false;
      s.meta.status = payload.status;
    },
    failed(s, payload: { status: number; errors: string[] }) {
      s.meta.fetching = false;
      s.meta.failed = true;
      s.meta.status = payload.status;
      s.meta.errors = payload.errors || [];
    },
  };
}
