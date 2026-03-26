import { Typography, Card, Space, Button, Row, Col, List, Divider } from 'antd'
import { Link } from 'react-router-dom'
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const Solutions = () => {
  const solutions = [
    {
      icon: '🏞️',
      title: '景区出行解决方案',
      desc: '为景区提供完整的游客接驳和出行服务',
      challenges: ['游客分散，接驳效率低', '车辆调度困难', '运营成本高'],
      solution: [
        '智能调度系统，实时优化路线',
        '新能源车辆，零排放环保',
        '长续航设计，全天运营无忧',
        '远程监控，实时掌握车辆状态',
      ],
      benefits: ['接驳效率提升 50%', '运营成本降低 30%', '游客满意度提升 40%'],
      products: ['新能源观光车', '无人驾驶观光车', '景区共享漫游车'],
    },
    {
      icon: '🏭',
      title: '园区通勤解决方案',
      desc: '为工业园区、科技园区提供员工通勤服务',
      challenges: ['员工通勤不便', '停车资源紧张', '碳排放压力大'],
      solution: [
        '定制化通勤路线规划',
        '多座位观光车，高效运输',
        '新能源驱动，绿色环保',
        '智能预约系统，灵活调度',
      ],
      benefits: ['通勤时间缩短 40%', '停车位需求减少 60%', '碳排放减少 80%'],
      products: ['新能源观光车', '电动巡逻车'],
    },
    {
      icon: '🏌️',
      title: '高尔夫球场解决方案',
      desc: '为高尔夫球场提供专业化的球车服务',
      challenges: ['球场地形复杂', '球具运输不便', '高端客户要求高'],
      solution: [
        '专业高尔夫球车设计',
        '大容量球具存储空间',
        '静音电机，不打扰球员',
        '豪华座椅，舒适体验',
      ],
      benefits: ['球员体验提升', '球场运营效率提高', '维护成本降低'],
      products: ['高尔夫球车'],
    },
    {
      icon: '🏨',
      title: '酒店度假村解决方案',
      desc: '为高端酒店和度假村提供宾客接送服务',
      challenges: ['宾客期望高', '服务标准要求高', '形象展示需求'],
      solution: [
        '豪华车型，提升形象',
        '静音行驶，舒适体验',
        '定制化外观，匹配酒店风格',
        '专业司机培训',
      ],
      benefits: ['宾客满意度提升', '酒店形象提升', '服务差异化'],
      products: ['新能源观光车', '高尔夫球车'],
    },
    {
      icon: '🚓',
      title: '安保巡逻解决方案',
      desc: '为园区、社区提供专业安保巡逻服务',
      challenges: ['巡逻范围大', '响应速度要求高', '夜间巡逻需求'],
      solution: [
        '专业巡逻车设计',
        '全景视野，无死角',
        '静音电机，隐蔽巡逻',
        '警灯警报系统',
      ],
      benefits: ['巡逻效率提升 60%', '响应时间缩短 50%', '安全系数提升'],
      products: ['电动巡逻车'],
    },
    {
      icon: '🌆',
      title: '智慧城市解决方案',
      desc: '为城市提供智能化出行和管理服务',
      challenges: ['交通拥堵', '环境污染', '管理效率低'],
      solution: [
        '智能网联系统',
        '5G 远程监控',
        '大数据分析优化',
        '共享出行模式',
      ],
      benefits: ['交通效率提升', '环境污染减少', '城市管理智能化'],
      products: ['无人驾驶观光车', '景区共享漫游车'],
    },
  ]

  return (
    <div className="solutions-page">
      {/* Hero */}
      <section className="solutions-hero">
        <div className="container">
          <Title level={1} className="hero-title">解决方案</Title>
          <Paragraph className="hero-subtitle">
            深耕行业多年，为不同场景提供专业化、定制化的出行解决方案
          </Paragraph>
        </div>
      </section>

      {/* 解决方案列表 */}
      <section className="solutions-list">
        <div className="container">
          {solutions.map((solution, index) => (
            <Card key={index} className="solution-card">
              <Row gutter={48}>
                <Col xs={24} md={4} className="solution-icon-col">
                  <div className="solution-icon">{solution.icon}</div>
                </Col>
                <Col xs={24} md={20}>
                  <Title level={2} className="solution-title">{solution.title}</Title>
                  <Paragraph className="solution-desc">{solution.desc}</Paragraph>
                  
                  <Row gutter={32}>
                    <Col xs={24} md={8}>
                      <Title level={5} style={{ color: '#FF4D4F', marginBottom: 16 }}>
                        🔴 面临挑战
                      </Title>
                      <List
                        size="small"
                        dataSource={solution.challenges}
                        renderItem={(item) => (
                          <List.Item style={{ padding: '8px 0', fontSize: 14, color: '#666' }}>
                            • {item}
                          </List.Item>
                        )}
                      />
                    </Col>
                    <Col xs={24} md={8}>
                      <Title level={5} style={{ color: '#52C41A', marginBottom: 16 }}>
                        🟢 解决方案
                      </Title>
                      <List
                        size="small"
                        dataSource={solution.solution}
                        renderItem={(item) => (
                          <List.Item style={{ padding: '8px 0', fontSize: 14, color: '#666' }}>
                            <CheckCircleOutlined style={{ color: '#52C41A', marginRight: 8 }} />
                            {item}
                          </List.Item>
                        )}
                      />
                    </Col>
                    <Col xs={24} md={8}>
                      <Title level={5} style={{ color: '#1890FF', marginBottom: 16 }}>
                        💰 客户价值
                      </Title>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        {solution.benefits.map((benefit, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircleOutlined style={{ color: '#1890FF' }} />
                            <span style={{ fontSize: 14, color: '#666' }}>{benefit}</span>
                          </div>
                        ))}
                      </Space>
                    </Col>
                  </Row>

                  <Divider />

                  <div className="solution-footer">
                    <div className="solution-products">
                      <Space>
                        <EnvironmentOutlined />
                        <span>适用产品：</span>
                        {solution.products.map((p, i) => (
                          <span key={i} className="product-tag">{p}</span>
                        ))}
                      </Space>
                    </div>
                    <Link to="/contact">
                      <Button type="primary" shape="round" icon={<ArrowRightOutlined />}>
                        获取详细方案
                      </Button>
                    </Link>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="solutions-cta">
        <div className="container">
          <Title level={2} style={{ color: '#FFFFFF', marginBottom: 16 }}>
            没有找到适合您的方案？
          </Title>
          <Paragraph style={{ color: '#E0E0E0', fontSize: 18, marginBottom: 32 }}>
            联系我们，获取定制化解决方案
          </Paragraph>
          <Space size="large">
            <Link to="/contact">
              <Button type="primary" size="large" shape="round">
                立即咨询
              </Button>
            </Link>
            <Link to="/products">
              <Button size="large" shape="round">
                查看产品
              </Button>
            </Link>
          </Space>
        </div>
      </section>

      <style>{`
        .solutions-page { background: #F8F9FA; min-height: 100vh; }
        
        .solutions-hero {
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
        
        .solutions-list { padding: 80px 0; }
        .solution-card {
          margin-bottom: 48px;
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .solution-icon-col {
          text-align: center;
          padding: 40px 24px;
        }
        .solution-icon {
          font-size: 100px;
        }
        .solution-title {
          font-size: 32px !important;
          margin-bottom: 16px !important;
        }
        .solution-desc {
          font-size: 16px;
          color: #666;
          margin-bottom: 32px !important;
        }
        .solution-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
        }
        .solution-products {
          font-size: 14px;
          color: '#666';
        }
        .product-tag {
          display: inline-block;
          padding: 4px 12px;
          background: #E6F0FF;
          color: #0066FF;
          border-radius: 4px;
          margin-right: 8px;
        }
        
        .solutions-cta {
          padding: 80px 0;
          background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%);
          text-align: center;
        }
        
        .container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
        
        @media (max-width: 1024px) {
          .solution-icon { font-size: 80px; }
          .solution-footer { flex-direction: column; gap: 16px; }
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 36px !important; }
          .solution-title { font-size: 24px !important; }
        }
      `}</style>
    </div>
  )
}

export default Solutions
