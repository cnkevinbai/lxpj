import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Descriptions, Card, Tabs, Table, Tag, Button, Space, Timeline, message, Badge } from 'antd'
import { EditOutlined, BackwardOutlined } from '@ant-design/icons'

interface Order {
  id: string
  orderCode: string
  customerName: string
  orderDate: string
  deliveryDate: string
  totalAmount: number
  paidAmount: number
  status: string
  paymentStatus: string
  shippingAddress: string
  salesRepName: string
  items: any[]
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)

  const statusColors: Record<string, string> = {
    pending: 'warning',
    processing: 'processing',
    completed: 'success',
    cancelled: 'error',
  }

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/orders/${id}`)
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      message.error('加载订单详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchOrder()
    }
  }, [id])

  if (loading || !order) {
    return <div>加载中...</div>
  }

  const itemColumns = [
    { title: '产品', dataIndex: 'productName', width: 250 },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '单价', dataIndex: 'unitPrice', width: 120, render: (p: number) => `¥${p.toLocaleString()}` },
    { title: '折扣', dataIndex: 'discount', width: 80, render: (d: number) => `${d}%` },
    { title: '税额', dataIndex: 'taxAmount', width: 100, render: (t: number) => `¥${t.toLocaleString()}` },
    { title: '金额', dataIndex: 'finalAmount', width: 120, render: (a: number) => <strong>¥{a.toLocaleString()}</strong> },
    { title: '发货状态', dataIndex: 'deliveryStatus', width: 100, render: (s: string) => <Badge status={s === 'delivered' ? 'success' : 'processing'} text={s === 'delivered' ? '已发货' : '待发货'} /> },
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<BackwardOutlined />} onClick={() => navigate('/orders')}>
            返回列表
          </Button>
          <Button type="primary" icon={<EditOutlined />}>编辑订单</Button>
          <Button type="primary">发货</Button>
        </Space>
      </Card>

      <Tabs
        items={[
          {
            key: 'info',
            label: '订单信息',
            children: (
              <Card>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="订单编号">{order.orderCode}</Descriptions.Item>
                  <Descriptions.Item label="订单状态">
                    <Tag color={statusColors[order.status]}>{order.status}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="客户名称">{order.customerName}</Descriptions.Item>
                  <Descriptions.Item label="销售代表">{order.salesRepName || '-'}</Descriptions.Item>
                  <Descriptions.Item label="订单日期">{new Date(order.orderDate).toLocaleDateString()}</Descriptions.Item>
                  <Descriptions.Item label="交付日期">{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '-'}</Descriptions.Item>
                  <Descriptions.Item label="订单金额">¥{(order.totalAmount || 0).toLocaleString()}</Descriptions.Item>
                  <Descriptions.Item label="已付金额">¥{(order.paidAmount || 0).toLocaleString()}</Descriptions.Item>
                  <Descriptions.Item label="支付状态">
                    <Badge status={order.paymentStatus === 'paid' ? 'success' : 'warning'} text={order.paymentStatus === 'paid' ? '已支付' : '未支付'} />
                  </Descriptions.Item>
                  <Descriptions.Item label="收货地址" span={2}>{order.shippingAddress || '-'}</Descriptions.Item>
                </Descriptions>
              </Card>
            ),
          },
          {
            key: 'items',
            label: '订单明细',
            children: (
              <Card>
                <Table
                  columns={itemColumns}
                  dataSource={order.items || []}
                  rowKey="id"
                  pagination={false}
                  summary={(pageData) => {
                    const total = pageData.reduce((sum, item) => sum + item.finalAmount, 0)
                    return (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={5}><strong>合计</strong></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}><strong>¥{total.toLocaleString()}</strong></Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )
                  }}
                  scroll={{ x: 1000 }}
                />
              </Card>
            ),
          },
          {
            key: 'timeline',
            label: '订单进度',
            children: (
              <Card>
                <Timeline>
                  <Timeline.Item color="blue">订单创建 - {new Date(order.orderDate).toLocaleString()}</Timeline.Item>
                  <Timeline.Item color="green">订单确认 - {order.status !== 'pending' ? '已确认' : '待确认'}</Timeline.Item>
                  <Timeline.Item color="orange">配货完成 - {order.status === 'processing' || order.status === 'completed' ? '已完成' : '待配货'}</Timeline.Item>
                  <Timeline.Item color="purple">订单发货 - {order.status === 'completed' ? '已发货' : '待发货'}</Timeline.Item>
                  <Timeline.Item color="red">订单完成 - {order.status === 'completed' ? '已完成' : '-'}</Timeline.Item>
                </Timeline>
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}

export default OrderDetail
