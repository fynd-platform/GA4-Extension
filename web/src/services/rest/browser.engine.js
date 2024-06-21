import axios from 'axios';
import { isBrowser } from 'browser-or-node';
import { getCompany, transformRequestOptions } from '../../helper/utils';
import { LocalStorageService } from '../local-storage.service';

axios.defaults.withCredentials = true;

const axiosMisc = axios.create({
  withCredentials: false,
});
const engine = {};
const getHeaders = (headers, hasContent = true) => {
  return {
    ...(hasContent ? { 'Content-Type': 'application/json' } : {}),
    'x-company-id': getCompany(),
    ...headers,
  };
};
engine.head = function (url, opt) {
  return axios.head(url, {
    headers: getHeaders(opt.headers, false),
    params: opt.params,
    paramsSerializer: params => {
      return transformRequestOptions(params);
    },
  });
};

engine.get = function (url, opt) {
  return axios.get(url, {
    params: opt.params,
    headers: getHeaders(opt.headers, false),
    paramsSerializer: params => {
      return transformRequestOptions(params);
    },
  });
};

engine.post = function (url, opt) {
  return axios.post(url, opt.data, {
    headers: getHeaders(opt.headers, false),
    params: opt.params,
  });
};

engine.put = function (url, opt) {
  return axios.put(url, opt.data, {
    headers: getHeaders(opt.headers, false),
    params: opt.params,
  });
};

engine.patch = function (url, opt) {
  return axios.patch(url, opt.data, {
    headers: getHeaders(opt.headers, false),
    params: opt.params,
  });
};

engine.del = function (url, opt) {
  return axios.delete(url, {
    data: opt.data,
    headers: getHeaders(opt.headers, false),
    params: opt.params,
  });
};

engine.getMisc = function (url, opt) {
  return axiosMisc.get(url, {
    params: opt.params,
    headers: getHeaders(opt.headers, false),
    paramsSerializer: params => {
      return transformRequestOptions(params);
    },
  });
};

engine.postMisc = function (url, opt) {
  return axiosMisc.post(url, opt.data, { headers: opt.headers });
};

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if ((error.response && error.response.status) === 401) {
      // Gets into infinite loop,Fix it.
      // AuthService.onUserLoggedOut();
      // eventHelper.forceLogout(error.request.responseURL);
      // analyticsHandler(fnTypes.RESET);
      if (isBrowser) {
        LocalStorageService.removeAll();
      }
    }
    return Promise.reject(error);
  }
);

export default engine;
