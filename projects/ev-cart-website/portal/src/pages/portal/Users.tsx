import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Tag, Space, Modal, Form, Input, Select, Switch, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import apiClient from '../../services/api'

const Users: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<any[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [userRes, roleRes] = await Promise.all([
        apiClient.get('/users'),
        apiClient.get('/roles')
      ])
      setData(userRes.data)
      setRoles(roleRes.data)
    } catch (error) {
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = async (values: any) => {
    try {
      if (editingId) {
        await apiClient.put(`/users/${editingId}`, values)
        message.success('更新成功')
      } else {
        await apiClient.post('/users', values)
        message.success('创建成功')
      }
      setModalVisible(false)
      setEditingId(null)
      form.resetFields()
      fetchData()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  const handleEdit = (record: any) => {
    setEditingId(record.id)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/users/${id}`)
      message.success('删除成功')
      fetchData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const color = role === 'admin' ? 'red' : role === 'manager' ? 'orange' : role === 'sales' ? 'blue' : 'green'
        return <Tag color={color}>{role === 'admin' ? '管理员' : role === 'manager' ? '经理' : role === 'sales' ? '销售' : '客服'}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'gray'}>{status === 'active' ? '正常' : '禁用'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" icon={<UserOutlined />}>详情</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          {record.role !== 'admin' && (
            <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
              <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingId(null)
            form.resetFields()
            setModalVisible(true)
          }}
        >
          新建用户
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title={editingId ? '编辑用户' : '新建用户'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingId(null)
          form.resetFields()
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="username" label="用户名" rules={[{ required: !editingId }]}>
            <Input placeholder="请输入用户名" disabled={!!editingId} />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          {!editingId && (
            <Form.Item name="password" label="密码" rules={[{ required: true, min: 6 }]}>
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select>
              {roles.map(role => (
                <Select.Option key={role.id} value={role.name}>
                  {role.name === 'admin' ? '管理员' : role.name === 'manager' ? '经理' : role.name === 'sales' ? '销售' : '客服'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
              <Select.Option value="active">正常</Select.Option>
              <Select.Option value="inactive">禁用</Select.Option>
              <Select.Option value="locked">锁定</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Users
