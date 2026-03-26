/**
 * 工作台首页
 * 基于效果图实现，根据实际业务模块设计
 */
import { useState, useEffect } from 'react'
import { Row, Col, Card, Tag, Avatar, Typography, Badge, List, Space } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
  DollarOutlined,
  FileTextOutlined,
  BellOutlined,
  RightOutlined,
  ShopOutlined,
  IdcardOutlined,
  WalletOutlined,
  FileSearchOutlined,
  CustomerServiceOutlined,
  SolutionOutlined,
  ControlOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const { Title, Text } = Typography

// 待办事项数据
const todoItems = [
  { id: '1', type: '客户', typeColor: '#1890ff', title: '客户跟进 - 北京科技有限公司', time: '今天 14:00', path: '/crm/customers' },
  { id: '2', type: '合同', typeColor: '#722ed1', title: '合同审批 - 上海分公司采购合同', time: '今天 15:30', path: '/service/contracts' },
  { id: '3', type: '工单', typeColor: '#13c2c2', title: '工单处理 - 设备维修工单#WO20240401', time: '今天 16:00', path: '/service/tickets' },
  { id: '4', type: '审批', typeColor: '#fa8c16', title: '费用报销审批 - 差旅费报销申请', time: '明天 09:00', path: '/finance' },
  { id: '5', type: '商机', typeColor: '#52c41a', title: '商机跟进 - 深圳项目商机', time: '明天 10:00', path: '/crm/opportunities' },
]

// 快捷入口数据 - 根据实际业务模块
const shortcuts = [
  { key: 'customers', label: '客户管理', icon: <TeamOutlined />, path: '/crm/customers', color: '#1890ff', count: 128 },
  { key: 'orders', label: '订单管理', icon: <ShoppingCartOutlined />, path: '/crm/orders', color: '#52c41a', count: 56 },
  { key: 'tickets', label: '工单管理', icon: <ToolOutlined />, path: '/service/tickets', color: '#13c2c2', count: 23 },
  { key: 'inventory', label: '库存管理', icon: <ShopOutlined />, path: '/erp/inventory', color: '#722ed1', count: 8 },
  { key: 'finance', label: '财务管理', icon: <DollarOutlined />, path: '/finance/overview', color: '#fa8c16', count: null },
  { key: 'employees', label: '员工管理', icon: <IdcardOutlined />, path: '/hr/employees', color: '#eb2f96', count: 45 },
  { key: 'contracts', label: '合同管理', icon: <SolutionOutlined />, path: '/service/contracts', color: '#2f54eb', count: 12 },
  { key: 'settings', label: '系统设置', icon: <ControlOutlined />, path: '/settings', color: '#8c8c8c', count: null },
]

// 数据统计卡片 - 根据实际业务模块
const statsCards = [
  { 
    key: 'customers', 
    label: '客户管理', 
    value: 128, 
    unit: '位', 
    icon: <TeamOutlined />, 
    color: '#1890ff', 
    trend: '+12%', 
    subText: '本月新增',
    path: '/crm/customers' 
  },
  { 
    key: 'orders', 
    label: '订单管理', 
    value: 56, 
    unit: '笔', 
    icon: <ShoppingCartOutlined />, 
    color: '#52c41a', 
    trend: '+8%', 
    subText: '待处理订单',
    path: '/crm/orders' 
  },
  { 
    key: 'tickets', 
    label: '工单管理', 
    value: 23, 
    unit: '件', 
    icon: <ToolOutlined />, 
    color: '#13c2c2', 
    trend: '-5%', 
    subText: '待处理工单',
    path: '/service/tickets' 
  },
  { 
    key: 'finance', 
    label: '财务概览', 
    value: 89.6, 
    unit: '万元', 
    icon: <DollarOutlined />, 
    color: '#fa8c16', 
    trend: '+15%', 
    subText: '本月营收',
    path: '/finance/overview' 
  },
]

// 业务模块快捷卡片
const moduleCards = [
  {
    key: 'crm',
    title: '客户关系管理',
    description: '客户、线索、商机、订单、报价',
    icon: <TeamOutlined style={{ fontSize: 32 }} />,
    color: '#1890ff',
    path: '/crm/customers',
    stats: [
      { label: '客户', value: 128 },
      { label: '商机', value: 34 },
      { label: '订单', value: 56 },
    ]
  },
  {
    key: 'erp',
    title: '运营管理',
    description: '采购、库存、生产',
    icon: <ShopOutlined style={{ fontSize: 32 }} />,
    color: '#722ed1',
    path: '/erp/purchase',
    stats: [
      { label: '采购单', value: 12 },
      { label: '库存', value: 156 },
      { label: '生产单', value: 8 },
    ]
  },
  {
    key: 'service',
    title: '售后服务',
    description: '工单、合同、配件管理',
    icon: <CustomerServiceOutlined style={{ fontSize: 32 }} />,
    color: '#13c2c2',
    path: '/service/tickets',
    stats: [
      { label: '待处理', value: 23 },
      { label: '进行中', value: 15 },
      { label: '已完成', value: 89 },
    ]
  },
  {
    key: 'hr',
    title: '人事管理',
    description: '员工、考勤、薪资',
    icon: <IdcardOutlined style={{ fontSize: 32 }} />,
    color: '#eb2f96',
    path: '/hr/employees',
    stats: [
      { label: '员工', value: 45 },
      { label: '部门', value: 8 },
      { label: '待入职', value: 3 },
    ]
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // 格式化日期时间
  const formatDate = (date: Date) => {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return {
      weekday: days[date.getDay()],
      date: `${year}/${month}/${day}`,
      time: `${hours}:${minutes}`,
    }
  }

  const dateTime = formatDate(currentTime)

  return (
    <div className="dashboard">
      {/* 顶部欢迎区域 */}
      <div className="welcome-header">
        <div className="welcome-left">
          <Avatar size={48} icon={<UserOutlined />} className="user-avatar" />
          <div className="welcome-text">
            <Title level={4} style={{ margin: 0 }}>欢迎回来，管理员</Title>
            <Text type="secondary">今天有 {todoItems.length} 项待办事项需要处理</Text>
          </div>
        </div>
        <div className="welcome-right">
          <div style={{ textAlign: 'right' }}>
            <div><Text strong style={{ fontSize: 16 }}>{dateTime.weekday}</Text></div>
            <div><Text type="secondary">{dateTime.date} {dateTime.time}</Text></div>
          </div>
        </div>
      </div>

      {/* 数据统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {statsCards.map((stat) => (
          <Col xs={12} sm={12} md={6} key={stat.key}>
            <Card 
              className="stat-card"
              hoverable
              onClick={() => navigate(stat.path)}
            >
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <Text type="secondary" className="stat-label">{stat.label}</Text>
                <div className="stat-value">
                  <Text strong style={{ fontSize: 28, color: stat.color }}>{stat.value}</Text>
                  <Text type="secondary">{stat.unit}</Text>
                </div>
                <div className="stat-footer">
                  <Text style={{ fontSize: 12, color: stat.trend.startsWith('+') ? '#52c41a' : '#ff4d4f' }}>
                    {stat.trend}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{stat.subText}</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 主内容区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 左侧：待办事项 */}
        <Col xs={24} lg={12}>
          <Card 
            className="todo-card"
            title={
              <Space>
                <BellOutlined />
                <span>待办事项</span>
                <Badge count={todoItems.length} style={{ marginLeft: 8 }} />
              </Space>
            }
            extra={<a onClick={() => navigate('/message')}>查看全部 <RightOutlined /></a>}
          >
            <List
              dataSource={todoItems}
              renderItem={(item) => (
                <List.Item 
                  className="todo-item"
                  onClick={() => navigate(item.path)}
                >
                  <Space>
                    <Tag color={item.typeColor}>{item.type}</Tag>
                    <Text className="todo-title">{item.title}</Text>
                  </Space>
                  <Text type="secondary">{item.time}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 右侧：业务模块入口 */}
        <Col xs={24} lg={12}>
          <Card title="业务模块" className="module-card">
            <Row gutter={[12, 12]}>
              {moduleCards.map((module) => (
                <Col span={12} key={module.key}>
                  <div 
                    className="module-item"
                    onClick={() => navigate(module.path)}
                  >
                    <div className="module-header">
                      <div 
                        className="module-icon"
                        style={{ backgroundColor: `${module.color}15`, color: module.color }}
                      >
                        {module.icon}
                      </div>
                      <div className="module-info">
                        <Text strong>{module.title}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{module.description}</Text>
                      </div>
                    </div>
                    <div className="module-stats">
                      {module.stats.map((stat, index) => (
                        <div key={index} className="module-stat">
                          <Text type="secondary" style={{ fontSize: 12 }}>{stat.label}</Text>
                          <Text strong style={{ color: module.color }}>{stat.value}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 快捷入口 */}
      <Card 
        className="shortcut-card"
        title="快捷入口"
        style={{ marginTop: 16 }}
      >
        <Row gutter={[16, 16]}>
          {shortcuts.map((item) => (
            <Col xs={6} sm={4} md={3} key={item.key}>
              <div 
                className="shortcut-item"
                onClick={() => navigate(item.path)}
              >
                <Badge count={item.count} overflowCount={99}>
                  <div 
                    className="shortcut-icon"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                </Badge>
                <Text className="shortcut-label">{item.label}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}