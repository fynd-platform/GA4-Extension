import { isNode } from 'browser-or-node';
import { setCompany, setApplication } from '@/helper/utils';

const addCompanyID = (to, from, next) => {
  if (isNode) {
    return next();
  }
  const { params } = to;
  if (params.company_id) {
    setCompany(params.company_id);
  }
  if (params.id) {
    setApplication(params.id);
  }
  return next();
};
export default addCompanyID;
