<template>
  <div class="main-container">
    <!-- <ga-loader /> -->

    <div class="title-container">
      <span
        class="back-icon"
        :style="{
          visibility: $route.name === 'docs' ? 'visible' : 'hidden',
        }"
        @click="
          $router.push({
            name: 'application',
            params: { company_id: getCompanyId, id: getApplicationId },
          })
        "
      >
        <inline-svg src="arrow-down"></inline-svg>
      </span>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
// import { NitrozenBadge } from '@gofynd/nitrozen-vue';
// import loaderVue from "../../components/common/loader.vue";
import { getCompanyBasePath, getApplication, getCompany } from '@/helper/utils';
import inlineSvg from '@/components/common/inline-svg.vue';
import { useMeta } from 'vue-meta';

export default {
  components: {
    // "ga-loader": loaderVue,
    inlineSvg,
    // NitrozenBadge,
  },
  setup() {
    useMeta({ title: 'GA4 Extension' });
  },
  computed: {
    companyBaseRootPath() {
      return `${getCompanyBasePath(this.$route)}/`;
    },
    getApplicationId() {
      return getApplication();
    },
    getCompanyId() {
      return getCompany();
    },
  },
};
</script>

<style lang="less" scoped>
.main-container {
  padding: 25px 30px;
  width: 90%;
  margin: auto;
  border-radius: 8px;
  margin-top: 25px;
  background-color: white;
  @media @mobile {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  .title-container {
    display: flex;
    // position: fixed;
    width: 90%;
    align-items: center;
    background: @White;
    position: relative;
    @media @mobile {
      width: 100%;
    }
    .back-icon {
      cursor: pointer;
      transform: rotate(90deg);
      position: absolute;
      left: -30px;
      @media @mobile {
        left: -12px;
      }
    }
    .title {
      cursor: pointer;
      font-weight: 600;
      @media @mobile {
        width: 100%;
        text-align: center;
      }
      .version {
        margin-left: 10px;
      }
    }
  }
}
</style>
