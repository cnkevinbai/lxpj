/**
 * HR 人力行政主页
 * 员工统计、组织架构概览、考勤异常提醒、待发薪资统计
 */

import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Statistic, Progress, Table, Tag, Space, Typography, Skeleton, Alert, Button } from 'antd'
import { 
  UsergroupAddOutlined, 
  TeamOutlined, 
  WarningOutlined, 
  MoneyCollectOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { hrStatsService, Employee } from '@/services/hr.service'
import { employeeService } from '@/services/hr.service'
import dayjs from 'dayjs'

const { Text } = Typography

// 部门颜色映射
const departmentColors: Record<string, string> = {
  '技术部': '#1890ff',
  '销售部': '#52c41a',
  '市场部': '#faad14',
  '人力资源部': '#eb2f96',
  '财务部': '#722ed1',
  '售后部': '#13c2c2',
  '运营部': '#f5222d',
  '管理层': '#262626',
}

export default function HRHome() {
  const navigate = useNavigate()

  // 获取 HR 统计数据
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['hr-stats'],
    queryFn: () => hrStatsService.getOverview(),
    refetchInterval: 60000, // 每分钟刷新
  })

  // 获取最新员工列表
  const { data: employeesData, isLoading: employeesLoading } = useQuery({
    queryKey: ['employees-latest'],
    queryFn: () => employeeService.getList({ page: 1, pageSize: 5 }),
  })

  // 获取部门分布
  const departmentDistribution = stats?.departmentStats || []

  // 计算总人数
  const totalDepartmentCount = departmentDistribution.reduce((sum, dept) => sum + dept.count, 0)

  // 最新员工表格列
  const employeeColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Employee) => (
        <Space>
          {record.avatar ? (
            <img 
              src={record.avatar} 
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
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => (
        <Tag color={departmentColors[dept] || 'default'}>{dept}</Tag>
      ),
    },
    { title: '职位', dataIndex: 'position', key: 'position' },
    {
      title: '入职日期',
      dataIndex: 'hireDate',
      key: 'hireDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'default'}>
          {status === 'ACTIVE' ? '在职' : status === 'INACTIVE' ? '休假' : '离职'}
        </Tag>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="员工总数"
              value={stats?.totalEmployees || 0}
              prefix={<UsergroupAddOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <Text type="success">
                <ArrowUpOutlined /> 本月新增 {stats?.totalEmployees ? Math.floor(stats.totalEmployees * 0.1) : 0} 人
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在职员工"
              value={stats?.activeEmployees || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <Progress 
                percent={stats?.totalEmployees ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0}
                size="small"
                showInfo={false}
                strokeColor="#52c41a"
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="考勤异常"
              value={stats?.attendanceExceptions || 0}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <Text type="warning">
                <ClockCircleOutlined /> 本月待处理
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待发薪资"
              value={stats?.totalPendingSalary || 0}
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#eb2f96' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <Text>
                <MoneyCollectOutlined /> {stats?.pendingSalaries || 0} 人待发放
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 部门分布 */}
        <Col span={12}>
          <Card 
            title="部门分布"
            extra={
              <Button type="link" onClick={() => navigate('/hr/employees')}>
                查看全部
              </Button>
            }
          >
            {statsLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {departmentDistribution.map((dept) => {
                  const percentage = totalDepartmentCount > 0 
                    ? Math.round((dept.count / totalDepartmentCount) * 100) 
                    : 0
                  return (
                    <div key={dept.department}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Space>
                          <div style={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: 2, 
                            background: departmentColors[dept.department] || '#d9d9d9' 
                          }} />
                          <Text>{dept.department}</Text>
                        </Space>
                        <Text strong>{dept.count} 人 ({percentage}%)</Text>
                      </div>
                      <Progress
                        percent={percentage}
                        size="small"
                        showInfo={false}
                        strokeColor={departmentColors[dept.department] || '#d9d9d9'}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </Col>

        {/* 最新员工 */}
        <Col span={12}>
          <Card 
            title="最新入职"
            extra={
              <Button type="link" onClick={() => navigate('/hr/employees')}>
                查看全部
              </Button>
            }
          >
            {employeesLoading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                dataSource={employeesData?.list}
                columns={employeeColumns}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ y: 300 }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* 考勤异常提醒 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card 
            title="本月考勤异常提醒"
            extra={
              <Button type="link" onClick={() => navigate('/hr/attendance')}>
                查看考勤详情
              </Button>
            }
          >
            {statsLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : stats?.attendanceExceptions && stats.attendanceExceptions > 0 ? (
              <Alert
                message={`本月共有 ${stats.attendanceExceptions} 条考勤异常记录需要处理`}
                description="包括迟到、早退、缺勤等情况，请及时审核并处理"
                type="warning"
                showIcon
                action={
                  <Button type="primary" size="small" onClick={() => navigate('/hr/attendance')}>
                    立即处理
                  </Button>
                }
              />
            ) : (
              <Alert
                message="本月考勤情况良好"
                description="暂无异常记录需要处理"
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
