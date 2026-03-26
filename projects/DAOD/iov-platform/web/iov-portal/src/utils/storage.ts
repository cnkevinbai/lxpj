/**
 * 本地存储工具
 * 
 * @description 封装 localStorage 操作
 * @author daod-team
 */

const PREFIX = 'iov_';

/**
 * 获取存储项
 */
export const getStorage = <T = any>(key: string): T | null => {
  try {
    const item = localStorage.getItem(PREFIX + key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  } catch (error) {
    console.error(`[Storage] 解析 ${key} 失败:`, error);
    return null;
  }
};

/**
 * 设置存储项
 */
export const setStorage = <T = any>(key: string, value: T): void => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Storage] 存储 ${key} 失败:`, error);
  }
};

/**
 * 移除存储项
 */
export const removeStorage = (key: string): void => {
  localStorage.removeItem(PREFIX + key);
};

/**
 * 清空所有存储
 */
export const clearStorage = (): void => {
  // 只清除带前缀的项
  Object.keys(localStorage)
    .filter(key => key.startsWith(PREFIX))
    .forEach(key => localStorage.removeItem(key));
};

/**
 * 获取 Token
 */
export const getToken = (): string | null => {
  return getStorage<string>('token');
};

/**
 * 设置 Token
 */
export const setToken = (token: string): void => {
  setStorage('token', token);
};

/**
 * 移除 Token
 */
export const removeToken = (): void => {
  removeStorage('token');
  removeStorage('refreshToken');
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return getStorage<any>('user');
};

/**
 * 设置用户信息
 */
export const setUserInfo = (user: any): void => {
  setStorage('user', user);
};

export default {
  get: getStorage,
  set: setStorage,
  remove: removeStorage,
  clear: clearStorage,
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  setUserInfo,
};