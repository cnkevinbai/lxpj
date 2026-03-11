'use client'

import SEO from '@/components/seo/SEO'

export default function AboutPage() {
  return (
    <>
      <SEO
        title="关于我们 - EV Cart 集团"
        description="EV Cart 集团 15 年专注电动观光车研发生产，为全球客户提供绿色出行解决方案"
        url="https://www.evcart.com/about"
      />

      <div>
        {/* Hero */}
        <section className="bg-gray-900 text-white py-20">
          <div className="container-custom text-center">
            <h1 className="heading-1 mb-4">关于四川道达智能</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              四川道达智能车辆制造有限公司
            </p>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              15 年专注，铸就绿色出行专家
            </p>
          </div>
        </section>

        {/* 公司简介 */}
        <section className="section">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="heading-2 mb-6">公司简介</h2>
                <p className="text-gray-600 mb-4">
                  四川道达智能车辆制造有限公司成立于 2011 年，是一家专注于电动观光车、电动巡逻车、电动货车等新能源车辆研发、生产、销售于一体的高新技术企业。
                </p>
                <p className="text-gray-600 mb-4">
                  公司总部位于四川省，拥有现代化生产基地 50000 平方米，员工 500 余人，其中研发技术人员占比超过 30%。
                </p>
                <p className="text-gray-600">
                  产品远销全球 50 多个国家和地区，服务超过 50000 家客户，包括众多 5A 级景区、星级酒店、大型房地产项目等。
                </p>
              </div>
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                <img src="/images/about-company.jpg" alt="公司环境" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* 核心优势 */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">核心优势</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                15 年技术沉淀，铸就行业领先地位
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  number: '15+',
                  title: '年行业经验',
                  desc: '专注电动观光车研发生产',
                },
                {
                  number: '500+',
                  title: '专业团队',
                  desc: '研发技术人员占比 30%',
                },
                {
                  number: '50+',
                  title: '覆盖国家',
                  desc: '产品远销全球市场',
                },
                {
                  number: '50000+',
                  title: '服务客户',
                  desc: '赢得广泛信赖与好评',
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-brand-blue mb-2">{item.number}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 发展历程 */}
        <section className="section">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">发展历程</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                一步一个脚印，书写绿色出行新篇章
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              {[
                { year: '2011', title: '公司成立', desc: '四川道达智能成立，开始电动观光车研发' },
                { year: '2014', title: '技术突破', desc: '自主研发 BMS 电池管理系统，续航提升 30%' },
                { year: '2017', title: '市场扩张', desc: '产品出口至 20 个国家，建立海外销售网络' },
                { year: '2020', title: '智能制造', desc: '新工厂投产，年产能突破 10000 台' },
                { year: '2023', title: '行业领先', desc: '市场份额全国前三，服务客户超 50000 家' },
                { year: '2026', title: '持续创新', desc: '四川道达智能推出新一代智能电动观光车，引领行业升级' },
              ].map((item, index) => (
                <div key={index} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex-shrink-0 w-24 text-center">
                    <div className="text-2xl font-bold text-brand-blue">{item.year}</div>
                  </div>
                  <div className="flex-grow pb-8 border-l-2 border-gray-200 pl-6">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 荣誉资质 */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">荣誉资质</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                品质铸就荣誉，创新赢得未来
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                '国家高新技术企业',
                'ISO9001 质量管理体系认证',
                'CE 欧盟安全认证',
                'FCC 美国联邦认证',
                '江苏省名牌产品',
                '苏州市专精特新企业',
                '绿色工厂认证',
                'AAA 级信用企业',
              ].map((item, index) => (
                <div key={index} className="card p-6 text-center">
                  <div className="text-3xl mb-3">🏆</div>
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-brand-blue text-white">
          <div className="container-custom text-center">
            <h2 className="heading-2 mb-4">携手四川道达智能，共创绿色未来</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              无论您是景区、酒店、房地产还是工厂，我们都能为您提供专业的绿色出行解决方案
            </p>
            <a href="/contact" className="btn bg-white text-brand-blue hover:bg-gray-100">
              联系我们
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
