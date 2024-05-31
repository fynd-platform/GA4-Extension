import axios from 'axios';
import engine from '../../../services/rest/browser.engine';

jest.mock('axios', () => {
  const originalAxios = jest.requireActual('axios');
  const mockAxios = {
    ...originalAxios,
    defaults: { withCredentials: true },
    create: jest.fn().mockReturnThis(),
    get: jest.fn(),
    post: jest.fn(),
    head: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
  return mockAxios;
});

jest.mock('../../../helper/utils', () => ({
  ...jest.requireActual('../../../helper/utils'),
  getCompany: jest.fn(() => '1'),
  transformRequestOptions: jest.fn(
    params => `transformed=${JSON.stringify(params)}`
  ),
}));

jest.mock('../../../services/local-storage.service', () => ({
  LocalStorageService: {
    removeAll: jest.fn(),
  },
}));

jest.mock('browser-or-node', () => ({
  isBrowser: true,
}));

describe('HTTP Engine Test Suite', () => {
  const url = 'https://test.com/data';

  let options;

  beforeEach(() => {
    jest.clearAllMocks();
    options = {
      params: { query: 'test' },
      headers: { 'Custom-Header': 'value' },
    };
  });

  it('should correctly call axios.get with transformed options', async () => {
    await engine.get(url, options);

    expect(axios.get).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        params: options.params,
        headers: expect.objectContaining({
          'x-company-id': '1',
          'Custom-Header': 'value',
        }),
      })
    );
  });

  it('should correctly call axios.post with transformed options', async () => {
    options = {
      ...options,
      params: { query: 'test' },
    };

    await engine.post(url, options);

    expect(axios.post).toHaveBeenCalledWith(
      url,
      options.data,
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-company-id': '1',
          'Custom-Header': 'value',
        }),
        params: options.params,
      })
    );
  });

  it('should correctly call axiosMisc.get with transformed options', async () => {
    await engine.getMisc(url, options);
    const axiosMiscGet = axios.create().get;
    expect(axiosMiscGet).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        params: options.params,
        headers: expect.objectContaining({
          'Custom-Header': 'value',
          'x-company-id': '1',
        }),
      })
    );
  });

  it('should correctly call axios.head with transformed options', async () => {
    axios.head.mockResolvedValueOnce({ data: 'success' });

    const response = await engine.head(url, options);

    expect(axios.head).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        params: options.params,
        headers: expect.objectContaining({
          'x-company-id': '1',
          'Custom-Header': 'value',
        }),
      })
    );
    expect(response).toEqual({ data: 'success' });
  });
  it('should correctly call axios.put with transformed options', async () => {
    options = {
      ...options,
      data: { name: 'Updated Name' },
      params: { id: '123' },
    };

    axios.put.mockResolvedValueOnce({ data: 'success' });

    const response = await engine.put(url, options);

    expect(axios.put).toHaveBeenCalledWith(
      url,
      options.data,
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-company-id': '1',
          'Custom-Header': 'value',
        }),
        params: options.params,
      })
    );
    expect(response).toEqual({ data: 'success' });
  });

  it('should correctly call axios.patch with transformed options', async () => {
    options = {
      ...options,
      data: { name: 'Patched Name' },
      params: { id: '123' },
    };

    axios.patch.mockResolvedValueOnce({ data: 'success' });

    const response = await engine.patch(url, options);

    expect(axios.patch).toHaveBeenCalledWith(
      url,
      options.data,
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-company-id': '1',
          'Custom-Header': 'value',
        }),
        params: options.params,
      })
    );
    expect(response).toEqual({ data: 'success' });
  });

  it('should correctly call axios.delete with transformed options', async () => {
    options = {
      ...options,
      data: { id: '123' },
      params: { confirm: 'yes' },
    };

    axios.delete.mockResolvedValueOnce({ data: 'deleted' });

    const response = await engine.del(url, options);

    expect(axios.delete).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        data: options.data,
        headers: expect.objectContaining({
          'x-company-id': '1',
          'Custom-Header': 'value',
        }),
        params: options.params,
      })
    );
    expect(response).toEqual({ data: 'deleted' });
  });

  it('should correctly call axiosMisc.post with provided options', async () => {
    options = {
      ...options,
      data: { key: 'value' },
      headers: { 'Misc-Custom-Header': 'misc-value' },
    };

    axios.post.mockResolvedValueOnce({ data: 'misc post success' });

    const response = await engine.postMisc(url, options);

    expect(axios.post).toHaveBeenCalledWith(url, options.data, {
      headers: options.headers,
    });

    expect(response).toEqual({ data: 'misc post success' });
  });
});

describe('HTTP Engine - paramsSerializer Test Suite', () => {
  let originalTransformRequestOptions;
  const url = 'https://test.com/data';
  const options = {
    params: { query: 'test', page: 1 },
    headers: { 'Custom-Header': 'value' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(require('../../../helper/utils'), 'transformRequestOptions')
      .mockImplementation(originalTransformRequestOptions);
  });

  afterEach(() => {
    require('../../../helper/utils').transformRequestOptions.mockRestore();
  });

  it('should serialize parameters using transformRequestOptions in engine.get', async () => {
    await engine.get(url, options);
    const { paramsSerializer } = axios.get.mock.calls[0][1];
    paramsSerializer(options.params);
    expect(
      require('../../../helper/utils').transformRequestOptions
    ).toHaveBeenCalledWith(options.params);
  });

  it('should serialize parameters using transformRequestOptions in engine.head', async () => {
    await engine.head(url, options);
    const { paramsSerializer } = axios.head.mock.calls[0][1];
    paramsSerializer(options.params);
    expect(
      require('../../../helper/utils').transformRequestOptions
    ).toHaveBeenCalledWith(options.params);
  });

  it('should serialize parameters using transformRequestOptions in engine.getMisc', async () => {
    await engine.getMisc(url, options);
    const { paramsSerializer } = axios.get.mock.calls[0][1];
    paramsSerializer(options.params);
    expect(
      require('../../../helper/utils').transformRequestOptions
    ).toHaveBeenCalledWith(options.params);
  });
});
