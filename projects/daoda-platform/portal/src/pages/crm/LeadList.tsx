/**
 * 线索列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、转化功能
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Typography, Drawer } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leadService, Lead, LeadStatus, CreateLeadDto, UpdateLeadDto } from '@/services/lead.service'
import dayjs from 'dayjs'

const { Text } = Typography

// 线索状态映射
const statusMap: Record<LeadStatus, { color: string; text: string }> = {
  NEW: { color: 'blue', text: '新线索' },
  CONTACTED: { color: 'cyan', text: '已联系' },
  QUALIFIED: { color: 'green', text: '已确认' },
  UNQUALIFIED: { color: 'default', text: '无效' },
  CONVERTED: { color: 'purple', text: '已转化' },
}

export default function LeadList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as LeadStatus | undefined,
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
  const [detailVisible, setDetailVisible] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // 获取线索列表
  const { data, isLoading } = useQuery({
    queryKey: ['leads', filters, pagination],
    queryFn: () => leadService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 创建线索
  const createMutation = useMutation({
    mutationFn: (dto: CreateLeadDto) => leadService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })

  // 更新线索
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateLeadDto }) => 
      leadService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingLead(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })

  // 删除线索
  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })

  // 转化线索
  const convertMutation = useMutation({
    mutationFn: (id: string) => leadService.convert(id),
    onSuccess: (data) => {
      message.success('转化成功')
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      setDetailVisible(false)
      // 跳转到客户详情
      navigate(`/crm/customers/${data.customerId}`)
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
      source: '',
      industry: '',
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingLead(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: Lead) => {
    setEditingLead(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该线索吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 处理转化
  const handleConvert = (id: string) => {
    Modal.confirm({
      title: '确认转化',
      content: '确定要将该线索转化为客户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => convertMutation.mutate(id),
    })
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingLead) {
        updateMutation.mutate({ id: editingLead.id, dto: values })
      } else {
        createMutation.mutate(values)
      }
    })
  }

  // 查看详情
  const handleViewDetail = async (record: Lead) => {
    setSelectedLead(record)
    setDetailVisible(true)
  }

  // 表格列定义
  const columns: ColumnsType<Lead> = [
    {
      title: '线索名称',
      dataIndex: 'name',
      width: 180,
      fixed: 'left',
      render: (name, record) => (
        <Text 
          strong 
          onClick={() => handleViewDetail(record)}
          style={{ cursor: 'pointer', color: '#1890ff' }}
        >
          {name}
        </Text>
      ),
    },
    { title: '联系人', dataIndex: 'contact', width: 100 },
    { title: '联系电话', dataIndex: 'phone', width: 130 },
    { title: '公司名称', dataIndex: 'company', width: 150 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: LeadStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    { title: '来源', dataIndex: 'source', width: 100 },
    { title: '行业', dataIndex: 'industry', width: 100 },
    { title: '预算', dataIndex: 'budget', width: 100, render: (v: number | null) => v ? `¥${v.toLocaleString()}` : '-' },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleViewDetail(record)}
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
          {record.status !== 'CONVERTED' && record.status !== 'UNQUALIFIED' && (
            <Button 
              type="link" 
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleConvert(record.id)}
            >
              转化
            </Button>
          )}
          <Button 
            type="link" 
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
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
        title="线索列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建线索
          </Button>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索线索名称/联系人/电话"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="线索状态"
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
          scroll={{ x: 1400 }}
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
        title={editingLead ? '编辑线索' : '新建线索'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingLead(null)
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
            label="线索名称"
            rules={[{ required: true, message: '请输入线索名称' }]}
          >
            <Input placeholder="请输入线索名称" />
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
          
          <Form.Item name="company" label="公司名称">
            <Input placeholder="请输入公司名称" />
          </Form.Item>
          
          <Form.Item name="position" label="职位">
            <Input placeholder="请输入职位" />
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
          
          <Form.Item name="budget" label="预算">
            <Input type="number" placeholder="请输入预算" addonBefore="¥" />
          </Form.Item>
          
          <Form.Item name="requirement" label="需求描述">
            <Input.TextArea rows={3} placeholder="请输入需求描述" />
          </Form.Item>
          
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 线索详情弹窗 */}
      <Drawer
        title="线索详情"
        placement="right"
        width={600}
        open={detailVisible}
        onClose={() => {
          setDetailVisible(false)
          setSelectedLead(null)
        }}
      >
        {selectedLead && (
          <>
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div><Text strong>线索名称：</Text>{selectedLead.name}</div>
                <div><Text strong>联系人：</Text>{selectedLead.contact}</div>
                <div><Text strong>联系电话：</Text>{selectedLead.phone}</div>
                <div><Text strong>电子邮箱：</Text>{selectedLead.email || '-'}</div>
                <div><Text strong>公司名称：</Text>{selectedLead.company || '-'}</div>
                <div><Text strong>职位：</Text>{selectedLead.position || '-'}</div>
                <div><Text strong>状态：</Text>
                  <Tag color={statusMap[selectedLead.status].color}>
                    {statusMap[selectedLead.status].text}
                  </Tag>
                </div>
                <div><Text strong>来源：</Text>{selectedLead.source || '-'}</div>
                <div><Text strong>行业：</Text>{selectedLead.industry || '-'}</div>
                <div><Text strong>地区：</Text>{`${selectedLead.province || ''}${selectedLead.city || ''}` || '-'}</div>
                <div><Text strong>预算：</Text>{selectedLead.budget ? `¥${selectedLead.budget.toLocaleString()}` : '-'}</div>
                <div><Text strong>负责人：</Text>{selectedLead.userName || '-'}</div>
                <div><Text strong>创建时间：</Text>{dayjs(selectedLead.createdAt).format('YYYY-MM-DD HH:mm')}</div>
              </Space>
            </Card>
            
            {selectedLead.requirement && (
              <Card title="需求描述" size="small" style={{ marginBottom: 16 }}>
                <p>{selectedLead.requirement}</p>
              </Card>
            )}
            
            {selectedLead.remark && (
              <Card title="备注" size="small">
                <p>{selectedLead.remark}</p>
              </Card>
            )}
            
            {selectedLead.status !== 'CONVERTED' && selectedLead.status !== 'UNQUALIFIED' && (
              <div style={{ marginTop: 16 }}>
                <Button 
                  type="primary" 
                  block 
                  icon={<CheckOutlined />}
                  onClick={() => handleConvert(selectedLead.id)}
                  loading={convertMutation.isPending}
                >
                  转化为客户
                </Button>
              </div>
            )}
          </>
        )}
      </Drawer>
    </>
  )
}
