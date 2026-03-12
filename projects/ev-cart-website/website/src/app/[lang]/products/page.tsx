'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 产品数据
const products = [
  {
    id: 1,
    name: '23 座电动观光车',
    model: 'EC-23',
    category: '观光车',
    image: '/images/products/ec-23.jpg',
    price: '50000-60000',
    seats: 23,
    range: '120km',
    speed: '30km/h',
    features: ['超长续航', '舒适座椅', '智能仪表盘'],
    description: '适用于景区、酒店、园区等场所的接驳服务',
  },
  {
    id: 2,
    name: '14 座电动观光车',
    model: 'EC-14',
    category: '观光车',
    image: '/images/products/ec-14.jpg',
    price: '40000-50000',
    seats: 14,
    range: '100km',
    speed: '30km/h',
    features: ['灵活便捷', '经济实用', '低噪音'],
    description: '中小型景区的理想选择',
  },
  {
    id: 3,
    name: '8 座电动观光车',
    model: 'EC-08',
    category: '观光车',
    image: '/images/products/ec-08.jpg',
    price: '30000-40000',
    seats: 8,
    range: '80km',
    speed: '25km/h',
    features: ['小巧灵活', '节能环保', '维护简单'],
    description: '适合狭窄道路和小型场所',
  },
  {
    id: 4,
    name: '电动巡逻车',
    model: 'EP-02',
    category: '巡逻车',
    image: '/images/products/ep-02.jpg',
    price: '35000-45000',
    seats: 2,
    range: '100km',
    speed: '35km/h',
    features: ['警灯警报', '强劲动力', '全天候作业'],
    description: '适用于园区、社区、景区巡逻',
  },
  {
    id: 5,
    name: '电动货车',
    model: 'EF-01',
    category: '货车',
    image: '/images/products/ef-01.jpg',
    price: '45000-55000',
    seats: 2,
    range: '120km',
    speed: '40km/h',
    features: ['大载重', '长续航', '低成本'],
    description: '物流配送、货物运输的理想选择',
  },
  {
    id: 6,
    name: '高尔夫球车',
    model: 'EG-04',
    category: '高尔夫球车',
    image: '/images/products/eg-04.jpg',
    price: '25000-35000',
    seats: 4,
    range: '80km',
    speed: '25km/h',
    features: ['时尚外观', '舒适驾乘', '静音设计'],
    description: '高尔夫球场、度假村专用',
  },
];

const categories = ['全部', '观光车', '巡逻车', '货车', '高尔夫球车'];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = selectedCategory === '全部'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6">产品中心</h1>
          <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
            专业生产电动观光车、巡逻车、货车等新能源车辆，15 年行业经验
          </p>
        </div>
      </section>

      {/* 统计卡片 */}
      <section className="py-12 bg-white shadow-sm -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">产品型号</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15 年</div>
              <div className="text-gray-600">生产经验</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10000+</div>
              <div className="text-gray-600">交付车辆</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">客户满意度</div>
            </div>
          </div>
        </div>
      </section>

      {/* 筛选和排序 */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 分类筛选 */}
            <div className="flex flex-wrap gap-4">
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

            {/* 排序 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">默认排序</option>
              <option value="price-asc">价格从低到高</option>
              <option value="price-desc">价格从高到低</option>
              <option value="seats">座位数</option>
            </select>
          </div>
        </div>
      </section>

      {/* 产品列表 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* 产品图片 */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* 产品信息 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* 核心参数 */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{product.seats}座</div>
                      <div className="text-xs text-gray-500">座位数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{product.range}</div>
                      <div className="text-xs text-gray-500">续航里程</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{product.speed}</div>
                      <div className="text-xs text-gray-500">最高时速</div>
                    </div>
                  </div>

                  {/* 产品特点 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* 价格和操作 */}
                  <div className="flex items-center justify-between">
                    <div className="text-orange-600 font-bold text-lg">
                      ¥{product.price}
                    </div>
                    <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                      了解详情
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
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
          <h2 className="text-3xl font-bold mb-4">没有找到合适的产品？</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            我们提供定制化服务，根据您的需求的定制专属车型
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/inquiry"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              立即询价
            </Link>
            <Link
              href="/contact"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors"
            >
              联系我们
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
