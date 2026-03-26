import React, { useState } from 'react'
import { Card, Steps, Timeline, Button, Space, Tag, Modal, Form, Input, Upload, message, Rate, Descriptions } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, CustomerServiceOutlined, ToolOutlined, FileTextOutlined } from '@ant-design/icons'

const { Step } = Steps

interface ServiceProcess {
  id: string
  orderNo: string
  customer: string
  product: string
  issue: string
  currentStep: number
  status: string
  createTime: string
  assignee: string
}

const ServiceProcessManagement: React.FC = () => {
  const [processes, setProcesses] = useState<ServiceProcess[]>([
    {
      id: '1',
      orderNo: 'SV20260313001',
      customer: '某某物流公司',
      product: '智能换电柜 V3',
      issue: '设备无法启动，显示屏黑屏',
      currentStep: 2,
      status: 'processing',
      createTime: '2026-03-13 09:00',
      assignee: '王师傅',
    },
    {
      id: '2',
      orderNo: 'SV20260313002',
      customer: '某某科技公司',
      product: '锂电池 48V',
      issue: '电池续航能力下降',
      currentStep: 4,
      status: 'completed',
      createTime: '2026-03-12 14:30',
      assignee: '李师傅',
    },
  ])

  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<ServiceProcess | null>(null)

  const serviceSteps = [
    { title: '服务申请', icon: <CustomerServiceOutlined /> },
    { title: '客服受理', icon: <FileTextOutlined /> },
    { title: '工程师派单', icon: <ToolOutlined /> },
    { title: '上门处理', icon: <ToolOutlined /> },
    { title: '客户验收', icon: <CheckCircleOutlined /> },
    { title: '服务完成', icon: <CheckCircleOutlined /> },
  ]

  const statusColors: Record<string, string> = {
    pending: 'warning',
    processing: 'blue',
    completed: 'success',
    cancelled: 'error',
  }

  const statusLabels: Record<string, string> = {
    pending: '待受理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消',
  }

  const handleViewDetail = (process: ServiceProcess) => {
    setSelectedProcess(process)
    setDetailVisible(true)
  }

  const processTimeline = [
    { time: '2026-03-13 09:00', event: '客户提交服务申请', user: '系统' },
    { time: '2026-03-13 09:15', event: '客服受理，创建服务单', user: '客服 A' },
    { time: '2026-03-13 09:30', event: '派单给工程师王师傅', user: '调度员' },
    { time: '2026-03-13 10:00', event: '工程师联系客户，预约上门时间', user: '王师傅' },
    { time: '2026-03-13 14:00', event: '工程师上门处理', user: '王师傅' },
  ]

  return (
    <div>
      <Card title="🔧 售后服务全流程管理">
        {processes.map((process) => (
          <Card
            key={process.id}
            style={{ marginBottom: 16 }}
            title={`服务单：${process.orderNo}`}
            extra={
              <Space>
                <Tag color={statusColors[process.status]}>{statusLabels[process.status]}</Tag>
                <Button type="link" onClick={() => handleViewDetail(process)}>查看详情</Button>
                {process.status === 'processing' && <Button type="primary">推进流程</Button>}
              </Space>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Space size="large">
                <span><strong>客户：</strong>{process.customer}</span>
                <span><strong>产品：</strong>{process.product}</span>
                <span><strong>问题：</strong>{process.issue}</span>
                <span><strong>工程师：</strong>{process.assignee}</span>
                <span><strong>创建时间：</strong>{process.createTime}</span>
              </Space>
            </div>

            <Steps
              current={process.currentStep}
              items={serviceSteps.map((step) => ({
                key: step.title,
                title: step.title,
                icon: step.icon,
              }))}
              labelPlacement="vertical"
            />

            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Space>
                <Button onClick={() => handleViewDetail(process)}>查看进度</Button>
                <Button type="primary" disabled={process.status !== 'processing'}>下一步</Button>
              </Space>
            </div>
          </Card>
        ))}
      </Card>

      <Modal
        title="服务单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={900}
      >
        {selectedProcess && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="服务单号">{selectedProcess.orderNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusColors[selectedProcess.status]}>{statusLabels[selectedProcess.status]}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="客户">{selectedProcess.customer}</Descriptions.Item>
              <Descriptions.Item label="产品">{selectedProcess.product}</Descriptions.Item>
              <Descriptions.Item label="问题描述" span={2}>{selectedProcess.issue}</Descriptions.Item>
              <Descriptions.Item label="负责人">{selectedProcess.assignee}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedProcess.createTime}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h3>📋 处理进度</h3>
              <Timeline
                items={processTimeline.map((item) => ({
                  color: 'green',
                  children: (
                    <div>
                      <div>{item.event}</div>
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        {item.time} - {item.user}
                      </div>
                    </div>
                  ),
                }))}
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

export default ServiceProcessManagement
