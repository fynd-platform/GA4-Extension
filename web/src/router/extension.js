module.exports = [
  {
    name: 'company-base',
    path: '/company/:company_id',
    component: () =>
      import(
        /* webpackChunkName: "extensions" */
        '@/views/extensions/Main.vue'
      ),
    children: [
      {
        name: 'docs',
        path: 'docs',
        component: () =>
          import(
            /* webpackChunkName: "extensions" */
            '@/views/extensions/Docs.vue'
          ),
      },
    ],
    redirect: '/company/:company_id/docs',
  },
];
