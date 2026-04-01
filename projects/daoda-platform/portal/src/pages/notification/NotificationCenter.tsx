/**
 * Notification 前端页面 - 我的消息
 * 
 * 功能:
 * - 消息列表展示
 * - 未读/已读管理
 * - 消息详情查看
 * - 通知偏好设置
 * 
 * @version 1.0.0
 * @since 2026-03-30
 */

import React, { useState, useEffect } from 'react';
import {
  List,
  Button,
  Space,
  Tag,
  Card,
  Typography,
  Avatar,
  Badge,
  Drawer,
  Divider,
  Row,
  Col,
  Tabs,
  Switch,
  Select,
  TimePicker,
  Empty,
  Popover,
  message,
} from 'antd';
import {
  BellOutlined,
  MailOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  CheckOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

// ============================================
// 类型定义
// ============================================

interface NotificationMessage {
  id: string;
  type: 'system' | 'approval' | 'reminder' | 'notice' | 'task';
  title: string;
  content: string;
  category: 'info' | 'warning' | 'error' | 'success';
  senderName?: string;
  senderId?: string;
  businessType?: string;
  businessId?: string;
  workflowInstanceId?: string;
  link?: string;
  readAt?: string;
  createdAt: string;
}

interface NotifyPreference {
  enabledChannels: ('in_app' | 'email' | 'dingtalk' | 'browser')[];
  disabledTypes?: string[];
  quietHours?: {
    start: string;
    end: string;
    enabled: boolean;
  };
  emailEnabled: boolean;
  dingtalkEnabled: boolean;
  browserEnabled: boolean;
}

// 消息类型配置
const MESSAGE_TYPE_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  system: { color: 'default', icon: <InfoCircleOutlined />, label: '系统通知' },
  approval: { color: 'purple', icon: <CheckCircleOutlined />, label: '审批通知' },
  reminder: { color: 'orange', icon: <ClockCircleOutlined />, label: '提醒通知' },
  notice: { color: 'blue', icon: <MailOutlined />, label: '公告通知' },
  task: { color: 'green', icon: <CheckOutlined />, label: '任务通知' },
};

// 消息分类配置
const CATEGORY_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  info: { color: '#1890ff', icon: <InfoCircleOutlined style={{ color: '#1890ff' }} /> },
  warning: { color: '#faad14', icon: <WarningOutlined style={{ color: '#faad14' }} /> },
  error: { color: '#ff4d4f', icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> },
  success: { color: '#52c41a', icon: <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
};

// ============================================
// 我的消息页面
// ============================================

const NotificationCenter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [preferenceDrawerVisible, setPreferenceDrawerVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<NotificationMessage | null>(null);
  const [preference, setPreference] = useState<NotifyPreference>({
    enabledChannels: ['in_app', 'dingtalk', 'browser'],
    emailEnabled: false,
    dingtalkEnabled: true,
    browserEnabled: true,
    quietHours: {
      start: '22:00',
      end: '08:00',
      enabled: false,
    },
  });
  const [activeTab, setActiveTab] = useState('all');

  // Mock 数据
  useEffect(() => {
    setLoading(true);
    // TODO: 调用 API 获取数据
    setTimeout(() => {
      const mockMessages: NotificationMessage[] = [
        {
          id: 'msg-001',
          type: 'approval',
          title: '待审批: 张三请假申请 - 3天',
          content: '您有一条待审批事项: 张三请假申请。请假原因：家中有事需要处理。',
          category: 'info',
          senderName: '审批系统',
          businessType: 'leave',
          businessId: 'LEAVE-2026-001',
          workflowInstanceId: 'wi-leave-001',
          link: '/workflow/pending',
          createdAt: '2026-03-30 08:30:00',
        },
        {
          id: 'msg-002',
          type: 'reminder',
          title: '任务提醒: 项目进度汇报',
          content: '任务 "本周项目进度汇报" 将在今天 17:00 到期，请及时处理。',
          category: 'warning',
          senderName: '任务系统',
          createdAt: '2026-03-30 10:00:00',
        },
        {
          id: 'msg-003',
          type: 'notice',
          title: '系统公告: 下周一公司全员大会',
          content: '公司将于下周一（4月1日）上午9:00召开全员大会，请准时参加。',
          category: 'info',
          senderName: '行政部',
          createdAt: '2026-03-29 16:00:00',
          readAt: '2026-03-29 18:00:00',
        },
        {
          id: 'msg-004',
          type: 'approval',
          title: '审批结果: 采购申请已通过',
          content: '您的采购申请 "办公设备采购" 已审批通过。',
          category: 'success',
          senderName: '审批系统',
          businessType: 'purchase',
          businessId: 'PUR-2026-001',
          createdAt: '2026-03-28 14:00:00',
          readAt: '2026-03-28 15:00:00',
        },
        {
          id: 'msg-005',
          type: 'system',
          title: '系统维护通知',
          content: '系统将于今晚 23:00-02:00 进行维护升级，届时部分功能可能无法使用。',
          category: 'warning',
          senderName: '系统管理员',
          createdAt: '2026-03-28 10:00:00',
          readAt: '2026-03-28 12:00:00',
        },
      ];

      setMessages(mockMessages);
      setUnreadCount(mockMessages.filter(m => !m.readAt).length);
      setLoading(false);
    }, 500);
  }, []);

  // 标记已读
  const handleMarkRead = (messageId: string) => {
    // TODO: 调用 API 标记已读
    setMessages(messages.map(m => 
      m.id === messageId 
        ? { ...m, readAt: new Date().toISOString() }
        : m
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
    message.success('已标记为已读');
  };

  // 全部已读
  const handleMarkAllRead = () => {
    // TODO: 调用 API 全部已读
    const now = new Date().toISOString();
    setMessages(messages.map(m => ({ ...m, readAt: now })));
    setUnreadCount(0);
    message.success('已全部标记为已读');
  };

  // 删除消息
  const handleDelete = (messageId: string) => {
    // TODO: 调用 API 删除消息
    const targetMessage = messages.find(m => m.id === messageId);
    setMessages(messages.filter(m => m.id !== messageId));
    if (targetMessage && !targetMessage.readAt) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    message.success('消息已删除');
  };

  // 更新偏好设置
  const handlePreferenceChange = (key: string, value: any) => {
    setPreference(prev => ({
      ...prev,
      [key]: value,
    }));
    // TODO: 调用 API 更新偏好
  };

  // 筛选消息
  const filteredMessages = messages.filter(m => {
    if (activeTab === 'unread') return !m.readAt;
    if (activeTab === 'approval') return m.type === 'approval';
    if (activeTab === 'system') return m.type === 'system';
    return true;
  });

  // 消息列表项渲染
  const MessageItem: React.FC<{ message: NotificationMessage }> = ({ message }) => {
    const typeConfig = MESSAGE_TYPE_CONFIG[message.type];
    const categoryConfig = CATEGORY_CONFIG[message.category];
    const isUnread = !message.readAt;

    return (
      <List.Item
        style={{
          background: isUnread ? 'rgba(102, 0, 255, 0.05)' : 'transparent',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 8,
          border: isUnread ? '1px solid rgba(102, 0, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)',
        }}
        actions={[
          <Space key="actions">
            {isUnread && (
              <Button 
                type="text" 
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleMarkRead(message.id)}
              >
                已读
              </Button>
            )}
            <Button 
              type="text" 
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(message.id)}
            />
          </Space>
        ]}
        onClick={() => {
          setCurrentMessage(message);
          setDetailDrawerVisible(true);
          if (isUnread) {
            handleMarkRead(message.id);
          }
        }}
      >
        <List.Item.Meta
          avatar={
            <Badge dot={isUnread} offset={[-2, 2]}>
              <Avatar 
                icon={typeConfig.icon} 
                style={{ background: typeConfig.color }}
              />
            </Badge>
          }
          title={
            <Space>
              <Typography.Text strong={isUnread} style={{ opacity: isUnread ? 1 : 0.8 }}>
                {message.title}
              </Typography.Text>
              {isUnread && (
                <Tag color="purple" style={{ marginLeft: 4 }}>未读</Tag>
              )}
            </Space>
          }
          description={
            <Space direction="vertical" size="small">
              <Typography.Text 
                type="secondary" 
                style={{ 
                  maxWidth: 300, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {message.content}
              </Typography.Text>
              <Space size="small">
                <Typography.Text type="secondary">
                  {new Date(message.createdAt).toLocaleString('zh-CN')}
                </Typography.Text>
                {message.senderName && (
                  <Tag>{message.senderName}</Tag>
                )}
              </Space>
            </Space>
          }
        />
      </List.Item>
    );
  };

  return (
    <div className="notification-center">
      {/* 页面头部 */}
      <Card className="glass-card" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              <BellOutlined style={{ marginRight: 8, color: '#6600ff' }} />
              消息中心
            </Typography.Title>
            <Typography.Text type="secondary">
              查看系统通知、审批提醒、任务提醒
            </Typography.Text>
          </Col>
          <Col>
            <Space>
              <Badge count={unreadCount} style={{ backgroundColor: '#6600ff' }}>
                <Typography.Text strong>{unreadCount} 条未读</Typography.Text>
              </Badge>
              {unreadCount > 0 && (
                <Button type="link" onClick={handleMarkAllRead}>
                  全部已读
                </Button>
              )}
              <Button 
                icon={<SettingOutlined />}
                onClick={() => setPreferenceDrawerVisible(true)}
              >
                通知设置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 消息列表 */}
      <Card className="glass-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'all',
              label: (
                <Space>
                  <BellOutlined />
                  全部消息
                  <Badge count={messages.length} size="small" style={{ backgroundColor: '#6600ff' }} />
                </Space>
              ),
            },
            {
              key: 'unread',
              label: (
                <Space>
                  <MailOutlined />
                  未读消息
                  <Badge count={unreadCount} size="small" style={{ backgroundColor: '#ff4d4f' }} />
                </Space>
              ),
            },
            {
              key: 'approval',
              label: (
                <Space>
                  <CheckCircleOutlined />
                  审批通知
                </Space>
              ),
            },
            {
              key: 'system',
              label: (
                <Space>
                  <InfoCircleOutlined />
                  系统通知
                </Space>
              ),
            },
          ]}
        />

        {filteredMessages.length > 0 ? (
          <List
            loading={loading}
            dataSource={filteredMessages}
            renderItem={(msg) => <MessageItem message={msg} />}
            style={{ marginTop: 16 }}
          />
        ) : (
          <Empty 
            description={activeTab === 'unread' ? '没有未读消息' : '暂无消息'} 
            style={{ padding: 40 }}
          />
        )}
      </Card>

      {/* 消息详情抽屉 */}
      <Drawer
        title={
          <Space>
            {currentMessage && MESSAGE_TYPE_CONFIG[currentMessage.type].icon}
            消息详情
          </Space>
        }
        placement="right"
        width={400}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        className="glass-drawer"
      >
        {currentMessage && (
          <div>
            {/* 分类图标 */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={64}
                icon={MESSAGE_TYPE_CONFIG[currentMessage.type].icon}
                style={{ background: MESSAGE_TYPE_CONFIG[currentMessage.type].color }}
              />
              <Typography.Title level={5} style={{ marginTop: 12 }}>
                {MESSAGE_TYPE_CONFIG[currentMessage.type].label}
              </Typography.Title>
            </div>

            {/* 消息内容 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Typography.Text type="secondary">消息标题</Typography.Text>
              <Divider style={{ margin: '8px 0' }} />
              <Typography.Title level={5}>{currentMessage.title}</Typography.Title>
            </Card>

            <Card size="small" style={{ marginBottom: 16 }}>
              <Typography.Text type="secondary">消息内容</Typography.Text>
              <Divider style={{ margin: '8px 0' }} />
              <Typography.Text>{currentMessage.content}</Typography.Text>
            </Card>

            {/* 消息元信息 */}
            <Card size="small">
              <Typography.Text type="secondary">详细信息</Typography.Text>
              <Divider style={{ margin: '8px 0' }} />
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Typography.Text strong>发送者: </Typography.Text>
                  <Typography.Text>{currentMessage.senderName || '系统'}</Typography.Text>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>时间: </Typography.Text>
                  <Typography.Text>
                    {new Date(currentMessage.createdAt).toLocaleString('zh-CN')}
                  </Typography.Text>
                </Col>
                {currentMessage.readAt && (
                  <Col span={12}>
                    <Typography.Text strong>已读: </Typography.Text>
                    <Typography.Text>
                      {new Date(currentMessage.readAt).toLocaleString('zh-CN')}
                    </Typography.Text>
                  </Col>
                )}
                {currentMessage.businessType && (
                  <Col span={12}>
                    <Typography.Text strong>业务类型: </Typography.Text>
                    <Tag color="purple">{currentMessage.businessType}</Tag>
                  </Col>
                )}
                {currentMessage.businessId && (
                  <Col span={12}>
                    <Typography.Text strong>业务ID: </Typography.Text>
                    <Typography.Text>{currentMessage.businessId}</Typography.Text>
                  </Col>
                )}
              </Row>
            </Card>

            {/* 快捷操作 */}
            {currentMessage.link && (
              <Button 
                type="primary" 
                block 
                style={{ marginTop: 16 }}
                onClick={() => {
                  // TODO: 跳转到相关页面
                  message.info(`跳转到: ${currentMessage.link}`);
                }}
              >
                查看详情
              </Button>
            )}
          </div>
        )}
      </Drawer>

      {/* 通知偏好设置抽屉 */}
      <Drawer
        title={
          <Space>
            <SettingOutlined />
            通知偏好设置
          </Space>
        }
        placement="right"
        width={400}
        open={preferenceDrawerVisible}
        onClose={() => setPreferenceDrawerVisible(false)}
        className="glass-drawer"
      >
        <div>
          {/* 通知渠道 */}
          <Card size="small" style={{ marginBottom: 16 }}>
            <Typography.Text type="secondary">通知渠道</Typography.Text>
            <Divider style={{ margin: '8px 0' }} />
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <BellOutlined />
                    <Typography.Text>站内消息</Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Switch 
                    checked={preference.enabledChannels.includes('in_app')}
                    onChange={(checked) => {
                      const channels = checked 
                        ? [...preference.enabledChannels, 'in_app']
                        : preference.enabledChannels.filter(c => c !== 'in_app');
                      handlePreferenceChange('enabledChannels', channels);
                    }}
                    style={{ background: '#6600ff' }}
                  />
                </Col>
              </Row>

              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <MailOutlined />
                    <Typography.Text>邮件通知</Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Switch 
                    checked={preference.emailEnabled}
                    onChange={(checked) => handlePreferenceChange('emailEnabled', checked)}
                  />
                </Col>
              </Row>

              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Typography.Text>钉钉通知</Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Switch 
                    checked={preference.dingtalkEnabled}
                    onChange={(checked) => handlePreferenceChange('dingtalkEnabled', checked)}
                    style={{ background: '#6600ff' }}
                  />
                </Col>
              </Row>

              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Typography.Text>浏览器通知</Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Switch 
                    checked={preference.browserEnabled}
                    onChange={(checked) => handlePreferenceChange('browserEnabled', checked)}
                  />
                </Col>
              </Row>
            </Space>
          </Card>

          {/* 免打扰时段 */}
          <Card size="small" style={{ marginBottom: 16 }}>
            <Typography.Text type="secondary">免打扰时段</Typography.Text>
            <Divider style={{ margin: '8px 0' }} />
            <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
              <Col>
                <Typography.Text>启用免打扰</Typography.Text>
              </Col>
              <Col>
                <Switch 
                  checked={preference.quietHours?.enabled}
                  onChange={(checked) => handlePreferenceChange('quietHours', {
                    ...preference.quietHours,
                    enabled: checked,
                  })}
                />
              </Col>
            </Row>
            {preference.quietHours?.enabled && (
              <Space style={{ width: '100%' }}>
                <TimePicker 
                  value={preference.quietHours?.start ? undefined : undefined}
                  placeholder="开始时间"
                  format="HH:mm"
                  style={{ width: 100 }}
                />
                <Typography.Text>至</Typography.Text>
                <TimePicker 
                  placeholder="结束时间"
                  format="HH:mm"
                  style={{ width: 100 }}
                />
              </Space>
            )}
          </Card>

          {/* 消息类型过滤 */}
          <Card size="small">
            <Typography.Text type="secondary">消息类型订阅</Typography.Text>
            <Divider style={{ margin: '8px 0' }} />
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="选择要接收的消息类型"
              value={['system', 'approval', 'reminder', 'notice', 'task'].filter(
                t => !preference.disabledTypes?.includes(t)
              )}
              onChange={(values) => {
                const disabledTypes = ['system', 'approval', 'reminder', 'notice', 'task'].filter(
                  t => !values.includes(t)
                );
                handlePreferenceChange('disabledTypes', disabledTypes);
              }}
              options={[
                { value: 'system', label: '系统通知' },
                { value: 'approval', label: '审批通知' },
                { value: 'reminder', label: '提醒通知' },
                { value: 'notice', label: '公告通知' },
                { value: 'task', label: '任务通知' },
              ]}
            />
          </Card>

          {/* 保存按钮 */}
          <Button 
            type="primary" 
            block 
            style={{ marginTop: 16, background: '#6600ff' }}
            onClick={() => {
              // TODO: 调用 API 保存偏好
              setPreferenceDrawerVisible(false);
              message.success('偏好设置已保存');
            }}
          >
            保存设置
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default NotificationCenter;