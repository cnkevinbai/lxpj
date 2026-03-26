/**
 * 发票列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、确认开票、交付功能
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Typography } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invoiceService, Invoice, InvoiceType, InvoiceStatus, CreateInvoiceDto, UpdateInvoiceDto } from '@/services/finance.service'
import dayjs from 'dayjs'

const { Text } = Typography

// 发票类型映射
const typeMap: Record<InvoiceType, { color: string; text: string }> = {
  SALES: { color: 'blue', text: '销售发票' },
  PURCHASE: { color: 'orange', text: '采购发票' },
}

// 发票状态映射
const statusMap: Record<InvoiceStatus, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待开票' },
  ISSUED: { color: 'green', text: '已开票' },
  RECEIVED: { color: 'cyan', text: '已收票' },
  CANCELLED: { color: 'red', text: '已作废' },
}

export default function InvoiceList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    type: undefined as InvoiceType | undefined,
    status: undefined as InvoiceStatus | undefined,
    customerId: '',
    startDate: '',
    endDate: '',
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  // 获取发票列表
  const { data, isLoading } = useQuery({
    queryKey: ['invoices', filters, pagination],
    queryFn: () => invoiceService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 创建发票
  const createMutation = useMutation({
    mutationFn: (dto: CreateInvoiceDto) => invoiceService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })

  // 更新发票
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateInvoiceDto }) => 
      invoiceService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingInvoice(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })

  // 删除发票
  const deleteMutation = useMutation({
    mutationFn: (id: string) => invoiceService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })

  // 更新发票状态
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: InvoiceStatus }) => 
      invoiceService.updateStatus(id, status),
    onSuccess: () => {
      message.success('状态更新成功')
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
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
      type: undefined,
      status: undefined,
      customerId: '',
      startDate: '',
      endDate: '',
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingInvoice(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: Invoice) => {
    setEditingInvoice(record)
    form.setFieldsValue({
      ...record,
      issueDate: record.issueDate ? dayjs(record.issueDate).format('YYYY-MM-DD') : '',
      dueDate: record.dueDate ? dayjs(record.dueDate).format('YYYY-MM-DD') : '',
    })
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该发票吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 查看详情
  const handleViewDetail = (record: Invoice) => {
    setSelectedInvoice(record)
    setDetailVisible(true)
  }

  // 确认开票
  const handleIssue = (id: string) => {
    Modal.confirm({
      title: '确认开票',
      content: '确定要将此发票状态更新为已开票吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => updateStatusMutation.mutate({ id, status: 'ISSUED' }),
    })
  }

  // 交付
  const handleReceive = (id: string) => {
    Modal.confirm({
      title: '确认交付',
      content: '确定要将此发票状态更新为已收票吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => updateStatusMutation.mutate({ id, status: 'RECEIVED' }),
    })
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const dto: any = {
        ...values,
        issueDate: values.issueDate ? dayjs(values.issueDate).format('YYYY-MM-DD') : null,
        dueDate: values.dueDate ? dayjs(values.dueDate).format('YYYY-MM-DD') : null,
      }
      
      if (editingInvoice) {
        updateMutation.mutate({ id: editingInvoice.id, dto })
      } else {
        createMutation.mutate(dto)
      }
    })
  }

  // 表格列定义
  const columns: ColumnsType<Invoice> = [
    {
      title: '发票号',
      dataIndex: 'invoiceNo',
      width: 180,
      fixed: 'left',
      render: (invoiceNo, record) => (
        <Text strong onClick={() => handleViewDetail(record)} style={{ cursor: 'pointer', color: '#1890ff' }}>
          {invoiceNo}
        </Text>
      ),
    },
    {
      title: '客户',
      width: 150,
      render: (_, record) => record.customer?.name || '-',
    },
    {
      title: '订单号',
      width: 150,
      render: (_, record) => record.order?.orderNo || '-',
    },
    {
      title: '发票类型',
      dataIndex: 'type',
      width: 100,
      render: (type: InvoiceType) => (
        <Tag color={typeMap[type].color}>{typeMap[type].text}</Tag>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '税率',
      dataIndex: 'taxRate',
      width: 90,
      render: (taxRate: number) => `${taxRate}%`,
    },
    {
      title: '税额',
      dataIndex: 'taxAmount',
      width: 120,
      render: (taxAmount: number) => `¥${taxAmount.toLocaleString()}`,
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      width: 120,
      render: (totalAmount: number) => (
        <Text strong>¥{totalAmount.toLocaleString()}</Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: InvoiceStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: '开票日期',
      dataIndex: 'issueDate',
      width: 130,
      render: (issueDate: string) => issueDate ? dayjs(issueDate).format('YYYY-MM-DD') : '-',
    },
    {
      title: '到期日期',
      dataIndex: 'dueDate',
      width: 130,
      render: (dueDate: string) => dueDate ? dayjs(dueDate).format('YYYY-MM-DD') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button 
                type="link" 
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
              <Button 
                type="link" 
                size="small"
                onClick={() => handleIssue(record.id)}
              >
                确认开票
              </Button>
            </>
          )}
          {record.status === 'ISSUED' && (
            <Button 
              type="link" 
              size="small"
              onClick={() => handleReceive(record.id)}
            >
              交付
            </Button>
          )}
          {record.status !== 'CANCELLED' && (
            <Button 
              type="link" 
              size="small"
              danger
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title="发票列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建发票
          </Button>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索发票号/客户名称"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="发票类型"
              allowClear
              style={{ width: 120 }}
              value={filters.type}
              onChange={value => setFilters(prev => ({ ...prev, type: value }))}
            >
              <Select.Option value="SALES">销售发票</Select.Option>
              <Select.Option value="PURCHASE">采购发票</Select.Option>
            </Select>
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
          scroll={{ x: 1600 }}
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

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingInvoice ? '编辑发票' : '新建发票'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingInvoice(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          preserve
        >
          <Form.Item
            name="invoiceNo"
            label="发票号"
            rules={[{ required: true, message: '请输入发票号' }]}
          >
            <Input placeholder="请输入发票号" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="发票类型"
            rules={[{ required: true, message: '请选择发票类型' }]}
          >
            <Select>
              <Select.Option value="SALES">销售发票</Select.Option>
              <Select.Option value="PURCHASE">采购发票</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="orderId" label="关联订单">
            <Input placeholder="请输入订单号" />
          </Form.Item>
          
          <Form.Item name="customerId" label="客户">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="金额"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <Input type="number" placeholder="请输入金额" min={0} />
          </Form.Item>
          
          <Form.Item
            name="taxRate"
            label="税率"
            rules={[{ required: true, message: '请输入税率' }]}
            initialValue={13}
          >
            <Input type="number" placeholder="请输入税率" min={0} max={100} />
          </Form.Item>
          
          <Form.Item name="issueDate" label="开票日期">
            <Input type="date" />
          </Form.Item>
          
          <Form.Item name="dueDate" label="到期日期">
            <Input type="date" />
          </Form.Item>
          
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 发票详情弹窗 */}
      <Modal
        title="发票详情"
        open={detailVisible}
        onCancel={() => {
          setDetailVisible(false)
          setSelectedInvoice(null)
        }}
        width={700}
        footer={null}
      >
        {selectedInvoice && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>发票号：</Text>
                <Text>{selectedInvoice.invoiceNo}</Text>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>发票类型：</Text>
                <Tag color={typeMap[selectedInvoice.type].color}>{typeMap[selectedInvoice.type].text}</Tag>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>状态：</Text>
                <Tag color={statusMap[selectedInvoice.status].color}>{statusMap[selectedInvoice.status].text}</Tag>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>关联订单：</Text>
                <Text>{selectedInvoice.order?.orderNo || '-'}</Text>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>客户：</Text>
                <Text>{selectedInvoice.customer?.name || '-'}</Text>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>金额：</Text>
                <Text strong>¥{selectedInvoice.amount.toLocaleString()}</Text>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>税率：</Text>
                <Text>{selectedInvoice.taxRate}%</Text>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>税额：</Text>
                <Text strong>¥{selectedInvoice.taxAmount.toLocaleString()}</Text>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>总金额：</Text>
                <Text strong style={{ color: '#52c41a' }}>¥{selectedInvoice.totalAmount.toLocaleString()}</Text>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>开票日期：</Text>
                <Text>{selectedInvoice.issueDate ? dayjs(selectedInvoice.issueDate).format('YYYY-MM-DD') : '-'}</Text>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>到期日期：</Text>
                <Text>{selectedInvoice.dueDate ? dayjs(selectedInvoice.dueDate).format('YYYY-MM-DD') : '-'}</Text>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>创建时间：</Text>
                <Text>{dayjs(selectedInvoice.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
              </Space>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}
