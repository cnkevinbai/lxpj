import React, { useState } from 'react'
import { Card, Row, Col, Table, Statistic, Tag, Space, Button, Avatar, Progress, Badge } from 'antd'
import { UsergroupAddOutlined, DashboardOutlined, CheckCircleOutlined } from '@ant-design/icons'

interface Employee {
  id: string
  name: string
  department: string
  position: string
  status: string
  attendance: number
  performance: number
  avatar: string
}

const HRManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: '张三',
      department: '销售部',
      position: '销售经理',
      status: 'active',
      attendance: 98,
      performance: 95,
      avatar: '👨‍💼',
    },
    {
      id: '2',
      name: '李四',
      department: '技术部',
      position: '高级工程师',
      status: 'active',
      attendance: 96,
      performance: 92,
      avatar: '👩‍💻',
    },
    {
      id: '3',
      name: '王五',
      department: '生产部',
      position: '生产主管',
      status: 'active',
      attendance: 99,
      performance: 88,
      avatar: '👨‍🔧',
    },
  ])

  const totalEmployees = 156
  const activeToday = 148
  const onLeave = 5
  const onBusiness = 3

  const statusColors: Record<string, string> = {
    active: 'success',
    leave: 'warning',
    business: 'blue',
    absent: 'error',
  }

  const columns = [
    {
      title: '员工',
      dataIndex: 'name',
      width: 150,
      render: (name: string, record: any) => (
        <Space>
          <Avatar size="large" style={{ backgroundColor: '#1890ff', fontSize: 20 }}>
            {record.avatar}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.position}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 120,
    },
    {
      title: '出勤率',
      dataIndex: 'attendance',
      width: 130,
      render: (rate: number) => (
        <Progress
          percent={rate}
          strokeColor={rate >= 95 ? '#52c41a' : rate >= 90 ? '#faad14' : '#ff4d4f'}
          size="small"
          format={() => `${rate}%`}
        />
      ),
    },
    {
      title: '绩效',
      dataIndex: 'performance',
      width: 130,
      render: (score: number) => (
        <Progress
          percent={score}
          strokeColor={score >= 90 ? '#52c41a' : score >= 80 ? '#faad14' : '#ff4d4f'}
          size="small"
          format={() => `${score}分`}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => <Tag color={statusColors[status]}>{status === 'active' ? '在职' : status}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small">考核</Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>👥 人力资源管理</h1>
        <p style={{ color: '#666' }}>员工管理与绩效考核</p>
      </div>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="员工总数"
              value={totalEmployees}
              suffix="人"
              valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 700 }}
              prefix={<UsergroupAddOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日出勤"
              value={activeToday}
              suffix="人"
              valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 700 }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="请假中"
              value={onLeave}
              suffix="人"
              valueStyle={{ color: '#faad14', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="出差中"
              value={onBusiness}
              suffix="人"
              valueStyle={{ color: '#722ed1', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="📋 员工列表">
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  )
}

export default HRManagement
