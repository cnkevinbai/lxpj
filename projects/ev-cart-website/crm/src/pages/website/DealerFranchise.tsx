import React from 'react'
import { Card, Row, Col, Button, Space, Timeline, Input, Form, message, Statistic, Collapse, Tag } from 'antd'
import {
  RiseOutlined,
  TeamOutlined,
  GiftOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  SendOutlined,
} from '@ant-design/icons'

const { Panel } = Collapse

const DealerFranchise: React.FC = () => {
  const onFinish = (values: any) => {
    message.success('加盟申请提交成功！我们的招商经理将在 24 小时内联系您！')
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
          <a href="/dealer" style={{ color: '#faad14', fontWeight: 600 }}>经销商加盟</a>
          <a href="/service" style={{ color: '#666' }}>服务支持</a>
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
        height: 400,
        background: 'linear-gradient(135deg, #faad14 0%, #ff8c00 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
      }}>
        <div>
          <h1 style={{ fontSize: 56, fontWeight: 700, marginBottom: 16 }}>经销商加盟</h1>
          <p style={{ fontSize: 20, opacity: 0.9 }}>携手道达，共赢新能源汽车智能换电蓝海市场</p>
          <p style={{ fontSize: 16, opacity: 0.8, marginTop: 8 }}>全国已有 200+ 服务网点，期待您的加入！</p>
        </div>
      </div>

      {/* 加盟优势 */}
      <div style={{ padding: '80px 80px', background: 'white' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 60, fontWeight: 700 }}>
          为什么选择道达智能
        </h2>
        <Row gutter={32}>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>产品优势</h3>
              <ul style={{ textAlign: 'left', color: '#666', lineHeight: 2.5, paddingLeft: 20 }}>
                <li>自主研发，50+ 项专利</li>
                <li>第三代智能换电技术</li>
                <li>AI 智能识别，安全可靠</li>
                <li>性价比高，竞争力强</li>
              </ul>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📈</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>市场优势</h3>
              <ul style={{ textAlign: 'left', color: '#666', lineHeight: 2.5, paddingLeft: 20 }}>
                <li>新能源汽车市场爆发</li>
                <li>换电模式政策支持</li>
                <li>品牌知名度高</li>
                <li>区域保护政策</li>
              </ul>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎓</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>培训支持</h3>
              <ul style={{ textAlign: 'left', color: '#666', lineHeight: 2.5, paddingLeft: 20 }}>
                <li>总部统一培训</li>
                <li>产品知识培训</li>
                <li>销售技巧培训</li>
                <li>技术维护培训</li>
              </ul>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🛠️</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>售后支持</h3>
              <ul style={{ textAlign: 'left', color: '#666', lineHeight: 2.5, paddingLeft: 20 }}>
                <li>7×24 小时技术支持</li>
                <li>原厂配件供应</li>
                <li>快速响应服务</li>
                <li>终身维护保障</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 数据统计 */}
      <div style={{ padding: '80px 80px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 60, fontWeight: 700, color: 'white' }}>
          加盟道达，共享成功
        </h2>
        <Row gutter={32}>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none' }}>
              <Statistic
                title="服务城市"
                value={20}
                suffix="+"
                valueStyle={{ fontSize: 48, fontWeight: 700, color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none' }}>
              <Statistic
                title="服务网点"
                value={200}
                suffix="+"
                valueStyle={{ fontSize: 48, fontWeight: 700, color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none' }}>
              <Statistic
                title="服务企业"
                value={500}
                suffix="+"
                valueStyle={{ fontSize: 48, fontWeight: 700, color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ textAlign: 'center', border: 'none' }}>
              <Statistic
                title="经销商满意度"
                value={96}
                suffix="%"
                valueStyle={{ fontSize: 48, fontWeight: 700, color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 加盟政策 */}
      <div style={{ padding: '80px 80px', background: 'white' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 60, fontWeight: 700 }}>
          加盟政策
        </h2>
        <Row gutter={64}>
          <Col span={12}>
            <Card title="📋 加盟条件" size="small">
              <ul style={{ lineHeight: 2.5, color: '#666' }}>
                <li>认同道达智能品牌理念</li>
                <li>具备一定的资金实力 (50 万起)</li>
                <li>有相关行业经验者优先</li>
                <li>有良好的商业信誉</li>
                <li>愿意接受总部统一管理</li>
                <li>有固定经营场所</li>
              </ul>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="💰 投资预算" size="small">
              <ul style={{ lineHeight: 2.5, color: '#666' }}>
                <li>加盟费：¥50,000 (品牌使用费)</li>
                <li>保证金：¥30,000 (合同期满退还)</li>
                <li>首批进货：¥200,000 起</li>
                <li>装修费用：¥50,000-100,000</li>
                <li>流动资金：¥100,000</li>
                <li style={{ fontWeight: 600, color: '#faad14' }}>合计：约 50-100 万</li>
              </ul>
            </Card>
          </Col>
        </Row>

        <Row gutter={64} style={{ marginTop: 32 }}>
          <Col span={12}>
            <Card title="📈 收益分析" size="small">
              <ul style={{ lineHeight: 2.5, color: '#666' }}>
                <li>产品销售毛利：30-40%</li>
                <li>服务收入毛利：50-60%</li>
                <li>配件销售毛利：40-50%</li>
                <li>年均销售额：300-500 万</li>
                <li>年净利润：80-150 万</li>
                <li style={{ fontWeight: 600, color: '#52c41a' }}>投资回收期：12-18 个月</li>
              </ul>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="🛡️ 区域保护" size="small">
              <ul style={{ lineHeight: 2.5, color: '#666' }}>
                <li>严格的区域保护政策</li>
                <li>每个区域限定经销商数量</li>
                <li>保护半径：县级 5km，市级 10km</li>
                <li>总部统一分配区域内线索</li>
                <li>禁止跨区销售</li>
                <li style={{ fontWeight: 600, color: '#1890ff' }}>确保经销商利益最大化</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 加盟流程 */}
      <div style={{ padding: '80px 80px', background: '#f5f5f5' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 60, fontWeight: 700 }}>
          加盟流程
        </h2>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Timeline
            mode="alternate"
            items={[
              {
                color: '#1890ff',
                children: (
                  <Card size="small">
                    <h3>1. 咨询了解</h3>
                    <p style={{ color: '#666' }}>通过官网、电话等方式了解加盟政策</p>
                  </Card>
                ),
              },
              {
                color: '#52c41a',
                children: (
                  <Card size="small">
                    <h3>2. 提交申请</h3>
                    <p style={{ color: '#666' }}>填写加盟申请表，提交相关资料</p>
                  </Card>
                ),
              },
              {
                color: '#faad14',
                children: (
                  <Card size="small">
                    <h3>3. 资质审核</h3>
                    <p style={{ color: '#666' }}>总部审核资质，3-5 个工作日反馈</p>
                  </Card>
                ),
              },
              {
                color: '#722ed1',
                children: (
                  <Card size="small">
                    <h3>4. 签约合作</h3>
                    <p style={{ color: '#666' }}>签订经销合同，缴纳相关费用</p>
                  </Card>
                ),
              },
              {
                color: '#eb2f96',
                children: (
                  <Card size="small">
                    <h3>5. 培训学习</h3>
                    <p style={{ color: '#666' }}>参加总部统一培训，考核通过</p>
                  </Card>
                ),
              },
              {
                color: '#13c2c2',
                children: (
                  <Card size="small">
                    <h3>6. 开业运营</h3>
                    <p style={{ color: '#666' }}>总部协助开业，持续运营支持</p>
                  </Card>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* 加盟申请 */}
      <div style={{ padding: '80px 80px', background: 'white' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 60, fontWeight: 700 }}>
          加盟申请
        </h2>
        <Row gutter={64}>
          <Col span={16}>
            <Card title={<><SendOutlined /> 在线申请</>}>
              <Form onFinish={onFinish} layout="vertical">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                    <Input placeholder="请输入您的姓名" />
                  </Form.Item>
                  <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                    <Input placeholder="请输入联系电话" />
                  </Form.Item>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item name="company" label="公司名称">
                    <Input placeholder="请输入公司名称" />
                  </Form.Item>
                  <Form.Item name="city" label="意向城市" rules={[{ required: true, message: '请选择意向城市' }]}>
                    <Input placeholder="请输入意向城市" />
                  </Form.Item>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item name="investment" label="投资能力" rules={[{ required: true, message: '请选择投资能力' }]}>
                    <Input placeholder="如：50-100 万" />
                  </Form.Item>
                  <Form.Item name="experience" label="行业经验">
                    <Input placeholder="如：3 年新能源汽车行业经验" />
                  </Form.Item>
                </div>
                <Form.Item name="message" label="补充说明">
                  <Input.TextArea rows={4} placeholder="请补充其他信息或问题" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" icon={<SendOutlined />} block>
                    提交加盟申请
                  </Button>
                </Form.Item>
                <div style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
                  提交后，我们的招商经理将在 24 小时内联系您
                </div>
              </Form>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="📞 招商热线" size="small" style={{ marginBottom: 16 }}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#faad14', marginBottom: 8 }}>
                  400-888-9999
                </div>
                <div style={{ color: '#666', marginBottom: 16 }}>
                  招商专线（工作日 9:00-18:00）
                </div>
                <div style={{ fontSize: 14, color: '#999' }}>
                  或添加招商经理微信：ddzn_join
                </div>
              </div>
            </Card>

            <Card title="❓ 常见问题" size="small">
              <Collapse>
                <Panel header="加盟费用可以优惠吗？" key="1">
                  <p>根据经销商资质和投资规模，我们提供不同的优惠政策，具体请咨询招商经理。</p>
                </Panel>
                <Panel header="没有行业经验可以加盟吗？" key="2">
                  <p>可以的，我们提供完整的培训体系，包括产品知识、销售技巧、技术维护等，帮助您快速上手。</p>
                </Panel>
                <Panel header="总部提供哪些支持？" key="3">
                  <p>总部提供品牌支持、产品支持、培训支持、营销支持、技术支持、售后支持等全方位支持。</p>
                </Panel>
                <Panel header="多久可以回本？" key="4">
                  <p>根据现有经销商数据，平均投资回收期为 12-18 个月，具体取决于当地市场情况和经营能力。</p>
                </Panel>
              </Collapse>
            </Card>
          </Col>
        </Row>
      </div>

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

export default DealerFranchise
