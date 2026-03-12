'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 案例数据
const cases = [
  {
    id: 1,
    title: '张家界国家森林公园观光车项目',
    category: '景区',
    image: '/images/cases/zhangjiajie.jpg',
    description: '部署 50 辆电动观光车，覆盖主要景点接驳路线，日均服务游客 10000+ 人次',
    location: '湖南 · 张家界',
    vehicles: 50,
    year: 2025,
  },
  {
    id: 2,
    title: '三亚亚特兰蒂斯酒店接驳车',
    category: '酒店',
    image: '/images/cases/sanya-hotel.jpg',
    description: '高端定制观光车，提供 VIP 宾客接送服务，提升酒店服务品质',
    location: '海南 · 三亚',
    vehicles: 20,
    year: 2025,
  },
  {
    id: 3,
    title: '上海迪士尼乐园园区通勤车',
    category: '园区',
    image: '/images/cases/shanghai-disney.jpg',
    description: '定制化涂装观光车，与园区主题完美融合，服务员工日常通勤',
    location: '上海',
    vehicles: 80,
    year: 2024,
  },
  {
    id: 4,
    title: '杭州西湖景区城市观光线',
    category: '城市观光',
    image: '/images/cases/hangzhou-westlake.jpg',
    description: '环湖观光线路，12 个站点覆盖主要景点，年接待游客 500 万+',
    location: '浙江 · 杭州',
    vehicles: 100,
    year: 2024,
  },
  {
    id: 5,
    title: '广州长隆旅游度假区',
    category: '景区',
    image: '/images/cases/guangzhou-chimelong.jpg',
    description: '多园区接驳方案，包含野生动物园、欢乐世界等多个主题园区',
    location: '广东 · 广州',
    vehicles: 60,
    year: 2025,
  },
  {
    id: 6,
    title: '北京环球影城配套服务车',
    category: '园区',
    image: '/images/cases/beijing-universal.jpg',
    description: '国际化标准观光车，满足主题公园高标准服务需求',
    location: '北京',
    vehicles: 70,
    year: 2024,
  },
];

const categories = ['全部', '景区', '酒店', '园区', '城市观光'];

export default function CasesPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filteredCases = selectedCategory === '全部' 
    ? cases 
    : cases.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6">客户案例</h1>
          <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
            服务全球 500+ 知名景区、酒店、园区，打造绿色出行解决方案
          </p>
        </div>
      </section>

      {/* 案例统计 */}
      <section className="py-12 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">合作客户</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10000+</div>
              <div className="text-gray-600">运营车辆</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">覆盖城市</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">客户满意度</div>
            </div>
          </div>
        </div>
      </section>

      {/* 分类筛选 */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 案例列表 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCases.map((caseItem) => (
              <Link 
                key={caseItem.id} 
                href={`/cases/${caseItem.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {/* 占位图，实际使用时替换为真实图片 */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {caseItem.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {caseItem.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {caseItem.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {caseItem.location}
                    </span>
                    <span>{caseItem.year}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        部署车辆：<strong className="text-blue-600">{caseItem.vehicles}辆</strong>
                      </span>
                      <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                        查看详情
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">想了解我们的解决方案？</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            立即联系我们，获取专属定制方案和报价
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            联系我们
          </Link>
        </div>
      </section>
    </div>
  );
}
