/**
 * 商机漏斗/阶段管理页面
 * 可视化销售流程，跟踪商机转化
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Typography,
  Dropdown,
  Avatar,
  Tooltip,
  Empty,
} from 'antd'
import {
  PlusOutlined,
  FilterOutlined,
  UserOutlined,
  ArrowRightOutlined,
  MoreOutlined,
  DeleteOutlined,
  EditOutlined,
  TrophyOutlined,
  FireOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select

// 商机阶段定义
const STAGES = [
  { key: 'initial', name: '初步接触', color: '#1890ff', probability: 10 },
  { key: 'requirement', name: '需求确认', color: '#722ed1', probability: 30 },
  { key: 'proposal', name: '方案报价', color: '#fa8c16', probability: 50 },
  { key: 'negotiation', name: '商务谈判', color: '#eb2f96', probability: 70 },
  { key: 'contract', name: '合同签订', color: '#52c41a', probability: 90 },
  { key: 'won', name: '已成交', color: '#13c2c2', probability: 100 },
]

// 商机接口
interface Opportunity {
  id: string
  name: string
  customerName: string
  stage: string
  amount: number
  probability: number
  expectedCloseDate: string
  ownerId: string
  ownerName: string
  description: string
  createdAt: string
}

export default function OpportunityFunnel() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [stageModalVisible, setStageModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    setLoading(true)
    try {
      // 模拟数据
      const mockData: Opportunity[] = [
        { id: '1', name: '智能车辆管理系统', customerName: '北京景区', stage: 'proposal', amount: 500000, probability: 50, expectedCloseDate: '2026-04-15', ownerId: 'u1', ownerName: '张三', description: '景区车辆管理项目', createdAt: '2026-03-01' },
        { id: '2', name: '高尔夫球车调度系统', customerName: '上海高尔夫', stage: 'negotiation', amount: 300000, probability: 70, expectedCloseDate: '2026-04-01', ownerId: 'u1', ownerName: '张三', description: '球车智能调度', createdAt: '2026-02-15' },
        { id: '3', name: '园区智能导览', customerName: '深圳智慧园区', stage: 'contract', amount: 800000, probability: 90, expectedCloseDate: '2026-03-25', ownerId: 'u2', ownerName: '李四', description: '园区导览系统', createdAt: '2026-02-01' },
        { id: '4', name: '游乐园票务系统', customerName: '广州游乐园', stage: 'requirement', amount: 200000, probability: 30, expectedCloseDate: '2026-05-01', ownerId: 'u2', ownerName: '李四', description: '票务管理系统', createdAt: '2026-03-10' },
        { id: '5', name: '停车场管理', customerName: '杭州商业中心', stage: 'initial', amount: 150000, probability: 10, expectedCloseDate: '2026-05-15', ownerId: 'u3', ownerName: '王五', description: '停车场智能化', createdAt: '2026-03-15' },
        { id: '6', name: '景区导览系统', customerName: '成都熊猫基地', stage: 'won', amount: 600000, probability: 100, expectedCloseDate: '2026-03-10', ownerId: 'u1', ownerName: '张三', description: '导览系统已签约', createdAt: '2026-01-15' },
      ]
      setOpportunities(mockData)
    } catch (error) {
      console.error('Failed to fetch opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  // 计算各阶段统计
  const getStageStats = () => {
    const stats: Record<string, { count: number; amount: number }> = {}
    STAGES.forEach(stage => {
      const stageOpps = opportunities.filter(o => o.stage === stage.key)
      stats[stage.key] = {
        count: stageOpps.length,
        amount: stageOpps.reduce((sum, o) => sum + o.amount, 0),
      }
    })
    return stats
  }

  const stageStats = getStageStats()

  // 总体统计
  const totalAmount = opportunities.reduce((sum, o) => sum + o.amount, 0)
  const weightedAmount = opportunities.reduce((sum, o) => sum + o.amount * o.probability / 100, 0)
  const wonAmount = opportunities.filter(o => o.stage === 'won').reduce((sum, o) => sum + o.amount, 0)

  // 获取阶段商机列表
  const getStageOpportunities = (stageKey: string) => {
    return opportunities.filter(o => o.stage === stageKey)
  }

  // 表格列定义
  const columns: ColumnsType<Opportunity> = [
    {
      title: '商机名称',
      dataIndex: 'name',
      width: 180,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.customerName}</Text>
        </Space>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (amount: number) => <Text strong style={{ color: '#52c41a' }}>¥{amount.toLocaleString()}</Text>,
    },
    {
      title: '赢率',
      dataIndex: 'probability',
      width: 100,
      render: (prob: number) => (
        <Progress percent={prob} size="small" strokeColor={prob >= 70 ? '#52c41a' : prob >= 50 ? '#fa8c16' : '#1890ff'} />
      ),
    },
    {
      title: '预计成交',
      dataIndex: 'expectedCloseDate',
      width: 100,
      render: (date: string) => dayjs(date).format('MM-DD'),
    },
    {
      title: '负责人',
      dataIndex: 'ownerName',
      width: 100,
      render: (name: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: 'edit', label: '编辑', icon: <EditOutlined /> },
              { key: 'delete', label: '删除', icon: <DeleteOutlined />, danger: true },
            ],
          }}
        >
          <Button type="link" size="small" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

  // 新建商机
  const handleCreate = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      console.log('Submit:', values)
      message.success('商机创建成功')
      setModalVisible(false)
      fetchOpportunities()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 点击阶段卡片
  const handleStageClick = (stageKey: string) => {
    setSelectedStage(stageKey)
    setStageModalVisible(true)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">销售漏斗</Title>
          <Text type="secondary">可视化商机转化流程</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<FilterOutlined />}>筛选</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建商机
          </Button>
        </div>
      </div>

      {/* 总体统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">商机总数</Text>}
              value={opportunities.length}
              suffix="个"
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#f1f5f9' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">商机总额</Text>}
              value={totalAmount}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">加权金额</Text>}
              value={weightedAmount}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">已成交</Text>}
              value={wonAmount}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 销售漏斗可视化 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Title level={5} style={{ marginBottom: 16 }}>
          <FireOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
          销售漏斗
        </Title>
        <Row gutter={16}>
          {STAGES.slice(0, -1).map((stage, index) => {
            const stats = stageStats[stage.key]
            const widthPercent = 100 - index * 15
            return (
              <Col span={4} key={stage.key} style={{ textAlign: 'center' }}>
                <div
                  onClick={() => handleStageClick(stage.key)}
                  style={{
                    width: `${widthPercent}%`,
                    margin: '0 auto',
                    padding: '16px 8px',
                    background: `linear-gradient(135deg, ${stage.color}22 0%, ${stage.color}44 100%)`,
                    borderLeft: `4px solid ${stage.color}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                >
                  <Text strong style={{ fontSize: 14 }}>{stage.name}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text strong style={{ fontSize: 20, color: stage.color }}>{stats.count}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}> 个</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ¥{(stats.amount / 10000).toFixed(0)}万
                  </Text>
                </div>
                {index < STAGES.length - 2 && (
                  <ArrowRightOutlined style={{ fontSize: 20, color: '#64748b', marginTop: 16 }} />
                )}
              </Col>
            )
          })}
        </Row>
      </Card>

      {/* 各阶段商机列表 */}
      <Row gutter={16}>
        {STAGES.slice(0, -1).map(stage => {
          const stageOpps = getStageOpportunities(stage.key)
          return (
            <Col span={6} key={stage.key}>
              <Card
                className="daoda-card"
                title={
                  <Space>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }} />
                    <Text>{stage.name}</Text>
                    <Tag color={stage.color}>{stageOpps.length}</Tag>
                  </Space>
                }
                size="small"
                style={{ height: 400 }}
              >
                {stageOpps.length === 0 ? (
                  <Empty description="暂无商机" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <div style={{ maxHeight: 300, overflow: 'auto' }}>
                    {stageOpps.map(opp => (
                      <Card
                        key={opp.id}
                        size="small"
                        className="daoda-card"
                        style={{ marginBottom: 8, cursor: 'pointer' }}
                        hoverable
                      >
                        <Text strong>{opp.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>{opp.customerName}</Text>
                        <div style={{ marginTop: 8 }}>
                          <Text strong style={{ color: '#52c41a' }}>¥{(opp.amount / 10000).toFixed(0)}万</Text>
                          <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{opp.ownerName}</Text>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* 新建商机弹窗 */}
      <Modal
        title="新建商机"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="商机名称" rules={[{ required: true, message: '请输入商机名称' }]}>
            <Input placeholder="请输入商机名称" />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称" rules={[{ required: true, message: '请输入客户名称' }]}>
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="amount" label="商机金额" rules={[{ required: true, message: '请输入金额' }]}>
                <Input prefix="¥" type="number" placeholder="商机金额" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stage" label="商机阶段" initialValue="initial">
                <Select>
                  {STAGES.map(s => (
                    <Option key={s.key} value={s.key}>{s.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="expectedCloseDate" label="预计成交日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ownerId" label="负责人">
                <Select placeholder="选择负责人">
                  <Option value="u1">张三</Option>
                  <Option value="u2">李四</Option>
                  <Option value="u3">王五</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="商机描述">
            <Input.TextArea rows={3} placeholder="请输入商机描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 阶段详情弹窗 */}
      <Modal
        title={STAGES.find(s => s.key === selectedStage)?.name || '商机列表'}
        open={stageModalVisible}
        onCancel={() => setStageModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={columns}
          dataSource={selectedStage ? getStageOpportunities(selectedStage) : []}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Modal>
    </div>
  )
}