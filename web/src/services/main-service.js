/* eslint-disable */
'use strict';

import ApiService from './api.service';
import URLS from './domain.service';

const MainService = {
  getApplications(params = {}) {
    const options = {
      params: params,
    };
    return ApiService.get(URLS.GET_ALL_APPLICATIONS(), options);
  },
  getTagConfig(application_id, params = {}) {
    const options = {
      params: params,
    };
    return ApiService.get(URLS.TAG_MANAGER(application_id), options);
  },
  saveTagConfig(data) {
    const options = {
      data: data,
    };
    return ApiService.put(URLS.TAG_MANAGER(), options);
  },
  deleteTagConfig(data) {
    const options = {
      data: data,
    };
    return ApiService.del(URLS.TAG_MANAGER(), options);
  },
};

export default MainService;
