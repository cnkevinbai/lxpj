import React, { useState } from 'react'
import { Card, Button, Space, Form, Input, Select, message, Row, Col } from 'antd'
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'

const { TextArea } = Input
const { Option } = Select

const Contact: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/website/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success('留言提交成功，我们会尽快联系您！')
        form.resetFields()
      } else {
        message.error('提交失败，请稍后重试')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 导航栏 */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        padding: '20px 50px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ margin: 0, fontSize: 20, color: '#fff', fontWeight: 700 }}>四川道达智能</h1>
        <Space size="large">
          <a href="/" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>首页</a>
          <a href="/products" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>产品</a>
          <a href="/solutions" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>解决方案</a>
          <a href="/news" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>新闻</a>
          <a href="/cases" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>案例</a>
          <a href="/about" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>关于</a>
          <a href="/contact" style={{ color: '#1890ff', fontSize: 14, textDecoration: 'none' }}>联系</a>
          <Button type="primary" size="small" onClick={() => window.location.href = '/login'}>登录系统</Button>
        </Space>
      </div>

      {/* Hero 区域 */}
      <div style={{ 
        height: '60vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        marginTop: 64
      }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ fontSize: 64, fontWeight: 700, marginBottom: 24 }}>联系我们</h1>
          <p style={{ fontSize: 24, opacity: 0.8 }}>
            期待与您合作，共创美好未来
          </p>
        </motion.div>
      </div>

      {/* 联系信息 + 留言表单 */}
      <div style={{ padding: '80px 50px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Row gutter={48}>
            {/* 联系信息 */}
            <Col span={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card title="联系方式" style={{ marginBottom: 24 }}>
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                      <MailOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 16 }} />
                      <div>
                        <div style={{ fontSize: 14, color: '#999', marginBottom: 4 }}>邮箱</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>info@ddzn.com</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                      <PhoneOutlined style={{ fontSize: 24, color: '#52c41a', marginRight: 16 }} />
                      <div>
                        <div style={{ fontSize: 14, color: '#999', marginBottom: 4 }}>电话</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>400-888-8888</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <EnvironmentOutlined style={{ fontSize: 24, color: '#faad14', marginRight: 16 }} />
                      <div>
                        <div style={{ fontSize: 14, color: '#999', marginBottom: 4 }}>地址</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>四川省眉山市</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="工作时间">
                  <p style={{ fontSize: 16, lineHeight: 2, color: '#666' }}>
                    周一至周五：9:00 - 18:00<br/>
                    周六：10:00 - 17:00<br/>
                    周日及法定节假日休息
                  </p>
                </Card>
              </motion.div>
            </Col>

            {/* 留言表单 */}
            <Col span={12}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card title="在线留言">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                  >
                    <Form.Item
                      name="name"
                      label="姓名"
                      rules={[{ required: true, message: '请输入您的姓名' }]}
                    >
                      <Input placeholder="请输入您的姓名" />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label="联系电话"
                      rules={[
                        { required: true, message: '请输入您的联系电话' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                      ]}
                    >
                      <Input placeholder="请输入您的联系电话" />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="联系邮箱"
                      rules={[
                        { required: true, message: '请输入您的联系邮箱' },
                        { type: 'email', message: '请输入正确的邮箱格式' }
                      ]}
                    >
                      <Input placeholder="请输入您的联系邮箱" />
                    </Form.Item>

                    <Form.Item
                      name="company"
                      label="公司名称"
                    >
                      <Input placeholder="请输入您的公司名称" />
                    </Form.Item>

                    <Form.Item
                      name="type"
                      label="咨询类型"
                      rules={[{ required: true, message: '请选择咨询类型' }]}
                    >
                      <Select placeholder="请选择咨询类型">
                        <Option value="product">产品咨询</Option>
                        <Option value="solution">解决方案</Option>
                        <Option value="price">价格咨询</Option>
                        <Option value="service">售后服务</Option>
                        <Option value="other">其他</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="message"
                      label="留言内容"
                      rules={[{ required: true, message: '请输入留言内容' }]}
                    >
                      <TextArea rows={4} placeholder="请输入您的留言内容" />
                    </Form.Item>

                    <Form.Item>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        size="large" 
                        loading={loading}
                        block
                      >
                        提交留言
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 页脚 */}
      <div style={{ padding: '80px 50px', background: '#000', color: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 60, marginBottom: 60 }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>产品</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>CRM 系统</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>ERP 系统</p>
              <p style={{ fontSize: 14, color: '#999' }}>财务管理</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>公司</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>关于我们</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>联系方式</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>支持</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>技术支持</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>文档中心</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>联系</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>info@ddzn.com</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>400-888-8888</p>
              <p style={{ fontSize: 14, color: '#999' }}>四川省眉山市</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: 40, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#666' }}>
              © 2026 四川道达智能车辆制造有限公司。All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
