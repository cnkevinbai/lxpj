/**
 * 报价单列表页面
 * 支持搜索、筛选、分页、报价单详情、状态流转
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Card, Button, Input, Select, Space, Tag, Typography, Drawer, Modal, Form, Steps, message, Rate } from 'antd'
import { SearchOutlined, EyeOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { quotationService, Quotation, QuotationStatus } from '@/services/quotation.service'
import dayjs from 'dayjs'

const { Text, Paragraph } = Typography

// 报价单状态映射
const quotationStatusMap: Record<QuotationStatus, { color: string; text: string }> = {
  DRAFT: { color: 'default', text: '草稿' },
  PENDING: { color: 'orange', text: '待审批' },
  APPROVED: { color: 'green', text: '已审批' },
  REJECTED: { color: 'red', text: '已拒绝' },
  CONVERTED: { color: 'cyan', text: '已转订单' },
  EXPIRED: { color: 'gray', text: '已过期' },
}

export default function QuotationList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as QuotationStatus | undefined,
    customerId: '',
    opportunityId: '',
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 详情弹窗
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)

  // 获取报价单列表
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['quotations', filters, pagination],
    queryFn: () => quotationService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 删除报价单
  const deleteMutation = useMutation({
    mutationFn: (id: string) => quotationService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      if (selectedQuotation) {
        queryClient.invalidateQueries({ queryKey: ['quotation', selectedQuotation.id] })
      }
    },
  })

  // 提交审批
  const submitMutation = useMutation({
    mutationFn: (id: string) => quotationService.submit(id),
    onSuccess: () => {
      message.success('提交成功')
      refetch()
      if (selectedQuotation) {
        queryClient.invalidateQueries({ queryKey: ['quotation', selectedQuotation.id] })
      }
    },
  })

  // 审批通过
  const approveMutation = useMutation({
    mutationFn: (id: string) => quotationService.approve(id),
    onSuccess: () => {
      message.success('审批通过')
      refetch()
      if (selectedQuotation) {
        queryClient.invalidateQueries({ queryKey: ['quotation', selectedQuotation.id] })
      }
    },
  })

  // 审批拒绝
  const rejectMutation = useMutation({
    mutationFn: (id: string) => quotationService.reject(id),
    onSuccess: () => {
      message.success('审批拒绝')
      refetch()
      if (selectedQuotation) {
        queryClient.invalidateQueries({ queryKey: ['quotation', selectedQuotation.id] })
      }
    },
  })

  // 转为订单
  const convertMutation = useMutation({
    mutationFn: (id: string) => quotationService.convertToOrder(id),
    onSuccess: (data) => {
      message.success('转为订单成功')
      navigate(`/crm/orders/${data.order.id}`)
      refetch()
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
      customerId: '',
      opportunityId: '',
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 查看详情
  const handleViewDetail = async (record: Quotation) => {
    setSelectedQuotation(record)
    setDetailVisible(true)
  }

  // 删除报价单
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该报价单吗？',
      onOk: () => deleteMutation.mutate(id),
      okText: '确认',
      cancelText: '取消',
    })
  }

  // 表格列定义
  const columns: ColumnsType<Quotation> = [
    {
      title: '报价单号',
      dataIndex: 'quotationNo',
      width: 160,
      fixed: 'left',
      render: (quotationNo, record) => (
        <Text 
          strong 
          onClick={() => handleViewDetail(record)}
          style={{ cursor: 'pointer', color: '#1890ff' }}
        >
          {quotationNo}
        </Text>
      ),
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 150,
      render: (customerName, record) => (
        <Text 
          onClick={() => navigate(`/crm/customers/${record.customerId}`)} 
          style={{ cursor: 'pointer', color: '#1890ff' }}
        >
          {customerName}
        </Text>
      ),
    },
    {
      title: '商机',
      dataIndex: 'opportunityName',
      width: 150,
      render: (opportunityName, record) => (
        <Text 
          onClick={record.opportunityId ? () => navigate(`/crm/opportunities/${record.opportunityId}`) : undefined}
          style={{ 
            cursor: record.opportunityId ? 'pointer' : 'default', 
            color: record.opportunityId ? '#1890ff' : '#999' 
          }}
          ellipsis
        >
          {opportunityName || '-'}
        </Text>
      ),
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: QuotationStatus) => (
        <Tag color={quotationStatusMap[status].color}>{quotationStatusMap[status].text}</Tag>
      ),
    },
    {
      title: '有效期至',
      dataIndex: 'validUntil',
      width: 140,
      render: (validUntil: string | null) => validUntil ? dayjs(validUntil).format('YYYY-MM-DD') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space wrap size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          {record.status === 'DRAFT' && (
            <>
              <Button 
                type="link" 
                icon={<EditOutlined />}
                onClick={() => {
                  // TODO: 编辑功能
                  message.info('编辑功能开发中')
                }}
              >
                编辑
              </Button>
              <Button 
                type="link" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
                loading={deleteMutation.isPending}
              >
                删除
              </Button>
            </>
          )}
          {record.status === 'DRAFT' && (
            <Button 
              type="link" 
              onClick={() => submitMutation.mutate(record.id)}
              loading={submitMutation.isPending}
            >
              提交
            </Button>
          )}
          {record.status === 'PENDING' && (
            <>
              <Button 
                type="link" 
                danger
                onClick={() => rejectMutation.mutate(record.id)}
                loading={rejectMutation.isPending}
              >
                拒绝
              </Button>
              <Button 
                type="link" 
                style={{ color: '#52c41a' }}
                onClick={() => approveMutation.mutate(record.id)}
                loading={approveMutation.isPending}
              >
                通过
              </Button>
            </>
          )}
          {record.status === 'APPROVED' && (
            <Button 
              type="link" 
              onClick={() => convertMutation.mutate(record.id)}
              loading={convertMutation.isPending}
            >
              转订单
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card title="报价单列表">
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索报价单号/备注"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="报价单状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              {Object.entries(quotationStatusMap).map(([key, value]) => (
                <Select.Option key={key} value={key}>{value.text}</Select.Option>
              ))}
            </Select>
            <Input
              placeholder="客户ID"
              style={{ width: 200 }}
              value={filters.customerId}
              onChange={e => setFilters(prev => ({ ...prev, customerId: e.target.value }))}
            />
            <Input
              placeholder="商机ID"
              style={{ width: 200 }}
              value={filters.opportunityId}
              onChange={e => setFilters(prev => ({ ...prev, opportunityId: e.target.value }))}
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

      {/* 报价单详情弹窗 */}
      <Drawer
        title="报价单详情"
        placement="right"
        width={800}
        open={detailVisible}
        onClose={() => {
          setDetailVisible(false)
          setSelectedQuotation(null)
        }}
      >
        {selectedQuotation && (
          <>
            {/* 报价单基本信息 */}
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Table
                dataSource={[
                  { label: '报价单号', value: selectedQuotation.quotationNo },
                  { 
                    label: '状态', 
                    value: <Tag color={quotationStatusMap[selectedQuotation.status].color}>
                      {quotationStatusMap[selectedQuotation.status].text}
                    </Tag>
                  },
                  { 
                    label: '客户', 
                    value: (
                      <Text 
                        onClick={() => navigate(`/crm/customers/${selectedQuotation.customerId}`)} 
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                      >
                        {selectedQuotation.customerName}
                      </Text>
                    )
                  },
                  { 
                    label: '商机', 
                    value: selectedQuotation.opportunityName ? (
                      <Text 
                        onClick={() => navigate(`/crm/opportunities/${selectedQuotation.opportunityId}`)}
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                      >
                        {selectedQuotation.opportunityName}
                      </Text>
                    ) : '-'
                  },
                  { 
                    label: '总金额', 
                    value: <Text strong>¥{selectedQuotation.totalAmount.toLocaleString()}</Text>
                  },
                  { label: '有效期', value: selectedQuotation.validUntil ? dayjs(selectedQuotation.validUntil).format('YYYY-MM-DD') : '-' },
                  { label: '创建时间', value: dayjs(selectedQuotation.createdAt).format('YYYY-MM-DD HH:mm') },
                ]}
                columns={[
                  { dataIndex: 'label', width: '30%' },
                  { dataIndex: 'value' },
                ]}
                pagination={false}
                size="small"
                showHeader={false}
              />
            </Card>

            {/* 报价单项目 */}
            <Card title="报价单项目" size="small" style={{ marginBottom: 16 }}>
              <Table
                dataSource={selectedQuotation.items}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  { 
                    title: '产品', 
                    dataIndex: 'productName',
                    render: (productName: string, record: any) => (
                      <Text strong>{productName}</Text>
                    )
                  },
                  { title: '编码', dataIndex: 'productCode' },
                  { 
                    title: '单价', 
                    dataIndex: 'unitPrice',
                    render: (price: number) => `¥${price.toLocaleString()}`
                  },
                  { title: '数量', dataIndex: 'quantity' },
                  { 
                    title: '折扣', 
                    dataIndex: 'discount',
                    render: (discount: number) => `${discount}%`
                  },
                  { 
                    title: '金额', 
                    dataIndex: 'amount',
                    render: (amount: number) => <Text strong>¥{amount.toLocaleString()}</Text>
                  },
                  { title: '备注', dataIndex: 'remark', ellipsis: true },
                ]}
              />
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Text strong>合计：¥{selectedQuotation.totalAmount.toLocaleString()}</Text>
              </div>
            </Card>

            {/* 备注 */}
            {selectedQuotation.remark && (
              <Card title="备注" size="small">
                <Paragraph>{selectedQuotation.remark}</Paragraph>
              </Card>
            )}

            {/* 状态流转 */}
            <Card title="状态流转" size="small" style={{ marginTop: 16 }}>
              <Steps
                current={[
                  'DRAFT',
                  'PENDING',
                  'APPROVED',
                  'REJECTED',
                  'CONVERTED',
                  'EXPIRED',
                ].indexOf(selectedQuotation.status)}
                items={[
                  { title: '草稿', status: selectedQuotation.status === 'DRAFT' ? 'process' : 'default' as any },
                  { title: '待审批', status: selectedQuotation.status === 'PENDING' ? 'process' : 'default' as any },
                  { 
                    title: '已审批', 
                    status: ['APPROVED', 'CONVERTED'].includes(selectedQuotation.status) ? 'process' : 'default' as any
                  },
                  { 
                    title: '已拒绝', 
                    status: selectedQuotation.status === 'REJECTED' ? 'error' : 'default' as any
                  },
                  { 
                    title: '已转订单', 
                    status: selectedQuotation.status === 'CONVERTED' ? 'finish' : 'default' as any
                  },
                  { title: '已过期', status: selectedQuotation.status === 'EXPIRED' ? 'error' : 'default' as any },
                ]}
                style={{ marginBottom: 16 }}
              />
            </Card>
          </>
        )}
      </Drawer>
    </>
  )
}
