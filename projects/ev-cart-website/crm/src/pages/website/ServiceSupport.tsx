import React from 'react'
import { Card, Row, Col, Button, Space, Collapse, Timeline, Tag, Statistic, Input, Form, message } from 'antd'
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ToolOutlined,
  BookOutlined,
  CustomerServiceOutlined,
  SearchOutlined,
} from '@ant-design/icons'

const { Panel } = Collapse

const ServiceSupport: React.FC = () => {
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/service/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = await response.json()
      if (result.success) {
        message.success(`工单创建成功！工单号：${result.data.id}`)
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
          <a href="/dealer" style={{ color: '#666' }}>经销商加盟</a>
          <a href="/service" style={{ color: '#1890ff', fontWeight: 600 }}>服务支持</a>
          <a href="/about" style={{ color: '#666' }}>关于我们</a>
          <a href="/contact" style={{ color: '#666' }}>联系我们</a>
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
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>服务支持</h1>
          <p style={{ fontSize: 18, opacity: 0.9 }}>7×24 小时全方位服务，为您的业务保驾护航</p>
        </div>
      </div>

      {/* 服务承诺 */}
      <div style={{ padding: '40px 80px', background: 'white' }}>
        <Row gutter={32}>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛠️</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>快速响应</h3>
              <p style={{ color: '#666' }}>30 分钟内响应，2 小时到场</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⏰</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>7×24 服务</h3>
              <p style={{ color: '#666' }}>全天候服务，随时待命</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>专业团队</h3>
              <p style={{ color: '#666' }}>认证工程师，专业可靠</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>质量保证</h3>
              <p style={{ color: '#666' }}>原厂配件，品质保证</p>
            </Card>
          </Col>
        </Row>
      </div>

      <Row gutter={32} style={{ padding: '40px 80px' }}>
        <Col span={16}>
          {/* 常见问题 */}
          <Card
            title={<><BookOutlined /> 常见问题 FAQ</>}
            style={{ marginBottom: 32 }}
          >
            <Collapse>
              <Panel header="智能换电柜的保修期是多久？" key="1">
                <p>智能换电柜整机保修 2 年，核心部件（电机、控制器）保修 3 年，终身提供维护服务。</p>
              </Panel>
              <Panel header="如何报修？有哪些渠道？" key="2">
                <p>您可以通过以下渠道报修：</p>
                <ul>
                  <li>客服热线：400-888-8888</li>
                  <li>在线客服：官网右下角</li>
                  <li>服务工单：填写下方表单</li>
                  <li>微信服务号：道达智能服务</li>
                </ul>
              </Panel>
              <Panel header="服务响应时间是多久？" key="3">
                <p>我们承诺 30 分钟内响应，根据问题紧急程度：</p>
                <ul>
                  <li>紧急故障（设备停机）：2 小时内到场</li>
                  <li>一般故障（功能异常）：4 小时内到场</li>
                  <li>咨询类问题：24 小时内回复</li>
                </ul>
              </Panel>
              <Panel header="是否提供远程技术支持？" key="4">
                <p>是的，我们提供远程技术支持服务。工程师可以通过电话、视频等方式指导您解决问题，对于无法远程解决的问题，我们会安排工程师上门服务。</p>
              </Panel>
              <Panel header="配件如何购买？" key="5">
                <p>您可以通过以下方式购买原厂配件：</p>
                <ul>
                  <li>联系当地服务网点</li>
                  <li>拨打客服热线订购</li>
                  <li>在线商城购买</li>
                </ul>
                <p>所有配件均提供 1 年质保。</p>
              </Panel>
            </Collapse>
          </Card>

          {/* 服务工单 */}
          <Card title={<><ToolOutlined /> 提交服务工单</>}>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                  <Input placeholder="请输入您的姓名" />
                </Form.Item>
                <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
                <Form.Item name="company" label="公司名称">
                  <Input placeholder="请输入公司名称" />
                </Form.Item>
                <Form.Item name="product" label="产品类型" rules={[{ required: true, message: '请选择产品类型' }]}>
                  <Input placeholder="请选择产品类型" />
                </Form.Item>
              </div>
              <Form.Item name="issue" label="问题描述" rules={[{ required: true, message: '请输入问题描述' }]}>
                <Input.TextArea rows={4} placeholder="请详细描述您遇到的问题" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  提交服务工单
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          {/* 联系方式 */}
          <Card title={<><CustomerServiceOutlined /> 联系方式</>} size="small" style={{ marginBottom: 16 }}>
            <Timeline
              items={[
                {
                  color: '#1890ff',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}><PhoneOutlined /> 客服热线</div>
                      <div style={{ color: '#666' }}>400-888-8888</div>
                      <div style={{ fontSize: 12, color: '#999' }}>7×24 小时服务</div>
                    </div>
                  ),
                },
                {
                  color: '#52c41a',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}><MailOutlined /> 服务邮箱</div>
                      <div style={{ color: '#666' }}>service@evcart.com</div>
                      <div style={{ fontSize: 12, color: '#999' }}>24 小时内回复</div>
                    </div>
                  ),
                },
                {
                  color: '#faad14',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}><EnvironmentOutlined /> 服务网点</div>
                      <div style={{ color: '#666' }}>全国 20+ 城市</div>
                      <div style={{ fontSize: 12, color: '#999' }}>200+ 服务网点</div>
                    </div>
                  ),
                },
              ]}
            />
          </Card>

          {/* 服务流程 */}
          <Card title={<><ClockCircleOutlined /> 服务流程</>} size="small" style={{ marginBottom: 16 }}>
            <Timeline
              items={[
                { color: '#1890ff', children: (<><strong>1. 提交申请</strong><br /><span style={{ fontSize: 12, color: '#666' }}>在线填写服务申请表</span></>) },
                { color: '#52c41a', children: (<><strong>2. 客服受理</strong><br /><span style={{ fontSize: 12, color: '#666' }}>客服确认服务需求</span></>) },
                { color: '#faad14', children: (<><strong>3. 工程师派单</strong><br /><span style={{ fontSize: 12, color: '#666' }}>指派专业工程师</span></>) },
                { color: '#722ed1', children: (<><strong>4. 上门服务</strong><br /><span style={{ fontSize: 12, color: '#666' }}>工程师上门处理</span></>) },
                { color: '#eb2f96', children: (<><strong>5. 完成评价</strong><br /><span style={{ fontSize: 12, color: '#666' }}>服务完成，满意度评价</span></>) },
              ]}
            />
          </Card>

          {/* 服务网点查询 */}
          <Card title={<><EnvironmentOutlined /> 服务网点</>} size="small">
            <Input.Search
              placeholder="输入城市名称查询"
              enterButton={<SearchOutlined />}
              size="large"
              style={{ marginBottom: 16 }}
            />
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: 4 }}>
                <div style={{ fontWeight: 600 }}>北京服务中心</div>
                <div style={{ fontSize: 12, color: '#666' }}>北京市朝阳区 xxx 路 xxx 号</div>
                <div style={{ fontSize: 12, color: '#999' }}>010-88888888</div>
              </div>
              <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: 4 }}>
                <div style={{ fontWeight: 600 }}>上海服务中心</div>
                <div style={{ fontSize: 12, color: '#666' }}>上海市浦东新区 xxx 路 xxx 号</div>
                <div style={{ fontSize: 12, color: '#999' }}>021-88888888</div>
              </div>
              <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: 4 }}>
                <div style={{ fontWeight: 600 }}>广州服务中心</div>
                <div style={{ fontSize: 12, color: '#666' }}>广州市天河区 xxx 路 xxx 号</div>
                <div style={{ fontSize: 12, color: '#999' }}>020-88888888</div>
              </div>
            </Space>
            <Button type="link" block style={{ marginTop: 12 }}>
              查看全部服务网点 →
            </Button>
          </Card>
        </Col>
      </Row>

      {/* 页脚 */}
      <div style={{ background: '#001529', color: 'white', padding: '60px 80px', marginTop: 40 }}>
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

export default ServiceSupport
