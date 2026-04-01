/**
 * 请假审批页面
 * 员工请假申请审批流程
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Typography,
  Badge,
  Avatar,
  Tooltip,
  Descriptions,
  Timeline,
  Row,
  Col,
  Statistic,
  Tabs,
  Empty,
  Spin,
} from 'antd'
import {
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  AuditOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

// 请假类型
const LEAVE_TYPES: Record<string, { name: string; color: string }> = {
  annual: { name: '年假', color: 'blue' },
  sick: { name: '病假', color: 'red' },
  personal: { name: '事假', color: 'orange' },
  marriage: { name: '婚假', color: 'magenta' },
  maternity: { name: '产假', color: 'purple' },
  paternity: { name: '陪产假', color: 'cyan' },
  bereavement: { name: '丧假', color: 'default' },
}

// 请假申请接口
interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  department: string
  type: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  approverId?: string
  approverName?: string
  approvedAt?: string
  rejectReason?: string
  createdAt: string
  history?: { action: string; operator: string; time: string; remark?: string }[]
}

export default function LeaveApproval() {
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [activeTab, setActiveTab] = useState('pending')
  const [form] = Form.useForm()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      // 模拟数据
      const mockData: LeaveRequest[] = [
        {
          id: '1', employeeId: 'e1', employeeName: '张三', department: '研发部',
          type: 'annual', startDate: '2026-04-03', endDate: '2026-04-05', days: 3,
          reason: '清明节回家探亲', status: 'pending', createdAt: '2026-03-30 10:00',
        },
        {
          id: '2', employeeId: 'e2', employeeName: '李四', department: '市场部',
          type: 'sick', startDate: '2026-04-01', endDate: '2026-04-02', days: 2,
          reason: '身体不适需要休息', status: 'pending', createdAt: '2026-03-30 09:30',
        },
        {
          id: '3', employeeId: 'e3', employeeName: '王五', department: '销售部',
          type: 'personal', startDate: '2026-04-10', endDate: '2026-04-10', days: 1,
          reason: '处理私人事务', status: 'approved',
          approverId: 'm1', approverName: '赵经理', approvedAt: '2026-03-29 14:00',
          createdAt: '2026-03-28 16:00',
          history: [
            { action: '提交申请', operator: '王五', time: '2026-03-28 16:00' },
            { action: '审批通过', operator: '赵经理', time: '2026-03-29 14:00', remark: '同意' },
          ],
        },
        {
          id: '4', employeeId: 'e4', employeeName: '赵六', department: '财务部',
          type: 'annual', startDate: '2026-04-15', endDate: '2026-04-20', days: 6,
          reason: '带家人旅游', status: 'rejected',
          approverId: 'm2', approverName: '钱总监', approvedAt: '2026-03-29 10:00',
          rejectReason: '月底财务结账，请延期请假',
          createdAt: '2026-03-27 11:00',
          history: [
            { action: '提交申请', operator: '赵六', time: '2026-03-27 11:00' },
            { action: '审批拒绝', operator: '钱总监', time: '2026-03-29 10:00', remark: '月底财务结账，请延期请假' },
          ],
        },
      ]
      setRequests(mockData)
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  // 统计
  const getStats = () => {
    const pending = requests.filter(r => r.status === 'pending').length
    const approved = requests.filter(r => r.status === 'approved').length
    const rejected = requests.filter(r => r.status === 'rejected').length
    const totalDays = requests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0)
    return { pending, approved, rejected, totalDays }
  }

  const stats = getStats()

  // 审批操作
  const handleApprove = (id: string) => {
    Modal.confirm({
      title: '确认审批',
      content: '确定要通过此请假申请吗？',
      onOk: () => {
        message.success('审批通过')
        setRequests(prev => prev.map(r =>
          r.id === id ? { ...r, status: 'approved', approverName: '当前用户', approvedAt: dayjs().format('YYYY-MM-DD HH:mm') } : r
        ))
      },
    })
  }

  const handleReject = (id: string) => {
    Modal.confirm({
      title: '拒绝原因',
      content: (
        <Form.Item label="拒绝原因">
          <Input.TextArea id="rejectReason" rows={3} placeholder="请输入拒绝原因" />
        </Form.Item>
      ),
      onOk: () => {
        message.success('已拒绝')
        setRequests(prev => prev.map(r =>
          r.id === id ? { ...r, status: 'rejected', approverName: '当前用户', approvedAt: dayjs().format('YYYY-MM-DD HH:mm') } : r
        ))
      },
    })
  }

  // 查看详情
  const handleViewDetail = (record: LeaveRequest) => {
    setSelectedRequest(record)
    setDetailVisible(true)
  }

  // 表格列定义
  const columns: ColumnsType<LeaveRequest> = [
    {
      title: '申请人',
      key: 'employee',
      width: 150,
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{record.employeeName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.department}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '请假类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => {
        const config = LEAVE_TYPES[type]
        return <Tag color={config?.color || 'default'}>{config?.name || type}</Tag>
      },
    },
    {
      title: '请假时间',
      key: 'date',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <CalendarOutlined />
            <Text>{dayjs(record.startDate).format('MM-DD')} ~ {dayjs(record.endDate).format('MM-DD')}</Text>
          </Space>
          <Tag>{record.days}天</Tag>
        </Space>
      ),
    },
    {
      title: '请假原因',
      dataIndex: 'reason',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          pending: { color: 'orange', text: '待审批' },
          approved: { color: 'green', text: '已通过' },
          rejected: { color: 'red', text: '已拒绝' },
          cancelled: { color: 'default', text: '已取消' },
        }
        const c = config[status]
        return <Badge status={c.color as any} text={c.text} />
      },
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      width: 150,
      render: (time: string) => dayjs(time).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>
                通过
              </Button>
              <Button danger size="small" icon={<CloseOutlined />} onClick={() => handleReject(record.id)}>
                拒绝
              </Button>
            </>
          )}
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
        </Space>
      ),
    },
  ]

  // 过滤数据
  const filteredRequests = requests.filter(r => {
    if (activeTab === 'pending') return r.status === 'pending'
    if (activeTab === 'approved') return r.status === 'approved'
    if (activeTab === 'rejected') return r.status === 'rejected'
    return true
  })

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">请假审批</Title>
          <Text type="secondary">审核员工请假申请</Text>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">待审批</Text>}
              value={stats.pending}
              suffix="项"
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">已通过</Text>}
              value={stats.approved}
              suffix="项"
              prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">已拒绝</Text>}
              value={stats.rejected}
              suffix="项"
              prefix={<CloseOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">已批准天数</Text>}
              value={stats.totalDays}
              suffix="天"
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tab 切换 */}
      <Card className="daoda-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'pending', label: <><ClockCircleOutlined /> 待审批 ({stats.pending})</> },
            { key: 'approved', label: <><CheckOutlined /> 已通过 ({stats.approved})</> },
            { key: 'rejected', label: <><CloseOutlined /> 已拒绝 ({stats.rejected})</> },
          ]}
        />
        
        <Spin spinning={loading}>
          {filteredRequests.length === 0 ? (
            <Empty description="暂无数据" />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredRequests}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          )}
        </Spin>
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="请假详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRequest && (
          <div style={{ marginTop: 16 }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="申请人">{selectedRequest.employeeName}</Descriptions.Item>
              <Descriptions.Item label="部门">{selectedRequest.department}</Descriptions.Item>
              <Descriptions.Item label="请假类型">
                <Tag color={LEAVE_TYPES[selectedRequest.type]?.color}>
                  {LEAVE_TYPES[selectedRequest.type]?.name}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="请假天数">{selectedRequest.days}天</Descriptions.Item>
              <Descriptions.Item label="开始日期">{selectedRequest.startDate}</Descriptions.Item>
              <Descriptions.Item label="结束日期">{selectedRequest.endDate}</Descriptions.Item>
              <Descriptions.Item label="请假原因" span={2}>{selectedRequest.reason}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={selectedRequest.status === 'approved' ? 'success' : selectedRequest.status === 'rejected' ? 'error' : 'warning'}
                  text={selectedRequest.status === 'approved' ? '已通过' : selectedRequest.status === 'rejected' ? '已拒绝' : '待审批'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="提交时间">{selectedRequest.createdAt}</Descriptions.Item>
            </Descriptions>

            {selectedRequest.history && (
              <div style={{ marginTop: 24 }}>
                <Title level={5}><HistoryOutlined /> 审批历史</Title>
                <Timeline
                  items={selectedRequest.history.map(h => ({
                    color: h.action.includes('通过') ? 'green' : h.action.includes('拒绝') ? 'red' : 'blue',
                    children: (
                      <div>
                        <Text strong>{h.action}</Text>
                        <br />
                        <Text type="secondary">{h.operator} · {h.time}</Text>
                        {h.remark && <><br /><Text>{h.remark}</Text></>}
                      </div>
                    ),
                  }))}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}