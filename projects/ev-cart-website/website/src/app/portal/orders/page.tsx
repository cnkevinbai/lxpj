import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Space, Input, Select, Tag, Pagination, Empty } from 'antd'
import { ShoppingCartOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import PortalLayout from '../../components/PortalLayout'

const { Search } = Input
const { Option } = Select

interface Order {
  id: string
  orderCode: string
  orderDate: string
  totalAmount: number
  status: string
  items: any[]
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadOrders()
  }, [page, statusFilter])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
      })

      const response = await fetch(`/api/v1/portal/orders?${params}`)
      const data = await response.json()

      setOrders(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Load orders failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      pending: { color: 'warning', text: '待处理' },
      processing: { color: 'processing', text: '处理中' },
      shipped: { color: 'success', text: '已发货' },
      completed: { color: 'success', text: '已完成' },
      cancelled: { color: 'default', text: '已取消' },
    }
    const { color, text } = config[status] || { color: 'default', text: status }
    return <Tag color={color}>{text}</Tag>
  }

  return (
    <PortalLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>我的订单</h1>
          <p style={{ fontSize: 16, color: '#666' }}>查看和管理您的所有订单</p>
        </div>

        {/* 筛选栏 */}
        <Card style={{ marginBottom: 24 }}>
          <Space size="large" wrap>
            <Search
              placeholder="搜索订单编号"
              allowClear
              style={{ width: 300 }}
              onSearch={(value) => console.log('Search:', value)}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
              placeholder="订单状态"
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待处理</Option>
              <Option value="processing">处理中</Option>
              <Option value="shipped">已发货</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
            <Button icon={<FilterOutlined />}>更多筛选</Button>
          </Space>
        </Card>

        {/* 订单列表 */}
        {orders.length === 0 ? (
          <Card>
            <Empty 
              description="暂无订单" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button type="primary" size="large" onClick={() => window.location.href = '/products'}>
                去购物
              </Button>
            </div>
          </Card>
        ) : (
          <div>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  hoverable
                  style={{ marginBottom: 16 }}
                  onClick={() => window.location.href = `/portal/orders/${order.id}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                        订单编号：{order.orderCode}
                      </div>
                      <div style={{ color: '#999', fontSize: 14 }}>
                        下单时间：{new Date(order.orderDate).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#ff4d4f', marginBottom: 8 }}>
                        ¥{order.totalAmount.toLocaleString()}
                      </div>
                      <div style={{ marginBottom: 8 }}>{getStatusTag(order.status)}</div>
                      <Button type="primary" size="small">
                        查看详情
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* 分页 */}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Pagination 
                current={page} 
                total={total} 
                pageSize={10}
                onChange={setPage}
                showTotal={(total) => `共 ${total} 条`}
              />
            </div>
          </div>
        )}
      </motion.div>
    </PortalLayout>
  )
}

export default Orders
