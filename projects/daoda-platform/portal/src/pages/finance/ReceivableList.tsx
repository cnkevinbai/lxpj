/**
 * 应收列表页面
 * 支持搜索、筛选、分页、收款登记、查看详情功能
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Card, Button, Input, Select, Space, Tag, Descriptions, Modal, Typography, Statistic, Row, Col, message } from 'antd'
import { SearchOutlined, EyeOutlined, DollarCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { receivableService, Receivable, ReceivableStatus } from '@/services/finance.service'
import dayjs from 'dayjs'

const { Text } = Typography

// 应收状态映射
const statusMap: Record<ReceivableStatus, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待收款' },
  PARTIAL: { color: 'blue', text: '部分收款' },
  PAID: { color: 'green', text: '已完成' },
  OVERDUE: { color: 'red', text: '逾期' },
}

export default function ReceivableList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as ReceivableStatus | undefined,
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
  const [selectedReceivable, setSelectedReceivable] = useState<Receivable | null>(null)
  
  // 收款弹窗
  const [paymentVisible, setPaymentVisible] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('')

  // 获取应收账款列表
  const { data, isLoading } = useQuery({
    queryKey: ['receivables', filters, pagination],
    queryFn: () => receivableService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 收款
  const paymentMutation = useMutation({
    mutationFn: ({ id, amount, remark }: { id: string; amount: number; remark?: string }) =>
      receivableService.payment(id, amount, remark),
    onSuccess: () => {
      message.success('收款成功')
      setPaymentVisible(false)
      setPaymentAmount('')
      queryClient.invalidateQueries({ queryKey: ['receivables'] })
    },
  })

  // 计算统计数据
  const stats = {
    totalReceivable: data?.total || 0,
    totalPaid: data?.list?.reduce((sum, item) => sum + item.paidAmount, 0) || 0,
    totalOverdue: data?.list?.reduce((sum, item) => 
      item.status === 'OVERDUE' ? sum + item.remainingAmount : sum, 0) || 0,
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
  const handleViewDetail = (record: Receivable) => {
    setSelectedReceivable(record)
    setDetailVisible(true)
  }

  // 打开收款弹窗
  const handleOpenPayment = (record: Receivable) => {
    setSelectedReceivable(record)
    setPaymentAmount('')
    setPaymentVisible(true)
  }

  // 处理收款提交
  const handlePaymentSubmit = () => {
    if (selectedReceivable && paymentAmount) {
      paymentMutation.mutate({
        id: selectedReceivable.id,
        amount: Number(paymentAmount),
      })
    }
  }

  // 表格列定义
  const columns: ColumnsType<Receivable> = [
    {
      title: '客户',
      width: 150,
      fixed: 'left',
      render: (_, record) => (
        <Text 
          strong 
          onClick={() => navigate(`/crm/customers/${record.customerId}`)}
          style={{ cursor: 'pointer', color: '#1890ff' }}
        >
          {record.customer?.name}
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
      title: '应收金额',
      dataIndex: 'amount',
      width: 130,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '已收金额',
      dataIndex: 'paidAmount',
      width: 130,
      render: (paidAmount: number) => (
        <Text style={{ color: '#52c41a' }}>¥{paidAmount.toLocaleString()}</Text>
      ),
    },
    {
      title: '未收金额',
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
      render: (dueDate: string, record: Receivable) => {
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
      render: (status: ReceivableStatus) => (
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
              收款
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card title="应收账款列表">
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="应收总额"
                value={stats.totalReceivable}
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
                title="已收金额"
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
              placeholder="搜索客户名称"
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

      {/* 应收详情弹窗 */}
      <Modal
        title="应收账款详情"
        open={detailVisible}
        onCancel={() => {
          setDetailVisible(false)
          setSelectedReceivable(null)
        }}
        width={700}
        footer={null}
      >
        {selectedReceivable && (
          <>
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={2}>
                <Descriptions.Item label="客户">
                  <Text onClick={() => navigate(`/crm/customers/${selectedReceivable.customerId}`)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                    {selectedReceivable.customer?.name}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="订单号">
                  {selectedReceivable.order?.orderNo || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="发票号">
                  {selectedReceivable.invoice?.invoiceNo || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="应收金额">
                  <Text strong>¥{selectedReceivable.amount.toLocaleString()}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="已收金额">
                  <Text strong style={{ color: '#52c41a' }}>¥{selectedReceivable.paidAmount.toLocaleString()}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="未收金额">
                  <Text strong style={{ color: '#faad14' }}>¥{selectedReceivable.remainingAmount.toLocaleString()}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="到期日">
                  {dayjs(selectedReceivable.dueDate).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={statusMap[selectedReceivable.status].color}>
                    {statusMap[selectedReceivable.status].text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {dayjs(selectedReceivable.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {dayjs(selectedReceivable.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </>
        )}
      </Modal>

      {/* 收款弹窗 */}
      <Modal
        title="收款登记"
        open={paymentVisible}
        onCancel={() => {
          setPaymentVisible(false)
          setSelectedReceivable(null)
          setPaymentAmount('')
        }}
        onOk={handlePaymentSubmit}
        confirmLoading={paymentMutation.isPending}
        width={500}
      >
        {selectedReceivable && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>客户：</Text>
              <Text>{selectedReceivable.customer?.name}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>应收金额：</Text>
              <Text strong>¥{selectedReceivable.amount.toLocaleString()}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>已收金额：</Text>
              <Text strong style={{ color: '#52c41a' }}>¥{selectedReceivable.paidAmount.toLocaleString()}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>未收金额：</Text>
              <Text strong style={{ color: '#faad14' }}>¥{selectedReceivable.remainingAmount.toLocaleString()}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>到期日：</Text>
              <Text>{dayjs(selectedReceivable.dueDate).format('YYYY-MM-DD')}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>本次收款金额：</Text>
              <Input
                type="number"
                placeholder="请输入收款金额"
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value ? Number(e.target.value) : '')}
                min={0}
                max={selectedReceivable.remainingAmount}
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
