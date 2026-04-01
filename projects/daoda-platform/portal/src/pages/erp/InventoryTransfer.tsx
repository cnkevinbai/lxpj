/**
 * 库存调拨页面
 * 多仓库之间的库存转移管理
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Statistic,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Steps,
  Descriptions,
  Badge,
} from 'antd'
import {
  SwapOutlined,
  PlusOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select

interface Transfer {
  id: string
  transferNo: string
  productName: string
  fromWarehouseName: string
  toWarehouseName: string
  quantity: number
  status: 'DRAFT' | 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
}

export default function InventoryTransfer() {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null)
  const [form] = Form.useForm()
  const [stats, setStats] = useState({
    total: 0,
    byStatus: { draft: 0, pending: 0, inTransit: 0, completed: 0, cancelled: 0 },
  })

  useEffect(() => {
    fetchTransfers()
    fetchStats()
  }, [])

  const fetchTransfers = async () => {
    setLoading(true)
    const mockData: Transfer[] = [
      { id: '1', transferNo: 'TR001', productName: '电动观光车 X5', fromWarehouseName: '成都仓库', toWarehouseName: '北京仓库', quantity: 10, status: 'COMPLETED', createdAt: '2026-03-20' },
      { id: '2', transferNo: 'TR002', productName: '高尔夫球车 G3', fromWarehouseName: '深圳仓库', toWarehouseName: '上海仓库', quantity: 5, status: 'IN_TRANSIT', createdAt: '2026-03-28' },
      { id: '3', transferNo: 'TR003', productName: '儿童游乐车 C1', fromWarehouseName: '广州仓库', toWarehouseName: '成都仓库', quantity: 20, status: 'PENDING', createdAt: '2026-03-30' },
    ]
    setTransfers(mockData)
    setLoading(false)
  }

  const fetchStats = async () => {
    setStats({
      total: 3,
      byStatus: { draft: 0, pending: 1, inTransit: 1, completed: 1, cancelled: 0 },
    })
  }

  const handleCreate = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      console.log('Submit:', values)
      message.success('调拨单创建成功')
      setModalVisible(false)
      fetchTransfers()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleViewDetail = (record: Transfer) => {
    setSelectedTransfer(record)
    setDetailVisible(true)
  }

  const handleApprove = (id: string) => {
    Modal.confirm({
      title: '审批确认',
      content: '确定审批通过此调拨单吗？',
      onOk: () => {
        message.success('审批通过')
        fetchTransfers()
      },
    })
  }

  const handleComplete = (id: string) => {
    Modal.confirm({
      title: '完成确认',
      content: '确定完成此调拨单吗？将自动更新库存。',
      onOk: () => {
        message.success('调拨完成，库存已更新')
        fetchTransfers()
      },
    })
  }

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; icon: any; text: string }> = {
      DRAFT: { color: 'default', icon: <EditOutlined />, text: '草稿' },
      PENDING: { color: 'orange', icon: <ClockCircleOutlined />, text: '待审批' },
      IN_TRANSIT: { color: 'blue', icon: <TruckOutlined />, text: '运输中' },
      COMPLETED: { color: 'green', icon: <CheckCircleOutlined />, text: '已完成' },
      CANCELLED: { color: 'red', icon: <CloseCircleOutlined />, text: '已取消' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const columns: ColumnsType<Transfer> = [
    {
      title: '调拨单号',
      dataIndex: 'transferNo',
      width: 100,
    },
    {
      title: '产品',
      dataIndex: 'productName',
      width: 150,
    },
    {
      title: '调出仓库',
      dataIndex: 'fromWarehouseName',
      width: 120,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: '调入仓库',
      dataIndex: 'toWarehouseName',
      width: 120,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 80,
      render: (num: number) => <Text strong>{num}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 100,
      render: (date: string) => dayjs(date).format('MM-DD'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          {record.status === 'PENDING' && (
            <Button type="link" size="small" onClick={() => handleApprove(record.id)}>
              审批
            </Button>
          )}
          {record.status === 'IN_TRANSIT' && (
            <Button type="link" size="small" onClick={() => handleComplete(record.id)}>
              完成
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <SwapOutlined style={{ marginRight: 8 }} />
            库存调拨
          </Title>
          <Text type="secondary">多仓库之间的库存转移管理</Text>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建调拨单
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">调拨单总数</Text>}
              value={stats.total}
              prefix={<SwapOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">待审批</Text>}
              value={stats.byStatus.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">运输中</Text>}
              value={stats.byStatus.inTransit}
              prefix={<TruckOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">已完成</Text>}
              value={stats.byStatus.completed}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Space>
          <Select placeholder="状态" style={{ width: 120 }} allowClear>
            <Option value="DRAFT">草稿</Option>
            <Option value="PENDING">待审批</Option>
            <Option value="IN_TRANSIT">运输中</Option>
            <Option value="COMPLETED">已完成</Option>
          </Select>
          <Select placeholder="仓库" style={{ width: 120 }} allowClear>
            <Option value="成都仓库">成都仓库</Option>
            <Option value="北京仓库">北京仓库</Option>
            <Option value="上海仓库">上海仓库</Option>
            <Option value="深圳仓库">深圳仓库</Option>
          </Select>
        </Space>
      </Card>

      {/* 调拨单列表 */}
      <Card className="daoda-card">
        <Table
          columns={columns}
          dataSource={transfers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建调拨单弹窗 */}
      <Modal
        title="新建调拨单"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="productId" label="产品" rules={[{ required: true, message: '请选择产品' }]}>
            <Select placeholder="请选择产品">
              <Option value="p1">电动观光车 X5</Option>
              <Option value="p2">高尔夫球车 G3</Option>
              <Option value="p3">儿童游乐车 C1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="fromWarehouseId" label="调出仓库" rules={[{ required: true, message: '请选择调出仓库' }]}>
            <Select placeholder="请选择调出仓库">
              <Option value="w1">成都仓库</Option>
              <Option value="w2">北京仓库</Option>
              <Option value="w3">上海仓库</Option>
              <Option value="w4">深圳仓库</Option>
            </Select>
          </Form.Item>
          <Form.Item name="toWarehouseId" label="调入仓库" rules={[{ required: true, message: '请选择调入仓库' }]}>
            <Select placeholder="请选择调入仓库">
              <Option value="w1">成都仓库</Option>
              <Option value="w2">北京仓库</Option>
              <Option value="w3">上海仓库</Option>
              <Option value="w4">深圳仓库</Option>
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="调拨数量" rules={[{ required: true, message: '请输入调拨数量' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="调拨单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedTransfer && (
          <div style={{ marginTop: 16 }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="调拨单号">{selectedTransfer.transferNo}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(selectedTransfer.status)}</Descriptions.Item>
              <Descriptions.Item label="产品">{selectedTransfer.productName}</Descriptions.Item>
              <Descriptions.Item label="数量">{selectedTransfer.quantity}</Descriptions.Item>
              <Descriptions.Item label="调出仓库">{selectedTransfer.fromWarehouseName}</Descriptions.Item>
              <Descriptions.Item label="调入仓库">{selectedTransfer.toWarehouseName}</Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>{dayjs(selectedTransfer.createdAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  )
}