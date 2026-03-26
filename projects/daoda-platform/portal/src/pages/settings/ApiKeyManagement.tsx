/**
 * API密钥管理页面
 * 统一UI风格
 */
import { useState } from 'react'
import { Table, Card, Button, Space, Tag, Modal, Form, Input, Select, message, Typography, Popconfirm } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined, EyeInvisibleOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

// 模拟API密钥数据
const mockApiKeys = [
  { 
    id: '1', 
    name: '生产环境API密钥', 
    key: 'sk_prod_abc123def456ghi789jkl', 
    permissions: ['read', 'write'], 
    status: 'ACTIVE', 
    lastUsed: '2024-03-19 10:30',
    expiresAt: '2025-03-19',
    createdAt: '2024-03-01',
  },
  { 
    id: '2', 
    name: '测试环境API密钥', 
    key: 'sk_test_xyz789uvw456rst123opq', 
    permissions: ['read'], 
    status: 'ACTIVE', 
    lastUsed: '2024-03-18 15:20',
    expiresAt: '2025-03-01',
    createdAt: '2024-03-01',
  },
  { 
    id: '3', 
    name: '第三方集成密钥', 
    key: 'sk_int_mno456pqr789stu123vwx', 
    permissions: ['read', 'write'], 
    status: 'EXPIRED', 
    lastUsed: '2024-02-28 09:00',
    expiresAt: '2024-03-01',
    createdAt: '2024-01-15',
  },
]

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  status: string
  lastUsed: string
  expiresAt: string
  createdAt: string
}

export default function ApiKeyManagement() {
  const [apiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  // 表格列定义
  const columns: ColumnsType<ApiKey> = [
    {
      title: '密钥名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: 'API密钥',
      dataIndex: 'key',
      width: 300,
      render: (key: string, record) => (
        <Space>
          <Text copyable={{ text: key }}>
            {showKeys[record.id] ? key : `${key.substring(0, 10)}...${key.substring(key.length - 6)}`}
          </Text>
          <Button 
            type="text" 
            size="small"
            icon={showKeys[record.id] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => setShowKeys({ ...showKeys, [record.id]: !showKeys[record.id] })}
          />
        </Space>
      ),
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      width: 150,
      render: (permissions: string[]) => (
        <Space>
          {permissions.map(p => (
            <Tag key={p} color={p === 'write' ? 'blue' : 'green'}>{p === 'read' ? '读' : '写'}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? '有效' : '已过期'}
        </Tag>
      ),
    },
    {
      title: '最后使用',
      dataIndex: 'lastUsed',
      width: 140,
    },
    {
      title: '过期时间',
      dataIndex: 'expiresAt',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => message.info('重新生成功能开发中')}>重新生成</a>
          <Popconfirm title="确定删除此密钥吗？" onConfirm={() => message.success('删除成功')}>
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 过滤数据
  const filteredData = apiKeys.filter(item => 
    item.name.includes(searchKeyword) || item.key.includes(searchKeyword)
  )

  const handleCreate = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      message.success('API密钥创建成功')
      setModalVisible(false)
    } catch (error) {
      // 表单验证失败
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">API密钥管理</Title>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建密钥
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
              <Text style={{ fontSize: 24 }}>🔑</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">总密钥数</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#1890ff' }}>3</Text>
              </div>
            </div>
          </div>
        </Card>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
              <Text style={{ fontSize: 24 }}>✅</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">有效密钥</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#52c41a' }}>2</Text>
              </div>
            </div>
          </div>
        </Card>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ backgroundColor: '#fff2f0', color: '#ff4d4f' }}>
              <Text style={{ fontSize: 24 }}>⚠️</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">已过期</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#ff4d4f' }}>1</Text>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 搜索筛选区 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Input
            placeholder="搜索密钥名称或密钥值"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
      </Card>

      {/* 数据表格 */}
      <Card className="daoda-card">
        <Table
          className="daoda-table"
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 创建密钥弹窗 */}
      <Modal
        title="创建API密钥"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="密钥名称" rules={[{ required: true }]}>
            <Input placeholder="请输入密钥名称，如：生产环境API密钥" />
          </Form.Item>
          <Form.Item name="permissions" label="权限" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="请选择权限" options={[
              { value: 'read', label: '读取 (Read)' },
              { value: 'write', label: '写入 (Write)' },
              { value: 'admin', label: '管理员 (Admin)' },
            ]} />
          </Form.Item>
          <Form.Item name="expiresAt" label="过期时间">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述信息" />
          </Form.Item>
        </Form>
        <div style={{ padding: 12, background: '#fffbe6', borderRadius: 8, marginTop: 8 }}>
          <Text type="warning">
            ⚠️ 请妥善保管API密钥，创建后仅显示一次。密钥泄露可能导致数据安全风险。
          </Text>
        </div>
      </Modal>
    </div>
  )
}