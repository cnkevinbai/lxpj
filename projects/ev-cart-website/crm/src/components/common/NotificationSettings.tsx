import React, { useState } from 'react'
import { Card, Switch, Form, Button, message, Select, Slider } from 'antd'
import { BellOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons'
import apiClient from '../../services/api'

const { Option } = Select

/**
 * 通知设置组件
 */
const NotificationSettings: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleSave = async (values: any) => {
    setLoading(true)
    try {
      await apiClient.put('/users/notification-settings', values)
      message.success('通知设置保存成功')
    } catch (error: any) {
      message.error(error.response?.data?.message || '保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="通知设置" className="mb-4">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          emailNotification: true,
          smsNotification: false,
          pushNotification: true,
          followupReminder: true,
          newLeadAlert: true,
          orderStatusAlert: true,
          reminderTime: 9,
        }}
        onFinish={handleSave}
      >
        <Form.Item label="通知渠道" className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MailOutlined className="text-lg" />
                <span>邮件通知</span>
              </div>
              <Form.Item name="emailNotification" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageOutlined className="text-lg" />
                <span>短信通知</span>
              </div>
              <Form.Item name="smsNotification" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellOutlined className="text-lg" />
                <span>推送通知</span>
              </div>
              <Form.Item name="pushNotification" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>
          </div>
        </Form.Item>

        <Form.Item label="提醒类型" className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>待跟进提醒</span>
              <Form.Item name="followupReminder" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>

            <div className="flex items-center justify-between">
              <span>新线索通知</span>
              <Form.Item name="newLeadAlert" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>

            <div className="flex items-center justify-between">
              <span>订单状态变更</span>
              <Form.Item name="orderStatusAlert" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>
          </div>
        </Form.Item>

        <Form.Item
          name="reminderTime"
          label="提醒时间 (小时)"
          extra="提前多少小时提醒待跟进事项"
        >
          <Slider min={1} max={24} marks={{ 1: '1h', 12: '12h', 24: '24h' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default NotificationSettings
