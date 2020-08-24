import { Route, NavigationGuardNext } from 'vue-router';
import store from '../store';

export default async (to: Route, from: Route, next: NavigationGuardNext) => {
  const domainKey = to.params.domain;

  if (store.getters['resource/domain/itemByData']('key', domainKey)) {
    next();
    return;
  }

  await store.dispatch('resource/domain/get', domainKey);

  if (store.getters['resource/domain/failed']) {
    next({
      name: 'user',
      params: {
        user: to.params.user,
      },
      replace: true,
    });
  } else {
    next();
  }
};
