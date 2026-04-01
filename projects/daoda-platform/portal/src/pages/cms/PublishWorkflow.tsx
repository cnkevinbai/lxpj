/**
 * 发布工作流管理页面
 * 内容发布审批、定时发布、发布队列管理
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
  Tabs,
  Statistic,
  message,
  Tooltip,
  Select,
  Popconfirm,
  Timeline,
  Progress,
} from 'antd'
import {
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  EyeOutlined,
  SettingOutlined,
  OrderedListOutlined,
  SyncOutlined,
  RocketOutlined,
  DownOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs

// 发布状态枚举
enum PublishStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  PUBLISHING = 'PUBLISHING',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  UNPUBLISHED = 'UNPUBLISHED',
}

// 审核状态枚举
enum ReviewStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NEEDS_REVISION = 'NEEDS_REVISION',
}

// 发布类型枚举
enum PublishType {
  IMMEDIATE = 'IMMEDIATE',
  SCHEDULED = 'SCHEDULED',
  BATCH = 'BATCH',
  UPDATE = 'UPDATE',
  UNPUBLISH = 'UNPUBLISH',
}

export default function PublishWorkflow() {
  const [publishTasks, setPublishTasks] = useState<any[]>([])
  const [publishQueues, setPublishQueues] = useState<any[]>([])
  const [reviewRules, setReviewRules] = useState<any[]>([])
  const [publishHistory, setPublishHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any | null>(null)
  const [stats, setStats] = useState({
    totalTasks: 10,
    pendingTasks: 2,
    scheduledTasks: 1,
    publishedTasks: 4,
    failedTasks: 1,
    avgPublishTime: 12,
    approvalRate: 90,
  })

  useEffect(() => {
    fetchPublishTasks()
    fetchPublishQueues()
    fetchReviewRules()
    fetchPublishHistory()
    fetchStats()
  }, [])

  const fetchPublishTasks = async () => {
    setLoading(true)
    const mockTasks = [
      { id: 'PT-001', contentId: 'CE-001', contentTitle: '公司简介', contentType: 'PAGE', versionNumber: 'v2.0', siteId: 'SITE-001', siteName: '主站', publishType: PublishType.UPDATE, status: PublishStatus.PUBLISHED, reviewStatus: ReviewStatus.APPROVED, authorName: '张三', publishedAt: new Date('2026-03-01'), createdAt: new Date('2026-02-28') },
      { id: 'PT-002', contentId: 'CE-002', contentTitle: '产品发布新闻', contentType: 'NEWS', versionNumber: 'v2.0', siteId: 'SITE-001', siteName: '主站', publishType: PublishType.IMMEDIATE, status: PublishStatus.PUBLISHED, reviewStatus: ReviewStatus.APPROVED, reviewerName: '李审核', reviewedAt: new Date('2026-03-01'), authorName: '李四', publishedAt: new Date('2026-03-01'), createdAt: new Date('2026-03-01') },
      { id: 'PT-003', contentId: 'CE-003', contentTitle: 'IOV平台介绍', contentType: 'PRODUCT', versionNumber: 'v2.0-beta', siteId: 'SITE-001', siteName: '主站', publishType: PublishType.IMMEDIATE, status: PublishStatus.PENDING, reviewStatus: ReviewStatus.IN_REVIEW, reviewerName: '王审核', authorName: '王五', createdAt: new Date('2026-03-15') },
      { id: 'PT-004', contentId: 'CE-004', contentTitle: '客户案例', contentType: 'CASE', versionNumber: 'v2.0', siteId: 'SITE-001', siteName: '主站', publishType: PublishType.IMMEDIATE, status: PublishStatus.PENDING, reviewStatus: ReviewStatus.APPROVED, authorName: '赵六', createdAt: new Date('2026-03-20') },
      { id: 'PT-005', contentId: 'CE-005', contentTitle: '技术白皮书', contentType: 'ARTICLE', versionNumber: 'v1.0-draft', siteId: 'SITE-001', siteName: '主站', publishType: PublishType.IMMEDIATE, status: PublishStatus.PENDING, reviewStatus: ReviewStatus.PENDING, authorName: '钱七', createdAt: new Date('2026-03-15') },
      { id: 'PT-006', contentId: 'CE-006', contentTitle: '首页Banner', contentType: 'BANNER', versionNumber: 'v2.0', siteId: 'SITE-001', siteName: '主站', publishType: PublishType.SCHEDULED, status: PublishStatus.SCHEDULED, scheduledAt: new Date('2026-04-01'), reviewStatus: ReviewStatus.APPROVED, reviewerName: '周审核', reviewedAt: new Date('2026-03-20'), authorName: '周八', createdAt: new Date('2026-03-20') },
      { id: 'PT-007', contentId: 'CE-003', contentTitle: 'IOV平台介绍(英文)', contentType: 'PRODUCT', versionNumber: 'v2.0-en', siteId: 'SITE-002', siteName: '英文站', publishType: PublishType.IMMEDIATE, status: PublishStatus.PENDING, reviewStatus: ReviewStatus.PENDING, authorName: '王五', createdAt: new Date('2026-03-18') },
      { id: 'PT-008', contentId: 'CE-007', contentTitle: '产品演示视频', contentType: 'VIDEO', versionNumber: 'v2.0', siteId: 'SITE-001', siteName: '主站', publishType: PublishType.UNPUBLISH, status: PublishStatus.UNPUBLISHED, reviewStatus: ReviewStatus.APPROVED, unpublishedAt: new Date('2026-03-01'), createdAt: new Date('2026-02-28') },
      { id: 'PT-009', contentId: 'CE-001', contentTitle: '公司简介(更新)', contentType: 'PAGE', versionNumber: 'v3.0', siteId: 'SITE-001', siteName: '主站', publishType: PublishType.IMMEDIATE, status: PublishStatus.FAILED, reviewStatus: ReviewStatus.APPROVED, error: '服务器超时', retryCount: 3, authorName: '张三', createdAt: new Date('2026-03-25') },
      { id: 'PT-010', contentId: 'CE-002', contentTitle: '产品发布新闻(下线)', contentType: 'NEWS', versionNumber: 'v1.0', siteId: 'SITE-001', siteName: '主站', publishType: PublishType.UNPUBLISH, status: PublishStatus.CANCELLED, reviewStatus: ReviewStatus.APPROVED, createdAt: new Date('2026-03-20') },
    ]
    setPublishTasks(mockTasks)
    setLoading(false)
  }

  const fetchPublishQueues = async () => {
    const mockQueues = [
      { id: 'PQ-001', name: '主站发布队列', siteId: 'SITE-001', totalTasks: 45, pendingTasks: 3, scheduledTasks: 2, completedTasks: 38, failedTasks: 2, avgProcessingTime: 12 },
      { id: 'PQ-002', name: '英文站发布队列', siteId: 'SITE-002', totalTasks: 30, pendingTasks: 2, scheduledTasks: 1, completedTasks: 25, failedTasks: 2, avgProcessingTime: 15 },
      { id: 'PQ-003', name: '产品站发布队列', siteId: 'SITE-003', totalTasks: 20, pendingTasks: 1, scheduledTasks: 0, completedTasks: 19, failedTasks: 0, avgProcessingTime: 10 },
      { id: 'PQ-004', name: '全局紧急发布队列', totalTasks: 10, pendingTasks: 0, scheduledTasks: 0, completedTasks: 10, failedTasks: 0, avgProcessingTime: 5 },
    ]
    setPublishQueues(mockQueues)
  }

  const fetchReviewRules = async () => {
    const mockRules = [
      { id: 'RR-001', name: '新闻审核规则', contentType: 'NEWS', siteId: 'SITE-001', requireReview: true, reviewers: ['U-001', 'U-002'], reviewLevels: 1, enabled: true },
      { id: 'RR-002', name: '产品审核规则', contentType: 'PRODUCT', siteId: 'SITE-001', requireReview: true, reviewers: ['U-003'], reviewLevels: 2, enabled: true },
      { id: 'RR-003', name: '案例免审规则', contentType: 'CASE', siteId: 'SITE-001', requireReview: false, enabled: true },
      { id: 'RR-004', name: 'Banner审核规则', contentType: 'BANNER', requireReview: true, reviewers: ['U-005', 'U-006'], reviewLevels: 1, enabled: true },
      { id: 'RR-005', name: '英文站审核规则', siteId: 'SITE-002', requireReview: true, reviewers: ['U-007'], reviewLevels: 1, enabled: true },
    ]
    setReviewRules(mockRules)
  }

  const fetchPublishHistory = async () => {
    const mockHistory = [
      { id: 'PH-001', taskId: 'PT-001', contentTitle: '公司简介', action: 'PUBLISH', newStatus: 'PUBLISHED', performerName: '张三', performedAt: new Date('2026-03-01'), notes: '首次发布' },
      { id: 'PH-002', taskId: 'PT-002', contentTitle: '产品发布新闻', action: 'PUBLISH', newStatus: 'PUBLISHED', performerName: '李审核', performedAt: new Date('2026-03-01') },
      { id: 'PH-003', taskId: 'PT-006', contentTitle: '首页Banner', action: 'SCHEDULE', newStatus: 'SCHEDULED', performerName: '周八', performedAt: new Date('2026-03-20'), notes: '定时发布：2026-04-01' },
      { id: 'PH-004', taskId: 'PT-008', contentTitle: '产品演示视频', action: 'UNPUBLISH', newStatus: 'UNPUBLISHED', performerName: '吴九', performedAt: new Date('2026-03-01'), notes: '内容过期下线' },
      { id: 'PH-005', taskId: 'PT-009', contentTitle: '公司简介(更新)', action: 'PUBLISH', newStatus: 'FAILED', performerName: '系统', performedAt: new Date('2026-03-25'), notes: '服务器超时' },
    ]
    setPublishHistory(mockHistory)
  }

  const fetchStats = async () => {
    setStats({ totalTasks: 10, pendingTasks: 2, scheduledTasks: 1, publishedTasks: 4, failedTasks: 1, avgPublishTime: 12, approvalRate: 90 })
  }

  const getStatusTag = (status: PublishStatus) => {
    const config: Record<PublishStatus, { color: string; icon: any; text: string }> = {
      PENDING: { color: 'default', icon: <ClockCircleOutlined />, text: '待发布' },
      APPROVED: { color: 'success', icon: <CheckCircleOutlined />, text: '已审核' },
      SCHEDULED: { color: 'warning', icon: <CalendarOutlined />, text: '定时发布' },
      PUBLISHING: { color: 'processing', icon: <SyncOutlined spin />, text: '发布中' },
      PUBLISHED: { color: 'success', icon: <CheckCircleOutlined />, text: '已发布' },
      FAILED: { color: 'error', icon: <ExclamationCircleOutlined />, text: '发布失败' },
      CANCELLED: { color: 'default', icon: <StopOutlined />, text: '已取消' },
      UNPUBLISHED: { color: 'default', icon: <DownOutlined />, text: '已下线' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getReviewStatusTag = (status: ReviewStatus) => {
    const config: Record<ReviewStatus, { color: string; icon: any; text: string }> = {
      PENDING: { color: 'default', icon: <ClockCircleOutlined />, text: '待审核' },
      IN_REVIEW: { color: 'processing', icon: <EyeOutlined />, text: '审核中' },
      APPROVED: { color: 'success', icon: <CheckCircleOutlined />, text: '通过' },
      REJECTED: { color: 'error', icon: <CloseCircleOutlined />, text: '拒绝' },
      NEEDS_REVISION: { color: 'warning', icon: <ExclamationCircleOutlined />, text: '需修改' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getPublishTypeTag = (type: PublishType) => {
    const config: Record<PublishType, { color: string; text: string }> = {
      IMMEDIATE: { color: 'blue', text: '立即发布' },
      SCHEDULED: { color: 'orange', text: '定时发布' },
      BATCH: { color: 'purple', text: '批量发布' },
      UPDATE: { color: 'cyan', text: '更新发布' },
      UNPUBLISH: { color: 'default', text: '下线' },
    }
    return <Tag color={config[type]?.color || 'default'}>{config[type]?.text || type}</Tag>
  }

  const handleApprove = (taskId: string) => {
    message.success('审核通过')
  }

  const handleReject = (taskId: string) => {
    message.warning('审核拒绝')
  }

  const handlePublish = (taskId: string) => {
    message.success('发布成功')
  }

  const handleRetry = (taskId: string) => {
    message.info('正在重试...')
  }

  const taskColumns: ColumnsType<any> = [
    { title: '任务ID', dataIndex: 'id', width: 80 },
    { title: '内容', dataIndex: 'contentTitle', width: 150, ellipsis: true },
    { title: '类型', dataIndex: 'contentType', width: 80, render: (type: string) => <Tag color="blue">{type}</Tag> },
    { title: '版本', dataIndex: 'versionNumber', width: 80, render: (v: string) => <Text code>{v}</Text> },
    { title: '站点', dataIndex: 'siteName', width: 80 },
    { title: '发布类型', dataIndex: 'publishType', width: 100, render: (type: PublishType) => getPublishTypeTag(type) },
    { title: '发布状态', dataIndex: 'status', width: 100, render: (status: PublishStatus) => getStatusTag(status) },
    { title: '审核状态', dataIndex: 'reviewStatus', width: 100, render: (status: ReviewStatus) => getReviewStatusTag(status) },
    { title: '作者', dataIndex: 'authorName', width: 80 },
    { title: '创建时间', dataIndex: 'createdAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '操作', key: 'action', width: 150, render: (_, record) => (
      <Space>
        {record.reviewStatus === ReviewStatus.IN_REVIEW && (
          <Space>
            <Popconfirm title="确认审核通过？" onConfirm={() => handleApprove(record.id)}>
              <Button type="link" size="small" icon={<CheckCircleOutlined />}>通过</Button>
            </Popconfirm>
            <Popconfirm title="确认审核拒绝？" onConfirm={() => handleReject(record.id)}>
              <Button type="link" size="small" icon={<CloseCircleOutlined />}>拒绝</Button>
            </Popconfirm>
          </Space>
        )}
        {record.status === PublishStatus.APPROVED && record.reviewStatus === ReviewStatus.APPROVED && (
          <Popconfirm title="确认立即发布？" onConfirm={() => handlePublish(record.id)}>
            <Button type="link" size="small" icon={<SendOutlined />}>发布</Button>
          </Popconfirm>
        )}
        {record.status === PublishStatus.FAILED && (
          <Popconfirm title="确认重试发布？" onConfirm={() => handleRetry(record.id)}>
            <Button type="link" size="small" icon={<SyncOutlined />}>重试</Button>
          </Popconfirm>
        )}
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedTask(record); setDetailModalVisible(true) }}>详情</Button>
      </Space>
    )},
  ]

  const queueColumns: ColumnsType<any> = [
    { title: '队列名称', dataIndex: 'name', width: 150 },
    { title: '站点', dataIndex: 'siteId', width: 100, render: (id: string) => id ? <Tag>{id}</Tag> : <Tag color="purple">全局</Tag> },
    { title: '总任务', dataIndex: 'totalTasks', width: 80 },
    { title: '待处理', dataIndex: 'pendingTasks', width: 80, render: (n: number) => <Badge count={n} style={{ backgroundColor: '#1890ff' }} /> },
    { title: '定时', dataIndex: 'scheduledTasks', width: 80, render: (n: number) => <Badge count={n} style={{ backgroundColor: '#faad14' }} /> },
    { title: '已完成', dataIndex: 'completedTasks', width: 80, render: (n: number) => <Badge count={n} style={{ backgroundColor: '#52c41a' }} /> },
    { title: '失败', dataIndex: 'failedTasks', width: 80, render: (n: number) => <Badge count={n} style={{ backgroundColor: '#ff4d4f' }} /> },
    { title: '平均耗时', dataIndex: 'avgProcessingTime', width: 100, render: (t: number) => `${t}秒` },
  ]

  const ruleColumns: ColumnsType<any> = [
    { title: '规则名称', dataIndex: 'name', width: 150 },
    { title: '内容类型', dataIndex: 'contentType', width: 100, render: (type: string) => type ? <Tag>{type}</Tag> : <Tag color="purple">全部</Tag> },
    { title: '站点', dataIndex: 'siteId', width: 100, render: (id: string) => id ? <Tag>{id}</Tag> : <Tag color="cyan">全部</Tag> },
    { title: '需审核', dataIndex: 'requireReview', width: 80, render: (req: boolean) => req ? <Tag color="orange">需审核</Tag> : <Tag color="green">免审核</Tag> },
    { title: '审核层级', dataIndex: 'reviewLevels', width: 80 },
    { title: '状态', dataIndex: 'enabled', width: 80, render: (enabled: boolean) => enabled ? <Tag color="success">启用</Tag> : <Tag>禁用</Tag> },
    { title: '操作', key: 'action', width: 80, render: () => <Button type="link" size="small" icon={<SettingOutlined />}>配置</Button> },
  ]

  const historyColumns: ColumnsType<any> = [
    { title: '内容', dataIndex: 'contentTitle', width: 150 },
    { title: '操作', dataIndex: 'action', width: 100, render: (action: string) => <Tag color={action === 'PUBLISH' ? 'green' : action === 'UNPUBLISH' ? 'default' : 'blue'}>{action}</Tag> },
    { title: '状态', dataIndex: 'newStatus', width: 100 },
    { title: '执行人', dataIndex: 'performerName', width: 80 },
    { title: '执行时间', dataIndex: 'performedAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '备注', dataIndex: 'notes', width: 150, ellipsis: true },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <RocketOutlined style={{ marginRight: 8 }} />
            发布工作流管理
          </Title>
          <Text type="secondary">内容发布审批、定时发布、发布队列管理</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<OrderedListOutlined />} style={{ marginRight: 8 }}>队列管理</Button>
          <Button icon={<SettingOutlined />} style={{ marginRight: 8 }}>审核规则</Button>
          <Button type="primary" icon={<SendOutlined />}>批量发布</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">任务总数</Text>} value={stats.totalTasks} prefix={<OrderedListOutlined style={{ color: '#1890ff' }} />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">待发布</Text>} value={stats.pendingTasks} prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">定时发布</Text>} value={stats.scheduledTasks} prefix={<CalendarOutlined style={{ color: '#13c2c2' }} />} valueStyle={{ color: '#13c2c2' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">已发布</Text>} value={stats.publishedTasks} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">失败</Text>} value={stats.failedTasks} prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">审核通过率</Text>} value={stats.approvalRate} suffix="%" prefix={<CheckCircleOutlined style={{ color: '#722ed1' }} />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      {/* 任务列表 */}
      <Tabs defaultActiveKey="tasks">
        <TabPane tab="发布任务" key="tasks">
          <Card className="daoda-card">
            <Table
              columns={taskColumns}
              dataSource={publishTasks}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="发布队列" key="queues">
          <Card className="daoda-card">
            <Table
              columns={queueColumns}
              dataSource={publishQueues}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>
        <TabPane tab="审核规则" key="rules">
          <Card className="daoda-card">
            <Table
              columns={ruleColumns}
              dataSource={reviewRules}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>
        <TabPane tab="发布历史" key="history">
          <Card className="daoda-card">
            <Table
              columns={historyColumns}
              dataSource={publishHistory}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 任务详情弹窗 */}
      <Modal
        title="发布任务详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedTask && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="任务ID">{selectedTask.id}</Descriptions.Item>
              <Descriptions.Item label="内容">{selectedTask.contentTitle}</Descriptions.Item>
              <Descriptions.Item label="内容类型"><Tag>{selectedTask.contentType}</Tag></Descriptions.Item>
              <Descriptions.Item label="版本"><Text code>{selectedTask.versionNumber}</Text></Descriptions.Item>
              <Descriptions.Item label="站点">{selectedTask.siteName}</Descriptions.Item>
              <Descriptions.Item label="发布类型">{getPublishTypeTag(selectedTask.publishType)}</Descriptions.Item>
              <Descriptions.Item label="发布状态">{getStatusTag(selectedTask.status)}</Descriptions.Item>
              <Descriptions.Item label="审核状态">{getReviewStatusTag(selectedTask.reviewStatus)}</Descriptions.Item>
              <Descriptions.Item label="作者">{selectedTask.authorName}</Descriptions.Item>
              <Descriptions.Item label="审核人">{selectedTask.reviewerName || '-'}</Descriptions.Item>
              {selectedTask.scheduledAt && <Descriptions.Item label="定时时间">{dayjs(selectedTask.scheduledAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>}
              {selectedTask.publishedAt && <Descriptions.Item label="发布时间">{dayjs(selectedTask.publishedAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>}
              {selectedTask.error && <Descriptions.Item label="错误信息"><Text type="danger">{selectedTask.error}</Text></Descriptions.Item>}
              {selectedTask.retryCount && <Descriptions.Item label="重试次数">{selectedTask.retryCount}</Descriptions.Item>}
            </Descriptions>

            {selectedTask.error && (
              <Card size="small" style={{ marginTop: 16 }} title="发布失败详情">
                <Text type="danger">{selectedTask.error}</Text>
                <div style={{ marginTop: 8 }}>
                  <Text>已重试 {selectedTask.retryCount} 次</Text>
                </div>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}