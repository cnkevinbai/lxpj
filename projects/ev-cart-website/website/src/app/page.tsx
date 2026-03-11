export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-screen flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/hero-bg.jpg"
            alt="电动观光车"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="heading-1 text-white mb-6">
            引领绿色出行新时代
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            EV Cart 集团专业生产电动观光车 15 年，为全球客户提供高品质绿色出行解决方案
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/products" className="btn-primary">
              探索产品
            </a>
            <a href="/contact" className="btn-outline text-white border-white hover:bg-white hover:text-gray-900">
              联系我们
            </a>
          </div>
        </div>
      </section>

      {/* 核心优势 */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">为什么选择 EV Cart</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              15 年专注，200+ 经销商网络，50000+ 客户信赖
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🔋',
                title: '超长续航',
                desc: '80-120km 续航，满足全天运营需求',
              },
              {
                icon: '🛡️',
                title: '安全可靠',
                desc: '通过 ISO9001、CE 等多项国际认证',
              },
              {
                icon: '🔧',
                title: '定制服务',
                desc: '支持车型、颜色、配置全方位定制',
              },
              {
                icon: '🌍',
                title: '全球服务',
                desc: '全国 200+ 经销商，24 小时响应',
              },
            ].map((item, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 热门产品 */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">热门车型</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              多样化车型，满足景区、酒店、房地产、工厂等多种场景需求
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'EC-11', seats: 11, range: '80km', image: '/images/ec-11.jpg' },
              { name: 'EC-14', seats: 14, range: '100km', image: '/images/ec-14.jpg' },
              { name: 'EC-23', seats: 23, range: '120km', image: '/images/ec-23.jpg' },
            ].map((product, index) => (
              <div key={index} className="card overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <div className="flex justify-between text-gray-600 mb-4">
                    <span>{product.seats}座</span>
                    <span>续航{product.range}</span>
                  </div>
                  <a href={`/products/${product.name.toLowerCase()}`} className="btn-primary w-full block text-center">
                    了解详情
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-brand-blue text-white">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4">获取免费报价</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            留下您的需求，我们的专业顾问将在 24 小时内与您联系
          </p>
          <a href="/contact" className="btn bg-white text-brand-blue hover:bg-gray-100">
            立即咨询
          </a>
        </div>
      </section>
    </main>
  )
}
