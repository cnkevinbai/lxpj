import { useState } from 'react'
import { Typography, Card, Row, Col, Statistic, Progress, Space, Button, Avatar, Badge, Menu } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  DollarOutlined,
  GlobalOutlined,
  CloudServerOutlined,
  MessageOutlined,
  SettingOutlined,
  BellOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: '工作台' },
    { key: 'crm', icon: <TeamOutlined />, label: 'CRM' },
    { key: 'erp', icon: <AppstoreOutlined />, label: 'ERP' },
    { key: 'finance', icon: <DollarOutlined />, label: '财务' },
    { key: 'foreign', icon: <GlobalOutlined />, label: '外贸' },
    { key: 'aftersales', icon: <CloudServerOutlined />, label: '售后' },
    { key: 'hr', icon: <TeamOutlined />, label: 'HR' },
    { key: 'message', icon: <MessageOutlined />, label: '消息' },
    { key: 'settings', icon: <SettingOutlined />, label: '系统' },
  ]

  const stats = [
    { label: '待办事项', value: 12, suffix: '项', color: '#1890FF' },
    { label: '待审批', value: 5, suffix: '项', color: '#FAAD14' },
    { label: '我的客户', value: 28, suffix: '个', color: '#52C41A' },
    { label: '我的订单', value: 16, suffix: '个', color: '#722ED1' },
  ]

  const quickActions = [
    { name: '新建客户', icon: <PlusOutlined /> },
    { name: '创建商机', icon: <PlusOutlined /> },
    { name: '下单', icon: <PlusOutlined /> },
    { name: '请假', icon: <PlusOutlined /> },
    { name: '报销', icon: <PlusOutlined /> },
    { name: '工单', icon: <PlusOutlined /> },
    { name: '更多', icon: <PlusOutlined /> },
  ]

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <Title level={3} style={{ margin: 0, color: '#FFFFFF' }}>道达智能数字化平台</Title>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <SearchOutlined />
              <input placeholder="搜索..." />
            </div>
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 20, color: '#FFFFFF' }} />
            </Badge>
            <Avatar style={{ backgroundColor: '#0066FF' }}>张</Avatar>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        {/* 侧边导航 */}
        <div className={`dashboard-sider ${collapsed ? 'collapsed' : ''}`}>
          <Menu
            mode="inline"
            selectedKeys={['dashboard']}
            items={menuItems}
            theme="dark"
            inlineCollapsed={collapsed}
          />
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* 主内容区 */}
        <div className="dashboard-content">
          {/* 欢迎语 */}
          <div className="welcome-section">
            <Title level={2} style={{ margin: 0 }}>欢迎回来，张三</Title>
            <Paragraph type="secondary">2026 年 3 月 15 日 星期日</Paragraph>
          </div>

          {/* 统计卡片 */}
          <Row gutter={[24, 24]} className="stats-row">
            {stats.map((stat, i) => (
              <Col xs={12} sm={6} key={i}>
                <Card className="stat-card">
                  <Statistic
                    title={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{ color: stat.color, fontSize: 36 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* 快捷入口 */}
          <Card className="quick-actions-card" title="快捷入口">
            <Space wrap size="large">
              {quickActions.map((action, i) => (
                <Button key={i} icon={action.icon} size="large">
                  {action.name}
                </Button>
              ))}
            </Space>
          </Card>

          {/* 数据看板 */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card title="本月销售趋势">
                <div className="chart-placeholder">
                  <div style={{ fontSize: 60 }}>📊</div>
                  <Paragraph type="secondary">销售趋势图表</Paragraph>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="部门绩效排名">
                <div className="chart-placeholder">
                  <div style={{ fontSize: 60 }}>🏆</div>
                  <Paragraph type="secondary">绩效排名图表</Paragraph>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 系统完成度 */}
          <Card title="系统模块完成度">
            <div className="progress-list">
              {[
                { name: 'CRM 系统', progress: 92, color: '#1890FF' },
                { name: 'ERP 系统', progress: 88, color: '#52C41A' },
                { name: '财务系统', progress: 82, color: '#FAAD14' },
                { name: '售后系统', progress: 99, color: '#13C2C2' },
                { name: 'HR 系统', progress: 82, color: '#EB2F96' },
              ].map((item, i) => (
                <div key={i} className="progress-item">
                  <span>{item.name}</span>
                  <Progress
                    percent={item.progress}
                    strokeColor={item.color}
                    size="small"
                    style={{ width: 200 }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          min-height: 100vh;
          background: #F0F2F5;
        }

        .dashboard-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%);
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-actions {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
        }

        .search-box input {
          border: none;
          background: transparent;
          color: #FFFFFF;
          outline: none;
          width: 200px;
        }

        .search-box input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .dashboard-body {
          display: flex;
          margin-top: 64px;
          min-height: calc(100vh - 64px);
        }

        .dashboard-sider {
          width: 256px;
          background: #001529;
          position: fixed;
          left: 0;
          top: 64px;
          bottom: 0;
          overflow-y: auto;
          transition: width 0.3s;
          z-index: 99;
        }

        .dashboard-sider.collapsed {
          width: 80px;
        }

        .collapse-btn {
          position: absolute;
          right: -12px;
          top: 50%;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid #E0E0E0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .dashboard-content {
          flex: 1;
          margin-left: 256px;
          padding: 24px;
          transition: margin-left 0.3s;
        }

        .dashboard-sider.collapsed + .dashboard-content {
          margin-left: 80px;
        }

        .welcome-section {
          margin-bottom: 32px;
        }

        .stats-row {
          margin-bottom: 24px;
        }

        .stat-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .quick-actions-card {
          margin-bottom: 24px;
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .chart-placeholder {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #F8F9FA;
          border-radius: 8px;
        }

        .progress-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .progress-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media (max-width: 1024px) {
          .dashboard-sider {
            width: 80px;
          }

          .dashboard-content {
            margin-left: 80px;
          }

          .search-box input {
            width: 120px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-sider {
            display: none;
          }

          .dashboard-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
