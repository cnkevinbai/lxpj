'use client';

import { useState } from 'react';
import Link from 'next/link';

// 新闻数据
const news = [
  {
    id: 1,
    title: '道达智能荣获 2025 年度新能源汽车行业创新企业奖',
    category: '公司动态',
    date: '2026-03-10',
    excerpt: '在第十三届中国新能源汽车产业峰会上，道达智能凭借在电动观光车领域的技术创新和市场表现，荣获年度创新企业奖。',
    image: '/images/news/award-2025.jpg',
    author: '市场部',
    views: 1280,
  },
  {
    id: 2,
    title: '新款 23 座电动观光车正式上市，续航提升至 180 公里',
    category: '产品发布',
    date: '2026-03-05',
    excerpt: '经过两年研发，公司最新款 23 座电动观光车今日正式发布，搭载新一代电池管理系统，续航里程提升至 180 公里。',
    image: '/images/news/new-product-2026.jpg',
    author: '产品部',
    views: 2560,
  },
  {
    id: 3,
    title: '张家界国家森林公园项目圆满交付，50 辆观光车投入运营',
    category: '项目动态',
    date: '2026-02-28',
    excerpt: '历时 3 个月，张家界国家森林公园 50 辆电动观光车项目顺利完成交付，预计年服务游客超过 300 万人次。',
    image: '/images/news/zhangjiajie-delivery.jpg',
    author: '项目部',
    views: 1890,
  },
  {
    id: 4,
    title: '电动观光车行业白皮书发布，2025 年市场规模突破 200 亿',
    category: '行业资讯',
    date: '2026-02-20',
    excerpt: '中国旅游车船协会发布《2025 中国电动观光车行业发展白皮书》，显示行业年增长率超过 35%。',
    image: '/images/news/industry-report.jpg',
    author: '行业研究',
    views: 3200,
  },
  {
    id: 5,
    title: '道达智能与三亚亚特兰蒂斯酒店达成战略合作',
    category: '公司动态',
    date: '2026-02-15',
    excerpt: '双方将在高端酒店接驳车领域展开深度合作，共同提升奢华酒店服务标准。',
    image: '/images/news/sanya-partnership.jpg',
    author: '市场部',
    views: 1560,
  },
  {
    id: 6,
    title: '新国标出台，电动观光车安全标准再升级',
    category: '行业资讯',
    date: '2026-02-10',
    excerpt: '市场监管总局发布新版电动观光车安全技术规范，对电池安全、制动系统等提出更高要求。',
    image: '/images/news/new-standard.jpg',
    author: '法规研究',
    views: 2890,
  },
];

const categories = ['全部', '公司动态', '产品发布', '项目动态', '行业资讯', '媒体报道'];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filteredNews = selectedCategory === '全部' 
    ? news 
    : news.filter(n => n.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6">新闻中心</h1>
          <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
            了解道达智能最新动态、行业资讯和产品信息
          </p>
        </div>
      </section>

      {/* 分类筛选 */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 新闻列表 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <Link 
                key={item.id} 
                href={`/news/${item.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  {/* 占位图 */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{item.date}</span>
                    <span className="mx-2">•</span>
                    <span>{item.author}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {item.views}
                    </span>
                    <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                      阅读更多
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

      {/* 加载更多 */}
      <div className="text-center py-12">
        <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
          加载更多
        </button>
      </div>

      {/* 订阅 CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">订阅我们的新闻</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            获取最新产品发布、行业动态和优惠信息
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="输入您的邮箱"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              订阅
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
