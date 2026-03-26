import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Space } from 'antd';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';

// ============================================
// 登录表单数据类型定义
// ============================================
export interface LoginFormData {
  username: string;      // 用户名
  password: string;      // 密码
  remember?: boolean;    // 记住登录状态
}

// ============================================
// 组件 Props 类型定义
// ============================================
export interface LoginFormProps {
  /** 登录提交回调 */
  onSubmit?: (values: LoginFormData) => Promise<void> | void;
  /** 忘记密码回调 */
  onForgotPassword?: () => void;
  /** 注册回调 */
  onRegister?: () => void;
  /** 第三方登录配置 */
  socialLogins?: Array<{
    key: string;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }>;
  /** 是否显示记住我选项 */
  showRememberMe?: boolean;
  /** 是否显示第三方登录 */
  showSocialLogin?: boolean;
  /** 加载状态（外部控制） */
  loading?: boolean;
  /** 初始值 */
  initialValues?: Partial<LoginFormData>;
  /** 自定义样式 */
  className?: string;
  /** 自定义表单实例（用于外部控制） */
  form?: FormInstance;
}

/**
 * 登录表单组件
 * 
 * 功能特性：
 * - 用户名/密码登录
 * - 记住登录状态
 * - 密码显示/隐藏切换
 * - 表单验证
 * - 加载状态处理
 * - 支持第三方登录扩展
 * 
 * @example
 * ```tsx
 * <LoginForm
 *   onSubmit={async (values) => {
 *     await loginApi(values);
 *   }}
 *   onForgotPassword={() => navigate('/forgot-password')}
 *   onRegister={() => navigate('/register')}
 * />
 * ```
 */
const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  onRegister,
  socialLogins = [],
  showRememberMe = true,
  showSocialLogin = false,
  loading: externalLoading = false,
  initialValues,
  className,
  form: externalForm,
}) => {
  // ============================================
  // State 管理
  // ============================================
  const [internalForm] = Form.useForm<LoginFormData>();
  const form = externalForm || internalForm;
  
  // 内部加载状态（防止重复提交）
  const [submitting, setSubmitting] = useState(false);
  
  // 合并加载状态
  const isLoading = submitting || externalLoading;

  // ============================================
  // 表单提交处理
  // ============================================
  const handleSubmit = async (values: LoginFormData) => {
    // 防止重复提交
    if (isLoading) return;

    try {
      setSubmitting(true);
      
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // 默认行为：打印日志（开发环境）
        console.log('Login form submitted:', values);
        message.success('登录成功！');
      }
    } catch (error: any) {
      // 统一错误处理
      const errorMessage = error?.message || '登录失败，请检查用户名和密码';
      message.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // 表单验证规则
  // ============================================
  const formRules = {
    username: [
      { required: true, message: '请输入用户名' },
      { min: 3, message: '用户名至少 3 个字符' },
      { max: 20, message: '用户名最多 20 个字符' },
      // 用户名格式验证：字母开头，允许字母、数字、下划线
      { 
        pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, 
        message: '用户名必须以字母开头，只能包含字母、数字、下划线' 
      },
    ],
    password: [
      { required: true, message: '请输入密码' },
      { min: 6, message: '密码至少 6 个字符' },
    ],
  };

  // ============================================
  // 渲染
  // ============================================
  return (
    <div className={className}>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          remember: true,
          ...initialValues,
        }}
        layout="vertical"
        size="large"
      >
        {/* ========== 用户名输入 ========== */}
        <Form.Item
          name="username"
          rules={formRules.username}
          validateTrigger={['onBlur', 'onChange']}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入用户名"
            autoComplete="username"
            disabled={isLoading}
          />
        </Form.Item>

        {/* ========== 密码输入 ========== */}
        <Form.Item
          name="password"
          rules={formRules.password}
          validateTrigger={['onBlur', 'onChange']}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入密码"
            autoComplete="current-password"
            disabled={isLoading}
            // 密码显示切换图标
            iconRender={(visible) => 
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        {/* ========== 记住我 & 忘记密码 ========== */}
        {showRememberMe && (
          <Form.Item>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox disabled={isLoading}>记住我</Checkbox>
              </Form.Item>
              
              {onForgotPassword && (
                <Button 
                  type="link" 
                  onClick={onForgotPassword}
                  disabled={isLoading}
                  style={{ padding: 0 }}
                >
                  忘记密码？
                </Button>
              )}
            </div>
          </Form.Item>
        )}

        {/* ========== 登录按钮 ========== */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            style={{ height: 44, fontSize: 16 }}
          >
            登录
          </Button>
        </Form.Item>

        {/* ========== 注册链接 ========== */}
        {onRegister && (
          <Form.Item style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ color: '#8c8c8c' }}>还没有账号？</span>
            <Button 
              type="link" 
              onClick={onRegister}
              disabled={isLoading}
            >
              立即注册
            </Button>
          </Form.Item>
        )}

        {/* ========== 第三方登录 ========== */}
        {showSocialLogin && socialLogins.length > 0 && (
          <>
            <div style={{ 
              textAlign: 'center', 
              color: '#8c8c8c', 
              margin: '16px 0',
              position: 'relative' 
            }}>
              <span style={{ 
                background: '#fff', 
                padding: '0 16px',
                position: 'relative',
                zIndex: 1,
              }}>
                其他登录方式
              </span>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 1,
                background: '#e8e8e8',
                zIndex: 0,
              }} />
            </div>

            <Space 
              direction="vertical" 
              size="middle" 
              style={{ width: '100%' }}
            >
              {socialLogins.map((item) => (
                <Button
                  key={item.key}
                  block
                  icon={item.icon}
                  onClick={item.onClick}
                  disabled={isLoading}
                  style={{ height: 44 }}
                >
                  {item.label}
                </Button>
              ))}
            </Space>
          </>
        )}
      </Form>
    </div>
  );
};

export default LoginForm;