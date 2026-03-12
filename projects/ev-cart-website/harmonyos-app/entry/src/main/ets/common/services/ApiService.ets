// API 服务类
export class ApiService {
  private baseUrl: string = 'https://api.evcart.com/api/v1'
  private token: string = ''

  constructor() {
    // 从存储中读取 token
    this.loadToken()
  }

  // 设置 token
  setToken(token: string) {
    this.token = token
    // 保存到存储
    this.saveToken(token)
  }

  // 保存 token
  private async saveToken(token: string) {
    // 使用首选项存储
    // 实现略
  }

  // 加载 token
  private async loadToken() {
    // 从首选项存储加载
    // 实现略
  }

  // GET 请求
  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json() as T
  }

  // POST 请求
  async post<T>(url: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json() as T
  }

  // PUT 请求
  async put<T>(url: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json() as T
  }

  // DELETE 请求
  async delete<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json() as T
  }
}

// 导出单例
export const apiService = new ApiService()
