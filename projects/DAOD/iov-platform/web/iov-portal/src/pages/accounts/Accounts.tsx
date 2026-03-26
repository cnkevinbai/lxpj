/**
 * 子账号管理页面
 */
import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons'

interface SubAccount {
  id: string
  username: string
  name: string
  email: string
  phone: string
  role: string
  status: 'active' | 'inactive'
  lastLoginTime: string
}

export default function Accounts() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  
  const accounts: SubAccount[] = [
    { id: '1', username: 'admin', name: '系统管理员', email: 'admin@daoda.com', phone: '13800138001', role: '超级管理员', status: 'active', lastLoginTime: '2026-03-25 18:00:00' },
    { id: '2', username: 'operator01', name: '运维张三', email: 'zhangsan@daoda.com', phone: '13800138002', role: '运维人员', status: 'active', lastLoginTime: '2026-03-25 17:30:00' },
    { id: '3', username: 'operator02', name: '运维李四', email: 'lisi@daoda.com', phone: '13800138003', role: '运维人员', status: 'active', lastLoginTime: '2026-03-25 16:00:00' },
    { id: '4', username: 'viewer01', name: '查看员王五', email: 'wangwu@daoda.com', phone: '13800138004', role: '普通用户', status: 'inactive', lastLoginTime: '2026-03-20 10:00:00' },
  ]
  
  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '角色', dataIndex: 'role', key: 'role', render: (role: string) => <Tag>{role}</Tag> },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={status === 'active' ? 'success' : 'default'}>{status === 'active' ? '正常' : '已禁用'}</Tag>
    },
    { title: '最后登录', dataIndex: 'lastLoginTime', key: 'lastLoginTime' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<KeyOutlined />}>重置密码</Button>
          <Button type="link" size="small" danger>禁用</Button>
        </Space>
      ),
    },
  ]
  
  return (
    <div className="accounts-page">
      <Card 
        title="子账号管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>新增账号</Button>}
      >
        <Table columns={columns} dataSource={accounts} rowKey="id" />
      </Card>
      
      <Modal
        title="新增账号"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => { message.success('创建成功'); setModalOpen(false) }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select options={[
              { label: '管理员', value: 'admin' },
              { label: '运维人员', value: 'operator' },
              { label: '普通用户', value: 'user' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}