import {
  transformRequestOptions,
  setCompany,
  getCompany,
  setApplication,
  getApplication,
  getCompanyBasePath,
} from '../../helper/utils';

describe('transformRequestOptions', () => {
  it('transforms simple key-value pairs into query string', () => {
    const params = { name: 'Test', age: 30 };
    const result = transformRequestOptions(params);
    expect(result).toBe('name=Test&age=30');
  });

  it('encodes URI components', () => {
    const params = { name: 'John Doe', city: 'New York' };
    const result = transformRequestOptions(params);
    expect(result).toBe('name=John%20Doe&city=New%20York');
  });

  it('handles array values', () => {
    const params = { colors: ['red', 'green', 'blue'] };
    const result = transformRequestOptions(params);
    expect(result).toBe('colors=red&colors=green&colors=blue');
  });

  it('handles nested objects', () => {
    const params = { user: { name: 'John', age: 30 } };
    const result = transformRequestOptions(params);
    expect(result).toBe('name=John&age=30');
  });
});

describe('setCompany and getCompany', () => {
  it('sets and gets the company ID', () => {
    setCompany('123');
    expect(getCompany()).toBe('123');
  });
});

describe('setApplication and getApplication', () => {
  it('sets and gets the application ID', () => {
    setApplication('456');
    expect(getApplication()).toBe('456');
  });
});

describe('getCompanyBasePath', () => {
  it('constructs path from route params', () => {
    const route = { params: { company_id: '123', id: '456' } };
    const result = getCompanyBasePath(route);
    expect(result).toBe('/company/123/application/456');
  });

  it('constructs path from global IDs when route params are missing', () => {
    setCompany('789');
    setApplication('101');
    const route = { params: {} };
    const result = getCompanyBasePath(route);
    expect(result).toBe('/company/789/application/101');
  });
});
