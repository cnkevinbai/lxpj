import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Descriptions, Tag, Timeline, Table, Steps, message } from 'antd'
import { ArrowLeftOutlined, CustomerServiceOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import PortalLayout from '../../../components/PortalLayout'

const OrderDetail: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrderDetail()
  }, [params.id])

  const loadOrderDetail = async () => {
    try {
      const response = await fetch(`/api/v1/portal/orders/${params.id}`)
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      message.error('加载订单详情失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading || !order) {
    return <PortalLayout><div>加载中...</div></PortalLayout>
  }

  const itemColumns = [
    { title: '产品名称', dataIndex: 'productName', width: 300 },
    { title: '单价', dataIndex: 'unitPrice', width: 120, render: (p: number) => `¥${p.toLocaleString()}` },
    { title: '数量', dataIndex: 'quantity', width: 100 },
    { title: '小计', dataIndex: 'subtotal', width: 120, render: (s: number) => `¥${s.toLocaleString()}` },
  ]

  return (
    <PortalLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          style={{ marginBottom: 24 }}
        >
          返回订单列表
        </Button>

        {/* 订单状态 */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 24, marginBottom: 8 }}>订单编号：{order.orderCode}</h2>
              <p style={{ color: '#999' }}>下单时间：{new Date(order.orderDate).toLocaleString()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#ff4d4f', marginBottom: 8 }}>
                ¥{order.totalAmount.toLocaleString()}
              </div>
              <Tag color={
                order.status === 'completed' ? 'success' :
                order.status === 'processing' ? 'processing' :
                order.status === 'pending' ? 'warning' : 'default'
              } style={{ fontSize: 14 }}>
                {order.status === 'completed' ? '已完成' :
                 order.status === 'processing' ? '处理中' :
                 order.status === 'pending' ? '待处理' : order.status}
              </Tag>
            </div>
          </div>
        </Card>

        {/* 订单进度 */}
        <Card title="订单进度" style={{ marginBottom: 24 }}>
          <Steps
            current={
              order.status === 'pending' ? 0 :
              order.status === 'processing' ? 1 :
              order.status === 'shipped' ? 2 :
              order.status === 'completed' ? 3 : -1
            }
            items={[
              { title: '订单提交', description: order.orderDate },
              { title: '配货完成', description: order.processingDate || '等待配货' },
              { title: '已发货', description: order.shippedDate || '等待发货' },
              { title: '已完成', description: order.completedDate || '等待完成' },
            ]}
          />
        </Card>

        {/* 订单信息 */}
        <Card title="订单信息" style={{ marginBottom: 24 }}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="收货人">{order.shippingAddress?.receiver}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{order.shippingAddress?.phone}</Descriptions.Item>
            <Descriptions.Item label="收货地址" span={2}>{order.shippingAddress?.fullAddress}</Descriptions.Item>
            <Descriptions.Item label="支付方式">{order.paymentMethod || '在线支付'}</Descriptions.Item>
            <Descriptions.Item label="支付状态">
              <Tag color={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                {order.paymentStatus === 'paid' ? '已支付' : '未支付'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 订单商品 */}
        <Card title="订单商品" style={{ marginBottom: 24 }}>
          <Table 
            columns={itemColumns} 
            dataSource={order.items || []} 
            rowKey="id"
            pagination={false}
          />
          <div style={{ textAlign: 'right', marginTop: 16, fontSize: 18, fontWeight: 700 }}>
            订单总额：<span style={{ color: '#ff4d4f', fontSize: 24 }}>¥{order.totalAmount.toLocaleString()}</span>
          </div>
        </Card>

        {/* 操作按钮 */}
        <Card>
          <Space size="large">
            {order.status === 'completed' && (
              <Button icon={<CustomerServiceOutlined />} size="large" onClick={() => window.location.href = '/portal/tickets/new'}>
                申请售后
              </Button>
            )}
            {order.status === 'pending' && (
              <Button danger size="large">取消订单</Button>
            )}
            <Button type="primary" size="large">查看物流</Button>
          </Space>
        </Card>
      </motion.div>
    </PortalLayout>
  )
}

export default OrderDetail
