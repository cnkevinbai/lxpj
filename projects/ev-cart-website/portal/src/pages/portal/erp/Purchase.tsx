import { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'
import PageHeaderWrapper from '@shared/components/PageHeaderWrapper'

interface PurchaseItem {
  id: string
  orderNumber: string
  supplierName: string
  amount: number
  status: string
}

const Purchase = () => {
  const [loading, setLoading] = useState(false)
  const [purchases, setPurchases] = useState<PurchaseItem[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const loadPurchases = async () => {
    setLoading(true)
    try {
      // TODO: 调用实际 API
      setPurchases([
        { id: '1', orderNumber: 'PO20260314001', supplierName: '供应商 A', amount: 50000, status: 'ORDERED' },
        { id: '2', orderNumber: 'PO20260314002', supplierName: '供应商 B', amount: 30000, status: 'PENDING' },
      ])
    } catch (error) {
      console.error('加载失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPurchases() }, [])

  const columns = [
    { title: '采购订单号', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName' },
    { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const map: Record<string, string> = { PENDING: '待审核', APPROVED: '已审核', ORDERED: '已下单', RECEIVED: '已入库' }
        const colorMap: Record<string, string> = { PENDING: 'orange', APPROVED: 'blue', ORDERED: 'cyan', RECEIVED: 'green' }
        return <Tag color={colorMap[status] || 'default'}>{map[status] || status}</Tag>
      }
    },
    { title: '操作', key: 'action', render: (_: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
        </Space>
      )},
  ]

  return (
    <PageHeaderWrapper title="采购管理" subtitle="采购申请、订单、供应商管理">
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '16px' }} onClick={() => setModalVisible(true)}>新建采购订单</Button>
      <Table loading={loading} columns={columns} dataSource={purchases} rowKey="id" pagination={{ showSizeChanger: true }} />
      
      <Modal title="新建采购订单" open={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical">
          <Form.Item name="supplierId" label="供应商" rules={[{ required: true }]}>
            <Select placeholder="请选择供应商">
              <Select.Option value="supplier1">供应商 A</Select.Option>
              <Select.Option value="supplier2">供应商 B</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
            <InputNumber prefix="¥" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default Purchase
