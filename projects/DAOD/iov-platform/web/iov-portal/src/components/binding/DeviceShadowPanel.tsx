/**
 * 设备影子面板组件
 * 
 * @description MQTT 设备的影子状态同步展示和操作
 * @author 渔晓白
 */

import { useState } from 'react'
import { Card, Descriptions, Tag, Button, Modal, Form, Input, Space, Divider, Badge, message } from 'antd'
import { SyncOutlined, EditOutlined, CloudSyncOutlined } from '@ant-design/icons'
import type { DeviceShadow } from '@/types/binding'

interface DeviceShadowPanelProps {
  shadow: DeviceShadow | null
  loading?: boolean
  onUpdateDesired?: (desired: Record<string, any>) => Promise<boolean>
}

export default function DeviceShadowPanel({ 
  shadow, 
  loading,
  onUpdateDesired 
}: DeviceShadowPanelProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [syncing, setSyncing] = useState(false)
  
  if (!shadow) {
    return (
      <Card loading={loading}>
        <div style={{ textAlign: 'center', color: '#999' }}>
          暂无设备影子数据
        </div>
      </Card>
    )
  }
  
  const handleUpdateDesired = async () => {
    try {
      const values = await form.validateFields()
      const desired: Record<string, any> = {}
      
      // 解析输入的 JSON
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== '') {
          desired[key] = values[key]
        }
      })
      
      if (Object.keys(desired).length === 0) {
        message.warning('请输入要更新的期望状态')
        return
      }
      
      setSyncing(true)
      
      if (onUpdateDesired) {
        const success = await onUpdateDesired(desired)
        if (success) {
          message.success('期望状态已更新，等待设备同步')
          setEditModalOpen(false)
        } else {
          message.error('更新失败')
        }
      }
    } catch (error) {
      console.error('更新期望状态失败:', error)
    } finally {
      setSyncing(false)
    }
  }
  
  return (
    <Card 
      title={
        <Space>
          <CloudSyncOutlined />
          设备影子
          <Badge 
            status={shadow.connected ? 'success' : 'default'} 
            text={shadow.connected ? '在线' : '离线'}
          />
        </Space>
      }
      extra={
        <Button 
          type="primary" 
          size="small"
          icon={<EditOutlined />}
          onClick={() => {
            form.resetFields()
            setEditModalOpen(true)
          }}
        >
          更新期望状态
        </Button>
      }
      loading={loading}
    >
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label="终端ID">{shadow.terminalId}</Descriptions.Item>
        <Descriptions.Item label="协议">{shadow.protocol}</Descriptions.Item>
        <Descriptions.Item label="设备型号">{shadow.deviceModel || '-'}</Descriptions.Item>
        <Descriptions.Item label="固件版本">{shadow.firmwareVersion || '-'}</Descriptions.Item>
        <Descriptions.Item label="连接时间">{shadow.connectTime || '-'}</Descriptions.Item>
        <Descriptions.Item label="断开时间">{shadow.disconnectTime || '-'}</Descriptions.Item>
      </Descriptions>
      
      <Divider>状态同步</Divider>
      
      <div style={{ display: 'flex', gap: 24 }}>
        {/* 报告状态 (设备 -> 平台) */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            <Tag color="blue">报告状态</Tag> 
            <Text type="secondary">(设备上报)</Text>
            {shadow.reportedVersion > 0 && (
              <Text type="secondary" style={{ marginLeft: 8 }}>
                v{shadow.reportedVersion}
              </Text>
            )}
          </div>
          {shadow.reported && Object.keys(shadow.reported).length > 0 ? (
            <Descriptions column={1} size="small">
              {Object.entries(shadow.reported).map(([key, value]) => (
                <Descriptions.Item key={key} label={key}>
                  {formatValue(value)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          ) : (
            <div style={{ color: '#999', padding: 8 }}>暂无报告状态</div>
          )}
          {shadow.lastReportTime && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              最后上报: {shadow.lastReportTime}
            </Text>
          )}
        </div>
        
        {/* 期望状态 (平台 -> 设备) */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            <Tag color="green">期望状态</Tag>
            <Text type="secondary">(平台下发)</Text>
            {shadow.desiredVersion > 0 && (
              <Text type="secondary" style={{ marginLeft: 8 }}>
                v{shadow.desiredVersion}
              </Text>
            )}
          </div>
          {shadow.desired && Object.keys(shadow.desired).length > 0 ? (
            <Descriptions column={1} size="small">
              {Object.entries(shadow.desired).map(([key, value]) => (
                <Descriptions.Item key={key} label={key}>
                  {formatValue(value)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          ) : (
            <div style={{ color: '#999', padding: 8 }}>暂无期望状态</div>
          )}
        </div>
      </div>
      
      {/* 编辑期望状态弹窗 */}
      <Modal
        title="更新期望状态"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleUpdateDesired}
        confirmLoading={syncing}
      >
        <Alert 
          type="info" 
          message="期望状态将同步到设备，设备会执行相应的操作" 
          style={{ marginBottom: 16 }}
        />
        <Form form={form} layout="vertical">
          <Form.Item name="maxSpeed" label="最大速度限制 (km/h)">
            <Input type="number" placeholder="例如: 60" />
          </Form.Item>
          <Form.Item name="lockStatus" label="锁车状态">
            <Input placeholder="LOCKED / UNLOCKED" />
          </Form.Item>
          <Form.Item name="alarmThreshold" label="告警阈值">
            <Input placeholder="例如: 80" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

/** 格式化值显示 */
function formatValue(value: any): React.ReactNode {
  if (value === null || value === undefined) {
    return '-'
  }
  
  if (typeof value === 'boolean') {
    return value ? '是' : '否'
  }
  
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  
  return String(value)
}

// 导入 Alert 组件
import { Alert } from 'antd'
const { Text } = Typography

import { Typography } from 'antd'