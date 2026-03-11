import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Select, Switch } from 'antd'
import apiClient from '../services/api'

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<any>({})
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/settings')
      const settingsObj = response.data.reduce((acc: any, item: any) => {
        acc[item.key] = item.value
        return acc
      }, {})
      setSettings(settingsObj)
      form.setFieldsValue(settingsObj)
    } catch (error) {
      console.error('加载设置失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const updates = Object.keys(values).map(key => 
        apiClient.put(`/settings/${key}`, { value: values[key] })
      )
      await Promise.all(updates)
      message.success('保存成功')
      fetchData()
    } catch (error: any) {
      message.error(error.response?.data?.message || '保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">系统设置</h1>

      <Card title="基本设置" className="mb-6">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="site.name" label="网站名称">
              <Input placeholder="请输入网站名称" />
            </Form.Item>
            <Form.Item name="site.title" label="网站标题">
              <Input placeholder="请输入网站标题" />
            </Form.Item>
            <Form.Item name="contact.phone" label="联系电话">
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item name="contact.email" label="联系邮箱">
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>
            <Form.Item name="contact.address" label="公司地址" className="col-span-2">
              <Input.TextArea rows={2} placeholder="请输入公司地址" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="邮件设置" className="mb-6">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="mail.host" label="SMTP 服务器">
              <Input placeholder="smtp.example.com" />
            </Form.Item>
            <Form.Item name="mail.port" label="端口">
              <Input placeholder="465" />
            </Form.Item>
            <Form.Item name="mail.user" label="邮箱账号">
              <Input placeholder="noreply@example.com" />
            </Form.Item>
            <Form.Item name="mail.from" label="发件人名称">
              <Input placeholder="EV Cart" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="短信设置" className="mb-6">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="sms.provider" label="短信服务商">
              <Select>
                <Select.Option value="aliyun">阿里云</Select.Option>
                <Select.Option value="tencent">腾讯云</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="sms.signName" label="签名">
              <Input placeholder="EV Cart" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Settings
