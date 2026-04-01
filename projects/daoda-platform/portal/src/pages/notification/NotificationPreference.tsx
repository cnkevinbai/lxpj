/**
 * Notification 前端页面 - 通知偏好设置
 * 
 * 功能:
 * - 通知渠道配置
 * - 免打扰时段设置
 * - 消息类型订阅管理
 * 
 * @version 1.0.0
 * @since 2026-03-30
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Form,
  Switch,
  Select,
  TimePicker,
  Slider,
  Divider,
  Row,
  Col,
  Space,
  Button,
  message,
  List,
  Tag,
  Alert,
} from 'antd';
import {
  BellOutlined,
  MailOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

// ============================================
// 类型定义
// ============================================

interface NotifyPreference {
  // 渠道配置
  inAppEnabled: boolean;
  emailEnabled: boolean;
  dingtalkEnabled: boolean;
  browserEnabled: boolean;
  
  // 免打扰时段
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  
  // 消息类型订阅
  subscribedTypes: string[];
  
  // 其他偏好
  soundEnabled: boolean;
  volume: number;
  digestMode: 'realtime' | 'hourly' | 'daily';
  priorityFilter: 'all' | 'important' | 'urgent';
}

// ============================================
// 通知偏好设置页面
// ============================================

const NotificationPreference: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [preference, setPreference] = useState<NotifyPreference>({
    inAppEnabled: true,
    emailEnabled: false,
    dingtalkEnabled: true,
    browserEnabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
    subscribedTypes: ['system', 'approval', 'reminder', 'notice', 'task'],
    soundEnabled: true,
    volume: 80,
    digestMode: 'realtime',
    priorityFilter: 'all',
  });

  // 加载偏好设置
  useEffect(() => {
    setLoading(true);
    // TODO: 调用 API 获取偏好设置
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // 保存偏好设置
  const handleSave = () => {
    // TODO: 调用 API 保存偏好设置
    message.success('偏好设置已保存');
  };

  // 更新偏好
  const updatePreference = (key: string, value: any) => {
    setPreference(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // 渠道配置
  const channelConfig = [
    {
      key: 'inAppEnabled',
      name: '站内消息',
      icon: <BellOutlined />,
      color: '#6600ff',
      description: '在系统内接收消息通知',
    },
    {
      key: 'dingtalkEnabled',
      name: '钉钉通知',
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      description: '通过钉钉工作通知接收',
    },
    {
      key: 'browserEnabled',
      name: '浏览器通知',
      icon: <InfoCircleOutlined />,
      color: '#1890ff',
      description: '浏览器桌面弹窗通知',
    },
    {
      key: 'emailEnabled',
      name: '邮件通知',
      icon: <MailOutlined />,
      color: '#faad14',
      description: '通过邮件接收通知（需配置邮箱）',
    },
  ];

  // 消息类型配置
  const typeConfig = [
    { key: 'system', name: '系统通知', color: 'default', example: '系统维护、升级通知' },
    { key: 'approval', name: '审批通知', color: 'purple', example: '待审批、审批结果' },
    { key: 'reminder', name: '提醒通知', color: 'orange', example: '任务到期、日程提醒' },
    { key: 'notice', name: '公告通知', color: 'blue', example: '公司公告、重要通知' },
    { key: 'task', name: '任务通知', color: 'green', example: '任务分配、进度更新' },
  ];

  return (
    <div className="notification-preference">
      {/* 页面头部 */}
      <Card className="glass-card" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              <SettingOutlined style={{ marginRight: 8, color: '#6600ff' }} />
              通知偏好设置
            </Typography.Title>
            <Typography.Text type="secondary">
              配置您的通知接收方式和偏好
            </Typography.Text>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={handleSave}
              loading={loading}
              style={{ background: '#6600ff' }}
            >
              保存设置
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 通知渠道配置 */}
      <Card 
        className="glass-card" 
        title={
          <Space>
            <BellOutlined style={{ color: '#6600ff' }} />
            <Typography.Text strong>通知渠道</Typography.Text>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <List
          dataSource={channelConfig}
          renderItem={(channel) => (
            <List.Item
              actions={[
                <Switch
                  key="switch"
                  checked={preference[channel.key as keyof NotifyPreference] as boolean}
                  onChange={(checked) => updatePreference(channel.key, checked)}
                  style={{ background: preference[channel.key as keyof NotifyPreference] ? '#6600ff' : undefined }}
                />
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Tag 
                    style={{ 
                      background: channel.color, 
                      padding: '4px 12px',
                      fontSize: 16,
                    }}
                  >
                    {channel.icon}
                  </Tag>
                }
                title={channel.name}
                description={channel.description}
              />
            </List.Item>
          )}
        />
        
        <Alert
          type="info"
          showIcon
          style={{ marginTop: 16 }}
          message="至少需要启用一个通知渠道才能接收消息"
        />
      </Card>

      {/* 免打扰时段 */}
      <Card 
        className="glass-card" 
        title={
          <Space>
            <ClockCircleOutlined style={{ color: '#6600ff' }} />
            <Typography.Text strong>免打扰时段</Typography.Text>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={24} align="middle">
          <Col span={8}>
            <Space direction="vertical" size="middle">
              <Typography.Text strong>启用免打扰</Typography.Text>
              <Switch
                checked={preference.quietHours.enabled}
                onChange={(checked) => updatePreference('quietHours', {
                  ...preference.quietHours,
                  enabled: checked,
                })}
                style={{ background: preference.quietHours.enabled ? '#6600ff' : undefined }}
              />
            </Space>
          </Col>
          {preference.quietHours.enabled && (
            <>
              <Col span={6}>
                <Space direction="vertical" size="small">
                  <Typography.Text>开始时间</Typography.Text>
                  <TimePicker
                    value={undefined}
                    format="HH:mm"
                    placeholder="22:00"
                    onChange={(time) => {
                      // TODO: 处理时间变化
                    }}
                  />
                </Space>
              </Col>
              <Col span={6}>
                <Space direction="vertical" size="small">
                  <Typography.Text>结束时间</Typography.Text>
                  <TimePicker
                    value={undefined}
                    format="HH:mm"
                    placeholder="08:00"
                    onChange={(time) => {
                      // TODO: 处理时间变化
                    }}
                  />
                </Space>
              </Col>
              <Col span={4}>
                <Typography.Text type="secondary">
                  免打扰时段内不会收到非紧急通知
                </Typography.Text>
              </Col>
            </>
          )}
        </Row>
      </Card>

      {/* 消息类型订阅 */}
      <Card 
        className="glass-card" 
        title={
          <Space>
            <InfoCircleOutlined style={{ color: '#6600ff' }} />
            <Typography.Text strong>消息类型订阅</Typography.Text>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <List
          dataSource={typeConfig}
          renderItem={(type) => (
            <List.Item
              actions={[
                <Switch
                  key="switch"
                  checked={preference.subscribedTypes.includes(type.key)}
                  onChange={(checked) => {
                    const types = checked
                      ? [...preference.subscribedTypes, type.key]
                      : preference.subscribedTypes.filter(t => t !== type.key);
                    updatePreference('subscribedTypes', types);
                  }}
                  style={{ background: preference.subscribedTypes.includes(type.key) ? '#6600ff' : undefined }}
                />
              ]}
            >
              <List.Item.Meta
                avatar={<Tag color={type.color}>{type.name}</Tag>}
                title={type.name}
                description={`示例: ${type.example}`}
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 其他偏好 */}
      <Card 
        className="glass-card" 
        title={
          <Space>
            <SettingOutlined style={{ color: '#6600ff' }} />
            <Typography.Text strong>其他偏好</Typography.Text>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Typography.Text strong>通知声音</Typography.Text>
              <Switch
                checked={preference.soundEnabled}
                onChange={(checked) => updatePreference('soundEnabled', checked)}
              />
              {preference.soundEnabled && (
                <div>
                  <Typography.Text type="secondary">音量: {preference.volume}%</Typography.Text>
                  <Slider
                    value={preference.volume}
                    onChange={(value) => updatePreference('volume', value)}
                    style={{ width: 200 }}
                  />
                </div>
              )}
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Typography.Text strong>推送模式</Typography.Text>
              <Select
                value={preference.digestMode}
                onChange={(value) => updatePreference('digestMode', value)}
                style={{ width: 200 }}
                options={[
                  { value: 'realtime', label: '实时推送' },
                  { value: 'hourly', label: '每小时汇总' },
                  { value: 'daily', label: '每日汇总' },
                ]}
              />
              <Typography.Text type="secondary">
                {preference.digestMode === 'realtime' && '每条消息即时推送'}
                {preference.digestMode === 'hourly' && '每小时汇总未读消息推送'}
                {preference.digestMode === 'daily' && '每日汇总推送（适合低频使用）'}
              </Typography.Text>
            </Space>
          </Col>
        </Row>

        <Divider />

        <Row gutter={24}>
          <Col span={12}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Typography.Text strong>优先级过滤</Typography.Text>
              <Select
                value={preference.priorityFilter}
                onChange={(value) => updatePreference('priorityFilter', value)}
                style={{ width: 200 }}
                options={[
                  { value: 'all', label: '全部消息' },
                  { value: 'important', label: '重要消息' },
                  { value: 'urgent', label: '紧急消息' },
                ]}
              />
              <Typography.Text type="secondary">
                {preference.priorityFilter === 'all' && '接收所有优先级的消息'}
                {preference.priorityFilter === 'important' && '仅接收重要及以上消息'}
                {preference.priorityFilter === 'urgent' && '仅接收紧急消息'}
              </Typography.Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 当前配置摘要 */}
      <Card className="glass-card">
        <Typography.Text strong style={{ marginBottom: 16, display: 'block' }}>
          当前配置摘要
        </Typography.Text>
        <Row gutter={[16, 8]}>
          <Col span={6}>
            <Typography.Text type="secondary">启用渠道: </Typography.Text>
            {channelConfig
              .filter(c => preference[c.key as keyof NotifyPreference])
              .map(c => <Tag key={c.key} color={c.color}>{c.name}</Tag>)
            }
          </Col>
          <Col span={6}>
            <Typography.Text type="secondary">免打扰: </Typography.Text>
            <Tag color={preference.quietHours.enabled ? 'purple' : 'default'}>
              {preference.quietHours.enabled 
                ? `${preference.quietHours.start} - ${preference.quietHours.end}`
                : '未启用'
              }
            </Tag>
          </Col>
          <Col span={6}>
            <Typography.Text type="secondary">推送模式: </Typography.Text>
            <Tag color="blue">
              {preference.digestMode === 'realtime' ? '实时' 
                : preference.digestMode === 'hourly' ? '每小时汇总' 
                : '每日汇总'
              }
            </Tag>
          </Col>
          <Col span={6}>
            <Typography.Text type="secondary">订阅类型: </Typography.Text>
            {preference.subscribedTypes.length} 种
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default NotificationPreference;