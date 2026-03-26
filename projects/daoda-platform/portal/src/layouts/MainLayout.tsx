/**
 * 门户主布局
 */
import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Button, Space, Badge, Input, Typography, Modal } from 'antd'
import {
  HomeOutlined,
  TeamOutlined,
  ShopOutlined,
  DollarOutlined,
  ToolOutlined,
  UserOutlined,
  FileTextOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import './MainLayout.css'
import { useModuleStore } from '@/stores/moduleStore'
import { menuItems, filterMenuByModules, menuData } from '@/configs/menuConfig'
import { TenantSelector } from '@/components/TenantSelector'

const { Header, Sider, Content } = Layout
const { Text } = Typography

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'message' | 'system' | 'approval'
}

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems)
  const navigate = useNavigate()
  const location = useLocation()

  // 获取已启用的模块
  const enabledModules = useModuleStore(state => state.enabledModules)

  // 过滤菜单：根据已启用的模块过滤
  useEffect(() => {
    const filtered = filterMenuByModules(menuData, enabledModules)
    setFilteredMenuItems(filtered)
  }, [enabledModules])

  const notifications: NotificationItem[] = [
    { id: '1', title: '新订单提醒', description: '客户北京景区提交了新订单', time: '10分钟前', read: false, type: 'message' },
    { id: '2', title: '待审批工单', description: '设备维修工单需要审批', time: '30分钟前', read: false, type: 'system' },
    { id: '3', title: '客户跟进提醒', description: '客户张三的跟进提醒', time: '1小时前', read: true, type: 'message' },
    { id: '4', title: '系统维护通知', description: '今晚22:00系统维护', time: '2小时前', read: true, type: 'system' },
    { id: '5', title: '审批通过', description: '采购申请已通过', time: '昨天', read: true, type: 'approval' },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  const userMenuItems = [
    { key: 'profile', label: '个人设置', icon: <SettingOutlined /> },
    { key: 'logout', label: '退出登录', icon: <LogoutOutlined /> },
  ]

  const handleUserMenu = ({ key }: { key: string }) => {
    if (key === 'logout') {
      Modal.confirm({
        title: '确认退出',
        content: '确定要退出登录吗？',
        onOk: () => {
          localStorage.removeItem('token')
          navigate('/login')
        },
      })
    } else if (key === 'profile') {
      navigate('/settings')
    }
  }

  const handleNotificationClick = () => {
    setNotificationOpen(true)
  }

  const handleNotificationClose = () => {
    setNotificationOpen(false)
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    // TODO: 实现搜索功能
  }

  return (
    <Layout className="main-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        className="sider"
      >
        <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          {collapsed ? (
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#0066FF' }}>道</div>
          ) : (
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0066FF', marginBottom: 4 }}>道达</div>
              <div style={{ fontSize: 12, color: '#999' }}>智能数字化平台</div>
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['crm', 'erp', 'finance', 'service', 'hr', 'cms']}
          items={filteredMenuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header className="header">
          <Space size="middle">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            {/* 租户选择器 */}
            <TenantSelector />
            <Input
              placeholder="搜索..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              size="small"
            />
          </Space>

          <Space size="middle" className="header-right">
            <Badge count={unreadCount} overflowCount={99}>
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                onClick={handleNotificationClick}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenu }} trigger={['click']}>
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }}>
                <Avatar icon={<UserOutlined />} />
                <Text style={{ fontWeight: 500 }}>管理员</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="content">
          <Outlet />
        </Content>
      </Layout>

      {/* 通知弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>通知中心</span>
            <Button size="small" type="link" onClick={() => console.log('标记已读')}>
              全部标记已读
            </Button>
          </div>
        }
        open={notificationOpen}
        onCancel={handleNotificationClose}
        footer={null}
        width={400}
        styles={{ body: { padding: '0' } }}
      >
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                backgroundColor: notification.read ? '#fff' : '#f5f5f7',
              }}
              onClick={() => console.log('查看通知:', notification)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text strong>{notification.title}</Text>
                <Text type="secondary">{notification.time}</Text>
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {notification.description}
              </Text>
            </div>
          ))}
        </div>
      </Modal>
    </Layout>
  )
}
