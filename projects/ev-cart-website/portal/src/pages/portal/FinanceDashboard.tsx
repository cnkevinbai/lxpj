import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, Progress } from 'antd'
import { BarChartOutlined, DollarOutlined, RiseOutlined, WalletOutlined } from '@ant-design/icons'

const FinanceDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<any>({})

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/finance/dashboard')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="应收账款"
              value={statistics.receivables || 0}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="应付账款"
              value={statistics.payables || 0}
              precision={2}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月收入"
              value={statistics.income || 0}
              precision={2}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月支出"
              value={statistics.expense || 0}
              precision={2}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="收款趋势">
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              收款趋势图表区域
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="付款趋势">
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              付款趋势图表区域
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default FinanceDashboard
