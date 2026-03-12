// 存储服务
import dataPreferences from '@ohos.data.preferences'

export class StorageService {
  private preferences: dataPreferences.Preferences | null = null
  private readonly PREF_NAME = 'evcart_preferences'

  // 获取 Preferences 实例
  private async getPreferences(): Promise<dataPreferences.Preferences> {
    if (!this.preferences) {
      this.preferences = await dataPreferences.getPreferences(this.PREF_NAME)
    }
    return this.preferences
  }

  // 保存数据
  async save(key: string, value: string): Promise<void> {
    try {
      const prefs = await this.getPreferences()
      await prefs.put(key, value)
      await prefs.flush()
    } catch (error) {
      console.error('Storage save error:', error)
      throw error
    }
  }

  // 读取数据
  async load(key: string): Promise<string> {
    try {
      const prefs = await this.getPreferences()
      const value = await prefs.get(key, '')
      return value as string
    } catch (error) {
      console.error('Storage load error:', error)
      return ''
    }
  }

  // 删除数据
  async remove(key: string): Promise<void> {
    try {
      const prefs = await this.getPreferences()
      await prefs.delete(key)
      await prefs.flush()
    } catch (error) {
      console.error('Storage remove error:', error)
      throw error
    }
  }

  // 清空数据
  async clear(): Promise<void> {
    try {
      const prefs = await this.getPreferences()
      await prefs.clear()
      await prefs.flush()
    } catch (error) {
      console.error('Storage clear error:', error)
      throw error
    }
  }

  // 检查键是否存在
  async has(key: string): Promise<boolean> {
    try {
      const prefs = await this.getPreferences()
      return await prefs.has(key)
    } catch (error) {
      console.error('Storage has error:', error)
      return false
    }
  }
}

// 导出单例
export const storageService = new StorageService()
