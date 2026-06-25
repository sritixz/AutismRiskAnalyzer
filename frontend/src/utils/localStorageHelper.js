/**
 * Thin, safe wrapper around localStorage. JSON-encodes/decodes
 * automatically and never throws — localStorage can fail in private
 * browsing modes or when quota is exceeded, and a storage failure
 * should never crash the app.
 */

export const getItem = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`localStorageHelper: failed to read "${key}"`, error);
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`localStorageHelper: failed to write "${key}"`, error);
    return false;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`localStorageHelper: failed to remove "${key}"`, error);
    return false;
  }
};
