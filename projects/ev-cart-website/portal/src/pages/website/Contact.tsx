import { Typography, Card, Row, Col, Form, Input, Button, Space } from 'antd'
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { Title, Paragraph } = Typography
const { TextArea } = Input

const Contact = () => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('联系表单:', values)
    alert('提交成功！我们将尽快与您联系')
    form.resetFields()
  }

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <Title level={1} className="hero-title">联系我们</Title>
          <Paragraph className="hero-subtitle">
            有任何问题或需求，欢迎随时联系我们
          </Paragraph>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="contact-info">
        <div className="container">
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="contact-card">
                <PhoneOutlined style={{ fontSize: 32, color: '#0066FF', marginBottom: 16 }} />
                <Title level={4}>联系电话</Title>
                <Paragraph style={{ fontSize: 18, fontWeight: 'bold' }}>400-888-8888</Paragraph>
                <Paragraph type="secondary">周一至周五 9:00-18:00</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="contact-card">
                <MailOutlined style={{ fontSize: 32, color: '#52C41A', marginBottom: 16 }} />
                <Title level={4}>电子邮箱</Title>
                <Paragraph style={{ fontSize: 18, fontWeight: 'bold' }}>contact@daoda.com</Paragraph>
                <Paragraph type="secondary">工作日 24 小时内回复</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="contact-card">
                <EnvironmentOutlined style={{ fontSize: 32, color: '#FAAD14', marginBottom: 16 }} />
                <Title level={4}>公司地址</Title>
                <Paragraph style={{ fontSize: 18, fontWeight: 'bold' }}>四川省眉山市高新区</Paragraph>
                <Paragraph type="secondary">欢迎来访，请提前预约</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="contact-card">
                <Title level={4}>工作时间</Title>
                <Paragraph style={{ fontSize: 18, fontWeight: 'bold' }}>周一至周五</Paragraph>
                <Paragraph type="secondary">9:00-18:00</Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 联系表单 */}
      <section className="contact-form-section">
        <div className="container">
          <Row gutter={48}>
            <Col xs={24} md={12}>
              <Title level={2}>在线留言</Title>
              <Paragraph>请填写以下信息，我们将尽快与您联系</Paragraph>
              <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                <Form.Item label="您的姓名" name="name" rules={[{ required: true, message: '请输入您的姓名' }]}>
                  <Input placeholder="请输入姓名" />
                </Form.Item>
                <Form.Item label="联系电话" name="phone" rules={[{ required: true, message: '请输入联系电话' }]}>
                  <Input placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item label="电子邮箱" name="email" rules={[{ type: 'email', message: '请输入正确的邮箱' }]}>
                  <Input placeholder="请输入邮箱（选填）" />
                </Form.Item>
                <Form.Item label="留言内容" name="message" rules={[{ required: true, message: '请输入留言内容' }]}>
                  <TextArea rows={4} placeholder="请详细描述您的需求或问题" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block>
                    提交留言
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={12}>
              <div className="map-placeholder">
                <div style={{ fontSize: 100 }}>🗺️</div>
                <Title level={4}>四川省眉山市高新区</Title>
                <Paragraph>欢迎来访，请提前电话预约</Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <style>{`
        .contact-page { background: #F8F9FA; min-height: 100vh; }
        
        .contact-hero {
          padding: 120px 0 80px;
          background: linear-gradient(135deg, #050505 0%, #0A0A0A 100%);
          text-align: center;
        }
        .hero-title {
          color: #FFFFFF !important;
          font-size: 56px !important;
          margin-bottom: 16px !important;
        }
        .hero-subtitle {
          color: #E0E0E0 !important;
          font-size: 20px !important;
          max-width: 800px;
          margin: 0 auto !important;
        }
        
        .contact-info { padding: 80px 0; }
        .contact-card {
          text-align: center;
          border: none;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }
        .contact-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        
        .contact-form-section { padding: 80px 0; background: #FFFFFF; }
        .map-placeholder {
          height: 100%;
          min-height: 400px;
          background: #F0F2F5;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
        }
        
        .container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
        
        @media (max-width: 768px) {
          .hero-title { font-size: 32px !important; }
        }
      `}</style>
    </div>
  )
}

export default Contact
