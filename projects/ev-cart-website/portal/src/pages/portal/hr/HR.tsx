import { useState } from 'react'
import { Typography, Card, Row, Col, Table, Button, Space, Tag, Input, Select, Badge, Avatar, Progress } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  TeamOutlined,
  CalendarOutlined,
  TrophyOutlined,
  DollarOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const HR = () => {
  const [selectedTab, setSelectedTab] = useState('employees')

  // 员工数据
  const employeeData = [
    { key: '1', name: '张三', department: '销售部', position: '销售经理', phone: '138****1234', email: 'zhang***@daoda.com', status: 'active', joinDate: '2024-03-15' },
    { key: '2', name: '李四', department: '技术部', position: '技术总监', phone: '139****5678', email: 'li***@daoda.com', status: 'active', joinDate: '2023-06-20' },
    { key: '3', name: '王五', department: '生产部', position: '生产主管', phone: '136****9012', email: 'wang***@daoda.com', status: 'active', joinDate: '2024-01-10' },
    { key: '4', name: '赵六', department: '财务部', position: '财务经理', phone: '137****3456', email: 'zhao***@daoda.com', status: 'leave', joinDate: '2023-09-05' },
  ]

  // 考勤数据
  const attendanceData = [
    { key: '1', employee: '张三', date: '2026-03-15', checkIn: '08:55', checkOut: '18:05', status: 'normal', workHours: 8.5 },
    { key: '2', employee: '李四', date: '2026-03-15', checkIn: '09:05', checkOut: '18:10', status: 'late', workHours: 8 },
    { key: '3', employee: '王五', date: '2026-03-15', checkIn: '08:50', checkOut: '18:00', status: 'normal', workHours: 8.5 },
    { key: '4', employee: '赵六', date: '2026-03-15', checkIn: '-', checkOut: '-', status: 'leave', workHours: 0 },
  ]

  const stats = [
    { label: '员工总数', value: 156, suffix: '人', icon: <TeamOutlined />, color: '#1890FF' },
    { label: '今日出勤', value: 142, suffix: '人', icon: <CalendarOutlined />, color: '#52C41A' },
    { label: '本月绩效优秀', value: 28, suffix: '人', icon: <TrophyOutlined />, color: '#FAAD14' },
    { label: '本月薪资总额', value: '¥125 万', suffix: '', icon: <DollarOutlined />, color: '#722ED1' },
  ]

  const employeeColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name', render: (name: string) => (
      <Space>
        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890FF' }} />
        <span>{name}</span>
      </Space>
    )},
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '职位', dataIndex: 'position', key: 'position' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          active: { text: '在职', color: 'green' },
          leave: { text: '请假', color: 'orange' },
          resigned: { text: '离职', color: 'gray' },
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Badge color={s.color} text={s.text} />
      },
    },
    { title: '入职日期', dataIndex: 'joinDate', key: 'joinDate' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
        </Space>
      ),
    },
  ]

  const attendanceColumns = [
    { title: '员工', dataIndex: 'employee', key: 'employee' },
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '上班打卡', dataIndex: 'checkIn', key: 'checkIn' },
    { title: '下班打卡', dataIndex: 'checkOut', key: 'checkOut' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          normal: { text: '正常', color: 'green' },
          late: { text: '迟到', color: 'orange' },
          early: { text: '早退', color: 'yellow' },
          leave: { text: '请假', color: 'blue' },
          absent: { text: '缺勤', color: 'red' },
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Badge color={s.color} text={s.text} />
      },
    },
    { title: '工时', dataIndex: 'workHours', key: 'workHours', render: (hours: number) => `${hours}h` },
  ]

  return (
    <div className="hr-page">
      {/* Header */}
      <div className="hr-header">
        <div className="header-content">
          <div>
            <Title level={2} style={{ margin: 0, color: '#FFFFFF' }}>人力资源管理系统</Title>
            <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Human Resource Management</Paragraph>
          </div>
          <Space size="large">
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              新建员工
            </Button>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="hr-stats">
        <Row gutter={[24, 24]}>
          {stats.map((stat, i) => (
            <Col xs={12} sm={6} key={i}>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                  <div className="stat-info">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value" style={{ color: stat.color }}>
                      {stat.value}{stat.suffix}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Tabs */}
      <Card className="hr-tabs">
        <div className="tab-buttons">
          <Button
            type={selectedTab === 'employees' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('employees')}
          >
            <TeamOutlined /> 员工管理
          </Button>
          <Button
            type={selectedTab === 'attendance' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('attendance')}
          >
            <CalendarOutlined /> 考勤管理
          </Button>
          <Button type="default">
            <TrophyOutlined /> 绩效管理
          </Button>
          <Button type="default">
            <DollarOutlined /> 薪酬管理
          </Button>
        </div>

        {/* 筛选区 */}
        <div className="filter-section">
          <Space wrap size="large">
            <Input
              placeholder={selectedTab === 'employees' ? '搜索员工姓名、部门...' : '搜索员工、日期...'}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Select placeholder="部门" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="sales">销售部</Select.Option>
              <Select.Option value="tech">技术部</Select.Option>
              <Select.Option value="production">生产部</Select.Option>
              <Select.Option value="finance">财务部</Select.Option>
            </Select>
            <Select placeholder="状态" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="active">在职</Select.Option>
              <Select.Option value="leave">请假</Select.Option>
              <Select.Option value="resigned">离职</Select.Option>
            </Select>
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={selectedTab === 'employees' ? employeeColumns : attendanceColumns}
          dataSource={selectedTab === 'employees' ? employeeData : attendanceData}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          size="middle"
        />
      </Card>

      <style>{`
        .hr-page { min-height: 100vh; background: #F0F2F5; }
        
        .hr-header {
          background: linear-gradient(135deg, #EB2F96 0%, #C41D7F 100%);
          padding: 24px 24px;
          margin-bottom: 24px;
        }
        
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .hr-stats { padding: 0 24px 24px; }
        
        .stat-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .stat-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .stat-icon {
          font-size: 40px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
        }
        
        .stat-label {
          color: #8C8C8C;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: bold;
        }
        
        .hr-tabs {
          margin: 0 24px 24px;
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .tab-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #F0F0F0;
        }
        
        .filter-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #F0F0F0;
        }
        
        @media (max-width: 768px) {
          .header-content { flex-direction: column; gap: 16px; }
          .stat-content { flex-direction: column; text-align: center; }
          .tab-buttons { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  )
}

export default HR
