import { ResourceState } from './resource-module';

export function generateResourceState< Resource >(): ResourceState< Resource > {
  const items: {
        [key: string]: Resource;
    } = {};

  return {
    items,
    meta: {
      errors: [],
      failed: false,
      fetching: false,
      status: null,
    },
  };
}
