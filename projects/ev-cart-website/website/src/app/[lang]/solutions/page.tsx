'use client';

import { useState } from 'react';
import Link from 'next/link';

// 解决方案数据
const solutions = [
  {
    id: 1,
    title: '景区接驳解决方案',
    icon: '🏞️',
    color: 'from-green-500 to-green-700',
    description: '为 A 级景区提供完整的电动观光车接驳方案，覆盖入园接驳、景点间转运、VIP 服务等场景',
    features: [
      '多站点智能调度系统',
      '高峰时段运力优化',
      '无障碍车辆配置',
      'GPS 实时定位追踪',
      '低噪音环保设计',
    ],
    applicable: '国家森林公园、5A 级景区、主题公园',
    vehicles: '8-23 座观光车、无障碍车、VIP 豪车',
  },
  {
    id: 2,
    title: '酒店服务解决方案',
    icon: '🏨',
    color: 'from-blue-500 to-blue-700',
    description: '为高端酒店、度假村提供宾客接送、行李转运、园区巡逻等定制化服务车辆',
    features: [
      '高端定制化外观',
      '静音电动驱动',
      '行李专用空间',
      'VIP 专属配置',
      '24 小时响应服务',
    ],
    applicable: '五星级酒店、度假村、康养中心',
    vehicles: '礼宾车、行李车、巡逻车、高尔夫球车',
  },
  {
    id: 3,
    title: '园区通勤解决方案',
    icon: '🏢',
    color: 'from-purple-500 to-purple-700',
    description: '为大型园区、工业园、科技园区提供员工通勤、访客接待、物流配送等综合服务',
    features: [
      '多线路智能规划',
      '高峰期加密班次',
      'APP 实时查询',
      '充电桩配套建设',
      '车队管理系统',
    ],
    applicable: '科技园区、工业园、大学校园、大型社区',
    vehicles: '通勤巴士、接驳车、物流车、巡逻车',
  },
  {
    id: 4,
    title: '城市观光解决方案',
    icon: '🌆',
    color: 'from-orange-500 to-orange-700',
    description: '为城市旅游观光线路提供双层观光巴士、复古电车等特色车辆，打造城市名片',
    features: [
      '开放式观景设计',
      '多语言导览系统',
      '智能票务系统',
      '固定站点接驳',
      '城市文化元素融合',
    ],
    applicable: '旅游城市、历史文化街区、滨江风光带',
    vehicles: '双层观光巴士、复古电车、敞篷车',
  },
  {
    id: 5,
    title: '机场/高铁站解决方案',
    icon: '✈️',
    color: 'from-cyan-500 to-cyan-700',
    description: '为大型交通枢纽提供旅客接驳、VIP 通道、行李转运、场内巡逻等专业服务',
    features: [
      '高频次快速转运',
      '无障碍设施配置',
      '行李专用车辆',
      '24 小时运营',
      '智能调度系统',
    ],
    applicable: '国际机场、高铁站、客运枢纽',
    vehicles: '摆渡车、VIP 专车、行李车、巡逻车',
  },
  {
    id: 6,
    title: '特殊场景定制方案',
    icon: '⚙️',
    color: 'from-red-500 to-red-700',
    description: '针对展会、赛事、活动等临时性场景，提供灵活的车辆租赁和运营服务',
    features: [
      '短期灵活租赁',
      '快速部署能力',
      '专业运营团队',
      '应急预案支持',
      '品牌定制涂装',
    ],
    applicable: '展会、体育赛事、大型活动、影视拍摄',
    vehicles: '各类定制车辆',
  },
];

export default function SolutionsPage() {
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6">解决方案</h1>
          <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
            针对不同行业场景，提供专业化、定制化的电动观光车解决方案
          </p>
        </div>
      </section>

      {/* 解决方案列表 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <div
                key={solution.id}
                onClick={() => setSelectedSolution(selectedSolution === solution.id ? null : solution.id)}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${solution.color} p-8 text-white`}>
                  <div className="text-5xl mb-4">{solution.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{solution.title}</h3>
                  <p className="text-blue-100">{solution.description}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">适用场景</h4>
                    <p className="text-gray-600 text-sm">{solution.applicable}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">推荐车型</h4>
                    <p className="text-gray-600 text-sm">{solution.vehicles}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">
                      {selectedSolution === solution.id ? '收起详情' : '查看详情'}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-blue-600 transition-transform ${selectedSolution === solution.id ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* 展开的详细内容 */}
                {selectedSolution === solution.id && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">核心功能</h4>
                    <ul className="space-y-2">
                      {solution.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-600 text-sm">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className="mt-6 block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      获取定制方案
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 服务流程 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">服务流程</h2>
          <div className="grid md:grid-cols-5 gap-8">
            {[
              { step: '01', title: '需求沟通', desc: '了解客户场景和具体需求' },
              { step: '02', title: '方案设计', desc: '定制专属解决方案' },
              { step: '03', title: '车辆生产', desc: '标准化生产与质检' },
              { step: '04', title: '交付培训', desc: '车辆交付与操作培训' },
              { step: '05', title: '售后支持', desc: '持续技术支持与维护' },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                {index < 4 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-10" />
                )}
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">需要定制化解决方案？</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            我们的专业团队将为您量身打造最适合的观光车解决方案
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            免费咨询
          </Link>
        </div>
      </section>
    </div>
  );
}
