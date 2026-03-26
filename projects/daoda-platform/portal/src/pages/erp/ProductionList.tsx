/**
 * 生产管理列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、进度更新、导出功能
 * 实现完整的生产工单 CRUD 操作
 */
import { useState } from 'react'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Dropdown, Typography, InputNumber, DatePicker, Progress, Descriptions, Divider, Steps } from 'antd'
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, DeleteOutlined, MoreOutlined, PlayCircleOutlined, PauseCircleOutlined, CheckCircleOutlined, EyeOutlined, ThunderboltOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  productionService, 
  ProductionOrder, 
  ProductionStatus,
  CreateProductionOrderDto, 
  UpdateProductionOrderDto,
  ProductionOrderQueryParams,
} from '@/services/production.service'
import dayjs from 'dayjs'

const { Text } = Typography

// ==================== 常量定义 ====================

/**
 * 生产状态映射
 * 定义不同状态的颜色和显示文本
 */
const statusMap: Record<ProductionStatus, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待生产' },
  PLANNED: { color: 'blue', text: '已计划' },
  IN_PROGRESS: { color: 'cyan', text: '生产中' },
  PAUSED: { color: 'gold', text: '已暂停' },
  COMPLETED: { color: 'green', text: '已完成' },
  CANCELLED: { color: 'red', text: '已取消' },
}

/**
 * 产品选项（实际应从后端获取）
 */
const productOptions = [
  { label: 'DD-6 观光车', value: 'product1' },
  { label: 'DD-G4 高尔夫车', value: 'product2' },
  { label: 'DD-8 巡逻车', value: 'product3' },
  { label: 'DD-H2 货车', value: 'product4' },
]

// ==================== 主组件 ====================

export default function ProductionList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [detailForm] = Form.useForm()
  const [progressForm] = Form.useForm()
  
  // 筛选条件状态
  const [filters, setFilters] = useState<ProductionOrderQueryParams>({
    keyword: '',
    status: undefined,
    productId: undefined,
  })
  
  // 分页状态
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制状态
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [progressModalVisible, setProgressModalVisible] = useState(false)
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [currentOrder, setCurrentOrder] = useState<ProductionOrder | null>(null)

  // ==================== React Query 数据获取 ====================

  /**
   * 获取生产工单列表
   * 依赖筛选条件和分页参数，自动触发重新获取
   */
  const { data, isLoading } = useQuery({
    queryKey: ['production-orders', filters, pagination],
    queryFn: () => productionService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // ==================== React Query 数据变更 ====================

  /**
   * 创建生产工单
   * 成功后刷新列表并关闭弹窗
   */
  const createMutation = useMutation({
    mutationFn: (dto: CreateProductionOrderDto) => productionService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['production-orders'] })
    },
  })

  /**
   * 更新生产工单
   * 成功后刷新列表并关闭弹窗
   */
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductionOrderDto }) => 
      productionService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingOrder(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['production-orders'] })
    },
  })

  /**
   * 删除生产工单
   * 成功后刷新列表
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => productionService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['production-orders'] })
    },
  })

  /**
   * 批量删除生产工单
   * 成功后刷新列表并清空选择
   */
  const batchDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => productionService.batchDelete(ids),
    onSuccess: () => {
      message.success('批量删除成功')
      setSelectedRowKeys([])
      queryClient.invalidateQueries({ queryKey: ['production-orders'] })
    },
  })

  /**
   * 开始生产
   * 成功后刷新列表
   */
  const startMutation = useMutation({
    mutationFn: (id: string) => productionService.startProduction(id),
    onSuccess: () => {
      message.success('生产已启动')
      queryClient.invalidateQueries({ queryKey: ['production-orders'] })
    },
  })

  /**
   * 暂停生产
   * 成功后刷新列表
   */
  const pauseMutation = useMutation({
    mutationFn: (id: string) => productionService.pauseProduction(id),
    onSuccess: () => {
      message.success('生产已暂停')
      queryClient.invalidateQueries({ queryKey: ['production-orders'] })
    },
  })

  /**
   * 完成生产
   * 成功后刷新列表
   */
  const completeMutation = useMutation({
    mutationFn: (id: string) => productionService.completeProduction(id),
    onSuccess: () => {
      message.success('生产已完成')
      queryClient.invalidateQueries({ queryKey: ['production-orders'] })
    },
  })

  /**
   * 更新进度
   * 成功后刷新列表并关闭弹窗
   */
  const progressMutation = useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) => 
      productionService.updateProgress(id, progress),
    onSuccess: () => {
      message.success('进度已更新')
      setProgressModalVisible(false)
      progressForm.resetFields()
      queryClient.invalidateQueries({ queryKey: ['production-orders'] })
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
      productId: undefined,
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
  const handleEdit = (record: ProductionOrder) => {
    setEditingOrder(record)
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
    })
    setModalVisible(true)
  }

  /**
   * 处理查看详情
   * 设置当前订单并打开详情弹窗
   */
  const handleViewDetail = (record: ProductionOrder) => {
    setCurrentOrder(record)
    setDetailModalVisible(true)
  }

  /**
   * 处理更新进度
   * 设置当前订单并打开进度弹窗
   */
  const handleUpdateProgress = (record: ProductionOrder) => {
    setCurrentOrder(record)
    progressForm.setFieldsValue({ progress: record.progress })
    setProgressModalVisible(true)
  }

  /**
   * 处理删除
   * 显示确认对话框，用户确认后执行删除
   */
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该生产工单吗？此操作不可恢复。',
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
   * 处理开始生产
   * 显示确认对话框，用户确认后执行
   */
  const handleStart = (id: string) => {
    Modal.confirm({
      title: '确认开始生产',
      content: '确定要开始该工单的生产吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => startMutation.mutate(id),
    })
  }

  /**
   * 处理暂停生产
   * 显示确认对话框，用户确认后执行
   */
  const handlePause = (id: string) => {
    Modal.confirm({
      title: '确认暂停生产',
      content: '确定要暂停该工单的生产吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => pauseMutation.mutate(id),
    })
  }

  /**
   * 处理完成生产
   * 显示确认对话框，用户确认后执行
   */
  const handleComplete = (id: string) => {
    Modal.confirm({
      title: '确认完成生产',
      content: '确定要标记该工单为已完成吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => completeMutation.mutate(id),
    })
  }

  /**
   * 处理提交
   * 表单验证通过后执行创建或更新
   */
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const dto: CreateProductionOrderDto = {
        productId: values.productId,
        quantity: values.quantity,
        startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : undefined,
        endDate: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : undefined,
        remark: values.remark,
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
    
    const url = `${apiUrl}/production-orders/export?${queryString}`
    
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
        a.download = `生产工单_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
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

  const columns: ColumnsType<ProductionOrder> = [
    {
      title: '工单号',
      dataIndex: 'orderNo',
      width: 140,
      fixed: 'left',
      render: (orderNo: string) => <Text strong>{orderNo}</Text>,
    },
    { 
      title: '产品', 
      dataIndex: 'productName', 
      width: 180,
      ellipsis: true,
    },
    { 
      title: '型号', 
      dataIndex: 'productModel', 
      width: 120,
      ellipsis: true,
    },
    { 
      title: '计划数量', 
      dataIndex: 'quantity', 
      width: 100,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    { 
      title: '已完成', 
      dataIndex: 'completedQuantity', 
      width: 100,
      render: (completed: number, record: ProductionOrder) => (
        <Text type={completed >= record.quantity ? 'success' : undefined}>
          {completed}
        </Text>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      width: 150,
      sorter: (a, b) => a.progress - b.progress,
      render: (progress: number) => (
        <Progress 
          percent={progress} 
          size="small"
          strokeColor={progress >= 100 ? '#52c41a' : '#1890ff'}
        />
      ),
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
      render: (status: ProductionStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: '计划开始',
      dataIndex: 'startDate',
      width: 110,
      render: (date?: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
    },
    {
      title: '计划结束',
      dataIndex: 'endDate',
      width: 110,
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
      width: 320,
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
          {record.status === 'PENDING' || record.status === 'PLANNED' ? (
            <Button 
              type="link" 
              size="small"
              icon={<PlayCircleOutlined />}
              style={{ color: '#52c41a' }}
              onClick={() => handleStart(record.id)}
            >
              开始
            </Button>
          ) : record.status === 'IN_PROGRESS' ? (
            <Button 
              type="link" 
              size="small"
              icon={<PauseCircleOutlined />}
              style={{ color: '#faad14' }}
              onClick={() => handlePause(record.id)}
            >
              暂停
            </Button>
          ) : null}
          {record.status === 'IN_PROGRESS' && (
            <Button 
              type="link" 
              size="small"
              icon={<ThunderboltOutlined />}
              onClick={() => handleUpdateProgress(record)}
            >
              进度
            </Button>
          )}
          {record.status === 'IN_PROGRESS' && (
            <Button 
              type="link" 
              size="small"
              icon={<CheckCircleOutlined />}
              style={{ color: '#52c41a' }}
              onClick={() => handleComplete(record.id)}
            >
              完成
            </Button>
          )}
          {record.status !== 'COMPLETED' && record.status !== 'CANCELLED' && (
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
        title="生产工单"
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
              新建工单
            </Button>
          </Space>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索工单号/产品名称"
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
              placeholder="产品"
              allowClear
              style={{ width: 180 }}
              value={filters.productId}
              onChange={value => setFilters(prev => ({ ...prev, productId: value }))}
            >
              {productOptions.map(option => (
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
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          summary={pageData => {
            let totalQuantity = 0
            let completedQuantity = 0
            let inProgressCount = 0
            pageData.forEach(({ quantity, completedQuantity: completed, status }) => {
              totalQuantity += quantity
              completedQuantity += completed
              if (status === 'IN_PROGRESS') {
                inProgressCount++
              }
            })
            const overallProgress = totalQuantity > 0 
              ? Math.round((completedQuantity / totalQuantity) * 100) 
              : 0
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <Text strong>本页合计</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <Text strong>{totalQuantity}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <Text strong>{completedQuantity}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    <Progress percent={overallProgress} size="small" />
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6} colSpan={4}>
                    {inProgressCount > 0 && (
                      <Text type="secondary">
                        {inProgressCount} 个生产中
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
        title={editingOrder ? '编辑生产工单' : '新建生产工单'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingOrder(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'PENDING' }}
        >
          <Form.Item
            name="productId"
            label="产品"
            rules={[{ required: true, message: '请选择产品' }]}
          >
            <Select placeholder="请选择产品">
              {productOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="quantity"
            label="计划生产数量"
            rules={[{ required: true, message: '请输入生产数量' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入生产数量" />
          </Form.Item>
          
          <Form.Item name="startDate" label="计划开始日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="endDate" label="计划结束日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="生产工单详情"
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
              <Descriptions.Item label="工单号">{currentOrder.orderNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[currentOrder.status].color}>
                  {statusMap[currentOrder.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="产品">{currentOrder.productName}</Descriptions.Item>
              <Descriptions.Item label="型号">{currentOrder.productModel || '-'}</Descriptions.Item>
              <Descriptions.Item label="计划数量">{currentOrder.quantity}</Descriptions.Item>
              <Descriptions.Item label="已完成">{currentOrder.completedQuantity}</Descriptions.Item>
              <Descriptions.Item label="进度" span={2}>
                <Progress percent={currentOrder.progress} />
              </Descriptions.Item>
              <Descriptions.Item label="计划开始">
                {currentOrder.startDate ? dayjs(currentOrder.startDate).format('YYYY-MM-DD') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="计划结束">
                {currentOrder.endDate ? dayjs(currentOrder.endDate).format('YYYY-MM-DD') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="实际开始">
                {currentOrder.actualStartDate ? dayjs(currentOrder.actualStartDate).format('YYYY-MM-DD HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="实际结束">
                {currentOrder.actualEndDate ? dayjs(currentOrder.actualEndDate).format('YYYY-MM-DD HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {dayjs(currentOrder.createdAt).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {dayjs(currentOrder.updatedAt).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
            </Descriptions>
            
            {currentOrder.remark && (
              <>
                <Divider>备注</Divider>
                <p>{currentOrder.remark}</p>
              </>
            )}
            
            <Divider>生产流程</Divider>
            <Steps
              current={
                currentOrder.status === 'PENDING' ? 0 :
                currentOrder.status === 'PLANNED' ? 1 :
                currentOrder.status === 'IN_PROGRESS' || currentOrder.status === 'PAUSED' ? 2 :
                currentOrder.status === 'COMPLETED' ? 3 : -1
              }
              items={[
                { title: '待生产', description: '等待排产' },
                { title: '已计划', description: '已安排生产' },
                { title: '生产中', description: '正在生产' },
                { title: '已完成', description: '生产完成' },
              ]}
            />
          </>
        )}
      </Modal>

      {/* 进度更新弹窗 */}
      <Modal
        title="更新生产进度"
        open={progressModalVisible}
        onOk={() => {
          progressForm.validateFields().then(values => {
            if (currentOrder) {
              progressMutation.mutate({ id: currentOrder.id, progress: values.progress })
            }
          })
        }}
        onCancel={() => {
          setProgressModalVisible(false)
          progressForm.resetFields()
        }}
        confirmLoading={progressMutation.isPending}
        width={500}
      >
        <Form form={progressForm} layout="vertical">
          <Form.Item
            name="progress"
            label="完成进度"
            rules={[{ required: true, message: '请输入进度' }]}
          >
            <InputNumber<number> 
              min={0} 
              max={100} 
              style={{ width: '100%' }} 
              formatter={value => `${value}%`}
              parser={value => parseInt(value?.replace('%', '') || '0', 10)}
            />
          </Form.Item>
          <Form.Item label="当前状态">
            <Text>{currentOrder?.progress}%</Text>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
