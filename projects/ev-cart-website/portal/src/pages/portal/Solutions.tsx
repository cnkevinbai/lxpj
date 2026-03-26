import React from 'react'
import { Card, Row, Col, Tag } from 'antd'
import {
  EnvironmentOutlined,
  HomeOutlined,
  BuildOutlined,
  CarOutlined,
  ShopOutlined,
  CameraOutlined,
} from '@ant-design/icons'

const Solutions: React.FC = () => {
  const solutions = [
    {
      icon: <EnvironmentOutlined />,
      title: '景区解决方案',
      description: '为 5A/4A 景区提供完整的电动观光车解决方案，包括车辆配置、充电站建设、运维培训等。',
      features: ['长续航车型', '快充技术', '智能调度', '运维培训'],
      cases: '已服务 500+ 景区',
      color: 'blue',
    },
    {
      icon: <HomeOutlined />,
      title: '酒店度假村解决方案',
      description: '为高端酒店、度假村提供优雅的接驳服务，提升客户体验。',
      features: ['静音设计', '舒适座椅', '定制外观', 'VIP 服务'],
      cases: '已服务 300+ 酒店',
      color: 'purple',
    },
    {
      icon: <BuildOutlined />,
      title: '房地产解决方案',
      description: '为大型社区、别墅区提供业主接驳车，提升社区品质。',
      features: ['美观大方', '低噪音', '安全可靠', '智能管理'],
      cases: '已服务 200+ 社区',
      color: 'green',
    },
    {
      icon: <CarOutlined />,
      title: '工厂园区解决方案',
      description: '为大型工厂、产业园区提供员工通勤和物料运输车辆。',
      features: ['大容量', '耐用性强', '维护简单', '成本低'],
      cases: '已服务 400+ 工厂',
      color: 'orange',
    },
    {
      icon: <ShopOutlined />,
      title: '商业综合体解决方案',
      description: '为购物中心、商业街区提供顾客接驳和巡逻服务。',
      features: ['时尚外观', '灵活穿梭', '安全可靠', '品牌展示'],
      cases: '已服务 150+ 商圈',
      color: 'red',
    },
    {
      icon: <CameraOutlined />,
      title: '巡逻安保解决方案',
      description: '为各类场所提供电动巡逻车，提升安保效率。',
      features: ['灵活机动', '长续航', '装备齐全', '智能监控'],
      cases: '已服务 600+ 单位',
      color: 'cyan',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="heading-1 mb-4">行业解决方案</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            为不同行业提供专业化的电动观光车解决方案
          </p>
        </div>
      </div>

      {/* 解决方案列表 */}
      <div className="section bg-gray-50">
        <div className="container-custom">
          <Row gutter={[24, 24]}>
            {solutions.map((solution, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  hoverable
                  className="h-full"
                  cover={
                    <div className="h-48 bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 flex items-center justify-center">
                      <div className="text-6xl text-brand-blue">{solution.icon}</div>
                    </div>
                  }
                >
                  <Tag color={solution.color} className="mb-2">
                    {solution.cases}
                  </Tag>
                  <h3 className="text-xl font-semibold mb-3">{solution.title}</h3>
                  <p className="text-gray-600 mb-4">{solution.description}</p>
                  <div className="space-y-2">
                    {solution.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA */}
      <div className="section bg-brand-blue text-white">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4">需要定制化方案？</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            我们的专业团队将根据您的具体需求，提供量身定制的解决方案
          </p>
          <a href="/contact" className="btn bg-white text-brand-blue hover:bg-gray-100">
            联系我们
          </a>
        </div>
      </div>
    </div>
  )
}

export default Solutions
