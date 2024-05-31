import urlJoin from 'url-join';
// import { isNode } from "browser-or-node";
import root from 'window-or-global';

let envVars = root.env || {};

envVars.GA4_MAIN_URL = `${root.location.protocol}//${root.location.hostname}`;
if (
  root &&
  root.process &&
  root.process.env &&
  root.process.NODE_ENV === 'test'
) {
  envVars = root.process.env;
}

const Endpoints = {
  GET_ALL_APPLICATIONS() {
    return urlJoin(envVars.GA4_MAIN_URL, '/api/v1/applications');
  },
  TAG_MANAGER(applicationId = '') {
    return urlJoin(envVars.GA4_MAIN_URL, '/api/v1/tag-manager', applicationId);
  },
};

export default Endpoints;
