import type { Metadata } from 'next'
import '../styles/globals.css'
import Navbar from '@/components/business/Navbar'
import Footer from '@/components/business/Footer'

export const metadata: Metadata = {
  title: {
    default: '四川道达智能 - 电动观光车专家',
    template: '%s | 四川道达智能',
  },
  description: '四川道达智能车辆制造有限公司专业生产电动观光车 15 年，产品覆盖景区、酒店、房地产、工厂等场景。续航 80-120km，支持定制，全国 200+ 经销商服务网络。',
  keywords: '电动观光车，景区观光车，酒店电瓶车，电动巡逻车，观光车厂家，观光车价格，四川道达智能',
  authors: [{ name: '四川道达智能' }],
  creator: '四川道达智能',
  publisher: '四川道达智能',
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://www.evcart.com'),
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/zh-CN',
      'en': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.evcart.com',
    title: 'EV Cart 集团 - 电动观光车专家',
    description: 'EV Cart 集团专业生产电动观光车 15 年',
    siteName: 'EV Cart 集团',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EV Cart 集团',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EV Cart 集团 - 电动观光车专家',
    description: 'EV Cart 集团专业生产电动观光车 15 年',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 百度统计 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?xxxxxxxxxx";
                var s = document.getElementsByTagName("script")[0]; 
                s.parentNode.insertBefore(hm, s);
              })();
            `,
          }}
        />
        {/* 公司名称 */}
        <meta name="author" content="四川道达智能车辆制造有限公司" />
      </head>
      <body className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
