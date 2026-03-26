import React from 'react'
import { Card, Row, Col, Button, Space, Statistic, Avatar, Badge, Tag, Timeline, Progress } from 'antd'
import {
  MobileOutlined,
  DownloadOutlined,
  QrcodeOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  BellOutlined,
  MessageOutlined,
  UserOutlined,
  HomeOutlined,
  BarChartOutlined,
  SettingOutlined,
  ScanOutlined,
  CameraOutlined,
} from '@ant-design/icons'

const HarmonyOSApp: React.FC = () => {
  const appStats = {
    downloads: 15680,
    activeUsers: 8520,
    rating: 4.8,
    version: '2.5.0',
  }

  const features = [
    { icon: <HomeOutlined />, title: '首页', desc: '业务概览与快捷入口', color: '#1890ff' },
    { icon: <BarChartOutlined />, title: '数据', desc: '实时数据与报表', color: '#52c41a' },
    { icon: <MessageOutlined />, title: '消息', desc: '通知与沟通', color: '#faad14', badge: 8 },
    { icon: <UserOutlined />, title: '我的', desc: '个人设置', color: '#722ed1' },
  ]

  const modules = [
    { name: '客户管理', icon: '👥', users: 328, active: true },
    { name: '销售管理', icon: '💰', users: 156, active: true },
    { name: '服务工单', icon: '🔧', users: 89, active: true },
    { name: '生产监控', icon: '🏭', users: 65, active: true },
    { name: '库存查询', icon: '📦', users: 142, active: true },
    { name: '财务审批', icon: '💳', users: 45, active: true },
    { name: '移动考勤', icon: '📍', users: 280, active: true },
    { name: '任务管理', icon: '✅', users: 198, active: true },
  ]

  const recentTasks = [
    { time: '10:30', event: '完成了服务工单处理', status: 'completed' },
    { time: '10:15', event: '提交了费用报销申请', status: 'pending' },
    { time: '09:50', event: '审批了采购订单', status: 'completed' },
    { time: '09:30', event: '创建了新客户档案', status: 'completed' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #003478 0%, #0056b3 50%, #0078d4 100%)',
      padding: 24,
    }}>
      {/* 顶部导航栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        padding: '16px 24px',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}>
            🌸
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'white', margin: 0 }}>
              道达智能 鸿蒙版
            </h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              HarmonyOS NEXT | 随时随地 高效办公
            </p>
          </div>
        </div>
        <Space size={16} style={{ color: 'white' }}>
          <Badge count={8} size="small">
            <BellOutlined style={{ fontSize: 20 }} />
          </Badge>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
        </Space>
      </div>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 32 }}>
        <Col span={6}>
          <Card
            hoverable
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              borderRadius: 16,
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Statistic
              title="下载量"
              value={appStats.downloads}
              valueStyle={{ fontSize: 24, fontWeight: 700, color: 'white' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              borderRadius: 16,
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Statistic
              title="活跃用户"
              value={appStats.activeUsers}
              valueStyle={{ fontSize: 24, fontWeight: 700, color: 'white' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              borderRadius: 16,
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Statistic
              title="评分"
              value={appStats.rating}
              suffix="分"
              valueStyle={{ fontSize: 24, fontWeight: 700, color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              borderRadius: 16,
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Statistic
              title="版本"
              value={appStats.version}
              valueStyle={{ fontSize: 24, fontWeight: 700, color: 'white' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* 左侧 - 功能模块 */}
        <Col span={16}>
          {/* 底部导航 */}
          <Card
            title="📱 底部导航"
            style={{
              marginBottom: 24,
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 16,
              border: 'none',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              padding: '20px 0',
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              borderRadius: 12,
            }}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {feature.badge && (
                    <Badge
                      count={feature.badge}
                      size="small"
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                      }}
                    />
                  )}
                  <div style={{
                    width: 48,
                    height: 48,
                    margin: '0 auto 8px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: 'white',
                  }}>
                    {feature.icon}
                  </div>
                  <div style={{ fontSize: 12, color: 'white', fontWeight: 500 }}>
                    {feature.title}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 功能模块 */}
          <Card
            title="🚀 功能模块"
            style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 16,
              border: 'none',
            }}
          >
            <Row gutter={[16, 16]}>
              {modules.map((module, index) => (
                <Col span={6} key={index}>
                  <Card
                    hoverable
                    style={{
                      textAlign: 'center',
                      borderRadius: 12,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{module.icon}</div>
                    <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 14 }}>
                      {module.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {module.users}人在用
                    </div>
                    {module.active && (
                      <Tag color="success" style={{ marginTop: 8 }}>
                        运行中
                      </Tag>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 右侧 - 下载和动态 */}
        <Col span={8}>
          {/* 下载卡片 */}
          <Card
            style={{
              marginBottom: 24,
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 16,
              border: 'none',
            }}
          >
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: 120,
                height: 120,
                margin: '0 auto 16px',
                borderRadius: 24,
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                boxShadow: '0 8px 24px rgba(255,107,107,0.4)',
              }}>
                🌸
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                道达智能 鸿蒙版
              </h3>
              <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>
                HarmonyOS NEXT 原生应用
              </p>
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <Button
                  type="primary"
                  size="large"
                  icon={<DownloadOutlined />}
                  block
                  style={{
                    height: 48,
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none',
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  立即下载
                </Button>
                <Button
                  size="large"
                  icon={<QrcodeOutlined />}
                  block
                  style={{
                    height: 48,
                    borderRadius: 24,
                    border: '2px solid #1890ff',
                    color: '#1890ff',
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  扫码下载
                </Button>
              </Space>
            </div>
          </Card>

          {/* 最近动态 */}
          <Card
            title="📝 最近动态"
            style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 16,
              border: 'none',
            }}
          >
            <Timeline
              items={recentTasks.map((item) => ({
                color: item.status === 'completed' ? '#52c41a' : '#faad14',
                children: (
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.event}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{item.time}</div>
                  </div>
                ),
              }))}
            />
          </Card>

          {/* 快捷工具 */}
          <Card
            title="🛠️ 快捷工具"
            style={{
              marginTop: 24,
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 16,
              border: 'none',
            }}
          >
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Button
                  block
                  icon={<ScanOutlined />}
                  style={{
                    height: 40,
                    borderRadius: 8,
                    background: '#1890ff',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  扫一扫
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  icon={<CameraOutlined />}
                  style={{
                    height: 40,
                    borderRadius: 8,
                    background: '#52c41a',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  拍照
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default HarmonyOSApp
