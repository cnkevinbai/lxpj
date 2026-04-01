/**
 * 流程监控页面
 * 流程执行监控、性能分析、瓶颈识别
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
  Progress,
  Tabs,
  Alert,
  Badge,
  Tooltip,
  Timeline,
  List,
} from 'antd'
import {
  DashboardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LineChartOutlined,
  BarChartOutlined,
  WarningOutlined,
  ReloadOutlined,
  BellOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { TabPane } = Tabs

// 流程状态
enum ProcessStatus {
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  TIMEOUT = 'TIMEOUT',
}

// 节点状态
enum NodeStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

export default function ProcessMonitoring() {
  const [processInstances, setProcessInstances] = useState<any[]>([])
  const [processMetrics, setProcessMetrics] = useState<any[]>([])
  const [processAlerts, setProcessAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedInstance, setSelectedInstance] = useState<any | null>(null)
  const [stats, setStats] = useState({
    runningInstances: 2,
    completedToday: 1,
    failedToday: 2,
    avgDurationToday: 4 * 60 * 60 * 1000,
    pendingAlerts: 3,
    criticalAlerts: 0,
  })
  const [bottlenecks, setBottlenecks] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])

  useEffect(() => {
    fetchProcessInstances()
    fetchProcessMetrics()
    fetchProcessAlerts()
    fetchStats()
    fetchBottleneckAnalysis()
  }, [])

  const fetchProcessInstances = async () => {
    setLoading(true)
    const mockData = [
      {
        id: 'PI-001',
        definitionId: 'WF-001',
        definitionName: '采购审批流程',
        status: ProcessStatus.RUNNING,
        initiatorId: 'U-001',
        initiatorName: '张三',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        currentNode: '部门经理审批',
        progress: 60,
        nodes: [
          { id: 'NI-001', nodeName: '开始', status: NodeStatus.COMPLETED, duration: 0 },
          { id: 'NI-002', nodeName: '提交申请', status: NodeStatus.COMPLETED, duration: 5000 },
          { id: 'NI-003', nodeName: '部门经理审批', status: NodeStatus.RUNNING, assigneeName: '李四', startTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000) },
          { id: 'NI-004', nodeName: '财务审批', status: NodeStatus.PENDING, assigneeName: '王五' },
          { id: 'NI-005', nodeName: '总经理审批', status: NodeStatus.PENDING },
        ],
      },
      {
        id: 'PI-002',
        definitionId: 'WF-002',
        definitionName: '请假审批流程',
        status: ProcessStatus.COMPLETED,
        initiatorId: 'U-004',
        initiatorName: '赵六',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 20 * 60 * 60 * 1000),
        duration: 4 * 60 * 60 * 1000,
        progress: 100,
        nodes: [
          { id: 'NI-007', nodeName: '开始', status: NodeStatus.COMPLETED, duration: 0 },
          { id: 'NI-008', nodeName: '提交申请', status: NodeStatus.COMPLETED, duration: 3000 },
          { id: 'NI-009', nodeName: '部门主管审批', status: NodeStatus.COMPLETED, assigneeName: '李四', duration: 2 * 60 * 60 * 1000, result: 'approved' },
          { id: 'NI-010', nodeName: '人事备案', status: NodeStatus.COMPLETED, duration: 60000 },
          { id: 'NI-011', nodeName: '结束', status: NodeStatus.COMPLETED, duration: 0 },
        ],
      },
      {
        id: 'PI-003',
        definitionId: 'WF-001',
        definitionName: '采购审批流程',
        status: ProcessStatus.FAILED,
        initiatorId: 'U-005',
        initiatorName: '钱七',
        startTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 44 * 60 * 60 * 1000),
        duration: 4 * 60 * 60 * 1000,
        progress: 40,
        nodes: [
          { id: 'NI-012', nodeName: '开始', status: NodeStatus.COMPLETED, duration: 0 },
          { id: 'NI-013', nodeName: '提交申请', status: NodeStatus.COMPLETED, duration: 5000 },
          { id: 'NI-014', nodeName: '部门经理审批', status: NodeStatus.FAILED, assigneeName: '李四', duration: 4 * 60 * 60 * 1000, result: 'rejected', comments: '预算不足' },
        ],
      },
      {
        id: 'PI-004',
        definitionId: 'WF-003',
        definitionName: '合同审批流程',
        status: ProcessStatus.RUNNING,
        initiatorId: 'U-006',
        initiatorName: '孙八',
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        currentNode: '法务审核',
        progress: 30,
        nodes: [
          { id: 'NI-016', nodeName: '开始', status: NodeStatus.COMPLETED, duration: 0 },
          { id: 'NI-017', nodeName: '提交合同', status: NodeStatus.COMPLETED, duration: 2000 },
          { id: 'NI-018', nodeName: '法务审核', status: NodeStatus.RUNNING, assigneeName: '周九', startTime: new Date(Date.now() - 25 * 60 * 1000) },
          { id: 'NI-019', nodeName: '商务审批', status: NodeStatus.PENDING },
        ],
      },
      {
        id: 'PI-005',
        definitionId: 'WF-004',
        definitionName: '报销审批流程',
        status: ProcessStatus.TIMEOUT,
        initiatorId: 'U-008',
        initiatorName: '吴十',
        startTime: new Date(Date.now() - 72 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
        duration: 24 * 60 * 60 * 1000,
        progress: 50,
        nodes: [
          { id: 'NI-023', nodeName: '开始', status: NodeStatus.COMPLETED, duration: 0 },
          { id: 'NI-024', nodeName: '提交报销', status: NodeStatus.COMPLETED, duration: 3000 },
          { id: 'NI-025', nodeName: '财务审核', status: NodeStatus.FAILED, assigneeName: '王五', duration: 24 * 60 * 60 * 1000, retryCount: 3 },
        ],
      },
    ]
    setProcessInstances(mockData)
    setLoading(false)
  }

  const fetchProcessMetrics = async () => {
    const mockMetrics = [
      { definitionId: 'WF-001', definitionName: '采购审批流程', totalInstances: 50, completedInstances: 35, avgDuration: 6 * 60 * 60 * 1000, successRate: 70, bottleneckNodes: ['财务审批'] },
      { definitionId: 'WF-002', definitionName: '请假审批流程', totalInstances: 100, completedInstances: 95, avgDuration: 2 * 60 * 60 * 1000, successRate: 95, bottleneckNodes: [] },
      { definitionId: 'WF-003', definitionName: '合同审批流程', totalInstances: 30, completedInstances: 20, avgDuration: 48 * 60 * 60 * 1000, successRate: 66.7, bottleneckNodes: ['法务审核'] },
      { definitionId: 'WF-004', definitionName: '报销审批流程', totalInstances: 200, completedInstances: 180, avgDuration: 4 * 60 * 60 * 1000, successRate: 90, bottleneckNodes: ['财务审核'] },
    ]
    setProcessMetrics(mockMetrics)
  }

  const fetchProcessAlerts = async () => {
    const mockAlerts = [
      { id: 'AL-001', type: 'TIMEOUT', processId: 'PI-005', definitionName: '报销审批流程', message: '报销审批超时', severity: 'HIGH', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), resolved: false },
      { id: 'AL-002', type: 'BOTTLENECK', definitionId: 'WF-001', definitionName: '采购审批流程', message: '财务审批节点平均耗时过长', severity: 'MEDIUM', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), resolved: false },
      { id: 'AL-003', type: 'STUCK', processId: 'PI-001', definitionName: '采购审批流程', message: '部门经理审批节点停留超过2小时', severity: 'LOW', createdAt: new Date(Date.now() - 30 * 60 * 1000), resolved: false },
    ]
    setProcessAlerts(mockAlerts)
  }

  const fetchStats = async () => {
    setStats({
      runningInstances: 2,
      completedToday: 1,
      failedToday: 2,
      avgDurationToday: 4 * 60 * 60 * 1000,
      pendingAlerts: 3,
      criticalAlerts: 0,
    })
  }

  const fetchBottleneckAnalysis = async () => {
    setBottlenecks([
      { nodeName: '财务审批', definitionName: '采购审批流程', avgDuration: 3 * 60 * 60 * 1000, impactScore: 50 },
      { nodeName: '法务审核', definitionName: '合同审批流程', avgDuration: 24 * 60 * 60 * 1000, impactScore: 50 },
    ])
    setRecommendations([
      '财务审批节点平均耗时较长，建议增加并行审批或自动化初审',
      '法务审核节点建议设置自动提醒和超时升级机制',
      '部门经理审批节点建议使用移动端审批提升效率',
    ])
  }

  const getStatusTag = (status: ProcessStatus) => {
    const config: Record<ProcessStatus, { color: string; icon: any; text: string }> = {
      RUNNING: { color: 'processing', icon: <ClockCircleOutlined />, text: '运行中' },
      COMPLETED: { color: 'success', icon: <CheckCircleOutlined />, text: '已完成' },
      FAILED: { color: 'error', icon: <CloseCircleOutlined />, text: '已失败' },
      CANCELLED: { color: 'default', icon: <CloseCircleOutlined />, text: '已取消' },
      TIMEOUT: { color: 'warning', icon: <ExclamationCircleOutlined />, text: '超时' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getNodeStatusTag = (status: NodeStatus) => {
    const config: Record<NodeStatus, { color: string; text: string }> = {
      PENDING: { color: 'default', text: '待处理' },
      RUNNING: { color: 'processing', text: '处理中' },
      COMPLETED: { color: 'success', text: '已完成' },
      FAILED: { color: 'error', text: '已失败' },
      SKIPPED: { color: 'warning', text: '已跳过' },
    }
    const c = config[status]
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const getSeverityTag = (severity: string) => {
    const config: Record<string, { color: string }> = {
      CRITICAL: { color: '#ff4d4f' },
      HIGH: { color: '#faad14' },
      MEDIUM: { color: '#1890ff' },
      LOW: { color: '#52c41a' },
    }
    return <Badge color={config[severity]?.color || '#1890ff'} text={severity} />
  }

  const formatDuration = (ms: number) => {
    if (!ms) return '-'
    const hours = Math.floor(ms / (60 * 60 * 1000))
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
    if (hours > 0) return `${hours}小时${minutes}分钟`
    return `${minutes}分钟`
  }

  const instanceColumns: ColumnsType<any> = [
    { title: '流程ID', dataIndex: 'id', width: 100 },
    { title: '流程名称', dataIndex: 'definitionName', width: 150 },
    { title: '发起人', dataIndex: 'initiatorName', width: 100 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status: ProcessStatus) => getStatusTag(status) },
    { title: '进度', dataIndex: 'progress', width: 100, render: (progress: number) => <Progress percent={progress} size="small" style={{ width: 80 }} /> },
    { title: '当前节点', dataIndex: 'currentNode', width: 120, render: (node: string) => node || '-' },
    { title: '开始时间', dataIndex: 'startTime', width: 120, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '耗时', dataIndex: 'duration', width: 100, render: (ms: number) => formatDuration(ms) },
    { title: '操作', key: 'action', width: 80, render: (_, record) => <Button type="link" size="small" onClick={() => { setSelectedInstance(record); setDetailModalVisible(true) }}>详情</Button> },
  ]

  const metricsColumns: ColumnsType<any> = [
    { title: '流程名称', dataIndex: 'definitionName', width: 150 },
    { title: '总实例数', dataIndex: 'totalInstances', width: 100 },
    { title: '完成数', dataIndex: 'completedInstances', width: 100 },
    { title: '成功率', dataIndex: 'successRate', width: 100, render: (rate: number) => <Progress percent={rate} size="small" strokeColor={rate >= 90 ? '#52c41a' : '#faad14'} style={{ width: 80 }} /> },
    { title: '平均耗时', dataIndex: 'avgDuration', width: 100, render: (ms: number) => formatDuration(ms) },
    { title: '瓶颈节点', dataIndex: 'bottleneckNodes', width: 150, render: (nodes: string[]) => nodes.length > 0 ? <Tag color="warning">{nodes.join(', ')}</Tag> : <Tag color="success">无</Tag> },
  ]

  const alertColumns: ColumnsType<any> = [
    { title: '告警ID', dataIndex: 'id', width: 100 },
    { title: '类型', dataIndex: 'type', width: 100, render: (type: string) => <Tag color={type === 'TIMEOUT' ? 'warning' : type === 'BOTTLENECK' ? 'blue' : 'default'}>{type}</Tag> },
    { title: '流程', dataIndex: 'definitionName', width: 150 },
    { title: '描述', dataIndex: 'message', width: 200, ellipsis: true },
    { title: '严重级别', dataIndex: 'severity', width: 100, render: (severity: string) => getSeverityTag(severity) },
    { title: '创建时间', dataIndex: 'createdAt', width: 120, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '状态', dataIndex: 'resolved', width: 80, render: (resolved: boolean) => resolved ? <Tag color="success">已解决</Tag> : <Tag color="warning">待处理</Tag> },
    { title: '操作', key: 'action', width: 80, render: (_, record) => !record.resolved && <Button type="link" size="small" danger>解决</Button> },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <DashboardOutlined style={{ marginRight: 8 }} />
            流程监控
          </Title>
          <Text type="secondary">流程执行监控、性能分析、瓶颈识别</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<ReloadOutlined />} onClick={fetchProcessInstances}>刷新</Button>
        </div>
      </div>

      {/* 警告提示 */}
      {stats.pendingAlerts > 0 && (
        <Alert
          message={`当前有 ${stats.pendingAlerts} 个待处理告警`}
          type="warning"
          showIcon
          icon={<BellOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">运行中实例</Text>}
              value={stats.runningInstances}
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">今日完成</Text>}
              value={stats.completedToday}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">今日失败</Text>}
              value={stats.failedToday}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均耗时</Text>}
              value={formatDuration(stats.avgDurationToday)}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">待处理告警</Text>}
              value={stats.pendingAlerts}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">严重告警</Text>}
              value={stats.criticalAlerts}
              prefix={<ThunderboltOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 流程实例和性能分析 */}
      <Tabs defaultActiveKey="instances">
        <TabPane tab="流程实例" key="instances">
          <Card className="daoda-card">
            <Table
              columns={instanceColumns}
              dataSource={processInstances}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="性能分析" key="metrics">
          <Card className="daoda-card">
            <Table
              columns={metricsColumns}
              dataSource={processMetrics}
              rowKey="definitionId"
              pagination={false}
            />
          </Card>
        </TabPane>
        <TabPane tab="告警管理" key="alerts">
          <Card className="daoda-card">
            <Table
              columns={alertColumns}
              dataSource={processAlerts}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="瓶颈分析" key="bottlenecks">
          <Row gutter={16}>
            <Col span={12}>
              <Card className="daoda-card" title="瓶颈节点">
                <List
                  dataSource={bottlenecks}
                  renderItem={(item: any) => (
                    <List.Item>
                      <List.Item.Meta
                        title={<Text>{item.nodeName} - {item.definitionName}</Text>}
                        description={<Progress percent={item.impactScore} size="small" strokeColor="#faad14" format={() => `影响评分: ${item.impactScore}`} style={{ width: 120 }} />}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="daoda-card" title="优化建议">
                <List
                  dataSource={recommendations}
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

      {/* 流程详情弹窗 */}
      <Modal
        title="流程实例详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedInstance && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="流程ID">{selectedInstance.id}</Descriptions.Item>
              <Descriptions.Item label="流程名称">{selectedInstance.definitionName}</Descriptions.Item>
              <Descriptions.Item label="发起人">{selectedInstance.initiatorName}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(selectedInstance.status)}</Descriptions.Item>
              <Descriptions.Item label="开始时间">{dayjs(selectedInstance.startTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
              <Descriptions.Item label="进度"><Progress percent={selectedInstance.progress} size="small" style={{ width: 100 }} /></Descriptions.Item>
            </Descriptions>

            <Title level={5}>节点执行详情</Title>
            <Timeline
              items={selectedInstance.nodes.map((node: any) => ({
                color: node.status === NodeStatus.COMPLETED ? 'green' : node.status === NodeStatus.RUNNING ? 'blue' : node.status === NodeStatus.FAILED ? 'red' : 'gray',
                children: (
                  <div>
                    <Text strong>{node.nodeName}</Text>
                    <br />
                    {getNodeStatusTag(node.status)}
                    {node.assigneeName && <Text type="secondary"> - {node.assigneeName}</Text>}
                    {node.duration && <Text type="secondary"> ({formatDuration(node.duration)})</Text>}
                    {node.comments && <Text type="secondary"> - {node.comments}</Text>}
                  </div>
                ),
              }))}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}