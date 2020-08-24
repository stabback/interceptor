import { BaseResource } from '@definitions';
import { ResourceGetters } from './resource-module';

export function generateGetters<Resource extends BaseResource>(): ResourceGetters<Resource> {
  return {
    errors: (s) => s.meta.errors,
    failed: (s) => s.meta.failed,
    fetching: (s) => s.meta.fetching,
    item: (s) => (id) => s.items[id],
    itemByData: (s) => (key, value) => Object.values(s.items).find(
      (item) => item.data[key] === value,
    ),
    items: (s) => Object.values(s.items),
  };
}
