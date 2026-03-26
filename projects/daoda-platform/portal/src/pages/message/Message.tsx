/**
 * 消息中心
 */
import { Card, List, Tag, Button, Space, Tabs } from 'antd'
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons'

const messages = [
  { id: '1', title: '系统升级通知', content: '系统将于今晚升级维护', time: '10:30', read: false },
  { id: '2', title: '审批通过', content: '采购申请已审批通过', time: '09:15', read: true },
  { id: '3', title: '新客户提醒', content: '有新客户注册', time: '08:30', read: true },
]

export default function Message() {
  return (
    <Card title="消息中心" extra={<Button>全部已读</Button>}>
      <Tabs
        items={[
          {
            key: 'all',
            label: '全部消息',
            children: (
              <List
                dataSource={messages}
                renderItem={(item) => (
                  <List.Item
                    actions={[<Button type="link">查看</Button>]}
                  >
                    <List.Item.Meta
                      avatar={item.read ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <BellOutlined style={{ color: '#1890ff' }} />}
                      title={
                        <Space>
                          {item.title}
                          {!item.read && <Tag color="blue">未读</Tag>}
                        </Space>
                      }
                      description={item.content}
                    />
                    <span>{item.time}</span>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'unread',
            label: '未读消息',
            children: (
              <List
                dataSource={messages.filter(m => !m.read)}
                renderItem={(item) => (
                  <List.Item actions={[<Button type="link">查看</Button>]}>
                    <List.Item.Meta
                      avatar={<BellOutlined style={{ color: '#1890ff' }} />}
                      title={item.title}
                      description={item.content}
                    />
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />
    </Card>
  )
}