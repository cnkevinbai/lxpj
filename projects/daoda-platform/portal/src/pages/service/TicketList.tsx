/**
 * 工单管理列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、状态流转功能
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
  Timeline,
  Upload,
  Image,
  Popconfirm,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ticketService,
  ServiceTicket,
  TicketPriority,
  TicketStatus,
  TicketType,
  CreateTicketDto,
  UpdateTicketDto,
} from '@/services/service.service'
import dayjs from 'dayjs'

const { Text, Link, Title } = Typography

// 工单类型映射
const typeMap: Record<TicketType, { color: string; text: string }> = {
  REPAIR: { color: 'red', text: '维修' },
  MAINTENANCE: { color: 'blue', text: '保养' },
  INSTALLATION: { color: 'green', text: '安装' },
  CONSULTATION: { color: 'purple', text: '咨询' },
  COMPLAINT: { color: 'orange', text: '投诉' },
}

// 优先级映射
const priorityMap: Record<TicketPriority, { color: string; text: string }> = {
  URGENT: { color: 'red', text: '紧急' },
  HIGH: { color: 'orange', text: '高' },
  NORMAL: { color: 'blue', text: '普通' },
  LOW: { color: 'default', text: '低' },
}

// 状态映射
const statusMap: Record<TicketStatus, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待处理' },
  ASSIGNED: { color: 'blue', text: '已分配' },
  PROCESSING: { color: 'cyan', text: '处理中' },
  COMPLETED: { color: 'green', text: '已完成' },
  CLOSED: { color: 'default', text: '已关闭' },
}

export default function TicketList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()

  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as TicketStatus | undefined,
    priority: undefined as TicketPriority | undefined,
    type: undefined as TicketType | undefined,
  })

  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })

  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [editingTicket, setEditingTicket] = useState<ServiceTicket | null>(null)
  const [viewingTicket, setViewingTicket] = useState<ServiceTicket | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 获取工单列表
  const { data, isLoading } = useQuery({
    queryKey: ['service-tickets', filters, pagination],
    queryFn: () =>
      ticketService.getList({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters,
      }),
  })

  // 获取工单类型
  const { data: ticketTypes } = useQuery({
    queryKey: ['service-ticket-types'],
    queryFn: () => ticketService.getTypes(),
  })

  // 创建工单
  const createMutation = useMutation({
    mutationFn: (dto: CreateTicketDto) => ticketService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['service-tickets'] })
    },
  })

  // 更新工单
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTicketDto }) => ticketService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingTicket(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['service-tickets'] })
    },
  })

  // 删除工单
  const deleteMutation = useMutation({
    mutationFn: (id: string) => ticketService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['service-tickets'] })
    },
  })

  // 分配工单
  const assignMutation = useMutation({
    mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string }) =>
      ticketService.assign(id, assigneeId),
    onSuccess: () => {
      message.success('分配成功')
      queryClient.invalidateQueries({ queryKey: ['service-tickets'] })
    },
  })

  // 开始处理
  const startProcessingMutation = useMutation({
    mutationFn: (id: string) => ticketService.startProcessing(id),
    onSuccess: () => {
      message.success('已开始处理')
      queryClient.invalidateQueries({ queryKey: ['service-tickets'] })
    },
  })

  // 完成工单
  const completeMutation = useMutation({
    mutationFn: ({ id, solution }: { id: string; solution: string }) =>
      ticketService.complete(id, solution),
    onSuccess: () => {
      message.success('工单已完成')
      queryClient.invalidateQueries({ queryKey: ['service-tickets'] })
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
      status: undefined,
      priority: undefined,
      type: undefined,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingTicket(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: ServiceTicket) => {
    setEditingTicket(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  // 处理查看详情
  const handleView = (record: ServiceTicket) => {
    setViewingTicket(record)
    setDrawerVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该工单吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingTicket) {
        updateMutation.mutate({ id: editingTicket.id, dto: values })
      } else {
        createMutation.mutate(values)
      }
    })
  }

  // 表格列定义
  const columns: ColumnsType<ServiceTicket> = [
    {
      title: '工单号',
      dataIndex: 'ticketNo',
      width: 120,
      fixed: 'left',
      render: (text, record) => (
        <Link onClick={() => handleView(record)} style={{ color: '#1890ff' }}>
          {text}
        </Link>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 90,
      render: (type: TicketType) => <Tag color={typeMap[type].color}>{typeMap[type].text}</Tag>,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      render: (priority: TicketPriority) => (
        <Tag color={priorityMap[priority].color}>{priorityMap[priority].text}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: TicketStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assigneeName',
      width: 100,
      render: (name) => name || <Text type="secondary">未分配</Text>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
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
                  key: 'start',
                  label: '开始处理',
                  icon: <ClockCircleOutlined />,
                  disabled: record.status !== 'PENDING' && record.status !== 'ASSIGNED',
                  onClick: () => startProcessingMutation.mutate(record.id),
                },
                {
                  key: 'complete',
                  label: '标记完成',
                  icon: <CheckCircleOutlined />,
                  disabled: record.status !== 'PROCESSING',
                  onClick: () => {
                    const solution = window.prompt('请输入解决方案：')
                    if (solution) {
                      completeMutation.mutate({ id: record.id, solution })
                    }
                  },
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
        title="服务工单管理"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建工单
            </Button>
          </Space>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索工单号/标题/客户"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="工单类型"
              allowClear
              style={{ width: 120 }}
              value={filters.type}
              onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
            >
              {ticketTypes?.map((type) => (
                <Select.Option key={type} value={type}>
                  {typeMap[type]?.text || type}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="优先级"
              allowClear
              style={{ width: 120 }}
              value={filters.priority}
              onChange={(value) => setFilters((prev) => ({ ...prev, priority: value }))}
            >
              <Select.Option value="URGENT">紧急</Select.Option>
              <Select.Option value="HIGH">高</Select.Option>
              <Select.Option value="NORMAL">普通</Select.Option>
              <Select.Option value="LOW">低</Select.Option>
            </Select>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            >
              <Select.Option value="PENDING">待处理</Select.Option>
              <Select.Option value="ASSIGNED">已分配</Select.Option>
              <Select.Option value="PROCESSING">处理中</Select.Option>
              <Select.Option value="COMPLETED">已完成</Select.Option>
              <Select.Option value="CLOSED">已关闭</Select.Option>
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
        title={editingTicket ? '编辑工单' : '新建工单'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingTicket(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form form={form} layout="vertical" initialValues={{ priority: 'NORMAL', type: 'REPAIR' }}>
          <Form.Item
            name="customerId"
            label="客户"
            rules={[{ required: true, message: '请选择客户' }]}
          >
            <Select placeholder="请选择客户" showSearch optionFilterProp="children">
              {/* TODO: 从客户列表加载 */}
              <Select.Option value="customer-1">北京景区</Select.Option>
              <Select.Option value="customer-2">上海高尔夫</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="工单标题"
            rules={[{ required: true, message: '请输入工单标题' }]}
          >
            <Input placeholder="请输入工单标题" />
          </Form.Item>

          <Form.Item name="type" label="工单类型" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="REPAIR">维修</Select.Option>
              <Select.Option value="MAINTENANCE">保养</Select.Option>
              <Select.Option value="INSTALLATION">安装</Select.Option>
              <Select.Option value="CONSULTATION">咨询</Select.Option>
              <Select.Option value="COMPLAINT">投诉</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="priority" label="优先级">
            <Select>
              <Select.Option value="URGENT">紧急</Select.Option>
              <Select.Option value="HIGH">高</Select.Option>
              <Select.Option value="NORMAL">普通</Select.Option>
              <Select.Option value="LOW">低</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="问题描述"
            rules={[{ required: true, message: '请输入问题描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请详细描述问题" />
          </Form.Item>

          <Form.Item name="images" label="图片附件">
            <Upload listType="picture-card" multiple>
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title={
          <Space>
            <span>{viewingTicket?.ticketNo}</span>
            {viewingTicket && (
              <Tag color={statusMap[viewingTicket.status].color}>
                {statusMap[viewingTicket.status].text}
              </Tag>
            )}
          </Space>
        }
        placement="right"
        width={720}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false)
          setViewingTicket(null)
        }}
      >
        {viewingTicket && (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="工单标题">{viewingTicket.title}</Descriptions.Item>
              <Descriptions.Item label="客户">{viewingTicket.customerName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{viewingTicket.contactPhone || '-'}</Descriptions.Item>
              <Descriptions.Item label="工单类型">
                <Tag color={typeMap[viewingTicket.type].color}>{typeMap[viewingTicket.type].text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={priorityMap[viewingTicket.priority].color}>
                  {priorityMap[viewingTicket.priority].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[viewingTicket.status].color}>
                  {statusMap[viewingTicket.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="负责人">
                {viewingTicket.assigneeName || '未分配'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {dayjs(viewingTicket.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {dayjs(viewingTicket.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              {viewingTicket.closedAt && (
                <Descriptions.Item label="完成时间">
                  {dayjs(viewingTicket.closedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Title level={5} style={{ marginTop: 24 }}>问题描述</Title>
            <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: 4, marginBottom: 16 }}>
              {viewingTicket.description}
            </div>

            {viewingTicket.solution && (
              <>
                <Title level={5}>解决方案</Title>
                <div style={{ padding: '12px', background: '#f6ffed', borderRadius: 4, marginBottom: 16 }}>
                  {viewingTicket.solution}
                </div>
              </>
            )}

            {viewingTicket.images && viewingTicket.images.length > 0 && (
              <>
                <Title level={5}>附件图片</Title>
                <Space wrap>
                  {viewingTicket.images.map((img, idx) => (
                    <Image key={idx} width={100} height={100} src={img} style={{ objectFit: 'cover' }} />
                  ))}
                </Space>
              </>
            )}

            <Title level={5} style={{ marginTop: 24 }}>处理记录</Title>
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <Text strong>工单创建</Text>
                      <div>
                        <Text type="secondary">
                          {dayjs(viewingTicket.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                        </Text>
                      </div>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <Text strong>工单分配</Text>
                      <div>
                        <Text>分配给：{viewingTicket.assigneeName || '未分配'}</Text>
                      </div>
                    </div>
                  ),
                },
                {
                  color: 'cyan',
                  children: (
                    <div>
                      <Text strong>开始处理</Text>
                      <div>
                        <Text type="secondary">处理中...</Text>
                      </div>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  children: (
                    <div>
                      <Text strong>工单完成</Text>
                      <div>
                        <Text type="secondary">
                          {viewingTicket.closedAt
                            ? dayjs(viewingTicket.closedAt).format('YYYY-MM-DD HH:mm:ss')
                            : '待完成'}
                        </Text>
                      </div>
                    </div>
                  ),
                },
              ]}
            />

            <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
              <Space>
                <Button onClick={() => handleEdit(viewingTicket)} icon={<EditOutlined />}>
                  编辑
                </Button>
                {viewingTicket.status === 'PENDING' && (
                  <Button
                    type="primary"
                    onClick={() => startProcessingMutation.mutate(viewingTicket.id)}
                    icon={<ClockCircleOutlined />}
                  >
                    开始处理
                  </Button>
                )}
                {viewingTicket.status === 'PROCESSING' && (
                  <Button
                    type="primary"
                    onClick={() => {
                      const solution = window.prompt('请输入解决方案：')
                      if (solution) {
                        completeMutation.mutate({ id: viewingTicket.id, solution })
                      }
                    }}
                    icon={<CheckCircleOutlined />}
                  >
                    标记完成
                  </Button>
                )}
                <Popconfirm
                  title="确定删除该工单吗？"
                  onConfirm={() => handleDelete(viewingTicket.id)}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button danger icon={<DeleteOutlined />}>删除</Button>
                </Popconfirm>
              </Space>
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}
