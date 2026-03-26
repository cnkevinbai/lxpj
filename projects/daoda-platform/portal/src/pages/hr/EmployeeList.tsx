/**
 * 员工列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、头像上传功能
 */
import { useState } from 'react'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Avatar, Typography, Image, Row, Col, DatePicker, Upload } from 'antd'
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  employeeService, 
  Employee, 
  EmployeeStatus, 
  EmployeeLevel,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from '@/services/hr.service'
import dayjs from 'dayjs'


const { Text } = Typography

// 员工状态映射
const statusMap: Record<EmployeeStatus, { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '在职' },
  INACTIVE: { color: 'orange', text: '休假' },
  RESIGNED: { color: 'red', text: '离职' },
}

// 员工职级映射
const levelMap: Record<EmployeeLevel, { color: string; text: string }> = {
  INTERN: { color: 'default', text: '实习生' },
  JUNIOR: { color: 'blue', text: '初级' },
  MID: { color: 'cyan', text: '中级' },
  SENIOR: { color: 'green', text: '高级' },
  LEAD: { color: 'gold', text: '资深' },
  MANAGER: { color: 'purple', text: '经理' },
  DIRECTOR: { color: 'red', text: '总监' },
}

// 部门选项
const departmentOptions = [
  '技术部',
  '销售部',
  '市场部',
  '人力资源部',
  '财务部',
  '售后部',
  '运营部',
  '管理层',
]

// 职级选项
const levelOptions: { value: EmployeeLevel; label: string }[] = [
  { value: 'INTERN', label: '实习生' },
  { value: 'JUNIOR', label: '初级' },
  { value: 'MID', label: '中级' },
  { value: 'SENIOR', label: '高级' },
  { value: 'LEAD', label: '资深' },
  { value: 'MANAGER', label: '经理' },
  { value: 'DIRECTOR', label: '总监' },
]

export default function EmployeeList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    department: undefined as string | undefined,
    status: undefined as EmployeeStatus | undefined,
    level: undefined as EmployeeLevel | undefined,
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [_avatarFile, setAvatarFile] = useState<UploadFile | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  // 获取员工列表
  const { data, isLoading } = useQuery({
    queryKey: ['employees', filters, pagination],
    queryFn: () => employeeService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 创建员工
  const createMutation = useMutation({
    mutationFn: (dto: CreateEmployeeDto) => employeeService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })

  // 更新员工
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateEmployeeDto }) => 
      employeeService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingEmployee(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })

  // 上传头像
  const uploadAvatarMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => 
      employeeService.uploadAvatar(id, file),
    onSuccess: () => {
      message.success('头像更新成功')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })

  // 删除员工
  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
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
      department: undefined,
      status: undefined,
      level: undefined,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingEmployee(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: Employee) => {
    setEditingEmployee(record)
    form.setFieldsValue({
      ...record,
      hireDate: dayjs(record.hireDate),
    })
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该员工吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const dto: any = {
        ...values,
        hireDate: values.hireDate.format('YYYY-MM-DD'),
        salary: values.salary ? Number(values.salary) : undefined,
      }
      
      if (editingEmployee) {
        updateMutation.mutate({ id: editingEmployee.id, dto })
      } else {
        // 如果有头像文件，先上传头像
        createMutation.mutate(dto)
      }
    })
  }

  // 处理头像上传（TODO: 后端支持头像上传后启用）
  // 使用 _ 前缀表示有意未使用，等待后续集成
  const _handleAvatarUpload = (file: File, employeeId: string) => {
    uploadAvatarMutation.mutate({ id: employeeId, file })
    return false // 阻止默认上传行为
  }

  // 处理图片预览
  const handlePreview = (url: string) => {
    setPreviewImage(url)
    setPreviewVisible(true)
  }

  // 表格列定义
  const columns: ColumnsType<Employee> = [
    {
      title: '员工信息',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          {record.avatar ? (
            <Image
              src={record.avatar}
              alt={record.name}
              width={40}
              height={40}
              style={{ borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
              preview={false}
              onClick={() => handlePreview(record.avatar!)}
            />
          ) : (
            <Avatar 
              size={40} 
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
              onClick={() => handlePreview('')}
            />
          )}
          <div>
            <div><Text strong>{record.name}</Text></div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 120,
      render: (dept: string) => (
        <Tag color={dept === '技术部' ? '#1890ff' : dept === '销售部' ? '#52c41a' : 'default'}>
          {dept}
        </Tag>
      ),
    },
    { title: '职位', dataIndex: 'position', width: 150 },
    {
      title: '职级',
      dataIndex: 'level',
      width: 100,
      render: (level: EmployeeLevel | null) => 
        level ? (
          <Tag color={levelMap[level].color}>{levelMap[level].text}</Tag>
        ) : (
          <Tag>未设置</Tag>
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: EmployeeStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: '入职日期',
      dataIndex: 'hireDate',
      width: 130,
      render: (hireDate: string) => dayjs(hireDate).format('YYYY-MM-DD'),
    },
    {
      title: '薪资',
      dataIndex: 'salary',
      width: 120,
      render: (salary: number | null) => 
        salary ? `¥${salary.toLocaleString()}` : '未设置',
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
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
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
        title="员工管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            入职办理
          </Button>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索员工姓名/邮箱/电话"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="部门"
              allowClear
              style={{ width: 120 }}
              value={filters.department}
              onChange={value => setFilters(prev => ({ ...prev, department: value }))}
            >
              {departmentOptions.map(dept => (
                <Select.Option key={dept} value={dept}>{dept}</Select.Option>
              ))}
            </Select>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Select.Option value="ACTIVE">在职</Select.Option>
              <Select.Option value="INACTIVE">休假</Select.Option>
              <Select.Option value="RESIGNED">离职</Select.Option>
            </Select>
            <Select
              placeholder="职级"
              allowClear
              style={{ width: 120 }}
              value={filters.level}
              onChange={value => setFilters(prev => ({ ...prev, level: value }))}
            >
              {levelOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
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
            showTotal: total => `共 ${total} 条`,
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
          }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingEmployee ? '编辑员工' : '入职办理'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="电话"
                rules={[{ required: true, message: '请输入电话' }]}
              >
                <Input placeholder="请输入电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hireDate"
                label="入职日期"
                rules={[{ required: true, message: '请选择入职日期' }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="部门"
                rules={[{ required: true, message: '请选择部门' }]}
              >
                <Select placeholder="请选择部门">
                  {departmentOptions.map(dept => (
                    <Select.Option key={dept} value={dept}>{dept}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="职位"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level"
                label="职级"
              >
                <Select placeholder="请选择职级" allowClear>
                  {levelOptions.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salary"
                label="基本工资"
              >
                <Input placeholder="请输入基本工资" prefix="¥" type="number" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 图片预览弹窗 */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        {previewImage ? (
          <img alt="预览" style={{ width: '100%' }} src={previewImage} />
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          </div>
        )}
      </Modal>
    </>
  )
}
