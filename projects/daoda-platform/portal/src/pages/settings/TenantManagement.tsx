import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Typography,
  Space,
  Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { tenantService, Tenant } from '@/services/tenant.service'
import {
  PlusOutlined,
  EditOutlined,
  PauseOutlined,
  CaretRightOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

const { Title } = Typography
const { TextArea } = Input

export default function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const fetchTenants = async () => {
    setLoading(true)
    try {
      const data = await tenantService.getAll()
      setTenants(data)
    } catch (error) {
      message.error('获取租户列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  const handleAdd = () => {
    setEditingTenant(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record: Tenant) => {
    setEditingTenant(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该租户吗？此操作不可恢复。',
      onOk: async () => {
        try {
          await tenantService.delete(id)
          message.success('删除成功')
          fetchTenants()
        } catch (error) {
          message.error('删除失败')
        }
      },
    })
  }

  const handleSuspend = async (id: string, currentStatus: string) => {
    try {
      if (currentStatus === 'ACTIVE') {
        await tenantService.suspend(id)
        message.success('已暂停')
      } else {
        await tenantService.activate(id)
        message.success('已激活')
      }
      fetchTenants()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      if (editingTenant) {
        await tenantService.update(editingTenant.id, values)
        message.success('更新成功')
      } else {
        await tenantService.create(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      fetchTenants()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || '操作失败'
      message.error(errorMessage)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'green'
      case 'SUSPENDED':
        return 'orange'
      case 'EXPIRED':
        return 'red'
      default:
        return 'default'
    }
  }

  const columns: ColumnsType<Tenant> = [
    {
      title: '租户编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '租户名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: '计划',
      dataIndex: 'plan',
      key: 'plan',
      width: 150,
    },
    {
      title: '最大用户数',
      dataIndex: 'maxUsers',
      key: 'maxUsers',
      width: 120,
    },
    {
      title: '过期时间',
      dataIndex: 'expireAt',
      key: 'expireAt',
      width: 150,
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : '-'),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={
              record.status === 'ACTIVE' ? <PauseOutlined /> : <CaretRightOutlined />
            }
            onClick={() => handleSuspend(record.id, record.status)}
          >
            {record.status === 'ACTIVE' ? '暂停' : '激活'}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={4}>租户管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建租户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tenants}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title={editingTenant ? '编辑租户' : '新建租户'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'ACTIVE',
            maxUsers: 10,
          }}
        >
          <Form.Item
            name="code"
            label="租户编码"
            rules={[{ required: true, message: '请输入租户编码' }]}
          >
            <Input placeholder="例如: tenant-001" disabled={!!editingTenant} />
          </Form.Item>

          <Form.Item
            name="name"
            label="租户名称"
            rules={[{ required: true, message: '请输入租户名称' }]}
          >
            <Input placeholder="例如: 道达智能" />
          </Form.Item>

          <Form.Item name="logo" label="Logo URL">
            <Input placeholder="https://example.com/logo.png" />
          </Form.Item>

          <Form.Item name="plan" label="计划">
            <Select placeholder="选择计划">
              <Select.Option value="basic">基础版</Select.Option>
              <Select.Option value="standard">标准版</Select.Option>
              <Select.Option value="premium">专业版</Select.Option>
              <Select.Option value="enterprise">企业版</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="maxUsers"
            label="最大用户数"
            rules={[{ required: true, message: '请输入最大用户数' }]}
          >
            <Input type="number" min={1} placeholder="10" />
          </Form.Item>

          <Form.Item name="expireAt" label="过期时间">
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            getValueFromEvent={(checked) => (checked ? 'ACTIVE' : 'SUSPENDED')}
          >
            <Switch checkedChildren="激活" unCheckedChildren="暂停" />
          </Form.Item>

          <Form.Item name="config" label="配置">
            <TextArea rows={4} placeholder="JSON格式的配置信息" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={() => setModalOpen(false)}>取消</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
              {editingTenant ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
