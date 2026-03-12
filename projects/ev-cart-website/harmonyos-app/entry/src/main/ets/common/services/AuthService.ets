// 认证服务
import { apiService } from './ApiService'
import { StorageService } from './StorageService'

export interface LoginResult {
  access_token: string
  user: User
}

export interface User {
  id: string
  username: string
  realName: string
  role: Role
}

export interface Role {
  roleCode: string
  roleName: string
}

export class AuthService {
  private storage: StorageService = new StorageService()
  private readonly TOKEN_KEY = 'access_token'
  private readonly USER_KEY = 'user'

  // 登录
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      const result = await apiService.post<LoginResult>('/auth/login', {
        username,
        password,
      })

      // 保存 token 和用户信息
      await this.storage.save(this.TOKEN_KEY, result.access_token)
      await this.storage.save(this.USER_KEY, JSON.stringify(result.user))

      return result
    } catch (error) {
      throw new Error('登录失败')
    }
  }

  // 退出登录
  async logout(): Promise<void> {
    await this.storage.remove(this.TOKEN_KEY)
    await this.storage.remove(this.USER_KEY)
  }

  // 检查登录状态
  async isLoggedIn(): Promise<boolean> {
    const token = await this.storage.load(this.TOKEN_KEY)
    return !!token
  }

  // 获取当前用户
  async getCurrentUser(): Promise<User | null> {
    const userStr = await this.storage.load(this.USER_KEY)
    if (userStr) {
      return JSON.parse(userStr) as User
    }
    return null
  }

  // 获取 Token
  async getToken(): Promise<string> {
    return await this.storage.load(this.TOKEN_KEY)
  }
}

// 导出单例
export const authService = new AuthService()
