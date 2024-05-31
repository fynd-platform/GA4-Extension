/* eslint-disable */
import extensionRoutes from './extension';
import addCompanyID from './guard';

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  ...extensionRoutes,
  {
    name: 'application',
    path: '/company/:company_id/application/:id',
    beforeEnter: (to, from, next) => {
      addCompanyID(to, from, next);
    },
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "extensions" */
        '@/views/extensions/CompanyDetails.vue'
      ),
    meta: {
      name: 'APPLICATION_CONFIG',
    },
  },
  {
    path: '/*',
    component: () =>
      import(/* webpackChunkName: "not-found" */ '../views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
