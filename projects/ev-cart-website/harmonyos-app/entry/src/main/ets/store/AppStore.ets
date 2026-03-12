/**
 * 应用状态管理
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { Storage } from '@kit.ArkTS'

// 用户数据
export interface UserInfo {
  id: string
  username: string
  name: string
  avatar?: string
  phone?: string
  email?: string
  department?: string
  role?: string
}

// 应用配置
export interface AppConfig {
  theme: 'light' | 'dark'
  fontSize: 'small' | 'medium' | 'large'
  notifications: boolean
}

class AppStoreClass {
  // 用户状态
  private user: UserInfo | null = null
  private token: string = ''

  // 应用配置
  private config: AppConfig = {
    theme: 'light',
    fontSize: 'medium',
    notifications: true
  }

  // 未读消息数
  private unreadCount: number = 0

  constructor() {
    this.loadFromStorage()
  }

  /**
   * 从存储加载
   */
  private loadFromStorage() {
    try {
      const userStr = Storage.get('user')
      if (userStr) {
        this.user = JSON.parse(userStr)
      }

      const token = Storage.get('token')
      if (token) {
        this.token = token
      }

      const configStr = Storage.get('config')
      if (configStr) {
        this.config = JSON.parse(configStr)
      }
    } catch (error) {
      console.error('Load from storage error:', error)
    }
  }

  /**
   * 保存到存储
   */
  private saveToStorage() {
    try {
      if (this.user) {
        Storage.put('user', JSON.stringify(this.user))
      }
      if (this.token) {
        Storage.put('token', this.token)
      }
      Storage.put('config', JSON.stringify(this.config))
    } catch (error) {
      console.error('Save to storage error:', error)
    }
  }

  // ========== 用户相关 ==========

  /**
   * 设置用户信息
   */
  setUser(user: UserInfo) {
    this.user = user
    this.saveToStorage()
  }

  /**
   * 获取用户信息
   */
  getUser(): UserInfo | null {
    return this.user
  }

  /**
   * 设置 Token
   */
  setToken(token: string) {
    this.token = token
    this.saveToStorage()
  }

  /**
   * 获取 Token
   */
  getToken(): string {
    return this.token
  }

  /**
   * 登出
   */
  logout() {
    this.user = null
    this.token = ''
    Storage.delete('user')
    Storage.delete('token')
  }

  /**
   * 检查是否登录
   */
  isLoggedIn(): boolean {
    return !!this.token && !!this.user
  }

  // ========== 配置相关 ==========

  /**
   * 设置配置
   */
  setConfig(config: Partial<AppConfig>) {
    this.config = { ...this.config, ...config }
    this.saveToStorage()
  }

  /**
   * 获取配置
   */
  getConfig(): AppConfig {
    return this.config
  }

  // ========== 消息相关 ==========

  /**
   * 设置未读消息数
   */
  setUnreadCount(count: number) {
    this.unreadCount = count
  }

  /**
   * 获取未读消息数
   */
  getUnreadCount(): number {
    return this.unreadCount
  }

  /**
   * 增加未读消息数
   */
  incrementUnreadCount() {
    this.unreadCount++
  }

  /**
   * 清空未读消息
   */
  clearUnreadCount() {
    this.unreadCount = 0
  }
}

// 导出单例
export const AppStore = new AppStoreClass()
export default AppStore
