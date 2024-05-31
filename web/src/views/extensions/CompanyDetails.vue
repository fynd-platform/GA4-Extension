<template>
  <div>
    <div class="application-header">
      <div
        class="title"
        @click.stop="$router.push({ path: companyBaseRootPath })"
      >
        Home
      </div>
      <div class="separator">></div>
      <!-- <div class="title selected">
        {{ $route.params.name }}
      </div> -->
    </div>
    <ga-loader :is-loading="isLoading" />
    <div class="toggel-container">
      <div class="header">
        <div class="head">
          <h1>Google Analytics</h1>
          <p>Connect your google analytics.</p>
        </div>
        <div class="toggel">
          <span> {{ application_status ? 'Active' : 'Inactive' }}</span>
          <nitrozen-toggle-btn
            v-model="application_status"
            class="pad-right"
            @change="onToggel"
          ></nitrozen-toggle-btn>
        </div>
      </div>
      <div class="moreinfo">
        <p>
          More information about the google analytics and a link to full
          documentation
          <span class="gotodocs" @click="$router.push({ name: 'docs' })"
            >click here</span
          >
        </p>
      </div>

      <div class="suggestion">
        <div class="icon">
          <inline-svg :src="'warning'"></inline-svg>
        </div>
        <p>
          The APP_ID for your Google Analytics account is available on the
          Google Analytics Dashboard in **Settings > App Settings > Account
          Settings > APP ID**.
        </p>
      </div>
      <div class="input-section">
        <div class="head">Enter Google Analytics Property ID</div>
        <div>
          <nitrozen-input
            v-model="tagConfig.ga_id"
            placeholder="Enter Property ID"
            @input="validateGA()"
          ></nitrozen-input>
          <p v-if="showGAError" class="error">Invalid Property ID</p>
          <!-- <div class="divider btn-divider" /> -->
        </div>
      </div>
      <div class="save-btn" @click="onSave">
        <nitrozen-button
          v-strokeBtn
          theme="secondary"
          size="small"
          @click.stop="$router.push({ path: companyBaseRootPath })"
          >Cancel</nitrozen-button
        >
        <nitrozen-button
          v-if="initialstate"
          v-flatBtn
          disabled
          theme="secondary"
          state
          >Save</nitrozen-button
        >
        <nitrozen-button v-else v-flatBtn theme="secondary" state
          >Save</nitrozen-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  NitrozenInput,
  NitrozenButton,
  NitrozenToggleBtn,
  flatBtn,
  strokeBtn,
} from '@gofynd/nitrozen-vue';
import { getCompanyBasePath } from '@/helper/utils';
import InlineSvg from '../../components/common/inline-svg.vue';
import MainService from '../../services/main-service';
import loaderVue from '../../components/common/loader.vue';

export default {
  components: {
    NitrozenToggleBtn,
    NitrozenInput,
    NitrozenButton,
    InlineSvg,
    'ga-loader': loaderVue,
  },
  directives: {
    flatBtn,
    strokeBtn,
  },
  props: ['id', 'company'],
  data() {
    return {
      tagConfig: {},
      showGAError: false,
      create: false,
      application_status: false,
      initialstate: true,
      saving: false,
      isLoading: false,
    };
  },
  computed: {
    companyBaseRootPath() {
      return `${getCompanyBasePath(this.$route)}/`;
    },
  },

  async mounted() {
    // this.$root.$emit("loading-start");
    this.isLoading = true;
    const tagconfig = await MainService.getTagConfig(this.id);
    if (tagconfig.data) {
      this.tagConfig = tagconfig.data;
      this.application_status = tagconfig.data.enabled;
    }
    // this.$root.$emit("loading-end");
    this.isLoading = false;
  },

  methods: {
    onSave() {
      if (!this.initialstate) {
        this.tagConfig.ga_id = this.tagConfig.ga_id?.trim();
        if (this.showGAError || this.tagConfig.ga_id?.length < 7) {
          this.validateGA();
          this.initialstate = true;
          return;
        }
        this.showGAError = false;

        this.tagConfig.application = this.id;
        if (this.application_status === false) {
          this.tagConfig.enabled = false;
        } else {
          this.tagConfig.enabled = true;
        }
        // this.$root.$emit("loading-start");
        this.isLoading = true;
        MainService.saveTagConfig(this.tagConfig)
          .then(({ data }) => {
            this.tagConfig = data;
            this.$snackbar.global.showSuccess(`Data saved successfully`);
            this.create = false;
            this.initialstate = !this.initialstate;
          })
          .catch(err => {
            this.$snackbar.global.showError('Failed to save data');
            console.log(err, err.response);
          })
          .finally(() => {
            // this.$root.$emit("loading-end");
            this.isLoading = false;
          });
      }
    },
    onToggel() {
      this.initialstate = false;
    },
    // goToCustomScript() {
    //   this.$router.push({
    //     name: "custom-event",
    //     params: {
    //       selected_application: this.id,
    //     },
    //   });
    // },

    validateGA() {
      this.tagConfig.ga_id = this.tagConfig.ga_id?.trim();
      const regex = /^(G|UA|YT|MO)-[a-zA-Z0-9-]+$/;
      this.showGAError = !regex.test(this.tagConfig.ga_id);
      if (this.showGAError) {
        this.initialstate = true;
      } else {
        this.initialstate = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.application-header {
  display: flex;
  font-size: 16px;
  color: #828282;
  padding: 15px;
  padding-top: 25px;

  .title {
    padding: 0px 10px;
    cursor: pointer;
    opacity: 0.3;
  }

  .separator {
    opacity: 0.3;
  }

  .selected {
    color: #575454;
    opacity: 1;
  }
}
.toggel-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  margin: 30px 267px;
  gap: 24px;
  background: #ffffff;
  border-radius: 12px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;
  h1 {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #333333;
  }
  p {
    font-weight: 400;
    font-size: 16px;
    line-height: 17px;
    color: #666666;
  }
}
.toggel {
  display: flex;
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 140%;
    color: #333333;
  }
}
.moreinfo {
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #666666;
}
.customevent,
.gotodocs {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
  .p {
    display: inline;
  }
}
.suggestion {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px;
  gap: 10px;
  background: #e7eeff;
  border-radius: 4px;
  p {
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #666666;
  }
}
.input-section {
  display: flex;
  flex-direction: column;
  padding: 0px;
  gap: 8px;
  .head {
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    color: #4f4f4f;
  }
}
.save-btn {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn-divider {
  margin: 25px 0;
}
.error {
  margin-top: 10px;
  color: red;
  font-size: 12px;
}
</style>
