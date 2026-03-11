'use client'

import { useState } from 'react'
import SEO from '@/components/seo/SEO'
import Button from '@/components/ui/Button'

const products = [
  { id: 'ec-11', name: 'EC-11', seats: 11, range: '80km', image: '/images/ec-11.jpg', category: '观光车' },
  { id: 'ec-14', name: 'EC-14', seats: 14, range: '100km', image: '/images/ec-14.jpg', category: '观光车' },
  { id: 'ec-23', name: 'EC-23', seats: 23, range: '120km', image: '/images/ec-23.jpg', category: '巴士' },
  { id: 'ep-2', name: 'EP-2', seats: 2, range: '60km', image: '/images/ep-2.jpg', category: '巡逻车' },
  { id: 'ef-1', name: 'EF-1', seats: 0, range: '90km', image: '/images/ef-1.jpg', category: '货车' },
  { id: 'ec-8', name: 'EC-8', seats: 8, range: '70km', image: '/images/ec-8.jpg', category: '观光车' },
]

const categories = ['全部', '观光车', '巡逻车', '货车', '巴士']

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部')

  const filteredProducts = selectedCategory === '全部'
    ? products
    : products.filter(p => p.category === selectedCategory)

  return (
    <>
      <SEO
        title="产品中心 - EV Cart 集团"
        description="EV Cart 集团提供多种电动观光车、巡逻车、货车、巴士，续航 60-120km，支持定制"
        image="/images/products-og.jpg"
        url="https://www.evcart.com/products"
      />

      <div>
        {/* Hero */}
        <section className="bg-gray-900 text-white py-20">
          <div className="container-custom text-center">
            <h1 className="heading-1 mb-4">产品中心</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              多样化车型，满足景区、酒店、房地产、工厂等多种场景需求
            </p>
          </div>
        </section>

        {/* 筛选 */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-brand-blue text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* 产品列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="card overflow-hidden">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-brand-blue mb-2">{product.category}</div>
                    <h3 className="text-xl font-semibold mb-4">{product.name} 电动{product.category}</h3>
                    <div className="flex justify-between text-gray-600 mb-4">
                      {product.seats > 0 && (
                        <span>{product.seats}座</span>
                      )}
                      <span>续航{product.range}</span>
                    </div>
                    <a
                      href={`/products/${product.id}`}
                      className="btn-primary w-full block text-center"
                    >
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
            <h2 className="heading-2 mb-4">没有找到合适的车型？</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              我们提供定制化服务，根据您的具体需求定制专属车型
            </p>
            <a href="/contact" className="btn bg-white text-brand-blue hover:bg-gray-100">
              联系定制
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
