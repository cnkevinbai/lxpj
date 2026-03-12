import { useState } from 'react'
import { Card, Table, Button, Tag, Modal, Form, Input, InputNumber, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input

// 模拟数据
const mockData = [
  { id: '1', no: 'PAY20260312001', purchaseOrderId: 'PO001', supplierId: 'S001', supplierName: '四川钢铁集团', amount: 89000, method: 'bank', status: 'completed', paidAt: '2026-03-12 11:00:00' },
  { id: '2', no: 'PAY20260311001', purchaseOrderId: 'PO002', supplierId: 'S002', supplierName: '成都电子科技', amount: 67000, method: 'bank', status: 'pending', paidAt: null },
  { id: '3', no: 'PAY20260310001', purchaseOrderId: 'PO003', supplierId: 'S003', supplierName: '重庆机械制造', amount: 125000, method: 'alipay', status: 'completed', paidAt: '2026-03-10 15:00:00' },
]

const methodMap: Record<string, string> = {
  bank: '银行转账',
  cash: '现金',
  wechat: '微信',
  alipay: '支付宝',
}

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待支付' },
  completed: { color: 'green', text: '已支付' },
}

export default function FinancePay() {
  const [data] = useState(mockData)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: '付款单号', dataIndex: 'no', key: 'no', width: 160 },
    { title: '采购单号', dataIndex: 'purchaseOrderId', key: 'purchaseOrderId', width: 140 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 180 },
    { 
      title: '金额 (元)', 
      dataIndex: 'amount', 
      key: 'amount',
      width: 120,
      render: (v: number) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>¥{v.toLocaleString()}</span>
    },
    { title: '付款方式', dataIndex: 'method', key: 'method', width: 100, render: (m: string) => methodMap[m] },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 100,
      render: (s: string) => <Tag color={statusMap[s].color}>{statusMap[s].text}</Tag>
    },
    { title: '支付时间', dataIndex: 'paidAt', key: 'paidAt', width: 160 },
  ]

  const handleCreate = async (values: any) => {
    try {
      // await financeApi.createPay(values)
      message.success('付款登记成功')
      setCreateModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error('登记失败')
    }
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>付款管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
          登记付款
        </Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title="登记付款"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item label="采购单号" name="purchaseOrderId" rules={[{ required: true }]}>
            <Input placeholder="选择采购单" />
          </Form.Item>
          <Form.Item label="付款金额" name="amount" rules={[{ required: true }]}>
            <InputNumber min={0.01} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="付款方式" name="method" rules={[{ required: true }]}>
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
            <Button type="primary" htmlType="submit" block>确认付款</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
