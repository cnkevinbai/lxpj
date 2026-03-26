/**
 * 租户管理页面
 */
import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'

interface Tenant {
  id: string
  name: string
  code: string
  contact: string
  phone: string
  status: 'active' | 'inactive'
  expireTime: string
  deviceLimit: number
  usedDevices: number
}

export default function Tenants() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  
  const tenants: Tenant[] = [
    { id: '1', name: '道达智能科技', code: 'DAOD', contact: '张经理', phone: '13800138000', status: 'active', expireTime: '2027-03-25', deviceLimit: 1000, usedDevices: 234 },
    { id: '2', name: '测试租户', code: 'TEST', contact: '李主管', phone: '13900139000', status: 'active', expireTime: '2026-06-30', deviceLimit: 100, usedDevices: 15 },
    { id: '3', name: '已过期租户', code: 'EXPIRED', contact: '王总', phone: '13700137000', status: 'inactive', expireTime: '2026-01-01', deviceLimit: 50, usedDevices: 0 },
  ]
  
  const columns = [
    { title: '租户名称', dataIndex: 'name', key: 'name' },
    { title: '租户编码', dataIndex: 'code', key: 'code' },
    { title: '联系人', dataIndex: 'contact', key: 'contact' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={status === 'active' ? 'success' : 'default'}>{status === 'active' ? '正常' : '已停用'}</Tag>
    },
    { title: '到期时间', dataIndex: 'expireTime', key: 'expireTime' },
    { 
      title: '设备配额', 
      key: 'quota',
      render: (_: any, r: Tenant) => `${r.usedDevices}/${r.deviceLimit}`
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small">配置</Button>
        </Space>
      ),
    },
  ]
  
  return (
    <div className="tenants-page">
      <Card 
        title="租户管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>新增租户</Button>}
      >
        <Table columns={columns} dataSource={tenants} rowKey="id" />
      </Card>
      
      <Modal
        title="新增租户"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => { message.success('创建成功'); setModalOpen(false) }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="租户名称" rules={[{ required: true }]}>
            <Input placeholder="请输入租户名称" />
          </Form.Item>
          <Form.Item name="code" label="租户编码" rules={[{ required: true }]}>
            <Input placeholder="请输入租户编码" />
          </Form.Item>
          <Form.Item name="contact" label="联系人" rules={[{ required: true }]}>
            <Input placeholder="请输入联系人" />
          </Form.Item>
          <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item name="deviceLimit" label="设备配额" initialValue={100}>
            <Input type="number" placeholder="设备数量上限" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}