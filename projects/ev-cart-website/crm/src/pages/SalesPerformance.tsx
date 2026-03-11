import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Progress, DatePicker, Select } from 'antd'
import {
  TeamOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  UserOutlined,
} from '@ant-design/icons'
import apiClient from '../services/api'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

/**
 * 业务员业绩看板
 */
const SalesPerformance: React.FC = () => {
  const [dateRange, setDateRange] = useState<[any, any] | null>(null)
  const [teamStats, setTeamStats] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (dateRange) {
      loadTeamStats()
    }
  }, [dateRange])

  const loadTeamStats = async () => {
    setLoading(true)
    try {
      const startDate = dayjs(dateRange[0]).format('YYYY-MM-DD')
      const endDate = dayjs(dateRange[1]).format('YYYY-MM-DD')
      const response = await apiClient.get('/follow-up/team-stats', {
        params: { startDate, endDate },
      })
      setTeamStats(response.data.teamStats)
    } catch (error) {
      console.error('加载团队统计失败', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: '排名',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => (
        <span className={`font-bold ${index < 3 ? 'text-red-500' : ''}`}>
          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
        </span>
      ),
    },
    {
      title: '业务员',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '跟进次数',
      dataIndex: 'total',
      key: 'total',
      sorter: (a: any, b: any) => a.total - b.total,
    },
    {
      title: '跟进客户数',
      dataIndex: 'customerCount',
      key: 'customerCount',
    },
    {
      title: '成交客户数',
      dataIndex: 'dealCount',
      key: 'dealCount',
    },
    {
      title: '业绩进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} status={progress >= 100 ? 'success' : 'active'} />
      ),
    },
  ]

  return (
    <div className="p-4">
      {/* 日期选择 */}
      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">业务员业绩看板</h2>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            allowClear={false}
          />
        </div>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card>
            <Statistic
              title="团队总跟进数"
              value={teamStats.reduce((sum: any, item: any) => sum + parseInt(item.total), 0)}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="参与业务员"
              value={teamStats.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="人均跟进数"
              value={teamStats.length > 0 ? Math.round(teamStats.reduce((sum: any, item: any) => sum + parseInt(item.total), 0) / teamStats.length) : 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="最高跟进数"
              value={teamStats.length > 0 ? Math.max(...teamStats.map((item: any) => parseInt(item.total))) : 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 团队排名 */}
      <Card title="团队排名">
        <Table
          columns={columns}
          dataSource={teamStats.map((item: any, index) => ({
            ...item,
            key: item.userId,
            progress: Math.round((parseInt(item.total) / 100) * 100), // 示例数据
          }))}
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  )
}

export default SalesPerformance
