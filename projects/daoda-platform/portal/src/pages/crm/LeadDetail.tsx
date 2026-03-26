/**
 * 线索详情页面
 * 统一UI风格
 */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Descriptions, Tag, Button, Tabs, Table, Typography, Space, Timeline, message } from 'antd'
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, PhoneOutlined, MailOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

// 线索状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  NEW: { color: 'blue', text: '新线索' },
  ASSIGNED: { color: 'orange', text: '已分配' },
  CONTACTED: { color: 'processing', text: '已联系' },
  QUALIFIED: { color: 'cyan', text: '已合格' },
  CONVERTED: { color: 'green', text: '已转化' },
  LOST: { color: 'red', text: '已丢失' },
}

// 线索来源映射
const sourceMap: Record<string, string> = {
  WEBSITE: '官网',
  REFERRAL: '转介绍',
  EXHIBITION: '展会',
  ADVERTISEMENT: '广告',
  OTHER: '其他',
}

// 模拟线索详情
const mockLeadDetail = {
  id: '1',
  code: 'L202403001',
  name: '张三',
  company: '北京科技有限公司',
  phone: '13800138000',
  email: 'zhangsan@bjtech.com',
  source: 'WEBSITE',
  status: 'CONTACTED',
  ownerId: 'user001',
  ownerName: '李四',
  estimatedAmount: 50000,
  industry: '制造业',
  region: '北京',
  requirement: '需要采购智能生产线改造方案',
  note: '客户对智能制造很感兴趣，预算充足，决策周期约1个月',
  createdAt: '2024-03-15 10:30',
  updatedAt: '2024-03-18 14:20',
}

// 跟进记录
const mockFollowUps = [
  { id: '1', type: '电话', content: '初次联系，客户表示有兴趣，预约下周上门拜访', operator: '李四', time: '2024-03-15 11:00' },
  { id: '2', type: '备注', content: '发送了公司介绍和产品资料', operator: '李四', time: '2024-03-16 09:30' },
  { id: '3', type: '电话', content: '确认客户需求，预算50万左右，决策人是技术总监王工', operator: '李四', time: '2024-03-18 14:00' },
]

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead] = useState(mockLeadDetail)

  return (
    <div className="page-container">
      {/* 页面标题区 */}
      <div className="page-header">
        <div className="page-header-left">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/crm/leads')}>
            返回
          </Button>
          <Title level={4} className="page-header-title" style={{ marginLeft: 16 }}>
            线索详情
          </Title>
          <Tag color={statusMap[lead.status]?.color} style={{ marginLeft: 8 }}>
            {statusMap[lead.status]?.text}
          </Tag>
        </div>
        <div className="page-header-actions">
          <Button icon={<EditOutlined />} onClick={() => message.info('编辑功能开发中')}>编辑</Button>
          <Button onClick={() => message.info('转化功能开发中')}>转化为客户</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => message.info('删除功能开发中')}>删除</Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* 基本信息 */}
        <Col xs={24} lg={16}>
          <Card className="daoda-card" title="基本信息">
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="线索编号">{lead.code}</Descriptions.Item>
              <Descriptions.Item label="联系人">{lead.name}</Descriptions.Item>
              <Descriptions.Item label="公司">{lead.company}</Descriptions.Item>
              <Descriptions.Item label="电话">
                <Space>
                  <PhoneOutlined />
                  <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                <Space>
                  <MailOutlined />
                  <a href={`mailto:${lead.email}`}>{lead.email}</a>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="线索来源">{sourceMap[lead.source]}</Descriptions.Item>
              <Descriptions.Item label="行业">{lead.industry}</Descriptions.Item>
              <Descriptions.Item label="地区">{lead.region}</Descriptions.Item>
              <Descriptions.Item label="预估金额">¥{lead.estimatedAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="负责人">
                <Space>
                  <UserOutlined />
                  {lead.ownerName}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{lead.createdAt}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{lead.updatedAt}</Descriptions.Item>
              <Descriptions.Item label="需求描述" span={3}>{lead.requirement}</Descriptions.Item>
              <Descriptions.Item label="备注" span={3}>{lead.note}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 快捷操作 */}
        <Col xs={24} lg={8}>
          <Card className="daoda-card" title="快捷操作">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block icon={<PhoneOutlined />}>
                拨打电话
              </Button>
              <Button block icon={<MailOutlined />}>
                发送邮件
              </Button>
              <Button block icon={<TeamOutlined />}>
                分配给其他人
              </Button>
              <Button block onClick={() => navigate('/crm/opportunities')}>
                创建商机
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 跟进记录 */}
      <Card className="daoda-card" title="跟进记录" style={{ marginTop: 16 }}>
        <Timeline
          items={mockFollowUps.map(item => ({
            color: item.type === '电话' ? 'blue' : 'gray',
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
      </Card>
    </div>
  )
}