<template>
  <metainfo>
    <template #title="{ content }">{{
      content ? `${content}` : `SITE_NAME`
    }}</template>
  </metainfo>
  <div id="app" ref="app">
    <router-view></router-view>
  </div>
</template>
<script>
import { useMeta } from 'vue-meta';

export default {
  setup() {
    useMeta({
      title: 'GA4 Extension',
      htmlAttrs: { lang: 'en', amp: true },
    });
  },
};
</script>

<style lang="less">
@import './main.less';
@import './less/common.less';

#app {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  text-align: center;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-active {
      color: #42b983;
    }
  }
}
</style>
