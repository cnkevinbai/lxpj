/**
 * 员工详情页面
 * 统一UI风格
 */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Descriptions, Tag, Button, Tabs, Table, Typography, Space, Avatar, message } from 'antd'
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

// 员工状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '在职' },
  PROBATION: { color: 'blue', text: '试用期' },
  RESIGNED: { color: 'default', text: '已离职' },
}

// 模拟员工详情
const mockEmployeeDetail = {
  id: '1',
  code: 'EMP001',
  name: '张三',
  avatar: null,
  gender: '男',
  birthDate: '1990-05-15',
  phone: '13800138000',
  email: 'zhangsan@daoda.com',
  idCard: '5101**********1234',
  department: '研发部',
  position: '高级工程师',
  level: 'P7',
  status: 'ACTIVE',
  hireDate: '2020-03-01',
  probationEnd: '2020-06-01',
  managerId: 'emp002',
  managerName: '李四',
  workYears: 4,
  education: '本科',
  school: '四川大学',
  major: '计算机科学与技术',
  address: '四川省眉山市东坡区',
  emergencyContact: '王五',
  emergencyPhone: '13900139000',
  bankName: '中国银行',
  bankAccount: '6216****5678',
}

// 考勤记录
const mockAttendance = [
  { id: '1', date: '2024-03-18', checkIn: '08:55', checkOut: '18:10', status: 'normal', hours: 9.25 },
  { id: '2', date: '2024-03-17', checkIn: '09:05', checkOut: '18:30', status: 'late', hours: 9.42 },
  { id: '3', date: '2024-03-16', checkIn: '08:50', checkOut: '18:00', status: 'normal', hours: 9.17 },
  { id: '4', date: '2024-03-15', checkIn: '-', checkOut: '-', status: 'leave', hours: 0 },
  { id: '5', date: '2024-03-14', checkIn: '08:45', checkOut: '18:20', status: 'normal', hours: 9.58 },
]

// 工作经历
const mockWorkHistory = [
  { id: '1', company: '道达智能', position: '高级工程师', startDate: '2020-03', endDate: '-', current: true },
  { id: '2', company: '某科技公司', position: '中级工程师', startDate: '2017-07', endDate: '2020-02', current: false },
]

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [employee] = useState(mockEmployeeDetail)

  // 考勤表格列
  const attendanceColumns = [
    { title: '日期', dataIndex: 'date', width: 120 },
    { title: '上班打卡', dataIndex: 'checkIn', width: 100 },
    { title: '下班打卡', dataIndex: 'checkOut', width: 100 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v: string) => (
      <Tag color={v === 'normal' ? 'green' : v === 'late' ? 'orange' : 'blue'}>
        {v === 'normal' ? '正常' : v === 'late' ? '迟到' : '请假'}
      </Tag>
    )},
    { title: '工时', dataIndex: 'hours', width: 80, render: (v: number) => `${v}h` },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/hr/employees')}>
            返回
          </Button>
          <Title level={4} className="page-header-title" style={{ marginLeft: 16 }}>
            员工详情
          </Title>
          <Tag color={statusMap[employee.status]?.color} style={{ marginLeft: 8 }}>
            {statusMap[employee.status]?.text}
          </Tag>
        </div>
        <div className="page-header-actions">
          <Button icon={<EditOutlined />} onClick={() => message.info('编辑功能开发中')}>编辑</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => message.info('离职功能开发中')}>办理离职</Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="daoda-card" title="基本信息">
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
              <Avatar size={80} icon="user" style={{ backgroundColor: '#eb2f96' }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>{employee.name}</Title>
                <Space style={{ marginTop: 8 }}>
                  <Tag>{employee.department}</Tag>
                  <Tag color="blue">{employee.position}</Tag>
                  <Tag color="purple">{employee.level}</Tag>
                </Space>
              </div>
            </div>
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="员工编号">{employee.code}</Descriptions.Item>
              <Descriptions.Item label="性别">{employee.gender}</Descriptions.Item>
              <Descriptions.Item label="出生日期">{employee.birthDate}</Descriptions.Item>
              <Descriptions.Item label="手机号">
                <Space>
                  <PhoneOutlined />
                  <a href={`tel:${employee.phone}`}>{employee.phone}</a>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                <Space>
                  <MailOutlined />
                  <a href={`mailto:${employee.email}`}>{employee.email}</a>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="身份证号">{employee.idCard}</Descriptions.Item>
              <Descriptions.Item label="直属上级">{employee.managerName}</Descriptions.Item>
              <Descriptions.Item label="入职日期">{employee.hireDate}</Descriptions.Item>
              <Descriptions.Item label="工作年限">{employee.workYears}年</Descriptions.Item>
              <Descriptions.Item label="学历">{employee.education}</Descriptions.Item>
              <Descriptions.Item label="毕业院校">{employee.school}</Descriptions.Item>
              <Descriptions.Item label="专业">{employee.major}</Descriptions.Item>
              <Descriptions.Item label="家庭住址" span={3}>{employee.address}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="daoda-card" title="紧急联系人">
            <Descriptions column={1}>
              <Descriptions.Item label="联系人">{employee.emergencyContact}</Descriptions.Item>
              <Descriptions.Item label="电话">{employee.emergencyPhone}</Descriptions.Item>
            </Descriptions>
          </Card>
          
          <Card className="daoda-card" title="银行卡信息" style={{ marginTop: 16 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="开户行">{employee.bankName}</Descriptions.Item>
              <Descriptions.Item label="银行卡号">{employee.bankAccount}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card className="daoda-card" style={{ marginTop: 16 }}>
        <Tabs
          defaultActiveKey="attendance"
          items={[
            {
              key: 'attendance',
              label: '考勤记录',
              children: (
                <Table
                  className="daoda-table"
                  columns={attendanceColumns}
                  dataSource={mockAttendance}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              ),
            },
            {
              key: 'workHistory',
              label: '工作经历',
              children: (
                <Table
                  className="daoda-table"
                  columns={[
                    { title: '公司', dataIndex: 'company', width: 200 },
                    { title: '职位', dataIndex: 'position', width: 150 },
                    { title: '开始时间', dataIndex: 'startDate', width: 100 },
                    { title: '结束时间', dataIndex: 'endDate', width: 100 },
                    { title: '状态', dataIndex: 'current', width: 80, render: (v: boolean) => (
                      <Tag color={v ? 'green' : 'default'}>{v ? '在职' : '离职'}</Tag>
                    )},
                  ]}
                  dataSource={mockWorkHistory}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}