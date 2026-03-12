import { useState } from 'react'
import { Card, Table, Button, Tag, Modal, Form, Input, InputNumber, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input

// 模拟数据
const mockData = [
  { id: '1', no: 'REC20260312001', orderId: 'O001', orderNo: 'ORD20260312001', customerId: 'C001', customerName: '成都客户 A', amount: 125000, method: 'bank', status: 'completed', receivedAt: '2026-03-12 10:00:00' },
  { id: '2', no: 'REC20260311001', orderId: 'O002', orderNo: 'ORD20260311001', customerId: 'C002', customerName: '重庆客户 B', amount: 230000, method: 'bank', status: 'completed', receivedAt: '2026-03-11 14:00:00' },
  { id: '3', no: 'REC20260310001', orderId: 'O003', orderNo: 'ORD20260310001', customerId: 'C003', customerName: '绵阳客户 C', amount: 178000, method: 'wechat', status: 'pending', receivedAt: null },
]

const methodMap: Record<string, string> = {
  bank: '银行转账',
  cash: '现金',
  wechat: '微信',
  alipay: '支付宝',
}

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待确认' },
  completed: { color: 'green', text: '已完成' },
}

export default function FinanceReceive() {
  const [data] = useState(mockData)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: '收款单号', dataIndex: 'no', key: 'no', width: 160 },
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 160 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 180 },
    { 
      title: '金额 (元)', 
      dataIndex: 'amount', 
      key: 'amount',
      width: 120,
      render: (v: number) => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>¥{v.toLocaleString()}</span>
    },
    { title: '收款方式', dataIndex: 'method', key: 'method', width: 100, render: (m: string) => methodMap[m] },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 100,
      render: (s: string) => <Tag color={statusMap[s].color}>{statusMap[s].text}</Tag>
    },
    { title: '收款时间', dataIndex: 'receivedAt', key: 'receivedAt', width: 160 },
  ]

  const handleCreate = async (values: any) => {
    try {
      // await financeApi.createReceive(values)
      message.success('收款登记成功')
      setCreateModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error('登记失败')
    }
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>收款管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
          登记收款
        </Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title="登记收款"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item label="订单号" name="orderId" rules={[{ required: true }]}>
            <Input placeholder="选择订单" />
          </Form.Item>
          <Form.Item label="收款金额" name="amount" rules={[{ required: true }]}>
            <InputNumber min={0.01} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="收款方式" name="method" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="bank">银行转账</Select.Option>
              <Select.Option value="cash">现金</Select.Option>
              <Select.Option value="wechat">微信</Select.Option>
              <Select.Option value="alipay">支付宝</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>确认收款</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
