'use client'

import { useState } from 'react'
import SEO from '@/components/seo/SEO'
import Button from '@/components/ui/Button'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="heading-2 mb-4">提交成功</h1>
          <p className="text-gray-600 mb-8">
            感谢您的留言，我们将尽快与您联系
          </p>
          <a href="/" className="btn-primary">返回首页</a>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title="联系我们 - EV Cart 集团"
        description="联系 EV Cart 集团，获取电动观光车产品咨询和服务支持"
        url="https://www.evcart.com/contact"
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="heading-2 mb-4">联系我们</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              如有任何疑问或需求，请随时与我们联系，我们的专业团队将为您提供优质服务
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 联系信息 */}
            <div>
              <div className="card p-8 mb-6">
                <h2 className="heading-3 mb-6">联系方式</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">电话咨询</h3>
                      <p className="text-gray-600">400-XXX-XXXX</p>
                      <p className="text-sm text-gray-500">工作日 9:00-18:00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">邮箱联系</h3>
                      <p className="text-gray-600">info@evcart.com</p>
                      <p className="text-sm text-gray-500">24 小时内回复</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">公司地址</h3>
                      <p className="text-gray-600">江苏省苏州市 XX 区 XX 路 XX 号</p>
                      <p className="text-sm text-gray-500">欢迎来访参观</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 地图占位 */}
              <div className="card overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">地图加载中...</p>
                </div>
              </div>
            </div>

            {/* 联系表单 */}
            <div className="card p-8">
              <h2 className="heading-3 mb-6">在线留言</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    placeholder="请输入您的姓名"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      手机号 *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="请输入您的手机号"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="请输入您的邮箱"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    主题
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    placeholder="请输入主题"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    留言内容 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    placeholder="请输入您的留言内容"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  提交留言
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
