import React from 'react'
import { Button, Space, Card, Row, Col, Form, Input, message } from 'antd'
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const { TextArea } = Input

const Contact: React.FC = () => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('Contact form:', values)
    message.success('留言提交成功！我们会尽快联系您。')
    form.resetFields()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 导航栏 */}
      <div style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: 24, color: '#1890ff' }}>道达智能</h1>
        <Space size="large">
          <a href="/" style={{ color: '#666' }}>首页</a>
          <a href="/products" style={{ color: '#666' }}>产品中心</a>
          <a href="/about" style={{ color: '#666' }}>关于我们</a>
          <a href="/contact" style={{ color: '#1890ff' }}>联系我们</a>
          <Button type="primary">登录系统</Button>
        </Space>
      </div>

      {/* 内容区域 */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        {/* 返回按钮 */}
        <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 24 }} onClick={() => window.history.back()}>
          返回首页
        </Button>

        <Row gutter={32}>
          {/* 联系信息 */}
          <Col span={12}>
            <Card title="联系方式" style={{ marginBottom: 24 }}>
              <div style={{ padding: '20px 0' }}>
                <div style={{ marginBottom: 24 }}>
                  <MailOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 12 }} />
                  <span style={{ fontSize: 16 }}>support@evcart.com</span>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <PhoneOutlined style={{ fontSize: 24, color: '#52c41a', marginRight: 12 }} />
                  <span style={{ fontSize: 16 }}>400-888-8888</span>
                </div>
                <div>
                  <EnvironmentOutlined style={{ fontSize: 24, color: '#faad14', marginRight: 12 }} />
                  <span style={{ fontSize: 16 }}>深圳市南山区科技园</span>
                </div>
              </div>
            </Card>

            <Card title="工作时间">
              <p style={{ lineHeight: 2, color: '#666' }}>
                周一至周五：9:00 - 18:00<br/>
                周六：10:00 - 17:00<br/>
                周日及法定节假日休息
              </p>
            </Card>
          </Col>

          {/* 联系表单 */}
          <Col span={12}>
            <Card title="在线留言">
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入您的姓名' }]}
                >
                  <Input placeholder="请输入您的姓名" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入您的邮箱' },
                    { type: 'email', message: '请输入正确的邮箱格式' }
                  ]}
                >
                  <Input placeholder="请输入您的邮箱" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="电话"
                >
                  <Input placeholder="请输入您的电话" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="留言内容"
                  rules={[{ required: true, message: '请输入留言内容' }]}
                >
                  <TextArea rows={4} placeholder="请输入您的留言内容" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block size="large">
                    提交留言
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 页脚 */}
      <div style={{ padding: '40px 50px', background: '#333', color: '#fff', textAlign: 'center', marginTop: 40 }}>
        <p>© 2026 四川道达智能车辆制造有限公司。All rights reserved.</p>
        <p>联系方式：400-888-8888 | 邮箱：info@ddzn.com</p>
      </div>
    </div>
  )
}

export default Contact
