/**
 * API 服务
 * 封装网络请求
 */

import http from '@ohos.net.http';
import { StorageUtil } from '../utils/StorageUtil';

const BASE_URL = 'https://api.evcart.com/api/v1';
const TIMEOUT = 30000; // 30 秒

export class ApiService {
  private accessToken: string = '';

  constructor() {
    this.loadToken();
  }

  // 加载 Token
  private async loadToken(): Promise<void> {
    try {
      this.accessToken = await StorageUtil.getInstance().get('accessToken', '');
    } catch (error) {
      console.error('加载 Token 失败', error);
    }
  }

  // 设置 Token
  setToken(token: string): void {
    this.accessToken = token;
    StorageUtil.getInstance().set('accessToken', token);
  }

  // 清除 Token
  clearToken(): void {
    this.accessToken = '';
    StorageUtil.getInstance().remove('accessToken');
  }

  // GET 请求
  async get(url: string, params?: any): Promise<any> {
    const fullUrl = `${BASE_URL}${url}${this.buildParams(params)}`;
    
    return await this.request('get', fullUrl, null);
  }

  // POST 请求
  async post(url: string, data: any): Promise<any> {
    const fullUrl = `${BASE_URL}${url}`;
    
    return await this.request('post', fullUrl, data);
  }

  // PUT 请求
  async put(url: string, data: any): Promise<any> {
    const fullUrl = `${BASE_URL}${url}`;
    
    return await this.request('put', fullUrl, data);
  }

  // DELETE 请求
  async delete(url: string): Promise<any> {
    const fullUrl = `${BASE_URL}${url}`;
    
    return await this.request('delete', fullUrl, null);
  }

  // 通用请求方法
  private async request(method: string, url: string, data: any): Promise<any> {
    const httpRequest = http.createHttp();
    
    try {
      const response = await httpRequest.request(url, {
        method: method as http.RequestMethod,
        header: {
          'Authorization': this.accessToken ? `Bearer ${this.accessToken}` : '',
          'Content-Type': 'application/json'
        },
        connectTimeout: TIMEOUT,
        readTimeout: TIMEOUT,
        extraData: data ? JSON.stringify(data) : ''
      });

      if (response.responseCode === 200) {
        const result = JSON.parse(response.result as string);
        
        // 检查业务状态码
        if (result.success === false) {
          throw new Error(result.message || '请求失败');
        }
        
        return result;
      } else if (response.responseCode === 401) {
        // Token 过期，清除并跳转登录
        this.clearToken();
        throw new Error('登录已过期，请重新登录');
      } else {
        throw new Error(`请求失败：${response.responseCode}`);
      }
    } catch (error) {
      console.error('网络请求失败', error);
      throw error;
    } finally {
      httpRequest.destroy();
    }
  }

  // 构建查询参数
  private buildParams(params: any): string {
    if (!params) return '';
    
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    return `?${queryString}`;
  }
}
