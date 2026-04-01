/**
 * API密钥管理页面
 * 深色玻璃态风格 + 真实后端API调用
 */
import { useState, useEffect } from 'react'
import { Table, Card, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, message, Typography, Popconfirm, Switch, DatePicker, Spin, Empty } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined, EyeInvisibleOutlined, DeleteOutlined, CopyOutlined, ReloadOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { apiKeyService, type ApiKey, type CreateApiKeyDto } from '@/services/api-key.service'

const { Title, Text } = Typography
const { Option } = Select

export default function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [regenerateModalVisible, setRegenerateModalVisible] = useState(false)
  const [newKeyData, setNewKeyData] = useState<{ id: string; plainKey: string } | null>(null)
  const [form] = Form.useForm()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0 })

  // 加载 API Key 列表
  const fetchApiKeys = async () => {
    setLoading(true)
    try {
      const response = await apiKeyService.getList({ page: 1, pageSize: 100 })
      const list = (response as any).data?.list || (response as any).list || response || []
      setApiKeys(Array.isArray(list) ? list : [])
      
      // 计算统计
      const now = new Date()
      const active = list.filter((k: any) => k.enabled !== false && (!k.expiresAt || new Date(k.expiresAt) > now)).length
      const expired = list.filter((k: any) => k.expiresAt && new Date(k.expiresAt) <= now).length
      setStats({ total: list.length, active, expired })
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
      message.error('获取API密钥列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApiKeys()
  }, [])

  // 创建 API Key
  const handleCreate = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const dto: CreateApiKeyDto = {
        name: values.name,
        description: values.description,
        permissions: values.permissions || [],
        rateLimit: values.rateLimit || 1000,
        expiresAt: values.expiresAt ? values.expiresAt.toISOString() : undefined,
      }
      
      const result = await apiKeyService.create(dto)
      message.success('API密钥创建成功')
      setModalVisible(false)
      
      // 显示新生成的密钥
      if (result.plainKey || result.key) {
        setNewKeyData({ id: result.id, plainKey: result.plainKey || result.key })
        setRegenerateModalVisible(true)
      }
      
      fetchApiKeys()
    } catch (error) {
      console.error('Failed to create API key:', error)
      message.error('创建API密钥失败')
    }
  }

  // 重新生成密钥
  const handleRegenerate = async (id: string) => {
    try {
      const result = await apiKeyService.regenerate(id)
      message.success('密钥已重新生成')
      if (result.plainKey || result.key) {
        setNewKeyData({ id: result.id, plainKey: result.plainKey || result.key })
        setRegenerateModalVisible(true)
      }
      fetchApiKeys()
    } catch (error) {
      console.error('Failed to regenerate API key:', error)
      message.error('重新生成密钥失败')
    }
  }

  // 删除密钥
  const handleDelete = async (id: string) => {
    try {
      await apiKeyService.delete(id)
      message.success('密钥已删除')
      fetchApiKeys()
    } catch (error) {
      console.error('Failed to delete API key:', error)
      message.error('删除密钥失败')
    }
  }

  // 启用/禁用密钥
  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await apiKeyService.update(id, { } as any)
      message.success(enabled ? '密钥已启用' : '密钥已禁用')
      fetchApiKeys()
    } catch (error) {
      console.error('Failed to toggle API key:', error)
      message.error('操作失败')
    }
  }

  // 复制密钥
  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key)
    message.success('密钥已复制到剪贴板')
  }

  // 表格列定义
  const columns: ColumnsType<ApiKey> = [
    {
      title: '密钥名称',
      dataIndex: 'name',
      width: 180,
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: '密钥前缀',
      dataIndex: 'keyPrefix',
      width: 120,
      render: (prefix: string) => <Text code>{prefix || 'dk_'}****</Text>,
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      width: 150,
      render: (permissions: string[]) => (
        <Space size={4}>
          {permissions?.map(p => (
            <Tag key={p} color={p === 'admin' ? 'purple' : p === 'write' ? 'blue' : 'green'}>
              {p === 'read' ? '读' : p === 'write' ? '写' : p}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '频率限制',
      dataIndex: 'rateLimit',
      width: 100,
      render: (limit: number) => <Text>{limit || 1000}/h</Text>,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 80,
      render: (enabled: boolean, record: ApiKey) => {
        const isExpired = record.expiresAt && new Date(record.expiresAt) < new Date()
        return (
          <Tag color={isExpired ? 'red' : enabled !== false ? 'green' : 'orange'}>
            {isExpired ? '已过期' : enabled !== false ? '有效' : '已禁用'}
          </Tag>
        )
      },
    },
    {
      title: '最后使用',
      dataIndex: 'lastUsedAt',
      width: 140,
      render: (time: string) => time ? dayjs(time).format('MM-DD HH:mm') : '-',
    },
    {
      title: '过期时间',
      dataIndex: 'expireAt',
      width: 120,
      render: (time: string) => time ? dayjs(time).format('YYYY-MM-DD') : '永久',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: any) => (
        <Space size="small">
          <Switch
            size="small"
            checked={record.enabled !== false}
            onChange={(checked) => handleToggle(record.id, checked)}
          />
          <Button type="link" size="small" onClick={() => handleRegenerate(record.id)}>
            重新生成
          </Button>
          <Popconfirm
            title="确定删除此密钥吗？删除后无法恢复"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 过滤数据
  const filteredData = apiKeys.filter((item: any) =>
    item.name?.includes(searchKeyword) || item.prefix?.includes(searchKeyword)
  )

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">API密钥管理</Title>
          <Text type="secondary" className="page-header-subtitle">
            管理 API 访问密钥，控制接口调用权限
          </Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<ReloadOutlined />} onClick={fetchApiKeys}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建密钥
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6600ff 0%, #a855f7 100%)' }}>
              <Text style={{ fontSize: 24 }}>🔑</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">总密钥数</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#6600ff' }}>{stats.total}</Text>
              </div>
            </div>
          </div>
        </Card>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#fff' }} />
            </div>
            <div>
              <Text type="secondary" className="stat-label">有效密钥</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#22c55e' }}>{stats.active}</Text>
              </div>
            </div>
          </div>
        </Card>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <StopOutlined style={{ fontSize: 24, color: '#fff' }} />
            </div>
            <div>
              <Text type="secondary" className="stat-label">已过期</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#ef4444' }}>{stats.expired}</Text>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 搜索筛选区 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Input
            placeholder="搜索密钥名称"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>
      </Card>

      {/* 数据表格 */}
      <Card className="daoda-card">
        <Spin spinning={loading}>
          {filteredData.length === 0 && !loading ? (
            <Empty description="暂无API密钥" />
          ) : (
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
          )}
        </Spin>
      </Card>

      {/* 创建密钥弹窗 */}
      <Modal
        title="创建API密钥"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="创建"
        cancelText="取消"
        width={500}
        className="glass-modal"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="密钥名称" rules={[{ required: true, message: '请输入密钥名称' }]}>
            <Input placeholder="如：生产环境API密钥" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="请输入描述信息" />
          </Form.Item>
          <Form.Item name="permissions" label="权限">
            <Select mode="multiple" placeholder="请选择权限" allowClear>
              <Option value="read">读取 (Read)</Option>
              <Option value="write">写入 (Write)</Option>
              <Option value="admin">管理员 (Admin)</Option>
            </Select>
          </Form.Item>
          <Form.Item name="rateLimit" label="频率限制 (次/小时)" initialValue={1000}>
            <InputNumber min={100} max={100000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="expiresAt" label="过期时间">
            <DatePicker style={{ width: '100%' }} placeholder="留空表示永久有效" />
          </Form.Item>
        </Form>
        <div style={{ padding: 12, background: 'rgba(102, 0, 255, 0.1)', borderRadius: 8, marginTop: 8, border: '1px solid rgba(102, 0, 255, 0.2)' }}>
          <Text type="warning">
            ⚠️ 请妥善保管API密钥，创建后仅显示一次。密钥泄露可能导致数据安全风险。
          </Text>
        </div>
      </Modal>

      {/* 显示新生成密钥弹窗 */}
      <Modal
        title="密钥已生成"
        open={regenerateModalVisible}
        onOk={() => setRegenerateModalVisible(false)}
        onCancel={() => setRegenerateModalVisible(false)}
        okText="我已保存"
        cancelButtonProps={{ style: { display: 'none' } }}
        width={500}
        className="glass-modal"
      >
        <div style={{ padding: 16, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 8, marginBottom: 16, border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          <Text type="success" style={{ display: 'block', marginBottom: 8 }}>
            ✅ 密钥创建成功！请立即保存，此密钥仅显示一次。
          </Text>
        </div>
        <div style={{ padding: 16, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 8, fontFamily: 'monospace', wordBreak: 'break-all' }}>
          <Text copyable={{ text: newKeyData?.plainKey }} style={{ fontSize: 14 }}>
            {newKeyData?.plainKey}
          </Text>
        </div>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" icon={<CopyOutlined />} onClick={() => handleCopy(newKeyData?.plainKey || '')}>
            复制密钥
          </Button>
        </div>
      </Modal>
    </div>
  )
}