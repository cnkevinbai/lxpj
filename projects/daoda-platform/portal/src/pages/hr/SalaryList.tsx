/**
 * 薪资列表页面
 * 支持薪资结构、社保公积金、工资条、批量生成、发放功能
 */
import { useState } from 'react'
import { 
  Table, Card, Button, Select, Space, Tag, Modal, Form, message, 
  Typography, Statistic, Row, Col, DatePicker, InputNumber, Divider,
  Descriptions, Popconfirm,
} from 'antd'
import { 
  SearchOutlined, 
  PlusOutlined,
  ExportOutlined,
  CalculatorOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  salaryService, 
  Salary, 
  SalaryStatus,
  CreateSalaryDto,
  UpdateSalaryDto,
  employeeService,
} from '@/services/hr.service'
import dayjs, { Dayjs } from 'dayjs'

const { Text, Title } = Typography

// 薪资状态映射
const statusMap: Record<SalaryStatus, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待发放' },
  PAID: { color: 'green', text: '已发放' },
  CANCELLED: { color: 'red', text: '已取消' },
}

export default function SalaryList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [detailForm] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    employeeId: undefined as string | undefined,
    month: dayjs().format('YYYY-MM'),
    status: undefined as SalaryStatus | undefined,
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [editingSalary, setEditingSalary] = useState<Salary | null>(null)
  const [generateMonth, setGenerateMonth] = useState<Dayjs>(dayjs())

  // 获取员工列表
  const { data: employeesData } = useQuery({
    queryKey: ['employees-all-salary'],
    queryFn: () => employeeService.getList({ page: 1, pageSize: 100, status: 'ACTIVE' }),
  })

  // 获取薪资列表
  const { data, isLoading } = useQuery({
    queryKey: ['salaries', filters, pagination],
    queryFn: () => salaryService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 获取统计数据
  const { data: statsData } = useQuery({
    queryKey: ['salary-stats', filters],
    queryFn: async () => {
      const res = await salaryService.getList({
        page: 1,
        pageSize: 100,
        ...filters,
      })
      const list = res.list || []
      return {
        totalSalary: list.reduce((sum, s) => sum + s.netSalary, 0),
        paidSalary: list.filter(s => s.status === 'PAID').reduce((sum, s) => sum + s.netSalary, 0),
        pendingSalary: list.filter(s => s.status === 'PENDING').reduce((sum, s) => sum + s.netSalary, 0),
        pendingCount: list.filter(s => s.status === 'PENDING').length,
      }
    },
  })

  // 创建薪资
  const createMutation = useMutation({
    mutationFn: (dto: CreateSalaryDto) => salaryService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['salaries'] })
    },
  })

  // 更新薪资
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSalaryDto }) => 
      salaryService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      queryClient.invalidateQueries({ queryKey: ['salaries'] })
    },
  })

  // 批量生成薪资
  const generateMutation = useMutation({
    mutationFn: (month: string) => salaryService.generate(month),
    onSuccess: () => {
      message.success('生成成功')
      setModalVisible(false)
      queryClient.invalidateQueries({ queryKey: ['salaries'] })
    },
  })

  // 发放薪资
  const payMutation = useMutation({
    mutationFn: (id: string) => salaryService.pay(id),
    onSuccess: () => {
      message.success('发放成功')
      queryClient.invalidateQueries({ queryKey: ['salaries'] })
    },
  })

  // 导出工资条
  const exportPayslip = (id: string) => {
    salaryService.exportPayslip(id)
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `工资条_${dayjs().format('YYYYMM')}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        message.success('导出成功')
      })
      .catch(() => {
        message.error('导出失败')
      })
  }

  // 处理搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // 处理重置
  const handleReset = () => {
    setFilters({
      employeeId: undefined,
      month: dayjs().format('YYYY-MM'),
      status: undefined,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingSalary(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理批量生成
  const handleGenerate = () => {
    const month = generateMonth.format('YYYY-MM')
    generateMutation.mutate(month)
  }

  // 处理编辑
  const handleEdit = (record: Salary) => {
    setEditingSalary(record)
    form.setFieldsValue({
      baseSalary: record.baseSalary,
      bonus: record.bonus,
      deduction: record.deduction,
      status: record.status,
    })
    setModalVisible(true)
  }

  // 处理查看详情
  const handleViewDetail = (record: Salary) => {
    setEditingSalary(record)
    detailForm.setFieldsValue({
      employeeName: record.employee.name,
      department: record.employee.department,
      position: record.employee.position,
      month: record.month,
      baseSalary: record.baseSalary,
      bonus: record.bonus,
      deduction: record.deduction,
      netSalary: record.netSalary,
      socialSecurity: Math.round(record.baseSalary * 0.105), // 假设社保比例
      housingFund: Math.round(record.baseSalary * 0.12), // 假设公积金比例
      tax: Math.round((record.netSalary - 5000) * 0.03), // 简化个税计算
    })
    setDetailModalVisible(true)
  }

  // 处理发放
  const handlePay = (id: string) => {
    payMutation.mutate(id)
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const baseSalary = Number(values.baseSalary)
      const bonus = Number(values.bonus || 0)
      const deduction = Number(values.deduction || 0)
      const netSalary = baseSalary + bonus - deduction

      const dto: any = {
        ...values,
        baseSalary,
        bonus,
        deduction,
        netSalary,
      }

      if (editingSalary) {
        updateMutation.mutate({ id: editingSalary.id, dto })
      } else {
        createMutation.mutate(dto)
      }
    })
  }

  // 表格列定义
  const columns: ColumnsType<Salary> = [
    {
      title: '员工',
      dataIndex: ['employee', 'name'],
      width: 120,
      render: (name: string, record) => (
        <Space>
          {record.employee.avatar ? (
            <img 
              src={record.employee.avatar} 
              alt={name}
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              background: '#1890ff', 
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}>
              {name.charAt(0)}
            </div>
          )}
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: ['employee', 'department'],
      width: 120,
    },
    {
      title: '月份',
      dataIndex: 'month',
      width: 100,
      render: (month: string) => `${month}月`,
    },
    {
      title: '基本工资',
      dataIndex: 'baseSalary',
      width: 120,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '奖金',
      dataIndex: 'bonus',
      width: 100,
      render: (value: number) => (
        <span style={{ color: '#52c41a' }}>+¥{value.toLocaleString()}</span>
      ),
    },
    {
      title: '扣款',
      dataIndex: 'deduction',
      width: 100,
      render: (value: number) => (
        <span style={{ color: '#ff4d4f' }}>-¥{value.toLocaleString()}</span>
      ),
    },
    {
      title: '实发工资',
      dataIndex: 'netSalary',
      width: 130,
      render: (value: number) => (
        <Text strong style={{ fontSize: 15 }}>¥{value.toLocaleString()}</Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: SalaryStatus) => (
        <Tag color={statusMap[status].color} icon={status === 'PAID' ? <CheckCircleOutlined /> : undefined}>
          {statusMap[status].text}
        </Tag>
      ),
    },
    {
      title: '发放时间',
      dataIndex: 'paidAt',
      width: 160,
      render: (paidAt: string | null) => 
        paidAt ? dayjs(paidAt).format('YYYY-MM-DD HH:mm') : '-',
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
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button 
                type="link" 
                size="small"
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
              <Popconfirm
                title="确认发放"
                description="确定要发放该员工工资吗？"
                onConfirm={() => handlePay(record.id)}
                okText="确认"
                cancelText="取消"
              >
                <Button type="link" size="small" danger>
                  发放
                </Button>
              </Popconfirm>
            </>
          )}
          <Button 
            type="link" 
            size="small"
            icon={<ExportOutlined />}
            onClick={() => exportPayslip(record.id)}
          >
            工资条
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="本月工资总额" 
              value={statsData?.totalSalary || 0} 
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="已发放" 
              value={statsData?.paidSalary || 0} 
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="待发放" 
              value={statsData?.pendingSalary || 0} 
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="待发放人数" 
              value={statsData?.pendingCount || 0} 
              suffix="人"
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="薪资管理"
        extra={
          <Space>
            <Button 
              icon={<CalculatorOutlined />}
              onClick={() => setGenerateMonth(dayjs())}
            >
              批量生成
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建薪资
            </Button>
          </Space>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Select
              placeholder="选择员工"
              allowClear
              style={{ width: 150 }}
              value={filters.employeeId}
              onChange={value => setFilters(prev => ({ ...prev, employeeId: value }))}
            >
              {employeesData?.list.map(emp => (
                <Select.Option key={emp.id} value={emp.id}>{emp.name}</Select.Option>
              ))}
            </Select>
            <DatePicker.MonthPicker
              value={filters.month ? dayjs(filters.month) : null}
              onChange={(date) => {
                setFilters(prev => ({
                  ...prev,
                  month: date ? date.format('YYYY-MM') : dayjs().format('YYYY-MM'),
                }))
              }}
            />
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Select.Option value="PENDING">待发放</Select.Option>
              <Select.Option value="PAID">已发放</Select.Option>
              <Select.Option value="CANCELLED">已取消</Select.Option>
            </Select>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
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
          scroll={{ x: 1500 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: data?.total,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
          }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingSalary ? '编辑薪资' : '新建薪资'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {!editingSalary && (
            <Form.Item
              name="employeeId"
              label="员工"
              rules={[{ required: true, message: '请选择员工' }]}
            >
              <Select placeholder="请选择员工" showSearch>
                {employeesData?.list.map(emp => (
                  <Select.Option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.department}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          {!editingSalary && (
            <Form.Item
              name="month"
              label="月份"
              initialValue={dayjs().format('YYYY-MM')}
              rules={[{ required: true, message: '请选择月份' }]}
            >
              <DatePicker.MonthPicker style={{ width: '100%' }} format="YYYY-MM" />
            </Form.Item>
          )}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="baseSalary"
                label="基本工资"
                rules={[{ required: true, message: '请输入基本工资' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  prefix="¥" 
                  min={0}
                  formatter={value => `¥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bonus" label="奖金" initialValue={0}>
                <InputNumber 
                  style={{ width: '100%' }} 
                  prefix="¥" 
                  min={0}
                  formatter={value => `¥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="deduction" label="扣款" initialValue={0}>
            <InputNumber 
              style={{ width: '100%' }} 
              prefix="¥" 
              min={0}
              formatter={value => `¥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
          {editingSalary && (
            <Form.Item name="status" label="状态">
              <Select>
                <Select.Option value="PENDING">待发放</Select.Option>
                <Select.Option value="PAID">已发放</Select.Option>
                <Select.Option value="CANCELLED">已取消</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* 批量生成弹窗 */}
      <Modal
        title="批量生成薪资"
        open={!!generateMonth}
        onOk={handleGenerate}
        onCancel={() => setGenerateMonth(dayjs())}
        width={400}
      >
        <div style={{ padding: '20px 0' }}>
          <Text>请选择要生成薪资的月份：</Text>
          <DatePicker.MonthPicker
            value={generateMonth}
            onChange={(date) => date && setGenerateMonth(date)}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
      </Modal>

      {/* 薪资详情弹窗 */}
      <Modal
        title="薪资详情"
        open={detailModalVisible}
        footer={
          <Space>
            <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
            {editingSalary && (
              <Button type="primary" icon={<ExportOutlined />} onClick={() => exportPayslip(editingSalary.id)}>
                导出工资条
              </Button>
            )}
          </Space>
        }
        width={700}
      >
        <Form form={detailForm} layout="vertical">
          <Descriptions title="员工信息" column={3} bordered size="small">
            <Descriptions.Item label="姓名">{detailForm.getFieldValue('employeeName')}</Descriptions.Item>
            <Descriptions.Item label="部门">{detailForm.getFieldValue('department')}</Descriptions.Item>
            <Descriptions.Item label="职位">{detailForm.getFieldValue('position')}</Descriptions.Item>
          </Descriptions>
          
          <Divider />
          
          <Descriptions title="薪资明细" column={2} bordered size="small">
            <Descriptions.Item label="计薪月份">{detailForm.getFieldValue('month')}</Descriptions.Item>
            <Descriptions.Item label="基本工资">
              ¥{detailForm.getFieldValue('baseSalary')?.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="奖金">
              <span style={{ color: '#52c41a' }}>
                +¥{detailForm.getFieldValue('bonus')?.toLocaleString()}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="扣款">
              <span style={{ color: '#ff4d4f' }}>
                -¥{detailForm.getFieldValue('deduction')?.toLocaleString()}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="社保个人">
              -¥{detailForm.getFieldValue('socialSecurity')?.toLocaleString() || '0'}
            </Descriptions.Item>
            <Descriptions.Item label="公积金个人">
              -¥{detailForm.getFieldValue('housingFund')?.toLocaleString() || '0'}
            </Descriptions.Item>
            <Descriptions.Item label="个税">
              -¥{detailForm.getFieldValue('tax')?.toLocaleString() || '0'}
            </Descriptions.Item>
          </Descriptions>
          
          <Divider />
          
          <div style={{ textAlign: 'right', padding: '16px', background: '#f5f5f5' }}>
            <Title level={4} style={{ margin: 0 }}>
              实发工资：¥{detailForm.getFieldValue('netSalary')?.toLocaleString()}
            </Title>
          </div>
        </Form>
      </Modal>
    </>
  )
}
