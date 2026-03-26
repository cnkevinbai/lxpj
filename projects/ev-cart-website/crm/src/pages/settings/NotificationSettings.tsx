import React, { useState } from 'react'
import { Form, Switch, Divider, Card, Space, Button, message, Select } from 'antd'

const { Option } = Select

const NotificationSettings: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      message.success('保存成功')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>通知设置</h2>
      <p style={{ color: '#999', marginBottom: 24 }}>配置系统通知和消息提醒</p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          emailNotification: true,
          smsNotification: false,
          systemNotification: true,
          orderNotify: true,
          customerNotify: true,
          financeNotify: true,
          inventoryNotify: false,
        }}
      >
        <Card title="通知方式" style={{ marginBottom: 16 }}>
          <Form.Item
            name="emailNotification"
            label="邮件通知"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="smsNotification"
            label="短信通知"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="systemNotification"
            label="系统内通知"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>
        </Card>

        <Card title="业务通知" style={{ marginBottom: 16 }}>
          <Form.Item
            name="orderNotify"
            label="订单通知"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item
            name="customerNotify"
            label="客户动态"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item
            name="financeNotify"
            label="财务提醒"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item
            name="inventoryNotify"
            label="库存预警"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>

        <Card title="通知时间" style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="免打扰开始时间">
              <Select defaultValue="22:00">
                <Option value="20:00">20:00</Option>
                <Option value="21:00">21:00</Option>
                <Option value="22:00">22:00</Option>
                <Option value="23:00">23:00</Option>
              </Select>
            </Form.Item>

            <Form.Item label="免打扰结束时间">
              <Select defaultValue="08:00">
                <Option value="07:00">07:00</Option>
                <Option value="08:00">08:00</Option>
                <Option value="09:00">09:00</Option>
              </Select>
            </Form.Item>
          </div>
        </Card>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default NotificationSettings
