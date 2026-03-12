import React, { useState } from 'react'
import { Form, Input, Button, message, Tabs, Checkbox } from 'antd'
import { UserOutlined, LockOutlined, QrcodeOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const Login: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      // 调用 CRM 登录 API
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (response.ok) {
        // 保存 token
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))

        message.success('登录成功')
        
        // 根据角色跳转
        if (data.user.role?.roleCode === 'admin') {
          router.push('/portal/admin')
        } else {
          router.push('/portal')
        }
      } else {
        message.error(data.message || '登录失败')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* 返回官网首页 */}
      <a 
        href="/" 
        style={{ 
          position: 'absolute', 
          top: 30, 
          left: 50, 
          color: '#fff', 
          textDecoration: 'none',
          fontSize: 16
        }}
      >
        ← 返回首页
      </a>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ 
          width: 440,
          background: '#fff',
          borderRadius: 16,
          padding: 48,
          boxShadow: '0 16px 48px rgba(0,0,0,0.3)'
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>四川道达智能</h1>
          <p style={{ fontSize: 14, color: '#999' }}>企业数字化管理系统</p>
        </div>

        {/* 登录表单 */}
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名/邮箱/手机号"
              style={{ height: 48 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码"
              style={{ height: 48 }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)}>
                记住我
              </Checkbox>
              <a href="#" style={{ color: '#1890ff' }}>忘记密码？</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{ height: 48, borderRadius: 24 }}
              block
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <a href="#" style={{ color: '#1890ff', fontSize: 14 }}>
              还没有账号？立即注册
            </a>
          </div>
        </Form>

        {/* 其他登录方式 */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: 14, marginBottom: 16 }}>其他登录方式</p>
          <Button 
            icon={<QrcodeOutlined />} 
            size="large"
            style={{ borderRadius: 24 }}
          >
            扫码登录
          </Button>
        </div>
      </motion.div>

      {/* 系统入口 */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: 'absolute',
          right: 50,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          padding: 32,
          color: '#fff'
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, textAlign: 'center' }}>
          系统入口
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <a 
            href="/portal/crm"
            style={{
              padding: '16px 32px',
              background: 'rgba(24,144,255,0.2)',
              borderRadius: 12,
              color: '#fff',
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>CRM 系统</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>客户/订单/经销商</div>
          </a>

          <a 
            href="/portal/erp"
            style={{
              padding: '16px 32px',
              background: 'rgba(114,46,209,0.2)',
              borderRadius: 12,
              color: '#fff',
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>🏭</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>ERP 系统</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>采购/生产/库存</div>
          </a>

          <a 
            href="/portal/service"
            style={{
              padding: '16px 32px',
              background: 'rgba(82,196,26,0.2)',
              borderRadius: 12,
              color: '#fff',
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔧</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>售后管理</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>工单/维修/反馈</div>
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
