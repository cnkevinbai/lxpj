import Link from 'next/link'

const footerLinks = {
  products: [
    { name: '电动观光车', href: '/products/sightseeing' },
    { name: '电动巡逻车', href: '/products/patrol' },
    { name: '电动货车', href: '/products/cargo' },
    { name: '电动巴士', href: '/products/bus' },
  ],
  solutions: [
    { name: '景区解决方案', href: '/solutions/scenic' },
    { name: '酒店解决方案', href: '/solutions/hotel' },
    { name: '房地产解决方案', href: '/solutions/realestate' },
    { name: '工厂解决方案', href: '/solutions/factory' },
  ],
  support: [
    { name: '售后服务', href: '/support/service' },
    { name: '配件查询', href: '/support/parts' },
    { name: '维修指南', href: '/support/repair' },
    { name: '常见问题', href: '/support/faq' },
  ],
  company: [
    { name: '关于我们', href: '/about' },
    { name: '新闻动态', href: '/news' },
    { name: '加入我们', href: '/careers' },
    { name: '联系我们', href: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* 公司信息 */}
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-4">四川道达智能</h3>
            <p className="text-gray-400 mb-4">
              四川道达智能车辆制造有限公司
            </p>
            <p className="text-gray-400 mb-4">
              15 年专注电动观光车研发生产，为全球客户提供绿色出行解决方案
            </p>
            <div className="flex space-x-4">
              {/* 社交媒体图标 */}
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">微信</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.5 10.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm5 0c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">微博</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/></svg>
              </a>
            </div>
          </div>

          {/* 产品 */}
          <div>
            <h4 className="font-semibold mb-4">产品</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 解决方案 */}
          <div>
            <h4 className="font-semibold mb-4">解决方案</h4>
            <ul className="space-y-2">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 服务支持 */}
          <div>
            <h4 className="font-semibold mb-4">服务支持</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} 四川道达智能车辆制造有限公司。All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                使用条款
              </Link>
              <Link href="/icp" className="text-gray-400 hover:text-white text-sm">
                京 ICP 备 XXXXXXXX 号
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
