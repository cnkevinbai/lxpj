/**
 * 内容版本管理页面
 * 内容版本控制、历史记录、版本对比、回退
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
  Collapse,
} from 'antd'
import {
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  SendOutlined,
  RollbackOutlined,
  EyeOutlined,
  DiffOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { Panel } = Collapse

// 版本状态枚举
enum ContentVersionStatus {
  DRAFT = 'DRAFT',
  REVIEWING = 'REVIEWING',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED',
  UNPUBLISHED = 'UNPUBLISHED',
}

// 内容类型枚举
enum ContentType {
  ARTICLE = 'ARTICLE',
  NEWS = 'NEWS',
  PRODUCT = 'PRODUCT',
  CASE = 'CASE',
  VIDEO = 'VIDEO',
  PAGE = 'PAGE',
  BANNER = 'BANNER',
}

export default function ContentVersion() {
  const [contentEntities, setContentEntities] = useState<any[]>([])
  const [contentVersions, setContentVersions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [compareModalVisible, setCompareModalVisible] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null)
  const [compareResult, setCompareResult] = useState<any | null>(null)
  const [stats, setStats] = useState({
    totalEntities: 7,
    totalVersions: 21,
    publishedVersions: 5,
    draftVersions: 3,
    reviewingVersions: 1,
    scheduledVersions: 1,
  })
  const [compareVersion1, setCompareVersion1] = useState<string>('')
  const [compareVersion2, setCompareVersion2] = useState<string>('')

  useEffect(() => {
    fetchContentEntities()
    fetchContentVersions()
    fetchStats()
  }, [])

  const fetchContentEntities = async () => {
    setLoading(true)
    const mockEntities = [
      { id: 'CE-001', title: '公司简介', contentType: ContentType.PAGE, siteId: 'SITE-001', currentVersionId: 'CV-003', publishedVersionId: 'CV-003', totalVersions: 3, status: ContentVersionStatus.PUBLISHED, authorName: '张三', createdAt: new Date('2026-01-01'), updatedAt: new Date() },
      { id: 'CE-002', title: '产品发布新闻', contentType: ContentType.NEWS, siteId: 'SITE-001', categoryId: 'CAT-001', categoryName: '产品动态', currentVersionId: 'CV-006', publishedVersionId: 'CV-006', totalVersions: 2, status: ContentVersionStatus.PUBLISHED, authorName: '李四', createdAt: new Date('2026-02-01'), updatedAt: new Date() },
      { id: 'CE-003', title: 'IOV平台介绍', contentType: ContentType.PRODUCT, siteId: 'SITE-001', categoryId: 'CAT-002', categoryName: '智能车辆', currentVersionId: 'CV-009', publishedVersionId: 'CV-008', totalVersions: 3, status: ContentVersionStatus.REVIEWING, authorName: '王五', createdAt: new Date('2026-02-15'), updatedAt: new Date() },
      { id: 'CE-004', title: '客户案例：眉山市智慧交通', contentType: ContentType.CASE, siteId: 'SITE-001', categoryId: 'CAT-003', categoryName: '成功案例', currentVersionId: 'CV-012', publishedVersionId: 'CV-011', totalVersions: 2, status: ContentVersionStatus.PUBLISHED, authorName: '赵六', createdAt: new Date('2026-03-01'), updatedAt: new Date() },
      { id: 'CE-005', title: '技术白皮书下载', contentType: ContentType.ARTICLE, siteId: 'SITE-001', categoryId: 'CAT-004', categoryName: '技术资料', currentVersionId: 'CV-015', totalVersions: 1, status: ContentVersionStatus.DRAFT, authorName: '钱七', createdAt: new Date('2026-03-15'), updatedAt: new Date() },
      { id: 'CE-006', title: '首页Banner2026春季', contentType: ContentType.BANNER, siteId: 'SITE-001', currentVersionId: 'CV-018', publishedVersionId: 'CV-017', totalVersions: 2, status: ContentVersionStatus.SCHEDULED, authorName: '周八', createdAt: new Date('2026-03-20'), updatedAt: new Date() },
      { id: 'CE-007', title: '产品演示视频', contentType: ContentType.VIDEO, siteId: 'SITE-001', currentVersionId: 'CV-021', publishedVersionId: 'CV-020', totalVersions: 2, status: ContentVersionStatus.ARCHIVED, authorName: '吴九', createdAt: new Date('2026-01-15'), updatedAt: new Date() },
    ]
    setContentEntities(mockEntities)
    setLoading(false)
  }

  const fetchContentVersions = async () => {
    const mockVersions = [
      { id: 'CV-001', contentId: 'CE-001', contentTitle: '公司简介', versionNumber: 'v1.0', majorVersion: 1, minorVersion: 0, status: ContentVersionStatus.ARCHIVED, title: '公司简介', authorName: '张三', publishedAt: new Date('2026-01-01'), viewCount: 1000, createdAt: new Date('2026-01-01') },
      { id: 'CV-002', contentId: 'CE-001', contentTitle: '公司简介', versionNumber: 'v1.1', majorVersion: 1, minorVersion: 1, status: ContentVersionStatus.ARCHIVED, title: '公司简介（更新版）', authorName: '张三', parentId: 'CV-001', publishedAt: new Date('2026-02-01'), viewCount: 1500, createdAt: new Date('2026-02-01') },
      { id: 'CV-003', contentId: 'CE-001', contentTitle: '公司简介', versionNumber: 'v2.0', majorVersion: 2, minorVersion: 0, status: ContentVersionStatus.PUBLISHED, title: '道达智能 - 公司简介', authorName: '张三', parentId: 'CV-002', isCurrent: true, isPublished: true, publishedAt: new Date('2026-03-01'), viewCount: 2000, createdAt: new Date('2026-03-01') },
      { id: 'CV-004', contentId: 'CE-002', contentTitle: '产品发布新闻', versionNumber: 'v1.0', majorVersion: 1, minorVersion: 0, status: ContentVersionStatus.ARCHIVED, title: '新产品发布', authorName: '李四', publishedAt: new Date('2026-02-01'), viewCount: 500, createdAt: new Date('2026-02-01') },
      { id: 'CV-006', contentId: 'CE-002', contentTitle: '产品发布新闻', versionNumber: 'v2.0', majorVersion: 2, minorVersion: 0, status: ContentVersionStatus.PUBLISHED, title: '道达智能发布新一代IOV平台', authorName: '李四', isCurrent: true, isPublished: true, publishedAt: new Date('2026-03-01'), viewCount: 800, createdAt: new Date('2026-03-01') },
      { id: 'CV-007', contentId: 'CE-003', contentTitle: 'IOV平台介绍', versionNumber: 'v1.0', majorVersion: 1, minorVersion: 0, status: ContentVersionStatus.ARCHIVED, title: 'IOV平台', authorName: '王五', publishedAt: new Date('2026-02-15'), viewCount: 300, createdAt: new Date('2026-02-15') },
      { id: 'CV-008', contentId: 'CE-003', contentTitle: 'IOV平台介绍', versionNumber: 'v1.1', majorVersion: 1, minorVersion: 1, status: ContentVersionStatus.PUBLISHED, title: 'IOV智能车辆管理平台', authorName: '王五', isPublished: true, publishedAt: new Date('2026-03-01'), viewCount: 450, createdAt: new Date('2026-03-01') },
      { id: 'CV-009', contentId: 'CE-003', contentTitle: 'IOV平台介绍', versionNumber: 'v2.0-beta', majorVersion: 2, minorVersion: 0, status: ContentVersionStatus.REVIEWING, title: 'IOV智能车辆管理平台 V2.0', authorName: '王五', parentId: 'CV-008', isCurrent: true, changeLog: '新增模块化架构介绍', createdAt: new Date('2026-03-15') },
      { id: 'CV-011', contentId: 'CE-004', contentTitle: '客户案例', versionNumber: 'v1.1', majorVersion: 1, minorVersion: 1, status: ContentVersionStatus.PUBLISHED, title: '眉山市智慧交通项目案例', authorName: '赵六', isPublished: true, publishedAt: new Date('2026-03-15'), viewCount: 350, createdAt: new Date('2026-03-15') },
      { id: 'CV-012', contentId: 'CE-004', contentTitle: '客户案例', versionNumber: 'v2.0', majorVersion: 2, minorVersion: 0, status: ContentVersionStatus.DRAFT, title: '眉山市智慧交通完整案例', authorName: '赵六', parentId: 'CV-011', isCurrent: true, createdAt: new Date('2026-03-20') },
      { id: 'CV-015', contentId: 'CE-005', contentTitle: '技术白皮书', versionNumber: 'v1.0-draft', majorVersion: 1, minorVersion: 0, status: ContentVersionStatus.DRAFT, title: 'IOV平台技术白皮书', authorName: '钱七', isCurrent: true, createdAt: new Date('2026-03-15') },
      { id: 'CV-018', contentId: 'CE-006', contentTitle: '首页Banner', versionNumber: 'v2.0', majorVersion: 2, minorVersion: 0, status: ContentVersionStatus.SCHEDULED, title: '2026春季新版Banner', authorName: '周八', isCurrent: true, scheduledAt: new Date('2026-04-01'), createdAt: new Date('2026-03-20') },
    ]
    setContentVersions(mockVersions)
  }

  const fetchStats = async () => {
    setStats({ totalEntities: 7, totalVersions: 21, publishedVersions: 5, draftVersions: 3, reviewingVersions: 1, scheduledVersions: 1 })
  }

  const getStatusTag = (status: ContentVersionStatus) => {
    const config: Record<ContentVersionStatus, { color: string; icon: any; text: string }> = {
      DRAFT: { color: 'default', icon: <EditOutlined />, text: '草稿' },
      REVIEWING: { color: 'processing', icon: <ClockCircleOutlined />, text: '审核中' },
      APPROVED: { color: 'success', icon: <CheckCircleOutlined />, text: '已审核' },
      PUBLISHED: { color: 'success', icon: <CheckCircleOutlined />, text: '已发布' },
      SCHEDULED: { color: 'warning', icon: <CalendarOutlined />, text: '定时发布' },
      ARCHIVED: { color: 'default', icon: <HistoryOutlined />, text: '已归档' },
      UNPUBLISHED: { color: 'error', icon: <ExclamationCircleOutlined />, text: '已下线' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getContentTypeTag = (type: ContentType) => {
    const config: Record<ContentType, { color: string; text: string }> = {
      ARTICLE: { color: 'blue', text: '文章' },
      NEWS: { color: 'cyan', text: '新闻' },
      PRODUCT: { color: 'purple', text: '产品' },
      CASE: { color: 'green', text: '案例' },
      VIDEO: { color: 'orange', text: '视频' },
      PAGE: { color: 'magenta', text: '页面' },
      BANNER: { color: 'gold', text: 'Banner' },
    }
    return <Tag color={config[type]?.color || 'default'}>{config[type]?.text || type}</Tag>
  }

  const handleCompare = async () => {
    if (!compareVersion1 || !compareVersion2) {
      message.warning('请选择两个版本进行对比')
      return
    }

    const v1 = contentVersions.find(v => v.id === compareVersion1)
    const v2 = contentVersions.find(v => v.id === compareVersion2)
    if (!v1 || !v2) return

    setCompareResult({
      version1: v1,
      version2: v2,
      titleDiff: { old: v1.title, new: v2.title, changed: v1.title !== v2.title },
      contentDiff: { additions: 50, deletions: 30, unchanged: 200 },
      summary: `${v1.versionNumber} → ${v2.versionNumber}: ${v1.title !== v2.title ? '标题变更 ' : ''}+50字 -30字`,
    })
    setCompareModalVisible(true)
  }

  const entityColumns: ColumnsType<any> = [
    { title: '内容ID', dataIndex: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', width: 200, ellipsis: true },
    { title: '类型', dataIndex: 'contentType', width: 80, render: (type: ContentType) => getContentTypeTag(type) },
    { title: '分类', dataIndex: 'categoryName', width: 100, render: (cat: string) => cat ? <Tag>{cat}</Tag> : '-' },
    { title: '状态', dataIndex: 'status', width: 100, render: (status: ContentVersionStatus) => getStatusTag(status) },
    { title: '版本数', dataIndex: 'totalVersions', width: 60 },
    { title: '当前版本', dataIndex: 'currentVersionId', width: 80, render: (id: string) => {
      const v = contentVersions.find(v => v.id === id)
      return v ? <Text code>{v.versionNumber}</Text> : '-'
    }},
    { title: '作者', dataIndex: 'authorName', width: 80 },
    { title: '更新时间', dataIndex: 'updatedAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '操作', key: 'action', width: 120, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedEntity(record); setDetailModalVisible(true) }}>详情</Button>
        <Button type="link" size="small" icon={<HistoryOutlined />}>版本</Button>
      </Space>
    )},
  ]

  const versionColumns: ColumnsType<any> = [
    { title: '版本号', dataIndex: 'versionNumber', width: 100, render: (v: string) => <Text code>{v}</Text> },
    { title: '内容', dataIndex: 'contentTitle', width: 150, ellipsis: true },
    { title: '版本标题', dataIndex: 'title', width: 150, ellipsis: true },
    { title: '状态', dataIndex: 'status', width: 100, render: (status: ContentVersionStatus) => getStatusTag(status) },
    { title: '当前', dataIndex: 'isCurrent', width: 60, render: (isCurrent: boolean) => isCurrent ? <Badge status="success" text="当前" /> : '-' },
    { title: '发布时间', dataIndex: 'publishedAt', width: 100, render: (time: Date) => time ? dayjs(time).format('MM-DD') : '-' },
    { title: '浏览', dataIndex: 'viewCount', width: 60, render: (count: number) => count || 0 },
    { title: '作者', dataIndex: 'authorName', width: 80 },
    { title: '操作', key: 'action', width: 120, render: (_, record) => (
      <Space>
        {record.status === ContentVersionStatus.REVIEWING && (
          <Popconfirm title="确认审核通过？" onConfirm={() => message.success('审核通过')}>
            <Button type="link" size="small" icon={<CheckCircleOutlined />}>通过</Button>
          </Popconfirm>
        )}
        {record.status === ContentVersionStatus.APPROVED && (
          <Popconfirm title="确认发布？" onConfirm={() => message.success('发布成功')}>
            <Button type="link" size="small" icon={<SendOutlined />}>发布</Button>
          </Popconfirm>
        )}
        {!record.isCurrent && record.status === ContentVersionStatus.PUBLISHED && (
          <Popconfirm title="确认回退到此版本？" onConfirm={() => message.success('回退成功')}>
            <Button type="link" size="small" icon={<RollbackOutlined />}>回退</Button>
          </Popconfirm>
        )}
        <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
      </Space>
    )},
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <HistoryOutlined style={{ marginRight: 8 }} />
            内容版本管理
          </Title>
          <Text type="secondary">内容版本控制、历史记录、版本对比、回退</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<DiffOutlined />} onClick={() => setCompareModalVisible(true)}>版本对比</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">内容总数</Text>} value={stats.totalEntities} prefix={<FileTextOutlined style={{ color: '#1890ff' }} />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">版本总数</Text>} value={stats.totalVersions} prefix={<HistoryOutlined style={{ color: '#722ed1' }} />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">已发布</Text>} value={stats.publishedVersions} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">草稿</Text>} value={stats.draftVersions} prefix={<EditOutlined style={{ color: '#eb2f96' }} />} valueStyle={{ color: '#eb2f96' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">审核中</Text>} value={stats.reviewingVersions} prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">定时发布</Text>} value={stats.scheduledVersions} prefix={<CalendarOutlined style={{ color: '#13c2c2' }} />} valueStyle={{ color: '#13c2c2' }} />
          </Card>
        </Col>
      </Row>

      {/* 内容列表 */}
      <Tabs defaultActiveKey="entities">
        <TabPane tab="内容实体" key="entities">
          <Card className="daoda-card">
            <Table
              columns={entityColumns}
              dataSource={contentEntities}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="版本列表" key="versions">
          <Card className="daoda-card">
            <Table
              columns={versionColumns}
              dataSource={contentVersions}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 版本对比弹窗 */}
      <Modal
        title="版本对比"
        open={compareModalVisible}
        onOk={handleCompare}
        onCancel={() => setCompareModalVisible(false)}
        width={700}
        okText="对比"
        cancelText="取消"
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Text>版本1</Text>
            <Select style={{ width: '100%', marginTop: 8 }} placeholder="选择版本" onChange={setCompareVersion1}>
              {contentVersions.map(v => <Option key={v.id} value={v.id}>{v.versionNumber} - {v.title}</Option>)}
            </Select>
          </Col>
          <Col span={12}>
            <Text>版本2</Text>
            <Select style={{ width: '100%', marginTop: 8 }} placeholder="选择版本" onChange={setCompareVersion2}>
              {contentVersions.map(v => <Option key={v.id} value={v.id}>{v.versionNumber} - {v.title}</Option>)}
            </Select>
          </Col>
        </Row>

        {compareResult && (
          <Card size="small" title="对比结果">
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="版本1">{compareResult.version1.versionNumber}</Descriptions.Item>
              <Descriptions.Item label="版本2">{compareResult.version2.versionNumber}</Descriptions.Item>
              <Descriptions.Item label="标题变更">{compareResult.titleDiff.changed ? `${compareResult.titleDiff.old} → ${compareResult.titleDiff.new}` : '无变更'}</Descriptions.Item>
              <Descriptions.Item label="内容变更">+{compareResult.contentDiff.additions}字 -{compareResult.contentDiff.deletions}字</Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Modal>

      {/* 内容详情弹窗 */}
      <Modal
        title="内容版本详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedEntity && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="内容ID">{selectedEntity.id}</Descriptions.Item>
              <Descriptions.Item label="标题">{selectedEntity.title}</Descriptions.Item>
              <Descriptions.Item label="类型">{getContentTypeTag(selectedEntity.contentType)}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(selectedEntity.status)}</Descriptions.Item>
              <Descriptions.Item label="当前版本"><Text code>{contentVersions.find(v => v.id === selectedEntity.currentVersionId)?.versionNumber}</Text></Descriptions.Item>
              <Descriptions.Item label="版本总数">{selectedEntity.totalVersions}</Descriptions.Item>
              <Descriptions.Item label="作者">{selectedEntity.authorName}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{dayjs(selectedEntity.updatedAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 16 }}>版本历史</Title>
            <Table
              columns={[
                { title: '版本号', dataIndex: 'versionNumber', width: 100 },
                { title: '标题', dataIndex: 'title', width: 150, ellipsis: true },
                { title: '状态', dataIndex: 'status', width: 100, render: (s: ContentVersionStatus) => getStatusTag(s) },
                { title: '发布时间', dataIndex: 'publishedAt', width: 100, render: (t: Date) => t ? dayjs(t).format('MM-DD') : '-' },
                { title: '浏览', dataIndex: 'viewCount', width: 60 },
              ]}
              dataSource={contentVersions.filter(v => v.contentId === selectedEntity.id)}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Modal>
    </div>
  )
}