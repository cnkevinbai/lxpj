/**
 * 合同管理列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、续约功能
 */
import { useState } from 'react'
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
  Upload,
  DatePicker,
  Progress,
  Alert,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  PaperClipOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  contractService,
  ServiceContract,
  ContractStatus,
  CreateContractDto,
  UpdateContractDto,
} from '@/services/service.service'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const { Text, Link, Title } = Typography

// 状态映射
const statusMap: Record<ContractStatus, { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '有效' },
  EXPIRED: { color: 'red', text: '已过期' },
  PENDING_RENEWAL: { color: 'orange', text: '待续约' },
  TERMINATED: { color: 'default', text: '已终止' },
}

export default function ContractList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()

  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as ContractStatus | undefined,
    customerId: '',
  })

  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })

  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [editingContract, setEditingContract] = useState<ServiceContract | null>(null)
  const [viewingContract, setViewingContract] = useState<ServiceContract | null>(null)
  const [renewModalVisible, setRenewModalVisible] = useState(false)
  const [renewingContract, setRenewingContract] = useState<ServiceContract | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 获取合同列表
  const { data, isLoading } = useQuery({
    queryKey: ['service-contracts', filters, pagination],
    queryFn: () =>
      contractService.getList({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters,
      }),
  })

  // 创建合同
  const createMutation = useMutation({
    mutationFn: (dto: CreateContractDto) => contractService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['service-contracts'] })
    },
  })

  // 更新合同
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateContractDto }) => contractService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingContract(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['service-contracts'] })
    },
  })

  // 删除合同
  const deleteMutation = useMutation({
    mutationFn: (id: string) => contractService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['service-contracts'] })
    },
  })

  // 续约合同
  const renewMutation = useMutation({
    mutationFn: ({ id, endDate }: { id: string; endDate: string }) =>
      contractService.renew(id, endDate),
    onSuccess: () => {
      message.success('续约成功')
      setRenewModalVisible(false)
      setRenewingContract(null)
      queryClient.invalidateQueries({ queryKey: ['service-contracts'] })
    },
  })

  // 终止合同
  const terminateMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      contractService.terminate(id, reason),
    onSuccess: () => {
      message.success('合同已终止')
      queryClient.invalidateQueries({ queryKey: ['service-contracts'] })
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
      customerId: '',
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingContract(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: ServiceContract) => {
    setEditingContract(record)
    form.setFieldsValue({
      ...record,
      startDate: dayjs(record.startDate),
      endDate: dayjs(record.endDate),
    })
    setModalVisible(true)
  }

  // 处理查看详情
  const handleView = (record: ServiceContract) => {
    setViewingContract(record)
    setDrawerVisible(true)
  }

  // 处理续约
  const handleRenew = (record: ServiceContract) => {
    setRenewingContract(record)
    setRenewModalVisible(true)
  }

  // 处理终止
  const handleTerminate = (record: ServiceContract) => {
    Modal.confirm({
      title: '终止合同',
      content: (
        <div>
          <p>确定要终止合同 {record.contractNo} 吗？</p>
          <Form.Item label="终止原因" required>
            <Input.TextArea
              rows={3}
              placeholder="请输入终止原因"
              onChange={(e) => {
                // 存储原因
                ;(e.target as any).reason = e.target.value
              }}
            />
          </Form.Item>
        </div>
      ),
      okText: '确认终止',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        const reason = '客户申请终止' // TODO: 从表单获取
        terminateMutation.mutate({ id: record.id, reason })
      },
    })
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该合同吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const dto = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
      }
      if (editingContract) {
        updateMutation.mutate({ id: editingContract.id, dto })
      } else {
        createMutation.mutate(dto)
      }
    })
  }

  // 处理续约提交
  const handleRenewSubmit = () => {
    form.validateFields(['newEndDate']).then((values) => {
      if (renewingContract) {
        renewMutation.mutate({
          id: renewingContract.id,
          endDate: values.newEndDate.format('YYYY-MM-DD'),
        })
      }
    })
  }

  // 计算合同进度
  const calculateProgress = (startDate: string, endDate: string) => {
    const start = dayjs(startDate)
    const end = dayjs(endDate)
    const now = dayjs()
    const total = end.diff(start, 'day')
    const elapsed = now.diff(start, 'day')
    if (total <= 0) return 0
    return Math.min(100, Math.round((elapsed / total) * 100))
  }

  // 计算剩余天数
  const getDaysRemaining = (endDate: string) => {
    return dayjs(endDate).diff(dayjs(), 'day')
  }

  // 表格列定义
  const columns: ColumnsType<ServiceContract> = [
    {
      title: '合同号',
      dataIndex: 'contractNo',
      width: 130,
      fixed: 'left',
      render: (text, record) => (
        <Link onClick={() => handleView(record)} style={{ color: '#1890ff' }}>
          {text}
        </Link>
      ),
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 150,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      width: 130,
      render: (phone) => phone || '-',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      width: 110,
      render: (startDate: string) => dayjs(startDate).format('YYYY-MM-DD'),
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      width: 110,
      render: (endDate: string) => {
        const daysLeft = getDaysRemaining(endDate)
        return (
          <Space>
            <span>{dayjs(endDate).format('YYYY-MM-DD')}</span>
            {daysLeft <= 30 && daysLeft > 0 && (
              <Tag color="orange">剩余{daysLeft}天</Tag>
            )}
            {daysLeft <= 0 && <Tag color="red">已过期</Tag>}
          </Space>
        )
      },
    },
    {
      title: '合同金额',
      dataIndex: 'amount',
      width: 110,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: ContractStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: '合同进度',
      key: 'progress',
      width: 150,
      render: (_: any, record: ServiceContract) => (
        <div style={{ width: 120 }}>
          <Progress
            percent={calculateProgress(record.startDate, record.endDate)}
            strokeColor={
              getDaysRemaining(record.endDate) <= 30
                ? '#fa8c16'
                : getDaysRemaining(record.endDate) <= 0
                ? '#ff4d4f'
                : '#52c41a'
            }
            size="small"
          />
        </div>
      ),
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
                  key: 'renew',
                  label: '续约',
                  icon: <ClockCircleOutlined />,
                  disabled: record.status !== 'ACTIVE' && record.status !== 'PENDING_RENEWAL',
                  onClick: () => handleRenew(record),
                },
                {
                  key: 'terminate',
                  label: '终止',
                  icon: <FileTextOutlined />,
                  disabled: record.status === 'EXPIRED' || record.status === 'TERMINATED',
                  danger: true,
                  onClick: () => handleTerminate(record),
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
        title="服务合同管理"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建合同
            </Button>
          </Space>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索合同号/客户"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            >
              <Select.Option value="ACTIVE">有效</Select.Option>
              <Select.Option value="PENDING_RENEWAL">待续约</Select.Option>
              <Select.Option value="EXPIRED">已过期</Select.Option>
              <Select.Option value="TERMINATED">已终止</Select.Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </div>

        {/* 即将到期提醒 */}
        {data?.list && data.list.some((c) => getDaysRemaining(c.endDate) <= 30 && getDaysRemaining(c.endDate) > 0) && (
          <Alert
            message="合同到期提醒"
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                {data.list
                  .filter((c) => getDaysRemaining(c.endDate) <= 30 && getDaysRemaining(c.endDate) > 0)
                  .slice(0, 3)
                  .map((contract) => (
                    <div key={contract.id}>
                      <Link onClick={() => handleView(contract)}>{contract.contractNo}</Link>
                      <Text type="secondary"> - {contract.customerName}</Text>
                      <Tag color="orange">剩余{getDaysRemaining(contract.endDate)}天</Tag>
                    </div>
                  ))}
              </Space>
            }
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            closable
          />
        )}

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
        title={editingContract ? '编辑合同' : '新建合同'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingContract(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'ACTIVE' }}
        >
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
            name="startDate"
            label="开始日期"
            rules={[{ required: true, message: '请选择开始日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="结束日期"
            rules={[{ required: true, message: '请选择结束日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="amount"
            label="合同金额"
            rules={[{ required: true, message: '请输入合同金额' }]}
          >
            <Input prefix="¥" type="number" placeholder="请输入合同金额" />
          </Form.Item>

          <Form.Item
            name="serviceScope"
            label="服务范围"
            rules={[{ required: true, message: '请输入服务范围' }]}
          >
            <Input.TextArea rows={4} placeholder="请描述服务范围和内容" />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>

          <Form.Item name="attachments" label="合同附件">
            <Upload listType="picture-card" multiple>
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传附件</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 续约弹窗 */}
      <Modal
        title="合同续约"
        open={renewModalVisible}
        onOk={handleRenewSubmit}
        onCancel={() => {
          setRenewModalVisible(false)
          setRenewingContract(null)
          form.resetFields(['newEndDate'])
        }}
        confirmLoading={renewMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <p>
            合同号：<Text strong>{renewingContract?.contractNo}</Text>
          </p>
          <p>
            当前到期日：<Text type="secondary">{renewingContract && dayjs(renewingContract.endDate).format('YYYY-MM-DD')}</Text>
          </p>
          <Form.Item
            name="newEndDate"
            label="新到期日期"
            rules={[{ required: true, message: '请选择新到期日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title={
          <Space>
            <span>{viewingContract?.contractNo}</span>
            {viewingContract && (
              <Tag color={statusMap[viewingContract.status].color}>
                {statusMap[viewingContract.status].text}
              </Tag>
            )}
          </Space>
        }
        placement="right"
        width={720}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false)
          setViewingContract(null)
        }}
      >
        {viewingContract && (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="客户">{viewingContract.customerName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{viewingContract.contactPhone || '-'}</Descriptions.Item>
              <Descriptions.Item label="开始日期">
                {dayjs(viewingContract.startDate).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="结束日期">
                {dayjs(viewingContract.endDate).format('YYYY-MM-DD')}
                <Tag color={getDaysRemaining(viewingContract.endDate) <= 30 ? 'orange' : 'green'} style={{ marginLeft: 8 }}>
                  {getDaysRemaining(viewingContract.endDate) > 0
                    ? `剩余${getDaysRemaining(viewingContract.endDate)}天`
                    : '已过期'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="合同金额">
                ¥{viewingContract.amount.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[viewingContract.status].color}>
                  {statusMap[viewingContract.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="合同进度">
                <div style={{ width: 200 }}>
                  <Progress
                    percent={calculateProgress(viewingContract.startDate, viewingContract.endDate)}
                    strokeColor={
                      getDaysRemaining(viewingContract.endDate) <= 30
                        ? '#fa8c16'
                        : getDaysRemaining(viewingContract.endDate) <= 0
                        ? '#ff4d4f'
                        : '#52c41a'
                    }
                  />
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {dayjs(viewingContract.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 24 }}>服务范围</Title>
            <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: 4, marginBottom: 16 }}>
              {viewingContract.serviceScope || '-'}
            </div>

            {viewingContract.remark && (
              <>
                <Title level={5}>备注</Title>
                <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: 4, marginBottom: 16 }}>
                  {viewingContract.remark}
                </div>
              </>
            )}

            {viewingContract.attachmentUrls && viewingContract.attachmentUrls.length > 0 && (
              <>
                <Title level={5}>合同附件</Title>
                <Space wrap>
                  {viewingContract.attachmentUrls.map((url, idx) => (
                    <Button key={idx} icon={<PaperClipOutlined />} href={url} target="_blank">
                      附件{idx + 1}
                    </Button>
                  ))}
                </Space>
              </>
            )}

            <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
              <Space>
                <Button onClick={() => handleEdit(viewingContract)} icon={<EditOutlined />}>
                  编辑
                </Button>
                {viewingContract.status === 'ACTIVE' && (
                  <Button
                    type="primary"
                    onClick={() => handleRenew(viewingContract)}
                    icon={<ClockCircleOutlined />}
                  >
                    续约
                  </Button>
                )}
                <Button
                  danger
                  onClick={() => handleDelete(viewingContract.id)}
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
