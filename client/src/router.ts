import Vue from 'vue';
import Router from 'vue-router';
import multiguard from 'vue-router-multiguard';

import verifyDomain from '@client/guards/verify-domain';
import verifyUser from '@client/guards/verify-user';
import SetUser from '@client/views/SetUser.vue';

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      component: SetUser,
      name: 'set-user',
      path: '/',
    },
    {
      component: () => import(/* webpackChunkName: "help" */ './views/Help.vue'),
      name: 'help',
      path: '/help',
    },
    {
      component: () => import(/* webpackChunkName: "admin" */ './views/Admin.vue'),
      name: 'admin',
      path: '/admin',
    },
    {
      beforeEnter: verifyUser,
      component: () => import(/* webpackChunkName: "user" */ './views/User.vue'),
      name: 'user',
      path: '/:user',
    },
    {
      beforeEnter: multiguard([verifyUser, verifyDomain]),
      component: () => import(/* webpackChunkName: "domain" */ './views/Domain.vue'),
      name: 'domain',
      path: '/:user/:domain',
    },
  ],
});
