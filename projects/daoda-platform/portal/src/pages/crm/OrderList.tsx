/**
 * 订单列表页面
 * 支持搜索、筛选、分页、订单详情、状态流转
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Card, Button, Input, Select, Space, Tag, Descriptions, Typography, Steps, message, Drawer } from 'antd'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService, Order, OrderStatus, PaymentStatus } from '@/services/order.service'
import dayjs from 'dayjs'

const { Text, Paragraph } = Typography

// 订单状态映射
const orderStatusMap: Record<OrderStatus, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待确认' },
  CONFIRMED: { color: 'blue', text: '已确认' },
  PRODUCING: { color: 'purple', text: '生产中' },
  SHIPPED: { color: 'cyan', text: '已发货' },
  COMPLETED: { color: 'green', text: '已完成' },
  CANCELLED: { color: 'red', text: '已取消' },
}

// 付款状态映射
const paymentStatusMap: Record<PaymentStatus, { color: string; text: string }> = {
  UNPAID: { color: 'red', text: '未付款' },
  PARTIAL: { color: 'orange', text: '部分付款' },
  PAID: { color: 'green', text: '已付款' },
  REFUNDED: { color: 'default', text: '已退款' },
}

// 订单状态流程
const orderStatusSteps = ['PENDING', 'CONFIRMED', 'PRODUCING', 'SHIPPED', 'COMPLETED']

export default function OrderList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as OrderStatus | undefined,
    paymentStatus: undefined as PaymentStatus | undefined,
    startDate: '',
    endDate: '',
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 详情弹窗
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // 获取订单列表
  const { data, isLoading } = useQuery({
    queryKey: ['orders', filters, pagination],
    queryFn: () => orderService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 更新订单状态
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => {
      message.success('状态更新成功')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      if (selectedOrder) {
        queryClient.invalidateQueries({ queryKey: ['order', selectedOrder.id] })
      }
    },
  })

  // 处理搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // 处理重置
  const handleReset = () => {
    setFilters({
      keyword: '',
      status: undefined,
      paymentStatus: undefined,
      startDate: '',
      endDate: '',
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 查看详情
  const handleViewDetail = async (record: Order) => {
    setSelectedOrder(record)
    setDetailVisible(true)
  }

  // 更新订单状态
  const handleUpdateStatus = (status: OrderStatus) => {
    if (selectedOrder) {
      updateStatusMutation.mutate({ id: selectedOrder.id, status })
    }
  }

  // 表格列定义
  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 160,
      fixed: 'left',
      render: (orderNo, record) => (
        <Text 
          strong 
          onClick={() => handleViewDetail(record)}
          style={{ cursor: 'pointer', color: '#1890ff' }}
        >
          {orderNo}
        </Text>
      ),
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 150,
      render: (customerName, record) => (
        <Text onClick={() => navigate(`/crm/customers/${record.customerId}`)} style={{ cursor: 'pointer', color: '#1890ff' }}>
          {customerName}
        </Text>
      ),
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '已付金额',
      dataIndex: 'paidAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      width: 100,
      render: (status: OrderStatus) => (
        <Tag color={orderStatusMap[status].color}>{orderStatusMap[status].text}</Tag>
      ),
    },
    {
      title: '付款状态',
      dataIndex: 'paymentStatus',
      width: 100,
      render: (status: PaymentStatus) => (
        <Tag color={paymentStatusMap[status].color}>{paymentStatusMap[status].text}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ]

  return (
    <>
      <Card title="订单列表">
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索订单号/客户名称"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="订单状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              {Object.entries(orderStatusMap).map(([key, value]) => (
                <Select.Option key={key} value={key}>{value.text}</Select.Option>
              ))}
            </Select>
            <Select
              placeholder="付款状态"
              allowClear
              style={{ width: 120 }}
              value={filters.paymentStatus}
              onChange={value => setFilters(prev => ({ ...prev, paymentStatus: value }))}
            >
              {Object.entries(paymentStatusMap).map(([key, value]) => (
                <Select.Option key={key} value={key}>{value.text}</Select.Option>
              ))}
            </Select>
            <Input
              type="date"
              placeholder="开始日期"
              style={{ width: 140 }}
              value={filters.startDate}
              onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
            <Input
              type="date"
              placeholder="结束日期"
              style={{ width: 140 }}
              value={filters.endDate}
              onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={data?.list}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: data?.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
          }}
        />
      </Card>

      {/* 订单详情弹窗 */}
      <Drawer
        title="订单详情"
        placement="right"
        width={800}
        open={detailVisible}
        onClose={() => {
          setDetailVisible(false)
          setSelectedOrder(null)
        }}
      >
        {selectedOrder && (
          <>
            {/* 订单基本信息 */}
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={2}>
                <Descriptions.Item label="订单号">{selectedOrder.orderNo}</Descriptions.Item>
                <Descriptions.Item label="订单状态">
                  <Tag color={orderStatusMap[selectedOrder.status].color}>
                    {orderStatusMap[selectedOrder.status].text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="客户名称">
                  <Text onClick={() => navigate(`/crm/customers/${selectedOrder.customerId}`)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                    {selectedOrder.customerName}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="销售人员">{selectedOrder.userName || '-'}</Descriptions.Item>
                <Descriptions.Item label="订单金额">
                  <Text strong>¥{selectedOrder.totalAmount.toLocaleString()}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="已付金额">
                  <Text strong>¥{selectedOrder.paidAmount.toLocaleString()}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="付款状态">
                  <Tag color={paymentStatusMap[selectedOrder.paymentStatus].color}>
                    {paymentStatusMap[selectedOrder.paymentStatus].text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="付款方式">{selectedOrder.paymentMethod || '-'}</Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {dayjs(selectedOrder.createdAt).format('YYYY-MM-DD HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {dayjs(selectedOrder.updatedAt).format('YYYY-MM-DD HH:mm')}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 订单状态流转 */}
            <Card title="订单状态" size="small" style={{ marginBottom: 16 }}>
              <Steps
                current={orderStatusSteps.indexOf(selectedOrder.status)}
                items={orderStatusSteps.map(status => ({
                  title: orderStatusMap[status as OrderStatus].text,
                }))}
                style={{ marginBottom: 16 }}
              />
              {selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'COMPLETED' && (
                <Space wrap>
                  <Text>更新状态：</Text>
                  {orderStatusSteps
                    .filter(s => orderStatusSteps.indexOf(s) > orderStatusSteps.indexOf(selectedOrder.status))
                    .map(status => (
                      <Button
                        key={status}
                        size="small"
                        onClick={() => handleUpdateStatus(status as OrderStatus)}
                        loading={updateStatusMutation.isPending}
                      >
                        {orderStatusMap[status as OrderStatus].text}
                      </Button>
                    ))}
                </Space>
              )}
            </Card>

            {/* 订单商品 */}
            <Card title="订单商品" size="small" style={{ marginBottom: 16 }}>
              <Table
                dataSource={selectedOrder.items}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  { title: '商品名称', dataIndex: 'productName' },
                  { title: '商品编码', dataIndex: 'productCode' },
                  { 
                    title: '单价', 
                    dataIndex: 'unitPrice',
                    render: (price: number) => `¥${price.toLocaleString()}`
                  },
                  { title: '数量', dataIndex: 'quantity' },
                  { 
                    title: '总价', 
                    dataIndex: 'totalPrice',
                    render: (price: number) => `¥${price.toLocaleString()}`
                  },
                  { title: '备注', dataIndex: 'remark', ellipsis: true },
                ]}
              />
            </Card>

            {/* 备注 */}
            {selectedOrder.remark && (
              <Card title="备注" size="small">
                <Paragraph>{selectedOrder.remark}</Paragraph>
              </Card>
            )}
          </>
        )}
      </Drawer>
    </>
  )
}
