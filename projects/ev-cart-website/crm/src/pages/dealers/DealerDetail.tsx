import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Descriptions, Card, Tabs, Table, Tag, Button, Space, Statistic, Row, Col, Progress, Timeline, message } from 'antd'
import {
  EditOutlined,
  RiseOutlined,
  CustomerServiceOutlined,
  DollarOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Dealer {
  id: string
  dealerCode: string
  companyName: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  province: string
  city: string
  address: string
  level: string
  status: string
  salesTarget: number
  salesActual: number
  performanceScore: number
  lastAssessmentGrade: string
  totalRebate: number
  contractStart: string
  contractEnd: string
  createdAt: string
}

interface Assessment {
  id: string
  period: string
  periodType: string
  totalScore: number
  grade: string
  status: string
  salesTarget: number
  salesActual: number
  targetAchievementRate: number
  createdAt: string
}

interface Rebate {
  id: string
  rebateType: string
  period: string
  amount: number
  status: string
  paidAt: string
  createdAt: string
}

interface LevelHistory {
  id: string
  oldLevel: string
  newLevel: string
  reason: string
  reasonType: string
  effectiveDate: string
  approvedByName: string
}

const DealerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [dealer, setDealer] = useState<Dealer | null>(null)
  const [loading, setLoading] = useState(false)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [rebates, setRebates] = useState<Rebate[]>([])
  const [levelHistories, setLevelHistories] = useState<LevelHistory[]>([])

  const levelColors: Record<string, string> = {
    trial: 'default',
    standard: 'blue',
    gold: 'gold',
    platinum: 'purple',
    strategic: 'red',
  }

  const levelLabels: Record<string, string> = {
    trial: '试用经销商',
    standard: '标准经销商',
    gold: '金牌经销商',
    platinum: '白金经销商',
    strategic: '战略经销商',
  }

  // 获取经销商详情
  const fetchDealer = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/dealers/${id}`)
      const data = await response.json()
      setDealer(data)
    } catch (error) {
      message.error('加载经销商详情失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取考核历史
  const fetchAssessments = async () => {
    try {
      const response = await fetch(`/api/v1/dealer-assessments/dealer/${id}?limit=10`)
      const data = await response.json()
      setAssessments(data.data || [])
    } catch (error) {
      console.error('加载考核历史失败', error)
    }
  }

  // 获取返利历史
  const fetchRebates = async () => {
    try {
      const response = await fetch(`/api/v1/dealer-rebates/dealer/${id}?limit=10`)
      const data = await response.json()
      setRebates(data.data || [])
    } catch (error) {
      console.error('加载返利历史失败', error)
    }
  }

  // 获取等级变更历史
  const fetchLevelHistories = async () => {
    try {
      const response = await fetch(`/api/v1/dealer-levels/history/${id}?limit=10`)
      const data = await response.json()
      setLevelHistories(data.data || [])
    } catch (error) {
      console.error('加载等级历史失败', error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchDealer()
      fetchAssessments()
      fetchRebates()
      fetchLevelHistories()
    }
  }, [id])

  if (!dealer) return <div>加载中...</div>

  const salesRate = dealer.salesTarget ? (dealer.salesActual / dealer.salesTarget) * 100 : 0

  // 考核历史表格
  const assessmentColumns: ColumnsType<Assessment> = [
    {
      title: '考核期间',
      dataIndex: 'period',
      key: 'period',
      width: 120,
    },
    {
      title: '周期类型',
      dataIndex: 'periodType',
      key: 'periodType',
      width: 100,
      render: (type) => ({
        monthly: '月度',
        quarterly: '季度',
        yearly: '年度',
      }[type] || type),
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 80,
      render: (score) => <strong>{score?.toFixed(1)}</strong>,
    },
    {
      title: '等级',
      dataIndex: 'grade',
      key: 'grade',
      width: 80,
      render: (grade) => (
        <Tag color={grade === 'S' ? 'red' : grade === 'A' ? 'gold' : grade === 'B' ? 'blue' : grade === 'C' ? 'orange' : 'red'}>
          {grade}
        </Tag>
      ),
    },
    {
      title: '目标达成率',
      dataIndex: 'targetAchievementRate',
      key: 'targetAchievementRate',
      width: 120,
      render: (rate) => (
        <span style={{ color: rate >= 100 ? '#52c41a' : '#ff4d4f' }}>
          {rate?.toFixed(1)}%
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => ({
        draft: '草稿',
        submitted: '已提交',
        approved: '已通过',
        rejected: '已拒绝',
      }[status] || status),
    },
    {
      title: '考核日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ]

  // 返利历史表格
  const rebateColumns: ColumnsType<Rebate> = [
    {
      title: '返利类型',
      dataIndex: 'rebateType',
      key: 'rebateType',
      width: 120,
      render: (type) => ({
        sales: '销售返利',
        growth: '增长返利',
        market: '市场返利',
        special: '专项返利',
      }[type] || type),
    },
    {
      title: '期间',
      dataIndex: 'period',
      key: 'period',
      width: 100,
    },
    {
      title: '返利金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => <strong style={{ color: '#52c41a' }}>¥{amount?.toLocaleString()}</strong>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => ({
        pending: '待处理',
        approved: '已审批',
        paid: '已发放',
        cancelled: '已取消',
      }[status] || status),
    },
    {
      title: '发放时间',
      dataIndex: 'paidAt',
      key: 'paidAt',
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
  ]

  // 等级变更历史
  const levelHistoryColumns: ColumnsType<LevelHistory> = [
    {
      title: '变更日期',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '原等级',
      dataIndex: 'oldLevel',
      key: 'oldLevel',
      width: 100,
      render: (level) => level ? <Tag color={levelColors[level]}>{levelLabels[level]}</Tag> : '-',
    },
    {
      title: '新等级',
      dataIndex: 'newLevel',
      key: 'newLevel',
      width: 120,
      render: (level) => <Tag color={levelColors[level]}>{levelLabels[level]}</Tag>,
    },
    {
      title: '变更类型',
      dataIndex: 'reasonType',
      key: 'reasonType',
      width: 100,
      render: (type) => ({
        promotion: <span style={{ color: '#52c41a' }}>升级</span>,
        demotion: <span style={{ color: '#ff4d4f' }}>降级</span>,
        adjustment: '调整',
      }[type] || type),
    },
    {
      title: '变更原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 300,
      ellipsis: true,
    },
    {
      title: '审批人',
      dataIndex: 'approvedByName',
      key: 'approvedByName',
      width: 100,
    },
  ]

  return (
    <div>
      {/* 头部操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/dealers/${id}/edit`)}
          >
            编辑经销商
          </Button>
          <Button onClick={() => navigate('/dealers')}>
            返回列表
          </Button>
        </Space>
      </Card>

      {/* 基本信息 */}
      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="经销商等级"
              value={levelLabels[dealer.level]}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: dealer.level === 'strategic' ? '#ff4d4f' : dealer.level === 'platinum' ? '#722ed1' : '#faad14' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="绩效分数"
              value={dealer.performanceScore?.toFixed(1) || 0}
              suffix="分"
              valueStyle={{ color: (dealer.performanceScore || 0) >= 80 ? '#52c41a' : '#faad14' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="累计返利"
              value={dealer.totalRebate?.toLocaleString() || 0}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>

      <Tabs
        items={[
          {
            key: 'info',
            label: '详细信息',
            children: (
              <Card>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="经销商编码">{dealer.dealerCode}</Descriptions.Item>
                  <Descriptions.Item label="公司名称">{dealer.companyName}</Descriptions.Item>
                  <Descriptions.Item label="联系人">{dealer.contactPerson}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{dealer.contactPhone}</Descriptions.Item>
                  <Descriptions.Item label="联系邮箱">{dealer.contactEmail}</Descriptions.Item>
                  <Descriptions.Item label="所在区域">{dealer.province}·{dealer.city}</Descriptions.Item>
                  <Descriptions.Item label="详细地址" span={2}>{dealer.address}</Descriptions.Item>
                  <Descriptions.Item label="经销商等级">
                    <Tag color={levelColors[dealer.level]}>{levelLabels[dealer.level]}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color={dealer.status === 'active' ? 'success' : 'default'}>
                      {dealer.status === 'active' ? '活跃' : dealer.status === 'inactive' ? '未激活' : '已停用'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="合同开始日期">
                    {dealer.contractStart ? new Date(dealer.contractStart).toLocaleDateString() : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="合同结束日期">
                    {dealer.contractEnd ? new Date(dealer.contractEnd).toLocaleDateString() : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {new Date(dealer.createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            ),
          },
          {
            key: 'sales',
            label: '销售业绩',
            children: (
              <Card>
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="销售目标"
                      value={dealer.salesTarget?.toLocaleString() || 0}
                      prefix="¥"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="实际销售"
                      value={dealer.salesActual?.toLocaleString() || 0}
                      prefix="¥"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="达成率"
                      value={salesRate.toFixed(1)}
                      suffix="%"
                      valueStyle={{ color: salesRate >= 100 ? '#52c41a' : '#ff4d4f' }}
                    />
                  </Col>
                </Row>
                <div style={{ marginTop: 24 }}>
                  <h4>销售目标完成进度</h4>
                  <Progress
                    percent={salesRate}
                    strokeColor={salesRate >= 100 ? '#52c41a' : '#1890ff'}
                    format={(percent) => `${percent?.toFixed(1)}%`}
                  />
                </div>
              </Card>
            ),
          },
          {
            key: 'assessments',
            label: '考核历史',
            children: (
              <Card>
                <Table
                  columns={assessmentColumns}
                  dataSource={assessments}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'rebates',
            label: '返利记录',
            children: (
              <Card>
                <Table
                  columns={rebateColumns}
                  dataSource={rebates}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'levels',
            label: '等级变更',
            children: (
              <Card>
                <Table
                  columns={levelHistoryColumns}
                  dataSource={levelHistories}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}

export default DealerDetail
