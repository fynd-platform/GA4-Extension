import MainService from '../../services/main-service';
import ApiService from '../../services/api.service';
import URLS from '../../services/domain.service';

jest.mock('../../services/api.service');
jest.mock('../../services/domain.service');

describe('MainService Test Suite', () => {
  const applicationId = '123';
  const getAllApplication =
    'https://ga4.extensions.fynd.com/api/v1/applications';
  const tagService = 'https://ga4.extensions.fynd.com/api/v1/tag-manager/';

  beforeEach(() => {
    URLS.GET_ALL_APPLICATIONS.mockReturnValue(getAllApplication);
    URLS.TAG_MANAGER.mockReturnValue(`${tagService}${applicationId}`);
  });

  it('calls ApiService.get with correct URL and params for getApplications', async () => {
    const params = { key: 'value' };

    await MainService.getApplications(params);
    expect(ApiService.get).toHaveBeenCalledWith(getAllApplication, { params });
  });

  it('calls ApiService.get with correct URL and params for getTagConfig', async () => {
    const params = { key: 'value' };

    await MainService.getTagConfig(applicationId, params);
    expect(ApiService.get).toHaveBeenCalledWith(
      `${tagService}${applicationId}`,
      { params }
    );
  });

  it('calls ApiService.put with correct URL and data for saveTagConfig', async () => {
    const data = { tag: 'new-tag' };

    await MainService.saveTagConfig(data);
    expect(ApiService.put).toHaveBeenCalledWith(
      `${tagService}${applicationId}`,
      { data }
    );
  });

  it('calls ApiService.del with correct URL and data for deleteTagConfig', async () => {
    const data = { tag: 'delete-tag' };

    await MainService.deleteTagConfig(data);
    expect(ApiService.del).toHaveBeenCalledWith(
      `${tagService}${applicationId}`,
      { data }
    );
  });

  it('calls ApiService.get with correct URL and empty params for getApplications when no params are passed', async () => {
    await MainService.getApplications();
    expect(ApiService.get).toHaveBeenCalledWith(getAllApplication, {
      params: {},
    });
  });

  it('calls ApiService.get with correct URL and empty params for getTagConfig when no params are passed', async () => {
    await MainService.getTagConfig(applicationId);
    expect(ApiService.get).toHaveBeenCalledWith(
      `${tagService}${applicationId}`,
      { params: {} }
    );
  });
});
