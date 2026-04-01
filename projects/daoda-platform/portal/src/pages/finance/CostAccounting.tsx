/**
 * 成本核算页面
 * 产品成本计算与分析
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
  Input,
  message,
  Progress,
  Descriptions,
  DatePicker,
  Tabs,
  Divider,
  Tooltip,
} from 'antd'
import {
  DollarOutlined,
  PlusOutlined,
  LineChartOutlined,
  PieChartOutlined,
  CalculatorOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { RangePicker } = DatePicker

interface CostRecord {
  id: string
  productId: string
  productName: string
  costType: string
  amount: number
  currency: string
  period: string
  createdAt: string
}

interface CostSummary {
  productId: string
  productName: string
  period: string
  totalCost: number
  materialCost: number
  laborCost: number
  overheadCost: number
  logisticsCost: number
  otherCost: number
  unitCost: number
  grossMargin: number
}

export default function CostAccounting() {
  const [records, setRecords] = useState<CostRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [selectedPeriod, setSelectedPeriod] = useState(dayjs().format('YYYY-MM'))
  const [stats, setStats] = useState({
    totalAmount: 0,
    byType: { material: 0, labor: 0, overhead: 0, logistics: 0, other: 0 },
    productCount: 0,
  })

  useEffect(() => {
    fetchRecords()
    fetchStats()
  }, [selectedPeriod])

  const fetchRecords = async () => {
    setLoading(true)
    // 模拟数据
    const mockData: CostRecord[] = [
      { id: '1', productId: 'p1', productName: '电动观光车 X5', costType: 'MATERIAL', amount: 45000, currency: 'CNY', period: '2026-03', createdAt: '2026-03-15' },
      { id: '2', productId: 'p1', productName: '电动观光车 X5', costType: 'LABOR', amount: 25000, currency: 'CNY', period: '2026-03', createdAt: '2026-03-15' },
      { id: '3', productId: 'p1', productName: '电动观光车 X5', costType: 'OVERHEAD', amount: 15000, currency: 'CNY', period: '2026-03', createdAt: '2026-03-15' },
      { id: '4', productId: 'p2', productName: '高尔夫球车 G3', costType: 'MATERIAL', amount: 30000, currency: 'CNY', period: '2026-03', createdAt: '2026-03-20' },
      { id: '5', productId: 'p2', productName: '高尔夫球车 G3', costType: 'LABOR', amount: 18000, currency: 'CNY', period: '2026-03', createdAt: '2026-03-20' },
    ]
    setRecords(mockData)
    setLoading(false)
  }

  const fetchStats = async () => {
    setStats({
      totalAmount: 133000,
      byType: { material: 75000, labor: 43000, overhead: 15000, logistics: 0, other: 0 },
      productCount: 2,
    })
  }

  const handleAddCost = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      console.log('Submit:', values)
      message.success('成本记录添加成功')
      setModalVisible(false)
      fetchRecords()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const getCostTypeTag = (type: string) => {
    const config: Record<string, { color: string; text: string }> = {
      MATERIAL: { color: 'blue', text: '材料成本' },
      LABOR: { color: 'orange', text: '人工成本' },
      OVERHEAD: { color: 'purple', text: '制造费用' },
      LOGISTICS: { color: 'cyan', text: '物流成本' },
      OTHER: { color: 'default', text: '其他成本' },
    }
    const c = config[type]
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const columns: ColumnsType<CostRecord> = [
    {
      title: '产品',
      dataIndex: 'productName',
      width: 150,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '成本类型',
      dataIndex: 'costType',
      width: 100,
      render: (type: string) => getCostTypeTag(type),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (amount: number) => (
        <Text style={{ color: '#6600ff', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '周期',
      dataIndex: 'period',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 100,
      render: (date: string) => dayjs(date).format('MM-DD'),
    },
  ]

  // 成本结构数据
  const costStructure = [
    { type: '材料成本', amount: stats.byType.material, percentage: Math.round(stats.byType.material / stats.totalAmount * 100) || 0 },
    { type: '人工成本', amount: stats.byType.labor, percentage: Math.round(stats.byType.labor / stats.totalAmount * 100) || 0 },
    { type: '制造费用', amount: stats.byType.overhead, percentage: Math.round(stats.byType.overhead / stats.totalAmount * 100) || 0 },
    { type: '物流成本', amount: stats.byType.logistics, percentage: Math.round(stats.byType.logistics / stats.totalAmount * 100) || 0 },
    { type: '其他成本', amount: stats.byType.other, percentage: Math.round(stats.byType.other / stats.totalAmount * 100) || 0 },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <CalculatorOutlined style={{ marginRight: 8 }} />
            成本核算
          </Title>
          <Text type="secondary">产品成本计算与分析</Text>
        </div>
        <div className="page-header-actions">
          <DatePicker
            picker="month"
            value={dayjs(selectedPeriod)}
            onChange={(date) => setSelectedPeriod(date?.format('YYYY-MM') || dayjs().format('YYYY-MM'))}
            style={{ marginRight: 8 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCost}>
            添加成本
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">总成本</Text>}
              value={stats.totalAmount}
              prefix={<DollarOutlined style={{ color: '#6600ff' }} />}
              suffix="元"
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">材料成本</Text>}
              value={stats.byType.material}
              prefix={<PieChartOutlined style={{ color: '#1890ff' }} />}
              suffix="元"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">人工成本</Text>}
              value={stats.byType.labor}
              prefix={<ArrowUpOutlined style={{ color: '#faad14' }} />}
              suffix="元"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">核算产品数</Text>}
              value={stats.productCount}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 成本结构分析 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Title level={5}>成本结构分析</Title>
        <Row gutter={24}>
          {costStructure.map((item) => (
            <Col span={4} key={item.type}>
              <div style={{ textAlign: 'center' }}>
                <Progress
                  type="circle"
                  percent={item.percentage}
                  size={80}
                  format={() => `${item.percentage}%`}
                />
                <div style={{ marginTop: 8 }}>
                  <Text strong>{item.type}</Text>
                  <div><Text type="secondary">¥{item.amount.toLocaleString()}</Text></div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 成本记录列表 */}
      <Card className="daoda-card">
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <Text strong>合计</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text strong style={{ color: '#6600ff' }}>¥{stats.totalAmount.toLocaleString()}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} colSpan={3}>
                  <Text type="secondary">共 {records.length} 条记录</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      {/* 添加成本弹窗 */}
      <Modal
        title="添加成本记录"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
        okText="添加"
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
          <Form.Item name="costType" label="成本类型" rules={[{ required: true, message: '请选择成本类型' }]}>
            <Select placeholder="请选择成本类型">
              <Option value="MATERIAL">材料成本</Option>
              <Option value="LABOR">人工成本</Option>
              <Option value="OVERHEAD">制造费用</Option>
              <Option value="LOGISTICS">物流成本</Option>
              <Option value="OTHER">其他成本</Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true, message: '请输入金额' }]}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/¥\s?|(,*)/g, '') as any}
            />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}