# LoginForm 登录表单组件

一个功能完整、可扩展的 React 登录表单组件，基于 Ant Design 5 开发。

## ✨ 特性

- ✅ **完整的表单验证** - 用户名格式、密码长度验证
- ✅ **密码显示/隐藏** - 安全的密码输入体验
- ✅ **记住登录状态** - 可选的持久化登录
- ✅ **防重复提交** - 内置加载状态管理
- ✅ **第三方登录支持** - 可扩展的社交登录
- ✅ **TypeScript 支持** - 完整的类型定义
- ✅ **受控/非受控模式** - 灵活的表单控制方式
- ✅ **暗色主题适配** - 自动适配系统主题

## 📦 安装依赖

```bash
npm install antd @ant-design/icons
# 或
pnpm add antd @ant-design/icons
```

## 🚀 基础使用

```tsx
import LoginForm, { type LoginFormData } from './components/LoginForm';

function LoginPage() {
  const handleLogin = async (values: LoginFormData) => {
    console.log('登录:', values);
    // 调用登录 API
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    
    if (response.ok) {
      // 登录成功
      window.location.href = '/dashboard';
    }
  };

  return (
    <LoginForm 
      onSubmit={handleLogin}
      onForgotPassword={() => navigate('/forgot-password')}
      onRegister={() => navigate('/register')}
    />
  );
}
```

## 📚 API 文档

### LoginFormProps

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `onSubmit` | 登录提交回调 | `(values: LoginFormData) => Promise<void> \| void` | - |
| `onForgotPassword` | 忘记密码回调 | `() => void` | - |
| `onRegister` | 注册回调 | `() => void` | - |
| `socialLogins` | 第三方登录配置 | `SocialLoginItem[]` | `[]` |
| `showRememberMe` | 显示记住我选项 | `boolean` | `true` |
| `showSocialLogin` | 显示第三方登录 | `boolean` | `false` |
| `loading` | 外部控制加载状态 | `boolean` | `false` |
| `initialValues` | 表单初始值 | `Partial<LoginFormData>` | - |
| `className` | 自定义样式类名 | `string` | - |
| `form` | 自定义表单实例 | `FormInstance<LoginFormData>` | - |

### LoginFormData

| 字段 | 类型 | 说明 |
|------|------|------|
| `username` | `string` | 用户名（3-20字符，字母开头） |
| `password` | `string` | 密码（至少6字符） |
| `remember` | `boolean` | 是否记住登录 |

### SocialLoginItem

| 字段 | 类型 | 说明 |
|------|------|------|
| `key` | `string` | 唯一标识 |
| `icon` | `ReactNode` | 图标组件 |
| `label` | `string` | 显示文本 |
| `onClick` | `() => void` | 点击回调 |

## 🎨 使用示例

### 完整功能示例

```tsx
import { WechatOutlined, GithubOutlined } from '@ant-design/icons';
import LoginForm from './components/LoginForm';

function LoginPage() {
  const socialLogins = [
    {
      key: 'wechat',
      icon: <WechatOutlined style={{ color: '#07c160' }} />,
      label: '微信登录',
      onClick: () => handleWechatLogin(),
    },
    {
      key: 'github',
      icon: <GithubOutlined />,
      label: 'GitHub 登录',
      onClick: () => handleGithubLogin(),
    },
  ];

  return (
    <LoginForm
      onSubmit={handleLogin}
      onForgotPassword={() => navigate('/forgot-password')}
      onRegister={() => navigate('/register')}
      socialLogins={socialLogins}
      showSocialLogin={true}
    />
  );
}
```

### 受控表单示例

```tsx
import { Form, Button } from 'antd';
import LoginForm from './components/LoginForm';

function ControlledLogin() {
  const [form] = Form.useForm();

  // 外部控制表单
  const handleReset = () => form.resetFields();
  const handleFillDemo = () => {
    form.setFieldsValue({ username: 'demo', password: '123456' });
  };

  return (
    <>
      <Button onClick={handleReset}>重置</Button>
      <Button onClick={handleFillDemo}>填充演示</Button>
      <LoginForm form={form} onSubmit={handleLogin} />
    </>
  );
}
```

## 🎯 表单验证规则

| 字段 | 规则 |
|------|------|
| 用户名 | 必填，3-20字符，字母开头，仅允许字母、数字、下划线 |
| 密码 | 必填，至少6字符 |
| 记住我 | 可选，布尔值 |

## 🔧 自定义样式

组件支持通过 `className` 属性自定义样式，也可以直接修改 `index.module.less` 文件。

```tsx
import LoginForm from './components/LoginForm';
import './custom-login.css';

<LoginForm className="my-custom-login" />
```

## 📝 注意事项

1. **错误处理**: 组件内置错误处理，会自动显示 `message.error` 提示
2. **加载状态**: 提交时自动禁用表单，防止重复提交
3. **表单验证**: 支持实时验证和失焦验证两种模式
4. **安全建议**: 生产环境中密码应通过 HTTPS 传输

## 📄 文件结构

```
LoginForm/
├── index.tsx           # 主组件
├── types.ts            # 类型定义
├── index.module.less   # 样式文件
├── examples.tsx        # 使用示例
└── README.md           # 文档
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 License

MIT