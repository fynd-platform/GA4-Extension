<template>
  <div class="application white-box">
    <div class="section-heading">
      <h3>Sales Channel</h3>
      <p>
        These are the sales channel where this extension is active or inactive
      </p>
    </div>
    <div class="input-bar">
      <NitrozenInput
        v-model="search"
        type="text"
        :show-search-icon="true"
        placeholder="Search Sales Channel"
        class="search"
      />
    </div>
    <div v-if="applications.items" class="card-container">
      <div v-for="(item, i) in filteredApplications" :key="i" class="card">
        <div class="card-box">
          <div v-if="item.logo && item.logo.secure_url" class="card-logo">
            <img :src="item.logo.secure_url" />
          </div>
          <div class="card-content">
            <h4>{{ item.name }}</h4>
            <p>{{ item.domain.name }}</p>
          </div>
          <div class="button-container">
            <button
              v-if="item.config && item.config.enabled"
              class="active_button"
            >
              Active
            </button>
            <!-- <button v-else class="inactive_button">Inactive</button> -->
            <div v-else></div>
            <div
              class="select-widget"
              @click="redirectToReviews(item.id, item.name)"
            >
              <inline-svg :src="'long-left-arrow'"></inline-svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NitrozenPagination
      v-if="applications.page"
      v-model="paginationConfig"
      :page-size-options="pageSizeOptions"
      class="paginationConfig"
      @change="getApplications"
    />
  </div>
</template>

<script>
import MainService from '@/services/main-service';
import {
  // NitrozenDropdown,
  NitrozenInput,
  NitrozenPagination,
  flatBtn,
} from '@gofynd/nitrozen-vue';
import { getCompany, setCompany } from '@/helper/utils';
import InlineSvg from '../../components/common/inline-svg.vue';

export default {
  name: 'ApplicationList',
  components: {
    // NitrozenDropdown,
    NitrozenInput,
    NitrozenPagination,
    InlineSvg,
  },
  directives: {
    flatBtn,
  },
  data() {
    return {
      filters: [{ text: 'All', value: 'all' }],
      search: '',
      selectedFilter: 'all',
      helperText: 'Loading...',
      applications: {
        items: [],
      },
      paginationConfig: {
        limit: 8,
        current: 0,
      },
      pageSizeOptions: [8, 16, 32, 64],
    };
  },
  computed: {
    filteredApplications() {
      return this.applications.items.filter(
        c => c.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      );
    },
  },
  mounted() {
    setCompany(this.$route.params.company_id);
    this.getApplications();
  },
  methods: {
    getApplications() {
      // this.$root.$emit("loading-start");

      return MainService.getApplications({
        page_size: this.paginationConfig.limit,
        page_no: this.paginationConfig.current,
      })
        .then(({ data }) => {
          this.applications = data;
          this.paginationConfig.current = data.page.current;
          this.paginationConfig.total = data.page.item_total;
          // this.$root.$emit("loading-end");
        })
        .catch(ex => {
          console.log(ex);
          this.$snackbar.global.showError('Failed to load sales channel list');
          this.pageError = true;
        })
        .finally(() => {
          // this.$root.$emit("loading-end");
        });
    },
    redirectToReviews(appId, appName) {
      this.$router.push({
        name: 'application',
        params: {
          company: getCompany(),
          id: appId,
          name: appName,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.white-box {
  margin: 24px;
  border-radius: 10px;
  padding: 24px;
  background-color: #fff;
}

.section-heading {
  h3 {
    margin-top: 0;
    font-style: normal;
    line-height: 28px;
    font-weight: 600;
    font-size: 20px;
    color: #41434c;
    margin-bottom: 15px;
  }
  p {
    margin-top: 0;
    font-size: 14px;
    margin-bottom: 20px;
    font-family: Inter, sans-serif;
    color: #666666;
  }
}

.input-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  .search {
    flex: 0.4;
  }
  .filter-input {
    cursor: pointer;
    width: 150px;
  }
}

.card-container {
  display: grid;
  grid-column-gap: 18px;
  grid-template-columns: 25% 25% 25% 25%;
  width: calc(100% - 54px);
  .card {
    margin-bottom: 24px;
    margin-top: 24px;
    .card-box {
      border: 1px solid #e4e5e6;
      border-radius: 10px;
      overflow: hidden;
      padding: 20px;
      background-color: #fff;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      transition: box-shadow 0.3s;
      &:hover {
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
      }

      .card-content {
        background-color: #fff;
        width: 100%;
        box-sizing: border-box;
        margin-top: 10px;
        h4 {
          margin: 0;
          margin-bottom: 5px;
          font-weight: 600;
          font-size: 15px;
          color: #41434c;
        }
        p {
          margin: 0;
          font-size: 12px;
          line-height: 1.5;
          color: #828282;
          font-family: Inter, sans-serif;
        }
      }
      .card-logo {
        min-height: 60px;
        img {
          max-width: 52px;
        }
      }
    }

    .button-container {
      width: 100%;
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .inactive_button {
        border: 1px solid #eb5757;
        background-color: transparent;
        color: #eb5757;
        width: 74px;
        text-transform: uppercase;
        height: 22px;
        font-family: Inter;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
      }

      .active_button {
        border: 1px solid #27ae60;
        border-radius: 4px;
        background-color: transparent;
        color: #27ae60;
        width: 74px;
        text-transform: uppercase;
        height: 22px;
        font-family: Inter;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
      }

      .select-widget {
        cursor: pointer;
        height: 35px;
        width: 35px;
        font-size: 15px;
        transform: rotate(180deg);
        padding: 6px 6px;
        display: block;
        border-radius: 20%;
        border: 1px solid #dedede;
        box-sizing: border-box;
      }
    }
  }
}
</style>
