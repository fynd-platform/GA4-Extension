/* eslint-disable */
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import { createMetaManager } from 'vue-meta';

import NitrozenVuePlugin from './snackbar';

const app = createApp(App);
const metaManager = createMetaManager();

app.use(store);
app.use(router);
app.use(metaManager);
app.use(NitrozenVuePlugin);

app.mount('#app');

//add sentry
// import * as Sentry from "@sentry/browser";
// import { Vue as VueIntegration } from "@sentry/integrations";
// const { sentry } = root.env;
// if (sentry.dsn) {
//   // TODO: need to fix once sentry support Vue 3
//   app.config = {
//     errorHandler: error => {
//       Sentry.captureException(error);
//     }
//   };
//   Sentry.init({
//     dsn: sentry.dsn,
//     environment: sentry.environment,
//     integrations: [new VueIntegration({ Vue: app, attachProps: true })]
//   });
// }
