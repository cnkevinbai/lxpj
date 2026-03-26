/**
 * 登录页面
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Checkbox, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import authService, { LoginDto } from '@/services/auth.service'
import { useTenantStore } from '@/stores/tenantStore'
import './Login.css'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const fetchTenants = useTenantStore.getState().fetchTenants

  const handleSubmit = async (values: LoginDto) => {
    setLoading(true)
    
    try {
      const response = await authService.login(values)
      
      // 存储 JWT Token
      localStorage.setItem('token', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      // 可选：存储用户信息（注意：敏感信息应谨慎存储）
      localStorage.setItem('user', JSON.stringify(response.user))
      
      message.success('登录成功')
      
      // 加载租户列表
      await fetchTenants()
      
      navigate('/dashboard', { replace: true })
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || '登录失败，请检查用户名和密码'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <Card className="login-card">
        <div className="login-header">
          <h1>道达智能数字化平台</h1>
          <p>企业级数字化管理解决方案</p>
        </div>

        <Form
          name="login"
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱地址' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="邮箱地址" 
              type="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="/forgot-password">
              忘记密码？
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
          
          <div className="login-footer" style={{ textAlign: 'center', marginTop: '16px' }}>
            <span>还没有账号？</span>
            <a href="/register">立即注册</a>
          </div>
        </Form>

        <div className="login-footer">
          <p>© 2026 道达智能车辆制造有限公司</p>
        </div>
      </Card>
    </div>
  )
}