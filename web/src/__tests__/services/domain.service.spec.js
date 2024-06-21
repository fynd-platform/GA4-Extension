import urlJoin from 'url-join';
import root from 'window-or-global';
import URLS from '../../services/domain.service';

jest.mock('url-join', () => {
  return jest.fn((...args) => {
    return args.reduce((acc, current) => {
      let modifiedAcc = acc;
      let modifiedCurrent = current;

      if (modifiedAcc.endsWith('/')) {
        modifiedAcc = modifiedAcc.slice(0, -1);
      }
      if (modifiedCurrent.startsWith('/')) {
        modifiedCurrent = modifiedCurrent.substring(1);
      }
      return `${modifiedAcc}/${modifiedCurrent}`;
    });
  });
});

jest.mock('window-or-global', () => ({
  location: {
    protocol: 'http:',
    hostname: 'localhost',
  },
  process: {
    NODE_ENV: 'test',
    env: {
      NODE_ENV: 'test',
      GA4_MAIN_URL: 'http://localhost',
    },
  },
  env: {},
}));

describe('DomainService Test Suite', () => {
  beforeAll(() => {
    root.env.GA4_MAIN_URL = 'http://localhost';
  });

  it('GET_ALL_APPLICATIONS returns the correct URL', () => {
    const expectedUrl = 'http://localhost/api/v1/applications';
    const url = URLS.GET_ALL_APPLICATIONS();
    expect(url).toEqual(expectedUrl);
    expect(urlJoin).toHaveBeenCalledWith(
      'http://localhost',
      '/api/v1/applications'
    );
  });

  it('TAG_MANAGER returns the correct URL without applicationId', () => {
    const expectedUrl = 'http://localhost/api/v1/tag-manager/';
    const url = URLS.TAG_MANAGER();
    expect(url).toEqual(expectedUrl);
    expect(urlJoin).toHaveBeenCalledWith(
      'http://localhost',
      '/api/v1/tag-manager',
      ''
    );
  });

  it('TAG_MANAGER returns the correct URL with applicationId', () => {
    const applicationId = '123';
    const expectedUrl = 'http://localhost/api/v1/tag-manager/123';
    const url = URLS.TAG_MANAGER(applicationId);
    expect(url).toEqual(expectedUrl);
    expect(urlJoin).toHaveBeenCalledWith(
      'http://localhost',
      '/api/v1/tag-manager',
      applicationId
    );
  });
});
