import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Space, Tag, Input, Modal, Form, message, Select, Progress, Statistic, Row, Col } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, RiseOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Search } = Input
const { Option } = Select

interface Opportunity {
  id: string
  oppCode: string
  oppName: string
  customerId: string
  customerName: string
  amount: number
  stage: string
  probability: number
  owner: string
  closeDate: string
  createdAt: string
}

const Opportunities: React.FC = () => {
  const navigate = useNavigate()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const stageColors: Record<string, string> = {
    preliminary: 'blue',
    needsAnalysis: 'cyan',
    proposal: 'purple',
    negotiation: 'orange',
    closedWon: 'green',
    closedLost: 'red',
  }

  const stageLabels: Record<string, string> = {
    preliminary: '初步接洽',
    needsAnalysis: '需求分析',
    proposal: '方案报价',
    negotiation: '谈判审核',
    closedWon: '已赢单',
    closedLost: '已输单',
  }

  const fetchOpportunities = async () => {
    setLoading(true)
    try {
      const mockData: Opportunity[] = [
        {
          id: '1',
          oppCode: 'O20260313001',
          oppName: '智能换电柜采购项目',
          customerId: 'C001',
          customerName: '某某物流公司',
          amount: 150000,
          stage: 'proposal',
          probability: 60,
          owner: '销售 A',
          closeDate: '2026-04-15',
          createdAt: '2026-03-10',
        },
        {
          id: '2',
          oppCode: 'O20260313002',
          oppName: '电池采购年度合同',
          customerId: 'C002',
          customerName: '某某科技公司',
          amount: 500000,
          stage: 'negotiation',
          probability: 80,
          owner: '销售 B',
          closeDate: '2026-03-30',
          createdAt: '2026-03-05',
        },
      ]
      setOpportunities(mockData)
    } catch (error) {
      message.error('加载商机失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const handleCreate = async (values: any) => {
    try {
      message.success('创建商机成功')
      setCreateVisible(false)
      form.resetFields()
      fetchOpportunities()
    } catch (error) {
      message.error('创建失败')
    }
  }

  const formatAmount = (amount: number) => {
    return `¥${(amount / 10000).toFixed(1)}万`
  }

  const columns = [
    {
      title: '商机编号',
      dataIndex: 'oppCode',
      width: 140,
    },
    {
      title: '商机名称',
      dataIndex: 'oppName',
      width: 200,
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 150,
    },
    {
      title: '预计金额',
      dataIndex: 'amount',
      width: 120,
      render: (amount: number) => (
        <span style={{ color: '#1890ff', fontWeight: 600 }}>{formatAmount(amount)}</span>
      ),
    },
    {
      title: '销售阶段',
      dataIndex: 'stage',
      width: 120,
      render: (stage: string) => (
        <Tag color={stageColors[stage]}>{stageLabels[stage] || stage}</Tag>
      ),
    },
    {
      title: '赢单概率',
      dataIndex: 'probability',
      width: 120,
      render: (probability: number) => (
        <Progress
          percent={probability}
          strokeColor={probability > 70 ? '#52c41a' : probability > 40 ? '#faad14' : '#ff4d4f'}
          format={() => `${probability}%`}
        />
      ),
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      width: 90,
    },
    {
      title: '预计成交日期',
      dataIndex: 'closeDate',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Opportunity) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/opportunities/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/opportunities/${record.id}/edit`)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  // 统计信息
  const totalAmount = opportunities.reduce((sum, opp) => sum + opp.amount, 0)
  const wonAmount = opportunities.filter(opp => opp.stage === 'closedWon').reduce((sum, opp) => sum + opp.amount, 0)
  const avgProbability = opportunities.length > 0
    ? Math.round(opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length)
    : 0

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="商机总数"
              value={opportunities.length}
              suffix="个"
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预计金额"
              value={totalAmount}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已赢单金额"
              value={wonAmount}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均赢单率"
              value={avgProbability}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateVisible(true)}
            >
              新建商机
            </Button>
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索商机名称、客户"
            allowClear
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={opportunities}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="新建商机"
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="oppName" label="商机名称" rules={[{ required: true, message: '请输入商机名称' }]}>
              <Input placeholder="请输入商机名称" />
            </Form.Item>
            <Form.Item name="customerId" label="客户" rules={[{ required: true, message: '请选择客户' }]}>
              <Select placeholder="请选择客户">
                <Option value="C001">某某物流公司</Option>
                <Option value="C002">某某科技公司</Option>
              </Select>
            </Form.Item>
            <Form.Item name="amount" label="预计金额" rules={[{ required: true, message: '请输入预计金额' }]}>
              <Input.Number
                style={{ width: '100%' }}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                parser={(value) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                min={0}
              />
            </Form.Item>
            <Form.Item name="stage" label="销售阶段" rules={[{ required: true, message: '请选择阶段' }]}>
              <Select placeholder="请选择阶段">
                <Option value="preliminary">初步接洽</Option>
                <Option value="needsAnalysis">需求分析</Option>
                <Option value="proposal">方案报价</Option>
                <Option value="negotiation">谈判审核</Option>
              </Select>
            </Form.Item>
            <Form.Item name="probability" label="赢单概率 (%)">
              <Input.Number
                style={{ width: '100%' }}
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => Number(String(value || 0).replace(/%/g, ''))}
              />
            </Form.Item>
            <Form.Item name="closeDate" label="预计成交日期">
              <Input type="date" style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <Form.Item name="description" label="商机描述">
            <Input.TextArea rows={3} placeholder="请输入商机详细描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Opportunities
