/**
 * 告警规则页面
 */
import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, Switch, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface AlarmRule {
  id: string
  name: string
  type: string
  level: string
  condition: string
  threshold: number
  enabled: boolean
  notifyChannels: string[]
}

export default function AlarmRules() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  
  const rules: AlarmRule[] = [
    { id: '1', name: '超速告警', type: 'over_speed', level: 'major', condition: 'speed > threshold', threshold: 120, enabled: true, notifyChannels: ['sms', 'app'] },
    { id: '2', name: '低电量告警', type: 'low_battery', level: 'warning', condition: 'battery < threshold', threshold: 20, enabled: true, notifyChannels: ['app'] },
    { id: '3', name: '围栏越界告警', type: 'geo_fence', level: 'major', condition: 'out of fence', threshold: 0, enabled: true, notifyChannels: ['sms', 'app', 'email'] },
    { id: '4', name: '离线告警', type: 'offline', level: 'minor', condition: 'offline > threshold min', threshold: 30, enabled: true, notifyChannels: ['app'] },
    { id: '5', name: '紧急报警', type: 'emergency', level: 'critical', condition: 'emergency button', threshold: 0, enabled: true, notifyChannels: ['sms', 'app', 'phone'] },
  ]
  
  const columns = [
    { title: '规则名称', dataIndex: 'name', key: 'name' },
    { 
      title: '告警类型', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => <Tag>{type}</Tag>
    },
    { 
      title: '告警级别', 
      dataIndex: 'level', 
      key: 'level',
      render: (level: string) => {
        const colors: Record<string, string> = { critical: 'red', major: 'orange', minor: 'blue', warning: 'gold' }
        return <Tag color={colors[level]}>{level}</Tag>
      }
    },
    { title: '条件', dataIndex: 'condition', key: 'condition' },
    { title: '阈值', dataIndex: 'threshold', key: 'threshold', render: (v: number) => v || '-' },
    { 
      title: '状态', 
      dataIndex: 'enabled', 
      key: 'enabled',
      render: (enabled: boolean) => <Tag color={enabled ? 'success' : 'default'}>{enabled ? '启用' : '禁用'}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ]
  
  return (
    <div className="alarm-rules-page">
      <Card 
        title="告警规则配置"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>新增规则</Button>}
      >
        <Table columns={columns} dataSource={rules} rowKey="id" />
      </Card>
      
      <Modal
        title="新增告警规则"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="规则名称" rules={[{ required: true }]}>
            <Input placeholder="请输入规则名称" />
          </Form.Item>
          <Form.Item name="type" label="告警类型" rules={[{ required: true }]}>
            <Select options={[
              { label: '超速告警', value: 'over_speed' },
              { label: '低电量告警', value: 'low_battery' },
              { label: '围栏越界', value: 'geo_fence' },
              { label: '离线告警', value: 'offline' },
              { label: '紧急报警', value: 'emergency' },
            ]} />
          </Form.Item>
          <Form.Item name="level" label="告警级别" rules={[{ required: true }]}>
            <Select options={[
              { label: '严重', value: 'critical' },
              { label: '主要', value: 'major' },
              { label: '次要', value: 'minor' },
              { label: '警告', value: 'warning' },
            ]} />
          </Form.Item>
          <Form.Item name="threshold" label="阈值">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="enabled" label="启用状态" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}