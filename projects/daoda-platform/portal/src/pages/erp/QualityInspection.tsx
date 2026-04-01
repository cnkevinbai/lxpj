/**
 * 质检管理页面
 * 产品质量控制与检验
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
  SafetyCertificateOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  ExperimentOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs

interface Inspection {
  id: string
  inspectionNo: string
  type: 'PURCHASE' | 'PRODUCTION' | 'FINISHED'
  productName: string
  batchNo?: string
  quantity: number
  passQuantity: number
  passRate: number
  status: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'PARTIAL'
  createdAt: string
}

export default function QualityInspection() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null)
  const [form] = Form.useForm()
  const [stats, setStats] = useState({
    total: 0,
    avgPassRate: 0,
    byType: { purchase: 0, production: 0, finished: 0 },
  })

  useEffect(() => {
    fetchInspections()
    fetchStats()
  }, [])

  const fetchInspections = async () => {
    setLoading(true)
    const mockData: Inspection[] = [
      { id: '1', inspectionNo: 'QC001', type: 'PURCHASE', productName: '电动观光车 X5', batchNo: 'B001', quantity: 100, passQuantity: 98, passRate: 98, status: 'PASSED', createdAt: '2026-03-15' },
      { id: '2', inspectionNo: 'QC002', type: 'PRODUCTION', productName: '高尔夫球车 G3', batchNo: 'B002', quantity: 50, passQuantity: 45, passRate: 90, status: 'PARTIAL', createdAt: '2026-03-20' },
      { id: '3', inspectionNo: 'QC003', type: 'FINISHED', productName: '儿童游乐车 C1', quantity: 30, passQuantity: 0, passRate: 0, status: 'IN_PROGRESS', createdAt: '2026-03-28' },
      { id: '4', inspectionNo: 'QC004', type: 'PURCHASE', productName: '配件包', batchNo: 'B003', quantity: 200, passQuantity: 120, passRate: 60, status: 'FAILED', createdAt: '2026-03-25' },
    ]
    setInspections(mockData)
    setLoading(false)
  }

  const fetchStats = async () => {
    setStats({
      total: 4,
      avgPassRate: 62,
      byType: { purchase: 2, production: 1, finished: 1 },
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
      message.success('质检单创建成功')
      setModalVisible(false)
      fetchInspections()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleViewDetail = (record: Inspection) => {
    setSelectedInspection(record)
    setDetailVisible(true)
  }

  const getTypeTag = (type: string) => {
    const config: Record<string, { color: string; text: string }> = {
      PURCHASE: { color: 'blue', text: '采购检验' },
      PRODUCTION: { color: 'purple', text: '生产检验' },
      FINISHED: { color: 'cyan', text: '成品检验' },
    }
    const c = config[type]
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; icon: any; text: string }> = {
      PENDING: { color: 'default', icon: <WarningOutlined />, text: '待检' },
      IN_PROGRESS: { color: 'processing', icon: <ExperimentOutlined />, text: '检验中' },
      PASSED: { color: 'success', icon: <CheckCircleOutlined />, text: '合格' },
      PARTIAL: { color: 'warning', icon: <WarningOutlined />, text: '部分合格' },
      FAILED: { color: 'error', icon: <CloseCircleOutlined />, text: '不合格' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getPassRateColor = (rate: number) => {
    if (rate >= 95) return '#52c41a'
    if (rate >= 60) return '#faad14'
    return '#ff4d4f'
  }

  const columns: ColumnsType<Inspection> = [
    {
      title: '质检单号',
      dataIndex: 'inspectionNo',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => getTypeTag(type),
    },
    {
      title: '产品',
      dataIndex: 'productName',
      width: 150,
      render: (text: string, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          {record.batchNo && <Text type="secondary" style={{ fontSize: 12 }}>批次: {record.batchNo}</Text>}
        </Space>
      ),
    },
    {
      title: '检验数量',
      dataIndex: 'quantity',
      width: 100,
      render: (num: number) => <Text>{num}</Text>,
    },
    {
      title: '合格数量',
      dataIndex: 'passQuantity',
      width: 100,
      render: (num: number) => <Text style={{ color: '#52c41a' }}>{num}</Text>,
    },
    {
      title: '合格率',
      dataIndex: 'passRate',
      width: 150,
      render: (rate: number) => (
        rate > 0 ? (
          <Progress
            percent={rate}
            size="small"
            strokeColor={getPassRateColor(rate)}
            format={() => `${rate}%`}
            style={{ width: 100 }}
          />
        ) : <Text type="secondary">待检</Text>
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
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
          详情
        </Button>
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <SafetyCertificateOutlined style={{ marginRight: 8 }} />
            质检管理
          </Title>
          <Text type="secondary">产品质量控制与检验</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<SettingOutlined />}>质检标准</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建质检单
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">质检单总数</Text>}
              value={stats.total}
              prefix={<SafetyCertificateOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均合格率</Text>}
              value={stats.avgPassRate}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: getPassRateColor(stats.avgPassRate) }} />}
              valueStyle={{ color: getPassRateColor(stats.avgPassRate) }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">采购检验</Text>}
              value={stats.byType.purchase}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">不合格记录</Text>}
              value={1}
              suffix="单"
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Space>
          <Select placeholder="检验类型" style={{ width: 120 }} allowClear>
            <Option value="PURCHASE">采购检验</Option>
            <Option value="PRODUCTION">生产检验</Option>
            <Option value="FINISHED">成品检验</Option>
          </Select>
          <Select placeholder="状态" style={{ width: 120 }} allowClear>
            <Option value="PASSED">合格</Option>
            <Option value="PARTIAL">部分合格</Option>
            <Option value="FAILED">不合格</Option>
            <Option value="IN_PROGRESS">检验中</Option>
          </Select>
        </Space>
      </Card>

      {/* 质检单列表 */}
      <Card className="daoda-card">
        <Table
          columns={columns}
          dataSource={inspections}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建质检单弹窗 */}
      <Modal
        title="新建质检单"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="type" label="检验类型" rules={[{ required: true, message: '请选择检验类型' }]}>
            <Select placeholder="请选择检验类型">
              <Option value="PURCHASE">采购检验</Option>
              <Option value="PRODUCTION">生产检验</Option>
              <Option value="FINISHED">成品检验</Option>
            </Select>
          </Form.Item>
          <Form.Item name="productId" label="产品" rules={[{ required: true, message: '请选择产品' }]}>
            <Select placeholder="请选择产品">
              <Option value="p1">电动观光车 X5</Option>
              <Option value="p2">高尔夫球车 G3</Option>
              <Option value="p3">儿童游乐车 C1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="batchNo" label="批次号">
            <Input placeholder="请输入批次号" />
          </Form.Item>
          <Form.Item name="quantity" label="检验数量" rules={[{ required: true, message: '请输入检验数量' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 质检详情弹窗 */}
      <Modal
        title={`质检详情 - ${selectedInspection?.inspectionNo}`}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedInspection && (
          <div style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Progress
                type="circle"
                percent={selectedInspection.passRate}
                strokeColor={getPassRateColor(selectedInspection.passRate)}
                format={(percent) => (
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>{percent}%</div>
                    <div style={{ fontSize: 12 }}>{selectedInspection.status === 'PASSED' ? '合格' : selectedInspection.status === 'PARTIAL' ? '部分合格' : selectedInspection.status === 'FAILED' ? '不合格' : '检验中'}</div>
                  </div>
                )}
              />
            </div>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="质检单号">{selectedInspection.inspectionNo}</Descriptions.Item>
              <Descriptions.Item label="检验类型">{getTypeTag(selectedInspection.type)}</Descriptions.Item>
              <Descriptions.Item label="产品">{selectedInspection.productName}</Descriptions.Item>
              <Descriptions.Item label="批次号">{selectedInspection.batchNo || '-'}</Descriptions.Item>
              <Descriptions.Item label="检验数量">{selectedInspection.quantity}</Descriptions.Item>
              <Descriptions.Item label="合格数量">{selectedInspection.passQuantity}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(selectedInspection.status)}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{dayjs(selectedInspection.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  )
}