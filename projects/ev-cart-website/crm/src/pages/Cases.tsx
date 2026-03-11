import React, { useState } from 'react'
import { Card, Row, Col, Tag, Tabs } from 'antd'

const { TabPane } = Tabs

const Cases: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')

  const cases = [
    {
      id: 1,
      title: '九寨沟景区电动观光车项目',
      customer: '九寨沟风景名胜区管理局',
      industry: '景区',
      location: '四川·阿坝',
      vehicles: 50,
      model: 'EC-23',
      image: '/images/case-1.jpg',
      description: '为九寨沟景区提供 50 台 EC-23 电动巴士，解决游客接驳问题，实现景区绿色出行。',
      challenges: ['高海拔环境', '大客流量', '复杂路况'],
      solutions: ['高续航车型', '智能调度系统', '快速充电'],
      results: '运营效率提升 40%，游客满意度提升 25%',
    },
    {
      id: 2,
      title: '三亚亚特兰蒂斯酒店接驳车项目',
      customer: '三亚亚特兰蒂斯酒店',
      industry: '酒店',
      location: '海南·三亚',
      vehicles: 20,
      model: 'EC-14',
      image: '/images/case-2.jpg',
      description: '为亚特兰蒂斯酒店提供 20 台 EC-14 电动观光车，用于住客接驳服务。',
      challenges: ['高端形象要求', '静音要求', '全天候运营'],
      solutions: ['定制外观', '静音设计', '备用车辆'],
      results: '客户满意度 98%，零投诉',
    },
    {
      id: 3,
      title: '万科社区业主接驳车项目',
      customer: '万科地产',
      industry: '房地产',
      location: '江苏·苏州',
      vehicles: 15,
      model: 'EC-11',
      image: '/images/case-3.jpg',
      description: '为万科大型社区提供 15 台 EC-11 电动观光车，服务业主出行。',
      challenges: ['社区道路窄', '人车混行', '噪音控制'],
      solutions: ['小型车型', '限速设计', '低噪音'],
      results: '业主满意度 95%，零事故',
    },
    {
      id: 4,
      title: '富士康园区巡逻车项目',
      customer: '富士康科技集团',
      industry: '工厂',
      location: '广东·深圳',
      vehicles: 100,
      model: 'EP-2',
      image: '/images/case-4.jpg',
      description: '为富士康园区提供 100 台 EP-2 电动巡逻车，用于园区安保巡逻。',
      challenges: ['大面积园区', '多班次运营', '装备需求'],
      solutions: ['长续航设计', '快速换电', '装备集成'],
      results: '巡逻效率提升 60%，响应时间缩短 50%',
    },
  ]

  const industries = [
    { key: 'all', label: '全部', count: cases.length },
    { key: '景区', label: '景区', count: cases.filter(c => c.industry === '景区').length },
    { key: '酒店', label: '酒店', count: cases.filter(c => c.industry === '酒店').length },
    { key: '房地产', label: '房地产', count: cases.filter(c => c.industry === '房地产').length },
    { key: '工厂', label: '工厂', count: cases.filter(c => c.industry === '工厂').length },
  ]

  const filteredCases = activeTab === 'all'
    ? cases
    : cases.filter(c => c.industry === activeTab)

  return (
    <div>
      {/* Hero */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="heading-1 mb-4">客户案例</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            服务超过 50000 家客户，遍布全球 50 多个国家
          </p>
        </div>
      </div>

      {/* 统计 */}
      <div className="section bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-blue mb-2">50000+</div>
              <div className="text-gray-600">服务客户</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-blue mb-2">50+</div>
              <div className="text-gray-600">覆盖国家</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-blue mb-2">15+</div>
              <div className="text-gray-600">年行业经验</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-blue mb-2">98%</div>
              <div className="text-gray-600">客户满意度</div>
            </div>
          </div>
        </div>
      </div>

      {/* 案例列表 */}
      <div className="section">
        <div className="container-custom">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="mb-8"
          >
            {industries.map(industry => (
              <TabPane tab={`${industry.label} (${industry.count})`} key={industry.key} />
            ))}
          </Tabs>

          <Row gutter={[24, 24]}>
            {filteredCases.map(caseItem => (
              <Col xs={24} lg={12} key={caseItem.id}>
                <Card
                  hoverable
                  cover={
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">案例图片</span>
                    </div>
                  }
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Tag color="blue">{caseItem.industry}</Tag>
                      <Tag color="green">{caseItem.location}</Tag>
                    </div>
                    <div className="text-sm text-gray-500">
                      {caseItem.vehicles}台 {caseItem.model}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{caseItem.title}</h3>
                  <p className="text-gray-600 mb-4">{caseItem.description}</p>
                  <div className="text-sm text-gray-500 mb-2">客户：{caseItem.customer}</div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">挑战：</span>
                      {caseItem.challenges.join('、')}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">方案：</span>
                      {caseItem.solutions.join('、')}
                    </div>
                    <div className="text-sm text-brand-blue font-medium">
                      成果：{caseItem.results}
                    </div>
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
          <h2 className="heading-2 mb-4">成为我们的下一个成功案例</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            无论您的场景多么特殊，我们都能提供专业的解决方案
          </p>
          <a href="/contact" className="btn bg-white text-brand-blue hover:bg-gray-100">
            联系我们
          </a>
        </div>
      </div>
    </div>
  )
}

export default Cases
