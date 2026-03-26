/**
 * 登录页面
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/services/auth'

const { Title, Text } = Typography

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  
  const loginMutation = useMutation({
    mutationFn: (values: LoginForm) => login(values.email, values.password),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      message.success('登录成功')
      navigate('/dashboard')
    },
    onError: () => {
      message.error('登录失败，请检查用户名和密码')
    },
  })
  
  const handleSubmit = (values: LoginForm) => {
    loginMutation.mutate(values)
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚗</div>
          <Title level={3} style={{ margin: 0 }}>道达智能车辆管理平台</Title>
          <Text type="secondary">车联网管理平台登录</Text>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ email: 'admin@daoda.com' }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="邮箱" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={loginMutation.isPending}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            © 2026 四川道达智能车辆制造有限公司
          </Text>
        </div>
      </Card>
    </div>
  )
}