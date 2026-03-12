import { useState } from 'react'
import { Card, Table, Tag, Button, Space, message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import type { ProductionTask as ProductionTaskType } from '../../types'

// 模拟数据
const mockData: ProductionTaskType[] = [
  { id: '1', planId: 'PP20260312001', workcenter: '车间 A', quantity: 200, assignedTo: '张三', status: 'in_progress', startedAt: '2026-03-14 08:00:00' },
  { id: '2', planId: 'PP20260312001', workcenter: '车间 B', quantity: 300, assignedTo: '李四', status: 'pending' },
  { id: '3', planId: 'PP20260312002', workcenter: '车间 A', quantity: 150, assignedTo: '王五', status: 'completed', startedAt: '2026-03-13 08:00:00', completedAt: '2026-03-14 17:00:00' },
  { id: '4', planId: 'PP20260311001', workcenter: '车间 C', quantity: 500, assignedTo: '赵六', status: 'completed', startedAt: '2026-03-10 08:00:00', completedAt: '2026-03-12 17:00:00' },
]

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待开始' },
  in_progress: { color: 'blue', text: '进行中' },
  completed: { color: 'green', text: '已完成' },
}

export default function ProductionTask() {
  const [data] = useState<ProductionTaskType[]>(mockData)

  const columns = [
    { title: '任务 ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '计划单号', dataIndex: 'planId', key: 'planId', width: 160 },
    { title: '工作中心', dataIndex: 'workcenter', key: 'workcenter', width: 100 },
    { title: '任务数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: '负责人', dataIndex: 'assignedTo', key: 'assignedTo', width: 100 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 100,
      render: (status: string) => {
        const s = statusMap[status] || { color: 'default', text: status }
        return <Tag color={s.color}>{s.text}</Tag>
      }
    },
    { title: '开始时间', dataIndex: 'startedAt', key: 'startedAt', width: 160 },
    { title: '完成时间', dataIndex: 'completedAt', key: 'completedAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: ProductionTaskType) => (
        <Space>
          {record.status === 'pending' && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleStart(record.id)}
            >
              开始
            </Button>
          )}
          {record.status === 'in_progress' && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleComplete(record.id)}
            >
              完成
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const handleStart = (id: string) => {
    message.success(`任务 ${id} 已开始`)
  }

  const handleComplete = (id: string) => {
    message.success(`任务 ${id} 已完成`)
  }

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>生产任务</h1>
      <Card>
        <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  )
}
