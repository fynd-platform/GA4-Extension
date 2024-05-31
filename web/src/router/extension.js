// const { addCompanyID } = require('./guard');

module.exports = [
  {
    name: 'company-base',
    path: '/company/:company_id',
    // beforeEnter: (to, from, next) => {
    //   // next()
    //   addCompanyID(to, from, next);
    // },
    component: () =>
      import(
        /* webpackChunkName: "extensions" */
        '@/views/extensions/Main.vue'
      ),
    children: [
      // {
      //   name:"details",
      //   path: 'details',
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "extensions" */
      //       '@/views/extensions/Details.vue'
      //     ),
      // },
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
