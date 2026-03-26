/**
 * 商机列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、阶段更新、赢单/输单功能
 */
import { useState, useEffect } from 'react'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Typography, Drawer, Descriptions, DatePicker, InputNumber, Progress, Tooltip, Statistic, Row, Col } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, TrophyOutlined, CloseCircleOutlined, SwapOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  opportunityService, 
  Opportunity, 
  OpportunityStage, 
  CreateOpportunityDto, 
  UpdateOpportunityDto,
  stageMap 
} from '@/services/opportunity.service'
import { customerService } from '@/services/customer.service'
import dayjs from 'dayjs'

const { Text, Title } = Typography

// 商机阶段选项
const stageOptions = [
  { value: 'INITIAL', label: '初步接触', probability: 10 },
  { value: 'REQUIREMENT', label: '需求确认', probability: 30 },
  { value: 'QUOTATION', label: '报价中', probability: 50 },
  { value: 'NEGOTIATION', label: '谈判中', probability: 70 },
  { value: 'CONTRACT', label: '合同阶段', probability: 90 },
  { value: 'CLOSED_WON', label: '赢单', probability: 100 },
  { value: 'CLOSED_LOST', label: '输单', probability: 0 },
]

// 阶段颜色映射（用于进度条）
const stageColors: Record<OpportunityStage, string> = {
  INITIAL: '#1890ff',
  REQUIREMENT: '#13c2c2',
  QUOTATION: '#52c41a',
  NEGOTIATION: '#faad14',
  CONTRACT: '#722ed1',
  CLOSED_WON: '#52c41a',
  CLOSED_LOST: '#ff4d4f',
}

export default function OpportunityList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    stage: undefined as OpportunityStage | undefined,
    customerId: undefined as string | undefined,
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null)
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [stageModalVisible, setStageModalVisible] = useState(false)
  const [selectedStage, setSelectedStage] = useState<OpportunityStage | null>(null)

  // 获取商机列表
  const { data, isLoading } = useQuery({
    queryKey: ['opportunities', filters, pagination],
    queryFn: () => opportunityService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 获取客户列表（用于新建商机时选择客户）
  const { data: customerData } = useQuery({
    queryKey: ['customers-for-select'],
    queryFn: () => customerService.getList({ pageSize: 1000 }),
  })

  // 创建商机
  const createMutation = useMutation({
    mutationFn: (dto: CreateOpportunityDto) => opportunityService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
    },
    onError: () => {
      message.error('创建失败，请重试')
    },
  })

  // 更新商机
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateOpportunityDto }) => 
      opportunityService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingOpportunity(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
    },
    onError: () => {
      message.error('更新失败，请重试')
    },
  })

  // 删除商机
  const deleteMutation = useMutation({
    mutationFn: (id: string) => opportunityService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
    },
  })

  // 更新阶段
  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: OpportunityStage }) => 
      opportunityService.updateStage(id, stage),
    onSuccess: () => {
      message.success('阶段更新成功')
      setStageModalVisible(false)
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
    },
  })

  // 赢单
  const winMutation = useMutation({
    mutationFn: (id: string) => opportunityService.win(id),
    onSuccess: () => {
      message.success('恭喜！赢单成功 🎉')
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
      setDetailVisible(false)
    },
  })

  // 输单
  const loseMutation = useMutation({
    mutationFn: (id: string) => opportunityService.lose(id),
    onSuccess: () => {
      message.success('已标记为输单')
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
      setDetailVisible(false)
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
      stage: undefined,
      customerId: undefined,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingOpportunity(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: Opportunity) => {
    setEditingOpportunity(record)
    form.setFieldsValue({
      ...record,
      expectedCloseDate: record.expectedCloseDate ? dayjs(record.expectedCloseDate) : null,
    })
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该商机吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 处理查看详情
  const handleViewDetail = async (record: Opportunity) => {
    setSelectedOpportunity(record)
    setDetailVisible(true)
  }

  // 处理阶段变更
  const handleStageChange = (record: Opportunity) => {
    setSelectedOpportunity(record)
    setSelectedStage(record.stage)
    setStageModalVisible(true)
  }

  // 确认阶段变更
  const confirmStageChange = () => {
    if (selectedOpportunity && selectedStage) {
      updateStageMutation.mutate({ id: selectedOpportunity.id, stage: selectedStage })
    }
  }

  // 处理赢单
  const handleWin = (id: string) => {
    Modal.confirm({
      title: '确认赢单',
      content: '确定要将该商机标记为赢单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => winMutation.mutate(id),
    })
  }

  // 处理输单
  const handleLose = (id: string) => {
    Modal.confirm({
      title: '确认输单',
      content: '确定要将该商机标记为输单吗？',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => loseMutation.mutate(id),
    })
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const dto = {
        ...values,
        expectedCloseDate: values.expectedCloseDate?.format('YYYY-MM-DD'),
      }
      if (editingOpportunity) {
        updateMutation.mutate({ id: editingOpportunity.id, dto })
      } else {
        createMutation.mutate(dto)
      }
    })
  }

  // 根据阶段自动设置概率
  const handleStageSelect = (stage: OpportunityStage) => {
    const option = stageOptions.find(o => o.value === stage)
    if (option) {
      form.setFieldsValue({ probability: option.probability })
    }
  }

  // 计算统计数据
  const statistics = {
    total: data?.total || 0,
    totalAmount: data?.list?.reduce((sum: number, item: Opportunity) => sum + (item.amount || 0), 0) || 0,
    wonCount: data?.list?.filter((item: Opportunity) => item.stage === 'CLOSED_WON').length || 0,
    wonAmount: data?.list?.filter((item: Opportunity) => item.stage === 'CLOSED_WON').reduce((sum: number, item: Opportunity) => sum + (item.amount || 0), 0) || 0,
  }

  // 表格列定义
  const columns: ColumnsType<Opportunity> = [
    {
      title: '商机名称',
      dataIndex: 'name',
      width: 200,
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
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 150,
      render: (_, record) => record.customerName || '-',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      align: 'right',
      render: (amount: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ¥{(amount || 0).toLocaleString()}
        </Text>
      ),
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      width: 180,
      render: (stage: OpportunityStage, record) => {
        const stageInfo = stageMap[stage]
        return (
          <Space>
            <Tag color={stageInfo.color}>{stageInfo.text}</Tag>
            <Progress 
              percent={record.probability} 
              size="small" 
              style={{ width: 60 }}
              strokeColor={stageColors[stage]}
              showInfo={false}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.probability}%</Text>
          </Space>
        )
      },
    },
    {
      title: '预计成交',
      dataIndex: 'expectedCloseDate',
      width: 110,
      render: (date: string | null) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
    },
    {
      title: '负责人',
      dataIndex: 'userName',
      width: 100,
      render: (name: string | null) => name || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 110,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      render: (_, record) => {
        const isClosed = record.stage === 'CLOSED_WON' || record.stage === 'CLOSED_LOST'
        return (
          <Space size="small">
            <Tooltip title="查看详情">
              <Button 
                type="text" 
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetail(record)}
              />
            </Tooltip>
            <Tooltip title="编辑">
              <Button 
                type="text" 
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Tooltip title="变更阶段">
              <Button 
                type="text" 
                size="small"
                icon={<SwapOutlined />}
                onClick={() => handleStageChange(record)}
                disabled={isClosed}
              />
            </Tooltip>
            {!isClosed && (
              <>
                <Tooltip title="赢单">
                  <Button 
                    type="text" 
                    size="small"
                    style={{ color: '#52c41a' }}
                    icon={<TrophyOutlined />}
                    onClick={() => handleWin(record.id)}
                  />
                </Tooltip>
                <Tooltip title="输单">
                  <Button 
                    type="text" 
                    size="small"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleLose(record.id)}
                  />
                </Tooltip>
              </>
            )}
            <Tooltip title="删除">
              <Button 
                type="text" 
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
              />
            </Tooltip>
          </Space>
        )
      },
    },
  ]

  return (
    <>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="商机总数" value={statistics.total} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="商机总额" 
              value={statistics.totalAmount} 
              prefix="¥" 
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="赢单数" 
              value={statistics.wonCount} 
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="赢单金额" 
              value={statistics.wonAmount} 
              prefix="¥" 
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="商机列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建商机
          </Button>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索商机名称"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="商机阶段"
              allowClear
              style={{ width: 140 }}
              value={filters.stage}
              onChange={value => setFilters(prev => ({ ...prev, stage: value }))}
            >
              {Object.entries(stageMap).map(([key, value]) => (
                <Select.Option key={key} value={key}>{value.text}</Select.Option>
              ))}
            </Select>
            <Select
              placeholder="选择客户"
              allowClear
              showSearch
              style={{ width: 200 }}
              value={filters.customerId}
              onChange={value => setFilters(prev => ({ ...prev, customerId: value }))}
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {customerData?.list?.map((customer: any) => (
                <Select.Option key={customer.id} value={customer.id}>
                  {customer.name}
                </Select.Option>
              ))}
            </Select>
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
        title={editingOpportunity ? '编辑商机' : '新建商机'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingOpportunity(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ stage: 'INITIAL', probability: 10 }}
        >
          <Form.Item
            name="name"
            label="商机名称"
            rules={[{ required: true, message: '请输入商机名称' }]}
          >
            <Input placeholder="请输入商机名称" />
          </Form.Item>
          
          <Form.Item
            name="customerId"
            label="关联客户"
            rules={[{ required: true, message: '请选择关联客户' }]}
          >
            <Select
              placeholder="请选择客户"
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
              disabled={!!editingOpportunity}
            >
              {customerData?.list?.map((customer: any) => (
                <Select.Option key={customer.id} value={customer.id}>
                  {customer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="商机金额"
            rules={[{ required: true, message: '请输入商机金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              placeholder="请输入商机金额"
              addonBefore="¥"
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stage"
                label="商机阶段"
                rules={[{ required: true }]}
              >
                <Select onSelect={handleStageSelect}>
                  {stageOptions.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="probability"
                label="成功概率"
                tooltip="根据阶段自动设置，也可手动调整"
              >
                <InputNumber<number>
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => parseInt(value?.replace('%', '') || '0', 10)}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="expectedCloseDate"
            label="预计成交日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 阶段变更弹窗 */}
      <Modal
        title="变更商机阶段"
        open={stageModalVisible}
        onOk={confirmStageChange}
        onCancel={() => {
          setStageModalVisible(false)
          setSelectedOpportunity(null)
          setSelectedStage(null)
        }}
        confirmLoading={updateStageMutation.isPending}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>请选择新的商机阶段：</Text>
        </div>
        <Select
          style={{ width: '100%' }}
          value={selectedStage}
          onChange={setSelectedStage}
        >
          {stageOptions.filter(o => o.value !== 'CLOSED_WON' && o.value !== 'CLOSED_LOST').map(option => (
            <Select.Option key={option.value} value={option.value}>
              <Space>
                <Tag color={stageMap[option.value as OpportunityStage].color}>
                  {option.label}
                </Tag>
                <Text type="secondary">({option.probability}%)</Text>
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Modal>

      {/* 商机详情弹窗 */}
      <Drawer
        title="商机详情"
        placement="right"
        width={600}
        open={detailVisible}
        onClose={() => {
          setDetailVisible(false)
          setSelectedOpportunity(null)
        }}
      >
        {selectedOpportunity && (
          <>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="商机名称" span={2}>
                  <Text strong>{selectedOpportunity.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="客户">{selectedOpportunity.customerName || '-'}</Descriptions.Item>
                <Descriptions.Item label="金额">
                  <Text strong style={{ color: '#52c41a' }}>
                    ¥{(selectedOpportunity.amount || 0).toLocaleString()}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="阶段">
                  <Tag color={stageMap[selectedOpportunity.stage].color}>
                    {stageMap[selectedOpportunity.stage].text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="成功概率">
                  <Progress 
                    percent={selectedOpportunity.probability} 
                    size="small"
                    strokeColor={stageColors[selectedOpportunity.stage]}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="预计成交">
                  {selectedOpportunity.expectedCloseDate 
                    ? dayjs(selectedOpportunity.expectedCloseDate).format('YYYY-MM-DD') 
                    : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="负责人">{selectedOpportunity.userName || '-'}</Descriptions.Item>
                <Descriptions.Item label="创建时间" span={2}>
                  {dayjs(selectedOpportunity.createdAt).format('YYYY-MM-DD HH:mm')}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {selectedOpportunity.remark && (
              <Card title="备注" size="small" style={{ marginBottom: 16 }}>
                <p>{selectedOpportunity.remark}</p>
              </Card>
            )}

            {/* 操作按钮 */}
            {selectedOpportunity.stage !== 'CLOSED_WON' && selectedOpportunity.stage !== 'CLOSED_LOST' && (
              <Card size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    block 
                    icon={<TrophyOutlined />}
                    onClick={() => handleWin(selectedOpportunity.id)}
                    loading={winMutation.isPending}
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  >
                    确认赢单
                  </Button>
                  <Button 
                    block 
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleLose(selectedOpportunity.id)}
                    loading={loseMutation.isPending}
                  >
                    确认输单
                  </Button>
                </Space>
              </Card>
            )}
          </>
        )}
      </Drawer>
    </>
  )
}