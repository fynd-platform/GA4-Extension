import { LocalStorageService } from '../../services/local-storage.service';

let mockIsBrowser = true;

jest.mock('browser-or-node', () => ({
  get isBrowser() {
    return mockIsBrowser;
  },
}));

describe('LocalStorageService Test Suite', () => {
  beforeEach(() => {
    mockIsBrowser = true;
    jest.clearAllMocks();

    const mockLocalStorage = {};
    const mockSessionStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(key => mockLocalStorage[key] || null),
        setItem: jest.fn((key, value) => {
          mockLocalStorage[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          Object.keys(mockLocalStorage).forEach(key => {
            delete mockLocalStorage[key];
          });
        }),
      },
      configurable: true,
    });

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(key => mockSessionStorage[key] || null),
        setItem: jest.fn((key, value) => {
          mockSessionStorage[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
          delete mockSessionStorage[key];
        }),
        clear: jest.fn(() => {
          Object.keys(mockSessionStorage).forEach(key => {
            delete mockSessionStorage[key];
          });
        }),
      },
      configurable: true,
    });
  });

  it('should call localStorage.removeItem when in a browser environment', () => {
    const key = 'testKey';
    LocalStorageService.removeItem(key);

    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  it('should not call localStorage.removeItem when not in a browser environment', () => {
    mockIsBrowser = false;
    const key = 'testKey';
    LocalStorageService.removeItem(key);

    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });

  it('should clear both localStorage and sessionStorage when in a browser environment', () => {
    LocalStorageService.removeAll();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(sessionStorage.clear).toHaveBeenCalled();
  });

  it('should add an item to localStorage with correct TTL', () => {
    const key = 'testKey';
    const value = { data: 'testData' };
    const ttlMs = 1000 * 60; // 1 minute
    LocalStorageService.addOrUpdateItem(key, value, ttlMs);
    const storedValue = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(localStorage.setItem).toHaveBeenCalledWith(key, expect.any(String));
    expect(storedValue.lsTtlMs).toBe(ttlMs);
  });

  it('should return null and remove the item if the cache is stale', () => {
    const key = 'staleKey';
    localStorage.setItem(
      key,
      JSON.stringify({
        ls_timestamp: Date.now() - 10000,
        lsTtlMs: 5000,
        value: 'staleData',
      })
    );

    const result = LocalStorageService.getItem(key);
    expect(result).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  it('should return the item value if isCacheStale returns false', () => {
    const key = 'freshKey';
    const value = { data: 'freshData' };
    const futureTimestamp = Date.now() + 1000 * 60 * 60;
    window.localStorage.getItem.mockImplementation(() =>
      JSON.stringify({
        ls_timestamp: Date.now(),
        lsTtlMs: futureTimestamp,
        value,
      })
    );
    const result = LocalStorageService.getItem(key);
    expect(result).toEqual(value);
    expect(window.localStorage.removeItem).not.toHaveBeenCalledWith(key);
  });

  it('should return the item value if isCacheStale returns false while lsTtlMs is not provided while adding item to local storage', () => {
    const key = 'freshKey';
    const value = { data: 'freshData' };
    window.localStorage.getItem.mockImplementation(() =>
      JSON.stringify({
        ls_timestamp: Date.now(),
        lsTtlMs: null,
        value,
      })
    );
    LocalStorageService.addOrUpdateItem(key, value);
    const result = LocalStorageService.getItem(key);
    expect(result).toEqual(value);
    expect(window.localStorage.removeItem).not.toHaveBeenCalledWith(key);
  });

  it('should return null when localStorage.getItem does not have a matching key', () => {
    const nonExistentKey = 'nonExistentKey';
    window.localStorage.getItem.mockImplementation(() => {
      return null;
    });
    const result = LocalStorageService.getItem(nonExistentKey);
    expect(result).toBeNull();
    expect(window.localStorage.getItem).toHaveBeenCalledWith(nonExistentKey);
  });

  it('should not clear localStorage and sessionStorage when not in a browser environment', () => {
    mockIsBrowser = false;
    LocalStorageService.removeAll();
    expect(localStorage.clear).not.toHaveBeenCalled();
    expect(sessionStorage.clear).not.toHaveBeenCalled();
  });

  it('should not add an item to localStorage when not in a browser environment', () => {
    mockIsBrowser = false;
    const key = 'testKey';
    const value = { data: 'testData' };
    const ttlMs = 1000 * 60;
    LocalStorageService.addOrUpdateItem(key, value, ttlMs);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should return null from getItem when not in a browser environment', () => {
    mockIsBrowser = false;
    const key = 'testKey';
    LocalStorageService.getItem(key);
    expect(localStorage.getItem).not.toHaveBeenCalled();
  });
});
