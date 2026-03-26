/**
 * 终端详情页
 */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tag, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Space, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { getTerminalDetail, sendCommand } from '@/services/terminal'
import type { Terminal } from '@/types'

const { Title, Text } = Typography
const { TextArea } = Input

export default function TerminalDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // 弹窗状态
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [paramsModalOpen, setParamsModalOpen] = useState(false)
  const [messageForm] = Form.useForm()
  const [paramsForm] = Form.useForm()
  
  // 获取终端详情
  const { data: terminal, isLoading } = useQuery({
    queryKey: ['terminal', id],
    queryFn: () => getTerminalDetail(id!),
    enabled: !!id,
  })
  
  if (isLoading) {
    return <Card loading />
  }
  
  // 模拟数据
  const mockTerminal: Terminal = {
    id: id || 'mock-id',
    terminalId: '13800001111',
    vehicleNo: '川A12345',
    deviceModel: 'DAOD-TBOX-001',
    status: 'online',
    signalStrength: 3,
    lastCommunicationTime: '2026-03-25 18:50:32',
    lastSeen: '2026-03-25 18:50:32',
    location: { lat: 30.123456, lng: 103.845678 },
    address: '成都市高新区天府大道',
    speed: 45,
    direction: 90,
    batteryLevel: 80,
    temperature: 35,
    mileage: 12345,
    soc: 75,
    registerTime: '2026-01-15 10:30:00',
    activateTime: '2026-01-15 10:35:00',
    createTime: '2026-01-15 10:30:00',
    updateTime: '2026-03-25 18:50:32',
  }
  
  const data = terminal || mockTerminal
  
  const statusConfig: Record<string, { color: string; text: string }> = {
    online: { color: 'success', text: '在线' },
    offline: { color: 'error', text: '离线' },
    sleep: { color: 'warning', text: '休眠' },
  }
  
  const statusInfo = statusConfig[data.status] || { color: 'default', text: data.status }
  
  // 方向转换
  const directionText = (deg: number) => {
    if (deg === undefined || deg === null) return '-'
    const dirs = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
    const idx = Math.round(deg / 45) % 8
    return `${deg}° (${dirs[idx]})`
  }
  
  // 发送文本消息
  const handleSendMessage = async (values: any) => {
    try {
      await sendCommand(data.id, 'text_message', values)
      message.success('消息发送成功')
      setMessageModalOpen(false)
      messageForm.resetFields()
    } catch (error) {
      message.error('消息发送失败')
    }
  }
  
  // 参数设置
  const handleSetParams = async (values: any) => {
    try {
      await sendCommand(data.id, 'set_params', values)
      message.success('参数设置成功')
      setParamsModalOpen(false)
      paramsForm.resetFields()
    } catch (error) {
      message.error('参数设置失败')
    }
  }
  
  // 远程锁车
  const handleLockVehicle = async () => {
    try {
      await sendCommand(data.id, 'lock_vehicle', {})
      message.success('锁车指令已发送')
    } catch (error) {
      message.error('锁车指令发送失败')
    }
  }
  
  return (
    <div className="terminal-detail-page">
      {/* 基本信息 */}
      <Card className="daoda-card" title={
        <Title level={4} style={{ margin: 0 }}>
          终端详情 - {data.terminalId}
        </Title>
      }>
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="终端号">{data.terminalId}</Descriptions.Item>
          <Descriptions.Item label="车牌号">{data.vehicleNo || '-'}</Descriptions.Item>
          <Descriptions.Item label="设备型号">{data.deviceModel || '-'}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="信号强度">{data.signalStrength}/4</Descriptions.Item>
          <Descriptions.Item label="最后通信">{data.lastCommunicationTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="位置" span={2}>
            {data.address || (data.location ? `${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}` : '-')}
          </Descriptions.Item>
          <Descriptions.Item label="经纬度">
            {data.location ? `${data.location.lat.toFixed(6)}, ${data.location.lng.toFixed(6)}` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="速度">{data.speed !== undefined ? `${data.speed} km/h` : '-'}</Descriptions.Item>
          <Descriptions.Item label="方向">{directionText(data.direction!)}</Descriptions.Item>
          <Descriptions.Item label="电量">{data.batteryLevel !== undefined ? `${data.batteryLevel}%` : '-'}</Descriptions.Item>
          <Descriptions.Item label="温度">{data.temperature !== undefined ? `${data.temperature}°C` : '-'}</Descriptions.Item>
          <Descriptions.Item label="里程">{data.mileage !== undefined ? `${data.mileage} km` : '-'}</Descriptions.Item>
          <Descriptions.Item label="SOC">{data.soc !== undefined ? `${data.soc}%` : '-'}</Descriptions.Item>
          <Descriptions.Item label="注册时间">{data.registerTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="激活时间">{data.activateTime || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>
      
      {/* 快捷操作 */}
      <Card className="daoda-card" style={{ marginTop: 16 }} title="快捷操作">
        <Space wrap>
          <Button type="primary" onClick={() => setMessageModalOpen(true)}>
            发送文本消息
          </Button>
          <Button onClick={() => setParamsModalOpen(true)}>
            参数设置
          </Button>
          <Button onClick={() => navigate('/firmware')}>
            固件升级
          </Button>
          <Popconfirm
            title="确认锁车？"
            description="锁车后车辆将无法启动，请确认操作"
            onConfirm={handleLockVehicle}
            okText="确认"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button danger>远程锁车</Button>
          </Popconfirm>
        </Space>
      </Card>
      
      {/* 发送消息弹窗 */}
      <Modal
        title="发送文本消息"
        open={messageModalOpen}
        onCancel={() => setMessageModalOpen(false)}
        onOk={() => messageForm.submit()}
      >
        <Form form={messageForm} layout="vertical" onFinish={handleSendMessage}>
          <Form.Item label="终端号">
            <Input value={data.terminalId} disabled />
          </Form.Item>
          <Form.Item label="车牌号">
            <Input value={data.vehicleNo} disabled />
          </Form.Item>
          <Form.Item
            name="message"
            label="消息内容"
            rules={[{ required: true, message: '请输入消息内容' }]}
          >
            <TextArea rows={4} placeholder="请输入要下发的消息内容，最多200字" maxLength={200} showCount />
          </Form.Item>
          <Form.Item name="priority" label="消息优先级" initialValue="normal">
            <Select options={[
              { label: '普通', value: 'normal' },
              { label: '重要', value: 'important' },
              { label: '紧急', value: 'urgent' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 参数设置弹窗 */}
      <Modal
        title="参数设置"
        open={paramsModalOpen}
        onCancel={() => setParamsModalOpen(false)}
        onOk={() => paramsForm.submit()}
        width={500}
      >
        <Form form={paramsForm} layout="vertical" onFinish={handleSetParams}>
          <Form.Item label="终端号">
            <Input value={data.terminalId} disabled />
          </Form.Item>
          <Form.Item name="heartbeatInterval" label="心跳间隔(秒)" initialValue={30}>
            <InputNumber min={10} max={300} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="positionInterval" label="定位上报间隔(秒)" initialValue={10}>
            <InputNumber min={5} max={60} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="overspeedThreshold" label="超速阈值(km/h)" initialValue={120}>
            <InputNumber min={60} max={200} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="mileageReport" label="里程上报间隔(km)" initialValue={10}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}