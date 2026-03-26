/**
 * 告警管理页面
 * 
 * @description 对应后端 AlarmService 接口
 * - createAlarm: 创建告警
 * - getAlarmList: 获取告警列表
 * - handleAlarm: 处理告警
 * - batchHandle: 批量处理告警
 * - ignoreAlarm: 忽略告警
 * - getStatistics: 获取告警统计
 */
import { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Space, Select, DatePicker, Modal, Descriptions, Form, Input, message, Badge, Row, Col, Statistic } from 'antd'
import { ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { RangePicker } = DatePicker
const { TextArea } = Input

// 告警信息 - 对应后端 AlarmInfo
interface AlarmInfo {
  id: string
  alarmType: string           // OVER_SPEED, LOW_BATTERY, GEO_FENCE_VIOLATION 等
  alarmLevel: string          // CRITICAL, MAJOR, MINOR, WARNING
  title: string
  content?: string
  vehicleId?: string
  terminalId: string
  vehicleNo?: string
  status: string              // PENDING, PROCESSING, RESOLVED, IGNORED
  latitude?: number
  longitude?: number
  address?: string
  occurTime: string
  handleTime?: string
  handler?: string
  handleNote?: string
  tenantId: string
}

// 告警统计 - 对应后端 AlarmStatistics
interface AlarmStatistics {
  totalAlarms: number
  pendingCount: number
  processingCount: number
  resolvedCount: number
  ignoredCount: number
  todayNew: number
  todayHandled: number
  criticalCount: number
  majorCount: number
  minorCount: number
  warningCount: number
}

export default function Alarms() {
  const [loading, setLoading] = useState(false)
  const [alarms, setAlarms] = useState<AlarmInfo[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [statistics, setStatistics] = useState<AlarmStatistics | null>(null)
  
  // 弹窗状态
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [handleModalOpen, setHandleModalOpen] = useState(false)
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmInfo | null>(null)
  const [form] = Form.useForm()
  
  // 模拟数据
  useEffect(() => {
    const mockAlarms: AlarmInfo[] = [
      { id: 'A001', alarmType: 'OVER_SPEED', alarmLevel: 'CRITICAL', title: '超速告警', terminalId: '13800001111', vehicleNo: '川A12345', status: 'PENDING', address: '成都市高新区天府大道', occurTime: '2026-03-25 18:05:32', tenantId: 'default' },
      { id: 'A002', alarmType: 'OFFLINE', alarmLevel: 'MAJOR', title: '离线告警', terminalId: '13800003333', vehicleNo: '川C11111', status: 'PROCESSING', address: '乐山市市中区', occurTime: '2026-03-25 09:30:00', handler: '管理员', tenantId: 'default' },
      { id: 'A003', alarmType: 'LOW_BATTERY', alarmLevel: 'WARNING', title: '低电量告警', terminalId: '13800002222', vehicleNo: '川B67890', status: 'RESOLVED', address: '眉山市东坡区', occurTime: '2026-03-25 08:15:00', handler: '管理员', handleTime: '2026-03-25 08:30:00', tenantId: 'default' },
      { id: 'A004', alarmType: 'GEO_FENCE_VIOLATION', alarmLevel: 'MAJOR', title: '围栏越界', terminalId: '13800005555', vehicleNo: '川E33333', status: 'PENDING', address: '成都市武侯区', occurTime: '2026-03-25 17:45:00', tenantId: 'default' },
      { id: 'A005', alarmType: 'EMERGENCY', alarmLevel: 'CRITICAL', title: '紧急报警', terminalId: '13800001111', vehicleNo: '川A12345', status: 'PENDING', address: '成都市锦江区', occurTime: '2026-03-25 19:00:00', tenantId: 'default' },
    ]
    setAlarms(mockAlarms)
    
    setStatistics({
      totalAlarms: 15,
      pendingCount: 3,
      processingCount: 1,
      resolvedCount: 10,
      ignoredCount: 1,
      todayNew: 5,
      todayHandled: 3,
      criticalCount: 2,
      majorCount: 5,
      minorCount: 3,
      warningCount: 5,
    })
  }, [])
  
  // 告警类型配置
  const alarmTypeConfig: Record<string, { text: string; color: string }> = {
    OVER_SPEED: { text: '超速告警', color: 'red' },
    LOW_BATTERY: { text: '低电量', color: 'orange' },
    GEO_FENCE_VIOLATION: { text: '围栏越界', color: 'purple' },
    DEVICE_FAULT: { text: '设备故障', color: 'cyan' },
    OFFLINE: { text: '离线告警', color: 'default' },
    EMERGENCY: { text: '紧急报警', color: 'magenta' },
  }
  
  // 告警级别配置 - 对应后端 AlarmLevel
  const alarmLevelConfig: Record<string, { text: string; color: string; priority: number }> = {
    CRITICAL: { text: '严重', color: 'error', priority: 1 },
    MAJOR: { text: '主要', color: 'warning', priority: 2 },
    MINOR: { text: '次要', color: 'processing', priority: 3 },
    WARNING: { text: '警告', color: 'default', priority: 4 },
  }
  
  // 告警状态配置 - 对应后端 AlarmStatus
  const alarmStatusConfig: Record<string, { text: string; color: string }> = {
    PENDING: { text: '待处理', color: 'error' },
    PROCESSING: { text: '处理中', color: 'warning' },
    RESOLVED: { text: '已解决', color: 'success' },
    IGNORED: { text: '已忽略', color: 'default' },
  }
  
  // 列定义
  const columns: ColumnsType<AlarmInfo> = [
    { 
      title: '告警ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: 80 
    },
    { 
      title: '告警类型', 
      dataIndex: 'alarmType', 
      key: 'alarmType', 
      width: 100,
      render: (type: string) => {
        const config = alarmTypeConfig[type] || { text: type, color: 'default' }
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    { 
      title: '告警级别', 
      dataIndex: 'alarmLevel', 
      key: 'alarmLevel', 
      width: 80,
      render: (level: string) => {
        const config = alarmLevelConfig[level] || { text: level, color: 'default' }
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    { 
      title: '告警标题', 
      dataIndex: 'title', 
      key: 'title', 
      width: 120,
      render: (title: string, record) => (
        <span style={{ color: record.alarmLevel === 'CRITICAL' ? '#ff4d4f' : undefined, fontWeight: record.alarmLevel === 'CRITICAL' ? 'bold' : undefined }}>
          {title}
        </span>
      )
    },
    { title: '终端号', dataIndex: 'terminalId', key: 'terminalId', width: 130 },
    { title: '车牌号', dataIndex: 'vehicleNo', key: 'vehicleNo', width: 100 },
    { title: '告警时间', dataIndex: 'occurTime', key: 'occurTime', width: 160 },
    { title: '位置', dataIndex: 'address', key: 'address', ellipsis: true },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 90,
      render: (status: string) => {
        const config = alarmStatusConfig[status] || { text: status, color: 'default' }
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => { setSelectedAlarm(record); setDetailModalOpen(true); }}>详情</Button>
          {record.status === 'PENDING' && (
            <>
              <Button type="link" size="small" onClick={() => { setSelectedAlarm(record); setHandleModalOpen(true); }}>处理</Button>
              <Button type="link" size="small" danger>忽略</Button>
            </>
          )}
        </Space>
      ),
    },
  ]
  
  // 批量处理告警
  const handleBatchHandle = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要处理的告警')
      return
    }
    Modal.confirm({
      title: '批量处理告警',
      icon: <ExclamationCircleOutlined />,
      content: `确定要处理选中的 ${selectedRowKeys.length} 条告警吗？`,
      onOk: () => {
        message.success(`已批量处理 ${selectedRowKeys.length} 条告警`)
        setSelectedRowKeys([])
      }
    })
  }
  
  // 处理告警
  const handleAlarmSubmit = (values: any) => {
    console.log('处理告警:', values)
    message.success('告警处理成功')
    setHandleModalOpen(false)
    form.resetFields()
  }
  
  return (
    <div className="alarms-page">
      {/* 统计卡片 */}
      {statistics && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={3}>
            <Card size="small"><Statistic title="总告警" value={statistics.totalAlarms} /></Card>
          </Col>
          <Col span={3}>
            <Card size="small"><Statistic title="待处理" value={statistics.pendingCount} valueStyle={{ color: '#ff4d4f' }} /></Card>
          </Col>
          <Col span={3}>
            <Card size="small"><Statistic title="处理中" value={statistics.processingCount} valueStyle={{ color: '#faad14' }} /></Card>
          </Col>
          <Col span={3}>
            <Card size="small"><Statistic title="已解决" value={statistics.resolvedCount} valueStyle={{ color: '#52c41a' }} /></Card>
          </Col>
          <Col span={3}>
            <Card size="small"><Statistic title="今日新增" value={statistics.todayNew} /></Card>
          </Col>
          <Col span={3}>
            <Card size="small"><Statistic title="严重" value={statistics.criticalCount} valueStyle={{ color: '#ff4d4f' }} /></Card>
          </Col>
          <Col span={3}>
            <Card size="small"><Statistic title="主要" value={statistics.majorCount} valueStyle={{ color: '#faad14' }} /></Card>
          </Col>
          <Col span={3}>
            <Card size="small"><Statistic title="警告" value={statistics.warningCount} valueStyle={{ color: '#1890ff' }} /></Card>
          </Col>
        </Row>
      )}
      
      <Card className="daoda-card" title="告警列表"
        extra={
          <Space>
            <Button type="primary" onClick={handleBatchHandle} disabled={selectedRowKeys.length === 0}>
              批量处理 ({selectedRowKeys.length})
            </Button>
          </Space>
        }
      >
        {/* 筛选栏 */}
        <Space style={{ marginBottom: 16 }} wrap>
          <Select placeholder="告警类型" style={{ width: 120 }} allowClear options={[
            { label: '超速告警', value: 'OVER_SPEED' },
            { label: '离线告警', value: 'OFFLINE' },
            { label: '低电量', value: 'LOW_BATTERY' },
            { label: '围栏越界', value: 'GEO_FENCE_VIOLATION' },
            { label: '紧急报警', value: 'EMERGENCY' },
          ]} />
          <Select placeholder="告警级别" style={{ width: 100 }} allowClear options={[
            { label: '严重', value: 'CRITICAL' },
            { label: '主要', value: 'MAJOR' },
            { label: '次要', value: 'MINOR' },
            { label: '警告', value: 'WARNING' },
          ]} />
          <Select placeholder="状态" style={{ width: 100 }} allowClear options={[
            { label: '待处理', value: 'PENDING' },
            { label: '处理中', value: 'PROCESSING' },
            { label: '已解决', value: 'RESOLVED' },
            { label: '已忽略', value: 'IGNORED' },
          ]} />
          <RangePicker />
          <Button type="primary">查询</Button>
        </Space>
        
        {/* 告警表格 */}
        <Table 
          columns={columns} 
          dataSource={alarms} 
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: (record) => ({
              disabled: record.status !== 'PENDING',
            }),
          }}
          pagination={{ showTotal: (t) => `共 ${t} 条` }} 
        />
      </Card>
      
      {/* 告警详情弹窗 */}
      <Modal
        title="告警详情"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          selectedAlarm?.status === 'PENDING' && <Button key="handle" type="primary" onClick={() => { setDetailModalOpen(false); setHandleModalOpen(true); }}>处理告警</Button>,
          <Button key="close" onClick={() => setDetailModalOpen(false)}>关闭</Button>,
        ]}
        width={600}
      >
        {selectedAlarm && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="告警ID">{selectedAlarm.id}</Descriptions.Item>
            <Descriptions.Item label="告警类型">
              <Tag color={alarmTypeConfig[selectedAlarm.alarmType]?.color}>{alarmTypeConfig[selectedAlarm.alarmType]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="告警级别">
              <Tag color={alarmLevelConfig[selectedAlarm.alarmLevel]?.color}>{alarmLevelConfig[selectedAlarm.alarmLevel]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={alarmStatusConfig[selectedAlarm.status]?.color}>{alarmStatusConfig[selectedAlarm.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="终端号">{selectedAlarm.terminalId}</Descriptions.Item>
            <Descriptions.Item label="车牌号">{selectedAlarm.vehicleNo}</Descriptions.Item>
            <Descriptions.Item label="告警时间">{selectedAlarm.occurTime}</Descriptions.Item>
            <Descriptions.Item label="处理时间">{selectedAlarm.handleTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="处理人">{selectedAlarm.handler || '-'}</Descriptions.Item>
            <Descriptions.Item label="位置" span={2}>{selectedAlarm.address}</Descriptions.Item>
            {selectedAlarm.handleNote && (
              <Descriptions.Item label="处理备注" span={2}>{selectedAlarm.handleNote}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
      
      {/* 处理告警弹窗 */}
      <Modal
        title="处理告警"
        open={handleModalOpen}
        onCancel={() => setHandleModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAlarmSubmit}>
          <Form.Item label="告警ID">
            <Input value={selectedAlarm?.id} disabled />
          </Form.Item>
          <Form.Item label="告警标题">
            <Input value={selectedAlarm?.title} disabled />
          </Form.Item>
          <Form.Item name="handler" label="处理人" rules={[{ required: true }]} initialValue="管理员">
            <Input />
          </Form.Item>
          <Form.Item name="handleNote" label="处理备注" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入处理说明" />
          </Form.Item>
          <Form.Item name="needFollow" label="是否需要跟进">
            <Select options={[
              { label: '否', value: false },
              { label: '是', value: true },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}