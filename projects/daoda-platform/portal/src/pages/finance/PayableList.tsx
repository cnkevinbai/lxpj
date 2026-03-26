/**
 * 应付列表页面
 * 支持搜索、筛选、分页、付款登记、查看详情功能
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Card, Button, Input, Select, Space, Tag, Descriptions, Modal, Typography, Statistic, Row, Col, message } from 'antd'
import { SearchOutlined, EyeOutlined, DollarCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { payableService, Payable, PayableStatus, UpdatePayableDto } from '@/services/finance.service'
import dayjs from 'dayjs'

const { Text } = Typography

// 应付状态映射
const statusMap: Record<PayableStatus, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待付款' },
  PARTIAL: { color: 'blue', text: '部分付款' },
  PAID: { color: 'green', text: '已完成' },
  OVERDUE: { color: 'red', text: '逾期' },
}

export default function PayableList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as PayableStatus | undefined,
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
  const [selectedPayable, setSelectedPayable] = useState<Payable | null>(null)
  
  // 付款弹窗
  const [paymentVisible, setPaymentVisible] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('')

  // 获取应付账款列表
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['payables', filters, pagination],
    queryFn: () => payableService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 付款
  const paymentMutation = useMutation({
    mutationFn: ({ id, amount, remark }: { id: string; amount: number; remark?: string }) =>
      payableService.payment(id, amount, remark),
    onSuccess: () => {
      message.success('付款成功')
      setPaymentVisible(false)
      setPaymentAmount('')
      queryClient.invalidateQueries({ queryKey: ['payables'] })
    },
  })

  // 计算统计数据
  const stats = {
    totalPayable: data?.total || 0,
    totalPaid: data?.list?.reduce((sum, item) => sum + item.paidAmount, 0) || 0,
    totalOverdue: data?.list?.filter(item => item.status === 'OVERDUE').reduce((sum, item) => sum + item.remainingAmount, 0) || 0,
  }

  // 处理搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // 处理重置
  const handleReset = () => {
    setFilters({
      keyword: '',
      status: undefined,
      startDate: '',
      endDate: '',
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 查看详情
  const handleViewDetail = (record: Payable) => {
    setSelectedPayable(record)
    setDetailVisible(true)
  }

  // 打开付款弹窗
  const handleOpenPayment = (record: Payable) => {
    setSelectedPayable(record)
    setPaymentAmount('')
    setPaymentVisible(true)
  }

  // 处理付款提交
  const handlePaymentSubmit = () => {
    if (selectedPayable && paymentAmount) {
      paymentMutation.mutate({
        id: selectedPayable.id,
        amount: Number(paymentAmount),
      })
    }
  }

  // 表格列定义
  const columns: ColumnsType<Payable> = [
    {
      title: '供应商',
      width: 150,
      fixed: 'left',
      render: (_, record) => (
        <Text 
          strong 
          onClick={() => navigate(`/purchase/suppliers/${record.supplierId}`)}
          style={{ cursor: 'pointer', color: '#1890ff' }}
        >
          {record.supplier?.name}
        </Text>
      ),
    },
    {
      title: '订单号',
      width: 150,
      render: (_, record) => record.order?.orderNo || '-',
    },
    {
      title: '发票号',
      width: 150,
      render: (_, record) => record.invoice?.invoiceNo || '-',
    },
    {
      title: '应付金额',
      dataIndex: 'amount',
      width: 130,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '已付金额',
      dataIndex: 'paidAmount',
      width: 130,
      render: (paidAmount: number) => (
        <Text style={{ color: '#52c41a' }}>¥{paidAmount.toLocaleString()}</Text>
      ),
    },
    {
      title: '未付金额',
      dataIndex: 'remainingAmount',
      width: 130,
      render: (remainingAmount: number) => (
        <Text style={{ color: '#faad14' }}>¥{remainingAmount.toLocaleString()}</Text>
      ),
    },
    {
      title: '到期日',
      dataIndex: 'dueDate',
      width: 120,
      render: (dueDate: string, record: Payable) => {
        const overdue = dayjs(dueDate).isBefore(dayjs()) && ['PENDING', 'PARTIAL'].includes(record.status)
        return (
          <Text style={{ color: overdue ? '#ff4d4f' : undefined }}>
            {dayjs(dueDate).format('YYYY-MM-DD')}
          </Text>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: PayableStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
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
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          {record.status !== 'PAID' && (
            <Button 
              type="link" 
              size="small"
              icon={<DollarCircleOutlined />}
              onClick={() => handleOpenPayment(record)}
            >
              付款
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card title="应付账款列表">
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="应付总额"
                value={stats.totalPayable}
                valueStyle={{ color: '#1890ff' }}
                prefix={<DollarCircleOutlined />}
                precision={2}
                formatter={v => `¥${v.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="已付金额"
                value={stats.totalPaid}
                valueStyle={{ color: '#52c41a' }}
                prefix={<DollarCircleOutlined />}
                precision={2}
                formatter={v => `¥${v.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="逾期金额"
                value={stats.totalOverdue}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<DollarCircleOutlined />}
                precision={2}
                formatter={v => `¥${v.toLocaleString()}`}
              />
            </Card>
          </Col>
        </Row>

        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索供应商名称"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              {Object.entries(statusMap).map(([key, value]) => (
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
          scroll={{ x: 1500 }}
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

      {/* 应付详情弹窗 */}
      <Modal
        title="应付账款详情"
        open={detailVisible}
        onCancel={() => {
          setDetailVisible(false)
          setSelectedPayable(null)
        }}
        width={700}
        footer={null}
      >
        {selectedPayable && (
          <>
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={2}>
                <Descriptions.Item label="供应商">
                  <Text onClick={() => navigate(`/purchase/suppliers/${selectedPayable.supplierId}`)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                    {selectedPayable.supplier?.name}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="订单号">
                  {selectedPayable.order?.orderNo || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="发票号">
                  {selectedPayable.invoice?.invoiceNo || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="应付金额">
                  <Text strong>¥{selectedPayable.amount.toLocaleString()}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="已付金额">
                  <Text strong style={{ color: '#52c41a' }}>¥{selectedPayable.paidAmount.toLocaleString()}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="未付金额">
                  <Text strong style={{ color: '#faad14' }}>¥{selectedPayable.remainingAmount.toLocaleString()}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="到期日">
                  {dayjs(selectedPayable.dueDate).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={statusMap[selectedPayable.status].color}>
                    {statusMap[selectedPayable.status].text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {dayjs(selectedPayable.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {dayjs(selectedPayable.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </>
        )}
      </Modal>

      {/* 付款弹窗 */}
      <Modal
        title="付款登记"
        open={paymentVisible}
        onCancel={() => {
          setPaymentVisible(false)
          setSelectedPayable(null)
          setPaymentAmount('')
        }}
        onOk={handlePaymentSubmit}
        confirmLoading={paymentMutation.isPending}
        width={500}
      >
        {selectedPayable && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>供应商：</Text>
              <Text>{selectedPayable.supplier?.name}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>应付金额：</Text>
              <Text strong>¥{selectedPayable.amount.toLocaleString()}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>已付金额：</Text>
              <Text strong style={{ color: '#52c41a' }}>¥{selectedPayable.paidAmount.toLocaleString()}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>未付金额：</Text>
              <Text strong style={{ color: '#faad14' }}>¥{selectedPayable.remainingAmount.toLocaleString()}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>到期日：</Text>
              <Text>{dayjs(selectedPayable.dueDate).format('YYYY-MM-DD')}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>本次付款金额：</Text>
              <Input
                type="number"
                placeholder="请输入付款金额"
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value ? Number(e.target.value) : '')}
                min={0}
                max={selectedPayable.remainingAmount}
                step={0.01}
                style={{ marginTop: 8 }}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
