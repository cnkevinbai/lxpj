/**
 * 远程控制页面
 */
import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message, Tabs, Descriptions } from 'antd'
import { LockOutlined, UnlockOutlined, CarOutlined } from '@ant-design/icons'

export default function RemoteControl() {
  const [lockModalOpen, setLockModalOpen] = useState(false)
  const [unlockModalOpen, setUnlockModalOpen] = useState(false)
  const [form] = Form.useForm()
  
  const vehicles = [
    { id: '1', vehicleNo: '川A12345', terminalId: '13800001111', status: 'running', lockStatus: 'unlocked', location: '成都市高新区' },
    { id: '2', vehicleNo: '川B67890', terminalId: '13800002222', status: 'stopped', lockStatus: 'unlocked', location: '眉山市东坡区' },
    { id: '3', vehicleNo: '川C11111', terminalId: '13800003333', status: 'offline', lockStatus: 'locked', location: '乐山市市中区' },
  ]
  
  const controlHistory = [
    { id: '1', vehicleNo: '川A12345', command: '锁车', time: '2026-03-25 15:30:00', result: '成功', operator: '管理员' },
    { id: '2', vehicleNo: '川B67890', command: '解锁', time: '2026-03-25 14:20:00', result: '成功', operator: '管理员' },
    { id: '3', vehicleNo: '川C11111', command: '锁车', time: '2026-03-24 10:00:00', result: '成功', operator: '管理员' },
  ]
  
  const columns = [
    { title: '车牌号', dataIndex: 'vehicleNo', key: 'vehicleNo' },
    { title: '终端号', dataIndex: 'terminalId', key: 'terminalId' },
    { 
      title: '车辆状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          running: { color: 'success', text: '行驶中' },
          stopped: { color: 'warning', text: '已停车' },
          offline: { color: 'default', text: '离线' },
        }
        return <Tag color={config[status]?.color}>{config[status]?.text}</Tag>
      }
    },
    { 
      title: '锁车状态', 
      dataIndex: 'lockStatus', 
      key: 'lockStatus',
      render: (status: string) => (
        <Tag color={status === 'locked' ? 'error' : 'success'} icon={status === 'locked' ? <LockOutlined /> : <UnlockOutlined />}>
          {status === 'locked' ? '已锁车' : '未锁车'}
        </Tag>
      )
    },
    { title: '位置', dataIndex: 'location', key: 'location' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          {record.lockStatus === 'locked' ? (
            <Button type="primary" size="small" icon={<UnlockOutlined />} onClick={() => setUnlockModalOpen(true)}>解锁</Button>
          ) : (
            <Button danger size="small" icon={<LockOutlined />} onClick={() => setLockModalOpen(true)}>锁车</Button>
          )}
        </Space>
      ),
    },
  ]
  
  const historyColumns = [
    { title: '车牌号', dataIndex: 'vehicleNo', key: 'vehicleNo' },
    { title: '指令', dataIndex: 'command', key: 'command' },
    { title: '执行时间', dataIndex: 'time', key: 'time' },
    { title: '结果', dataIndex: 'result', key: 'result', render: (r: string) => <Tag color="success">{r}</Tag> },
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
  ]
  
  return (
    <div className="remote-control-page">
      <Card>
        <Tabs
          items={[
            {
              key: 'control',
              label: '远程控制',
              children: (
                <Table columns={columns} dataSource={vehicles} rowKey="id" />
              ),
            },
            {
              key: 'history',
              label: '操作记录',
              children: (
                <Table columns={historyColumns} dataSource={controlHistory} rowKey="id" />
              ),
            },
          ]}
        />
      </Card>
      
      <Modal
        title="确认锁车"
        open={lockModalOpen}
        onCancel={() => setLockModalOpen(false)}
        onOk={() => { message.success('锁车指令已发送'); setLockModalOpen(false) }}
        okButtonProps={{ danger: true }}
      >
        <p>锁车后车辆将无法启动，确定要锁车吗？</p>
      </Modal>
      
      <Modal
        title="确认解锁"
        open={unlockModalOpen}
        onCancel={() => setUnlockModalOpen(false)}
        onOk={() => { message.success('解锁指令已发送'); setUnlockModalOpen(false) }}
      >
        <p>确定要解锁车辆吗？</p>
      </Modal>
    </div>
  )
}