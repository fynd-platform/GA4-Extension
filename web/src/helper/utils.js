let companyId = null;
let applicationId = null;

export const transformRequestOptions = params => {
  let options = '';
  let isNested = false;

  Object.keys(params).forEach(key => {
    if (typeof params[key] !== 'object' && params[key]) {
      const encodeVal = encodeURIComponent(params[key]);
      options += `${key}=${encodeVal}&`;
    } else if (Array.isArray(params[key])) {
      params[key].forEach(el => {
        const encodeVal = encodeURIComponent(el);
        options += `${key}=${encodeVal}&`;
      });
    } else if (typeof params[key] === 'object' && params[key]) {
      options += transformRequestOptions(params[key]);
      isNested = true;
    }
  });

  return options && !isNested ? options.slice(0, -1) : options;
};

export const setCompany = passedCompanyId => {
  companyId = passedCompanyId;
};

export const getCompany = () => {
  return companyId;
};

export const setApplication = passedApplicationId => {
  applicationId = passedApplicationId;
};

export const getApplication = () => {
  return applicationId;
};

export const getCompanyBasePath = route => {
  return `/company/${route.params.company_id || getCompany()}/application/${route.params.id || getApplication()}`;
};

export const API_KEY = {
  local: '60d02603a3477b814707ae29',
  x0: '60c9db1872546aee6a00b608',
  fyndx1: '60ddb84cc100822335ad5b90',
  jiox2: '62385dc5bcf27811c3795036',
  jioecomm: '624bf1bfc2d02e530870f714',
};
