/**
 * 设备接入管理页面 (增强版)
 * 
 * @description TBOX终端设备接入、注册、绑定流程，支持三种协议 (JT/T 808、MQTT、HTTP)
 * 
 * 业务流程：
 * 1. 终端设备通过 JT/T 808 / MQTT / HTTP 协议连接平台
 * 2. 平台识别终端身份，显示在待绑定列表
 * 3. 管理员审核并绑定终端到车辆
 * 4. 绑定后终端才能正常上报数据
 * 
 * @author 渔晓白
 * @version 2.0.0
 */
import { useState, useEffect } from 'react'
import { 
  Card, Tabs, Table, Button, Space, Tag, Form, Input, Select, Modal, message, 
  Descriptions, Badge, Steps, Divider, Alert, Row, Col, Drawer, Typography, Tooltip
} from 'antd'
import { 
  LinkOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, 
  CarOutlined, LaptopOutlined, ApiOutlined, WifiOutlined, GlobalOutlined,
  EyeOutlined, DeleteOutlined, HistoryOutlined,
} from '@ant-design/icons'

import { useBindingStore } from '@/stores/bindingStore'
import BindingStats from '@/components/binding/BindingStats'
import BindingEventTimeline from '@/components/binding/BindingEventTimeline'
import type { 
  PendingTerminal, DeviceBinding, ProtocolType, BindingStatus,
  BindDeviceRequest 
} from '@/types/binding'
import { ProtocolConfig, BindingStatusConfig } from '@/types/binding'

const { TextArea } = Input
const { Text, Title } = Typography

export default function DeviceAccess() {
  // 状态
  const [bindModalOpen, setBindModalOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedTerminal, setSelectedTerminal] = useState<PendingTerminal | null>(null)
  const [selectedBinding, setSelectedBinding] = useState<DeviceBinding | null>(null)
  const [bindStep, setBindStep] = useState(0)
  const [form] = Form.useForm()
  
  // Store
  const {
    pendingTerminals,
    bindings,
    bindingEvents,
    statistics,
    pendingLoading,
    loading,
    eventsLoading,
    totalPending,
    fetchPendingTerminals,
    fetchBindings,
    fetchStatistics,
    fetchBindingEvents,
    bindDevice,
    unbindDevice,
  } = useBindingStore()
  
  // 初始化
  useEffect(() => {
    fetchPendingTerminals()
    fetchBindings()
    fetchStatistics()
  }, [])
  
  // 打开绑定弹窗
  const handleOpenBind = (terminal: PendingTerminal) => {
    setSelectedTerminal(terminal)
    setBindStep(0)
    form.resetFields()
    form.setFieldsValue({
      simNumber: terminal.terminalId,
      deviceModel: terminal.deviceModel,
    })
    setBindModalOpen(true)
  }
  
  // 执行绑定
  const handleBind = async () => {
    if (!selectedTerminal) return
    
    try {
      const values = await form.validateFields()
      
      const request: BindDeviceRequest = {
        terminalId: selectedTerminal.terminalId,
        vin: values.vin,
        vehicleNo: values.vehicleNo,
        deviceModel: values.deviceModel || selectedTerminal.deviceModel,
        simNumber: values.simNumber,
        installLocation: values.installLocation,
        remark: values.remark,
      }
      
      const success = await bindDevice(selectedTerminal.terminalId, request)
      
      if (success) {
        message.success('设备绑定成功！终端已与车辆关联。')
        setBindModalOpen(false)
      } else {
        message.error('绑定失败，请重试')
      }
    } catch (error) {
      console.error('绑定失败:', error)
    }
  }
  
  // 解绑设备
  const handleUnbind = async (binding: DeviceBinding) => {
    Modal.confirm({
      title: '确认解绑',
      content: `确定要解绑终端 ${binding.deviceId} 与车辆 ${binding.vin} 的绑定关系吗？`,
      okText: '确认解绑',
      cancelText: '取消',
      onOk: async () => {
        const success = await unbindDevice(binding.bindingId, '管理员手动解绑')
        if (success) {
          message.success('解绑成功')
        } else {
          message.error('解绑失败')
        }
      },
    })
  }
  
  // 查看绑定详情
  const handleViewDetail = (binding: DeviceBinding) => {
    setSelectedBinding(binding)
    fetchBindingEvents(binding.bindingId)
    setDetailDrawerOpen(true)
  }
  
  // 待绑定终端列
  const pendingColumns = [
    { 
      title: '终端序列号', 
      dataIndex: 'terminalId', 
      key: 'terminalId',
      render: (text: string) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>
    },
    { title: 'ICCID', dataIndex: 'iccid', key: 'iccid' },
    { title: '设备型号', dataIndex: 'deviceModel', key: 'deviceModel' },
    { 
      title: '协议', 
      dataIndex: 'protocol', 
      key: 'protocol',
      render: (p: ProtocolType) => {
        const config = ProtocolConfig[p]
        const IconMap: Record<ProtocolType, React.ReactNode> = {
          JTT808: <WifiOutlined />,
          MQTT: <ApiOutlined />,
          HTTP: <GlobalOutlined />,
        }
        return (
          <Tag color={config?.color} icon={IconMap[p]}>
            {config?.label}
          </Tag>
        )
      }
    },
    { title: '固件版本', dataIndex: 'firmwareVersion', key: 'firmwareVersion' },
    { title: '连接IP', dataIndex: 'connectIp', key: 'connectIp' },
    { title: '首次连接', dataIndex: 'connectTime', key: 'connectTime', width: 160 },
    { title: '最后心跳', dataIndex: 'lastHeartbeat', key: 'lastHeartbeat', width: 160 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          pending: { color: 'processing', text: '待绑定', icon: <SyncOutlined spin /> },
          bound: { color: 'success', text: '已绑定', icon: <CheckCircleOutlined /> },
          rejected: { color: 'error', text: '已拒绝', icon: <CloseCircleOutlined /> },
        }
        const { color, text, icon } = config[status] || { color: 'default', text: status, icon: null }
        return <Tag color={color} icon={icon}>{text}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: PendingTerminal) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button type="primary" size="small" onClick={() => handleOpenBind(record)}>
                绑定车辆
              </Button>
              <Button size="small" danger>拒绝</Button>
            </>
          )}
          {record.status === 'bound' && (
            <Button type="link" size="small">查看详情</Button>
          )}
        </Space>
      ),
    },
  ]
  
  // 绑定记录列
  const bindColumns = [
    { title: '终端号', dataIndex: 'deviceId', key: 'deviceId' },
    { title: 'VIN码', dataIndex: 'vin', key: 'vin' },
    { 
      title: '协议', 
      dataIndex: 'protocol', 
      key: 'protocol',
      render: (p: ProtocolType) => {
        const config = ProtocolConfig[p]
        return <Tag color={config?.color}>{config?.label}</Tag>
      }
    },
    { title: '设备型号', dataIndex: 'deviceModel', key: 'deviceModel' },
    { title: 'SIM卡号', dataIndex: 'simNumber', key: 'simNumber' },
    { title: '绑定时间', dataIndex: 'bindTime', key: 'bindTime' },
    { 
      title: '最后确认', 
      dataIndex: 'lastConfirmTime', 
      key: 'lastConfirmTime',
      render: (time: string) => time || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: BindingStatus) => {
        const config = BindingStatusConfig[status]
        return <Badge status={config?.badge} text={config?.label} />
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DeviceBinding) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="解绑">
            <Button 
              type="link" 
              size="small" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => handleUnbind(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]
  
  return (
    <div className="device-access-page">
      {/* 流程说明 */}
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="TBOX 设备绑定流程"
        description={
          <Steps size="small" current={-1} items={[
            { title: '设备连接', description: '终端通过 JT/T 808 / MQTT / HTTP 协议连接平台' },
            { title: '身份识别', description: '平台识别终端序列号和SIM卡信息' },
            { title: '审核绑定', description: '管理员将终端绑定到指定车辆' },
            { title: '数据上报', description: '绑定后终端可正常上报位置和状态' },
          ]} />
        }
      />
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <BindingStats statistics={statistics} loading={loading} />
        </Col>
      </Row>
      
      <Card>
        <Tabs
          items={[
            {
              key: 'pending',
              label: <><Badge count={totalPending} offset={[10, 0]}><span>待绑定终端</span></Badge></>,
              children: (
                <Table 
                  columns={pendingColumns} 
                  dataSource={pendingTerminals.filter(d => d.status === 'pending')}
                  rowKey="id"
                  loading={pendingLoading}
                  scroll={{ x: 1400 }}
                />
              ),
            },
            {
              key: 'connected',
              label: '已连接终端',
              children: (
                <Table 
                  columns={pendingColumns} 
                  dataSource={pendingTerminals}
                  rowKey="id"
                  loading={pendingLoading}
                  scroll={{ x: 1400 }}
                />
              ),
            },
            {
              key: 'bound',
              label: '绑定记录',
              children: (
                <Table 
                  columns={bindColumns} 
                  dataSource={bindings}
                  rowKey="bindingId"
                  loading={loading}
                />
              ),
            },
          ]}
        />
      </Card>
      
      {/* 绑定车辆弹窗 */}
      <Modal
        title="绑定终端到车辆"
        open={bindModalOpen}
        onCancel={() => setBindModalOpen(false)}
        onOk={handleBind}
        width={700}
        okText="确认绑定"
      >
        <Steps
          current={bindStep}
          size="small"
          style={{ marginBottom: 24 }}
          items={[
            { title: '终端信息' },
            { title: '选择车辆' },
            { title: '绑定确认' },
          ]}
        />
        
        {/* Step 0: 终端信息 */}
        {bindStep === 0 && selectedTerminal && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="终端序列号">{selectedTerminal.terminalId}</Descriptions.Item>
            <Descriptions.Item label="ICCID">{selectedTerminal.iccid || '-'}</Descriptions.Item>
            <Descriptions.Item label="设备型号">{selectedTerminal.deviceModel}</Descriptions.Item>
            <Descriptions.Item label="接入协议">
              <Tag color={ProtocolConfig[selectedTerminal.protocol]?.color}>
                {ProtocolConfig[selectedTerminal.protocol]?.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="固件版本">{selectedTerminal.firmwareVersion || '-'}</Descriptions.Item>
            <Descriptions.Item label="连接IP">{selectedTerminal.connectIp || '-'}</Descriptions.Item>
            <Descriptions.Item label="首次连接时间" span={2}>{selectedTerminal.connectTime}</Descriptions.Item>
          </Descriptions>
        )}
        
        {/* Step 1: 选择车辆并填写绑定信息 */}
        {bindStep === 1 && (
          <Form form={form} layout="vertical">
            <Divider>车辆信息</Divider>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="vin" label="VIN码（车辆识别码）" rules={[
                  { required: true, message: '请输入VIN码' },
                  { len: 17, message: 'VIN码必须为17位' }
                ]}>
                  <Input placeholder="请输入17位VIN码" maxLength={17} style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="vehicleNo" label="车牌号" rules={[{ required: true, message: '请输入车牌号' }]}>
                  <Input placeholder="请输入车牌号，如：川A12345" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
            </Row>
            
            <Divider>设备信息</Divider>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="deviceModel" label="设备型号">
                  <Input placeholder="设备型号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="simNumber" label="SIM卡号">
                  <Input placeholder="SIM卡手机号" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="installLocation" label="安装位置">
                  <Select placeholder="请选择安装位置" options={[
                    { label: '驾驶位下方', value: '驾驶位下方' },
                    { label: '副驾驶位下方', value: '副驾驶位下方' },
                    { label: '后备箱', value: '后备箱' },
                    { label: '中控台', value: '中控台' },
                    { label: '其他', value: '其他' },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="remark" label="备注">
                  <Input placeholder="备注信息" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
        
        {/* Step 2: 确认绑定 */}
        {bindStep === 2 && (
          <div>
            <Alert type="warning" message="请确认以下绑定信息" style={{ marginBottom: 16 }} />
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="终端序列号">{selectedTerminal?.terminalId}</Descriptions.Item>
              <Descriptions.Item label="设备型号">{selectedTerminal?.deviceModel}</Descriptions.Item>
              <Descriptions.Item label="接入协议">
                <Tag color={ProtocolConfig[selectedTerminal?.protocol || 'JTT808']?.color}>
                  {ProtocolConfig[selectedTerminal?.protocol || 'JTT808']?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="VIN码">{form.getFieldValue('vin')}</Descriptions.Item>
              <Descriptions.Item label="车牌号">{form.getFieldValue('vehicleNo')}</Descriptions.Item>
              <Descriptions.Item label="SIM卡号">{form.getFieldValue('simNumber')}</Descriptions.Item>
              <Descriptions.Item label="安装位置">{form.getFieldValue('installLocation') || '-'}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
        
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Space>
            {bindStep > 0 && <Button onClick={() => setBindStep(bindStep - 1)}>上一步</Button>}
            {bindStep < 2 && <Button type="primary" onClick={() => setBindStep(bindStep + 1)}>下一步</Button>}
          </Space>
        </div>
      </Modal>
      
      {/* 绑定详情抽屉 */}
      <Drawer
        title={
          <Space>
            <HistoryOutlined />
            绑定详情与历史
          </Space>
        }
        placement="right"
        width={600}
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
      >
        {selectedBinding && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="终端号">{selectedBinding.deviceId}</Descriptions.Item>
              <Descriptions.Item label="VIN码">{selectedBinding.vin}</Descriptions.Item>
              <Descriptions.Item label="协议">
                <Tag color={ProtocolConfig[selectedBinding.protocol]?.color}>
                  {ProtocolConfig[selectedBinding.protocol]?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge 
                  status={BindingStatusConfig[selectedBinding.status]?.badge} 
                  text={BindingStatusConfig[selectedBinding.status]?.label} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="设备型号">{selectedBinding.deviceModel || '-'}</Descriptions.Item>
              <Descriptions.Item label="SIM卡号">{selectedBinding.simNumber || '-'}</Descriptions.Item>
              <Descriptions.Item label="绑定时间">{selectedBinding.bindTime}</Descriptions.Item>
              <Descriptions.Item label="最后确认">{selectedBinding.lastConfirmTime || '-'}</Descriptions.Item>
            </Descriptions>
            
            <Divider>事件历史</Divider>
            
            <BindingEventTimeline events={bindingEvents} loading={eventsLoading} />
          </>
        )}
      </Drawer>
    </div>
  )
}