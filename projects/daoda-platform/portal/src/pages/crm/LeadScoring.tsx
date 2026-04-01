/**
 * 线索评分页面
 * 基于多维度自动评估线索质量
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
  Progress,
  Modal,
  Descriptions,
  Badge,
  Tooltip,
  Select,
  message,
} from 'antd'
import {
  TrophyOutlined,
  FireOutlined,
  WarningOutlined,
  StarOutlined,
  CalculatorOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select

interface Lead {
  id: string
  name: string
  company: string
  phone: string
  email: string
  source: string
  industry: string
  province: string
  score: number
  scoreLevel: 'high' | 'medium' | 'low'
  createdAt: string
}

export default function LeadScoring() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [scoreDetail, setScoreDetail] = useState<any>(null)
  const [stats, setStats] = useState({
    distribution: { high: 0, medium: 0, low: 0 },
    avgScore: 0,
  })

  useEffect(() => {
    fetchLeads()
    fetchStats()
  }, [])

  const fetchLeads = async () => {
    setLoading(true)
    // 模拟数据
    const mockData: Lead[] = [
      { id: '1', name: '王经理', company: '北京某景区管理有限公司', phone: '138****1234', email: 'wang@park.com', source: '官网咨询', industry: '景区', province: '北京', score: 85, scoreLevel: 'high', createdAt: '2026-03-15' },
      { id: '2', name: '李总', company: '上海某高尔夫俱乐部', phone: '139****5678', email: 'li@golf.com', source: '展会', industry: '高尔夫', province: '上海', score: 72, scoreLevel: 'high', createdAt: '2026-03-20' },
      { id: '3', name: '张先生', company: '广州某游乐场', phone: '137****9012', email: '', source: '广告', industry: '游乐场', province: '广东', score: 45, scoreLevel: 'medium', createdAt: '2026-03-25' },
      { id: '4', name: '赵女士', company: '成都某公园', phone: '136****3456', email: '', source: '其他', industry: '其他', province: '四川', score: 18, scoreLevel: 'low', createdAt: '2026-03-28' },
    ]
    setLeads(mockData)
    setLoading(false)
  }

  const fetchStats = async () => {
    setStats({
      distribution: { high: 2, medium: 1, low: 1 },
      avgScore: 55,
    })
  }

  const handleViewDetail = async (lead: Lead) => {
    setSelectedLead(lead)
    // 模拟评分详情
    setScoreDetail({
      total: lead.score,
      dimensions: [
        { name: '基本信息完整度', weight: 20, rawScore: 18, weightedScore: 18, maxScore: 28, criteriaResults: [
          { condition: '有公司名称', points: 10, matched: true },
          { condition: '有联系电话', points: 8, matched: true },
          { condition: '有邮箱', points: 5, matched: lead.email ? true : false },
        ]},
        { name: '来源质量', weight: 30, rawScore: lead.source === '官网咨询' ? 30 : lead.source === '展会' ? 25 : 10, weightedScore: lead.source === '官网咨询' ? 30 : lead.source === '展会' ? 25 : 10, maxScore: 35 },
        { name: '行业匹配度', weight: 20, rawScore: lead.industry === '景区' ? 25 : lead.industry === '高尔夫' ? 20 : 5, weightedScore: lead.industry === '景区' ? 25 : lead.industry === '高尔夫' ? 20 : 5, maxScore: 25 },
        { name: '地区匹配度', weight: 15, rawScore: lead.province === '北京' ? 15 : 8, weightedScore: lead.province === '北京' ? 15 : 8, maxScore: 15 },
        { name: '交互行为', weight: 15, rawScore: 5, weightedScore: 5, maxScore: 23 },
      ],
    })
    setDetailVisible(true)
  }

  const handleBatchScore = () => {
    Modal.confirm({
      title: '批量评分',
      content: '确定对所有未评分线索进行评分计算吗？',
      onOk: () => {
        message.success('批量评分完成')
        fetchLeads()
      },
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#52c41a'
    if (score >= 40) return '#1890ff'
    return '#ff4d4f'
  }

  const getScoreTag = (level: string) => {
    const config: Record<string, { color: string; icon: any; text: string }> = {
      high: { color: 'success', icon: <TrophyOutlined />, text: '高质量' },
      medium: { color: 'processing', icon: <StarOutlined />, text: '中等' },
      low: { color: 'error', icon: <WarningOutlined />, text: '低质量' },
    }
    const c = config[level]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const columns: ColumnsType<Lead> = [
    {
      title: '线索名称',
      dataIndex: 'name',
      width: 100,
      render: (text: string, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.company}</Text>
        </Space>
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 100,
    },
    {
      title: '行业',
      dataIndex: 'industry',
      width: 100,
    },
    {
      title: '地区',
      dataIndex: 'province',
      width: 80,
    },
    {
      title: '评分',
      dataIndex: 'score',
      width: 150,
      render: (score: number) => (
        <Space>
          <Progress
            percent={score}
            size="small"
            strokeColor={getScoreColor(score)}
            format={() => `${score}分`}
            style={{ width: 80 }}
          />
        </Space>
      ),
    },
    {
      title: '质量等级',
      dataIndex: 'scoreLevel',
      width: 100,
      render: (level: string) => getScoreTag(level),
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
            <CalculatorOutlined style={{ marginRight: 8 }} />
            线索评分系统
          </Title>
          <Text type="secondary">基于多维度自动评估线索质量</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<SettingOutlined />}>评分规则</Button>
          <Button type="primary" icon={<CalculatorOutlined />} onClick={handleBatchScore}>
            批量评分
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均评分</Text>}
              value={stats.avgScore}
              suffix="分"
              prefix={<StarOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">高质量线索</Text>}
              value={stats.distribution.high}
              suffix="个"
              prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">中等质量</Text>}
              value={stats.distribution.medium}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">低质量线索</Text>}
              value={stats.distribution.low}
              suffix="个"
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Space>
          <Select placeholder="质量等级" style={{ width: 120 }} allowClear>
            <Option value="high">高质量 (70+)</Option>
            <Option value="medium">中等 (40-69)</Option>
            <Option value="low">低质量 (&lt;40)</Option>
          </Select>
          <Select placeholder="来源" style={{ width: 120 }} allowClear>
            <Option value="官网咨询">官网咨询</Option>
            <Option value="展会">展会</Option>
            <Option value="广告">广告</Option>
            <Option value="老客户推荐">老客户推荐</Option>
          </Select>
        </Space>
      </Card>

      {/* 线索列表 */}
      <Card className="daoda-card">
        <Table
          columns={columns}
          dataSource={leads}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 评分详情弹窗 */}
      <Modal
        title={`线索评分详情 - ${selectedLead?.name}`}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {scoreDetail && (
          <div style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Progress
                type="circle"
                percent={scoreDetail.total}
                strokeColor={getScoreColor(scoreDetail.total)}
                format={(percent) => (
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>{percent}分</div>
                    <div style={{ fontSize: 12 }}>{selectedLead?.scoreLevel === 'high' ? '高质量' : selectedLead?.scoreLevel === 'medium' ? '中等' : '低质量'}</div>
                  </div>
                )}
              />
            </div>

            {scoreDetail.dimensions.map((dim: any, idx: number) => (
              <Card key={idx} size="small" style={{ marginBottom: 8 }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Text strong>{dim.name}</Text>
                    <div><Text type="secondary">权重 {dim.weight}%</Text></div>
                  </Col>
                  <Col span={8}>
                    <Progress
                      percent={Math.round(dim.weightedScore / dim.maxScore * 100)}
                      format={() => `${dim.weightedScore}分`}
                      size="small"
                    />
                  </Col>
                  <Col span={8}>
                    <Text>得分: {dim.rawScore}/{dim.maxScore}</Text>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}