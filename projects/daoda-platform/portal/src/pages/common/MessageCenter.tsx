/**
 * 消息中心页面
 * 消息列表、通知设置、任务提醒、消息订阅
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Modal,
  Descriptions,
  Tabs,
  Statistic,
  message,
  Tooltip,
  Select,
  DatePicker,
  Input,
  Popconfirm,
  Badge,
  List,
  Avatar,
  Switch,
  Divider,
  Dropdown,
  Menu,
  Checkbox,
  TimePicker,
  Empty,
} from 'antd'
import {
  BellOutlined,
  MessageOutlined,
  NotificationOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  SafetyOutlined,
  SettingOutlined,
  ReadOutlined,
  DeleteOutlined,
  InboxOutlined,
  MoreOutlined,
  FilterOutlined,
  CheckOutlined,
  CloseOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  SendOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  StopOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
const { Text, Title, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { RangePicker } = DatePicker

// 消息类型枚举
enum MessageType {
  SYSTEM = 'SYSTEM',
  TASK = 'TASK',
  NOTIFICATION = 'NOTIFICATION',
  ALERT = 'ALERT',
  APPROVAL = 'APPROVAL',
  CHAT = 'CHAT',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  REMINDER = 'REMINDER',
  WORKFLOW = 'WORKFLOW',
  REPORT = 'REPORT',
}

// 消息优先级枚举
enum MessagePriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// 消息状态枚举
enum MessageStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  PROCESSED = 'PROCESSED',
}

export default function MessageCenter() {
  const [messages, setMessages] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [rules, setRules] = useState<any[]>([])
  const [reminders, setReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null)
  const [stats, setStats] = useState({
    total: 10,
    unread: 7,
    read: 3,
    archived: 0,
    urgent: 1,
    high: 2,
  })
  const [activeTab, setActiveTab] = useState('inbox')
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  useEffect(() => {
    fetchMessages()
    fetchTemplates()
    fetchSubscriptions()
    fetchRules()
    fetchReminders()
    fetchStats()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    const mockMessages = [
      { id: 'MSG-001', type: MessageType.SYSTEM, priority: MessagePriority.NORMAL, title: '系统维护通知', content: '系统将于今晚22:00-24:00进行维护升级，届时部分功能可能无法使用，请提前安排好工作。', sender: 'system', senderName: '系统管理员', recipients: ['U-001'], status: MessageStatus.UNREAD, createdAt: new Date('2026-03-31 09:00') },
      { id: 'MSG-002', type: MessageType.ANNOUNCEMENT, priority: MessagePriority.HIGH, title: '公司公告：2026年第一季度总结大会', content: '公司将于4月5日下午14:00召开第一季度总结大会，请各部门负责人准备汇报材料。', sender: 'HR-001', senderName: '人力资源部', recipients: ['U-001'], status: MessageStatus.UNREAD, createdAt: new Date('2026-03-31 10:00') },
      { id: 'MSG-003', type: MessageType.TASK, priority: MessagePriority.NORMAL, title: '任务提醒：跟进眉山市交通局项目', content: '您有一个任务「跟进眉山市交通局项目」将于明天到期，请及时处理。', sender: 'CRM', senderName: 'CRM系统', recipients: ['U-001'], status: MessageStatus.UNREAD, actionType: 'VIEW_TASK', actionUrl: '/crm/tasks/T-001', createdAt: new Date('2026-03-31 11:00') },
      { id: 'MSG-004', type: MessageType.TASK, priority: MessagePriority.HIGH, title: '紧急任务：处理客户投诉', content: '客户「眉山机械厂」投诉产品质量问题，请尽快联系客户并处理。', sender: 'SERVICE', senderName: '售后服务系统', recipients: ['U-001'], status: MessageStatus.UNREAD, actionType: 'VIEW_TICKET', actionUrl: '/service/tickets/TK-001', createdAt: new Date('2026-03-31 12:00') },
      { id: 'MSG-005', type: MessageType.APPROVAL, priority: MessagePriority.HIGH, title: '审批通知：采购申请单', content: '赵六 提交的采购申请单需要您审批，金额：50000元，请点击查看详情。', sender: 'WF-001', senderName: '流程审批系统', recipients: ['U-001'], status: MessageStatus.UNREAD, actionType: 'APPROVE', actionUrl: '/workflow/approve/WF-001', createdAt: new Date('2026-03-31 13:00') },
      { id: 'MSG-006', type: MessageType.APPROVAL, priority: MessagePriority.NORMAL, title: '审批通知：请假申请', content: '周八 提交的请假申请需要您审批，请假天数：3天，请点击查看详情。', sender: 'WF-002', senderName: '流程审批系统', recipients: ['U-001'], status: MessageStatus.UNREAD, actionType: 'APPROVE', actionUrl: '/workflow/approve/WF-002', createdAt: new Date('2026-03-31 14:00') },
      { id: 'MSG-007', type: MessageType.WORKFLOW, priority: MessagePriority.NORMAL, title: '流程通知：采购申请单审批完成', content: '流程「采购申请单」已审批完成，状态：已通过。请查看详情。', sender: 'WF-001', senderName: '流程审批系统', recipients: ['U-001'], status: MessageStatus.READ, readAt: new Date('2026-03-31 15:00'), actionType: 'VIEW_WORKFLOW', actionUrl: '/workflow/instances/WF-001', createdAt: new Date('2026-03-31 14:30') },
      { id: 'MSG-008', type: MessageType.ALERT, priority: MessagePriority.URGENT, title: '告警：库存预警', content: '检测到库存告警：产品「电机配件」库存低于安全线，当前库存：50件，安全库存：100件。', sender: 'ERP', senderName: 'ERP系统', recipients: ['U-001'], status: MessageStatus.UNREAD, actionType: 'VIEW_INVENTORY', actionUrl: '/erp/inventory/INV-001', createdAt: new Date('2026-03-31 15:00') },
      { id: 'MSG-009', type: MessageType.REMINDER, priority: MessagePriority.NORMAL, title: '日程提醒：客户拜访', content: '您预约的客户拜访将于明天上午10:00开始，客户：眉山市交通局，地点：眉山市东坡区。', sender: 'CRM', senderName: 'CRM系统', recipients: ['U-001'], status: MessageStatus.UNREAD, actionType: 'VIEW_EVENT', actionUrl: '/crm/events/E-001', createdAt: new Date('2026-03-31 16:00') },
      { id: 'MSG-010', type: MessageType.REPORT, priority: MessagePriority.NORMAL, title: '报表通知：CRM业务汇总报表', content: '报表「CRM业务汇总报表-2026年3月」已生成完成，请点击查看或下载。', sender: 'REPORT', senderName: '报表中心', recipients: ['U-001'], status: MessageStatus.UNREAD, actionType: 'VIEW_REPORT', actionUrl: '/reports/RPT-001', createdAt: new Date('2026-03-31 17:00') },
    ]
    setMessages(mockMessages)
    setLoading(false)
  }

  const fetchTemplates = async () => {
    const mockTemplates = [
      { id: 'TPL-SYS-001', name: '系统通知模板', type: MessageType.SYSTEM, channels: ['IN_APP'], isSystem: true },
      { id: 'TPL-TASK-001', name: '任务提醒模板', type: MessageType.TASK, channels: ['IN_APP', 'EMAIL'], isSystem: true },
      { id: 'TPL-APPROVAL-001', name: '审批通知模板', type: MessageType.APPROVAL, channels: ['IN_APP', 'EMAIL', 'DINGTALK'], isSystem: true },
      { id: 'TPL-ALERT-001', name: '告警通知模板', type: MessageType.ALERT, channels: ['IN_APP', 'EMAIL', 'SMS'], isSystem: true },
      { id: 'TPL-ANNOUNCEMENT-001', name: '公告模板', type: MessageType.ANNOUNCEMENT, channels: ['IN_APP', 'EMAIL'], isSystem: true },
    ]
    setTemplates(mockTemplates)
  }

  const fetchSubscriptions = async () => {
    const mockSubs = [
      { id: 'SUB-001', userId: 'U-001', types: [MessageType.TASK, MessageType.APPROVAL, MessageType.WORKFLOW], channels: ['IN_APP', 'EMAIL'], enabled: true, quietHours: { start: '22:00', end: '08:00' } },
      { id: 'SUB-002', userId: 'U-002', types: [MessageType.ALERT, MessageType.SYSTEM], channels: ['IN_APP', 'EMAIL', 'DINGTALK'], enabled: true, quietHours: { start: '23:00', end: '07:00' } },
    ]
    setSubscriptions(mockSubs)
  }

  const fetchRules = async () => {
    const mockRules = [
      { id: 'RULE-001', name: '审批消息规则', type: MessageType.APPROVAL, channels: ['IN_APP', 'EMAIL'], enabled: true, priority: MessagePriority.HIGH },
      { id: 'RULE-002', name: '任务到期提醒规则', type: MessageType.TASK, channels: ['IN_APP', 'EMAIL'], enabled: true, priority: MessagePriority.NORMAL },
      { id: 'RULE-003', name: '系统告警规则', type: MessageType.ALERT, channels: ['IN_APP', 'EMAIL', 'SMS'], enabled: true, priority: MessagePriority.URGENT },
      { id: 'RULE-004', name: '流程状态变更规则', type: MessageType.WORKFLOW, channels: ['IN_APP', 'EMAIL'], enabled: true, priority: MessagePriority.NORMAL },
    ]
    setRules(mockRules)
  }

  const fetchReminders = async () => {
    const mockReminders = [
      { id: 'REM-001', taskId: 'T-001', taskName: '跟进眉山市交通局项目', taskType: 'CRM_TASK', remindAt: new Date('2026-04-01 09:00'), remindType: 'DUE', status: 'PENDING' },
      { id: 'REM-002', taskId: 'T-002', taskName: '处理客户投诉', taskType: 'SERVICE_TICKET', remindAt: new Date('2026-03-31 18:00'), remindType: 'OVERDUE', status: 'PENDING' },
      { id: 'REM-003', taskId: 'T-003', taskName: '审核采购申请', taskType: 'APPROVAL', remindAt: new Date('2026-03-31 20:00'), remindType: 'CUSTOM', status: 'PENDING' },
    ]
    setReminders(mockReminders)
  }

  const fetchStats = async () => {
    setStats({ total: 10, unread: 7, read: 3, archived: 0, urgent: 1, high: 2 })
  }

  const getTypeIcon = (type: MessageType) => {
    const icons: Record<MessageType, any> = {
      [MessageType.SYSTEM]: <SettingOutlined />,
      [MessageType.TASK]: <ScheduleOutlined />,
      [MessageType.NOTIFICATION]: <NotificationOutlined />,
      [MessageType.ALERT]: <AlertOutlined />,
      [MessageType.APPROVAL]: <CheckCircleOutlined />,
      [MessageType.CHAT]: <MessageOutlined />,
      [MessageType.ANNOUNCEMENT]: <BellOutlined />,
      [MessageType.REMINDER]: <ClockCircleOutlined />,
      [MessageType.WORKFLOW]: <FileTextOutlined />,
      [MessageType.REPORT]: <FileTextOutlined />,
    }
    return icons[type] || <MessageOutlined />
  }

  const getTypeTag = (type: MessageType) => {
    const config: Record<MessageType, { color: string; text: string }> = {
      [MessageType.SYSTEM]: { color: 'default', text: '系统' },
      [MessageType.TASK]: { color: 'blue', text: '任务' },
      [MessageType.NOTIFICATION]: { color: 'cyan', text: '通知' },
      [MessageType.ALERT]: { color: 'error', text: '告警' },
      [MessageType.APPROVAL]: { color: 'green', text: '审批' },
      [MessageType.CHAT]: { color: 'purple', text: '聊天' },
      [MessageType.ANNOUNCEMENT]: { color: 'gold', text: '公告' },
      [MessageType.REMINDER]: { color: 'orange', text: '提醒' },
      [MessageType.WORKFLOW]: { color: 'magenta', text: '流程' },
      [MessageType.REPORT]: { color: 'geekblue', text: '报表' },
    }
    const c = config[type] || { color: 'default', text: type }
    return <Tag color={c.color} icon={getTypeIcon(type)}>{c.text}</Tag>
  }

  const getPriorityTag = (priority: MessagePriority) => {
    const config: Record<MessagePriority, { color: string; icon: any; text: string }> = {
      [MessagePriority.LOW]: { color: 'default', icon: <StopOutlined />, text: '低' },
      [MessagePriority.NORMAL]: { color: 'blue', icon: <InfoCircleOutlined />, text: '普通' },
      [MessagePriority.HIGH]: { color: 'orange', icon: <WarningOutlined />, text: '高' },
      [MessagePriority.URGENT]: { color: 'error', icon: <ThunderboltOutlined />, text: '紧急' },
    }
    const c = config[priority]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getStatusBadge = (status: MessageStatus) => {
    if (status === MessageStatus.UNREAD) return <Badge status="processing" />
    if (status === MessageStatus.READ) return <Badge status="success" />
    if (status === MessageStatus.ARCHIVED) return <Badge status="default" />
    return <Badge status="default" />
  }

  const handleMarkAsRead = (ids: string[]) => {
    message.success(`已标记 ${ids.length} 条消息为已读`)
    setMessages(messages.map(m => ids.includes(m.id) ? { ...m, status: MessageStatus.READ, readAt: new Date() } : m))
    setSelectedRowKeys([])
  }

  const handleMarkAllAsRead = () => {
    message.success('已全部标记为已读')
    setMessages(messages.map(m => ({ ...m, status: MessageStatus.READ, readAt: new Date() })))
  }

  const handleDelete = (ids: string[]) => {
    message.success(`已删除 ${ids.length} 条消息`)
    setMessages(messages.filter(m => !ids.includes(m.id)))
    setSelectedRowKeys([])
  }

  const handleArchive = (ids: string[]) => {
    message.success(`已归档 ${ids.length} 条消息`)
    setMessages(messages.map(m => ids.includes(m.id) ? { ...m, status: MessageStatus.ARCHIVED } : m))
    setSelectedRowKeys([])
  }

  const handleAction = (msg: any) => {
    message.info(`执行操作: ${msg.actionType}`)
    if (msg.actionUrl) {
      // 模拟跳转
      message.success(`跳转到: ${msg.actionUrl}`)
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: any[]) => setSelectedRowKeys(keys as string[]),
  }

  const messageColumns: ColumnsType<any> = [
    {
      title: '状态',
      dataIndex: 'status',
      width: 60,
      render: (status: MessageStatus, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getStatusBadge(status)}
          {record.priority === MessagePriority.URGENT && <ThunderboltOutlined style={{ color: '#ff4d4f', marginLeft: 4 }} />}
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (type: MessageType) => getTypeTag(type),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      render: (priority: MessagePriority) => getPriorityTag(priority),
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 250,
      ellipsis: true,
      render: (title: string, record) => (
        <Text strong={record.status === MessageStatus.UNREAD}>{title}</Text>
      ),
    },
    {
      title: '发送者',
      dataIndex: 'senderName',
      width: 120,
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 100,
      render: (time: Date) => dayjs(time).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedMessage(record); setDetailModalVisible(true) }}>详情</Button>
          {record.actionUrl && (
            <Button type="link" size="small" icon={<SendOutlined />} onClick={() => handleAction(record)}>处理</Button>
          )}
        </Space>
      ),
    },
  ]

  const templateColumns: ColumnsType<any> = [
    { title: '模板ID', dataIndex: 'id', width: 100 },
    { title: '名称', dataIndex: 'name', width: 150 },
    { title: '类型', dataIndex: 'type', width: 100, render: (type: MessageType) => getTypeTag(type) },
    { title: '通知渠道', dataIndex: 'channels', width: 150, render: (channels: string[]) => channels.map(c => <Tag key={c}>{c}</Tag>) },
    { title: '系统模板', dataIndex: 'isSystem', width: 80, render: (sys: boolean) => sys ? <Tag color="blue">系统</Tag> : <Tag>自定义</Tag> },
    { title: '操作', key: 'action', width: 100, render: () => <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button> },
  ]

  const ruleColumns: ColumnsType<any> = [
    { title: '规则ID', dataIndex: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', width: 150 },
    { title: '类型', dataIndex: 'type', width: 100, render: (type: MessageType) => getTypeTag(type) },
    { title: '渠道', dataIndex: 'channels', width: 150, render: (channels: string[]) => channels.map(c => <Tag key={c}>{c}</Tag>) },
    { title: '优先级', dataIndex: 'priority', width: 80, render: (p: MessagePriority) => getPriorityTag(p) },
    { title: '状态', dataIndex: 'enabled', width: 80, render: (enabled: boolean) => <Switch checked={enabled} /> },
    { title: '操作', key: 'action', width: 100, render: () => <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button> },
  ]

  const reminderColumns: ColumnsType<any> = [
    { title: '任务', dataIndex: 'taskName', width: 200 },
    { title: '类型', dataIndex: 'taskType', width: 100 },
    { title: '提醒时间', dataIndex: 'remindAt', width: 120, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '提醒类型', dataIndex: 'remindType', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80, render: (status: string) => <Tag color={status === 'PENDING' ? 'processing' : status === 'SENT' ? 'success' : 'default'}>{status}</Tag> },
    { title: '操作', key: 'action', width: 80, render: (_, record) => (
      <Popconfirm title="确认取消提醒？" onConfirm={() => message.success('提醒已取消')}>
        <Button type="link" size="small" danger>取消</Button>
      </Popconfirm>
    )},
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <BellOutlined style={{ marginRight: 8 }} />
            消息中心
          </Title>
          <Text type="secondary">消息列表、通知设置、任务提醒、消息订阅</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<CheckOutlined />} style={{ marginRight: 8 }} onClick={handleMarkAllAsRead}>全部已读</Button>
          <Button icon={<SettingOutlined />}>消息设置</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">全部消息</Text>} value={stats.total} prefix={<MessageOutlined style={{ color: '#1890ff' }} />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">未读消息</Text>} value={stats.unread} prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">已读消息</Text>} value={stats.read} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">紧急消息</Text>} value={stats.urgent} prefix={<ThunderboltOutlined style={{ color: '#ff4d4f' }} />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">高优先级</Text>} value={stats.high} prefix={<WarningOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">待提醒任务</Text>} value={reminders.filter(r => r.status === 'PENDING').length} prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      {/* 消息列表 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={<Badge count={stats.unread} offset={[10, 0]}>收件箱</Badge>} key="inbox">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="消息类型" style={{ width: 120 }} allowClear>
                <Option value="SYSTEM">系统</Option>
                <Option value="TASK">任务</Option>
                <Option value="APPROVAL">审批</Option>
                <Option value="ALERT">告警</Option>
                <Option value="ANNOUNCEMENT">公告</Option>
              </Select>
              <Select placeholder="优先级" style={{ width: 100 }} allowClear>
                <Option value="URGENT">紧急</Option>
                <Option value="HIGH">高</Option>
                <Option value="NORMAL">普通</Option>
                <Option value="LOW">低</Option>
              </Select>
              <Select placeholder="状态" style={{ width: 100 }} allowClear>
                <Option value="UNREAD">未读</Option>
                <Option value="READ">已读</Option>
                <Option value="ARCHIVED">已归档</Option>
              </Select>
              <RangePicker />
              <Input.Search placeholder="搜索消息" style={{ width: 200 }} />
              {selectedRowKeys.length > 0 && (
                <Space>
                  <Button icon={<ReadOutlined />} onClick={() => handleMarkAsRead(selectedRowKeys)}>标记已读</Button>
                  <Button icon={<InboxOutlined />} onClick={() => handleArchive(selectedRowKeys)}>归档</Button>
                  <Popconfirm title="确认删除选中消息？" onConfirm={() => handleDelete(selectedRowKeys)}>
                    <Button icon={<DeleteOutlined />} danger>删除</Button>
                  </Popconfirm>
                </Space>
              )}
            </Space>
            <Table
              columns={messageColumns}
              dataSource={messages.filter(m => m.status !== MessageStatus.DELETED)}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 20 }}
              rowSelection={rowSelection}
              onRow={(record) => ({
                onClick: () => { setSelectedMessage(record); setDetailModalVisible(true) },
                style: { cursor: 'pointer', background: record.status === MessageStatus.UNREAD ? '#f0f5ff' : 'inherit' },
              })}
            />
          </Card>
        </TabPane>
        <TabPane tab="已归档" key="archived">
          <Card className="daoda-card">
            <Table
              columns={messageColumns}
              dataSource={messages.filter(m => m.status === MessageStatus.ARCHIVED)}
              rowKey="id"
              pagination={{ pageSize: 20 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="消息模板" key="templates">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="消息类型" style={{ width: 120 }} allowClear>
                <Option value="SYSTEM">系统</Option>
                <Option value="TASK">任务</Option>
                <Option value="APPROVAL">审批</Option>
              </Select>
              <Button icon={<PlusOutlined />}>新建模板</Button>
            </Space>
            <Table columns={templateColumns} dataSource={templates} rowKey="id" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
        <TabPane tab="通知规则" key="rules">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<PlusOutlined />}>新建规则</Button>
            </Space>
            <Table columns={ruleColumns} dataSource={rules} rowKey="id" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
        <TabPane tab="任务提醒" key="reminders">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="提醒状态" style={{ width: 120 }} allowClear>
                <Option value="PENDING">待发送</Option>
                <Option value="SENT">已发送</Option>
                <Option value="CANCELLED">已取消</Option>
              </Select>
            </Space>
            <Table columns={reminderColumns} dataSource={reminders} rowKey="id" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
        <TabPane tab="消息订阅" key="subscriptions">
          <Card className="daoda-card">
            <List
              itemLayout="horizontal"
              dataSource={subscriptions}
              renderItem={item => (
                <List.Item actions={[<Button type="link" key="edit">编辑</Button>]}>
                  <List.Item.Meta
                    avatar={<Avatar icon={<BellOutlined />} />}
                    title={<Space>{item.userId}<Switch checked={item.enabled} /></Space>}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">消息类型: {item.types.map((t: MessageType) => getTypeTag(t))}</Text>
                        <Text type="secondary">通知渠道: {item.channels.map((c: string) => <Tag key={c}>{c}</Tag>)}</Text>
                        <Text type="secondary">免打扰: {item.quietHours.start} - {item.quietHours.end}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 消息详情弹窗 */}
      <Modal
        title={
          <Space>
            {selectedMessage && getTypeTag(selectedMessage.type)}
            {selectedMessage?.title}
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Space>
            {selectedMessage?.status === MessageStatus.UNREAD && (
              <Button onClick={() => { handleMarkAsRead([selectedMessage.id]); setDetailModalVisible(false) }}>标记已读</Button>
            )}
            {selectedMessage?.actionUrl && (
              <Button type="primary" onClick={() => handleAction(selectedMessage)}>立即处理</Button>
            )}
            <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
          </Space>
        }
        width={600}
      >
        {selectedMessage && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                {getPriorityTag(selectedMessage.priority)}
                <Text type="secondary">{selectedMessage.senderName}</Text>
                <Text type="secondary">{dayjs(selectedMessage.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
              </Space>
            </div>
            <Paragraph>{selectedMessage.content}</Paragraph>
            {selectedMessage.readAt && (
              <Text type="secondary">已读于: {dayjs(selectedMessage.readAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}