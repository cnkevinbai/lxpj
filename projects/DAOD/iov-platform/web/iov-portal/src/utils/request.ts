/**
 * 请求工具函数
 * 
 * @description Axios 请求封装
 * @author daod-team
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';

// API 基础配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const TIMEOUT = 30000;

// 创建 Axios 实例
const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加租户 ID
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    
    // 业务状态码判断
    if (data.code === 0 || data.code === 200) {
      return data.data;
    }
    
    // 业务错误
    message.error(data.message || '请求失败');
    return Promise.reject(new Error(data.message || '请求失败'));
  },
  (error: AxiosError<any>) => {
    // HTTP 错误处理
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问该资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error(data?.message || '服务器内部错误');
          break;
        default:
          message.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络');
    } else {
      message.error(error.message || '请求失败');
    }
    
    return Promise.reject(error);
  }
);

// 导出请求方法
export const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request.get(url, config);
};

export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.post(url, data, config);
};

export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.put(url, data, config);
};

export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request.delete(url, config);
};

export default request;