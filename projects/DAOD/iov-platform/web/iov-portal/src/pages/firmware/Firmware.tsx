/**
 * OTA 升级管理页面
 * 
 * @description 对应后端 OtaService 接口
 * - uploadFirmware: 上传固件
 * - getFirmwareList: 获取固件列表
 * - createTask: 创建升级任务
 * - getTaskList: 获取任务列表
 * - getTaskDetail: 获取任务详情
 * - getProgress: 获取任务进度
 * - cancelTask: 取消任务
 */
import { useState, useEffect } from 'react'
import { Card, Table, Tabs, Button, Space, Modal, Form, Input, Select, Upload, Tag, Popconfirm, message, Progress, Descriptions, Badge, Transfer, Statistic, Row, Col } from 'antd'
import { PlusOutlined, UploadOutlined, DeleteOutlined, EyeOutlined, CloseOutlined } from '@ant-design/icons'
import type { TransferProps } from 'antd'

const { TextArea } = Input

// 固件信息 - 对应后端 FirmwareInfo
interface FirmwareInfo {
  id: string
  version: string
  name: string
  deviceModel: string
  fileSize: number
  checksum: string
  description?: string
  createTime: string
  status: 'active' | 'inactive'
}

// OTA 任务 - 对应后端 OtaTask
interface OtaTask {
  id: string
  firmwareId: string
  firmwareVersion: string
  deviceModel: string
  status: 'PENDING' | 'DOWNLOADING' | 'INSTALLING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  totalCount: number
  successCount: number
  failedCount: number
  progress: number
  createTime: string
  startTime?: string
  endTime?: string
  tenantId: string
}

// OTA 进度 - 对应后端 OtaProgress
interface OtaProgress {
  taskId: string
  progress: number
  completedCount: number
  totalCount: number
  currentDevice?: string
}

export default function Firmware() {
  const [firmwares, setFirmwares] = useState<FirmwareInfo[]>([])
  const [tasks, setTasks] = useState<OtaTask[]>([])
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false)
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<OtaTask | null>(null)
  const [selectedFirmware, setSelectedFirmware] = useState<FirmwareInfo | null>(null)
  const [form] = Form.useForm()
  const [taskForm] = Form.useForm()
  
  // 选中的设备（用于创建任务时的设备选择）
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  
  // 模拟数据
  useEffect(() => {
    setFirmwares([
      { id: 'F001', version: '1.2.0', name: 'TBOX主控固件', deviceModel: 'DAOD-TBOX-001', fileSize: 2048000, checksum: 'a1b2c3d4e5f6', description: '修复GPS定位精度问题', createTime: '2026-03-25 10:00:00', status: 'active' },
      { id: 'F002', version: '1.1.5', name: 'TBOX主控固件', deviceModel: 'DAOD-TBOX-001', fileSize: 2040000, checksum: 'f6e5d4c3b2a1', description: '优化通信稳定性', createTime: '2026-03-20 10:00:00', status: 'active' },
      { id: 'F003', version: '2.0.0', name: 'TBOX Pro固件', deviceModel: 'DAOD-TBOX-002', fileSize: 3072000, checksum: '112233445566', description: '新版本发布', createTime: '2026-03-22 10:00:00', status: 'active' },
    ])
    
    setTasks([
      { id: 'T001', firmwareId: 'F001', firmwareVersion: '1.2.0', deviceModel: 'DAOD-TBOX-001', status: 'INSTALLING', totalCount: 50, successCount: 35, failedCount: 2, progress: 70, createTime: '2026-03-25 14:00:00', startTime: '2026-03-25 14:05:00', tenantId: 'default' },
      { id: 'T002', firmwareId: 'F002', firmwareVersion: '1.1.5', deviceModel: 'DAOD-TBOX-001', status: 'SUCCESS', totalCount: 30, successCount: 30, failedCount: 0, progress: 100, createTime: '2026-03-24 10:00:00', startTime: '2026-03-24 10:10:00', endTime: '2026-03-24 12:30:00', tenantId: 'default' },
      { id: 'T003', firmwareId: 'F003', firmwareVersion: '2.0.0', deviceModel: 'DAOD-TBOX-002', status: 'PENDING', totalCount: 10, successCount: 0, failedCount: 0, progress: 0, createTime: '2026-03-25 18:00:00', tenantId: 'default' },
    ])
  }, [])
  
  // 上传固件
  const handleUpload = (values: any) => {
    const newFirmware: FirmwareInfo = {
      id: `F${Date.now()}`,
      version: values.version,
      name: values.name,
      deviceModel: values.deviceModel,
      fileSize: 2048000,
      checksum: Math.random().toString(36).substring(7),
      description: values.description,
      createTime: new Date().toLocaleString(),
      status: 'active',
    }
    setFirmwares([...firmwares, newFirmware])
    message.success('固件上传成功')
    setUploadModalOpen(false)
    form.resetFields()
  }
  
  // 创建升级任务
  const handleCreateTask = (values: any) => {
    const firmware = firmwares.find(f => f.id === values.firmwareId)
    if (!firmware) return
    
    const newTask: OtaTask = {
      id: `T${Date.now()}`,
      firmwareId: firmware.id,
      firmwareVersion: firmware.version,
      deviceModel: firmware.deviceModel,
      status: 'PENDING',
      totalCount: selectedDevices.length,
      successCount: 0,
      failedCount: 0,
      progress: 0,
      createTime: new Date().toLocaleString(),
      tenantId: 'default',
    }
    setTasks([newTask, ...tasks])
    message.success('升级任务创建成功')
    setCreateTaskModalOpen(false)
    taskForm.resetFields()
    setSelectedDevices([])
  }
  
  // 取消任务
  const handleCancelTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'CANCELLED' } : t))
    message.success('任务已取消')
  }
  
  // 删除固件
  const handleDeleteFirmware = (id: string) => {
    setFirmwares(firmwares.filter(f => f.id !== id))
    message.success('删除成功')
  }
  
  // 固件表格列
  const firmwareColumns = [
    { title: '固件名称', dataIndex: 'name', key: 'name' },
    { title: '版本号', dataIndex: 'version', key: 'version', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '设备型号', dataIndex: 'deviceModel', key: 'deviceModel' },
    { 
      title: '文件大小', 
      dataIndex: 'fileSize', 
      key: 'fileSize',
      render: (size: number) => `${(size / 1024).toFixed(2)} KB`
    },
    { title: '校验码', dataIndex: 'checksum', key: 'checksum' },
    { title: '上传时间', dataIndex: 'createTime', key: 'createTime' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={status === 'active' ? 'success' : 'default'}>{status === 'active' ? '有效' : '禁用'}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FirmwareInfo) => (
        <Space>
          <Button type="link" size="small" onClick={() => { setSelectedFirmware(record); setCreateTaskModalOpen(true); }}>创建任务</Button>
          <Button type="link" size="small">下载</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDeleteFirmware(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  
  // 任务表格列
  const taskColumns = [
    { title: '任务ID', dataIndex: 'id', key: 'id' },
    { title: '固件版本', dataIndex: 'firmwareVersion', key: 'firmwareVersion' },
    { title: '设备型号', dataIndex: 'deviceModel', key: 'deviceModel' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          PENDING: { color: 'default', text: '待执行' },
          DOWNLOADING: { color: 'processing', text: '下载中' },
          INSTALLING: { color: 'processing', text: '安装中' },
          SUCCESS: { color: 'success', text: '成功' },
          FAILED: { color: 'error', text: '失败' },
          CANCELLED: { color: 'default', text: '已取消' },
        }
        return <Tag color={config[status]?.color}>{config[status]?.text}</Tag>
      }
    },
    { 
      title: '进度', 
      key: 'progress',
      render: (_: any, record: OtaTask) => (
        <div style={{ width: 150 }}>
          <Progress percent={record.progress} size="small" status={record.status === 'FAILED' ? 'exception' : record.progress === 100 ? 'success' : 'active'} />
          <span style={{ fontSize: 12, color: '#999' }}>{record.successCount}/{record.totalCount}</span>
        </div>
      )
    },
    { title: '成功/失败', render: (_: any, r: OtaTask) => <span><span style={{ color: '#52c41a' }}>{r.successCount}</span> / <span style={{ color: '#ff4d4f' }}>{r.failedCount}</span></span> },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: OtaTask) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedTask(record); setTaskDetailModalOpen(true); }}>详情</Button>
          {(record.status === 'PENDING' || record.status === 'DOWNLOADING') && (
            <Popconfirm title="确定取消任务？" onConfirm={() => handleCancelTask(record.id)}>
              <Button type="link" size="small" danger icon={<CloseOutlined />}>取消</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]
  
  // 可选设备列表
  const mockDevices = [
    { key: '13800001111', title: '13800001111 (川A12345)' },
    { key: '13800002222', title: '13800002222 (川B67890)' },
    { key: '13800003333', title: '13800003333 (川C11111)' },
    { key: '13800004444', title: '13800004444 (川D22222)' },
    { key: '13800005555', title: '13800005555 (川E33333)' },
  ]
  
  return (
    <div className="firmware-page">
      <Card>
        <Tabs
          items={[
            {
              key: 'firmware',
              label: '固件管理',
              children: (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModalOpen(true)}>上传固件</Button>
                  </div>
                  <Table columns={firmwareColumns} dataSource={firmwares} rowKey="id" />
                </>
              ),
            },
            {
              key: 'tasks',
              label: <Badge count={tasks.filter(t => t.status === 'PENDING').length} offset={[10, 0]}>升级任务</Badge>,
              children: (
                <>
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={4}><Card size="small"><Statistic title="总任务" value={tasks.length} /></Card></Col>
                    <Col span={4}><Card size="small"><Statistic title="执行中" value={tasks.filter(t => ['DOWNLOADING', 'INSTALLING'].includes(t.status)).length} valueStyle={{ color: '#1890ff' }} /></Card></Col>
                    <Col span={4}><Card size="small"><Statistic title="成功" value={tasks.filter(t => t.status === 'SUCCESS').length} valueStyle={{ color: '#52c41a' }} /></Card></Col>
                    <Col span={4}><Card size="small"><Statistic title="失败" value={tasks.filter(t => t.status === 'FAILED').length} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
                  </Row>
                  <Table columns={taskColumns} dataSource={tasks} rowKey="id" />
                </>
              ),
            },
          ]}
        />
      </Card>
      
      {/* 上传固件弹窗 */}
      <Modal
        title="上传固件"
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item name="name" label="固件名称" rules={[{ required: true }]}>
            <Input placeholder="请输入固件名称" />
          </Form.Item>
          <Form.Item name="version" label="版本号" rules={[{ required: true }]}>
            <Input placeholder="例如: 1.0.0" />
          </Form.Item>
          <Form.Item name="deviceModel" label="适用设备型号" rules={[{ required: true }]}>
            <Select placeholder="请选择设备型号" options={[
              { label: 'DAOD-TBOX-001', value: 'DAOD-TBOX-001' },
              { label: 'DAOD-TBOX-002', value: 'DAOD-TBOX-002' },
            ]} />
          </Form.Item>
          <Form.Item name="file" label="固件文件" rules={[{ required: true }]}>
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="description" label="更新说明">
            <TextArea rows={3} placeholder="请输入本次更新的内容说明" />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 创建升级任务弹窗 */}
      <Modal
        title="创建升级任务"
        open={createTaskModalOpen}
        onCancel={() => { setCreateTaskModalOpen(false); setSelectedDevices([]); }}
        onOk={() => taskForm.submit()}
        width={700}
      >
        <Form form={taskForm} layout="vertical" onFinish={handleCreateTask}>
          <Form.Item name="firmwareId" label="选择固件" rules={[{ required: true }]} initialValue={selectedFirmware?.id}>
            <Select placeholder="请选择固件" options={firmwares.map(f => ({
              label: `${f.name} v${f.version} (${f.deviceModel})`,
              value: f.id
            }))} />
          </Form.Item>
          
          <Form.Item label="选择升级设备" required>
            <Transfer
              dataSource={mockDevices}
              titles={['可选设备', '已选设备']}
              targetKeys={selectedDevices}
              onChange={(keys) => setSelectedDevices(keys as string[])}
              render={item => item.title}
              listStyle={{ width: 280, height: 300 }}
              showSearch
            />
          </Form.Item>
          
          <Form.Item name="strategy" label="升级策略" initialValue="immediate">
            <Select options={[
              { label: '立即升级', value: 'immediate' },
              { label: '定时升级', value: 'scheduled' },
            ]} />
          </Form.Item>
          
          <Form.Item name="autoRetry" label="失败重试" valuePropName="checked" initialValue={true}>
            <Select options={[
              { label: '自动重试', value: true },
              { label: '不重试', value: false },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 任务详情弹窗 */}
      <Modal
        title="任务详情"
        open={taskDetailModalOpen}
        onCancel={() => setTaskDetailModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedTask && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="任务ID">{selectedTask.id}</Descriptions.Item>
            <Descriptions.Item label="固件版本">{selectedTask.firmwareVersion}</Descriptions.Item>
            <Descriptions.Item label="设备型号">{selectedTask.deviceModel}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={selectedTask.status === 'SUCCESS' ? 'success' : selectedTask.status === 'FAILED' ? 'error' : 'processing'}>{selectedTask.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="设备总数">{selectedTask.totalCount}</Descriptions.Item>
            <Descriptions.Item label="成功/失败">{selectedTask.successCount} / {selectedTask.failedCount}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedTask.createTime}</Descriptions.Item>
            <Descriptions.Item label="开始时间">{selectedTask.startTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="完成时间">{selectedTask.endTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="进度" span={2}>
              <Progress percent={selectedTask.progress} status={selectedTask.status === 'FAILED' ? 'exception' : 'active'} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}