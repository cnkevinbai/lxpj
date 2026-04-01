/**
 * 库存盘点页面
 * 实际库存与系统库存核对
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
  Select,
  InputNumber,
  message,
  Progress,
  Descriptions,
  Badge,
  Input,
  Tabs,
} from 'antd'
import {
  FileSearchOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  EditOutlined,
  CalculatorOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs

interface Check {
  id: string
  checkNo: string
  warehouseName: string
  totalItems: number
  matchedItems: number
  diffItems: number
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
}

interface CheckItem {
  id: string
  productName: string
  productCode: string
  systemQuantity: number
  actualQuantity: number
  diffQuantity: number
  status: 'PENDING' | 'CHECKED' | 'ADJUSTED'
}

export default function InventoryCheck() {
  const [checks, setChecks] = useState<Check[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null)
  const [checkItems, setCheckItems] = useState<CheckItem[]>([])
  const [form] = Form.useForm()
  const [stats, setStats] = useState({
    total: 0,
    avgDiffRate: 0,
  })

  useEffect(() => {
    fetchChecks()
    fetchStats()
  }, [])

  const fetchChecks = async () => {
    setLoading(true)
    const mockData: Check[] = [
      { id: '1', checkNo: 'CK001', warehouseName: '成都仓库', totalItems: 50, matchedItems: 45, diffItems: 5, status: 'COMPLETED', createdAt: '2026-03-15' },
      { id: '2', checkNo: 'CK002', warehouseName: '北京仓库', totalItems: 30, matchedItems: 0, diffItems: 0, status: 'IN_PROGRESS', createdAt: '2026-03-28' },
      { id: '3', checkNo: 'CK003', warehouseName: '上海仓库', totalItems: 20, matchedItems: 0, diffItems: 0, status: 'DRAFT', createdAt: '2026-03-30' },
    ]
    setChecks(mockData)
    setLoading(false)
  }

  const fetchStats = async () => {
    setStats({
      total: 3,
      avgDiffRate: 10,
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
      message.success('盘点单创建成功')
      setModalVisible(false)
      fetchChecks()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleViewDetail = async (record: Check) => {
    setSelectedCheck(record)
    // 模拟盘点项数据
    const mockItems: CheckItem[] = [
      { id: '1', productName: '电动观光车 X5', productCode: 'P001', systemQuantity: 100, actualQuantity: 98, diffQuantity: -2, status: 'CHECKED' },
      { id: '2', productName: '高尔夫球车 G3', productCode: 'P002', systemQuantity: 50, actualQuantity: 50, diffQuantity: 0, status: 'CHECKED' },
      { id: '3', productName: '儿童游乐车 C1', productCode: 'P003', systemQuantity: 80, actualQuantity: 82, diffQuantity: 2, status: 'CHECKED' },
    ]
    setCheckItems(mockItems)
    setDetailVisible(true)
  }

  const handleStartCheck = (id: string) => {
    Modal.confirm({
      title: '开始盘点',
      content: '确定开始盘点吗？',
      onOk: () => {
        message.success('盘点已开始')
        fetchChecks()
      },
    })
  }

  const handleAdjust = (productId: string) => {
    Modal.confirm({
      title: '调整库存',
      content: '确定根据盘点结果调整库存吗？',
      onOk: () => {
        message.success('库存已调整')
      },
    })
  }

  const handleBatchAdjust = () => {
    Modal.confirm({
      title: '批量调整',
      content: '确定批量调整所有差异项吗？',
      onOk: () => {
        message.success('批量调整完成')
      },
    })
  }

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; icon: any; text: string }> = {
      DRAFT: { color: 'default', icon: <EditOutlined />, text: '草稿' },
      IN_PROGRESS: { color: 'processing', icon: <CalculatorOutlined />, text: '盘点中' },
      COMPLETED: { color: 'success', icon: <CheckCircleOutlined />, text: '已完成' },
      CANCELLED: { color: 'error', icon: <CloseCircleOutlined />, text: '已取消' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const checkColumns: ColumnsType<Check> = [
    {
      title: '盘点单号',
      dataIndex: 'checkNo',
      width: 100,
    },
    {
      title: '仓库',
      dataIndex: 'warehouseName',
      width: 120,
    },
    {
      title: '盘点项数',
      dataIndex: 'totalItems',
      width: 100,
    },
    {
      title: '匹配项',
      dataIndex: 'matchedItems',
      width: 100,
      render: (num: number) => <Text style={{ color: '#52c41a' }}>{num}</Text>,
    },
    {
      title: '差异项',
      dataIndex: 'diffItems',
      width: 100,
      render: (num: number) => (
        num > 0 ? <Badge count={num} style={{ backgroundColor: '#ff4d4f' }} /> : <Text>0</Text>
      ),
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
          {record.status === 'DRAFT' && (
            <Button type="link" size="small" onClick={() => handleStartCheck(record.id)}>
              开始
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const itemColumns: ColumnsType<CheckItem> = [
    {
      title: '产品编码',
      dataIndex: 'productCode',
      width: 100,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 150,
    },
    {
      title: '系统库存',
      dataIndex: 'systemQuantity',
      width: 100,
    },
    {
      title: '实际库存',
      dataIndex: 'actualQuantity',
      width: 100,
      render: (num: number) => <InputNumber value={num} size="small" style={{ width: 80 }} />,
    },
    {
      title: '差异',
      dataIndex: 'diffQuantity',
      width: 100,
      render: (diff: number) => (
        <Space>
          {diff > 0 && <Tag color="orange">+{diff}</Tag>}
          {diff < 0 && <Tag color="red">{diff}</Tag>}
          {diff === 0 && <Tag color="green">匹配</Tag>}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          PENDING: { color: 'default', text: '待检' },
          CHECKED: { color: 'processing', text: '已检' },
          ADJUSTED: { color: 'success', text: '已调整' },
        }
        const c = config[status]
        return <Tag color={c.color}>{c.text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        record.diffQuantity !== 0 && record.status === 'CHECKED' ? (
          <Button type="link" size="small" onClick={() => handleAdjust(record.id)}>
            调整
          </Button>
        ) : null
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <FileSearchOutlined style={{ marginRight: 8 }} />
            库存盘点
          </Title>
          <Text type="secondary">实际库存与系统库存核对</Text>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建盘点单
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">盘点单总数</Text>}
              value={stats.total}
              prefix={<FileSearchOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均差异率</Text>}
              value={stats.avgDiffRate}
              suffix="%"
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">差异调整</Text>}
              value={0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 盘点单列表 */}
      <Card className="daoda-card">
        <Table
          columns={checkColumns}
          dataSource={checks}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建盘点单弹窗 */}
      <Modal
        title="新建盘点单"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={400}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="warehouseId" label="仓库" rules={[{ required: true, message: '请选择仓库' }]}>
            <Select placeholder="请选择仓库">
              <Option value="w1">成都仓库</Option>
              <Option value="w2">北京仓库</Option>
              <Option value="w3">上海仓库</Option>
              <Option value="w4">深圳仓库</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 盘点详情弹窗 */}
      <Modal
        title={`盘点详情 - ${selectedCheck?.checkNo}`}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={
          selectedCheck?.status === 'COMPLETED' ? (
            <Button type="primary" onClick={handleBatchAdjust}>
              批量调整差异
            </Button>
          ) : null
        }
        width={800}
      >
        {selectedCheck && (
          <div style={{ marginTop: 16 }}>
            <Descriptions column={4} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="仓库">{selectedCheck.warehouseName}</Descriptions.Item>
              <Descriptions.Item label="总项数">{selectedCheck.totalItems}</Descriptions.Item>
              <Descriptions.Item label="匹配">{selectedCheck.matchedItems}</Descriptions.Item>
              <Descriptions.Item label="差异">{selectedCheck.diffItems}</Descriptions.Item>
            </Descriptions>

            <Table
              columns={itemColumns}
              dataSource={checkItems}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}