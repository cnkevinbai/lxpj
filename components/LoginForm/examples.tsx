import React from 'react';
import { message } from 'antd';
import { 
  WechatOutlined, 
  AlipayCircleOutlined,
  GithubOutlined 
} from '@ant-design/icons';
import LoginForm, { type LoginFormData } from './index';
import styles from './index.module.less';

// ============================================
// 使用示例 1: 基础登录页面
// ============================================
export const BasicLogin: React.FC = () => {
  const handleLogin = async (values: LoginFormData) => {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('登录信息:', values);
    message.success(`欢迎回来，${values.username}！`);
  };

  return (
    <div className={styles.loginFormWrapper}>
      <h2 style={{ textAlign: 'center', marginBottom: 32 }}>用户登录</h2>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

// ============================================
// 使用示例 2: 完整功能登录页（带第三方登录）
// ============================================
export const FullFeatureLogin: React.FC = () => {
  const handleLogin = async (values: LoginFormData) => {
    // 实际项目中替换为真实 API
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    
    if (!response.ok) {
      throw new Error('用户名或密码错误');
    }
    
    const data = await response.json();
    // 存储 token
    localStorage.setItem('token', data.token);
    message.success('登录成功！');
  };

  const handleForgotPassword = () => {
    // 跳转到忘记密码页面
    window.location.href = '/forgot-password';
  };

  const handleRegister = () => {
    // 跳转到注册页面
    window.location.href = '/register';
  };

  // 第三方登录配置
  const socialLogins = [
    {
      key: 'wechat',
      icon: <WechatOutlined style={{ color: '#07c160' }} />,
      label: '微信登录',
      onClick: () => {
        console.log('微信登录');
        // 调用微信 OAuth
      },
    },
    {
      key: 'alipay',
      icon: <AlipayCircleOutlined style={{ color: '#1677ff' }} />,
      label: '支付宝登录',
      onClick: () => {
        console.log('支付宝登录');
        // 调用支付宝 OAuth
      },
    },
    {
      key: 'github',
      icon: <GithubOutlined />,
      label: 'GitHub 登录',
      onClick: () => {
        console.log('GitHub 登录');
        // 调用 GitHub OAuth
      },
    },
  ];

  return (
    <div className={styles.loginFormWrapper}>
      <h2 style={{ textAlign: 'center', marginBottom: 32 }}>欢迎回来</h2>
      <LoginForm
        onSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
        onRegister={handleRegister}
        socialLogins={socialLogins}
        showSocialLogin={true}
        showRememberMe={true}
      />
    </div>
  );
};

// ============================================
// 使用示例 3: 弹窗式登录
// ============================================
export const ModalLogin: React.FC<{ 
  visible: boolean; 
  onClose: () => void;
  onSuccess: () => void;
}> = ({ visible, onClose, onSuccess }) => {
  const handleLogin = async (values: LoginFormData) => {
    // 登录逻辑
    console.log('登录:', values);
    onSuccess();
    onClose();
  };

  return (
    <div style={{ padding: 24 }}>
      <LoginForm
        onSubmit={handleLogin}
        showRememberMe={false}
        initialValues={{ username: '', password: '', remember: false }}
      />
    </div>
  );
};

// ============================================
// 使用示例 4: 受控表单（外部控制）
// ============================================
export const ControlledLogin: React.FC = () => {
  const [form] = Form.useForm();
  
  const handleLogin = async (values: LoginFormData) => {
    console.log('登录:', values);
  };

  // 外部重置表单
  const handleReset = () => {
    form.resetFields();
  };

  // 外部填充用户名
  const handleFillUsername = () => {
    form.setFieldsValue({ username: 'demo_user' });
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={handleReset}>重置表单</Button>
        <Button onClick={handleFillUsername} style={{ marginLeft: 8 }}>
          填充用户名
        </Button>
      </div>
      
      <LoginForm 
        form={form}
        onSubmit={handleLogin} 
      />
    </div>
  );
};

import { Button, Form } from 'antd';

// ============================================
// 默认导出 - 基础示例
// ============================================
export default BasicLogin;