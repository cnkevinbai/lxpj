'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-6">关于我们</h1>
          <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
            四川道达智能科技有限公司，15 年专注电动观光车研发与生产
          </p>
        </div>
      </section>

      {/* 公司简介 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">公司简介</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                四川道达智能科技有限公司成立于 2011 年，是一家专业从事电动观光车、巡逻车、货车等新能源车辆研发、生产和销售的高新技术企业。
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                公司拥有现代化生产基地 20000 平方米，员工 200 余人，其中专业技术人员 50 余人。年生产能力达 10000 台，产品远销全球 50 多个国家和地区。
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                道达智能秉承"创新、品质、服务"的理念，致力于为客户提供绿色出行的整体解决方案，已成为行业领先的电动观光车制造商。
              </p>
              <div className="flex gap-4">
                <Link
                  href="/products"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  查看产品
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  联系我们
                </Link>
              </div>
            </div>
            <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心优势 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">核心优势</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🏭',
                title: '15 年生产经验',
                description: '深耕行业 15 年，积累了丰富的生产经验和技术储备',
              },
              {
                icon: '🔬',
                title: '强大研发实力',
                description: '50+ 专业技术人员，持续创新，保持技术领先',
              },
              {
                icon: '✅',
                title: '严格质量控制',
                description: '通过 ISO9001 认证，每辆车经过 100+ 项检测',
              },
              {
                icon: '🌍',
                title: '全球销售网络',
                description: '产品远销全球 50+ 国家，服务 10000+ 客户',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 发展历程 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">发展历程</h2>
          <div className="max-w-4xl mx-auto">
            {[
              { year: '2011', title: '公司成立', description: '四川道达智能正式成立，开始电动观光车研发' },
              { year: '2014', title: '技术突破', description: '自主研发电池管理系统，续航能力提升 50%' },
              { year: '2017', title: '市场拓展', description: '产品出口海外，开拓国际市场' },
              { year: '2020', title: '产能升级', description: '新生产基地投产，年产能达 10000 台' },
              { year: '2023', title: '行业领先', description: '成为行业领先品牌，服务 10000+ 客户' },
              { year: '2026', title: '智能升级', description: '推出智能网联产品，引领行业智能化发展' },
            ].map((item, index) => (
              <div key={index} className="flex items-start mb-8">
                <div className="flex-shrink-0 w-24">
                  <div className="text-2xl font-bold text-blue-600">{item.year}</div>
                </div>
                <div className="flex-grow">
                  <div className="w-4 h-4 bg-blue-600 rounded-full mt-2"></div>
                </div>
                <div className="flex-grow ml-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 荣誉资质 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">荣誉资质</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: '国家高新技术企业', year: '2018' },
              { title: 'ISO9001 质量管理体系认证', year: '2015' },
              { title: 'AAA 级信用企业', year: '2020' },
              { title: '新能源汽车行业创新企业奖', year: '2025' },
              { title: '出口质量许可证', year: '2017' },
              { title: '3C 认证', year: '2013' },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
              >
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <div className="text-sm text-gray-500">{item.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">15 年</div>
              <div className="text-blue-100">行业经验</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">10000+</div>
              <div className="text-blue-100">交付车辆</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-100">出口国家</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-blue-100">客户满意度</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">期待与您合作</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            无论您是景区、酒店、园区还是经销商，我们都能为您提供最适合的解决方案
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/inquiry"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              立即询价
            </Link>
            <Link
              href="/contact"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              联系我们
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
