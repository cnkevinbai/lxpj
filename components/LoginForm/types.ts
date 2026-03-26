// ============================================
// 登录表单相关类型定义
// ============================================

import type { FormInstance } from 'antd';
import type { ReactNode } from 'react';

/**
 * 登录表单数据
 */
export interface LoginFormData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 是否记住登录 */
  remember?: boolean;
}

/**
 * 第三方登录项配置
 */
export interface SocialLoginItem {
  /** 唯一标识 */
  key: string;
  /** 图标 */
  icon: ReactNode;
  /** 显示文本 */
  label: string;
  /** 点击回调 */
  onClick: () => void;
}

/**
 * 登录表单组件 Props
 */
export interface LoginFormProps {
  /** 登录提交回调 */
  onSubmit?: (values: LoginFormData) => Promise<void> | void;
  /** 忘记密码回调 */
  onForgotPassword?: () => void;
  /** 注册回调 */
  onRegister?: () => void;
  /** 第三方登录配置 */
  socialLogins?: SocialLoginItem[];
  /** 是否显示记住我选项 */
  showRememberMe?: boolean;
  /** 是否显示第三方登录 */
  showSocialLogin?: boolean;
  /** 加载状态（外部控制） */
  loading?: boolean;
  /** 初始值 */
  initialValues?: Partial<LoginFormData>;
  /** 自定义样式类名 */
  className?: string;
  /** 自定义表单实例 */
  form?: FormInstance<LoginFormData>;
}

/**
 * 登录 API 响应
 */
export interface LoginApiResponse {
  /** 访问令牌 */
  token: string;
  /** 刷新令牌 */
  refreshToken?: string;
  /** 过期时间（秒） */
  expiresIn: number;
  /** 用户信息 */
  user: {
    id: string;
    username: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
}

/**
 * 登录错误响应
 */
export interface LoginErrorResponse {
  /** 错误码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** 错误字段 */
  field?: 'username' | 'password';
}