import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Tag, Space, Modal, Form, Input, Switch, Checkbox, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyOutlined } from '@ant-design/icons'
import apiClient from '../services/api'

const { TextArea } = Input

// 系统权限列表
const PERMISSIONS = [
  { label: '客户管理', value: 'customers' },
  { label: '线索管理', value: 'leads' },
  { label: '商机管理', value: 'opportunities' },
  { label: '订单管理', value: 'orders' },
  { label: '产品管理', value: 'products' },
  { label: '经销商管理', value: 'dealers' },
  { label: '招聘管理', value: 'jobs' },
  { label: '系统设置', value: 'settings' },
  { label: '用户管理', value: 'users' },
  { label: '角色管理', value: 'roles' },
]

const Roles: React.FC = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/roles')
      setData(response.data)
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
        await apiClient.put(`/roles/${editingId}`, values)
        message.success('更新成功')
      } else {
        await apiClient.post('/roles', values)
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
    form.setFieldsValue({
      ...record,
      permissions: record.permissions.filter((p: string) => p !== '*'),
    })
    setModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/roles/${id}`)
      message.success('删除成功')
      fetchData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <strong>{name === 'admin' ? '管理员' : name === 'manager' ? '经理' : name === 'sales' ? '销售' : '客服'}</strong>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space size="small">
          {permissions.includes('*') ? (
            <Tag color="red">全部权限</Tag>
          ) : (
            permissions.slice(0, 3).map(p => <Tag key={p}>{p}</Tag>)
          )}
          {permissions.length > 3 && <Tag color="blue">+{permissions.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'gray'}>{isActive ? '启用' : '禁用'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" icon={<SafetyOutlined />}>权限</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          {record.name !== 'admin' && (
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
        <h1 className="text-2xl font-bold">角色管理</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingId(null)
            form.resetFields()
            setModalVisible(true)
          }}
        >
          新建角色
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
        title={editingId ? '编辑角色' : '新建角色'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingId(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
            <Input placeholder="请输入角色名称" disabled={!!editingId} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={2} placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item name="permissions" label="权限">
            <Checkbox.Group>
              <div className="grid grid-cols-2 gap-2">
                {PERMISSIONS.map(p => (
                  <Checkbox key={p.value} value={p.value}>{p.label}</Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="isActive" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
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

export default Roles
