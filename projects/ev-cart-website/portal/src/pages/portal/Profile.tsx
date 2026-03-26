import React, { useState } from 'react'
import { Card, Form, Input, Button, Avatar, message, Upload } from 'antd'
import { UserOutlined, UploadOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import apiClient from '../../services/api'

/**
 * 个人中心页面
 */
const Profile: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleUpdateProfile = async (values: any) => {
    setLoading(true)
    try {
      await apiClient.put('/users/profile', values)
      message.success('个人信息更新成功')
    } catch (error: any) {
      message.error(error.response?.data?.message || '更新失败')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (values: any) => {
    setLoading(true)
    try {
      await apiClient.post('/auth/change-password', values)
      message.success('密码修改成功')
      form.resetFields(['oldPassword', 'newPassword', 'confirmPassword'])
    } catch (error: any) {
      message.error(error.response?.data?.message || '修改失败')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadAvatar = async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      await apiClient.post('/users/avatar', formData)
      message.success('头像上传成功')
      // TODO: 刷新用户信息
    } catch (error: any) {
      message.error(error.response?.data?.message || '上传失败')
    }

    return false // 阻止默认上传行为
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* 个人信息 */}
      <Card title="个人信息" className="mb-4">
        <div className="flex items-center gap-6 mb-6">
          <Avatar size={80} icon={<UserOutlined />} src={user?.avatarUrl} />
          <Upload
            showUploadList={false}
            beforeUpload={handleUploadAvatar}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>更换头像</Button>
          </Upload>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: user?.username,
            email: user?.email,
            phone: user?.phone,
          }}
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, type: 'email', message: '请输入有效的邮箱' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 修改密码 */}
      <Card title="修改密码">
        <Form
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少 6 位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Profile
