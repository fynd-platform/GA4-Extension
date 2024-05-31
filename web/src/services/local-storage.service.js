import { isBrowser } from 'browser-or-node';

export const STORAGE_KEYS = {};

const STORAGE_CONFIG = {
  [STORAGE_KEYS.SAMPLE]: {
    // ls_ttl_ms:1000*60
  },
};

function getNow() {
  return Date.now();
}

function isCacheStale(obj) {
  if (obj.lsTtlMs) {
    // console.log("Diff:",(getNow()- (obj.ls_timestamp+obj.lsTtlMs)))
    return getNow() - (obj.ls_timestamp + obj.lsTtlMs) > 0;
  }
  return false;
}

function addKeyProps(key, obj, ttlMs = null) {
  const jsonObj = { ls_timestamp: getNow(), value: obj };
  if (STORAGE_CONFIG[key]) {
    return { ...jsonObj, ...STORAGE_CONFIG[key] };
  }
  // for theme , set ttl without using store config
  if (ttlMs) {
    return { ...jsonObj, lsTtlMs: ttlMs };
  }
  return jsonObj;
}

export const LocalStorageService = {
  removeItem(key) {
    if (isBrowser) {
      localStorage.removeItem(key);
    }
  },
  removeAll() {
    console.log('REAL **');
    if (isBrowser) {
      localStorage.clear();
      sessionStorage.clear();
    }
  },
  addOrUpdateItem(key, value, ttlMs = null) {
    if (isBrowser && value) {
      const jsonObj = addKeyProps(key, value, ttlMs);
      const val = JSON.stringify(jsonObj);
      localStorage.setItem(key, val);
    }
  },
  getItem(key) {
    if (isBrowser) {
      const val = localStorage.getItem(key);
      if (val) {
        const jsonObj = JSON.parse(val);
        try {
          if (isCacheStale(jsonObj)) {
            // remove json object
            this.removeItem(key);
            return null;
          }
          return jsonObj.value;
        } catch (err) {
          return null;
        }
      }
      return null;
    }
    return null;
  },
};
