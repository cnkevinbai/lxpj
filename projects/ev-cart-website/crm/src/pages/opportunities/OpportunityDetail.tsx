import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tag, Button, Space, Timeline, Statistic, Row, Col, Progress, message, Alert } from 'antd'
import { DollarOutlined, ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'

const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [opportunity, setOpportunity] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const stageColors: Record<string, string> = {
    preliminary: 'blue',
    needsAnalysis: 'cyan',
    proposal: 'purple',
    negotiation: 'orange',
    closedWon: 'green',
    closedLost: 'red',
  }

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const mockData = {
          id: id || '1',
          oppCode: 'O20260313001',
          oppName: '智能换电柜采购项目',
          customerName: '某某物流公司',
          amount: 150000,
          stage: 'proposal',
          probability: 60,
          owner: '销售 A',
          closeDate: '2026-04-15',
          createdAt: '2026-03-10',
          description: '客户需要采购 10 台智能换电柜，用于其物流配送车队',
        }
        setOpportunity(mockData)
      } catch (error) {
        message.error('加载失败')
      } finally {
        setLoading(false)
      }
    }
    fetchOpportunity()
  }, [id])

  if (loading) return <div>加载中...</div>
  if (!opportunity) return <Alert message="商机不存在" type="error" />

  return (
    <div>
      <Card
        title="商机详情"
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/opportunities')}>
              返回列表
            </Button>
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/opportunities/${id}/edit`)}>
              编辑
            </Button>
          </Space>
        }
      >
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Statistic
              title="预计金额"
              value={opportunity.amount}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="赢单概率"
              value={opportunity.probability}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="预计成交日期"
              value={opportunity.closeDate}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>

        <Descriptions column={2} bordered>
          <Descriptions.Item label="商机编号">{opportunity.oppCode}</Descriptions.Item>
          <Descriptions.Item label="销售阶段">
            <Tag color={stageColors[opportunity.stage]}>
              {opportunity.stage}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="商机名称" span={2}>{opportunity.oppName}</Descriptions.Item>
          <Descriptions.Item label="客户名称" span={2}>{opportunity.customerName}</Descriptions.Item>
          <Descriptions.Item label="负责人">{opportunity.owner}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{opportunity.createdAt}</Descriptions.Item>
          <Descriptions.Item label="商机描述" span={2}>{opportunity.description}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24 }}>
          <h3>跟进记录</h3>
          <Timeline
            items={[
              {
                color: 'green',
                children: (
                  <div>
                    <div>商机创建</div>
                    <div style={{ color: '#999', fontSize: '12px' }}>2026-03-10 09:00</div>
                  </div>
                ),
              },
              {
                color: 'blue',
                children: (
                  <div>
                    <div>完成需求分析</div>
                    <div style={{ color: '#999', fontSize: '12px' }}>2026-03-12 14:30</div>
                  </div>
                ),
              },
              {
                color: 'purple',
                children: (
                  <div>
                    <div>提交方案报价</div>
                    <div style={{ color: '#999', fontSize: '12px' }}>2026-03-13 10:00</div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>
    </div>
  )
}

export default OpportunityDetail
