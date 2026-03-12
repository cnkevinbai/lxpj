import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Avatar, Upload } from 'antd'
import { UserOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import PortalLayout from '../../components/PortalLayout'

const { TextArea } = Input

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        setUser(user)
        form.setFieldsValue(user)
      }
    } catch (error) {
      console.error('Load profile failed:', error)
    }
  }

  const handleUpdate = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/portal/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success('个人信息已更新')
        // 更新本地存储
        const userData = localStorage.getItem('user')
        if (userData) {
          localStorage.setItem('user', JSON.stringify({ ...JSON.parse(userData), ...values }))
        }
      } else {
        message.error('更新失败')
      }
    } catch (error) {
      message.error('网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PortalLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>个人信息</h1>

        {/* 头像 */}
        <Card style={{ marginBottom: 24, textAlign: 'center' }}>
          <div style={{ marginBottom: 16 }}>
            <Avatar 
              size={120} 
              icon={<UserOutlined />} 
              src={user?.avatar}
              style={{ backgroundColor: '#1890ff' }}
            />
          </div>
          <Upload showUploadList={false}>
            <Button icon={<UploadOutlined />}>更换头像</Button>
          </Upload>
        </Card>

        {/* 基本信息 */}
        <Card title="基本信息">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            initialValues={user}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="realName"
              label="真实姓名"
              rules={[{ required: true, message: '请输入真实姓名' }]}
            >
              <Input placeholder="请输入真实姓名" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="联系电话"
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>

            <Form.Item
              name="email"
              label="联系邮箱"
              rules={[
                { required: true, message: '请输入联系邮箱' },
                { type: 'email', message: '请输入正确的邮箱格式' }
              ]}
            >
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>

            <Form.Item
              name="company"
              label="公司名称"
            >
              <Input placeholder="请输入公司名称" />
            </Form.Item>

            <Form.Item
              name="address"
              label="联系地址"
            >
              <TextArea rows={3} placeholder="请输入联系地址" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                icon={<SaveOutlined />}
                loading={loading}
              >
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </PortalLayout>
  )
}

export default Profile
