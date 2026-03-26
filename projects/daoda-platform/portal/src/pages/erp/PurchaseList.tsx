/**
 * 采购管理列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、审批、导出功能
 * 实现完整的采购订单 CRUD 操作
 */
import { useState } from 'react'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Dropdown, Typography, InputNumber, DatePicker, Descriptions, Divider } from 'antd'
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, DeleteOutlined, MoreOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  purchaseService, 
  PurchaseOrder, 
  PurchaseStatus,
  CreatePurchaseOrderDto, 
  UpdatePurchaseOrderDto,
  PurchaseOrderQueryParams,
  CreatePurchaseOrderItemDto,
} from '@/services/purchase.service'
import dayjs from 'dayjs'

const { Text } = Typography

// ==================== 常量定义 ====================

/**
 * 采购状态映射
 * 定义不同状态的颜色和显示文本
 */
const statusMap: Record<PurchaseStatus, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待审批' },
  APPROVED: { color: 'green', text: '已审批' },
  REJECTED: { color: 'red', text: '已拒绝' },
  PARTIAL_RECEIVED: { color: 'blue', text: '部分收货' },
  COMPLETED: { color: 'cyan', text: '已完成' },
}

/**
 * 供应商选项（实际应从后端获取）
 */
const supplierOptions = [
  { label: '电机供应商 A', value: '电机供应商 A' },
  { label: '电池供应商 B', value: '电池供应商 B' },
  { label: '轮胎供应商 C', value: '轮胎供应商 C' },
  { label: '电子元件供应商 D', value: '电子元件供应商 D' },
]

// ==================== 主组件 ====================

export default function PurchaseList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [detailForm] = Form.useForm()
  
  // 筛选条件状态
  const [filters, setFilters] = useState<PurchaseOrderQueryParams>({
    keyword: '',
    status: undefined,
    supplier: undefined,
  })
  
  // 分页状态
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制状态
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [currentOrder, setCurrentOrder] = useState<PurchaseOrder | null>(null)

  // ==================== React Query 数据获取 ====================

  /**
   * 获取采购订单列表
   * 依赖筛选条件和分页参数，自动触发重新获取
   */
  const { data, isLoading } = useQuery({
    queryKey: ['purchase-orders', filters, pagination],
    queryFn: () => purchaseService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // ==================== React Query 数据变更 ====================

  /**
   * 创建采购订单
   * 成功后刷新列表并关闭弹窗
   */
  const createMutation = useMutation({
    mutationFn: (dto: CreatePurchaseOrderDto) => purchaseService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
    },
  })

  /**
   * 更新采购订单
   * 成功后刷新列表并关闭弹窗
   */
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePurchaseOrderDto }) => 
      purchaseService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingOrder(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
    },
  })

  /**
   * 删除采购订单
   * 成功后刷新列表
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => purchaseService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
    },
  })

  /**
   * 批量删除采购订单
   * 成功后刷新列表并清空选择
   */
  const batchDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => purchaseService.batchDelete(ids),
    onSuccess: () => {
      message.success('批量删除成功')
      setSelectedRowKeys([])
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
    },
  })

  /**
   * 审批采购订单
   * 成功后刷新列表
   */
  const approveMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => 
      purchaseService.approve(id, { approved }),
    onSuccess: () => {
      message.success('审批成功')
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
    },
  })

  // ==================== 事件处理函数 ====================

  /**
   * 处理搜索
   * 重置页码到第一页
   */
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  /**
   * 处理重置
   * 清空所有筛选条件并重置分页
   */
  const handleReset = () => {
    setFilters({
      keyword: '',
      status: undefined,
      supplier: undefined,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  /**
   * 处理新建
   * 重置表单并打开新建弹窗
   */
  const handleCreate = () => {
    setEditingOrder(null)
    form.resetFields()
    setModalVisible(true)
  }

  /**
   * 处理编辑
   * 填充表单数据并打开编辑弹窗
   */
  const handleEdit = (record: PurchaseOrder) => {
    setEditingOrder(record)
    form.setFieldsValue({
      ...record,
      expectedDate: record.expectedDate ? dayjs(record.expectedDate) : null,
    })
    setModalVisible(true)
  }

  /**
   * 处理查看详情
   * 设置当前订单并打开详情弹窗
   */
  const handleViewDetail = (record: PurchaseOrder) => {
    setCurrentOrder(record)
    setDetailModalVisible(true)
  }

  /**
   * 处理删除
   * 显示确认对话框，用户确认后执行删除
   */
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该采购订单吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  /**
   * 处理批量删除
   * 显示确认对话框，用户确认后执行批量删除
   */
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的记录')
      return
    }
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条记录吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => batchDeleteMutation.mutate(selectedRowKeys as string[]),
    })
  }

  /**
   * 处理审批
   * 显示确认对话框，用户确认后执行审批
   */
  const handleApprove = (id: string, approved: boolean) => {
    Modal.confirm({
      title: approved ? '确认通过' : '确认拒绝',
      content: approved ? '确定要通过该采购订单吗？' : '确定要拒绝该采购订单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => approveMutation.mutate({ id, approved }),
    })
  }

  /**
   * 处理提交
   * 表单验证通过后执行创建或更新
   */
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const dto: CreatePurchaseOrderDto = {
        supplier: values.supplier,
        supplierContact: values.supplierContact,
        supplierPhone: values.supplierPhone,
        expectedDate: values.expectedDate ? dayjs(values.expectedDate).format('YYYY-MM-DD') : undefined,
        remark: values.remark,
        items: values.items || [],
      }
      
      if (editingOrder) {
        updateMutation.mutate({ id: editingOrder.id, dto })
      } else {
        createMutation.mutate(dto)
      }
    })
  }

  /**
   * 处理导出
   * 调用后端导出接口下载 Excel 文件
   */
  const handleExport = () => {
    const params: any = { ...filters }
    // 移除空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === undefined) {
        delete params[key]
      }
    })
    
    const token = localStorage.getItem('token')
    const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api'
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&')
    
    const url = `${apiUrl}/purchase-orders/export?${queryString}`
    
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.blob())
      .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = downloadUrl
        a.download = `采购订单_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(downloadUrl)
        document.body.removeChild(a)
        message.success('导出成功')
      })
      .catch(() => {
        message.error('导出失败')
      })
  }

  // ==================== 表格列定义 ====================

  const columns: ColumnsType<PurchaseOrder> = [
    {
      title: '采购单号',
      dataIndex: 'orderNo',
      width: 150,
      fixed: 'left',
      render: (orderNo: string) => <Text strong>{orderNo}</Text>,
    },
    { 
      title: '供应商', 
      dataIndex: 'supplier', 
      width: 180,
      ellipsis: true,
    },
    { 
      title: '联系人', 
      dataIndex: 'supplierContact', 
      width: 100,
      ellipsis: true,
    },
    { 
      title: '联系电话', 
      dataIndex: 'supplierPhone', 
      width: 130,
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      width: 120,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      filters: Object.entries(statusMap).map(([key, value]) => ({
        text: value.text,
        value: key,
      })),
      onFilter: (value, record) => record.status === value,
      render: (status: PurchaseStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: '预计到货',
      dataIndex: 'expectedDate',
      width: 120,
      render: (date?: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
            详情
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button 
                type="link" 
                size="small"
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleApprove(record.id, true)}
              >
                通过
              </Button>
              <Button 
                type="link" 
                size="small"
                icon={<CloseOutlined />}
                style={{ color: '#ff4d4f' }}
                onClick={() => handleApprove(record.id, false)}
              >
                拒绝
              </Button>
            </>
          )}
          {record.status !== 'COMPLETED' && (
            <Button 
              type="link" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          )}
          <Dropdown
            menu={{
              items: [
                {
                  key: 'delete',
                  label: '删除',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(record.id),
                },
              ],
            }}
          >
            <Button type="link" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ]

  // ==================== 渲染 ====================

  return (
    <>
      <Card
        title="采购订单"
        extra={
          <Space>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreate}
              disabled={selectedRowKeys.length > 0}
            >
              新建采购
            </Button>
          </Space>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索单号/供应商"
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
            <Select
              placeholder="供应商"
              allowClear
              style={{ width: 180 }}
              value={filters.supplier}
              onChange={value => setFilters(prev => ({ ...prev, supplier: value }))}
            >
              {supplierOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
              ))}
            </Select>
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
            {selectedRowKeys.length > 0 && (
              <Button danger onClick={handleBatchDelete}>
                批量删除 ({selectedRowKeys.length})
              </Button>
            )}
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
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          summary={pageData => {
            let totalAmount = 0
            let pendingCount = 0
            pageData.forEach(({ totalAmount: amount, status }) => {
              totalAmount += amount
              if (status === 'PENDING') {
                pendingCount++
              }
            })
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <Text strong>本页合计</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <Text strong>¥{totalAmount.toLocaleString()}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} colSpan={5}>
                    {pendingCount > 0 && (
                      <Text type="warning">
                        {pendingCount} 笔待审批
                      </Text>
                    )}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingOrder ? '编辑采购订单' : '新建采购订单'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingOrder(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'PENDING' }}
        >
          <Form.Item
            name="supplier"
            label="供应商"
            rules={[{ required: true, message: '请选择供应商' }]}
          >
            <Select placeholder="请选择供应商">
              {supplierOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="supplierContact" label="联系人">
            <Input placeholder="请输入联系人" />
          </Form.Item>
          
          <Form.Item name="supplierPhone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          
          <Form.Item name="expectedDate" label="预计到货日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
          
          <Divider orientation="left">采购明细</Divider>
          
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'productId']}
                      label="产品"
                      rules={[{ required: true, message: '请选择产品' }]}
                    >
                      <Select placeholder="选择产品" style={{ width: 200 }}>
                        <Select.Option value="product1">电机 - 型号 A</Select.Option>
                        <Select.Option value="product2">电池 -72V</Select.Option>
                        <Select.Option value="product3">轮胎 -22 寸</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      label="数量"
                      rules={[{ required: true, message: '请输入数量' }]}
                    >
                      <InputNumber min={1} placeholder="数量" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'unitPrice']}
                      label="单价"
                      rules={[{ required: true, message: '请输入单价' }]}
                    >
                      <InputNumber min={0} precision={2} placeholder="单价" />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(name)}>删除</Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加明细
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="采购订单详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>关闭</Button>,
        ]}
        width={800}
      >
        {currentOrder && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="采购单号">{currentOrder.orderNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[currentOrder.status].color}>
                  {statusMap[currentOrder.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="供应商">{currentOrder.supplier}</Descriptions.Item>
              <Descriptions.Item label="联系人">{currentOrder.supplierContact || '-'}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{currentOrder.supplierPhone || '-'}</Descriptions.Item>
              <Descriptions.Item label="总金额">¥{currentOrder.totalAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {dayjs(currentOrder.createdAt).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="预计到货">
                {currentOrder.expectedDate ? dayjs(currentOrder.expectedDate).format('YYYY-MM-DD') : '-'}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider>采购明细</Divider>
            
            <Table
              dataSource={currentOrder.items}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                { title: '产品', dataIndex: 'productName', width: 200 },
                { title: '型号', dataIndex: 'productModel', width: 120 },
                { title: '数量', dataIndex: 'quantity', width: 80 },
                { title: '已收货', dataIndex: 'receivedQuantity', width: 80 },
                { title: '单价', dataIndex: 'unitPrice', width: 100, render: (v: number) => `¥${v.toFixed(2)}` },
                { title: '总价', dataIndex: 'totalPrice', width: 100, render: (v: number) => `¥${v.toLocaleString()}` },
              ]}
            />
            
            {currentOrder.remark && (
              <>
                <Divider>备注</Divider>
                <p>{currentOrder.remark}</p>
              </>
            )}
          </>
        )}
      </Modal>
    </>
  )
}
