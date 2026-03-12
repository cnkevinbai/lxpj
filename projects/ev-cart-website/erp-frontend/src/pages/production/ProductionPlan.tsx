import { useState } from 'react'
import { Card, Table, Button, Tag, Modal, Form, Input, InputNumber, DatePicker, message } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'
import type { ProductionPlan as ProductionPlanType } from '../../types'

const { TextArea } = Input

// 模拟数据
const mockData: ProductionPlanType[] = [
  { id: '1', no: 'PP20260312001', productId: 'p1', productName: '产品 A', quantity: 500, plannedStart: '2026-03-15', plannedEnd: '2026-03-20', status: 'pending' },
  { id: '2', no: 'PP20260312002', productId: 'p2', productName: '产品 B', quantity: 300, plannedStart: '2026-03-14', plannedEnd: '2026-03-18', status: 'in_progress' },
  { id: '3', no: 'PP20260311001', productId: 'p3', productName: '产品 C', quantity: 1000, plannedStart: '2026-03-10', plannedEnd: '2026-03-12', status: 'completed' },
  { id: '4', no: 'PP20260310001', productId: 'p4', productName: '产品 D', quantity: 200, plannedStart: '2026-03-08', plannedEnd: '2026-03-10', status: 'completed' },
]

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待开始' },
  in_progress: { color: 'blue', text: '进行中' },
  completed: { color: 'green', text: '已完成' },
  cancelled: { color: 'red', text: '已取消' },
}

export default function ProductionPlan() {
  const [data] = useState<ProductionPlanType[]>(mockData)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: '计划单号', dataIndex: 'no', key: 'no', width: 160 },
    { title: '产品', dataIndex: 'productName', key: 'productName', width: 180 },
    { title: '计划数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: '计划开始', dataIndex: 'plannedStart', key: 'plannedStart', width: 120 },
    { title: '计划结束', dataIndex: 'plannedEnd', key: 'plannedEnd', width: 120 },
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
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Button type="link" icon={<EyeOutlined />}>查看</Button>
      ),
    },
  ]

  const handleCreate = async (values: any) => {
    try {
      // await productionApi.createPlan(values)
      message.success('计划创建成功')
      setCreateModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error('创建失败')
    }
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>生产计划</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
          新建计划
        </Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title="新建生产计划"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item label="产品" name="productId" rules={[{ required: true }]}>
            <Input placeholder="选择产品" />
          </Form.Item>
          <Form.Item label="计划数量" name="quantity" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="计划开始日期" name="plannedStart" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="计划结束日期" name="plannedEnd" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>创建</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
