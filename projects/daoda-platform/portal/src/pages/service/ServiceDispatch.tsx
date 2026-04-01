/**
 * 服务调度页面
 * 工程师排班、任务分配、工作量平衡、技能匹配
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Statistic,
  Row,
  Col,
  Modal,
  Descriptions,
  Badge,
  Avatar,
  Tabs,
  List,
  Progress,
  Tooltip,
  message,
} from 'antd'
import {
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ToolOutlined,
  TeamOutlined,
  BarChartOutlined,
  EyeOutlined,
  ScheduleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { TabPane } = Tabs

enum ScheduleStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  BUSY = 'BUSY',
  OFF_DUTY = 'OFF_DUTY',
  ON_LEAVE = 'ON_LEAVE',
}

enum ServiceType {
  INSTALLATION = 'INSTALLATION',
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
  INSPECTION = 'INSPECTION',
  TRAINING = 'TRAINING',
  CONSULTATION = 'CONSULTATION',
}

enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export default function ServiceDispatch() {
  const [engineers, setEngineers] = useState<any[]>([])
  const [serviceTasks, setServiceTasks] = useState<any[]>([])
  const [scheduleRecords, setScheduleRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [suggestModalVisible, setSuggestModalVisible] = useState(false)
  const [selectedEngineer, setSelectedEngineer] = useState<any | null>(null)
  const [selectedTask, setSelectedTask] = useState<any | null>(null)
  const [scheduleSuggestions, setScheduleSuggestions] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalEngineers: 6,
    availableEngineers: 3,
    busyEngineers: 2,
    pendingTasks: 3,
    scheduledTasks: 1,
    inProgressTasks: 2,
    urgentTasks: 1,
    avgTasksPerEngineer: 0.67,
  })
  const [workloadBalance, setWorkloadBalance] = useState<any>({
    overloaded: [],
    underloaded: [],
    balanced: [],
    recommendations: [],
  })

  useEffect(() => {
    fetchEngineers()
    fetchServiceTasks()
    fetchScheduleRecords()
    fetchStats()
    fetchWorkloadBalance()
  }, [])

  const fetchEngineers = async () => {
    setLoading(true)
    const mockData = [
      {
        id: 'ENG-001',
        name: '张工',
        department: '售后服务部',
        skills: ['设备安装', '系统调试', '故障排查', '网络配置'],
        certifications: ['高级工程师', '安全认证'],
        status: ScheduleStatus.BUSY,
        currentLocation: { address: '成都市高新区' },
        currentTask: '设备安装调试',
        workingHours: { start: '08:00', end: '18:00' },
        assignedTasksCount: 2,
        completedTasksToday: 3,
        rating: 4.8,
        specializations: ['智能设备', '网络系统'],
      },
      {
        id: 'ENG-002',
        name: '李工',
        department: '售后服务部',
        skills: ['维修保养', '故障排查', '零部件更换', '系统升级'],
        certifications: ['中级工程师'],
        status: ScheduleStatus.AVAILABLE,
        currentLocation: { address: '成都市武侯区' },
        workingHours: { start: '08:00', end: '18:00' },
        assignedTasksCount: 0,
        completedTasksToday: 2,
        rating: 4.5,
        specializations: ['维修', '保养'],
      },
      {
        id: 'ENG-003',
        name: '王工',
        department: '售后服务部',
        skills: ['培训指导', '技术咨询', '系统演示', '文档编写'],
        certifications: ['培训师认证'],
        status: ScheduleStatus.AVAILABLE,
        currentLocation: { address: '成都市金牛区' },
        workingHours: { start: '09:00', end: '17:00' },
        assignedTasksCount: 1,
        completedTasksToday: 1,
        rating: 4.6,
        specializations: ['培训', '咨询'],
      },
      {
        id: 'ENG-004',
        name: '赵工',
        department: '售后服务部',
        skills: ['设备安装', '现场勘察', '方案设计', '项目协调'],
        certifications: ['项目经理认证'],
        status: ScheduleStatus.ASSIGNED,
        currentLocation: { address: '成都市锦江区' },
        currentTask: '现场勘察',
        workingHours: { start: '08:30', end: '17:30' },
        assignedTasksCount: 1,
        completedTasksToday: 0,
        rating: 4.7,
        specializations: ['项目管理', '方案设计'],
      },
      {
        id: 'ENG-005',
        name: '孙工',
        department: '售后服务部',
        skills: ['巡检检查', '数据采集', '报告编写', '风险评估'],
        certifications: ['安全检查员'],
        status: ScheduleStatus.OFF_DUTY,
        workingHours: { start: '08:00', end: '18:00' },
        assignedTasksCount: 0,
        completedTasksToday: 4,
        rating: 4.4,
        specializations: ['巡检', '评估'],
      },
      {
        id: 'ENG-006',
        name: '周工',
        department: '售后服务部',
        skills: ['紧急维修', '远程支持', '故障诊断', '应急响应'],
        certifications: ['高级工程师', '应急响应认证'],
        status: ScheduleStatus.AVAILABLE,
        currentLocation: { address: '成都市成华区' },
        workingHours: { start: '08:00', end: '20:00' },
        assignedTasksCount: 0,
        completedTasksToday: 2,
        rating: 4.9,
        specializations: ['紧急响应', '远程支持'],
      },
    ]
    setEngineers(mockData)
    setLoading(false)
  }

  const fetchServiceTasks = async () => {
    const mockTasks = [
      {
        id: 'ST-001',
        type: ServiceType.INSTALLATION,
        priority: Priority.HIGH,
        title: '智能设备安装调试',
        description: '为新客户安装智能车辆管理终端设备',
        customerName: 'ABC物流公司',
        customerPhone: '13800138001',
        location: { address: '成都市高新区天府大道100号' },
        requiredSkills: ['设备安装', '系统调试'],
        estimatedDuration: 180,
        scheduledTime: '10:00',
        assignedEngineerName: '张工',
        status: 'IN_PROGRESS',
      },
      {
        id: 'ST-002',
        type: ServiceType.INSPECTION,
        priority: Priority.MEDIUM,
        title: '现场勘察评估',
        customerName: 'XYZ运输公司',
        location: { address: '成都市武侯区人民南路50号' },
        requiredSkills: ['现场勘察', '方案设计'],
        estimatedDuration: 120,
        scheduledTime: '14:00',
        assignedEngineerName: '赵工',
        status: 'SCHEDULED',
      },
      {
        id: 'ST-003',
        type: ServiceType.REPAIR,
        priority: Priority.URGENT,
        title: '紧急故障修复',
        description: '客户设备紧急故障，需要立即响应',
        customerName: 'DEF快递公司',
        customerPhone: '13900139001',
        location: { address: '成都市金牛区一环路20号' },
        requiredSkills: ['紧急维修', '故障诊断'],
        estimatedDuration: 60,
        status: 'PENDING',
      },
      {
        id: 'ST-004',
        type: ServiceType.TRAINING,
        priority: Priority.LOW,
        title: '系统使用培训',
        customerName: 'GHI公司',
        location: { address: '成都市锦江区东大街30号' },
        requiredSkills: ['培训指导', '系统演示'],
        estimatedDuration: 90,
        status: 'PENDING',
      },
      {
        id: 'ST-005',
        type: ServiceType.MAINTENANCE,
        priority: Priority.MEDIUM,
        title: '定期维护保养',
        customerName: 'JKL公司',
        location: { address: '成都市成华区建设路40号' },
        requiredSkills: ['维修保养'],
        estimatedDuration: 60,
        scheduledDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        status: 'PENDING',
      },
    ]
    setServiceTasks(mockTasks)
  }

  const fetchScheduleRecords = async () => {
    const mockRecords = [
      { id: 'SR-001', engineerName: '张工', shift: 'FULL_DAY', startTime: '08:00', endTime: '18:00', status: ScheduleStatus.BUSY, tasksCount: 3 },
      { id: 'SR-002', engineerName: '李工', shift: 'FULL_DAY', startTime: '08:00', endTime: '18:00', status: ScheduleStatus.AVAILABLE, tasksCount: 0 },
      { id: 'SR-003', engineerName: '王工', shift: 'MORNING', startTime: '09:00', endTime: '12:00', status: ScheduleStatus.ASSIGNED, tasksCount: 1 },
      { id: 'SR-004', engineerName: '赵工', shift: 'AFTERNOON', startTime: '14:00', endTime: '17:30', status: ScheduleStatus.ASSIGNED, tasksCount: 1 },
      { id: 'SR-005', engineerName: '孙工', shift: 'MORNING', startTime: '08:00', endTime: '12:00', status: ScheduleStatus.OFF_DUTY, tasksCount: 4 },
      { id: 'SR-006', engineerName: '周工', shift: 'FULL_DAY', startTime: '08:00', endTime: '20:00', status: ScheduleStatus.AVAILABLE, tasksCount: 0 },
    ]
    setScheduleRecords(mockRecords)
  }

  const fetchStats = async () => {
    setStats({
      totalEngineers: 6,
      availableEngineers: 3,
      busyEngineers: 2,
      pendingTasks: 3,
      scheduledTasks: 1,
      inProgressTasks: 2,
      urgentTasks: 1,
      avgTasksPerEngineer: 0.67,
    })
  }

  const fetchWorkloadBalance = async () => {
    setWorkloadBalance({
      overloaded: [{ name: '张工', assignedTasksCount: 2 }],
      underloaded: [{ name: '李工', assignedTasksCount: 0 }, { name: '周工', assignedTasksCount: 0 }],
      balanced: [{ name: '王工', assignedTasksCount: 1 }, { name: '赵工', assignedTasksCount: 1 }],
      recommendations: [
        '张工当前任务较多，建议将部分任务分配给李工',
        '周工具备紧急响应能力，建议优先分配紧急任务',
      ],
    })
  }

  const getStatusTag = (status: ScheduleStatus) => {
    const config: Record<ScheduleStatus, { color: string; text: string }> = {
      AVAILABLE: { color: 'success', text: '空闲' },
      ASSIGNED: { color: 'processing', text: '已分配' },
      BUSY: { color: 'warning', text: '忙碌' },
      OFF_DUTY: { color: 'default', text: '休息' },
      ON_LEAVE: { color: 'default', text: '请假' },
    }
    return <Tag color={config[status].color}>{config[status].text}</Tag>
  }

  const getPriorityTag = (priority: Priority) => {
    const config: Record<Priority, { color: string; text: string }> = {
      LOW: { color: 'default', text: '低' },
      MEDIUM: { color: 'blue', text: '中' },
      HIGH: { color: 'warning', text: '高' },
      URGENT: { color: 'error', text: '紧急' },
    }
    return <Tag color={config[priority].color}>{config[priority].text}</Tag>
  }

  const getServiceTypeTag = (type: ServiceType) => {
    const config: Record<ServiceType, { color: string; text: string }> = {
      INSTALLATION: { color: 'gold', text: '安装' },
      MAINTENANCE: { color: 'green', text: '维护' },
      REPAIR: { color: 'red', text: '维修' },
      INSPECTION: { color: 'blue', text: '勘察' },
      TRAINING: { color: 'purple', text: '培训' },
      CONSULTATION: { color: 'cyan', text: '咨询' },
    }
    return <Tag color={config[type].color}>{config[type].text}</Tag>
  }

  const getTaskStatusTag = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      PENDING: { color: 'default', text: '待分配' },
      SCHEDULED: { color: 'processing', text: '已安排' },
      IN_PROGRESS: { color: 'warning', text: '进行中' },
      COMPLETED: { color: 'success', text: '已完成' },
      CANCELLED: { color: 'error', text: '已取消' },
    }
    return <Tag color={config[status]?.color || 'default'}>{config[status]?.text || status}</Tag>
  }

  const handleShowSuggestions = (task: any) => {
    setSelectedTask(task)
    // 模拟调度建议
    setScheduleSuggestions([
      { engineerName: '周工', matchScore: 85, reason: '具备紧急响应能力', estimatedTravelTime: 15, currentLoad: 0 },
      { engineerName: '李工', matchScore: 70, reason: '技能匹配且当前空闲', estimatedTravelTime: 25, currentLoad: 0 },
      { engineerName: '张工', matchScore: 60, reason: '技能完全匹配', estimatedTravelTime: 10, currentLoad: 2 },
    ])
    setSuggestModalVisible(true)
  }

  const engineerColumns: ColumnsType<any> = [
    { title: '工程师', dataIndex: 'name', width: 100, render: (name: string) => <Avatar style={{ marginRight: 8 }}>{name[0]}</Avatar> },
    { title: '状态', dataIndex: 'status', width: 80, render: (status: ScheduleStatus) => getStatusTag(status) },
    { title: '技能', dataIndex: 'skills', width: 150, render: (skills: string[]) => skills.slice(0, 2).map(s => <Tag key={s}>{s}</Tag>) },
    { title: '当前任务', dataIndex: 'currentTask', width: 120, render: (task: string) => task || '-' },
    { title: '位置', dataIndex: 'currentLocation', width: 100, render: (loc: any) => loc?.address ? <Text ellipsis>{loc.address}</Text> : '-' },
    { title: '今日完成', dataIndex: 'completedTasksToday', width: 80 },
    { title: '评分', dataIndex: 'rating', width: 60, render: (rating: number) => <Text style={{ color: '#faad14' }}>{rating}</Text> },
    { title: '操作', key: 'action', width: 80, render: (_, record) => <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedEngineer(record); setDetailModalVisible(true) }}>详情</Button> },
  ]

  const taskColumns: ColumnsType<any> = [
    { title: '任务ID', dataIndex: 'id', width: 80 },
    { title: '类型', dataIndex: 'type', width: 80, render: (type: ServiceType) => getServiceTypeTag(type) },
    { title: '优先级', dataIndex: 'priority', width: 80, render: (priority: Priority) => getPriorityTag(priority) },
    { title: '任务名称', dataIndex: 'title', width: 150, ellipsis: true },
    { title: '客户', dataIndex: 'customerName', width: 100 },
    { title: '位置', dataIndex: 'location', width: 120, render: (loc: any) => <Text ellipsis>{loc?.address}</Text> },
    { title: '状态', dataIndex: 'status', width: 80, render: (status: string) => getTaskStatusTag(status) },
    { title: '负责人', dataIndex: 'assignedEngineerName', width: 80, render: (name: string) => name ? <Avatar size="small">{name[0]}</Avatar> : '-' },
    { title: '预计时间', dataIndex: 'estimatedDuration', width: 80, render: (min: number) => `${min}分钟` },
    { title: '操作', key: 'action', width: 100, render: (_, record) => (
      record.status === 'PENDING' ? <Button type="link" size="small" icon={<ScheduleOutlined />} onClick={() => handleShowSuggestions(record)}>调度</Button> : null
    )},
  ]

  const scheduleColumns: ColumnsType<any> = [
    { title: '工程师', dataIndex: 'engineerName', width: 100, render: (name: string) => <Avatar style={{ marginRight: 8 }}>{name[0]}</Avatar> },
    { title: '班次', dataIndex: 'shift', width: 100, render: (shift: string) => <Tag color="blue">{shift}</Tag> },
    { title: '工作时间', width: 120, render: (_, record) => `${record.startTime}-${record.endTime}` },
    { title: '状态', dataIndex: 'status', width: 80, render: (status: ScheduleStatus) => getStatusTag(status) },
    { title: '任务数', dataIndex: 'tasksCount', width: 80 },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <CalendarOutlined style={{ marginRight: 8 }} />
            服务调度
          </Title>
          <Text type="secondary">工程师排班、任务分配、工作量平衡</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<TeamOutlined />} style={{ marginRight: 8 }}>工作量分析</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">工程师总数</Text>}
              value={stats.totalEngineers}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">空闲工程师</Text>}
              value={stats.availableEngineers}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">忙碌工程师</Text>}
              value={stats.busyEngineers}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">待分配任务</Text>}
              value={stats.pendingTasks}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">紧急任务</Text>}
              value={stats.urgentTasks}
              prefix={<ThunderboltOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均负载</Text>}
              value={stats.avgTasksPerEngineer}
              suffix="任务/人"
              prefix={<BarChartOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 工程师和任务列表 */}
      <Tabs defaultActiveKey="engineers">
        <TabPane tab="工程师状态" key="engineers">
          <Card className="daoda-card">
            <Table
              columns={engineerColumns}
              dataSource={engineers}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="服务任务" key="tasks">
          <Card className="daoda-card">
            <Table
              columns={taskColumns}
              dataSource={serviceTasks}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="排班表" key="schedule">
          <Card className="daoda-card">
            <Table
              columns={scheduleColumns}
              dataSource={scheduleRecords}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>
        <TabPane tab="工作量平衡" key="balance">
          <Row gutter={16}>
            <Col span={8}>
              <Card className="daoda-card" title={<Text type="warning">负载过重</Text>} size="small">
                <List
                  dataSource={workloadBalance.overloaded}
                  renderItem={(item: any) => (
                    <List.Item>
                      <Avatar style={{ marginRight: 8 }}>{item.name[0]}</Avatar>
                      <Text>{item.name}</Text>
                      <Badge count={item.assignedTasksCount} style={{ backgroundColor: '#ff4d4f' }} />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="daoda-card" title={<Text type="success">空闲可分配</Text>} size="small">
                <List
                  dataSource={workloadBalance.underloaded}
                  renderItem={(item: any) => (
                    <List.Item>
                      <Avatar style={{ marginRight: 8 }}>{item.name[0]}</Avatar>
                      <Text>{item.name}</Text>
                      <Badge count={item.assignedTasksCount} style={{ backgroundColor: '#52c41a' }} />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="daoda-card" title="优化建议" size="small">
                <List
                  dataSource={workloadBalance.recommendations}
                  renderItem={(item: string) => (
                    <List.Item>
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 工程师详情弹窗 */}
      <Modal
        title="工程师详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedEngineer && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="姓名">{selectedEngineer.name}</Descriptions.Item>
            <Descriptions.Item label="状态">{getStatusTag(selectedEngineer.status)}</Descriptions.Item>
            <Descriptions.Item label="部门">{selectedEngineer.department}</Descriptions.Item>
            <Descriptions.Item label="评分"><Text style={{ color: '#faad14' }}>{selectedEngineer.rating}</Text></Descriptions.Item>
            <Descriptions.Item label="当前任务">{selectedEngineer.currentTask || '-'}</Descriptions.Item>
            <Descriptions.Item label="今日完成">{selectedEngineer.completedTasksToday}个</Descriptions.Item>
            <Descriptions.Item label="技能">{selectedEngineer.skills?.join(', ')}</Descriptions.Item>
            <Descriptions.Item label="资质">{selectedEngineer.certifications?.join(', ')}</Descriptions.Item>
            <Descriptions.Item label="当前位置">{selectedEngineer.currentLocation?.address || '-'}</Descriptions.Item>
            <Descriptions.Item label="工作时间">{selectedEngineer.workingHours?.start} - {selectedEngineer.workingHours?.end}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 调度建议弹窗 */}
      <Modal
        title={`任务调度建议 - ${selectedTask?.title}`}
        open={suggestModalVisible}
        onCancel={() => setSuggestModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setSuggestModalVisible(false)}>取消</Button>,
          <Button key="assign" type="primary" onClick={() => { message.success('分配成功'); setSuggestModalVisible(false) }}>确认分配</Button>,
        ]}
        width={600}
      >
        {selectedTask && (
          <div>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="任务类型">{getServiceTypeTag(selectedTask.type)}</Descriptions.Item>
              <Descriptions.Item label="优先级">{getPriorityTag(selectedTask.priority)}</Descriptions.Item>
              <Descriptions.Item label="客户">{selectedTask.customerName}</Descriptions.Item>
              <Descriptions.Item label="预计时长">{selectedTask.estimatedDuration}分钟</Descriptions.Item>
              <Descriptions.Item label="位置">{selectedTask.location?.address}</Descriptions.Item>
              <Descriptions.Item label="所需技能">{selectedTask.requiredSkills?.join(', ')}</Descriptions.Item>
            </Descriptions>

            <Title level={5}>推荐工程师</Title>
            <List
              dataSource={scheduleSuggestions}
              renderItem={(item: any) => (
                <List.Item actions={[<Button type="link" size="small">选择</Button>]}>
                  <List.Item.Meta
                    avatar={<Avatar>{item.engineerName[0]}</Avatar>}
                    title={<Text>{item.engineerName}</Text>}
                    description={
                      <Space>
                        <Progress percent={item.matchScore} size="small" style={{ width: 100 }} />
                        <Tag color="blue">{item.reason}</Tag>
                        <Text type="secondary">路程:{item.estimatedTravelTime}分钟</Text>
                        <Text type="secondary">当前负载:{item.currentLoad}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}