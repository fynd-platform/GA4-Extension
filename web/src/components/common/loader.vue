<template>
  <div v-if="isLoading" class="loading">
    <img class="loader-gif" src="../../assets/loader.gif" />
    <div v-if="helperText">{{ helperText }}</div>
  </div>
</template>
<script>
export default {
  name: 'Loader',
  props: {
    helperText: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;

  .loader-gif {
    height: 100px;
  }
}
</style>
