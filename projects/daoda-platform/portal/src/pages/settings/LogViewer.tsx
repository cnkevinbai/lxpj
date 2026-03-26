/**
 * 日志查看器页面
 * 统一UI风格
 */
import { useState } from 'react'
import { Table, Card, Button, Space, Tag, Select, DatePicker, Input, Typography, Badge, Drawer, Descriptions } from 'antd'
import { SearchOutlined, ReloadOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

// 日志级别映射
const levelMap: Record<string, { color: string; text: string }> = {
  ERROR: { color: 'red', text: '错误' },
  WARN: { color: 'orange', text: '警告' },
  INFO: { color: 'blue', text: '信息' },
  DEBUG: { color: 'default', text: '调试' },
}

// 模拟日志数据
const mockLogs = [
  { id: '1', timestamp: '2024-03-19 10:30:45', level: 'ERROR', module: 'auth-service', message: '用户登录失败: 用户名或密码错误', userId: 'user001', ip: '192.168.1.100', traceId: 'trc-abc123' },
  { id: '2', timestamp: '2024-03-19 10:30:40', level: 'INFO', module: 'auth-service', message: '用户尝试登录: zhangsan@example.com', userId: null, ip: '192.168.1.100', traceId: 'trc-abc123' },
  { id: '3', timestamp: '2024-03-19 10:28:15', level: 'INFO', module: 'crm-service', message: '创建客户成功: 北京科技有限公司', userId: 'user002', ip: '192.168.1.101', traceId: 'trc-def456' },
  { id: '4', timestamp: '2024-03-19 10:25:30', level: 'WARN', module: 'erp-service', message: '库存预警: 产品PRD001库存不足，当前库存: 15', userId: 'system', ip: '-', traceId: 'trc-ghi789' },
  { id: '5', timestamp: '2024-03-19 10:20:00', level: 'INFO', module: 'workflow-service', message: '审批流程启动: 采购申请审批', userId: 'user003', ip: '192.168.1.102', traceId: 'trc-jkl012' },
  { id: '6', timestamp: '2024-03-19 10:15:22', level: 'ERROR', module: 'finance-service', message: '支付回调处理失败: 订单不存在', userId: 'system', ip: '-', traceId: 'trc-mno345' },
  { id: '7', timestamp: '2024-03-19 10:10:05', level: 'DEBUG', module: 'api-gateway', message: '请求路由: POST /api/v1/orders', userId: 'user001', ip: '192.168.1.100', traceId: 'trc-pqr678' },
  { id: '8', timestamp: '2024-03-19 10:05:00', level: 'INFO', module: 'system', message: '系统定时任务执行: 数据备份完成', userId: 'system', ip: '-', traceId: '-' },
]

interface LogEntry {
  id: string
  timestamp: string
  level: string
  module: string
  message: string
  userId: string | null
  ip: string
  traceId: string
}

export default function LogViewer() {
  const [logs] = useState<LogEntry[]>(mockLogs)
  const [filters, setFilters] = useState({
    keyword: '',
    level: undefined as string | undefined,
    module: undefined as string | undefined,
  })
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)

  // 表格列定义
  const columns: ColumnsType<LogEntry> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      width: 160,
    },
    {
      title: '级别',
      dataIndex: 'level',
      width: 80,
      render: (level: string) => {
        const config = levelMap[level]
        return <Tag color={config?.color}>{config?.text || level}</Tag>
      },
    },
    {
      title: '模块',
      dataIndex: 'module',
      width: 140,
      render: (module: string) => <Tag>{module}</Tag>,
    },
    {
      title: '日志内容',
      dataIndex: 'message',
      ellipsis: true,
    },
    {
      title: '用户',
      dataIndex: 'userId',
      width: 100,
      render: (userId: string | null) => userId || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <a onClick={() => { setSelectedLog(record); setDrawerVisible(true); }}>
          <EyeOutlined /> 详情
        </a>
      ),
    },
  ]

  // 过滤数据
  const filteredData = logs.filter(item => {
    if (filters.keyword && !item.message.includes(filters.keyword)) {
      return false
    }
    if (filters.level && item.level !== filters.level) {
      return false
    }
    if (filters.module && item.module !== filters.module) {
      return false
    }
    return true
  })

  // 统计
  const stats = {
    total: logs.length,
    error: logs.filter(l => l.level === 'ERROR').length,
    warn: logs.filter(l => l.level === 'WARN').length,
    info: logs.filter(l => l.level === 'INFO').length,
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">系统日志</Title>
        </div>
        <div className="page-header-actions">
          <Button icon={<ReloadOutlined />}>刷新</Button>
          <Button icon={<DownloadOutlined />}>导出日志</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ backgroundColor: '#f0f5ff', color: '#2f54eb' }}>
              <Text style={{ fontSize: 24 }}>📋</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">总日志数</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#2f54eb' }}>{stats.total}</Text>
              </div>
            </div>
          </div>
        </Card>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ backgroundColor: '#fff2f0', color: '#ff4d4f' }}>
              <Text style={{ fontSize: 24 }}>❌</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">错误</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#ff4d4f' }}>{stats.error}</Text>
              </div>
            </div>
          </div>
        </Card>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ backgroundColor: '#fffbe6', color: '#faad14' }}>
              <Text style={{ fontSize: 24 }}>⚠️</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">警告</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#faad14' }}>{stats.warn}</Text>
              </div>
            </div>
          </div>
        </Card>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
              <Text style={{ fontSize: 24 }}>ℹ️</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">信息</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#1890ff' }}>{stats.info}</Text>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 搜索筛选区 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Input
            placeholder="搜索日志内容"
            prefix={<SearchOutlined />}
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            style={{ width: 250 }}
          />
          <Select
            placeholder="日志级别"
            allowClear
            value={filters.level}
            onChange={(value) => setFilters({ ...filters, level: value })}
            style={{ width: 120 }}
            options={Object.entries(levelMap).map(([key, val]) => ({ value: key, label: val.text }))}
          />
          <Select
            placeholder="模块"
            allowClear
            value={filters.module}
            onChange={(value) => setFilters({ ...filters, module: value })}
            style={{ width: 150 }}
            options={[
              { value: 'auth-service', label: '认证服务' },
              { value: 'crm-service', label: 'CRM服务' },
              { value: 'erp-service', label: 'ERP服务' },
              { value: 'finance-service', label: '财务服务' },
              { value: 'workflow-service', label: '工作流服务' },
              { value: 'api-gateway', label: 'API网关' },
              { value: 'system', label: '系统' },
            ]}
          />
          <RangePicker showTime />
        </div>
      </Card>

      {/* 数据表格 */}
      <Card className="daoda-card">
        <Table
          className="daoda-table"
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 日志详情抽屉 */}
      <Drawer
        title="日志详情"
        placement="right"
        width={500}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedLog && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="时间">{selectedLog.timestamp}</Descriptions.Item>
            <Descriptions.Item label="级别">
              <Tag color={levelMap[selectedLog.level]?.color}>
                {levelMap[selectedLog.level]?.text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="模块">{selectedLog.module}</Descriptions.Item>
            <Descriptions.Item label="日志内容">
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {selectedLog.message}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="用户">{selectedLog.userId || '-'}</Descriptions.Item>
            <Descriptions.Item label="IP地址">{selectedLog.ip}</Descriptions.Item>
            <Descriptions.Item label="追踪ID">{selectedLog.traceId}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}