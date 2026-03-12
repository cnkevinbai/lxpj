import React, { useState } from 'react'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, AppBar, Toolbar, Typography } from '@mui/material'
import { Menu as MenuIcon, DashboardOutlined, InboxOutlined, TeamOutlined, ShoppingCartOutlined, BarChartOutlined, SettingOutlined, RobotOutlined, SafetyOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const menuItems = [
  { path: '/crm/dashboard', icon: <DashboardOutlined />, text: '仪表盘' },
  { path: '/crm/leads', icon: <InboxOutlined />, text: '线索管理' },
  { path: '/crm/customers', icon: <TeamOutlined />, text: '客户管理' },
  { path: '/crm/orders', icon: <ShoppingCartOutlined />, text: '订单管理' },
  { path: '/crm/performance', icon: <BarChartOutlined />, text: '业绩看板' },
  { path: '/crm/ai-chat', icon: <RobotOutlined />, text: 'AI 客服' },
  { path: '/crm/compliance-review', icon: <SafetyOutlined />, text: '合规审查' },
  { path: '/crm/settings', icon: <SettingOutlined />, text: '设置' },
]

/**
 * 移动端导航组件
 */
const MobileNav: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      {/* 顶部导航栏 */}
      <AppBar position="fixed" className="md:hidden">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" className="flex-1">
            道达 CRM
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 侧边抽屉 */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div className="w-64">
          <div className="p-4 bg-brand-blue text-white">
            <Typography variant="h6">道达 CRM</Typography>
          </div>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setDrawerOpen(false)
                }}
                selected={location.pathname === item.path}
              >
                <ListItemIcon className="min-w-10">
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  )
}

export default MobileNav
