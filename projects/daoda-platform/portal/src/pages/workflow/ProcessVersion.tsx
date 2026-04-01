/**
 * 流程版本管理页面
 * 流程定义版本控制、发布管理、版本对比
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
  Timeline,
  Tabs,
  Statistic,
  message,
  Alert,
  Tooltip,
  Select,
  Popconfirm,
  Collapse,
} from 'antd'
import {
  BranchesOutlined,
  PlusOutlined,
  EditOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileAddOutlined,
  SendOutlined,
  RollbackOutlined,
  EyeOutlined,
  DiffOutlined,
  ExportOutlined,
  TagOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { Panel } = Collapse

// 版本状态枚举
enum VersionStatus {
  DRAFT = 'DRAFT',
  TESTING = 'TESTING',
  PUBLISHED = 'PUBLISHED',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

// 变更类型枚举
enum ChangeType {
  CREATED = 'CREATED',
  MODIFIED = 'MODIFIED',
  NODE_ADDED = 'NODE_ADDED',
  NODE_DELETED = 'NODE_DELETED',
  NODE_MODIFIED = 'NODE_MODIFIED',
  CONDITION_CHANGED = 'CONDITION_CHANGED',
  ROUTING_CHANGED = 'ROUTING_CHANGED',
  PUBLISHED = 'PUBLISHED',
  DEPRECATED = 'DEPRECATED',
}

export default function ProcessVersion() {
  const [definitions, setDefinitions] = useState<any[]>([])
  const [versions, setVersions] = useState<any[]>([])
  const [changes, setChanges] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [compareModalVisible, setCompareModalVisible] = useState(false)
  const [publishModalVisible, setPublishModalVisible] = useState(false)
  const [selectedDefinition, setSelectedDefinition] = useState<any | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<any | null>(null)
  const [compareResult, setCompareResult] = useState<any | null>(null)
  const [stats, setStats] = useState({
    totalDefinitions: 5,
    publishedDefinitions: 4,
    totalVersions: 10,
    publishedVersions: 5,
    avgVersionsPerDefinition: 2,
  })
  const [compareVersion1, setCompareVersion1] = useState<string>('')
  const [compareVersion2, setCompareVersion2] = useState<string>('')

  useEffect(() => {
    fetchDefinitions()
    fetchVersions()
    fetchChanges()
    fetchStats()
  }, [])

  const fetchDefinitions = async () => {
    setLoading(true)
    const mockDefs = [
      { id: 'PD-001', name: '采购审批流程', code: 'PURCHASE-APPROVAL', category: '采购管理', status: VersionStatus.PUBLISHED, currentVersion: 'v2.1', publishedVersion: 'v2.1', ownerName: '张三', updatedAt: new Date() },
      { id: 'PD-002', name: '请假审批流程', code: 'LEAVE-APPROVAL', category: '人事管理', status: VersionStatus.PUBLISHED, currentVersion: 'v1.2', publishedVersion: 'v1.2', ownerName: '李四', updatedAt: new Date() },
      { id: 'PD-003', name: '合同审批流程', code: 'CONTRACT-APPROVAL', category: '合同管理', status: VersionStatus.TESTING, currentVersion: 'v1.1-beta', publishedVersion: 'v1.0', ownerName: '王五', updatedAt: new Date() },
      { id: 'PD-004', name: '报销审批流程', code: 'EXPENSE-APPROVAL', category: '财务管理', status: VersionStatus.PUBLISHED, currentVersion: 'v1.3', publishedVersion: 'v1.3', ownerName: '赵六', updatedAt: new Date() },
      { id: 'PD-005', name: '项目立项流程', code: 'PROJECT-INIT', category: '项目管理', status: VersionStatus.DRAFT, currentVersion: 'v0.1-draft', ownerName: '钱七', updatedAt: new Date() },
    ]
    setDefinitions(mockDefs)
    setLoading(false)
  }

  const fetchVersions = async () => {
    const mockVersions = [
      // 采购审批流程版本
      { id: 'PV-001', definitionId: 'PD-001', definitionName: '采购审批流程', versionNumber: 'v1.0', majorVersion: 1, minorVersion: 0, status: VersionStatus.ARCHIVED, instanceCount: 50, createdAt: new Date('2026-01-01') },
      { id: 'PV-002', definitionId: 'PD-001', definitionName: '采购审批流程', versionNumber: 'v2.0', majorVersion: 2, minorVersion: 0, status: VersionStatus.DEPRECATED, instanceCount: 100, createdAt: new Date('2026-02-01') },
      { id: 'PV-003', definitionId: 'PD-001', definitionName: '采购审批流程', versionNumber: 'v2.1', majorVersion: 2, minorVersion: 1, status: VersionStatus.PUBLISHED, isDefault: true, instanceCount: 35, publishedAt: new Date('2026-03-15'), createdAt: new Date('2026-03-10') },
      // 请假审批流程版本
      { id: 'PV-004', definitionId: 'PD-002', definitionName: '请假审批流程', versionNumber: 'v1.0', majorVersion: 1, minorVersion: 0, status: VersionStatus.ARCHIVED, instanceCount: 80, createdAt: new Date('2026-01-15') },
      { id: 'PV-005', definitionId: 'PD-002', definitionName: '请假审批流程', versionNumber: 'v1.1', majorVersion: 1, minorVersion: 1, status: VersionStatus.DEPRECATED, instanceCount: 120, createdAt: new Date('2026-02-15') },
      { id: 'PV-006', definitionId: 'PD-002', definitionName: '请假审批流程', versionNumber: 'v1.2', majorVersion: 1, minorVersion: 2, status: VersionStatus.PUBLISHED, isDefault: true, instanceCount: 50, publishedAt: new Date('2026-03-01'), createdAt: new Date('2026-02-28') },
      // 合同审批流程版本
      { id: 'PV-007', definitionId: 'PD-003', definitionName: '合同审批流程', versionNumber: 'v1.0', majorVersion: 1, minorVersion: 0, status: VersionStatus.PUBLISHED, instanceCount: 20, publishedAt: new Date('2026-02-15'), createdAt: new Date('2026-02-01') },
      { id: 'PV-008', definitionId: 'PD-003', definitionName: '合同审批流程', versionNumber: 'v1.1-beta', majorVersion: 1, minorVersion: 1, status: VersionStatus.TESTING, instanceCount: 5, createdAt: new Date('2026-03-01') },
      // 报销审批流程版本
      { id: 'PV-009', definitionId: 'PD-004', definitionName: '报销审批流程', versionNumber: 'v1.3', majorVersion: 1, minorVersion: 3, status: VersionStatus.PUBLISHED, isDefault: true, instanceCount: 200, publishedAt: new Date('2026-03-20'), createdAt: new Date('2026-03-15') },
      // 项目立项流程版本
      { id: 'PV-010', definitionId: 'PD-005', definitionName: '项目立项流程', versionNumber: 'v0.1-draft', majorVersion: 0, minorVersion: 1, status: VersionStatus.DRAFT, createdAt: new Date('2026-03-01') },
    ]
    setVersions(mockVersions)
  }

  const fetchChanges = async () => {
    const mockChanges = [
      { id: 'VC-001', versionId: 'PV-002', changeType: ChangeType.NODE_ADDED, description: '新增金额判断条件节点', changedByName: '张三', changedAt: new Date('2026-02-01') },
      { id: 'VC-002', versionId: 'PV-002', changeType: ChangeType.NODE_ADDED, description: '新增总经理审批节点', changedByName: '张三', changedAt: new Date('2026-02-01') },
      { id: 'VC-003', versionId: 'PV-003', changeType: ChangeType.NODE_ADDED, description: '新增董事会审批节点', changedByName: '张三', changedAt: new Date('2026-03-10') },
      { id: 'VC-004', versionId: 'PV-003', changeType: ChangeType.NODE_MODIFIED, description: '为审批节点添加超时设置', changedByName: '张三', changedAt: new Date('2026-03-10') },
      { id: 'VC-005', versionId: 'PV-003', changeType: ChangeType.PUBLISHED, description: '版本发布', changedByName: '李四', changedAt: new Date('2026-03-15') },
      { id: 'VC-006', versionId: 'PV-006', changeType: ChangeType.CONDITION_CHANGED, description: '调整请假天数判断条件', changedByName: '李四', changedAt: new Date('2026-02-28') },
    ]
    setChanges(mockChanges)
  }

  const fetchStats = async () => {
    setStats({
      totalDefinitions: 5,
      publishedDefinitions: 4,
      totalVersions: 10,
      publishedVersions: 5,
      avgVersionsPerDefinition: 2,
    })
  }

  const getStatusTag = (status: VersionStatus) => {
    const config: Record<VersionStatus, { color: string; icon: any; text: string }> = {
      DRAFT: { color: 'default', icon: <EditOutlined />, text: '草稿' },
      TESTING: { color: 'processing', icon: <ClockCircleOutlined />, text: '测试中' },
      PUBLISHED: { color: 'success', icon: <CheckCircleOutlined />, text: '已发布' },
      DEPRECATED: { color: 'warning', icon: <HistoryOutlined />, text: '已废弃' },
      ARCHIVED: { color: 'default', icon: <ExportOutlined />, text: '已归档' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getChangeTypeTag = (type: ChangeType) => {
    const config: Record<ChangeType, { color: string; text: string }> = {
      CREATED: { color: 'blue', text: '创建' },
      MODIFIED: { color: 'orange', text: '修改' },
      NODE_ADDED: { color: 'green', text: '新增节点' },
      NODE_DELETED: { color: 'red', text: '删除节点' },
      NODE_MODIFIED: { color: 'orange', text: '修改节点' },
      CONDITION_CHANGED: { color: 'purple', text: '条件变更' },
      ROUTING_CHANGED: { color: 'cyan', text: '路由变更' },
      PUBLISHED: { color: 'success', text: '发布' },
      DEPRECATED: { color: 'warning', text: '废弃' },
    }
    return <Tag color={config[type]?.color || 'default'}>{config[type]?.text || type}</Tag>
  }

  const handleCompare = async () => {
    if (!compareVersion1 || !compareVersion2) {
      message.warning('请选择两个版本进行对比')
      return
    }

    // 模拟对比结果
    setCompareResult({
      version1: compareVersion1,
      version2: compareVersion2,
      nodeChanges: [
        { nodeName: '董事会审批', changeType: 'ADDED', details: '金额>10万时需要董事会审批' },
        { nodeName: '审批超时设置', changeType: 'MODIFIED', details: '添加超时时间配置' },
      ],
      summary: '新增1节点，修改1节点',
    })
    setCompareModalVisible(true)
  }

  const handlePublish = async (versionId: string) => {
    message.success('版本发布成功')
    setPublishModalVisible(false)
  }

  const handleRollback = async (definitionId: string, targetVersionId: string) => {
    message.success('版本回退成功')
  }

  const definitionColumns: ColumnsType<any> = [
    { title: '流程编码', dataIndex: 'code', width: 140 },
    { title: '流程名称', dataIndex: 'name', width: 150 },
    { title: '分类', dataIndex: 'category', width: 100, render: (cat: string) => <Tag color="blue">{cat}</Tag> },
    { title: '状态', dataIndex: 'status', width: 100, render: (status: VersionStatus) => getStatusTag(status) },
    { title: '当前版本', dataIndex: 'currentVersion', width: 100, render: (v: string) => <Badge status={v.includes('draft') ? 'default' : 'success'} text={v} /> },
    { title: '发布版本', dataIndex: 'publishedVersion', width: 100 },
    { title: '负责人', dataIndex: 'ownerName', width: 80 },
    { title: '更新时间', dataIndex: 'updatedAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '操作', key: 'action', width: 150, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedDefinition(record); setDetailModalVisible(true) }}>详情</Button>
        <Button type="link" size="small" icon={<HistoryOutlined />}>版本</Button>
      </Space>
    )},
  ]

  const versionColumns: ColumnsType<any> = [
    { title: '版本号', dataIndex: 'versionNumber', width: 100, render: (v: string) => <Text code>{v}</Text> },
    { title: '流程名称', dataIndex: 'definitionName', width: 150 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status: VersionStatus) => getStatusTag(status) },
    { title: '默认版本', dataIndex: 'isDefault', width: 80, render: (isDefault: boolean) => isDefault ? <Badge status="success" text="默认" /> : '-' },
    { title: '实例数', dataIndex: 'instanceCount', width: 80, render: (count: number) => count || 0 },
    { title: '创建时间', dataIndex: 'createdAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD') },
    { title: '发布时间', dataIndex: 'publishedAt', width: 100, render: (time: Date) => time ? dayjs(time).format('MM-DD') : '-' },
    { title: '操作', key: 'action', width: 150, render: (_, record) => (
      <Space>
        {record.status === VersionStatus.TESTING && (
          <Popconfirm title="确认发布此版本？" onConfirm={() => handlePublish(record.id)}>
            <Button type="link" size="small" icon={<SendOutlined />}>发布</Button>
          </Popconfirm>
        )}
        {record.status === VersionStatus.PUBLISHED && !record.isDefault && (
          <Popconfirm title="确认回退到此版本？" onConfirm={() => handleRollback(record.definitionId, record.id)}>
            <Button type="link" size="small" icon={<RollbackOutlined />}>回退</Button>
          </Popconfirm>
        )}
        <Button type="link" size="small" icon={<EyeOutlined />}>详情</Button>
      </Space>
    )},
  ]

  const changeColumns: ColumnsType<any> = [
    { title: '变更类型', dataIndex: 'changeType', width: 100, render: (type: ChangeType) => getChangeTypeTag(type) },
    { title: '描述', dataIndex: 'description', width: 200, ellipsis: true },
    { title: '变更人', dataIndex: 'changedByName', width: 80 },
    { title: '变更时间', dataIndex: 'changedAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <BranchesOutlined style={{ marginRight: 8 }} />
            流程版本管理
          </Title>
          <Text type="secondary">流程定义版本控制、发布管理、版本对比</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<DiffOutlined />} onClick={() => setCompareModalVisible(true)}>版本对比</Button>
          <Button type="primary" icon={<PlusOutlined />}>新建流程</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">流程定义总数</Text>}
              value={stats.totalDefinitions}
              prefix={<FileAddOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">已发布流程</Text>}
              value={stats.publishedDefinitions}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">版本总数</Text>}
              value={stats.totalVersions}
              prefix={<TagOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">已发布版本</Text>}
              value={stats.publishedVersions}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均版本数</Text>}
              value={stats.avgVersionsPerDefinition}
              suffix="/流程"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">草稿版本</Text>}
              value={1}
              prefix={<EditOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 流程定义和版本列表 */}
      <Tabs defaultActiveKey="definitions">
        <TabPane tab="流程定义" key="definitions">
          <Card className="daoda-card">
            <Table
              columns={definitionColumns}
              dataSource={definitions}
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
              dataSource={versions}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="变更记录" key="changes">
          <Card className="daoda-card">
            <Table
              columns={changeColumns}
              dataSource={changes}
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
              {versions.map(v => <Option key={v.id} value={v.versionNumber}>{v.versionNumber}</Option>)}
            </Select>
          </Col>
          <Col span={12}>
            <Text>版本2</Text>
            <Select style={{ width: '100%', marginTop: 8 }} placeholder="选择版本" onChange={setCompareVersion2}>
              {versions.map(v => <Option key={v.id} value={v.versionNumber}>{v.versionNumber}</Option>)}
            </Select>
          </Col>
        </Row>

        {compareResult && (
          <Card size="small" title="对比结果">
            <Alert message={compareResult.summary} type="info" showIcon style={{ marginBottom: 16 }} />
            <Table
              columns={[
                { title: '节点', dataIndex: 'nodeName', width: 150 },
                { title: '变更类型', dataIndex: 'changeType', width: 100, render: (type: string) => <Tag color={type === 'ADDED' ? 'green' : 'orange'}>{type}</Tag> },
                { title: '详情', dataIndex: 'details', width: 200 },
              ]}
              dataSource={compareResult.nodeChanges}
              rowKey="nodeName"
              pagination={false}
              size="small"
            />
          </Card>
        )}
      </Modal>

      {/* 流程详情弹窗 */}
      <Modal
        title="流程定义详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedDefinition && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="流程编码">{selectedDefinition.code}</Descriptions.Item>
              <Descriptions.Item label="流程名称">{selectedDefinition.name}</Descriptions.Item>
              <Descriptions.Item label="分类"><Tag color="blue">{selectedDefinition.category}</Tag></Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(selectedDefinition.status)}</Descriptions.Item>
              <Descriptions.Item label="当前版本"><Text code>{selectedDefinition.currentVersion}</Text></Descriptions.Item>
              <Descriptions.Item label="发布版本"><Text code>{selectedDefinition.publishedVersion}</Text></Descriptions.Item>
              <Descriptions.Item label="负责人">{selectedDefinition.ownerName}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{dayjs(selectedDefinition.updatedAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 16 }}>版本历史</Title>
            <Table
              columns={[
                { title: '版本号', dataIndex: 'versionNumber', width: 100 },
                { title: '状态', dataIndex: 'status', width: 100, render: (s: VersionStatus) => getStatusTag(s) },
                { title: '实例数', dataIndex: 'instanceCount', width: 80 },
                { title: '创建时间', dataIndex: 'createdAt', width: 100, render: (t: Date) => dayjs(t).format('MM-DD') },
              ]}
              dataSource={versions.filter(v => v.definitionId === selectedDefinition.id)}
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