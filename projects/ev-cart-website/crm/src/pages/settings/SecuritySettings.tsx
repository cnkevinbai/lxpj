import React, { useState } from 'react'
import { Form, Input, Button, Divider, Space, message, Alert } from 'antd'
import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons'

const SecuritySettings: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    setLoading(true)
    try {
      message.success('密码修改成功')
      form.resetFields()
    } catch (error) {
      message.error('修改失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>安全设置</h2>
      <p style={{ color: '#999', marginBottom: 24 }}>保障您的账户安全</p>

      <Alert
        message="安全提示"
        description="为了保障您的账户安全，请定期更换密码并开启双重验证"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Card title="修改密码" style={{ marginBottom: 16 }} extra={<LockOutlined />}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ maxWidth: 500 }}
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
              { min: 6, message: '密码长度不能少于 6 位' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
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
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                修改密码
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="双重验证" style={{ marginBottom: 16 }} extra={<SafetyCertificateOutlined />}>
        <Alert
          message="双重验证未开启"
          description="开启后，登录时需要输入手机验证码，提高账户安全性"
          type="warning"
          showIcon
          action={
            <Button size="small" type="primary">
              立即开启
            </Button>
          }
        />
      </Card>

      <Card title="登录设备管理">
        <Alert
          message="当前设备"
          description="四川省 眉山市 - Chrome 浏览器 - 2026-03-13 09:00"
          type="success"
          showIcon
        />
      </Card>
    </div>
  )
}

export default SecuritySettings
