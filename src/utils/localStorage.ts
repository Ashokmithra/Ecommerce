export const getLocalStorageItem = (key: string) => {
  return localStorage.getItem(key);
};

export const setLocalStorageItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const storeLocalStorage = (userData: object) => {
  Object.entries(userData).map(([key, val]) => {
    setLocalStorageItem(key, JSON.stringify(val));
  });
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
