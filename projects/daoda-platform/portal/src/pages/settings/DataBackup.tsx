/**
 * 数据备份恢复页面
 * 定时备份、一键恢复、备份下载、备份管理
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
  DatePicker,
  Popconfirm,
  Progress,
  Timeline,
  Switch,
} from 'antd'
import {
  DatabaseOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  SettingOutlined,
  ScheduleOutlined,
  SafetyOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
  VerifiedOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { RangePicker } = DatePicker

// 备份类型枚举
enum BackupType {
  FULL = 'FULL',
  INCREMENTAL = 'INCREMENTAL',
  DIFFERENTIAL = 'DIFFERENTIAL',
  SCHEMA = 'SCHEMA',
  DATA = 'DATA',
}

// 备份状态枚举
enum BackupStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  VERIFYING = 'VERIFYING',
  VERIFIED = 'VERIFIED',
}

// 恢复状态枚举
enum RestoreStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ROLLBACK = 'ROLLBACK',
}

// 存储类型枚举
enum StorageType {
  LOCAL = 'LOCAL',
  S3 = 'S3',
  FTP = 'FTP',
  NAS = 'NAS',
  CLOUD = 'CLOUD',
}

export default function DataBackup() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [records, setRecords] = useState<any[]>([])
  const [restores, setRestores] = useState<any[]>([])
  const [storages, setStorages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
  const [stats, setStats] = useState({
    totalBackups: 8,
    completedBackups: 6,
    failedBackups: 1,
    pendingBackups: 1,
    totalSize: 2500,
    totalRecords: 100000,
    activeSchedules: 5,
    storageUsed: 400,
    storageAvailable: 2300,
  })
  const [activeTab, setActiveTab] = useState('records')

  useEffect(() => {
    fetchSchedules()
    fetchRecords()
    fetchRestores()
    fetchStorages()
    fetchStats()
  }, [])

  const fetchSchedules = async () => {
    const mockSchedules = [
      { id: 'BS-001', name: '每日全量备份', backupType: BackupType.FULL, scope: ['ALL'], storageType: StorageType.LOCAL, storagePath: '/backup/daily', schedule: { frequency: 'DAILY', time: '03:00' }, retentionDays: 30, compression: true, encryption: true, enabled: true, lastRunTime: new Date('2026-03-31 03:00'), nextRunTime: new Date('2026-04-01 03:00'), createdAt: new Date('2026-01-01') },
      { id: 'BS-002', name: 'CRM模块增量备份', backupType: BackupType.INCREMENTAL, scope: ['CRM'], storageType: StorageType.S3, storagePath: 's3://daoda-backup/crm', schedule: { frequency: 'HOURLY', time: '00' }, retentionDays: 7, compression: true, encryption: false, enabled: true, lastRunTime: new Date('2026-03-31 12:00'), nextRunTime: new Date('2026-03-31 13:00'), createdAt: new Date('2026-02-01') },
      { id: 'BS-003', name: '财务数据每日备份', backupType: BackupType.DATA, scope: ['Finance'], storageType: StorageType.NAS, storagePath: '/nas/finance-backup', schedule: { frequency: 'DAILY', time: '04:00' }, retentionDays: 90, compression: true, encryption: true, enabled: true, lastRunTime: new Date('2026-03-31 04:00'), nextRunTime: new Date('2026-04-01 04:00'), createdAt: new Date('2026-02-15') },
      { id: 'BS-004', name: '系统日志每周备份', backupType: BackupType.DATA, scope: ['Logs'], storageType: StorageType.LOCAL, storagePath: '/backup/logs', schedule: { frequency: 'WEEKLY', time: '02:00', dayOfWeek: 0 }, retentionDays: 365, compression: true, encryption: false, enabled: true, lastRunTime: new Date('2026-03-30 02:00'), nextRunTime: new Date('2026-04-06 02:00'), createdAt: new Date('2026-01-15') },
      { id: 'BS-005', name: '数据库结构备份', backupType: BackupType.SCHEMA, scope: ['ALL'], storageType: StorageType.LOCAL, storagePath: '/backup/schema', schedule: { frequency: 'MONTHLY', time: '01:00', dayOfMonth: 1 }, retentionDays: 365, compression: false, encryption: false, enabled: true, lastRunTime: new Date('2026-03-01 01:00'), nextRunTime: new Date('2026-04-01 01:00'), createdAt: new Date('2026-01-01') },
      { id: 'BS-006', name: 'CMS内容备份', backupType: BackupType.DATA, scope: ['CMS'], storageType: StorageType.CLOUD, storagePath: '/cloud/cms-backup', schedule: { frequency: 'DAILY', time: '05:00' }, retentionDays: 60, compression: true, encryption: false, enabled: false, createdAt: new Date('2026-03-01') },
    ]
    setSchedules(mockSchedules)
  }

  const fetchRecords = async () => {
    setLoading(true)
    const mockRecords = [
      { id: 'BR-001', scheduleId: 'BS-001', name: '全量备份-2026-03-31', backupType: BackupType.FULL, scope: ['ALL'], storageType: StorageType.LOCAL, storagePath: '/backup/daily', fileName: 'backup_20260331_030000.tar.gz', fileSize: 2048, recordCount: 50000, duration: 180, status: BackupStatus.COMPLETED, verifyStatus: 'PASS', checksum: 'sha256:abc123', startedAt: new Date('2026-03-31 03:00'), completedAt: new Date('2026-03-31 03:03'), createdBy: 'system', createdAt: new Date('2026-03-31 03:00') },
      { id: 'BR-002', scheduleId: 'BS-002', name: 'CRM增量备份-2026-03-31-12', backupType: BackupType.INCREMENTAL, scope: ['CRM'], storageType: StorageType.S3, storagePath: 's3://daoda-backup/crm', fileName: 'crm_incremental_20260331_120000.tar.gz', fileSize: 128, recordCount: 500, duration: 30, status: BackupStatus.COMPLETED, verifyStatus: 'PASS', checksum: 'sha256:def456', startedAt: new Date('2026-03-31 12:00'), completedAt: new Date('2026-03-31 12:00:30'), createdBy: 'system', createdAt: new Date('2026-03-31 12:00') },
      { id: 'BR-003', scheduleId: 'BS-003', name: '财务备份-2026-03-31', backupType: BackupType.DATA, scope: ['Finance'], storageType: StorageType.NAS, storagePath: '/nas/finance-backup', fileName: 'finance_20260331_040000.tar.gz', fileSize: 512, recordCount: 2000, duration: 60, status: BackupStatus.COMPLETED, verifyStatus: 'PASS', checksum: 'sha256:ghi789', startedAt: new Date('2026-03-31 04:00'), completedAt: new Date('2026-03-31 04:01'), createdBy: 'system', createdAt: new Date('2026-03-31 04:00') },
      { id: 'BR-004', scheduleId: 'BS-001', name: '全量备份-2026-03-30', backupType: BackupType.FULL, scope: ['ALL'], storageType: StorageType.LOCAL, storagePath: '/backup/daily', fileName: 'backup_20260330_030000.tar.gz', fileSize: 1980, recordCount: 48000, duration: 175, status: BackupStatus.COMPLETED, verifyStatus: 'PASS', checksum: 'sha256:jkl012', startedAt: new Date('2026-03-30 03:00'), completedAt: new Date('2026-03-30 03:02:55'), createdBy: 'system', createdAt: new Date('2026-03-30 03:00') },
      { id: 'BR-005', name: '手动备份-CRM客户数据', backupType: BackupType.DATA, scope: ['CRM'], storageType: StorageType.LOCAL, storagePath: '/backup/manual', fileName: 'manual_crm_customers_20260331.tar.gz', fileSize: 256, recordCount: 1000, duration: 45, status: BackupStatus.COMPLETED, verifyStatus: 'PASS', checksum: 'sha256:mno345', startedAt: new Date('2026-03-31 10:00'), completedAt: new Date('2026-03-31 10:00:45'), createdBy: 'U-001', createdAt: new Date('2026-03-31 10:00') },
      { id: 'BR-006', scheduleId: 'BS-004', name: '日志备份-2026-03-30', backupType: BackupType.DATA, scope: ['Logs'], storageType: StorageType.LOCAL, storagePath: '/backup/logs', fileName: 'logs_20260330_020000.tar.gz', fileSize: 1024, recordCount: 15000, duration: 90, status: BackupStatus.COMPLETED, verifyStatus: 'PASS', checksum: 'sha256:pqr678', startedAt: new Date('2026-03-30 02:00'), completedAt: new Date('2026-03-30 02:01:30'), createdBy: 'system', createdAt: new Date('2026-03-30 02:00') },
      { id: 'BR-007', name: '手动备份-失败', backupType: BackupType.FULL, scope: ['ALL'], storageType: StorageType.LOCAL, storagePath: '/backup/manual', fileName: 'manual_full_20260331_failed.tar.gz', fileSize: 0, recordCount: 0, duration: 15, status: BackupStatus.FAILED, errorMessage: '磁盘空间不足', startedAt: new Date('2026-03-31 11:00'), createdBy: 'U-002', createdAt: new Date('2026-03-31 11:00') },
      { id: 'BR-008', scheduleId: 'BS-001', name: '全量备份-验证中', backupType: BackupType.FULL, scope: ['ALL'], storageType: StorageType.LOCAL, storagePath: '/backup/daily', fileName: 'backup_20260329_030000.tar.gz', fileSize: 1900, recordCount: 47000, duration: 170, status: BackupStatus.VERIFYING, startedAt: new Date('2026-03-29 03:00'), completedAt: new Date('2026-03-29 03:02:50'), createdBy: 'system', createdAt: new Date('2026-03-29 03:00') },
    ]
    setRecords(mockRecords)
    setLoading(false)
  }

  const fetchRestores = async () => {
    const mockRestores = [
      { id: 'RR-001', backupId: 'BR-004', backupName: '全量备份-2026-03-30', scope: ['CRM'], overwrite: true, status: RestoreStatus.COMPLETED, progress: 100, startedAt: new Date('2026-03-31 08:00'), completedAt: new Date('2026-03-31 08:05'), restoredBy: 'U-003', createdAt: new Date('2026-03-31 08:00') },
      { id: 'RR-002', backupId: 'BR-003', backupName: '财务备份-2026-03-31', scope: ['Finance'], overwrite: false, status: RestoreStatus.COMPLETED, progress: 100, startedAt: new Date('2026-03-31 09:00'), completedAt: new Date('2026-03-31 09:02'), restoredBy: 'U-004', createdAt: new Date('2026-03-31 09:00') },
      { id: 'RR-003', backupId: 'BR-005', backupName: '手动备份-CRM客户数据', scope: ['CRM'], overwrite: true, status: RestoreStatus.RUNNING, progress: 60, startedAt: new Date('2026-03-31 14:00'), restoredBy: 'U-001', createdAt: new Date('2026-03-31 14:00') },
      { id: 'RR-004', backupId: 'BR-007', backupName: '手动备份-失败', scope: ['ALL'], overwrite: false, status: RestoreStatus.FAILED, progress: 0, errorMessage: '备份文件损坏', startedAt: new Date('2026-03-31 12:00'), restoredBy: 'U-002', createdAt: new Date('2026-03-31 12:00') },
    ]
    setRestores(mockRestores)
  }

  const fetchStorages = async () => {
    const mockStorages = [
      { id: 'ST-001', name: '本地存储', storageType: StorageType.LOCAL, config: { path: '/backup' }, totalSize: 500, usedSize: 150, availableSize: 350, backupCount: 30, status: 'ONLINE', lastCheckTime: new Date(), createdAt: new Date('2026-01-01') },
      { id: 'ST-002', name: 'AWS S3存储', storageType: StorageType.S3, config: { endpoint: 'https://s3.amazonaws.com', bucket: 'daoda-backup' }, totalSize: 1000, usedSize: 50, availableSize: 950, backupCount: 12, status: 'ONLINE', lastCheckTime: new Date(), createdAt: new Date('2026-02-01') },
      { id: 'ST-003', name: 'NAS存储', storageType: StorageType.NAS, config: { path: '/nas/backup' }, totalSize: 2000, usedSize: 200, availableSize: 1800, backupCount: 15, status: 'ONLINE', lastCheckTime: new Date(), createdAt: new Date('2026-02-15') },
      { id: 'ST-004', name: '云存储', storageType: StorageType.CLOUD, config: { endpoint: 'https://cloud.storage.com' }, totalSize: 500, usedSize: 0, availableSize: 500, backupCount: 0, status: 'OFFLINE', lastCheckTime: new Date(), createdAt: new Date('2026-03-01') },
    ]
    setStorages(mockStorages)
  }

  const fetchStats = async () => {
    setStats({ totalBackups: 8, completedBackups: 6, failedBackups: 1, pendingBackups: 1, totalSize: 2500, totalRecords: 100000, activeSchedules: 5, storageUsed: 400, storageAvailable: 2300 })
  }

  const getBackupTypeTag = (type: BackupType) => {
    const config: Record<BackupType, { color: string; text: string }> = {
      FULL: { color: 'blue', text: '全量' },
      INCREMENTAL: { color: 'green', text: '增量' },
      DIFFERENTIAL: { color: 'cyan', text: '差异' },
      SCHEMA: { color: 'purple', text: '结构' },
      DATA: { color: 'orange', text: '数据' },
    }
    return <Tag color={config[type]?.color || 'default'}>{config[type]?.text || type}</Tag>
  }

  const getBackupStatusTag = (status: BackupStatus) => {
    const config: Record<BackupStatus, { color: string; icon: any; text: string }> = {
      PENDING: { color: 'default', icon: <ClockCircleOutlined />, text: '待执行' },
      RUNNING: { color: 'processing', icon: <SyncOutlined spin />, text: '执行中' },
      COMPLETED: { color: 'success', icon: <CheckCircleOutlined />, text: '完成' },
      FAILED: { color: 'error', icon: <CloseCircleOutlined />, text: '失败' },
      CANCELLED: { color: 'default', icon: <StopOutlined />, text: '已取消' },
      VERIFYING: { color: 'warning', icon: <SyncOutlined spin />, text: '验证中' },
      VERIFIED: { color: 'success', icon: <VerifiedOutlined />, text: '已验证' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getRestoreStatusTag = (status: RestoreStatus) => {
    const config: Record<RestoreStatus, { color: string; icon: any; text: string }> = {
      PENDING: { color: 'default', icon: <ClockCircleOutlined />, text: '待恢复' },
      RUNNING: { color: 'processing', icon: <SyncOutlined spin />, text: '恢复中' },
      COMPLETED: { color: 'success', icon: <CheckCircleOutlined />, text: '完成' },
      FAILED: { color: 'error', icon: <CloseCircleOutlined />, text: '失败' },
      ROLLBACK: { color: 'warning', icon: <ExclamationCircleOutlined />, text: '已回滚' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getStorageTypeTag = (type: StorageType) => {
    const config: Record<StorageType, { color: string; icon: any; text: string }> = {
      LOCAL: { color: 'blue', icon: <DatabaseOutlined />, text: '本地' },
      S3: { color: 'cyan', icon: <CloudUploadOutlined />, text: 'S3' },
      FTP: { color: 'green', icon: <CloudUploadOutlined />, text: 'FTP' },
      NAS: { color: 'purple', icon: <DatabaseOutlined />, text: 'NAS' },
      CLOUD: { color: 'orange', icon: <CloudUploadOutlined />, text: '云' },
    }
    const c = config[type]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const handleCreateBackup = () => message.info('创建备份任务...')
  const handleRestore = (id: string) => message.info('启动恢复任务...')
  const handleVerify = (id: string) => message.info('开始验证备份...')
  const handleDownload = (id: string) => message.success('下载链接已生成')
  const handleDelete = (id: string) => message.success('备份已删除')
  const handleCancelBackup = (id: string) => message.warning('备份已取消')
  const handleToggleSchedule = (id: string, enabled: boolean) => message.success(enabled ? '计划已启用' : '计划已禁用')

  const scheduleColumns: ColumnsType<any> = [
    { title: '计划ID', dataIndex: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', width: 150 },
    { title: '备份类型', dataIndex: 'backupType', width: 80, render: (type: BackupType) => getBackupTypeTag(type) },
    { title: '范围', dataIndex: 'scope', width: 80, render: (scope: string[]) => scope.map(s => <Tag key={s}>{s}</Tag>) },
    { title: '存储', dataIndex: 'storageType', width: 80, render: (type: StorageType) => getStorageTypeTag(type) },
    { title: '频率', dataIndex: 'schedule', width: 100, render: (s: any) => <Tag color="blue">{s.frequency}</Tag> },
    { title: '保留天数', dataIndex: 'retentionDays', width: 80 },
    { title: '下次执行', dataIndex: 'nextRunTime', width: 100, render: (time: Date) => time ? dayjs(time).format('MM-DD HH:mm') : '-' },
    { title: '状态', dataIndex: 'enabled', width: 80, render: (enabled: boolean) => <Switch checked={enabled} onChange={(val) => handleToggleSchedule('', val)} /> },
    { title: '操作', key: 'action', width: 80, render: (_, record) => (
      <Button type="link" size="small" icon={<SettingOutlined />}>配置</Button>
    )},
  ]

  const recordColumns: ColumnsType<any> = [
    { title: '备份ID', dataIndex: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', width: 150, ellipsis: true },
    { title: '类型', dataIndex: 'backupType', width: 80, render: (type: BackupType) => getBackupTypeTag(type) },
    { title: '范围', dataIndex: 'scope', width: 80, render: (scope: string[]) => scope[0] },
    { title: '存储', dataIndex: 'storageType', width: 80, render: (type: StorageType) => getStorageTypeTag(type) },
    { title: '文件大小', dataIndex: 'fileSize', width: 80, render: (size: number) => `${size}MB` },
    { title: '记录数', dataIndex: 'recordCount', width: 80, render: (count: number) => count || 0 },
    { title: '耗时', dataIndex: 'duration', width: 60, render: (d: number) => `${d}s` },
    { title: '状态', dataIndex: 'status', width: 100, render: (status: BackupStatus) => getBackupStatusTag(status) },
    { title: '验证', dataIndex: 'verifyStatus', width: 80, render: (v: string) => v ? <Tag color={v === 'PASS' ? 'success' : 'error'}>{v === 'PASS' ? '通过' : '失败'}</Tag> : '-' },
    { title: '时间', dataIndex: 'startedAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '操作', key: 'action', width: 150, render: (_, record) => (
      <Space>
        {record.status === BackupStatus.COMPLETED && (
          <Space>
            <Button type="link" size="small" icon={<CloudDownloadOutlined />} onClick={() => handleDownload(record.id)}>下载</Button>
            <Popconfirm title="确认恢复此备份？" onConfirm={() => handleRestore(record.id)}>
              <Button type="link" size="small" icon={<SyncOutlined />}>恢复</Button>
            </Popconfirm>
          </Space>
        )}
        {record.status === BackupStatus.COMPLETED && !record.verifyStatus && (
          <Button type="link" size="small" icon={<VerifiedOutlined />} onClick={() => handleVerify(record.id)}>验证</Button>
        )}
        {(record.status === BackupStatus.PENDING || record.status === BackupStatus.RUNNING) && (
          <Popconfirm title="确认取消备份？" onConfirm={() => handleCancelBackup(record.id)}>
            <Button type="link" size="small" icon={<StopOutlined />}>取消</Button>
          </Popconfirm>
        )}
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedRecord(record); setDetailModalVisible(true) }}>详情</Button>
      </Space>
    )},
  ]

  const restoreColumns: ColumnsType<any> = [
    { title: '恢复ID', dataIndex: 'id', width: 80 },
    { title: '备份名称', dataIndex: 'backupName', width: 150, ellipsis: true },
    { title: '范围', dataIndex: 'scope', width: 80, render: (scope: string[]) => scope[0] },
    { title: '覆盖', dataIndex: 'overwrite', width: 60, render: (v: boolean) => v ? <Tag color="warning">覆盖</Tag> : <Tag color="blue">追加</Tag> },
    { title: '状态', dataIndex: 'status', width: 100, render: (status: RestoreStatus) => getRestoreStatusTag(status) },
    { title: '进度', dataIndex: 'progress', width: 100, render: (p: number, record: any) => record.status === RestoreStatus.RUNNING ? <Progress percent={p} size="small" /> : `${p}%` },
    { title: '执行人', dataIndex: 'restoredBy', width: 80 },
    { title: '开始时间', dataIndex: 'startedAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '完成时间', dataIndex: 'completedAt', width: 100, render: (time: Date) => time ? dayjs(time).format('MM-DD HH:mm') : '-' },
  ]

  const storageColumns: ColumnsType<any> = [
    { title: '存储ID', dataIndex: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', width: 120 },
    { title: '类型', dataIndex: 'storageType', width: 80, render: (type: StorageType) => getStorageTypeTag(type) },
    { title: '总容量', dataIndex: 'totalSize', width: 80, render: (size: number) => `${size}GB` },
    { title: '已用', dataIndex: 'usedSize', width: 80, render: (size: number) => `${size}GB` },
    { title: '可用', dataIndex: 'availableSize', width: 80, render: (size: number) => `${size}GB` },
    { title: '使用率', width: 100, render: (_, record) => <Progress percent={Math.round(record.usedSize / record.totalSize * 100)} size="small" /> },
    { title: '备份数', dataIndex: 'backupCount', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80, render: (status: string) => <Tag color={status === 'ONLINE' ? 'success' : 'error'}>{status}</Tag> },
    { title: '操作', key: 'action', width: 80, render: () => <Button type="link" size="small" icon={<SettingOutlined />}>配置</Button> },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <DatabaseOutlined style={{ marginRight: 8 }} />
            数据备份恢复
          </Title>
          <Text type="secondary">定时备份、一键恢复、备份下载、备份管理</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<PlayCircleOutlined />} style={{ marginRight: 8 }}>立即备份</Button>
          <Button icon={<SettingOutlined />} style={{ marginRight: 8 }}>存储配置</Button>
          <Button icon={<SafetyOutlined />}>备份策略</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">总备份</Text>} value={stats.totalBackups} prefix={<DatabaseOutlined style={{ color: '#1890ff' }} />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">已完成</Text>} value={stats.completedBackups} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">执行中</Text>} value={stats.pendingBackups} prefix={<SyncOutlined spin style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">失败</Text>} value={stats.failedBackups} prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">存储已用</Text>} value={stats.storageUsed} suffix="GB" prefix={<DatabaseOutlined style={{ color: '#722ed1' }} />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">活跃计划</Text>} value={stats.activeSchedules} prefix={<ScheduleOutlined style={{ color: '#13c2c2' }} />} valueStyle={{ color: '#13c2c2' }} />
          </Card>
        </Col>
      </Row>

      {/* 备份列表 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="备份记录" key="records">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="备份类型" style={{ width: 120 }} allowClear>
                <Option value="FULL">全量备份</Option>
                <Option value="INCREMENTAL">增量备份</Option>
                <Option value="DATA">数据备份</Option>
              </Select>
              <Select placeholder="状态" style={{ width: 120 }} allowClear>
                <Option value="COMPLETED">完成</Option>
                <Option value="FAILED">失败</Option>
                <Option value="RUNNING">执行中</Option>
              </Select>
              <RangePicker />
              <Button icon={<PlayCircleOutlined />}>立即备份</Button>
            </Space>
            <Table columns={recordColumns} dataSource={records} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
          </Card>
        </TabPane>
        <TabPane tab="备份计划" key="schedules">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="计划状态" style={{ width: 120 }} allowClear>
                <Option value="true">已启用</Option>
                <Option value="false">已禁用</Option>
              </Select>
              <Button icon={<ScheduleOutlined />}>新建计划</Button>
            </Space>
            <Table columns={scheduleColumns} dataSource={schedules} rowKey="id" pagination={false} />
          </Card>
        </TabPane>
        <TabPane tab="恢复记录" key="restores">
          <Card className="daoda-card">
            <Table columns={restoreColumns} dataSource={restores} rowKey="id" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
        <TabPane tab="存储管理" key="storages">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<DatabaseOutlined />}>添加存储</Button>
            </Space>
            <Table columns={storageColumns} dataSource={storages} rowKey="id" pagination={false} />
          </Card>
        </TabPane>
      </Tabs>

      {/* 备份详情弹窗 */}
      <Modal title="备份详情" open={detailModalVisible} onCancel={() => setDetailModalVisible(false)} footer={null} width={700}>
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="备份ID">{selectedRecord.id}</Descriptions.Item>
            <Descriptions.Item label="名称">{selectedRecord.name}</Descriptions.Item>
            <Descriptions.Item label="类型">{getBackupTypeTag(selectedRecord.backupType)}</Descriptions.Item>
            <Descriptions.Item label="范围">{selectedRecord.scope.join(',')}</Descriptions.Item>
            <Descriptions.Item label="存储">{getStorageTypeTag(selectedRecord.storageType)}</Descriptions.Item>
            <Descriptions.Item label="路径">{selectedRecord.storagePath}</Descriptions.Item>
            <Descriptions.Item label="文件名">{selectedRecord.fileName}</Descriptions.Item>
            <Descriptions.Item label="文件大小">{selectedRecord.fileSize}MB</Descriptions.Item>
            <Descriptions.Item label="记录数">{selectedRecord.recordCount}</Descriptions.Item>
            <Descriptions.Item label="耗时">{selectedRecord.duration}s</Descriptions.Item>
            <Descriptions.Item label="状态">{getBackupStatusTag(selectedRecord.status)}</Descriptions.Item>
            <Descriptions.Item label="验证状态">{selectedRecord.verifyStatus || '-'}</Descriptions.Item>
            <Descriptions.Item label="校验码"><Text code>{selectedRecord.checksum || '-'}</Text></Descriptions.Item>
            <Descriptions.Item label="开始时间">{dayjs(selectedRecord.startedAt).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="完成时间">{selectedRecord.completedAt ? dayjs(selectedRecord.completedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
            <Descriptions.Item label="创建者">{selectedRecord.createdBy || '-'}</Descriptions.Item>
            {selectedRecord.errorMessage && <Descriptions.Item label="错误信息" span={2}><Text type="danger">{selectedRecord.errorMessage}</Text></Descriptions.Item>}
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}