import { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Card, Row, Col, Statistic } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import PageHeaderWrapper from '@shared/components/PageHeaderWrapper'

interface ProductionOrder {
  id: string
  orderNumber: string
  productName: string
  quantity: number
  status: string
}

const ProductionOrders = () => {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<ProductionOrder[]>([])

  const loadOrders = async () => {
    setLoading(true)
    try {
      // TODO: 调用实际 API
      setOrders([
        { id: '1', orderNumber: 'PO20260314001', productName: '产品 A', quantity: 100, status: 'IN_PROGRESS' },
        { id: '2', orderNumber: 'PO20260314002', productName: '产品 B', quantity: 200, status: 'PENDING' },
      ])
    } catch (error) {
      console.error('加载失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  const columns = [
    { title: '生产订单号', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: '产品名称', dataIndex: 'productName', key: 'productName' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = { PENDING: 'orange', IN_PROGRESS: 'blue', COMPLETED: 'green' }
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
        </Space>
      ),
    },
  ]

  return (
    <PageHeaderWrapper title="生产管理" subtitle="生产订单、生产计划、工序管理">
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic title="总订单数" value={50} suffix="个" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="生产中" value={20} suffix="个" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="已完成" value={30} suffix="个" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
      />
    </PageHeaderWrapper>
  )
}

export default ProductionOrders
