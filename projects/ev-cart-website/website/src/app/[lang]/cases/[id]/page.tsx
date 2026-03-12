'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

// 案例数据（实际应从 API 获取）
const casesData: Record<string, any> = {
  '1': {
    id: 1,
    title: '张家界国家森林公园观光车项目',
    category: '景区',
    location: '湖南 · 张家界',
    year: 2025,
    vehicles: 50,
    dailyPassengers: 10000,
    image: '/images/cases/zhangjiajie.jpg',
    description: '部署 50 辆电动观光车，覆盖主要景点接驳路线，日均服务游客 10000+ 人次',
    challenge: '张家界国家森林公园面积大、景点分散、坡度多，需要解决长续航、强动力、高安全性的问题。',
    solution: '提供 50 辆 23 座电动观光车，搭载大容量锂电池，续航里程达 180 公里，配备电磁刹车和缓降系统，确保山区行驶安全。',
    results: [
      '日均服务游客 10000+ 人次',
      '年运营里程超过 50 万公里',
      '客户满意度 98%',
      '运营成本降低 40%',
    ],
    testimonial: {
      quote: '道达智能的观光车性能稳定，续航给力，大大提升了游客的游览体验。售后服务也很及时，是我们值得信赖的合作伙伴。',
      author: '张主任',
      position: '张家界国家森林公园管理处',
    },
    gallery: [
      '/images/cases/zjj-1.jpg',
      '/images/cases/zjj-2.jpg',
      '/images/cases/zjj-3.jpg',
      '/images/cases/zjj-4.jpg',
    ],
  },
  '2': {
    id: 2,
    title: '三亚亚特兰蒂斯酒店接驳车',
    category: '酒店',
    location: '海南 · 三亚',
    year: 2025,
    vehicles: 20,
    dailyPassengers: 3000,
    image: '/images/cases/sanya-hotel.jpg',
    description: '高端定制观光车，提供 VIP 宾客接送服务，提升酒店服务品质',
    challenge: '五星级酒店对车辆外观、舒适度、静音性要求极高，需要与酒店奢华定位匹配。',
    solution: '定制 20 辆 VIP 礼宾车，采用高档皮质座椅、静音电机、个性化涂装，配备空调和行李空间。',
    results: [
      'VIP 宾客满意度 99%',
      '日均接送 3000+ 人次',
      '零噪音投诉',
      '提升酒店服务评分 15%',
    ],
    testimonial: {
      quote: '这些定制观光车完美融入了我们酒店的高端定位，宾客反馈非常好，是提升服务品质的重要一环。',
      author: '李经理',
      position: '三亚亚特兰蒂斯酒店运营总监',
    },
    gallery: [
      '/images/cases/sanya-1.jpg',
      '/images/cases/sanya-2.jpg',
      '/images/cases/sanya-3.jpg',
      '/images/cases/sanya-4.jpg',
    ],
  },
};

const relatedCases = [
  { id: 2, title: '三亚亚特兰蒂斯酒店接驳车', category: '酒店', location: '海南 · 三亚' },
  { id: 3, title: '上海迪士尼乐园园区通勤车', category: '园区', location: '上海' },
  { id: 4, title: '杭州西湖景区城市观光线', category: '城市观光', location: '浙江 · 杭州' },
];

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;
  const [activeImage, setActiveImage] = useState(0);
  
  const caseItem = casesData[caseId] || casesData['1'];

  if (!caseItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">案例不存在</h1>
          <Link href="/cases" className="text-blue-600 hover:underline">
            返回案例列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-sm mb-2 opacity-80">{caseItem.category} · {caseItem.location}</div>
            <h1 className="text-5xl font-bold mb-4">{caseItem.title}</h1>
            <div className="text-xl opacity-90">{caseItem.description}</div>
          </div>
        </div>
      </section>

      {/* 项目概览 */}
      <section className="py-12 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{caseItem.vehicles}辆</div>
              <div className="text-gray-600">部署车辆</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{caseItem.dailyPassengers.toLocaleString()}+</div>
              <div className="text-gray-600">日均服务人次</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{caseItem.year}</div>
              <div className="text-gray-600">交付年份</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%+</div>
              <div className="text-gray-600">客户满意度</div>
            </div>
          </div>
        </div>
      </section>

      {/* 主要内容 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* 左侧：详情 */}
            <div className="lg:col-span-2 space-y-12">
              {/* 挑战与解决方案 */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">项目背景</h2>
                <div className="space-y-6">
                  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                    <h3 className="font-bold text-red-700 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      面临挑战
                    </h3>
                    <p className="text-gray-700">{caseItem.challenge}</p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                    <h3 className="font-bold text-green-700 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      解决方案
                    </h3>
                    <p className="text-gray-700">{caseItem.solution}</p>
                  </div>
                </div>
              </div>

              {/* 项目成果 */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">项目成果</h2>
                <ul className="space-y-4">
                  {caseItem.results.map((result: string, index: number) => (
                    <li key={index} className="flex items-start bg-white p-4 rounded-lg shadow">
                      <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 font-medium">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 项目图库 */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">项目图集</h2>
                <div className="grid grid-cols-2 gap-4">
                  {caseItem.gallery.map((img: string, index: number) => (
                    <div
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`aspect-video bg-gray-200 rounded-lg cursor-pointer overflow-hidden ${
                        activeImage === index ? 'ring-4 ring-blue-600' : ''
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 客户评价 */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl">
                <svg className="w-12 h-12 mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-xl mb-6 italic">&ldquo;{caseItem.testimonial.quote}&rdquo;</p>
                <div>
                  <div className="font-bold">{caseItem.testimonial.author}</div>
                  <div className="opacity-80">{caseItem.testimonial.position}</div>
                </div>
              </div>
            </div>

            {/* 右侧：相关产品 */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">推荐车型</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-600 transition-colors cursor-pointer">
                    <div className="font-semibold text-gray-900 mb-2">23 座电动观光车</div>
                    <div className="text-sm text-gray-600 mb-3">适用于景区、园区接驳</div>
                    <div className="text-blue-600 font-medium">了解详情 →</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-600 transition-colors cursor-pointer">
                    <div className="font-semibold text-gray-900 mb-2">VIP 礼宾车</div>
                    <div className="text-sm text-gray-600 mb-3">高端定制，酒店专用</div>
                    <div className="text-blue-600 font-medium">了解详情 →</div>
                  </div>
                </div>
                <Link
                  href="/inquiry"
                  className="mt-6 block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  获取报价
                </Link>
              </div>

              {/* 相关案例 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">相关案例</h3>
                <div className="space-y-4">
                  {relatedCases.map((related) => (
                    <Link
                      key={related.id}
                      href={`/cases/${related.id}`}
                      className="block group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-20 h-14 bg-gray-200 rounded flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {related.title}
                          </div>
                          <div className="text-sm text-gray-500">{related.location}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">想了解类似解决方案？</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            立即联系我们，获取专属定制方案和报价
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              联系我们
            </Link>
            <Link
              href="/inquiry"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              在线询价
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
