/**
 * 客户列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、导出功能
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Dropdown, Typography } from 'antd'
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerService, Customer, CustomerLevel, CustomerStatus, CreateCustomerDto, UpdateCustomerDto } from '@/services/customer.service'
import dayjs from 'dayjs'

const { Text } = Typography

// 客户级别映射
const levelMap: Record<CustomerLevel, { color: string; text: string }> = {
  A: { color: 'gold', text: 'A 级' },
  B: { color: 'blue', text: 'B 级' },
  C: { color: 'default', text: 'C 级' },
}

// 客户状态映射
const statusMap: Record<CustomerStatus, { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '活跃' },
  INACTIVE: { color: 'orange', text: '待跟进' },
  LOST: { color: 'red', text: '流失' },
}

export default function CustomerList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    level: undefined as CustomerLevel | undefined,
    status: undefined as CustomerStatus | undefined,
    source: '',
    industry: '',
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 获取客户列表
  const { data, isLoading } = useQuery({
    queryKey: ['customers', filters, pagination],
    queryFn: () => customerService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 创建客户
  const createMutation = useMutation({
    mutationFn: (dto: CreateCustomerDto) => customerService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })

  // 更新客户
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCustomerDto }) => 
      customerService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingCustomer(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })

  // 删除客户
  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['customers'] })
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
      level: undefined,
      status: undefined,
      source: '',
      industry: '',
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingCustomer(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: Customer) => {
    setEditingCustomer(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该客户吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingCustomer) {
        updateMutation.mutate({ id: editingCustomer.id, dto: values })
      } else {
        createMutation.mutate(values)
      }
    })
  }

  // 处理导出
  const handleExport = () => {
    const params: any = { ...filters }
    // 移除空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === undefined) {
        delete params[key]
      }
    })
    
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&')
    
    const token = localStorage.getItem('token')
    const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api'
    const url = `${apiUrl}/customers/export?${queryString}`
    
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
        a.download = `客户列表_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
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

  // 表格列定义
  const columns: ColumnsType<Customer> = [
    {
      title: '客户名称',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      render: (name, record) => (
        <Text strong onClick={() => navigate(`/crm/customers/${record.id}`)} style={{ cursor: 'pointer', color: '#1890ff' }}>
          {name}
        </Text>
      ),
    },
    { title: '联系人', dataIndex: 'contact', width: 100 },
    { title: '联系电话', dataIndex: 'phone', width: 130 },
    { title: '邮箱', dataIndex: 'email', width: 180, ellipsis: true },
    {
      title: '客户级别',
      dataIndex: 'level',
      width: 90,
      render: (level: CustomerLevel) => (
        <Tag color={levelMap[level].color}>{levelMap[level].text}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: CustomerStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    { title: '来源', dataIndex: 'source', width: 100 },
    { title: '行业', dataIndex: 'industry', width: 100 },
    { title: '地区', dataIndex: 'province', width: 100, render: (_, record) => `${record.province || ''}${record.city || ''}` },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => navigate(`/crm/customers/${record.id}`)}
          >
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
        title="客户列表"
        extra={
          <Space>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建客户
            </Button>
          </Space>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索客户名称/联系人/电话"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="客户级别"
              allowClear
              style={{ width: 120 }}
              value={filters.level}
              onChange={value => setFilters(prev => ({ ...prev, level: value }))}
            >
              <Select.Option value="A">A 级</Select.Option>
              <Select.Option value="B">B 级</Select.Option>
              <Select.Option value="C">C 级</Select.Option>
            </Select>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Select.Option value="ACTIVE">活跃</Select.Option>
              <Select.Option value="INACTIVE">待跟进</Select.Option>
              <Select.Option value="LOST">流失</Select.Option>
            </Select>
            <Input
              placeholder="来源"
              style={{ width: 120 }}
              value={filters.source}
              onChange={e => setFilters(prev => ({ ...prev, source: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Input
              placeholder="行业"
              style={{ width: 120 }}
              value={filters.industry}
              onChange={e => setFilters(prev => ({ ...prev, industry: e.target.value }))}
              onPressEnter={handleSearch}
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
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingCustomer ? '编辑客户' : '新建客户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingCustomer(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ level: 'B' }}
        >
          <Form.Item
            name="name"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          
          <Form.Item
            name="contact"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          
          <Form.Item name="email" label="电子邮箱">
            <Input placeholder="请输入电子邮箱" />
          </Form.Item>
          
          <Form.Item name="address" label="地址">
            <Input placeholder="请输入地址" />
          </Form.Item>
          
          <Form.Item name="level" label="客户级别">
            <Select>
              <Select.Option value="A">A 级</Select.Option>
              <Select.Option value="B">B 级</Select.Option>
              <Select.Option value="C">C 级</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="source" label="来源">
            <Select allowClear>
              <Select.Option value="线上">线上</Select.Option>
              <Select.Option value="线下">线下</Select.Option>
              <Select.Option value="展会">展会</Select.Option>
              <Select.Option value="转介绍">转介绍</Select.Option>
              <Select.Option value="广告">广告</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="industry" label="行业">
            <Input placeholder="请输入所属行业" />
          </Form.Item>
          
          <Form.Item name="province" label="省份">
            <Input placeholder="请输入省份" />
          </Form.Item>
          
          <Form.Item name="city" label="城市">
            <Input placeholder="请输入城市" />
          </Form.Item>
          
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
