import React, { useState, useEffect } from 'react'
import { Table, Card, Tag, Space, Button, Statistic, Row, Col, Progress } from 'antd'
import { ShoppingCartOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import apiClient from '../services/api'

// 模拟漏斗数据

const Opportunities: React.FC = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [funnel, setFunnel] = useState([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [listRes, funnelRes] = await Promise.all([
        apiClient.get('/opportunities', { params: { page: 1, limit: 20 } }),
        apiClient.get('/opportunities/funnel')
      ])
      setData(listRes.data.data)
      setFunnel(funnelRes.data)
    } catch (error) {
      console.error('加载失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const stageConfig: any = {
    discovery: { color: 'blue', text: '初步接触' },
    needs: { color: 'cyan', text: '需求分析' },
    proposal: { color: 'orange', text: '方案报价' },
    negotiation: { color: 'purple', text: '商务谈判' },
    closed_won: { color: 'green', text: '已成交' },
    closed_lost: { color: 'red', text: '已流失' },
  }

  const columns = [
    {
      title: '商机名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '客户',
      dataIndex: ['customer', 'name'],
      key: 'customer',
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => (
        <Tag color={stageConfig[stage]?.color}>
          {stageConfig[stage]?.text || stage}
        </Tag>
      ),
    },
    {
      title: '预估金额',
      dataIndex: 'estimatedAmount',
      key: 'estimatedAmount',
      render: (amount: number) => `¥${(amount || 0).toLocaleString()}`,
    },
    {
      title: '成交概率',
      dataIndex: 'probability',
      key: 'probability',
      render: (probability: number) => (
        <Progress percent={probability} status={probability > 50 ? 'success' : 'active'} />
      ),
    },
    {
      title: '预计成交日期',
      dataIndex: 'expectedCloseDate',
      key: 'expectedCloseDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">商机管理</h1>
        <Button type="primary">新建商机</Button>
      </div>

      {/* 销售漏斗 */}
      <Card title="销售漏斗" className="mb-6">
        <Row gutter={16}>
          {funnel.map((item: any, index: number) => (
            <Col span={4} key={index}>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">{stageConfig[item.stage]?.text || item.stage}</div>
                <Statistic
                  value={item.count}
                  suffix="个"
                  valueStyle={{ fontSize: 24 }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  ¥{(item.total / 10000).toFixed(0)}万
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 商机列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  )
}

export default Opportunities
