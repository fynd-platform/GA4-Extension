const TagModel = require('../models/Tag');

async function install(req) {
  // Write you code here to return initial launch url
  return req.extension.base_url;
}

async function auth(req) {
  // Write you code here to return initial launch url
  return `${req.extension.base_url}/company/${req.query.company_id}/application/${req.query.application_id}`;
}

async function uninstall(req) {
  // Write your code here to cleanup data related to extension
  // If task is time taking then process it async on other process.

  const companyId = req.body.company_id;
  await TagModel.removeTagsByCompanyId(companyId);
}

module.exports = {
  install,
  auth,
  uninstall,
};
