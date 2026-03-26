import { useState } from 'react'
import { Form, Input, Button, Checkbox, Typography, Card, Space, Steps, message } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('注册表单:', values)
    setLoading(true)
    // TODO: 调用注册 API
    setTimeout(() => {
      setLoading(false)
      setCurrentStep(1)
    }, 1500)
  }

  return (
    <div className="register-page">
      <div className="register-background">
        <div className="bg-circle circle-1" />
        <div className="bg-circle circle-2" />
      </div>

      <div className="register-container">
        {/* Logo */}
        <div className="register-logo">
          <Title level={1} style={{ color: '#FFFFFF', margin: 0 }}>道达智能</Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            数字化平台账号注册
          </Paragraph>
        </div>

        {currentStep === 0 ? (
          <Card className="register-card">
            <div className="register-header">
              <Title level={2} style={{ margin: 0 }}>创建账号</Title>
              <Paragraph type="secondary">填写以下信息完成注册</Paragraph>
            </div>

            <Steps
              current={0}
              size="small"
              items={[
                { title: '填写信息' },
                { title: '验证邮箱' },
                { title: '完成' },
              ]}
              style={{ marginBottom: 32 }}
            />

            <Form
              form={form}
              name="register"
              size="large"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                name="companyName"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="公司名称"
                />
              </Form.Item>

              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="邮箱"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="手机号"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 8, message: '密码长度至少 8 位' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="密码（至少 8 位）"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'))
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="确认密码"
                />
              </Form.Item>

              <Form.Item
                name="agree"
                valuePropName="checked"
                rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('请同意协议') }]}
              >
                <Checkbox>
                  我已阅读并同意 <a href="/terms">《服务条款》</a> 和 <a href="/privacy">《隐私政策》</a>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  className="register-btn"
                >
                  立即注册
                </Button>
              </Form.Item>

              <div className="register-footer">
                <Paragraph style={{ margin: 0 }}>
                  已有账号？<a href="/login">立即登录</a>
                </Paragraph>
              </div>
            </Form>
          </Card>
        ) : (
          <Card className="register-card">
            <div className="success-content">
              <CheckCircleOutlined style={{ fontSize: 80, color: '#52C41A', marginBottom: 24 }} />
              <Title level={2}>注册成功！</Title>
              <Paragraph style={{ fontSize: 16, color: '#666' }}>
                我们已向您的邮箱发送了验证邮件<br />
                请点击邮件中的链接完成验证
              </Paragraph>
              <Space size="large" style={{ marginTop: 32 }}>
                <Button size="large">重新发送验证邮件</Button>
                <Button type="primary" size="large" href="/login">
                  前往登录
                </Button>
              </Space>
            </div>
          </Card>
        )}
      </div>

      <style>{`
        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #050505 0%, #0A0A0A 50%, #001529 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .register-background {
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
          width: 500px;
          height: 500px;
          top: -150px;
          right: -150px;
        }

        .circle-2 {
          width: 400px;
          height: 400px;
          bottom: -100px;
          left: -100px;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }

        .register-container {
          max-width: 600px;
          width: 100%;
          position: relative;
          z-index: 10;
        }

        .register-logo {
          text-align: center;
          margin-bottom: 40px;
        }

        .register-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }

        .register-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .register-btn {
          height: 50px;
          font-size: 16px;
          background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%);
          border: none;
        }

        .register-btn:hover {
          box-shadow: 0 4px 20px rgba(0, 102, 255, 0.4);
        }

        .register-footer {
          text-align: center;
          margin-top: 16px;
        }

        .success-content {
          text-align: center;
          padding: 40px 20px;
        }

        @media (max-width: 768px) {
          .register-container {
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  )
}

export default Register
