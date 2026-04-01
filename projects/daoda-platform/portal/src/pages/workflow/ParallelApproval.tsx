/**
 * 并行审批管理页面
 * 并行审批节点配置、投票机制、结果聚合
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
  Badge,
  Progress,
  Avatar,
  List,
  Tabs,
  Statistic,
  Timeline,
  message,
  Tooltip,
  Switch,
  InputNumber,
} from 'antd'
import {
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
  PercentageOutlined,
  OrderedListOutlined,
  MergeCellsOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { TabPane } = Tabs

// 并行类型枚举
enum ParallelType {
  ALL_REQUIRED = 'ALL_REQUIRED',
  ANY_ONE = 'ANY_ONE',
  MAJORITY = 'MAJORITY',
  PERCENTAGE = 'PERCENTAGE',
  QUORUM = 'QUORUM',
  SEQUENTIAL = 'SEQUENTIAL',
}

// 投票结果枚举
enum VoteResult {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ABSTAINED = 'ABSTAINED',
  PENDING = 'PENDING',
}

// 并行节点状态枚举
enum ParallelNodeStatus {
  INITIALIZING = 'INITIALIZING',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_MERGE = 'WAITING_MERGE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
}

export default function ParallelApproval() {
  const [parallelNodes, setParallelNodes] = useState<any[]>([])
  const [parallelConfigs, setParallelConfigs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedNode, setSelectedNode] = useState<any | null>(null)
  const [stats, setStats] = useState({
    totalNodes: 4,
    inProgressNodes: 2,
    completedNodes: 1,
    avgCompletionTime: 120,
    approvalRate: 80,
  })

  useEffect(() => {
    fetchParallelNodes()
    fetchParallelConfigs()
    fetchStats()
  }, [])

  const fetchParallelNodes = async () => {
    setLoading(true)
    const mockNodes = [
      {
        id: 'PAN-001',
        nodeId: 'N-PARALLEL-001',
        nodeName: '采购审批委员会',
        processInstanceId: 'PI-001',
        parallelType: ParallelType.MAJORITY,
        requiredApprovals: 3,
        status: ParallelNodeStatus.IN_PROGRESS,
        participants: [
          { id: 'PP-001', userName: '李四', department: '财务部', role: '财务经理', status: VoteResult.APPROVED, votedAt: new Date(Date.now() - 60 * 60 * 1000), comments: '同意采购', isMandatory: true },
          { id: 'PP-002', userName: '王五', department: '采购部', role: '采购经理', status: VoteResult.APPROVED, votedAt: new Date(Date.now() - 30 * 60 * 1000), comments: '价格合理' },
          { id: 'PP-003', userName: '赵六', department: '技术部', role: '技术经理', status: VoteResult.PENDING },
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 'PAN-002',
        nodeId: 'N-PARALLEL-002',
        nodeName: '合同评审',
        processInstanceId: 'PI-002',
        parallelType: ParallelType.ALL_REQUIRED,
        requiredApprovals: 3,
        timeoutMinutes: 480,
        status: ParallelNodeStatus.IN_PROGRESS,
        participants: [
          { id: 'PP-004', userName: '周九', department: '法务部', status: VoteResult.APPROVED, votedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), comments: '合同条款合法' },
          { id: 'PP-005', userName: '吴十', department: '财务部', status: VoteResult.PENDING },
          { id: 'PP-006', userName: '郑一', department: '商务部', status: VoteResult.PENDING },
        ],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: 'PAN-003',
        nodeId: 'N-PARALLEL-003',
        nodeName: '紧急事项审批',
        processInstanceId: 'PI-003',
        parallelType: ParallelType.ANY_ONE,
        requiredApprovals: 1,
        timeoutMinutes: 30,
        status: ParallelNodeStatus.COMPLETED,
        participants: [
          { id: 'PP-007', userName: '值班经理A', status: VoteResult.PENDING },
          { id: 'PP-008', userName: '值班经理B', status: VoteResult.APPROVED, votedAt: new Date(Date.now() - 30 * 60 * 1000), comments: '紧急同意' },
        ],
        completedAt: new Date(Date.now() - 30 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        id: 'PAN-004',
        nodeId: 'N-PARALLEL-004',
        nodeName: '预算审批投票',
        processInstanceId: 'PI-004',
        parallelType: ParallelType.PERCENTAGE,
        requiredApprovals: 5,
        approvalThreshold: 60,
        timeoutMinutes: 240,
        status: ParallelNodeStatus.WAITING_MERGE,
        participants: [
          { id: 'PP-009', userName: '张三', status: VoteResult.APPROVED, votedAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
          { id: 'PP-010', userName: '李四', status: VoteResult.APPROVED, votedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
          { id: 'PP-011', userName: '王五', status: VoteResult.REJECTED, votedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), comments: '预算偏高' },
          { id: 'PP-012', userName: '赵六', status: VoteResult.APPROVED, votedAt: new Date(Date.now() - 30 * 60 * 1000) },
          { id: 'PP-013', userName: '钱七', status: VoteResult.ABSTAINED, votedAt: new Date(Date.now() - 15 * 60 * 1000), comments: '不了解详情' },
        ],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ]
    setParallelNodes(mockNodes)
    setLoading(false)
  }

  const fetchParallelConfigs = async () => {
    const mockConfigs = [
      { id: 'PNC-001', name: '采购审批委员会', parallelType: ParallelType.MAJORITY, participantSource: 'ROLE', participantRoles: ['财务经理', '采购经理', '技术经理'], requiredApprovals: 3 },
      { id: 'PNC-002', name: '合同评审', parallelType: ParallelType.ALL_REQUIRED, participantSource: 'DEPARTMENT', participantDepartments: ['法务部', '财务部', '商务部'], requiredApprovals: 3 },
      { id: 'PNC-003', name: '紧急事项审批', parallelType: ParallelType.ANY_ONE, participantSource: 'ROLE', participantRoles: ['值班经理', '主管', '总监'], requiredApprovals: 1 },
      { id: 'PNC-004', name: '预算审批', parallelType: ParallelType.PERCENTAGE, participantSource: 'MANUAL', requiredApprovals: 5, approvalThreshold: 60 },
      { id: 'PNC-005', name: '重要决策投票', parallelType: ParallelType.QUORUM, participantSource: 'DYNAMIC', requiredApprovals: 7 },
    ]
    setParallelConfigs(mockConfigs)
  }

  const fetchStats = async () => {
    setStats({
      totalNodes: 4,
      inProgressNodes: 2,
      completedNodes: 1,
      avgCompletionTime: 120,
      approvalRate: 80,
    })
  }

  const getParallelTypeTag = (type: ParallelType) => {
    const config: Record<ParallelType, { color: string; icon: any; text: string }> = {
      ALL_REQUIRED: { color: 'red', icon: <TeamOutlined />, text: '全部必须' },
      ANY_ONE: { color: 'green', icon: <UserOutlined />, text: '任一审批' },
      MAJORITY: { color: 'blue', icon: <PercentageOutlined />, text: '多数通过' },
      PERCENTAGE: { color: 'purple', icon: <PercentageOutlined />, text: '百分比通过' },
      QUORUM: { color: 'orange', icon: <OrderedListOutlined />, text: '定额通过' },
      SEQUENTIAL: { color: 'cyan', icon: <OrderedListOutlined />, text: '顺序审批' },
    }
    const c = config[type]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getVoteResultTag = (result: VoteResult) => {
    const config: Record<VoteResult, { color: string; icon: any; text: string }> = {
      APPROVED: { color: 'success', icon: <CheckCircleOutlined />, text: '同意' },
      REJECTED: { color: 'error', icon: <CloseCircleOutlined />, text: '拒绝' },
      ABSTAINED: { color: 'warning', icon: <StopOutlined />, text: '弃权' },
      PENDING: { color: 'default', icon: <ClockCircleOutlined />, text: '待投票' },
    }
    const c = config[result]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getStatusTag = (status: ParallelNodeStatus) => {
    const config: Record<ParallelNodeStatus, { color: string; text: string }> = {
      INITIALIZING: { color: 'default', text: '初始化' },
      IN_PROGRESS: { color: 'processing', text: '进行中' },
      WAITING_MERGE: { color: 'warning', text: '待合并' },
      COMPLETED: { color: 'success', text: '已完成' },
      FAILED: { color: 'error', text: '已失败' },
      TIMEOUT: { color: 'error', text: '已超时' },
    }
    return <Tag color={config[status].color}>{config[status].text}</Tag>
  }

  const getParticipantSourceTag = (source: string) => {
    const config: Record<string, { color: string; text: string }> = {
      MANUAL: { color: 'blue', text: '手动指定' },
      ROLE: { color: 'purple', text: '按角色' },
      DEPARTMENT: { color: 'green', text: '按部门' },
      DYNAMIC: { color: 'orange', text: '动态计算' },
    }
    return <Tag color={config[source]?.color || 'default'}>{config[source]?.text || source}</Tag>
  }

  const calculateProgress = (node: any) => {
    const approved = node.participants.filter((p: any) => p.status === VoteResult.APPROVED).length
    const total = node.participants.length
    return Math.round((approved / total) * 100)
  }

  const nodeColumns: ColumnsType<any> = [
    { title: '节点ID', dataIndex: 'nodeId', width: 120 },
    { title: '节点名称', dataIndex: 'nodeName', width: 150 },
    { title: '流程实例', dataIndex: 'processInstanceId', width: 100 },
    { title: '并行类型', dataIndex: 'parallelType', width: 100, render: (type: ParallelType) => getParallelTypeTag(type) },
    { title: '状态', dataIndex: 'status', width: 80, render: (status: ParallelNodeStatus) => getStatusTag(status) },
    { title: '参与人数', width: 100, render: (_, record) => {
      const approved = record.participants.filter((p: any) => p.status === VoteResult.APPROVED).length
      return <Text>{approved}/{record.participants.length}</Text>
    }},
    { title: '进度', width: 100, render: (_, record) => <Progress percent={calculateProgress(record)} size="small" style={{ width: 80 }} /> },
    { title: '创建时间', dataIndex: 'createdAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '操作', key: 'action', width: 80, render: (_, record) => (
      <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedNode(record); setDetailModalVisible(true) }}>详情</Button>
    )},
  ]

  const configColumns: ColumnsType<any> = [
    { title: '配置ID', dataIndex: 'id', width: 100 },
    { title: '配置名称', dataIndex: 'name', width: 150 },
    { title: '并行类型', dataIndex: 'parallelType', width: 100, render: (type: ParallelType) => getParallelTypeTag(type) },
    { title: '参与来源', dataIndex: 'participantSource', width: 100, render: (source: string) => getParticipantSourceTag(source) },
    { title: '要求人数', dataIndex: 'requiredApprovals', width: 80 },
    { title: '阈值', width: 80, render: (_, record) => record.approvalThreshold ? `${record.approvalThreshold}%` : '-' },
    { title: '操作', key: 'action', width: 80, render: () => <Button type="link" size="small" icon={<SettingOutlined />}>配置</Button> },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <TeamOutlined style={{ marginRight: 8 }} />
            并行审批管理
          </Title>
          <Text type="secondary">并行审批节点配置、投票机制、结果聚合</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<SettingOutlined />} style={{ marginRight: 8 }}>节点配置</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">并行节点总数</Text>}
              value={stats.totalNodes}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">进行中节点</Text>}
              value={stats.inProgressNodes}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">已完成节点</Text>}
              value={stats.completedNodes}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均完成时间</Text>}
              value={stats.avgCompletionTime}
              suffix="分钟"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">通过率</Text>}
              value={stats.approvalRate}
              suffix="%"
              prefix={<PercentageOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">超时节点</Text>}
              value={0}
              prefix={<ThunderboltOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 并行节点和配置 */}
      <Tabs defaultActiveKey="nodes">
        <TabPane tab="并行审批节点" key="nodes">
          <Card className="daoda-card">
            <Table
              columns={nodeColumns}
              dataSource={parallelNodes}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="节点配置" key="configs">
          <Card className="daoda-card">
            <Table
              columns={configColumns}
              dataSource={parallelConfigs}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>
        <TabPane tab="投票统计" key="stats">
          <Row gutter={16}>
            <Col span={6}>
              <Card className="daoda-card" size="small">
                <Statistic title="全部必须类型" value={1} />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="daoda-card" size="small">
                <Statistic title="任一审批类型" value={1} />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="daoda-card" size="small">
                <Statistic title="多数通过类型" value={1} />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="daoda-card" size="small">
                <Statistic title="百分比类型" value={1} />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 并行节点详情弹窗 */}
      <Modal
        title="并行审批节点详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedNode && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="节点ID">{selectedNode.nodeId}</Descriptions.Item>
              <Descriptions.Item label="节点名称">{selectedNode.nodeName}</Descriptions.Item>
              <Descriptions.Item label="流程实例">{selectedNode.processInstanceId}</Descriptions.Item>
              <Descriptions.Item label="并行类型">{getParallelTypeTag(selectedNode.parallelType)}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(selectedNode.status)}</Descriptions.Item>
              <Descriptions.Item label="要求人数">{selectedNode.requiredApprovals}</Descriptions.Item>
              {selectedNode.approvalThreshold && <Descriptions.Item label="通过阈值">{selectedNode.approvalThreshold}%</Descriptions.Item>}
              {selectedNode.timeoutMinutes && <Descriptions.Item label="超时时间">{selectedNode.timeoutMinutes}分钟</Descriptions.Item>}
            </Descriptions>

            <Title level={5}>参与者投票状态</Title>
            <List
              dataSource={selectedNode.participants}
              renderItem={(participant: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar>{participant.userName[0]}</Avatar>}
                    title={<Text>{participant.userName} {participant.department && <Tag color="blue">{participant.department}</Tag>}</Text>}
                    description={participant.role && <Text type="secondary">{participant.role}</Text>}
                  />
                  <Space>
                    {getVoteResultTag(participant.status)}
                    {participant.votedAt && <Text type="secondary">{dayjs(participant.votedAt).format('HH:mm')}</Text>}
                    {participant.comments && <Tooltip title={participant.comments}><Text ellipsis style={{ maxWidth: 100 }}>{participant.comments}</Text></Tooltip>}
                  </Space>
                </List.Item>
              )}
            />

            {/* 聚合结果 */}
            <Title level={5} style={{ marginTop: 16 }}>聚合结果</Title>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic title="同意" value={selectedNode.participants.filter((p: any) => p.status === VoteResult.APPROVED).length} valueStyle={{ color: '#52c41a' }} />
              </Col>
              <Col span={6}>
                <Statistic title="拒绝" value={selectedNode.participants.filter((p: any) => p.status === VoteResult.REJECTED).length} valueStyle={{ color: '#ff4d4f' }} />
              </Col>
              <Col span={6}>
                <Statistic title="弃权" value={selectedNode.participants.filter((p: any) => p.status === VoteResult.ABSTAINED).length} valueStyle={{ color: '#faad14' }} />
              </Col>
              <Col span={6}>
                <Statistic title="待投票" value={selectedNode.participants.filter((p: any) => p.status === VoteResult.PENDING).length} valueStyle={{ color: '#1890ff' }} />
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  )
}