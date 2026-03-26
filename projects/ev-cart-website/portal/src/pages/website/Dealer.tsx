import { Card, Row, Col, Form, Input, Select, Button, Typography, Space, Steps, message, Link } from 'antd'
import { useState } from 'react'
import {
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const Dealer = () => {
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)

  const benefits = [
    {
      icon: <DollarOutlined style={{ fontSize: '48px' }} />,
      color: '#faad14',
      title: '丰厚利润',
      desc: '具有竞争力的价格体系，保证经销商利润空间',
    },
    {
      icon: <RiseOutlined style={{ fontSize: '48px' }} />,
      color: '#52c41a',
      title: '市场支持',
      desc: '全方位市场推广支持，助力业务快速发展',
    },
    {
      icon: <TeamOutlined style={{ fontSize: '48px' }} />,
      color: '#1890ff',
      title: '培训支持',
      desc: '系统化培训体系，提升团队专业能力',
    },
    {
      icon: <GiftOutlined style={{ fontSize: '48px' }} />,
      color: '#722ed1',
      title: '返利政策',
      desc: '阶梯式返利政策，销量越高返利越多',
    },
  ]

  const processSteps = [
    {
      title: '提交申请',
      desc: '在线填写加盟申请表',
      icon: '📝',
    },
    {
      title: '资质审核',
      desc: '1-3 个工作日内完成审核',
      icon: '🔍',
    },
    {
      title: '签约合作',
      desc: '签订正式经销协议',
      icon: '📄',
    },
    {
      title: '培训上岗',
      desc: '参加系统培训和考核',
      icon: '🎓',
    },
    {
      title: '正式运营',
      desc: '开展业务，持续支持',
      icon: '🚀',
    },
  ]

  const handleSubmit = async (values: any) => {
    console.log('申请信息:', values)
    message.success('申请提交成功！我们将在 1-3 个工作日内联系您')
    setCurrentStep(1)
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        color: '#fff',
        textAlign: 'center',
      }}>
        <Title level={1} style={{ color: '#fff', fontSize: '48px', marginBottom: '16px' }}>
          经销商加盟计划
        </Title>
        <Paragraph style={{ fontSize: '20px', maxWidth: '800px', margin: '0 auto', opacity: 0.95 }}>
          携手道达智能，共创美好未来
        </Paragraph>
      </div>

      {/* 加盟优势 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px', fontSize: '36px' }}>
          🏆 加盟优势
        </Title>
        <Row gutter={[48, 48]}>
          {benefits.map((benefit, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  height: '100%',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ color: benefit.color, marginBottom: '20px' }}>
                  {benefit.icon}
                </div>
                <Title level={4} style={{ marginBottom: '12px' }}>
                  {benefit.title}
                </Title>
                <Paragraph style={{ color: '#666' }}>
                  {benefit.desc}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 加盟流程 */}
      <div style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '48px', fontSize: '36px' }}>
            📋 加盟流程
          </Title>
          <Steps
            current={currentStep}
            items={processSteps.map((step, index) => ({
              title: step.title,
              description: step.desc,
              icon: <span style={{ fontSize: '24px' }}>{step.icon}</span>,
            }))}
            style={{ maxWidth: '1000px', margin: '0 auto' }}
            responsive
          />
        </div>
      </div>

      {/* 加盟申请表 */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px' }}>
        <Card
          style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
            📝 加盟申请
          </Title>
          <Paragraph style={{ textAlign: 'center', color: '#666', marginBottom: '48px' }}>
            请填写以下信息，我们将在 1-3 个工作日内与您联系
          </Paragraph>

          {currentStep === 0 ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="公司名称"
                    name="companyName"
                    rules={[{ required: true, message: '请输入公司名称' }]}
                  >
                    <Input placeholder="请输入公司全称" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="统一社会信用代码"
                    name="creditCode"
                    rules={[{ required: true, message: '请输入统一社会信用代码' }]}
                  >
                    <Input placeholder="请输入信用代码" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="联系人"
                    name="contactName"
                    rules={[{ required: true, message: '请输入联系人姓名' }]}
                  >
                    <Input placeholder="请输入联系人姓名" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="联系电话"
                    name="contactPhone"
                    rules={[
                      { required: true, message: '请输入联系电话' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                    ]}
                  >
                    <Input placeholder="请输入手机号" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="电子邮箱"
                    name="email"
                    rules={[
                      { required: true, message: '请输入电子邮箱' },
                      { type: 'email', message: '请输入正确的邮箱地址' },
                    ]}
                  >
                    <Input placeholder="请输入邮箱地址" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="所在地区"
                    name="region"
                    rules={[{ required: true, message: '请选择所在地区' }]}
                  >
                    <Select placeholder="请选择地区">
                      <Option value="huabei">华北地区</Option>
                      <Option value="dongbei">东北地区</Option>
                      <Option value="huadong">华东地区</Option>
                      <Option value="huazhong">华中地区</Option>
                      <Option value="huanan">华南地区</Option>
                      <Option value="xinan">西南地区</Option>
                      <Option value="xibei">西北地区</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="公司简介"
                name="companyDesc"
                rules={[{ required: true, message: '请输入公司简介' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="请简要介绍公司规模、主营业务、团队情况等"
                />
              </Form.Item>

              <Form.Item
                label="预计年销售额"
                name="expectedSales"
                rules={[{ required: true, message: '请选择预计年销售额' }]}
              >
                <Select placeholder="请选择预计年销售额">
                  <Option value="100-500 万">100-500 万</Option>
                  <Option value="500-1000 万">500-1000 万</Option>
                  <Option value="1000-5000 万">1000-5000 万</Option>
                  <Option value="5000 万以上">5000 万以上</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="其他说明"
                name="remark"
              >
                <TextArea
                  rows={3}
                  placeholder="如有其他需要说明的情况，请在此填写"
                />
              </Form.Item>

              <Form.Item style={{ textAlign: 'center', marginTop: '32px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  shape="round"
                  style={{ padding: '0 60px', height: '50px', fontSize: '18px' }}
                >
                  提交申请 <ArrowRightOutlined />
                </Button>
              </Form.Item>

              <Paragraph style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>
                提交即表示您同意我们的《经销商协议》和《隐私政策》
              </Paragraph>
            </Form>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <CheckCircleOutlined style={{ fontSize: '80px', color: '#52c41a', marginBottom: '24px' }} />
              <Title level={3}>申请提交成功！</Title>
              <Paragraph style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto 32px' }}>
                我们已收到您的加盟申请，将在 1-3 个工作日内与您联系。请保持电话畅通。
              </Paragraph>
              <Space size="large">
                <Button size="large" onClick={() => { setCurrentStep(0); form.resetFields() }}>
                  返回重新填写
                </Button>
                <Link to="/contact">
                  <Button type="primary" size="large">
                    联系咨询
                  </Button>
                </Link>
              </Space>
            </div>
          )}
        </Card>
      </div>

      {/* 常见问题 */}
      <div style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
            ❓ 常见问题
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Title level={5}>Q: 加盟需要什么条件？</Title>
            <Paragraph style={{ color: '#666' }}>
              A: 需要具备合法的企业资质，有一定的软件销售或服务经验，有稳定的销售团队和技术支持团队。
            </Paragraph>
          </Card>
          <Card style={{ marginBottom: '24px' }}>
            <Title level={5}>Q: 加盟费用是多少？</Title>
            <Paragraph style={{ color: '#666' }}>
              A: 我们不收取加盟费用，只需要缴纳一定的保证金，合作期满后可退还。具体金额根据代理级别而定。
            </Paragraph>
          </Card>
          <Card>
            <Title level={5}>Q: 提供哪些支持？</Title>
            <Paragraph style={{ color: '#666' }}>
              A: 我们提供产品培训、技术支持、市场推广支持、销售支持等全方位支持，确保经销商能够顺利开展业务。
            </Paragraph>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dealer
