/**
 * 本地存储服务
 * 封装数据持久化
 */

import dataPreferences from '@ohos.data.preferences';

export class StorageUtil {
  private static instance: StorageUtil;
  private preferences: dataPreferences.Preferences | null = null;

  // 私有构造函数（单例模式）
  private constructor() {}

  // 获取实例
  static getInstance(): StorageUtil {
    if (!StorageUtil.instance) {
      StorageUtil.instance = new StorageUtil();
    }
    return StorageUtil.instance;
  }

  // 初始化
  async init(): Promise<void> {
    if (!this.preferences) {
      this.preferences = await dataPreferences.getPreferences('app_data');
    }
  }

  // 保存数据
  async set(key: string, value: any): Promise<void> {
    try {
      if (!this.preferences) {
        await this.init();
      }
      
      await this.preferences!.put(key, value);
      await this.preferences!.flush();
    } catch (error) {
      console.error('保存数据失败', error);
      throw error;
    }
  }

  // 获取数据
  async get(key: string, defaultValue?: any): Promise<any> {
    try {
      if (!this.preferences) {
        await this.init();
      }
      
      return await this.preferences!.get(key, defaultValue);
    } catch (error) {
      console.error('获取数据失败', error);
      return defaultValue;
    }
  }

  // 删除数据
  async remove(key: string): Promise<void> {
    try {
      if (!this.preferences) {
        await this.init();
      }
      
      await this.preferences!.delete(key);
      await this.preferences!.flush();
    } catch (error) {
      console.error('删除数据失败', error);
      throw error;
    }
  }

  // 清空所有数据
  async clear(): Promise<void> {
    try {
      if (!this.preferences) {
        await this.init();
      }
      
      await this.preferences!.clear();
      await this.preferences!.flush();
    } catch (error) {
      console.error('清空数据失败', error);
      throw error;
    }
  }

  // 检查是否包含某个 key
  async has(key: string): Promise<boolean> {
    try {
      if (!this.preferences) {
        await this.init();
      }
      
      return await this.preferences!.has(key);
    } catch (error) {
      console.error('检查 key 失败', error);
      return false;
    }
  }
}
