/**
 * 销售预测分析页面
 * AI 驱动的销售预测
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
  Tabs,
  Divider,
  Tooltip,
  Alert,
} from 'antd'
import {
  LineChartOutlined,
  BulbOutlined,
  RocketOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs

interface Prediction {
  id: string
  type: string
  targetName?: string
  period: string
  predictedValue: number
  confidence: number
  method: string
  factors: Array<{ name: string; weight: number; impact: number }>
  createdAt: string
}

export default function SalesPrediction() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)
  const [form] = Form.useForm()
  const [stats, setStats] = useState({
    totalPredictions: 0,
    avgConfidence: 0,
    revenuePrediction: 0,
    orderPrediction: 0,
  })

  useEffect(() => {
    fetchPredictions()
    fetchStats()
  }, [])

  const fetchPredictions = async () => {
    setLoading(true)
    // 模拟数据
    const mockData: Prediction[] = [
      {
        id: '1',
        type: 'REVENUE',
        period: '2026-04',
        predictedValue: 125000,
        confidence: 82,
        method: 'moving_avg',
        factors: [
          { name: '历史平均收入', weight: 0.4, impact: 50000 },
          { name: '季节因素', weight: 0.2, impact: 5000 },
          { name: '增长趋势', weight: 0.3, impact: 15000 },
          { name: '市场因素', weight: 0.1, impact: 2500 },
        ],
        createdAt: '2026-03-31',
      },
      {
        id: '2',
        type: 'ORDER_COUNT',
        period: '2026-04',
        predictedValue: 65,
        confidence: 78,
        method: 'linear',
        factors: [
          { name: '历史订单量', weight: 0.5, impact: 30 },
          { name: '转化率提升', weight: 0.3, impact: 3 },
          { name: '新客户获取', weight: 0.2, impact: 1.5 },
        ],
        createdAt: '2026-03-31',
      },
      {
        id: '3',
        type: 'CUSTOMER_GROWTH',
        period: '2026-04',
        predictedValue: 115,
        confidence: 75,
        method: 'ai',
        factors: [
          { name: '当前客户数', weight: 0.4, impact: 100 },
          { name: '线索转化', weight: 0.4, impact: 15 },
          { name: '客户流失', weight: -0.2, impact: -2 },
        ],
        createdAt: '2026-03-31',
      },
      {
        id: '4',
        type: 'PRODUCT_SALES',
        targetName: '电动观光车 X5',
        period: '2026-04',
        predictedValue: 88,
        confidence: 85,
        method: 'exponential',
        factors: [
          { name: '历史销量', weight: 0.5, impact: 40 },
          { name: '季节需求', weight: 0.25, impact: 4 },
          { name: '推广效果', weight: 0.25, impact: 2 },
        ],
        createdAt: '2026-03-31',
      },
    ]
    setPredictions(mockData)
    setLoading(false)
  }

  const fetchStats = async () => {
    setStats({
      totalPredictions: 4,
      avgConfidence: 80,
      revenuePrediction: 125000,
      orderPrediction: 65,
    })
  }

  const handleRunPrediction = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      console.log('Submit:', values)
      message.success('预测任务已启动')
      setModalVisible(false)
      fetchPredictions()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleViewDetail = (record: Prediction) => {
    setSelectedPrediction(record)
    setDetailVisible(true)
  }

  const getPredictionTypeTag = (type: string) => {
    const config: Record<string, { color: string; icon: any; text: string }> = {
      REVENUE: { color: 'gold', icon: <LineChartOutlined />, text: '收入预测' },
      ORDER_COUNT: { color: 'blue', icon: <BarChartOutlined />, text: '订单预测' },
      CUSTOMER_GROWTH: { color: 'green', icon: <ArrowUpOutlined />, text: '客户增长' },
      PRODUCT_SALES: { color: 'purple', icon: <RocketOutlined />, text: '产品销量' },
    }
    const c = config[type]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getMethodTag = (method: string) => {
    const config: Record<string, { color: string; text: string }> = {
      linear: { color: 'default', text: '线性回归' },
      moving_avg: { color: 'processing', text: '移动平均' },
      exponential: { color: 'warning', text: '指数平滑' },
      ai: { color: 'success', text: 'AI 模型' },
    }
    const c = config[method]
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#52c41a'
    if (confidence >= 60) return '#faad14'
    return '#ff4d4f'
  }

  const columns: ColumnsType<Prediction> = [
    {
      title: '预测类型',
      dataIndex: 'type',
      width: 120,
      render: (type: string) => getPredictionTypeTag(type),
    },
    {
      title: '目标',
      dataIndex: 'targetName',
      width: 120,
      render: (text?: string) => text || <Text type="secondary">全局</Text>,
    },
    {
      title: '预测周期',
      dataIndex: 'period',
      width: 100,
    },
    {
      title: '预测值',
      dataIndex: 'predictedValue',
      width: 150,
      render: (value: number, record) => (
        <Text strong style={{ color: '#6600ff', fontSize: 16 }}>
          {record.type === 'REVENUE' ? `¥${value.toLocaleString()}` : value}
        </Text>
      ),
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      width: 150,
      render: (confidence: number) => (
        <Progress
          percent={confidence}
          size="small"
          strokeColor={getConfidenceColor(confidence)}
          format={() => `${confidence}%`}
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: '预测方法',
      dataIndex: 'method',
      width: 100,
      render: (method: string) => getMethodTag(method),
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
            <BulbOutlined style={{ marginRight: 8 }} />
            销售预测分析
          </Title>
          <Text type="secondary">AI 驱动的智能销售预测</Text>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<ThunderboltOutlined />} onClick={handleRunPrediction}>
            运行预测
          </Button>
        </div>
      </div>

      {/* AI 提示 */}
      <Alert
        message="AI 预测模型说明"
        description="系统使用多种预测算法（移动平均、线性回归、指数平滑、AI 模型）进行销售预测。预测结果仅供参考，实际业绩受市场环境、营销活动等多因素影响。"
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">预测任务数</Text>}
              value={stats.totalPredictions}
              prefix={<BulbOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均置信度</Text>}
              value={stats.avgConfidence}
              suffix="%"
              prefix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">收入预测</Text>}
              value={stats.revenuePrediction}
              prefix="¥"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">订单预测</Text>}
              value={stats.orderPrediction}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 预测列表 */}
      <Card className="daoda-card">
        <Table
          columns={columns}
          dataSource={predictions}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 运行预测弹窗 */}
      <Modal
        title="运行预测任务"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={400}
        okText="运行"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="type" label="预测类型" rules={[{ required: true, message: '请选择预测类型' }]}>
            <Select placeholder="请选择预测类型">
              <Option value="REVENUE">收入预测</Option>
              <Option value="ORDER_COUNT">订单数量预测</Option>
              <Option value="CUSTOMER_GROWTH">客户增长预测</Option>
              <Option value="PRODUCT_SALES">产品销量预测</Option>
            </Select>
          </Form.Item>
          <Form.Item name="productId" label="产品">
            <Select placeholder="请选择产品（可选）" allowClear>
              <Option value="p1">电动观光车 X5</Option>
              <Option value="p2">高尔夫球车 G3</Option>
              <Option value="p3">儿童游乐车 C1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="periodsAhead" label="预测周期数" initialValue={1}>
            <InputNumber min={1} max={12} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="method" label="预测方法">
            <Select placeholder="请选择预测方法（可选）" allowClear>
              <Option value="linear">线性回归</Option>
              <Option value="moving_avg">移动平均</Option>
              <Option value="exponential">指数平滑</Option>
              <Option value="ai">AI 模型</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 预测详情弹窗 */}
      <Modal
        title="预测详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedPrediction && (
          <div style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Progress
                type="circle"
                percent={selectedPrediction.confidence}
                strokeColor={getConfidenceColor(selectedPrediction.confidence)}
                format={(percent) => (
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                      {selectedPrediction.type === 'REVENUE'
                        ? `¥${selectedPrediction.predictedValue.toLocaleString()}`
                        : selectedPrediction.predictedValue}
                    </div>
                    <div style={{ fontSize: 12 }}>置信度 {percent}%</div>
                  </div>
                )}
              />
            </div>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="预测类型">{getPredictionTypeTag(selectedPrediction.type)}</Descriptions.Item>
              <Descriptions.Item label="预测方法">{getMethodTag(selectedPrediction.method)}</Descriptions.Item>
              <Descriptions.Item label="预测周期">{selectedPrediction.period}</Descriptions.Item>
              <Descriptions.Item label="目标">{selectedPrediction.targetName || '全局'}</Descriptions.Item>
            </Descriptions>

            <Divider>影响因素</Divider>

            <div>
              {selectedPrediction.factors.map((factor, idx) => (
                <Card key={idx} size="small" style={{ marginBottom: 8 }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Text strong>{factor.name}</Text>
                      <div><Text type="secondary">权重 {Math.round(factor.weight * 100)}%</Text></div>
                    </Col>
                    <Col span={8}>
                      <Progress
                        percent={Math.round(Math.abs(factor.weight) * 100)}
                        size="small"
                        format={() => `${factor.impact}`}
                        strokeColor={factor.weight > 0 ? '#52c41a' : '#ff4d4f'}
                        style={{ width: 100 }}
                      />
                    </Col>
                    <Col span={8}>
                      <Tag color={factor.weight > 0 ? 'green' : 'red'}>
                        {factor.weight > 0 ? '正向影响' : '负向影响'}
                      </Tag>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}