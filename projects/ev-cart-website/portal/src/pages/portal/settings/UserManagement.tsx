import React, { useState } from 'react'
import { Table, Button, Space, Tag, Modal, Form, Input, Select, Switch, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons'

const { Option } = Select

interface User {
  id: string
  username: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: string
  lastLogin: string
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      name: '管理员',
      email: 'admin@evcart.com',
      phone: '13800138000',
      role: '超级管理员',
      department: '技术部',
      status: 'active',
      lastLogin: '2026-03-13 09:00',
    },
    {
      id: '2',
      username: 'zhangsan',
      name: '张三',
      email: 'zhangsan@evcart.com',
      phone: '13900139000',
      role: '销售经理',
      department: '销售部',
      status: 'active',
      lastLogin: '2026-03-13 08:30',
    },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    locked: 'error',
  }

  const statusLabels: Record<string, string> = {
    active: '正常',
    inactive: '禁用',
    locked: '锁定',
  }

  const handleCreate = async () => {
    try {
      message.success('创建用户成功')
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('创建失败')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.setFieldsValue(user)
    setModalVisible(true)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
    message.success('删除成功')
  }

  const handleResetPassword = (id: string) => {
    message.success('密码已重置为 123456')
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
    },
    {
      title: '手机',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status] || status}</Tag>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<ResetOutlined />}
            onClick={() => handleResetPassword(record.id)}
          >
            重置密码
          </Button>
          <Popconfirm
            title="确定删除该用户吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingUser(null)
            form.resetFields()
            setModalVisible(true)
          }}
        >
          新建用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" disabled={!!editingUser} />
            </Form.Item>

            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="手机"
              rules={[{ required: true, message: '请输入手机号' }]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>

            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="请选择角色">
                <Option value="admin">超级管理员</Option>
                <Option value="manager">部门经理</Option>
                <Option value="sales">销售经理</Option>
                <Option value="service">客服</Option>
                <Option value="finance">财务</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="department"
              label="部门"
              rules={[{ required: true, message: '请选择部门' }]}
            >
              <Select placeholder="请选择部门">
                <Option value="tech">技术部</Option>
                <Option value="sales">销售部</Option>
                <Option value="service">客服部</Option>
                <Option value="finance">财务部</Option>
                <Option value="hr">人力资源部</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="状态"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="正常"
                unCheckedChildren="禁用"
                defaultChecked
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement
