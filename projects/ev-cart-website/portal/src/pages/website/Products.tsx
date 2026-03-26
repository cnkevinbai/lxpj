import { Card, Row, Col, Tag, Button, Typography, Space } from 'antd'
import { Link } from 'react-router-dom'
import {
  AppstoreOutlined,
  TeamOutlined,
  CloudServerOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  MobileOutlined,
  SecurityScanOutlined,
  DashboardOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const Products = () => {
  const products = [
    {
      icon: <TeamOutlined style={{ fontSize: '64px' }} />,
      color: '#1890ff',
      title: 'CRM 客户管理系统',
      subtitle: 'Customer Relationship Management',
      desc: '全面的客户关系管理平台，覆盖销售全流程，助力企业业绩增长',
      modules: ['客户管理', '商机管理', '订单管理', '产品管理', '经销商管理', '信用管理', '交付管理', '合同管理', '活动管理', '跟进管理'],
      features: ['360° 客户视图', '销售漏斗分析', '智能跟进提醒', '移动端支持'],
      link: '/portal/crm',
    },
    {
      icon: <AppstoreOutlined style={{ fontSize: '64px' }} />,
      color: '#52c41a',
      title: 'ERP 企业资源计划',
      subtitle: 'Enterprise Resource Planning',
      desc: '一体化企业资源管理平台，实现生产、采购、库存全流程数字化',
      modules: ['生产管理', '采购管理', '库存管理', '质量管理', '设备管理', '成本管理', '资产管理', '出口管理', 'MRP 运算', '价格管理'],
      features: ['生产计划排程', '智能采购建议', '实时库存监控', '质量追溯'],
      link: '/portal/erp',
    },
    {
      icon: <CloudServerOutlined style={{ fontSize: '64px' }} />,
      color: '#faad14',
      title: '财务管理系统',
      subtitle: 'Financial Management System',
      desc: '专业的财务管理解决方案，实现业财一体化，提升财务效率',
      modules: ['应收管理', '应付管理', '费用报销', '资金管理', '预算管理', '资产管理'],
      features: ['自动凭证生成', '多维度报表', '预算控制', '资金监控'],
      link: '/portal/finance',
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '64px' }} />,
      color: '#722ed1',
      title: '外贸管理系统',
      subtitle: 'Foreign Trade Management',
      desc: '一站式进出口业务管理平台，简化外贸流程，提升运营效率',
      modules: ['出口管理', '进口管理', '报关管理', '单证管理', '外汇管理', '物流跟踪', '客户管理', '报价管理'],
      features: ['单证自动生成', '报关进度跟踪', '外汇风险预警', '物流实时查询'],
      link: '/portal/foreign',
    },
    {
      icon: <CloudServerOutlined style={{ fontSize: '64px' }} />,
      color: '#13c2c2',
      title: '售后服务系统',
      subtitle: 'After-Sales Service System',
      desc: '智能化售后服务平台，提升客户满意度，降低服务成本',
      modules: ['服务工单', '服务进度', '服务评价', '配件管理', '知识库', '服务统计'],
      features: ['智能工单分配', '服务全程跟踪', '配件库存管理', '知识库检索'],
      link: '/portal/aftersales',
    },
    {
      icon: <TeamOutlined style={{ fontSize: '64px' }} />,
      color: '#eb2f96',
      title: '人力资源系统',
      subtitle: 'Human Resource Management',
      desc: '全方位人力资源管理，从招聘到薪酬，打造高效团队',
      modules: ['员工档案', '招聘管理', '考勤管理', '绩效管理', '培训管理', '薪酬管理'],
      features: ['智能招聘流程', '灵活考勤规则', '360° 绩效考核', '薪酬自动计算'],
      link: '/portal/hr',
    },
    {
      icon: <MobileOutlined style={{ fontSize: '64px' }} />,
      color: '#f5222d',
      title: 'CMS 内容管理系统',
      subtitle: 'Content Management System',
      desc: '灵活的内容管理平台，轻松管理企业网站和数字资产',
      modules: ['新闻管理', '案例管理', '视频管理', '页面管理', '栏目管理', '素材管理'],
      features: ['可视化编辑', '多站点管理', 'SEO 优化', '版本控制'],
      link: '/portal/cms',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '64px' }} />,
      color: '#fa8c16',
      title: '消息中心',
      subtitle: 'Message Center',
      desc: '统一消息通知平台，站内信、邮件、短信一站式管理',
      modules: ['站内信', '邮件管理', '短信管理', '模板管理', '发送记录', '订阅管理'],
      features: ['多渠道发送', '智能模板', '发送统计', '订阅管理'],
      link: '/portal/message',
    },
  ]

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
          <AppstoreOutlined /> 产品中心
        </Title>
        <Paragraph style={{ fontSize: '20px', maxWidth: '800px', margin: '0 auto', opacity: 0.95 }}>
          8 大核心产品，50+ 功能模块，满足企业全方位管理需求
        </Paragraph>
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 24px' }}>
        <Row gutter={[48, 48]}>
          {products.map((product, index) => (
            <Col xs={24} md={12} lg={12} key={index}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                }}
                bodyStyle={{ padding: '40px 32px' }}
              >
                <Row gutter={24}>
                  <Col style={{ width: '120px', textAlign: 'center', color: product.color }}>
                    {product.icon}
                  </Col>
                  <Col flex="auto">
                    <Title level={3} style={{ marginBottom: '8px', fontSize: '26px' }}>
                      {product.title}
                    </Title>
                    <Paragraph type="secondary" style={{ fontSize: '14px', marginBottom: '16px', fontStyle: 'italic' }}>
                      {product.subtitle}
                    </Paragraph>
                    <Paragraph style={{ fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
                      {product.desc}
                    </Paragraph>
                    <div style={{ marginBottom: '20px' }}>
                      <Space wrap size={[8, 8]}>
                        {product.modules.slice(0, 6).map((module, i) => (
                          <Tag key={i} color={product.color} style={{ fontSize: '13px' }}>
                            {module}
                          </Tag>
                        ))}
                        {product.modules.length > 6 && (
                          <Tag style={{ fontSize: '13px' }}>
                            +{product.modules.length - 6}
                          </Tag>
                        )}
                      </Space>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                      {product.features.map((feature, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <DashboardOutlined style={{ color: '#52c41a' }} />
                          <span style={{ fontSize: '14px', color: '#666' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link to={product.link}>
                      <Button type="primary" shape="round" icon={<ArrowRightOutlined />}>
                        了解详情
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA */}
      <div style={{
        padding: '80px 0',
        background: '#fff',
        textAlign: 'center',
        borderTop: '1px solid #f0f0f0',
      }}>
        <Title level={2} style={{ marginBottom: '16px' }}>
          需要定制化方案？
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', marginBottom: '32px' }}>
          联系我们，获取专属解决方案
        </Paragraph>
        <Space size="large">
          <Link to="/contact">
            <Button type="primary" size="large" shape="round">
              联系我们
            </Button>
          </Link>
          <Link to="/portal">
            <Button size="large" shape="round">
              免费试用
            </Button>
          </Link>
        </Space>
      </div>
    </div>
  )
}

export default Products
