import React, { useState, useEffect } from 'react'
import { Card, Table, Statistic, Row, Col, Tag, Progress } from 'antd'
import { DollarOutlined, RiseOutlined, PieChartOutlined } from '@ant-design/icons'

const CostAccounting: React.FC = () => {
  const [statistics, setStatistics] = useState<any>({})
  const [costData, setCostData] = useState([])

  useEffect(() => {
    fetchStatistics()
    fetchCostData()
  }, [])

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/finance/cost-statistics')
    const data = await response.json()
    setStatistics(data)
  }

  const fetchCostData = async () => {
    const response = await fetch('/api/v1/finance/cost-data')
    const data = await response.json()
    setCostData(data.data || [])
  }

  const columns = [
    { title: '产品', dataIndex: 'productName', width: 200 },
    { title: '材料成本', dataIndex: 'materialCost', width: 120, render: (c: number) => `¥${c.toLocaleString()}` },
    { title: '人工成本', dataIndex: 'laborCost', width: 120, render: (c: number) => `¥${c.toLocaleString()}` },
    { title: '制造费用', dataIndex: 'overheadCost', width: 120, render: (c: number) => `¥${c.toLocaleString()}` },
    { title: '总成本', dataIndex: 'totalCost', width: 120, render: (c: number) => <span style={{ color: '#ff4d4f' }}>¥${c.toLocaleString()}</span> },
    { title: '销售收入', dataIndex: 'revenue', width: 120, render: (r: number) => <span style={{ color: '#52c41a' }}>¥${r.toLocaleString()}</span> },
    { title: '毛利率', key: 'margin', width: 100, render: (_: any, r: any) => <span style={{ color: r.margin > 0 ? '#52c41a' : '#ff4d4f' }}>{r.margin.toFixed(1)}%</span> },
    { title: '利润', dataIndex: 'profit', width: 120, render: (p: number) => <span style={{ color: p > 0 ? '#52c41a' : '#ff4d4f' }}>¥{p.toLocaleString()}</span> },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总成本"
              value={statistics.totalCost || 0}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收入"
              value={statistics.totalRevenue || 0}
              precision={2}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总利润"
              value={statistics.totalProfit || 0}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均毛利率"
              value={statistics.avgMargin || 0}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
              prefix={<PieChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="💰 成本核算分析">
        <Table columns={columns} dataSource={costData} rowKey="id" pagination={{ pageSize: 20 }} />
      </Card>
    </div>
  )
}

export default CostAccounting
