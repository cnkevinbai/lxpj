import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tag, Timeline, Button, Space, message, Modal, Form, Input, Rate } from 'antd'
import { ArrowLeftOutlined, PhoneOutlined, EnvironmentOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { ServiceTicket } from '@/types/after-sales'

const { TextArea } = Input

// 模拟数据
const mockDetail: ServiceTicket = {
  id: '1',
  ticketNo: 'GD-20260312-001',
  type: 'repair',
  status: 'processing',
  priority: 'urgent',
  customerName: '张三',
  customerPhone: '138****1234',
  productName: '产品 A',
  problemDescription: '设备无法启动，指示灯不亮',
  serviceAddress: '成都市高新区某某大厦 10 楼',
  contactPerson: '张三',
  contactPhone: '138****1234',
  technicianName: '李师傅',
  createdAt: '2026-03-12 10:30:00',
  acceptedAt: '2026-03-12 11:00:00',
  assignedAt: '2026-03-12 14:00:00',
}

const typeMap: Record<string, { color: string; text: string }> = {
  repair: { color: 'orange', text: '维修' },
  installation: { color: 'blue', text: '安装' },
  maintenance: { color: 'green', text: '保养' },
}

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'default', text: '待受理' },
  accepted: { color: 'processing', text: '已受理' },
  assigned: { color: 'blue', text: '已分配' },
  processing: { color: 'processing', text: '处理中' },
  completed: { color: 'green', text: '已完成' },
  closed: { color: 'success', text: '已关闭' },
}

const priorityMap: Record<string, { color: string; text: string }> = {
  normal: { color: 'default', text: '普通' },
  urgent: { color: 'orange', text: '紧急' },
  critical: { color: 'red', text: '特急' },
}

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ServiceTicket>(mockDetail)
  const [confirmModal, setConfirmModal] = useState(false)
  const [form] = Form.useForm()

  const handleComplete = async (values: any) => {
    try {
      // await api.completeTicket(id, values)
      message.success('工单完成')
      setData({ ...data, status: 'waiting_confirm' })
      setConfirmModal(false)
    } catch (error) {
      message.error('操作失败')
    }
  }

  const timeline = [
    {
      title: '工单创建',
      description: data.createdAt,
      color: 'green',
    },
    data.acceptedAt && {
      title: '客服受理',
      description: data.acceptedAt,
      color: 'green',
    },
    data.assignedAt && {
      title: '分配服务人员',
      description: `${data.assignedAt} - ${data.technicianName}`,
      color: 'blue',
    },
    data.status === 'processing' && {
      title: '服务进行中',
      description: '服务人员已上门',
      color: 'orange',
    },
    data.completedAt && {
      title: '服务完成',
      description: data.completedAt,
      color: 'green',
    },
  ].filter(Boolean)

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/after-sales/tickets')}>
          返回列表
        </Button>
      </div>

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{data.ticketNo}</span>
            <Space>
              <Tag color={typeMap[data.type].color}>{typeMap[data.type].text}</Tag>
              <Tag color={statusMap[data.status].color}>{statusMap[data.status].text}</Tag>
              <Tag color={priorityMap[data.priority].color}>{priorityMap[data.priority].text}</Tag>
            </Space>
          </div>
        }
        extra={
          data.status === 'processing' && (
            <Button type="primary" onClick={() => setConfirmModal(true)}>
              完成工单
            </Button>
          )
        }
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="客户名称">{data.customerName}</Descriptions.Item>
          <Descriptions.Item label="联系电话">
            <Space>
              {data.customerPhone}
              <Button type="link" icon={<PhoneOutlined />} />
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="产品名称">{data.productName}</Descriptions.Item>
          <Descriptions.Item label="问题描述">{data.problemDescription}</Descriptions.Item>
          <Descriptions.Item label="服务地址">
            <Space>
              <EnvironmentOutlined />
              {data.serviceAddress}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="联系人">{data.contactPerson}</Descriptions.Item>
          <Descriptions.Item label="服务人员">{data.technicianName || '未分配'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createdAt}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24 }}>
          <h3>服务进度</h3>
          <Timeline items={timeline} style={{ marginTop: 16 }} />
        </div>
      </Card>

      <Modal
        title="完成工单"
        open={confirmModal}
        onCancel={() => setConfirmModal(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleComplete}>
          <Form.Item
            label="解决方案"
            name="solution"
            rules={[{ required: true, message: '请输入解决方案' }]}
          >
            <TextArea rows={4} placeholder="请详细描述解决方案" />
          </Form.Item>
          <Form.Item label="服务费用" name="serviceFee">
            <Input type="number" placeholder="0" prefix="¥" />
          </Form.Item>
          <Form.Item label="备件费用" name="partsFee">
            <Input type="number" placeholder="0" prefix="¥" />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setConfirmModal(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                确认完成
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
