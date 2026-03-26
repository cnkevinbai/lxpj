import { useState } from 'react'
import { Form, Input, Button, Checkbox, Typography, Card, Space, Divider } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Title, Paragraph, Link: AntLink } = Typography

const Login = () => {
  const [loading, setLoading] = useState(false)

  const onFinish = (values: any) => {
    console.log('登录表单:', values)
    setLoading(true)
    // TODO: 调用登录 API
    setTimeout(() => {
      setLoading(false)
      alert('登录成功！跳转到数字化平台...')
      // TODO: 跳转到数字化平台首页
    }, 1500)
  }

  return (
    <div className="login-page">
      {/* 背景装饰 */}
      <div className="login-background">
        <div className="bg-circle circle-1" />
        <div className="bg-circle circle-2" />
        <div className="bg-circle circle-3" />
      </div>

      <div className="login-container">
        {/* Logo 区域 */}
        <div className="login-logo">
          <Title level={1} style={{ color: '#FFFFFF', margin: 0 }}>道达智能</Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            DAODA INTELLIGENT DIGITAL PLATFORM
          </Paragraph>
        </div>

        {/* 登录表单 */}
        <Card className="login-card">
          <div className="login-header">
            <Title level={2} style={{ margin: 0 }}>欢迎登录</Title>
            <Paragraph type="secondary">四川道达智能数字化平台</Paragraph>
          </div>

          <Form
            name="login"
            size="large"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名或邮箱' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="用户名/邮箱/手机号"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <div className="login-options">
                <Checkbox>记住我</Checkbox>
                <AntLink href="/forgot-password">忘记密码？</AntLink>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="login-btn"
              >
                登录
              </Button>
            </Form.Item>

            <div className="login-divider">
              <Divider>其他登录方式</Divider>
            </div>

            <div className="social-login">
              <Button shape="circle" size="large" icon={<UserOutlined />} />
              <Button shape="circle" size="large" icon={<MailOutlined />} />
              <Button shape="circle" size="large" icon={<PhoneOutlined />} />
            </div>

            <div className="login-footer">
              <Paragraph style={{ margin: 0 }}>
                还没有账号？<AntLink href="/register">立即注册</AntLink>
              </Paragraph>
              <Paragraph type="secondary" style={{ margin: '16px 0 0' }}>
                首次登录？请联系 IT 部门获取账号
              </Paragraph>
            </div>
          </Form>
        </Card>

        {/* 特性展示 */}
        <div className="login-features">
          <Card className="feature-card">
            <CheckCircleOutlined style={{ fontSize: 32, color: '#52C41A' }} />
            <Title level={4}>统一认证</Title>
            <Paragraph type="secondary">单点登录，访问所有系统</Paragraph>
          </Card>
          <Card className="feature-card">
            <CheckCircleOutlined style={{ fontSize: 32, color: '#1890FF' }} />
            <Title level={4}>安全可靠</Title>
            <Paragraph type="secondary">数据加密，全方位保护</Paragraph>
          </Card>
          <Card className="feature-card">
            <CheckCircleOutlined style={{ fontSize: 32, color: '#FAAD14' }} />
            <Title level={4}>高效便捷</Title>
            <Paragraph type="secondary">一站式工作台</Paragraph>
          </Card>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #050505 0%, #0A0A0A 50%, #001529 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .login-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 102, 255, 0.1) 0%, transparent 70%);
          animation: float 20s infinite;
        }

        .circle-1 {
          width: 600px;
          height: 600px;
          top: -200px;
          right: -200px;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 400px;
          height: 400px;
          bottom: -100px;
          left: -100px;
          animation-delay: -7s;
        }

        .circle-3 {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
          animation-delay: -14s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 30px) scale(1.05); }
        }

        .login-container {
          max-width: 1200px;
          width: 100%;
          position: relative;
          z-index: 10;
        }

        .login-logo {
          text-align: center;
          margin-bottom: 48px;
        }

        .login-card {
          max-width: 480px;
          margin: 0 auto;
          border: none;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-btn {
          height: 50px;
          font-size: 16px;
          background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%);
          border: none;
        }

        .login-btn:hover {
          box-shadow: 0 4px 20px rgba(0, 102, 255, 0.4);
        }

        .login-divider {
          margin: 24px 0;
        }

        .social-login {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .social-login .ant-btn {
          width: 50px;
          height: 50px;
          border: 1px solid #E0E0E0;
        }

        .login-footer {
          text-align: center;
        }

        .login-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1200px;
          margin: 64px auto 0;
        }

        .feature-card {
          text-align: center;
          border: none;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          color: #FFFFFF;
          transition: all 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.1);
        }

        .feature-card .ant-typography {
          color: #FFFFFF !important;
        }

        @media (max-width: 768px) {
          .login-features {
            grid-template-columns: 1fr;
          }
          
          .login-logo {
            margin-bottom: 32px;
          }
        }
      `}</style>
    </div>
  )
}

export default Login
