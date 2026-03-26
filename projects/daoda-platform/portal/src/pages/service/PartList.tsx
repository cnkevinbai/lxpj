/**
 * 配件管理列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、库存调整功能
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Dropdown,
  Typography,
  Drawer,
  Descriptions,
  InputNumber,
  Badge,
  Statistic,
  Row,
  Col,
  Alert,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ShopOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  partService,
  Part,
  PartStatus,
  CreatePartDto,
  UpdatePartDto,
} from '@/services/service.service'
import dayjs from 'dayjs'

const { Link, Title } = Typography

// 状态映射
const statusMap: Record<PartStatus, { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '在售' },
  INACTIVE: { color: 'default', text: '停售' },
  OUT_OF_STOCK: { color: 'red', text: '缺货' },
}

// 库存状态
const getStockStatus = (part: Part) => {
  if (part.stock === 0) {
    return { color: 'red', text: '缺货', icon: <WarningOutlined /> }
  } else if (part.stock <= part.minStock) {
    return { color: 'orange', text: '预警', icon: <WarningOutlined /> }
  } else if (part.stock <= part.minStock * 2) {
    return { color: 'blue', text: '充足', icon: <ArrowUpOutlined /> }
  }
  return { color: 'green', text: '充裕', icon: <ArrowUpOutlined /> }
}

export default function PartList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [adjustForm] = Form.useForm()

  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    status: undefined as PartStatus | undefined,
    lowStock: false,
  })

  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })

  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [adjustModalVisible, setAdjustModalVisible] = useState(false)
  const [editingPart, setEditingPart] = useState<Part | null>(null)
  const [viewingPart, setViewingPart] = useState<Part | null>(null)
  const [adjustingPart, setAdjustingPart] = useState<Part | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 获取配件列表
  const { data, isLoading } = useQuery({
    queryKey: ['service-parts', filters, pagination],
    queryFn: () =>
      partService.getList({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters,
      }),
  })

  // 获取配件分类
  const { data: categories } = useQuery({
    queryKey: ['service-part-categories'],
    queryFn: () => partService.getCategories(),
  })

  // 获取配件统计
  const { data: partStats } = useQuery({
    queryKey: ['service-part-statistics'],
    queryFn: () => partService.getStatistics(),
    refetchInterval: 60000,
  })

  // 创建配件
  const createMutation = useMutation({
    mutationFn: (dto: CreatePartDto) => partService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['service-parts'] })
    },
  })

  // 更新配件
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePartDto }) => partService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingPart(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['service-parts'] })
    },
  })

  // 删除配件
  const deleteMutation = useMutation({
    mutationFn: (id: string) => partService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['service-parts'] })
    },
  })

  // 调整库存
  const adjustStockMutation = useMutation({
    mutationFn: ({ id, quantity, reason }: { id: string; quantity: number; reason: string }) =>
      partService.adjustStock(id, quantity, reason),
    onSuccess: () => {
      message.success('库存调整成功')
      setAdjustModalVisible(false)
      setAdjustingPart(null)
      adjustForm.resetFields()
      queryClient.invalidateQueries({ queryKey: ['service-parts'] })
    },
  })

  // 处理搜索
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  // 处理重置
  const handleReset = () => {
    setFilters({
      keyword: '',
      category: '',
      status: undefined,
      lowStock: false,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingPart(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: Part) => {
    setEditingPart(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  // 处理查看详情
  const handleView = (record: Part) => {
    setViewingPart(record)
    setDrawerVisible(true)
  }

  // 处理调整库存
  const handleAdjustStock = (record: Part) => {
    setAdjustingPart(record)
    adjustForm.resetFields()
    adjustForm.setFieldsValue({ currentStock: record.stock })
    setAdjustModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该配件吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingPart) {
        updateMutation.mutate({ id: editingPart.id, dto: values })
      } else {
        createMutation.mutate(values)
      }
    })
  }

  // 处理库存调整提交
  const handleAdjustSubmit = () => {
    adjustForm.validateFields(['quantity', 'reason']).then((values) => {
      if (adjustingPart) {
        adjustStockMutation.mutate({
          id: adjustingPart.id,
          quantity: values.quantity,
          reason: values.reason,
        })
      }
    })
  }

  // 表格列定义
  const columns: ColumnsType<Part> = [
    {
      title: '配件编号',
      dataIndex: 'code',
      width: 120,
      fixed: 'left',
      render: (text, record) => (
        <Link onClick={() => handleView(record)} style={{ color: '#1890ff' }}>
          {text}
        </Link>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 180,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      filters: categories?.map((c) => ({ text: c.name, value: c.code })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '单价',
      dataIndex: 'price',
      width: 100,
      render: (price: number) => `¥${price.toLocaleString()}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 90,
      render: (stock: number, record) => {
        const status = getStockStatus(record)
        return (
          <Badge color={status.color} text={<span style={{ fontWeight: stock <= record.minStock ? 'bold' : 'normal' }}>{stock}</span>} />
        )
      },
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: '最低库存',
      dataIndex: 'minStock',
      width: 90,
      sorter: (a, b) => a.minStock - b.minStock,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 70,
      render: (unit) => unit || '-',
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      width: 120,
      ellipsis: true,
      render: (supplier) => supplier || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: PartStatus) => <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>,
    },
    {
      title: '库存状态',
      key: 'stockStatus',
      width: 100,
      render: (_: any, record: Part) => {
        const status = getStockStatus(record)
        return (
          <Tag color={status.color} icon={status.icon}>
            {status.text}
          </Tag>
        )
      },
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'adjust',
                  label: '调整库存',
                  icon: <ShopOutlined />,
                  onClick: () => handleAdjustStock(record),
                },
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

  return (
    <>
      <Card
        title="配件库存管理"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建配件
            </Button>
          </Space>
        }
      >
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="配件总数"
                value={partStats?.total || 0}
                prefix={<ShopOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="库存总值"
                value={partStats?.totalValue || 0}
                precision={2}
                prefix="¥"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="库存预警"
                value={partStats?.lowStockCount || 0}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="缺货配件"
                value={partStats?.outOfStockCount || 0}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索配件编号/名称"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="配件分类"
              allowClear
              style={{ width: 150 }}
              value={filters.category}
              onChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
            >
              {categories?.map((cat) => (
                <Select.Option key={cat.code} value={cat.code}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            >
              <Select.Option value="ACTIVE">在售</Select.Option>
              <Select.Option value="INACTIVE">停售</Select.Option>
              <Select.Option value="OUT_OF_STOCK">缺货</Select.Option>
            </Select>
            <Select
              placeholder="库存筛选"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => setFilters((prev) => ({ ...prev, lowStock: value === 'low' }))}
            >
              <Select.Option value="low">库存预警</Select.Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={data?.list}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1400 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: data?.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingPart ? '编辑配件' : '新建配件'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingPart(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'ACTIVE', minStock: 10 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="配件编号"
                rules={[{ required: true, message: '请输入配件编号' }]}
              >
                <Input placeholder="请输入配件编号" disabled={!!editingPart} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="配件名称"
                rules={[{ required: true, message: '请输入配件名称' }]}
              >
                <Input placeholder="请输入配件名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="配件分类"
                rules={[{ required: true, message: '请选择配件分类' }]}
              >
                <Select placeholder="请选择配件分类">
                  <Select.Option value="ELECTRONIC">电子配件</Select.Option>
                  <Select.Option value="MECHANICAL">机械配件</Select.Option>
                  <Select.Option value="CONSUMABLE">耗材</Select.Option>
                  <Select.Option value="TOOL">工具</Select.Option>
                  <Select.Option value="OTHER">其他</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="unit" label="单位">
                <Select placeholder="请选择单位">
                  <Select.Option value="个">个</Select.Option>
                  <Select.Option value="件">件</Select.Option>
                  <Select.Option value="套">套</Select.Option>
                  <Select.Option value="台">台</Select.Option>
                  <Select.Option value="米">米</Select.Option>
                  <Select.Option value="kg">kg</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="单价"
                rules={[{ required: true, message: '请输入单价' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  prefix="¥"
                  min={0}
                  precision={2}
                  placeholder="请输入单价"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="stock"
                label="库存数量"
                rules={[{ required: true, message: '请输入库存数量' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入库存" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="minStock" label="最低库存">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="预警阈值" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="supplier" label="供应商">
            <Input placeholder="请输入供应商" />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 库存调整弹窗 */}
      <Modal
        title="调整库存"
        open={adjustModalVisible}
        onOk={handleAdjustSubmit}
        onCancel={() => {
          setAdjustModalVisible(false)
          setAdjustingPart(null)
          adjustForm.resetFields()
        }}
        confirmLoading={adjustStockMutation.isPending}
      >
        <Form form={adjustForm} layout="vertical">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="配件编号">{adjustingPart?.code}</Descriptions.Item>
            <Descriptions.Item label="配件名称">{adjustingPart?.name}</Descriptions.Item>
            <Descriptions.Item label="当前库存">{adjustingPart?.stock}</Descriptions.Item>
            <Descriptions.Item label="最低库存">{adjustingPart?.minStock}</Descriptions.Item>
          </Descriptions>

          <Form.Item
            name="quantity"
            label="调整数量"
            rules={[{ required: true, message: '请输入调整数量' }]}
            extra="正数表示入库，负数表示出库"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="正数入库，负数出库"
              min={adjustingPart ? -adjustingPart.stock : undefined}
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="调整原因"
            rules={[{ required: true, message: '请输入调整原因' }]}
          >
            <Select placeholder="请选择调整原因">
              <Select.Option value="PURCHASE">采购入库</Select.Option>
              <Select.Option value="RETURN">退货入库</Select.Option>
              <Select.Option value="USE">维修使用</Select.Option>
              <Select.Option value="DAMAGE">损坏报废</Select.Option>
              <Select.Option value="TRANSFER">调拨出库</Select.Option>
              <Select.Option value="INVENTORY">盘点调整</Select.Option>
              <Select.Option value="OTHER">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title={
          <Space>
            <span>{viewingPart?.code}</span>
            {viewingPart && (
              <Tag color={statusMap[viewingPart.status].color}>
                {statusMap[viewingPart.status].text}
              </Tag>
            )}
          </Space>
        }
        placement="right"
        width={720}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false)
          setViewingPart(null)
        }}
      >
        {viewingPart && (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="配件名称">{viewingPart.name}</Descriptions.Item>
              <Descriptions.Item label="配件分类">{viewingPart.category}</Descriptions.Item>
              <Descriptions.Item label="单价">¥{viewingPart.price.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="库存数量">
                <Badge
                  color={getStockStatus(viewingPart).color}
                  text={<span style={{ fontSize: 16, fontWeight: 'bold' }}>{viewingPart.stock}</span>}
                />
              </Descriptions.Item>
              <Descriptions.Item label="最低库存">{viewingPart.minStock}</Descriptions.Item>
              <Descriptions.Item label="单位">{viewingPart.unit || '-'}</Descriptions.Item>
              <Descriptions.Item label="供应商">{viewingPart.supplier || '-'}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[viewingPart.status].color}>
                  {statusMap[viewingPart.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="库存状态">
                <Tag color={getStockStatus(viewingPart).color} icon={getStockStatus(viewingPart).icon}>
                  {getStockStatus(viewingPart).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {dayjs(viewingPart.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {dayjs(viewingPart.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>

            {viewingPart.remark && (
              <>
                <Title level={5} style={{ marginTop: 24 }}>备注</Title>
                <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: 4 }}>
                  {viewingPart.remark}
                </div>
              </>
            )}

            {/* 库存预警提示 */}
            {viewingPart.stock <= viewingPart.minStock && (
              <Alert
                message="库存预警"
                description={
                  viewingPart.stock === 0
                    ? '该配件已缺货，请及时采购！'
                    : `当前库存低于最低库存 (${viewingPart.minStock})，建议及时补货。`
                }
                type={viewingPart.stock === 0 ? 'error' : 'warning'}
                showIcon
                style={{ marginTop: 16 }}
              />
            )}

            <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
              <Space>
                <Button onClick={() => handleEdit(viewingPart)} icon={<EditOutlined />}>
                  编辑
                </Button>
                <Button onClick={() => handleAdjustStock(viewingPart)} icon={<ShopOutlined />}>
                  调整库存
                </Button>
                <Button
                  danger
                  onClick={() => handleDelete(viewingPart.id)}
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              </Space>
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}
