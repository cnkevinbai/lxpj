import React from 'react'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import {
  DashboardOutlined,
  TeamOutlined,
  InboxOutlined,
  OpportunityOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  PeopleOutlined,
  SecurityOutlined,
  SettingsOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

const menuItems = [
  { path: '/dashboard', text: '仪表盘', icon: <DashboardOutlined /> },
  { path: '/customers', text: '客户管理', icon: <TeamOutlined /> },
  { path: '/leads', text: '线索管理', icon: <InboxOutlined /> },
  { path: '/opportunities', text: '商机管理', icon: <OpportunityOutlined /> },
  { path: '/orders', text: '订单管理', icon: <ShoppingCartOutlined /> },
  { path: '/products', text: '产品管理', icon: <ShopOutlined /> },
  { path: '/users', text: '用户管理', icon: <PeopleOutlined /> },
  { path: '/roles', text: '角色管理', icon: <SecurityOutlined /> },
  { path: '/settings', text: '系统设置', icon: <SettingsOutlined /> },
]

const MobileNav: React.FC<MobileNavProps> = ({ open, onClose }) => {
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 280 }}>
        <ListItem>
          <ListItemText primary="EV Cart CRM" />
        </ListItem>
        <Divider />
        {menuItems.map((item) => (
          <ListItemButton key={item.path} onClick={() => handleNavigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}

export default MobileNav
