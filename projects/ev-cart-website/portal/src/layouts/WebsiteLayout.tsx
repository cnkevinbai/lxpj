import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import {
  HomeOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
  InfoCircleOutlined,
  MailOutlined,
  DashboardOutlined,
  LoginOutlined,
} from '@ant-design/icons'

const { Header, Content, Footer } = Layout

const WebsiteLayout = () => {
  const location = useLocation()

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
    { key: '/products', icon: <AppstoreOutlined />, label: <Link to="/products">产品中心</Link> },
    { key: '/solutions', icon: <SolutionOutlined />, label: <Link to="/solutions">解决方案</Link> },
    { key: '/dealer', icon: <TeamOutlined />, label: <Link to="/dealer">经销商</Link> },
    { key: '/service', icon: <CustomerServiceOutlined />, label: <Link to="/service">服务</Link> },
    { key: '/about', icon: <InfoCircleOutlined />, label: <Link to="/about">关于我们</Link> },
    { key: '/contact', icon: <MailOutlined />, label: <Link to="/contact">联系我们</Link> },
  ]

  return (
    <Layout className="website-layout">
      <Header className="website-header" style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff', marginRight: '40px' }}>
          道达智能
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
        <div style={{ marginLeft: '20px' }}>
          <Link to="/portal-intro">
            <Button type="primary" icon={<DashboardOutlined />}>
              业务管理系统
            </Button>
          </Link>
        </div>
      </Header>

      <Content className="website-content">
        <Outlet />
      </Content>

      <Footer className="website-footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#fff', marginBottom: '16px' }}>🏢 道达智能 - 完整的业务管理体系</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Button size="small">CRM</Button>
              <Button size="small">ERP</Button>
              <Button size="small">财务</Button>
              <Button size="small">外贸</Button>
              <Button size="small">售后</Button>
              <Button size="small">人力</Button>
              <Button size="small">CMS</Button>
              <Button size="small">消息</Button>
              <Button size="small">审批</Button>
              <Button size="small">系统管理</Button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ color: '#999', marginBottom: '8px' }}>联系我们</div>
              <div style={{ color: '#fff' }}>电话：400-XXX-XXXX</div>
              <div style={{ color: '#fff' }}>邮箱：info@ddzn.com</div>
              <div style={{ color: '#fff' }}>地址：XXX 省 XXX 市 XXX 区</div>
            </div>
            
            <div>
              <div style={{ color: '#999', marginBottom: '8px' }}>快速链接</div>
              <div><Link to="/portal-intro" style={{ color: '#fff' }}>业务管理系统</Link></div>
              <div><Link to="/login" style={{ color: '#fff' }}>登录</Link></div>
              <div><a href="#" style={{ color: '#fff' }}>下载 APP</a></div>
            </div>
            
            <div>
              <div style={{ color: '#999', marginBottom: '8px' }}>关注我们</div>
              <div style={{ color: '#fff' }}>微信公众号</div>
              <div style={{ color: '#fff' }}>新浪微博</div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #333', color: '#999' }}>
            Copyright © 2026 道达智能 版权所有 | 京 ICP 备 XXXXXXXX 号
          </div>
        </div>
      </Footer>
    </Layout>
  )
}

export default WebsiteLayout
