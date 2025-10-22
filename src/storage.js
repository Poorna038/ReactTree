export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getData = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};
