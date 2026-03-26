/**
 * 商机详情页面
 * 统一UI风格
 */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Descriptions, Tag, Button, Tabs, Table, Typography, Space, Timeline, Progress, message } from 'antd'
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

// 商机阶段映射
const stageMap: Record<string, { percent: number; text: string }> = {
  INITIAL: { percent: 10, text: '初步接触' },
  REQUIREMENT: { percent: 30, text: '需求确认' },
  PROPOSAL: { percent: 50, text: '方案报价' },
  NEGOTIATION: { percent: 70, text: '商务谈判' },
  CLOSING: { percent: 90, text: '签约阶段' },
  WON: { percent: 100, text: '赢单' },
  LOST: { percent: 0, text: '输单' },
}

// 商机状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  OPEN: { color: 'blue', text: '进行中' },
  WON: { color: 'green', text: '赢单' },
  LOST: { color: 'red', text: '输单' },
}

// 模拟商机详情
const mockOpportunityDetail = {
  id: '1',
  code: 'OPP202403001',
  name: '北京科技智能生产线改造项目',
  customerId: 'cust001',
  customerName: '北京科技有限公司',
  contactName: '张三',
  contactPhone: '13800138000',
  ownerId: 'user001',
  ownerName: '李四',
  stage: 'PROPOSAL',
  status: 'OPEN',
  probability: 60,
  amount: 500000,
  expectedCloseDate: '2024-04-30',
  source: '转介绍',
  type: '新业务',
  description: '客户需要智能化改造现有生产线，包括自动化控制系统升级和数据采集系统建设',
  competitorNotes: '竞争对手有西门子和ABB，我们的优势是本地化服务和性价比',
  createdAt: '2024-03-01',
  updatedAt: '2024-03-18',
}

// 沟通记录
const mockCommunications = [
  { id: '1', type: '电话', content: '初次联系，了解客户需求', operator: '李四', time: '2024-03-01 10:00' },
  { id: '2', type: '会议', content: '现场调研，确认需求范围', operator: '李四', time: '2024-03-05 14:00' },
  { id: '3', type: '邮件', content: '发送初步方案和报价', operator: '李四', time: '2024-03-10 16:30' },
  { id: '4', type: '会议', content: '方案讲解，客户反馈良好', operator: '李四', time: '2024-03-15 10:00' },
  { id: '5', type: '电话', content: '跟进报价细节讨论', operator: '李四', time: '2024-03-18 09:30' },
]

// 竞争对手
const mockCompetitors = [
  { id: '1', name: '西门子', strength: '品牌知名度高，产品线完整', weakness: '价格高，本地服务响应慢' },
  { id: '2', name: 'ABB', strength: '技术领先，项目经验丰富', weakness: '定制化能力弱' },
]

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [opportunity] = useState(mockOpportunityDetail)

  const currentStage = stageMap[opportunity.stage]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/crm/opportunities')}>
            返回
          </Button>
          <Title level={4} className="page-header-title" style={{ marginLeft: 16 }}>
            商机详情
          </Title>
          <Tag color={statusMap[opportunity.status]?.color} style={{ marginLeft: 8 }}>
            {statusMap[opportunity.status]?.text}
          </Tag>
        </div>
        <div className="page-header-actions">
          <Button icon={<EditOutlined />} onClick={() => message.info('编辑功能开发中')}>编辑</Button>
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => message.info('赢单功能开发中')}>
            赢单
          </Button>
          <Button danger icon={<CloseCircleOutlined />} onClick={() => message.info('输单功能开发中')}>
            输单
          </Button>
        </div>
      </div>

      {/* 商机进度 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text strong>商机阶段：</Text>
          <Progress 
            percent={currentStage.percent} 
            status="active"
            style={{ flex: 1 }}
          />
          <Tag color="blue">{currentStage.text}</Tag>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="daoda-card" title="基本信息">
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="商机编号">{opportunity.code}</Descriptions.Item>
              <Descriptions.Item label="商机名称" span={2}>{opportunity.name}</Descriptions.Item>
              <Descriptions.Item label="客户">
                <a onClick={() => navigate(`/crm/customers/${opportunity.customerId}`)}>
                  {opportunity.customerName}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="联系人">{opportunity.contactName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{opportunity.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="负责人">{opportunity.ownerName}</Descriptions.Item>
              <Descriptions.Item label="商机金额">
                <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                  ¥{opportunity.amount.toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="赢单概率">
                <Progress percent={opportunity.probability} size="small" />
              </Descriptions.Item>
              <Descriptions.Item label="预期成交日期">{opportunity.expectedCloseDate}</Descriptions.Item>
              <Descriptions.Item label="商机来源">{opportunity.source}</Descriptions.Item>
              <Descriptions.Item label="商机类型">{opportunity.type}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{opportunity.createdAt}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{opportunity.updatedAt}</Descriptions.Item>
              <Descriptions.Item label="商机描述" span={3}>{opportunity.description}</Descriptions.Item>
              <Descriptions.Item label="竞争对手分析" span={3}>{opportunity.competitorNotes}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="daoda-card" title="快捷操作">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block onClick={() => navigate('/crm/orders')}>
                创建订单
              </Button>
              <Button block onClick={() => navigate('/crm/quotations')}>
                创建报价
              </Button>
              <Button block onClick={() => message.info('转交功能开发中')}>
                转交他人
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card className="daoda-card" style={{ marginTop: 16 }}>
        <Tabs
          defaultActiveKey="communications"
          items={[
            {
              key: 'communications',
              label: '沟通记录',
              children: (
                <Timeline
                  items={mockCommunications.map(item => ({
                    color: 'blue',
                    children: (
                      <div>
                        <div style={{ marginBottom: 4 }}>
                          <Tag>{item.type}</Tag>
                          <Text type="secondary" style={{ marginLeft: 8 }}>{item.time}</Text>
                          <Text type="secondary" style={{ marginLeft: 8 }}>by {item.operator}</Text>
                        </div>
                        <Text>{item.content}</Text>
                      </div>
                    ),
                  }))}
                />
              ),
            },
            {
              key: 'competitors',
              label: '竞争对手',
              children: (
                <Table
                  className="daoda-table"
                  columns={[
                    { title: '竞争对手', dataIndex: 'name', width: 120 },
                    { title: '优势', dataIndex: 'strength' },
                    { title: '劣势', dataIndex: 'weakness' },
                  ]}
                  dataSource={mockCompetitors}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}