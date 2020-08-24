import { NavigationGuardNext, Route } from 'vue-router';
import store from '../store';

export default async (to: Route, from: Route, next: NavigationGuardNext) => {
  const userKey = to.params.user;

  if (store.getters['resource/user/itemByData']('key', userKey)) {
    next();
    return;
  }

  await store.dispatch('resource/user/get', userKey);

  if (store.getters['resource/user/failed']) {
    next({
      name: 'set-user', replace: true,
    });
  } else {
    next();
  }
};
