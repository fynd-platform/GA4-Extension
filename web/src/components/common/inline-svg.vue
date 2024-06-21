<template>
  <span class="inline-svg" v-html="getSVG"></span>
</template>
<script>
import __SVG from '../../assets/svgs';

export default {
  name: 'Inlinesvg',
  props: {
    src: { type: String, required: true },
  },
  computed: {
    getSVG() {
      return __SVG[this.src];
    },
  },
};
</script>

<style lang="less" scoped>
.inline-svg {
  .flex-center();
}
</style>
