// Helper utilities to work with browser's local-storage

const keyPrefix = '';

interface StorageHelper<T> {
  (value?: T): T;
  key?: string // local-storage key
  reset?: () => void; // reset to default value
}

export function createStorage<T>(key: string, defaultValue?: T, initDefault?: boolean) {
  key = keyPrefix + key;

  const itemManager: StorageHelper<T> = function (value?: T) {
    var clear = value === null;
    // setter
    if (arguments.length && !clear) {
      var item = JSON.stringify(value);
      localStorage.setItem(key, item);
    }
    // getter
    else {
      var item = localStorage.getItem(key);
      if (clear) localStorage.removeItem(key);
      if (item) {
        try {
          return JSON.parse(item);
        } catch (e) {
          console.error("Parse storage item error", e);
        }
      }
      return defaultValue;
    }
  };

  // save default value if empty to the storage
  if (arguments.length === 3 && initDefault) {
    var value = localStorage.getItem(key);
    if (value == null) itemManager(defaultValue);
  }

  // extra helpers related to specific storage item
  itemManager.key = key;
  itemManager.reset = () => itemManager(defaultValue);

  return itemManager;
}

export function clearStorage(key?: string) {
  key = key ? key + keyPrefix : "";
  if (key) {
    localStorage.removeItem(key);
  }
  else {
    Object.keys(localStorage)
      .filter(key => key.startsWith(keyPrefix))
      .forEach(key => localStorage.removeItem(key));
  }
}
