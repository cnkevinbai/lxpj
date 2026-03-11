'use client'

import { useState } from 'react'
import SEO from '@/components/seo/SEO'
import Button from '@/components/ui/Button'

export default function InquiryPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    product: '',
    quantity: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 调用后端 API 提交表单
    console.log('Form submitted:', formData)
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            感谢您的咨询，我们的专业顾问将在 24 小时内与您联系
          </p>
          <a href="/" className="btn-primary">返回首页</a>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title="立即询价 - EV Cart 集团"
        description="获取 EV Cart 电动观光车免费报价，24 小时内回复"
        url="https://www.evcart.com/inquiry"
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="heading-2 mb-4">立即询价</h1>
              <p className="text-gray-600">
                留下您的需求，我们的专业顾问将在 24 小时内为您提供定制化的产品方案和报价
              </p>
            </div>

            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      公司名称
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="请输入公司名称"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                      意向产品
                    </label>
                    <select
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    >
                      <option value="">请选择产品</option>
                      <option value="ec-11">EC-11 电动观光车</option>
                      <option value="ec-14">EC-14 电动观光车</option>
                      <option value="ec-23">EC-23 电动巴士</option>
                      <option value="ep-2">EP-2 电动巡逻车</option>
                      <option value="ef-1">EF-1 电动货车</option>
                      <option value="custom">其他定制需求</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      采购数量
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="请输入采购数量"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    详细需求
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    placeholder="请描述您的具体需求，如使用场景、配置要求等"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  提交询价
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  提交即表示您同意我们的隐私政策，我们不会泄露您的个人信息
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
