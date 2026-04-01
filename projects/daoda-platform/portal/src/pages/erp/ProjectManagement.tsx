/**
 * 项目管理页面
 * 项目创建、进度跟踪、任务管理、资源分配
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
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Progress,
  Tabs,
  Descriptions,
  Badge,
  List,
  Avatar,
  Tooltip,
} from 'antd'
import {
  ProjectOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  DollarOutlined,
  BarChartOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { RangePicker } = DatePicker

enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
}

enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [stats, setStats] = useState({
    totalProjects: 5,
    activeProjects: 2,
    completedProjects: 1,
    onHoldProjects: 1,
    totalBudget: 980000,
    spentBudget: 555000,
    avgProgress: 49,
  })
  const [taskStats, setTaskStats] = useState({
    totalTasks: 8,
    todoTasks: 3,
    inProgressTasks: 3,
    doneTasks: 2,
    blockedTasks: 0,
    overdueTasks: 0,
  })
  const [resourceAllocation, setResourceAllocation] = useState<any[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    fetchProjects()
    fetchTasks()
    fetchStats()
    fetchResourceAllocation()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    const mockData = [
      {
        id: 'PRJ-001',
        name: '道达智能车辆管理平台开发',
        code: 'IOV-PLATFORM',
        type: 'R_D',
        status: ProjectStatus.IN_PROGRESS,
        description: '智能车辆管理平台核心系统开发',
        ownerName: '张三',
        teamMembers: ['张三', '李四', '王五', '赵六', '钱七'],
        startDate: '2026-01-01',
        estimatedEndDate: '2026-06-30',
        progress: 75,
        budget: 500000,
        spentBudget: 350000,
        priority: TaskPriority.HIGH,
        milestones: [
          { name: '需求分析完成', dueDate: '2026-01-15', completed: true },
          { name: '架构设计完成', dueDate: '2026-02-01', completed: true },
          { name: '核心模块开发完成', dueDate: '2026-04-01', completed: false },
        ],
        risks: [{ description: '核心技术人员离职风险', probability: 'LOW', impact: 'HIGH' }],
      },
      {
        id: 'PRJ-002',
        name: '客户CRM系统定制开发',
        code: 'CRM-CUSTOM',
        type: 'CLIENT',
        status: ProjectStatus.IN_PROGRESS,
        clientName: 'ABC科技公司',
        ownerName: '李四',
        teamMembers: ['李四', '王五', '孙八'],
        startDate: '2026-02-01',
        estimatedEndDate: '2026-05-01',
        progress: 50,
        budget: 200000,
        spentBudget: 100000,
        priority: TaskPriority.HIGH,
        milestones: [
          { name: '需求确认', dueDate: '2026-02-15', completed: true },
          { name: '原型设计完成', dueDate: '2026-03-01', completed: true },
          { name: '开发完成', dueDate: '2026-04-15', completed: false },
        ],
      },
      {
        id: 'PRJ-003',
        name: '系统运维优化项目',
        code: 'OPS-OPT',
        type: 'MAINTENANCE',
        status: ProjectStatus.PLANNING,
        ownerName: '王五',
        teamMembers: ['王五', '周九'],
        startDate: '2026-04-01',
        estimatedEndDate: '2026-06-01',
        progress: 0,
        budget: 50000,
        spentBudget: 0,
        priority: TaskPriority.MEDIUM,
      },
      {
        id: 'PRJ-004',
        name: '内部OA系统升级',
        code: 'OA-UPGRADE',
        type: 'INTERNAL',
        status: ProjectStatus.COMPLETED,
        ownerName: '赵六',
        teamMembers: ['赵六', '吴十'],
        startDate: '2025-10-01',
        endDate: '2026-01-15',
        progress: 100,
        budget: 80000,
        spentBudget: 75000,
        priority: TaskPriority.MEDIUM,
      },
      {
        id: 'PRJ-005',
        name: '移动端App开发',
        code: 'APP-DEV',
        type: 'R_D',
        status: ProjectStatus.ON_HOLD,
        ownerName: '钱七',
        teamMembers: ['钱七'],
        startDate: '2026-01-15',
        progress: 20,
        budget: 150000,
        spentBudget: 30000,
        priority: TaskPriority.MEDIUM,
        risks: [{ description: '需求变更频繁', probability: 'HIGH', impact: 'MEDIUM' }],
      },
    ]
    setProjects(mockData)
    setLoading(false)
  }

  const fetchTasks = async () => {
    const mockTasks = [
      { id: 'TK-001', projectId: 'PRJ-001', projectName: 'IOV-PLATFORM', name: '完成用户模块开发', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeName: '张三', dueDate: '2026-02-15', estimatedHours: 80, actualHours: 75 },
      { id: 'TK-002', projectId: 'PRJ-001', projectName: 'IOV-PLATFORM', name: '完成车辆接入模块', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, assigneeName: '李四', dueDate: '2026-03-15', estimatedHours: 100, actualHours: 60 },
      { id: 'TK-003', projectId: 'PRJ-001', projectName: 'IOV-PLATFORM', name: '完成监控模块开发', status: TaskStatus.TODO, priority: TaskPriority.HIGH, assigneeName: '王五', dueDate: '2026-04-01', estimatedHours: 120 },
      { id: 'TK-004', projectId: 'PRJ-001', projectName: 'IOV-PLATFORM', name: '前端页面开发', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.MEDIUM, assigneeName: '赵六', dueDate: '2026-03-20', estimatedHours: 60, actualHours: 40 },
      { id: 'TK-005', projectId: 'PRJ-002', projectName: 'CRM-CUSTOM', name: '完成客户管理功能', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeName: '李四', estimatedHours: 50, actualHours: 45 },
      { id: 'TK-006', projectId: 'PRJ-002', projectName: 'CRM-CUSTOM', name: '完成报表模块', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.MEDIUM, assigneeName: '王五', dueDate: '2026-04-01', estimatedHours: 40, actualHours: 20 },
      { id: 'TK-007', projectId: 'PRJ-002', projectName: 'CRM-CUSTOM', name: '客户培训准备', status: TaskStatus.TODO, priority: TaskPriority.LOW, assigneeName: '孙八', dueDate: '2026-04-20', estimatedHours: 20 },
      { id: 'TK-008', projectId: 'PRJ-003', projectName: 'OPS-OPT', name: '性能优化方案设计', status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, assigneeName: '王五', dueDate: '2026-04-10', estimatedHours: 30 },
    ]
    setTasks(mockTasks)
    setTaskStats({
      totalTasks: mockTasks.length,
      todoTasks: mockTasks.filter(t => t.status === TaskStatus.TODO).length,
      inProgressTasks: mockTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      doneTasks: mockTasks.filter(t => t.status === TaskStatus.DONE).length,
      blockedTasks: mockTasks.filter(t => t.status === TaskStatus.BLOCKED).length,
      overdueTasks: 0,
    })
  }

  const fetchStats = async () => {
    setStats({
      totalProjects: 5,
      activeProjects: 2,
      completedProjects: 1,
      onHoldProjects: 1,
      totalBudget: 980000,
      spentBudget: 555000,
      avgProgress: 49,
    })
  }

  const fetchResourceAllocation = async () => {
    setResourceAllocation([
      { userName: '张三', assignedTasks: 1, totalHours: 80, projects: ['IOV-PLATFORM'] },
      { userName: '李四', assignedTasks: 2, totalHours: 150, projects: ['IOV-PLATFORM', 'CRM-CUSTOM'] },
      { userName: '王五', assignedTasks: 3, totalHours: 190, projects: ['IOV-PLATFORM', 'CRM-CUSTOM', 'OPS-OPT'] },
      { userName: '赵六', assignedTasks: 1, totalHours: 60, projects: ['IOV-PLATFORM'] },
      { userName: '钱七', assignedTasks: 0, totalHours: 0, projects: ['APP-DEV'] },
    ])
  }

  const getStatusTag = (status: ProjectStatus) => {
    const config: Record<ProjectStatus, { color: string; text: string }> = {
      PLANNING: { color: 'default', text: '计划中' },
      IN_PROGRESS: { color: 'processing', text: '进行中' },
      ON_HOLD: { color: 'warning', text: '暂停' },
      COMPLETED: { color: 'success', text: '已完成' },
      CANCELLED: { color: 'error', text: '已取消' },
    }
    return <Tag color={config[status].color}>{config[status].text}</Tag>
  }

  const getTaskStatusTag = (status: TaskStatus) => {
    const config: Record<TaskStatus, { color: string; text: string }> = {
      TODO: { color: 'default', text: '待办' },
      IN_PROGRESS: { color: 'processing', text: '进行中' },
      REVIEW: { color: 'warning', text: '审核中' },
      DONE: { color: 'success', text: '已完成' },
      BLOCKED: { color: 'error', text: '阻塞' },
    }
    return <Tag color={config[status].color}>{config[status].text}</Tag>
  }

  const getPriorityTag = (priority: TaskPriority) => {
    const config: Record<TaskPriority, { color: string; text: string }> = {
      LOW: { color: 'default', text: '低' },
      MEDIUM: { color: 'blue', text: '中' },
      HIGH: { color: 'warning', text: '高' },
      CRITICAL: { color: 'error', text: '紧急' },
    }
    return <Tag color={config[priority].color}>{config[priority].text}</Tag>
  }

  const projectColumns: ColumnsType<any> = [
    { title: '项目编码', dataIndex: 'code', width: 120 },
    { title: '项目名称', dataIndex: 'name', width: 200, ellipsis: true },
    { title: '类型', dataIndex: 'type', width: 100, render: (type: string) => <Tag color="blue">{type}</Tag> },
    { title: '负责人', dataIndex: 'ownerName', width: 100 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status: ProjectStatus) => getStatusTag(status) },
    { title: '进度', dataIndex: 'progress', width: 100, render: (progress: number) => <Progress percent={progress} size="small" strokeColor={progress >= 80 ? '#52c41a' : progress >= 50 ? '#1890ff' : '#faad14'} style={{ width: 80 }} /> },
    { title: '预算使用', width: 120, render: (_, record) => {
      const usedPercent = record.budget ? Math.round((record.spentBudget / record.budget) * 100) : 0
      return <Text>{record.spentBudget?.toLocaleString() || 0} / {record.budget?.toLocaleString() || 0}</Text>
    }},
    { title: '开始日期', dataIndex: 'startDate', width: 100 },
    { title: '操作', key: 'action', width: 120, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedProject(record); setDetailModalVisible(true) }}>详情</Button>
        <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
      </Space>
    )},
  ]

  const taskColumns: ColumnsType<any> = [
    { title: '任务名称', dataIndex: 'name', width: 200, ellipsis: true },
    { title: '项目', dataIndex: 'projectName', width: 120 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status: TaskStatus) => getTaskStatusTag(status) },
    { title: '优先级', dataIndex: 'priority', width: 80, render: (priority: TaskPriority) => getPriorityTag(priority) },
    { title: '负责人', dataIndex: 'assigneeName', width: 100, render: (name: string) => name ? <Avatar size="small" style={{ marginRight: 4 }}>{name[0]}</Avatar> : '-' },
    { title: '截止日期', dataIndex: 'dueDate', width: 100 },
    { title: '工时', width: 100, render: (_, record) => `${record.actualHours || 0}/${record.estimatedHours || 0}h` },
    { title: '操作', key: 'action', width: 80, render: () => <Button type="link" size="small">详情</Button> },
  ]

  const handleCreate = async () => {
    try {
      const values = await form.validateFields()
      message.success('创建成功')
      setModalVisible(false)
      fetchProjects()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <ProjectOutlined style={{ marginRight: 8 }} />
            项目管理
          </Title>
          <Text type="secondary">项目创建、进度跟踪、任务管理、资源分配</Text>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalVisible(true) }}>
            新建项目
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">项目总数</Text>}
              value={stats.totalProjects}
              prefix={<ProjectOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">进行中</Text>}
              value={stats.activeProjects}
              prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">已完成</Text>}
              value={stats.completedProjects}
              prefix={<CheckCircleOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">总预算</Text>}
              value={stats.totalBudget}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">已支出</Text>}
              value={stats.spentBudget}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均进度</Text>}
              value={stats.avgProgress}
              suffix="%"
              prefix={<BarChartOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 项目和任务列表 */}
      <Tabs defaultActiveKey="projects">
        <TabPane tab="项目列表" key="projects">
          <Card className="daoda-card">
            <Table
              columns={projectColumns}
              dataSource={projects}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="任务列表" key="tasks">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={4}>
              <Card className="daoda-card stat-card" size="small">
                <Statistic title="待办" value={taskStats.todoTasks} valueStyle={{ fontSize: 16 }} />
              </Card>
            </Col>
            <Col span={4}>
              <Card className="daoda-card stat-card" size="small">
                <Statistic title="进行中" value={taskStats.inProgressTasks} valueStyle={{ fontSize: 16, color: '#1890ff' }} />
              </Card>
            </Col>
            <Col span={4}>
              <Card className="daoda-card stat-card" size="small">
                <Statistic title="已完成" value={taskStats.doneTasks} valueStyle={{ fontSize: 16, color: '#52c41a' }} />
              </Card>
            </Col>
            <Col span={4}>
              <Card className="daoda-card stat-card" size="small">
                <Statistic title="阻塞" value={taskStats.blockedTasks} valueStyle={{ fontSize: 16, color: '#ff4d4f' }} />
              </Card>
            </Col>
          </Row>
          <Card className="daoda-card">
            <Table
              columns={taskColumns}
              dataSource={tasks}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="资源分配" key="resources">
          <Card className="daoda-card">
            <Table
              columns={[
                { title: '人员', dataIndex: 'userName', width: 100, render: (name: string) => <Avatar style={{ marginRight: 8 }}>{name[0]}</Avatar> },
                { title: '分配任务数', dataIndex: 'assignedTasks', width: 100 },
                { title: '预计工时', dataIndex: 'totalHours', width: 100, render: (hours: number) => `${hours}h` },
                { title: '参与项目', dataIndex: 'projects', width: 200, render: (projects: string[]) => projects.map(p => <Tag key={p}>{p}</Tag>) },
              ]}
              dataSource={resourceAllocation}
              rowKey="userName"
              pagination={false}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 新建项目弹窗 */}
      <Modal
        title="新建项目"
        open={modalVisible}
        onOk={handleCreate}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="项目名称" rules={[{ required: true }]}>
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="项目编码" rules={[{ required: true }]}>
                <Input placeholder="请输入项目编码" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="项目类型" rules={[{ required: true }]}>
                <Select placeholder="请选择类型">
                  <Option value="INTERNAL">内部项目</Option>
                  <Option value="CLIENT">客户项目</Option>
                  <Option value="R_D">研发项目</Option>
                  <Option value="MAINTENANCE">维护项目</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级">
                <Select placeholder="请选择优先级">
                  <Option value={TaskPriority.LOW}>低</Option>
                  <Option value={TaskPriority.MEDIUM}>中</Option>
                  <Option value={TaskPriority.HIGH}>高</Option>
                  <Option value={TaskPriority.CRITICAL}>紧急</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="项目描述">
            <Input.TextArea placeholder="请输入项目描述" rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ownerId" label="项目负责人">
                <Select placeholder="请选择负责人">
                  <Option value="U-001">张三</Option>
                  <Option value="U-002">李四</Option>
                  <Option value="U-003">王五</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="budget" label="项目预算">
                <InputNumber placeholder="请输入预算" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="dateRange" label="项目周期">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 项目详情弹窗 */}
      <Modal
        title="项目详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedProject && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="项目编码">{selectedProject.code}</Descriptions.Item>
              <Descriptions.Item label="项目名称">{selectedProject.name}</Descriptions.Item>
              <Descriptions.Item label="项目类型"><Tag color="blue">{selectedProject.type}</Tag></Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(selectedProject.status)}</Descriptions.Item>
              <Descriptions.Item label="负责人">{selectedProject.ownerName}</Descriptions.Item>
              <Descriptions.Item label="进度"><Progress percent={selectedProject.progress} size="small" style={{ width: 100 }} /></Descriptions.Item>
              <Descriptions.Item label="预算">{selectedProject.budget?.toLocaleString() || 0}</Descriptions.Item>
              <Descriptions.Item label="已支出">{selectedProject.spentBudget?.toLocaleString() || 0}</Descriptions.Item>
              <Descriptions.Item label="开始日期">{selectedProject.startDate}</Descriptions.Item>
              <Descriptions.Item label="预计完成">{selectedProject.estimatedEndDate || selectedProject.endDate}</Descriptions.Item>
              <Descriptions.Item label="团队成员">{selectedProject.teamMembers?.join(', ')}</Descriptions.Item>
              {selectedProject.clientName && <Descriptions.Item label="客户">{selectedProject.clientName}</Descriptions.Item>}
            </Descriptions>

            {selectedProject.milestones && selectedProject.milestones.length > 0 && (
              <Card size="small" title="里程碑" style={{ marginBottom: 16 }}>
                <List
                  dataSource={selectedProject.milestones}
                  renderItem={(item: any) => (
                    <List.Item>
                      <Text>{item.name}</Text>
                      <Text type="secondary">{item.dueDate}</Text>
                      <Tag color={item.completed ? 'success' : 'warning'}>{item.completed ? '已完成' : '进行中'}</Tag>
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {selectedProject.risks && selectedProject.risks.length > 0 && (
              <Card size="small" title="风险项">
                <List
                  dataSource={selectedProject.risks}
                  renderItem={(item: any) => (
                    <List.Item>
                      <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
                      <Text>{item.description}</Text>
                      <Tag color={item.probability === 'HIGH' ? 'error' : 'warning'}>{item.probability}</Tag>
                      <Tag color={item.impact === 'HIGH' ? 'error' : 'warning'}>影响:{item.impact}</Tag>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}