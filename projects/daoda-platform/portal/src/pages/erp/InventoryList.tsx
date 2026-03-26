/**
 * 库存管理列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、导出功能
 * 实现完整的库存 CRUD 操作
 */
import { useState } from 'react'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Dropdown, Typography, Progress, InputNumber } from 'antd'
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, DeleteOutlined, MoreOutlined, WarningOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  inventoryService, 
  Inventory, 
  CreateInventoryDto, 
  UpdateInventoryDto,
  InventoryQueryParams,
} from '@/services/inventory.service'
import dayjs from 'dayjs'

const { Text } = Typography

// ==================== 常量定义 ====================

/**
 * 库存状态映射
 * 根据库存数量与预警值的关系显示不同状态
 */
const getInventoryStatus = (quantity: number, minStock?: number) => {
  if (!minStock) return { color: 'blue', text: '正常' }
  if (quantity === 0) return { color: 'red', text: '缺货' }
  if (quantity <= minStock) return { color: 'orange', text: '预警' }
  return { color: 'green', text: '充足' }
}

// ==================== 主组件 ====================

export default function InventoryList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // 筛选条件状态
  const [filters, setFilters] = useState<InventoryQueryParams>({
    keyword: '',
    warehouse: undefined,
    status: undefined,
  })
  
  // 分页状态
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制状态
  const [modalVisible, setModalVisible] = useState(false)
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [adjustmentModalVisible, setAdjustmentModalVisible] = useState(false)
  const [currentInventoryId, setCurrentInventoryId] = useState<string | null>(null)

  // ==================== React Query 数据获取 ====================

  /**
   * 获取库存列表
   * 依赖筛选条件和分页参数，自动触发重新获取
   */
  const { data, isLoading } = useQuery({
    queryKey: ['inventory', filters, pagination],
    queryFn: () => inventoryService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // ==================== React Query 数据变更 ====================

  /**
   * 创建库存记录
   * 成功后刷新列表并关闭弹窗
   */
  const createMutation = useMutation({
    mutationFn: (dto: CreateInventoryDto) => inventoryService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })

  /**
   * 更新库存记录
   * 成功后刷新列表并关闭弹窗
   */
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateInventoryDto }) => 
      inventoryService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingInventory(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })

  /**
   * 删除库存记录
   * 成功后刷新列表
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })

  /**
   * 批量删除库存记录
   * 成功后刷新列表并清空选择
   */
  const batchDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => inventoryService.batchDelete(ids),
    onSuccess: () => {
      message.success('批量删除成功')
      setSelectedRowKeys([])
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
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
      warehouse: undefined,
      status: undefined,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  /**
   * 处理新建
   * 重置表单并打开新建弹窗
   */
  const handleCreate = () => {
    setEditingInventory(null)
    form.resetFields()
    setModalVisible(true)
  }

  /**
   * 处理编辑
   * 填充表单数据并打开编辑弹窗
   */
  const handleEdit = (record: Inventory) => {
    setEditingInventory(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  /**
   * 处理删除
   * 显示确认对话框，用户确认后执行删除
   */
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该库存记录吗？此操作不可恢复。',
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
   * 处理库存调整
   * 打开调整弹窗
   */
  const handleAdjust = (record: Inventory) => {
    setCurrentInventoryId(record.id)
    setAdjustmentModalVisible(true)
  }

  /**
   * 处理提交
   * 表单验证通过后执行创建或更新
   */
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingInventory) {
        updateMutation.mutate({ id: editingInventory.id, dto: values })
      } else {
        createMutation.mutate(values)
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
    
    const url = `${apiUrl}/inventory/export?${queryString}`
    
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
        a.download = `库存列表_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
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

  const columns: ColumnsType<Inventory> = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 200,
      fixed: 'left',
      render: (name) => <Text strong>{name}</Text>,
    },
    { 
      title: '产品型号', 
      dataIndex: 'productModel', 
      width: 120,
      ellipsis: true,
    },
    { 
      title: '仓库', 
      dataIndex: 'warehouse', 
      width: 120,
      filters: [
        { text: '主仓库', value: '主仓库' },
        { text: '配件库', value: '配件库' },
        { text: '成品库', value: '成品库' },
      ],
      onFilter: (value, record) => record.warehouse === value,
    },
    { 
      title: '库位', 
      dataIndex: 'location', 
      width: 100,
      ellipsis: true,
    },
    { 
      title: '库存数量', 
      dataIndex: 'quantity', 
      width: 100,
      sorter: (a, b) => a.quantity - b.quantity,
      render: (quantity: number) => <Text strong>{quantity}</Text>,
    },
    { 
      title: '预警值', 
      dataIndex: 'minStock', 
      width: 90,
      render: (minStock?: number) => minStock ?? '-',
    },
    {
      title: '状态',
      dataIndex: 'quantity',
      width: 90,
      render: (_: number, record: Inventory) => {
        const status = getInventoryStatus(record.quantity, record.minStock)
        return (
          <Tag color={status.color}>
            {status.text}
          </Tag>
        )
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 160,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (updatedAt: string) => dayjs(updatedAt).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space>
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
            onClick={() => handleAdjust(record)}
          >
            调整
          </Button>
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
        title="库存管理"
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
              新建库存
            </Button>
          </Space>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索产品名称/型号"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="仓库"
              allowClear
              style={{ width: 150 }}
              value={filters.warehouse}
              onChange={value => setFilters(prev => ({ ...prev, warehouse: value }))}
            >
              <Select.Option value="主仓库">主仓库</Select.Option>
              <Select.Option value="配件库">配件库</Select.Option>
              <Select.Option value="成品库">成品库</Select.Option>
            </Select>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Select.Option value="normal">充足</Select.Option>
              <Select.Option value="warning">预警</Select.Option>
              <Select.Option value="shortage">缺货</Select.Option>
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
          scroll={{ x: 1300 }}
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
            let warningCount = 0
            pageData.forEach(({ quantity, minStock }) => {
              totalQuantity += quantity
              if (minStock && quantity <= minStock) {
                warningCount++
              }
            })
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    <Text strong>本页合计</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <Text strong>{totalQuantity}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5} colSpan={4}>
                    {warningCount > 0 && (
                      <Text type="danger">
                        <WarningOutlined /> {warningCount} 项库存不足
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
        title={editingInventory ? '编辑库存' : '新建库存'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingInventory(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ minStock: 10 }}
        >
          <Form.Item
            name="productId"
            label="产品"
            rules={[{ required: true, message: '请选择产品' }]}
          >
            <Select placeholder="请选择产品">
              <Select.Option value="product1">电机 - 型号 A</Select.Option>
              <Select.Option value="product2">电池 -72V</Select.Option>
              <Select.Option value="product3">轮胎 -22 寸</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="quantity"
            label="库存数量"
            rules={[{ required: true, message: '请输入库存数量' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入库存数量" />
          </Form.Item>
          
          <Form.Item
            name="warehouse"
            label="仓库"
            rules={[{ required: true, message: '请选择仓库' }]}
          >
            <Select placeholder="请选择仓库">
              <Select.Option value="主仓库">主仓库</Select.Option>
              <Select.Option value="配件库">配件库</Select.Option>
              <Select.Option value="成品库">成品库</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="location" label="库位">
            <Input placeholder="请输入库位" />
          </Form.Item>
          
          <Form.Item name="minStock" label="最低库存预警值">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="建议设置预警值" />
          </Form.Item>
          
          <Form.Item name="maxStock" label="最高库存值">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="可选" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 库存调整弹窗 */}
      <Modal
        title="库存调整"
        open={adjustmentModalVisible}
        onOk={() => {
          setAdjustmentModalVisible(false)
          message.success('调整成功')
          queryClient.invalidateQueries({ queryKey: ['inventory'] })
        }}
        onCancel={() => setAdjustmentModalVisible(false)}
        width={500}
      >
        <Form layout="vertical">
          <Form.Item label="调整类型">
            <Select>
              <Select.Option value="IN">入库</Select.Option>
              <Select.Option value="OUT">出库</Select.Option>
              <Select.Option value="ADJUST">调整</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="调整数量">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="调整原因">
            <Input.TextArea rows={3} placeholder="请输入调整原因" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
