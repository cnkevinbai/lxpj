/**
 * Webhook管理页面
 * 支持Webhook的创建、编辑、删除、测试、查看日志等功能
 */
import { useState } from 'react'
import { Table, Card, Button, Input, Modal, Form, message, Space, Switch, Tag, Typography, Divider, Descriptions, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExperimentOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { webhookService, Webhook, WEBHOOK_EVENTS } from '@/services/webhook.service'
import dayjs from 'dayjs'

const { Text } = Typography

// 事件标签颜色映射
const eventColorMap: Record<string, string> = {
  // CRM
  'customer.created': 'blue',
  'customer.updated': 'cyan',
  'lead.created': 'purple',
  'opportunity.won': 'gold',
  'order.created': 'green',
  
  // ERP
  'purchase.completed': 'orange',
  'production.started': 'pink',
  'inventory.low': 'red',
  
  // Finance
  'invoice.issued': 'magenta',
  'payment.received': 'lime',
}

// 获取事件标签
const renderEvents = (events: string[]) => {
  if (!events || events.length === 0) {
    return <Tag>无</Tag>
  }
  
  return (
    <Space size={[4, 8]} wrap>
      {events.map((event) => (
        <Tag key={event} color={eventColorMap[event] || 'default'}>
          {event.split('.')[1] || event}
        </Tag>
      ))}
    </Space>
  )
}

export default function WebhookManagement() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [logsModalVisible, setLogsModalVisible] = useState(false)
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [logsPagination, setLogsPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 获取Webhook列表
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['webhooks', filters, pagination],
    queryFn: () => webhookService.getAll(),
  })

  // 创建Webhook
  const createMutation = useMutation({
    mutationFn: (data: Partial<Webhook>) => webhookService.create(data),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
    },
  })

  // 更新Webhook
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Webhook> }) => 
      webhookService.update(id, data),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingWebhook(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
    },
  })

  // 删除Webhook
  const deleteMutation = useMutation({
    mutationFn: (id: string) => webhookService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
    },
  })

  // 测试Webhook
  const testMutation = useMutation({
    mutationFn: (id: string) => webhookService.test(id),
    onSuccess: (response) => {
      message.success(response.message || '测试成功')
    },
  })

  // 获取Webhook日志
  const getLogsMutation = useMutation({
    mutationFn: (id: string) => webhookService.getLogs(id),
    onSuccess: (response) => {
      setLogs(response || [])
      setLogsModalVisible(true)
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
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingWebhook(null)
    form.resetFields()
    form.setFieldsValue({
      enabled: true,
      events: [],
    })
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: Webhook) => {
    setEditingWebhook(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该Webhook吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 处理测试
  const handleTest = (id: string) => {
    testMutation.mutate(id)
  }

  // 处理查看日志
  const handleViewLogs = (record: Webhook) => {
    setSelectedWebhook(record)
    getLogsMutation.mutate(record.id)
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const webhookData = {
        ...values,
        events: values.events || [],
      }
      
      if (editingWebhook) {
        updateMutation.mutate({ id: editingWebhook.id, data: webhookData })
      } else {
        createMutation.mutate(webhookData)
      }
    })
  }

  // 处理状态切换
  const handleStatusChange = (record: Webhook, checked: boolean) => {
    updateMutation.mutate({
      id: record.id,
      data: { enabled: checked },
    })
  }

  // 列表事件
  const menuItems = [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: ({ key, domEvent }: { key: string; domEvent: React.MouseEvent }) => {
        domEvent.stopPropagation()
        if (selectedWebhook) {
          handleEdit(selectedWebhook)
        }
      },
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: ({ key, domEvent }: { key: string; domEvent: React.MouseEvent }) => {
        domEvent.stopPropagation()
        if (selectedWebhook) {
          handleDelete(selectedWebhook.id)
        }
      },
    },
  ]

  // 日志表格列定义
  const logColumns: ColumnsType<any> = [
    {
      title: '事件',
      dataIndex: 'event',
      width: 150,
      render: (event: string) => {
        const eventLabel = WEBHOOK_EVENTS.find(e => e.value === event)?.label || event
        return <Tag>{eventLabel}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'success',
      width: 100,
      render: (success: boolean) => (
        <Tag color={success ? 'green' : 'red'}>
          {success ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '状态码',
      dataIndex: 'statusCode',
      width: 90,
    },
    {
      title: '持续时间',
      dataIndex: 'duration',
      width: 100,
      render: (duration?: number) => duration ? `${duration}ms` : '-',
    },
    {
      title: '请求时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (createdAt: string) => 
        dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  // Webhook表格列定义
  const columns: ColumnsType<Webhook> = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      width: 250,
      ellipsis: true,
    },
    {
      title: '事件',
      dataIndex: 'events',
      width: 200,
      render: renderEvents,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      render: (enabled: boolean, record: Webhook) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleStatusChange(record, checked)}
          loading={updateMutation.isPending}
        />
      ),
    },
    {
      title: '失败次数',
      dataIndex: 'failureCount',
      width: 100,
      render: (failureCount: number) => (
        <Tag color={failureCount > 0 ? 'red' : 'default'}>
          {failureCount}
        </Tag>
      ),
    },
    {
      title: '最后触发',
      dataIndex: 'lastTriggeredAt',
      width: 170,
      render: (lastTriggeredAt?: string) => 
        lastTriggeredAt ? dayjs(lastTriggeredAt).format('YYYY-MM-DD HH:mm') : '从未',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 250,
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
            icon={<ExperimentOutlined />}
            onClick={() => handleTest(record.id)}
            loading={testMutation.isPending}
          >
            测试
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<ClockCircleOutlined />}
            onClick={() => handleViewLogs(record)}
          >
            日志
          </Button>
          <Button 
            type="link" 
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            loading={deleteMutation.isPending}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title="Webhook管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建Webhook
          </Button>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索Webhook名称"
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1400 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: data?.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
          }}
        />
      </Card>

      {/* 新建/编辑Webhook弹窗 */}
      <Modal
        title={editingWebhook ? '编辑Webhook' : '新建Webhook'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingWebhook(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入Webhook名称' }]}
          >
            <Input placeholder="例如：客户创建通知" />
          </Form.Item>
          
          <Form.Item
            name="url"
            label="URL"
            rules={[
              { required: true, message: '请输入URL' },
              { 
                type: 'url', 
                message: '请输入有效的URL地址' 
              },
            ]}
          >
            <Input placeholder="例如：https://api.example.com/webhook" />
          </Form.Item>
          
          <Form.Item
            name="secret"
            label="密钥（可选）"
            tooltip="用于验证请求来源的密钥"
          >
            <Input.Password placeholder="输入密钥" />
          </Form.Item>
          
          <Form.Item
            name="events"
            label="订阅事件"
            rules={[
              { required: true, message: '请选择至少一个事件' },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="请选择要订阅的事件"
              options={WEBHOOK_EVENTS.map(event => ({
                value: event.value,
                label: event.label,
              }))}
              maxTagCount="responsive"
            />
          </Form.Item>
          
          <Form.Item
            name="enabled"
            label="状态"
            valuePropName="checked"
            initialValue>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看日志弹窗 */}
      <Modal
        title={`Webhook日志 - ${selectedWebhook?.name}`}
        open={logsModalVisible}
        onCancel={() => {
          setLogsModalVisible(false)
          setLogs([])
          setSelectedWebhook(null)
        }}
        width={900}
        footer={null}
      >
        <Descriptions>
          <Descriptions.Item label="Webhook名称">{selectedWebhook?.name}</Descriptions.Item>
          <Descriptions.Item label="URL">{selectedWebhook?.url}</Descriptions.Item>
          <Descriptions.Item label="事件">{
            selectedWebhook?.events?.map(e => 
              WEBHOOK_EVENTS.find(we => we.value === e)?.label || e
            ).join('，')
          }</Descriptions.Item>
        </Descriptions>
        <Divider />
        <Table
          columns={logColumns}
          dataSource={logs}
          rowKey="id"
          pagination={{
            current: logsPagination.page,
            pageSize: logsPagination.pageSize,
            total: logs.length,
            showSizeChanger: true,
            onChange: (page, pageSize) => setLogsPagination({ page, pageSize }),
          }}
        />
      </Modal>
    </>
  )
}
