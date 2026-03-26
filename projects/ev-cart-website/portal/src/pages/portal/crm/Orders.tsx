import { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message, Card, Row, Col, Statistic } from 'antd'
import { PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import PageHeaderWrapper from '@shared/components/PageHeaderWrapper'
import { orderService } from '@shared/services/order'

const Orders = () => {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const loadOrders = async () => {
    setLoading(true)
    try {
      const response = await orderService.getList({ page, pageSize })
      setOrders(response.data || [])
      setTotal(response.total || 0)
    } catch (error) {
      message.error('加载订单列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [page, pageSize])

  const handleCreate = async (values: any) => {
    try {
      await orderService.create(values)
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      loadOrders()
    } catch (error) {
      message.error('创建失败')
    }
  }

  const handleConfirm = async (id: string) => {
    try {
      await orderService.confirm(id)
      message.success('订单已确认')
      loadOrders()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleCancel = async (id: string) => {
    try {
      await orderService.cancel(id, '取消原因')
      message.success('订单已取消')
      loadOrders()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns = [
    { title: '订单号', dataIndex: 'orderNumber', key: 'orderNumber', fixed: 'left' },
    { title: '客户', dataIndex: 'customer', key: 'customer', render: (c: any) => c?.name || '-' },
    { 
      title: '金额', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (amount: number) => `¥${(amount || 0).toLocaleString()}`
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const map: Record<string, string> = {
          PENDING: '待确认',
          CONFIRMED: '已确认',
          PRODUCTION: '生产中',
          SHIPPED: '已发货',
          DELIVERED: '已交付',
          COMPLETED: '已完成',
          CANCELLED: '已取消'
        }
        const colorMap: Record<string, string> = {
          PENDING: 'orange',
          CONFIRMED: 'blue',
          PRODUCTION: 'cyan',
          SHIPPED: 'purple',
          DELIVERED: 'green',
          COMPLETED: 'success',
          CANCELLED: 'red'
        }
        return <Tag color={colorMap[status] || 'default'}>{map[status] || status}</Tag>
      }
    },
    { 
      title: '支付', 
      dataIndex: 'paymentStatus', 
      key: 'paymentStatus',
      render: (status: string) => {
        const map: Record<string, string> = { UNPAID: '未支付', PARTIAL: '部分支付', PAID: '已支付' }
        const colorMap: Record<string, string> = { UNPAID: 'red', PARTIAL: 'orange', PAID: 'green' }
        return <Tag color={colorMap[status] || 'default'}>{map[status] || status}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          {record.status === 'PENDING' && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => handleConfirm(record.id)}>确认</Button>
              <Button type="link" size="small" danger icon={<CloseOutlined />} onClick={() => handleCancel(record.id)}>取消</Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <PageHeaderWrapper
      title="订单管理"
      subtitle="订单创建、确认、生产、发货、交付全流程管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          form.resetFields()
          setModalVisible(true)
        }}>
          新建订单
        </Button>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic title="总订单数" value={total} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待确认" value={orders.filter((o: any) => o.status === 'PENDING').length} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="生产中" value={orders.filter((o: any) => o.status === 'PRODUCTION').length} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已完成" value={orders.filter((o: any) => o.status === 'COMPLETED').length} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => { setPage(page); setPageSize(pageSize || 10) },
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="新建订单"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="customerId" label="客户" rules={[{ required: true }]}>
            <Select placeholder="请选择客户">
              <Select.Option value="customer1">XX 有限公司</Select.Option>
              <Select.Option value="customer2">YY 集团</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
            <InputNumber prefix="¥" style={{ width: '100%' }} placeholder="请输入金额" />
          </Form.Item>
          <Form.Item name="status" label="订单状态" initialValue="PENDING">
            <Select>
              <Select.Option value="PENDING">待确认</Select.Option>
              <Select.Option value="CONFIRMED">已确认</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default Orders
