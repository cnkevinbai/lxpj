import React, { useState } from 'react'
import { Card, Form, Input, Button, Switch, Table, Space, Tag, message, Modal, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons'
import apiClient from '../../services/api'

const { TextArea } = Input

const Integration: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm()

  const integrations = [
    {
      id: 1,
      platform: 'dingtalk',
      name: '钉钉',
      webhook: 'https://oapi.dingtalk.com/robot/send?access_token=xxx',
      events: ['新线索', '订单变更', '商机阶段变更'],
      status: true,
    },
    {
      id: 2,
      platform: 'wecom',
      name: '企业微信',
      webhook: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx',
      events: ['新线索', '订单变更'],
      status: true,
    },
    {
      id: 3,
      platform: 'feishu',
      name: '飞书',
      webhook: 'https://open.feishu.cn/open-apis/bot/v2/hook/xxx',
      events: ['新线索', '审批通知'],
      status: false,
    },
    {
      id: 4,
      type: 'email',
      name: '邮件服务',
      config: {
        host: 'smtp.qq.com',
        port: 465,
        user: 'noreply@daoda-auto.com',
      },
      events: ['验证码', '新线索通知'],
      status: true,
    },
    {
      id: 5,
      type: 'sms',
      name: '短信服务',
      config: {
        provider: 'aliyun',
        signName: '四川道达智能',
      },
      events: ['验证码', '新线索通知'],
      status: true,
    },
    {
      id: 6,
      type: 'oss',
      name: '对象存储',
      config: {
        provider: 'aliyun',
        bucket: 'daoda-auto',
        region: 'oss-cn-shanghai',
      },
      events: ['文件上传', '图片存储'],
      status: true,
    },
  ]

  const handleSave = async (values: any) => {
    try {
      // TODO: 调用 API 保存集成配置
      message.success('保存成功')
      setModalVisible(false)
      form.resetFields()
    } catch (error: any) {
      message.error(error.response?.data?.message || '保存失败')
    }
  }

  const testWebhook = async (platform: string, webhook: string) => {
    try {
      const content = {
        title: '🧪 集成测试',
        content: '这是一条测试消息，如果您收到说明集成配置正确。',
        footer: `测试时间：${new Date().toLocaleString()}`,
      }

      let response
      if (platform === 'dingtalk') {
        response = await apiClient.post('/integration/dingtalk/send', { webhook, content })
      } else if (platform === 'wecom') {
        response = await apiClient.post('/integration/wecom/send', { webhook, content })
      }

      if (response?.data.success) {
        message.success('测试消息发送成功')
      } else {
        message.error('测试消息发送失败')
      }
    } catch (error: any) {
      message.error('测试失败：' + (error.response?.data?.message || error.message))
    }
  }

  const columns = [
    {
      title: '平台',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Webhook',
      dataIndex: 'webhook',
      key: 'webhook',
      ellipsis: true,
    },
    {
      title: '通知事件',
      dataIndex: 'events',
      key: 'events',
      render: (events: string[]) => (
        <Space>
          {events.map(event => <Tag key={event}>{event}</Tag>)}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'gray'}>{status ? '已启用' : '已禁用'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<LinkOutlined />}
            onClick={() => testWebhook(record.platform, record.webhook)}
          >
            测试
          </Button>
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">第三方集成</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setModalVisible(true)}
        >
          添加集成
        </Button>
      </div>

      <Card title="集成说明" className="mb-6">
        <div className="space-y-2 text-sm text-gray-600">
          <p>✅ 支持钉钉、企业微信、飞书等主流协作平台</p>
          <p>✅ 新线索自动通知销售团队</p>
          <p>✅ 订单状态变更实时推送</p>
          <p>✅ 支持自定义 Webhook 地址</p>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={integrations}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title="添加集成"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingId(null)
          form.resetFields()
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="platform" label="平台" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="dingtalk">钉钉</Select.Option>
              <Select.Option value="wecom">企业微信</Select.Option>
              <Select.Option value="feishu">飞书</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="webhook" 
            label="Webhook 地址" 
            rules={[{ required: true, type: 'url' }]}
          >
            <Input placeholder="请输入 Webhook 地址" />
          </Form.Item>
          <Form.Item name="events" label="通知事件" rules={[{ required: true }]}>
            <Select mode="multiple">
              <Select.Option value="新线索">新线索</Select.Option>
              <Select.Option value="订单变更">订单变更</Select.Option>
              <Select.Option value="商机阶段变更">商机阶段变更</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="启用" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Integration
