/**
 * 个人中心页面
 * 
 * @author daod-team
 */

import React from 'react';
import { 
  Card, Row, Col, Avatar, Typography, Descriptions, Tag, 
  Button, Space, Divider, List, Badge, Progress 
} from 'antd';
import { 
  UserOutlined, EditOutlined, SafetyCertificateOutlined,
  HistoryOutlined, BellOutlined, SettingOutlined
} from '@ant-design/icons';
import { PageHeader } from '@/components/common';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const user = {
    name: '管理员',
    email: 'admin@daod.com',
    role: '系统管理员',
    department: '技术部',
    phone: '138****8888',
    createTime: '2026-03-11 10:00:00',
    lastLoginTime: '2026-03-25 09:30:00',
  };

  const recentActivities = [
    { id: 1, action: '登录系统', time: '2026-03-25 09:30:00', type: 'login' },
    { id: 2, action: '查看车辆列表', time: '2026-03-25 09:35:00', type: 'view' },
    { id: 3, action: '处理告警 #A001', time: '2026-03-25 10:00:00', type: 'alarm' },
    { id: 4, action: '查看监控地图', time: '2026-03-25 10:30:00', type: 'view' },
    { id: 5, action: '修改系统设置', time: '2026-03-25 11:00:00', type: 'setting' },
  ];

  const permissions = [
    { name: '车辆管理', key: 'vehicle' },
    { name: '终端管理', key: 'terminal' },
    { name: '告警管理', key: 'alarm' },
    { name: '系统设置', key: 'settings' },
    { name: '用户管理', key: 'user' },
    { name: '报表查看', key: 'report' },
  ];

  return (
    <div className="profile-page">
      <PageHeader title="个人中心" subtitle="查看和管理个人信息" />

      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                {user.name}
              </Title>
              <Tag color="blue">{user.role}</Tag>
              <Divider />
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" icon={<EditOutlined />} block>
                  编辑资料
                </Button>
                <Button icon={<SafetyCertificateOutlined />} block>
                  修改密码
                </Button>
              </Space>
            </div>
          </Card>

          <Card title="权限信息" style={{ marginTop: 16 }}>
            <List
              dataSource={permissions}
              renderItem={(item) => (
                <List.Item>
                  <Tag color="green">{item.name}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={16}>
          <Card title="基本信息">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="用户名">{user.name}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
              <Descriptions.Item label="角色">{user.role}</Descriptions.Item>
              <Descriptions.Item label="部门">{user.department}</Descriptions.Item>
              <Descriptions.Item label="手机号">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="账号创建时间">{user.createTime}</Descriptions.Item>
              <Descriptions.Item label="最后登录" span={2}>
                {user.lastLoginTime}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="最近活动" style={{ marginTop: 16 }}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        dot 
                        color={
                          item.type === 'login' ? 'green' :
                          item.type === 'alarm' ? 'red' :
                          item.type === 'setting' ? 'blue' : 'gray'
                        }
                      >
                        <Avatar icon={<HistoryOutlined />} />
                      </Badge>
                    }
                    title={item.action}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">本月处理告警</Text>
                  <Title level={2} style={{ margin: '10px 0' }}>128</Title>
                  <Progress percent={75} size="small" />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">在线车辆监控</Text>
                  <Title level={2} style={{ margin: '10px 0' }}>56</Title>
                  <Progress percent={90} size="small" strokeColor="#52c41a" />
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;