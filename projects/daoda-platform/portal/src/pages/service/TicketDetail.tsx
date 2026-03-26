/**
 * 工单详情页面
 * 统一UI风格
 */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Descriptions, Tag, Button, Tabs, Table, Typography, Space, Timeline, message, Image } from 'antd'
import { 
  ArrowLeftOutlined, 
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

// 工单状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待分配' },
  ASSIGNED: { color: 'blue', text: '已分配' },
  ACCEPTED: { color: 'processing', text: '已接单' },
  IN_PROGRESS: { color: 'processing', text: '处理中' },
  PENDING_REVIEW: { color: 'cyan', text: '待审核' },
  COMPLETED: { color: 'green', text: '已完成' },
  CLOSED: { color: 'default', text: '已关闭' },
}

// 优先级映射
const priorityMap: Record<string, { color: string; text: string }> = {
  URGENT: { color: 'red', text: '紧急' },
  HIGH: { color: 'orange', text: '高' },
  MEDIUM: { color: 'blue', text: '中' },
  LOW: { color: 'green', text: '低' },
}

// 模拟工单详情
const mockTicketDetail = {
  id: '1',
  code: 'WO202403001',
  title: '智能控制器故障维修',
  type: '维修',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  customerId: 'cust001',
  customerName: '北京科技有限公司',
  contactName: '张三',
  contactPhone: '13800138000',
  address: '北京市朝阳区建国路88号',
  equipmentModel: 'A100-2024',
  equipmentSn: 'SN2024010001',
  description: '设备无法正常启动，显示屏无响应，电源指示灯闪烁异常',
  solution: '',
  engineerId: 'eng001',
  engineerName: '王工',
  scheduledTime: '2024-03-19 14:00',
  createdAt: '2024-03-18 16:30',
  updatedAt: '2024-03-19 09:00',
}

// 处理记录
const mockProcessLogs = [
  { id: '1', action: '创建工单', operator: '客服', time: '2024-03-18 16:30' },
  { id: '2', action: '分配给王工', operator: '调度', time: '2024-03-18 17:00' },
  { id: '3', action: '接单确认', operator: '王工', time: '2024-03-18 17:30' },
  { id: '4', action: '预约明日下午2点上门', operator: '王工', time: '2024-03-18 18:00' },
  { id: '5', action: '已到达现场', operator: '王工', time: '2024-03-19 14:05' },
  { id: '6', action: '开始维修', operator: '王工', time: '2024-03-19 14:10' },
]

// 配件使用
const mockPartsUsed = [
  { id: '1', partCode: 'MAT001', partName: 'PCB主板', quantity: 1, price: 150 },
  { id: '2', partCode: 'MAT005', partName: '接线端子', quantity: 4, price: 5 },
]

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [ticket] = useState(mockTicketDetail)

  // 配件使用表格列
  const partColumns = [
    { title: '配件编码', dataIndex: 'partCode', width: 100 },
    { title: '配件名称', dataIndex: 'partName', width: 150 },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '单价', dataIndex: 'price', width: 80, render: (v: number) => `¥${v}` },
  ]

  return (
    <div className="page-container">
      {/* 页面标题区 */}
      <div className="page-header">
        <div className="page-header-left">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/service/tickets')}>
            返回
          </Button>
          <Title level={4} className="page-header-title" style={{ marginLeft: 16 }}>
            工单详情
          </Title>
          <Tag color={statusMap[ticket.status]?.color} style={{ marginLeft: 8 }}>
            {statusMap[ticket.status]?.text}
          </Tag>
          <Tag color={priorityMap[ticket.priority]?.color} style={{ marginLeft: 4 }}>
            {priorityMap[ticket.priority]?.text}
          </Tag>
        </div>
        <div className="page-header-actions">
          <Button icon={<EditOutlined />} onClick={() => message.info('编辑功能开发中')}>编辑</Button>
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => message.info('完成功能开发中')}>
            完成工单
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* 基本信息 */}
        <Col xs={24} lg={16}>
          <Card className="daoda-card" title="基本信息">
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="工单编号">{ticket.code}</Descriptions.Item>
              <Descriptions.Item label="工单标题">{ticket.title}</Descriptions.Item>
              <Descriptions.Item label="工单类型">
                <Tag>{ticket.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="客户">
                <a onClick={() => navigate(`/crm/customers/${ticket.customerId}`)}>{ticket.customerName}</a>
              </Descriptions.Item>
              <Descriptions.Item label="联系人">{ticket.contactName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">
                <Space>
                  <PhoneOutlined />
                  <a href={`tel:${ticket.contactPhone}`}>{ticket.contactPhone}</a>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="设备型号">{ticket.equipmentModel}</Descriptions.Item>
              <Descriptions.Item label="设备序列号">{ticket.equipmentSn}</Descriptions.Item>
              <Descriptions.Item label="预约时间">
                <Space>
                  <ClockCircleOutlined />
                  {ticket.scheduledTime}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="服务地址" span={3}>
                <Space>
                  <EnvironmentOutlined />
                  {ticket.address}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="问题描述" span={3}>{ticket.description}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 服务人员 */}
        <Col xs={24} lg={8}>
          <Card className="daoda-card" title="服务人员">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, color: '#1890ff', marginBottom: 12 }}>👨‍🔧</div>
              <Text strong style={{ fontSize: 18 }}>{ticket.engineerName}</Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">服务工程师</Text>
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <Button type="primary" block icon={<PhoneOutlined />}>
                联系工程师
              </Button>
              <Button block onClick={() => message.info('改派功能开发中')}>
                改派
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 详细信息标签页 */}
      <Card className="daoda-card" style={{ marginTop: 16 }}>
        <Tabs
          defaultActiveKey="process"
          items={[
            {
              key: 'process',
              label: '处理记录',
              children: (
                <Timeline
                  items={mockProcessLogs.map(item => ({
                    color: 'blue',
                    children: (
                      <div>
                        <Text strong>{item.action}</Text>
                        <br />
                        <Text type="secondary">{item.time} · {item.operator}</Text>
                      </div>
                    ),
                  }))}
                />
              ),
            },
            {
              key: 'parts',
              label: '配件使用',
              children: (
                <Table
                  className="daoda-table"
                  columns={partColumns}
                  dataSource={mockPartsUsed}
                  rowKey="id"
                  pagination={false}
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3} align="right">
                        <Text strong>配件费用</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong style={{ color: '#1890ff' }}>
                          ¥{mockPartsUsed.reduce((sum, p) => sum + p.quantity * p.price, 0)}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              ),
            },
            {
              key: 'photos',
              label: '现场照片',
              children: (
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <Text type="secondary">暂无现场照片</Text>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}