import { useState } from 'react'
import { Typography, Card, Row, Col, List, Button, Space, Badge, Input, Tabs, Avatar, Tag } from 'antd'
import {
  BellOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  CheckOutlined,
  DeleteOutlined,
  StarOutlined,
  SearchOutlined,
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const MessageCenter = () => {
  const [selectedTab, setSelectedTab] = useState('inbox')

  const inboxData = [
    { key: '1', type: 'system', title: '系统升级通知', content: '系统将于今晚 23:00 进行例行维护...', time: '10 分钟前', read: false, starred: false },
    { key: '2', type: 'message', title: '张三给您发送了消息', content: '关于 CRM 系统的客户数据...', time: '30 分钟前', read: false, starred: true },
    { key: '3', type: 'email', title: '客户询价邮件', content: '您好，我想咨询一下观光车的价格...', time: '1 小时前', read: true, starred: false },
    { key: '4', type: 'sms', title: '验证码短信', content: '您的验证码是：123456...', time: '2 小时前', read: true, starred: false },
  ]

  const stats = [
    { label: '未读消息', value: 15, suffix: '条', icon: <BellOutlined />, color: '#1890FF' },
    { label: '站内信', value: 128, suffix: '条', icon: <MessageOutlined />, color: '#52C41A' },
    { label: '邮件', value: 45, suffix: '封', icon: <MailOutlined />, color: '#FAAD14' },
    { label: '短信', value: 82, suffix: '条', icon: <PhoneOutlined />, color: '#722ED1' },
  ]

  const getMessageIcon = (type: string) => {
    const iconMap: any = {
      system: <BellOutlined />,
      message: <MessageOutlined />,
      email: <MailOutlined />,
      sms: <PhoneOutlined />,
    }
    return iconMap[type] || <BellOutlined />
  }

  const getMessageColor = (type: string) => {
    const colorMap: any = {
      system: '#1890FF',
      message: '#52C41A',
      email: '#FAAD14',
      sms: '#722ED1',
    }
    return colorMap[type] || '#1890FF'
  }

  return (
    <div className="message-page">
      {/* Header */}
      <div className="message-header">
        <div className="header-content">
          <div>
            <Title level={2} style={{ margin: 0, color: '#FFFFFF' }}>消息中心</Title>
            <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Message Center</Paragraph>
          </div>
          <Space size="large">
            <Input
              placeholder="搜索消息..."
              prefix={<SearchOutlined />}
              style={{ width: 300, background: 'rgba(255,255,255,0.2)' }}
            />
            <Button icon={<CheckOutlined />}>全部已读</Button>
            <Button icon={<DeleteOutlined />}>批量删除</Button>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="message-stats">
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

      {/* 消息列表 */}
      <Card className="message-list-card">
        <Tabs activeKey={selectedTab} onChange={setSelectedTab}>
          <Tabs.TabPane tab={<><BellOutlined /> 全部消息</>} key="inbox">
            <List
              itemLayout="horizontal"
              dataSource={inboxData}
              renderItem={(item: any) => (
                <List.Item
                  className={`message-item ${!item.read ? 'unread' : ''}`}
                  actions={[
                    <Button key="star" type="text" icon={<StarOutlined style={{ color: item.starred ? '#FAAD14' : '#D9D9D9' }} />} />,
                    <Button key="read" type="text" icon={<CheckOutlined />} />,
                    <Button key="delete" type="text" danger icon={<DeleteOutlined />} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: getMessageColor(item.type) }}>
                        {getMessageIcon(item.type)}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <Text strong={!item.read}>{item.title}</Text>
                        {!item.read && <Badge color="red" />}
                        <Tag color={getMessageColor(item.type)}>{item.type}</Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Paragraph ellipsis style={{ margin: 0, color: '#8C8C8C' }}>
                          {item.content}
                        </Paragraph>
                        <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<><MessageOutlined /> 站内信</>} key="messages">
            <List itemLayout="horizontal" dataSource={inboxData.filter((i: any) => i.type === 'message')} renderItem={(item: any) => (
              <List.Item className={`message-item ${!item.read ? 'unread' : ''}`}>
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#52C41A' }}><MessageOutlined /></Avatar>}
                  title={item.title}
                  description={item.content}
                />
              </List.Item>
            )} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<><MailOutlined /> 邮件</>} key="emails">
            <List itemLayout="horizontal" dataSource={inboxData.filter((i: any) => i.type === 'email')} renderItem={(item: any) => (
              <List.Item className={`message-item ${!item.read ? 'unread' : ''}`}>
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#FAAD14' }}><MailOutlined /></Avatar>}
                  title={item.title}
                  description={item.content}
                />
              </List.Item>
            )} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<><PhoneOutlined /> 短信</>} key="sms">
            <List itemLayout="horizontal" dataSource={inboxData.filter((i: any) => i.type === 'sms')} renderItem={(item: any) => (
              <List.Item className={`message-item ${!item.read ? 'unread' : ''}`}>
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#722ED1' }}><PhoneOutlined /></Avatar>}
                  title={item.title}
                  description={item.content}
                />
              </List.Item>
            )} />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <style>{`
        .message-page { min-height: 100vh; background: #F0F2F5; }
        
        .message-header {
          background: linear-gradient(135deg, #FA8C16 0%, #D46B08 100%);
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
        
        .message-stats { padding: 0 24px 24px; }
        
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
        
        .message-list-card {
          margin: 0 24px 24px;
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .message-item {
          padding: 16px 24px !important;
          transition: background 0.3s;
          cursor: pointer;
        }
        
        .message-item:hover {
          background: #FAFAFA;
        }
        
        .message-item.unread {
          background: #E6F7FF;
        }
        
        @media (max-width: 768px) {
          .header-content { flex-direction: column; gap: 16px; }
          .stat-content { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  )
}

export default MessageCenter
