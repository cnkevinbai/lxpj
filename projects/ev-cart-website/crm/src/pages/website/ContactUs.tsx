import React from 'react'
import { Card, Row, Col, Button, Space, Input, Form, message, Map } from 'antd'
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons'

const ContactUs: React.FC = () => {
  const onFinish = async (values: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          type: '商务合作',
          source: '官网',
        }),
      })
      const result = await response.json()
      if (result.success) {
        message.success('合作意向提交成功！我们的招商经理将在 24 小时内联系您！')
        form.resetFields()
      }
    } catch (error) {
      message.error('提交失败，请稍后重试')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 顶部导航 */}
      <div style={{
        height: 64,
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 80px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1890ff' }}>⚡ EV CART</div>
        <Space size={40}>
          <a href="/website" style={{ color: '#666' }}>首页</a>
          <a href="/products" style={{ color: '#666' }}>产品中心</a>
          <a href="/solutions" style={{ color: '#666' }}>解决方案</a>
          <a href="/service" style={{ color: '#666' }}>服务支持</a>
          <a href="/about" style={{ color: '#666' }}>关于我们</a>
          <a href="/contact" style={{ color: '#1890ff', fontWeight: 600 }}>联系我们</a>
        </Space>
        <Space>
          <Button ghost>登录</Button>
          <Button type="primary">联系咨询</Button>
        </Space>
      </div>

      {/* 页面标题 */}
      <div style={{
        height: 300,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
      }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>联系我们</h1>
          <p style={{ fontSize: 18, opacity: 0.9 }}>期待与您合作，共创美好未来</p>
        </div>
      </div>

      <Row gutter={32} style={{ padding: '40px 80px' }}>
        <Col span={12}>
          {/* 联系方式 */}
          <Card title={<><EnvironmentOutlined /> 联系方式</>} size="small" style={{ marginBottom: 32 }}>
            <Space direction="vertical" style={{ width: '100%' }} size={24}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: '#1890ff22',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: '#1890ff',
                  flexShrink: 0,
                }}>
                  <PhoneOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>客服热线</div>
                  <div style={{ fontSize: 18, color: '#1890ff', fontWeight: 700 }}>400-888-8888</div>
                  <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>7×24 小时服务</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: '#52c41a22',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: '#52c41a',
                  flexShrink: 0,
                }}>
                  <MailOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>商务合作</div>
                  <div style={{ fontSize: 16, color: '#666' }}>business@evcart.com</div>
                  <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>24 小时内回复</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: '#faad1422',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: '#faad14',
                  flexShrink: 0,
                }}>
                  <EnvironmentOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>公司总部</div>
                  <div style={{ fontSize: 16, color: '#666' }}>四川省眉山市 xxx 区 xxx 路 xxx 号</div>
                  <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>道达智能大厦</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: '#722ed122',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: '#722ed1',
                  flexShrink: 0,
                }}>
                  <ClockCircleOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>工作时间</div>
                  <div style={{ fontSize: 16, color: '#666' }}>周一至周五：9:00 - 18:00</div>
                  <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>客服热线 7×24 小时在线</div>
                </div>
              </div>
            </Space>
          </Card>

          {/* 商务合作表单 */}
          <Card title={<><UserOutlined /> 商务合作</>}>
            <Form onFinish={onFinish} layout="vertical">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                  <Input placeholder="请输入您的姓名" />
                </Form.Item>
                <Form.Item name="company" label="公司名称">
                  <Input placeholder="请输入公司名称" />
                </Form.Item>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
                <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '请输入有效的邮箱' }]}>
                  <Input placeholder="请输入邮箱地址" />
                </Form.Item>
              </div>
              <Form.Item name="type" label="合作类型" rules={[{ required: true, message: '请选择合作类型' }]}>
                <Input placeholder="如：产品采购、渠道合作、技术支持等" />
              </Form.Item>
              <Form.Item name="message" label="合作意向" rules={[{ required: true, message: '请输入合作意向' }]}>
                <Input.TextArea rows={4} placeholder="请描述您的合作需求" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" icon={<SendOutlined />} block>
                  发送合作意向
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          {/* 服务网点 */}
          <Card title={<><TeamOutlined /> 全国服务网点</>} size="small" style={{ marginBottom: 32 }}>
            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                {[
                  { city: '北京', address: '北京市朝阳区 xxx 路 xxx 号', phone: '010-88888888' },
                  { city: '上海', address: '上海市浦东新区 xxx 路 xxx 号', phone: '021-88888888' },
                  { city: '广州', address: '广州市天河区 xxx 路 xxx 号', phone: '020-88888888' },
                  { city: '深圳', address: '深圳市南山区 xxx 路 xxx 号', phone: '0755-88888888' },
                  { city: '杭州', address: '杭州市西湖区 xxx 路 xxx 号', phone: '0571-88888888' },
                  { city: '成都', address: '成都市高新区 xxx 路 xxx 号', phone: '028-88888888' },
                  { city: '武汉', address: '武汉市武昌区 xxx 路 xxx 号', phone: '027-88888888' },
                  { city: '西安', address: '西安市雁塔区 xxx 路 xxx 号', phone: '029-88888888' },
                ].map((office, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px',
                      background: '#f5f5f5',
                      borderRadius: 8,
                      marginBottom: index < 7 ? 8 : 0,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{office.city}服务中心</div>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>{office.address}</div>
                    <div style={{ fontSize: 13, color: '#999' }}>{office.phone}</div>
                  </div>
                ))}
              </Space>
              <Button type="link" block style={{ marginTop: 16 }}>
                查看全部 200+ 服务网点 →
              </Button>
            </div>
          </Card>

          {/* 社交媒体 */}
          <Card title="关注我们" size="small">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 150,
                height: 150,
                margin: '0 auto 16px',
                background: '#f5f5f5',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 60,
              }}>
                📱
              </div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>官方微信服务号</div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
                扫码关注，获取最新产品信息和服务支持
              </div>
              <Space size={16}>
                <Button icon="📱">微信</Button>
                <Button icon="🎵">抖音</Button>
                <Button icon="📹">视频号</Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 页脚 */}
      <div style={{ background: '#001529', color: 'white', padding: '60px 80px' }}>
        <Row gutter={80}>
          <Col span={6}>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>关于我们</h4>
            <p style={{ color: '#999', lineHeight: 2 }}>公司简介</p>
            <p style={{ color: '#999', lineHeight: 2 }}>发展历程</p>
            <p style={{ color: '#999', lineHeight: 2 }}>荣誉资质</p>
          </Col>
          <Col span={6}>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>产品中心</h4>
            <p style={{ color: '#999', lineHeight: 2 }}>智能换电柜</p>
            <p style={{ color: '#999', lineHeight: 2 }}>锂电池</p>
            <p style={{ color: '#999', lineHeight: 2 }}>管理系统</p>
          </Col>
          <Col span={6}>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>服务支持</h4>
            <p style={{ color: '#999', lineHeight: 2 }}>售后服务</p>
            <p style={{ color: '#999', lineHeight: 2 }}>技术支持</p>
            <p style={{ color: '#999', lineHeight: 2 }}>常见问题</p>
          </Col>
          <Col span={6}>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>联系我们</h4>
            <p style={{ color: '#999', lineHeight: 2 }}>电话：400-888-8888</p>
            <p style={{ color: '#999', lineHeight: 2 }}>邮箱：contact@evcart.com</p>
            <p style={{ color: '#999', lineHeight: 2 }}>地址：四川省眉山市</p>
          </Col>
        </Row>
        <div style={{ borderTop: '1px solid #333', marginTop: 40, paddingTop: 20, textAlign: 'center', color: '#666' }}>
          © 2026 道达智能 版权所有
        </div>
      </div>
    </div>
  )
}

export default ContactUs
