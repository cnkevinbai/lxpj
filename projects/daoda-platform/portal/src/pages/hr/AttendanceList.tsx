/**
 * 考勤列表页面
 * 支持打卡记录、补卡申请、考勤统计
 */
import { useState } from 'react'
import { 
  Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, 
  Typography, Calendar, Badge, List, Row, Col, DatePicker,
  Radio, Statistic,
} from 'antd'
import { 
  SearchOutlined, 
  CalendarOutlined,
  TableOutlined,
  ClockCircleOutlined,
  SaveOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  attendanceService, 
  Attendance, 
  AttendanceStatus,
  UpdateAttendanceDto,
  employeeService,
} from '@/services/hr.service'
import dayjs, { Dayjs } from 'dayjs'
import type { BadgeProps } from 'antd'

const { Text } = Typography

// 考勤状态映射
const statusMap: Record<AttendanceStatus, { color: string; text: string }> = {
  PENDING: { color: 'default', text: '待确认' },
  NORMAL: { color: 'green', text: '正常' },
  LATE: { color: 'orange', text: '迟到' },
  EARLY_LEAVE: { color: 'orange', text: '早退' },
  ABSENT: { color: 'red', text: '缺勤' },
  LEAVE: { color: 'processing', text: '请假' },
}

// 审批状态颜色
const approvalColorMap: Record<AttendanceStatus, BadgeProps['color']> = {
  PENDING: 'default',
  NORMAL: 'success',
  LATE: 'warning',
  EARLY_LEAVE: 'warning',
  ABSENT: 'error',
  LEAVE: 'processing',
}

export default function AttendanceList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [clockInForm] = Form.useForm()
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')
  
  // 筛选条件
  const [filters, setFilters] = useState({
    employeeId: undefined as string | undefined,
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    status: undefined as AttendanceStatus | undefined,
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [clockInModalVisible, setClockInModalVisible] = useState(false)
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null)
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [clockInDate, setClockInDate] = useState<Dayjs | null>(dayjs())

  // 获取员工列表（用于筛选）
  const { data: employeesData } = useQuery({
    queryKey: ['employees-all'],
    queryFn: () => employeeService.getList({ page: 1, pageSize: 100, status: 'ACTIVE' }),
  })

  // 获取考勤列表
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['attendances', filters, pagination, viewMode],
    queryFn: () => attendanceService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 更新考勤记录
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAttendanceDto }) => 
      attendanceService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      queryClient.invalidateQueries({ queryKey: ['attendances'] })
    },
  })

  // 打卡
  const clockInMutation = useMutation({
    mutationFn: (dto: { employeeId: string; date: string; checkIn?: string; checkOut?: string }) => 
      attendanceService.create(dto),
    onSuccess: () => {
      message.success('打卡成功')
      setClockInModalVisible(false)
      clockInForm.resetFields()
      queryClient.invalidateQueries({ queryKey: ['attendances'] })
    },
  })

  // 补卡申请
  const makeUpMutation = useMutation({
    mutationFn: (dto: { employeeId: string; date: string; checkIn?: string; checkOut?: string; remark?: string }) => 
      attendanceService.create(dto),
    onSuccess: () => {
      message.success('补卡申请提交成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['attendances'] })
    },
  })

  // 获取统计数据
  const { data: statsData } = useQuery({
    queryKey: ['attendance-stats', filters],
    queryFn: async () => {
      const res = await attendanceService.getList({
        page: 1,
        pageSize: 100,
        ...filters,
      })
      const list = res.list || []
      const totalDays = list.length
      const normalDays = list.filter(a => a.status === 'NORMAL').length
      const lateDays = list.filter(a => a.status === 'LATE').length
      const absentDays = list.filter(a => a.status === 'ABSENT').length
      const leaveDays = list.filter(a => a.status === 'LEAVE').length
      const attendanceRate = totalDays > 0 ? ((normalDays / totalDays) * 100).toFixed(1) : '0'
      
      return {
        totalDays,
        normalDays,
        lateDays,
        absentDays,
        leaveDays,
        attendanceRate,
      }
    },
  })

  // 处理搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    if (viewMode === 'table') {
      refetch()
    }
  }

  // 处理重置
  const handleReset = () => {
    setFilters({
      employeeId: undefined,
      startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
      endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
      status: undefined,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理打卡
  const handleClockIn = () => {
    clockInForm.validateFields().then(values => {
      const employeeId = values.employeeId || employeesData?.list[0]?.id
      const date = values.date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD')
      const checkIn = values.checkIn?.format('YYYY-MM-DD HH:mm:ss')
      const checkOut = values.checkOut?.format('YYYY-MM-DD HH:mm:ss')
      if (employeeId) {
        clockInMutation.mutate({ employeeId, date, checkIn, checkOut })
      } else {
        message.warning('请先选择员工')
      }
    })
  }

  // 处理补卡申请
  const handleMakeUpCard = () => {
    form.resetFields()
    form.setFieldsValue({
      date: dayjs(),
      employeeId: employeesData?.list[0]?.id,
    })
    setModalVisible(true)
  }

  // 处理编辑/审批
  const handleApprove = (record: Attendance) => {
    setEditingAttendance(record)
    form.setFieldsValue({
      status: record.status,
      remark: record.remark,
      checkIn: record.checkIn ? dayjs(record.checkIn) : null,
      checkOut: record.checkOut ? dayjs(record.checkOut) : null,
    })
    setModalVisible(true)
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingAttendance) {
        const dto: UpdateAttendanceDto = {
          status: values.status,
          remark: values.remark,
          checkIn: values.checkIn ? values.checkIn.format('YYYY-MM-DD HH:mm:ss') : undefined,
          checkOut: values.checkOut ? values.checkOut.format('YYYY-MM-DD HH:mm:ss') : undefined,
        }
        updateMutation.mutate({ id: editingAttendance.id, dto })
      } else {
        const employeeId = values.employeeId || employeesData?.list[0]?.id
        makeUpMutation.mutate({
          employeeId: employeeId || '',
          date: values.date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
          checkIn: values.checkIn ? values.checkIn.format('YYYY-MM-DD HH:mm:ss') : undefined,
          checkOut: values.checkOut ? values.checkOut.format('YYYY-MM-DD HH:mm:ss') : undefined,
          remark: values.remark,
        })
      }
    })
  }

  // 日历单元格渲染
  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD')
    const dayAttendances = data?.list?.filter(a => 
      dayjs(a.date).format('YYYY-MM-DD') === dateStr
    ) || []

    return (
      <div style={{ minHeight: 60 }}>
        {dayAttendances.slice(0, 3).map((attendance) => (
          <div key={attendance.id} style={{ marginBottom: 4 }}>
            <Badge 
              color={approvalColorMap[attendance.status]} 
              text={attendance.employee.name}
              style={{ fontSize: 12 }}
            />
          </div>
        ))}
        {dayAttendances.length > 3 && (
          <div style={{ fontSize: 12, color: '#999' }}>
            +{dayAttendances.length - 3} 更多
          </div>
        )}
      </div>
    )
  }

  // 表格列定义
  const columns: ColumnsType<Attendance> = [
    {
      title: '员工',
      dataIndex: ['employee', 'name'],
      width: 120,
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: '部门',
      dataIndex: ['employee', 'department'],
      width: 120,
    },
    {
      title: '日期',
      dataIndex: 'date',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '签到时间',
      dataIndex: 'checkIn',
      width: 130,
      render: (checkIn: string | null) => 
        checkIn ? dayjs(checkIn).format('HH:mm:ss') : '-',
    },
    {
      title: '签退时间',
      dataIndex: 'checkOut',
      width: 130,
      render: (checkOut: string | null) => 
        checkOut ? dayjs(checkOut).format('HH:mm:ss') : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: AttendanceStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      ellipsis: true,
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleApprove(record)}
          >
            {record.status === 'PENDING' ? '审批' : '编辑'}
          </Button>
        </Space>
      ),
    },
  ]

  // 获取选中日期的考勤数据
  const selectedDateData = selectedDate 
    ? data?.list?.filter(a => dayjs(a.date).isSame(selectedDate, 'day'))
    : []

  return (
    <>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="出勤率" 
              value={statsData?.attendanceRate || 0} 
              suffix="%"
              precision={1}
              valueStyle={{ color: statsData?.attendanceRate && parseFloat(statsData.attendanceRate) >= 95 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="迟到次数" 
              value={statsData?.lateDays || 0} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="缺勤次数" 
              value={statsData?.absentDays || 0} 
              prefix={<Tag color="red" />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="总记录数" 
              value={statsData?.totalDays || 0} 
              suffix="条"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="考勤管理"
        extra={
          <Space>
            <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)}>
              <Radio.Button value="table">
                <TableOutlined /> 列表
              </Radio.Button>
              <Radio.Button value="calendar">
                <CalendarOutlined /> 日历
              </Radio.Button>
            </Radio.Group>
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
            <DatePicker.RangePicker
              value={[
                filters.startDate ? dayjs(filters.startDate) : null,
                filters.endDate ? dayjs(filters.endDate) : null,
              ]}
              onChange={(dates) => {
                if (dates) {
                  setFilters(prev => ({
                    ...prev,
                    startDate: dates[0]?.format('YYYY-MM-DD') || '',
                    endDate: dates[1]?.format('YYYY-MM-DD') || '',
                  }))
                }
              }}
            />
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Select.Option value="PENDING">待确认</Select.Option>
              <Select.Option value="NORMAL">正常</Select.Option>
              <Select.Option value="LATE">迟到</Select.Option>
              <Select.Option value="EARLY_LEAVE">早退</Select.Option>
              <Select.Option value="ABSENT">缺勤</Select.Option>
              <Select.Option value="LEAVE">请假</Select.Option>
            </Select>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </div>

        {/* 打卡区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={() => setClockInModalVisible(true)}
            >
              打卡记录
            </Button>
            <Button 
              icon={<FileTextOutlined />}
              onClick={handleMakeUpCard}
            >
              补卡申请
            </Button>
          </Space>
        </div>

        {/* 视图切换 */}
        {viewMode === 'table' ? (
          /* 表格视图 */
          <Table
            columns={columns}
            dataSource={data?.list}
            rowKey="id"
            loading={isLoading}
            scroll={{ x: 1200 }}
            pagination={{
              current: pagination.page,
              pageSize: pagination.pageSize,
              total: data?.total,
              showSizeChanger: true,
              showTotal: total => `共 ${total} 条`,
              onChange: (page, pageSize) => setPagination({ page, pageSize }),
            }}
          />
        ) : (
          /* 日历视图 */
          <Row gutter={16}>
            <Col span={18}>
              <Calendar 
                cellRender={dateCellRender}
                onSelect={(value) => setSelectedDate(value)}
              />
            </Col>
            <Col span={6}>
              <Card title="选中日期考勤" size="small">
                {selectedDateData && selectedDateData.length > 0 ? (
                  <List
                    dataSource={selectedDateData}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Badge color={approvalColorMap[item.status]} />
                          }
                          title={item.employee.name}
                          description={
                            <Space direction="vertical" size={0}>
                              <Text>{statusMap[item.status].text}</Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {item.checkIn ? dayjs(item.checkIn).format('HH:mm') : '未签到'} - 
                                {item.checkOut ? dayjs(item.checkOut).format('HH:mm') : '未签退'}
                              </Text>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    <ClockCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                    <div>该日期无考勤记录</div>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        )}
      </Card>

      {/* 打卡弹窗 */}
      <Modal
        title="打卡记录"
        open={clockInModalVisible}
        onOk={handleClockIn}
        onCancel={() => {
          setClockInModalVisible(false)
          clockInForm.resetFields()
        }}
        width={500}
      >
        <Form form={clockInForm} layout="vertical">
          <Form.Item
            name="employeeId"
            label="员工"
            rules={[{ required: true, message: '请选择员工' }]}
            initialValue={employeesData?.list[0]?.id}
          >
            <Select placeholder="请选择员工" showSearch>
              {employeesData?.list.map(emp => (
                <Select.Option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.department}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="打卡日期"
            rules={[{ required: true, message: '请选择打卡日期' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="checkIn" label="上班时间">
                <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="checkOut" label="下班时间">
                <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 补卡/编辑弹窗 */}
      <Modal
        title={editingAttendance?.status === 'PENDING' ? '考勤审批' : (editingAttendance ? '编辑考勤' : '补卡申请')}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={600}
        destroyOnClose
      >
        {editingAttendance && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>员工：</Text>{editingAttendance.employee.name}
            <Text strong style={{ marginLeft: 24 }}>日期：</Text>
            {dayjs(editingAttendance.date).format('YYYY-MM-DD')}
          </div>
        )}
        <Form form={form} layout="vertical">
          {!editingAttendance && (
            <>
              <Form.Item
                name="employeeId"
                label="员工"
                rules={[{ required: true, message: '请选择员工' }]}
                initialValue={employeesData?.list[0]?.id}
              >
                <Select placeholder="请选择员工" showSearch>
                  {employeesData?.list.map(emp => (
                    <Select.Option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="date"
                label="补卡日期"
                rules={[{ required: true, message: '请选择补卡日期' }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="status"
            label="考勤状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="NORMAL">正常</Select.Option>
              <Select.Option value="LATE">迟到</Select.Option>
              <Select.Option value="EARLY_LEAVE">早退</Select.Option>
              <Select.Option value="ABSENT">缺勤</Select.Option>
              <Select.Option value="LEAVE">请假</Select.Option>
              <Select.Option value="PENDING">待确认</Select.Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="checkIn" label="签到时间">
                <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="checkOut" label="签退时间">
                <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
