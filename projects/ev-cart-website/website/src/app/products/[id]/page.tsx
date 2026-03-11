'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import SEO from '@/components/seo/SEO'
import Button from '@/components/ui/Button'

const mockProducts = {
  'ec-11': {
    name: 'EC-11 电动观光车',
    model: 'EC-11',
    seats: 11,
    range: 80,
    speed: 30,
    chargeTime: '6-8 小时',
    motor: '4kW 交流电机',
    battery: '48V/200Ah 铅酸电池',
    dimensions: { length: 3960, width: 1220, height: 2050 },
    weight: 980,
    priceRange: '4.5 万 -5.5 万元',
    description: 'EC-11 是专为景区、酒店设计的 11 座电动观光车，续航 80km，满足全天运营需求。',
    features: ['超长续航', '低噪音', '零排放', '智能 BMS', '爬坡能力强', '舒适座椅'],
    images: ['/images/ec-11-1.jpg', '/images/ec-11-2.jpg', '/images/ec-11-3.jpg'],
  },
  'ec-14': {
    name: 'EC-14 电动观光车',
    model: 'EC-14',
    seats: 14,
    range: 100,
    speed: 30,
    chargeTime: '8-10 小时',
    motor: '5kW 交流电机',
    battery: '72V/200Ah 锂电池',
    dimensions: { length: 4600, width: 1220, height: 2050 },
    weight: 1150,
    priceRange: '6 万 -7 万元',
    description: 'EC-14 是 14 座中型观光车，适合大型景区、度假村，续航 100km。',
    features: ['大容量电池', '宽敞空间', '独立悬挂', '智能仪表盘', 'USB 充电', '音响系统'],
    images: ['/images/ec-14-1.jpg', '/images/ec-14-2.jpg', '/images/ec-14-3.jpg'],
  },
  'ec-23': {
    name: 'EC-23 电动巴士',
    model: 'EC-23',
    seats: 23,
    range: 120,
    speed: 35,
    chargeTime: '10-12 小时',
    motor: '7.5kW 交流电机',
    battery: '96V/300Ah 锂电池',
    dimensions: { length: 6200, width: 1600, height: 2400 },
    weight: 1800,
    priceRange: '10 万 -12 万元',
    description: 'EC-23 是 23 座电动巴士，适合大型景区、机场、火车站等接驳场景。',
    features: ['超长续航', '大容量', '空调系统', '行李舱', '无障碍设计', '智能调度'],
    images: ['/images/ec-23-1.jpg', '/images/ec-23-2.jpg', '/images/ec-23-3.jpg'],
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const productKey = params.id as string
  const product = mockProducts[productKey as keyof typeof mockProducts]

  const [selectedImage, setSelectedImage] = useState(0)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-1 mb-4">产品不存在</h1>
          <a href="/products" className="btn-primary">返回产品列表</a>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${product.name} - EV Cart 集团`}
        description={product.description}
        image={product.images[0]}
        url={`https://www.evcart.com/products/${productKey}`}
        type="product"
      />

      <div className="container-custom py-12">
        {/* 产品图片 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-brand-blue' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 产品信息 */}
          <div>
            <h1 className="heading-2 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-brand-blue mb-6">{product.priceRange}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="card p-4">
                <div className="text-sm text-gray-500">座位数</div>
                <div className="text-xl font-semibold">{product.seats}座</div>
              </div>
              <div className="card p-4">
                <div className="text-sm text-gray-500">续航里程</div>
                <div className="text-xl font-semibold">{product.range}km</div>
              </div>
              <div className="card p-4">
                <div className="text-sm text-gray-500">最高时速</div>
                <div className="text-xl font-semibold">{product.speed}km/h</div>
              </div>
              <div className="card p-4">
                <div className="text-sm text-gray-500">充电时间</div>
                <div className="text-xl font-semibold">{product.chargeTime}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/inquiry" className="btn-primary flex-1 text-center">
                立即询价
              </a>
              <a href="/contact" className="btn-outline flex-1 text-center">
                预约试驾
              </a>
            </div>
          </div>
        </div>

        {/* 详细参数 */}
        <div className="card p-8 mb-12">
          <h2 className="heading-3 mb-6">详细参数</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">基本参数</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">型号</td>
                    <td className="py-3 font-medium">{product.model}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">座位数</td>
                    <td className="py-3 font-medium">{product.seats}座</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">续航里程</td>
                    <td className="py-3 font-medium">{product.range}km</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">最高时速</td>
                    <td className="py-3 font-medium">{product.speed}km/h</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-semibold mb-3">动力系统</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">电机功率</td>
                    <td className="py-3 font-medium">{product.motor}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">电池类型</td>
                    <td className="py-3 font-medium">{product.battery}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">充电时间</td>
                    <td className="py-3 font-medium">{product.chargeTime}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-semibold mb-3">尺寸重量</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">长×宽×高</td>
                    <td className="py-3 font-medium">
                      {product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height}mm
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">整车重量</td>
                    <td className="py-3 font-medium">{product.weight}kg</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-semibold mb-3">价格信息</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">价格区间</td>
                    <td className="py-3 font-medium text-brand-blue">{product.priceRange}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 产品特色 */}
        <div className="card p-8 mb-12">
          <h2 className="heading-3 mb-6">产品特色</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {product.features.map((feature, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">✓</div>
                <div className="text-sm font-medium">{feature}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-blue text-white p-12 rounded-2xl text-center">
          <h2 className="heading-3 mb-4">获取专属报价方案</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            留下您的需求，我们的专业顾问将在 24 小时内为您提供定制化的产品方案和报价
          </p>
          <a href="/inquiry" className="btn bg-white text-brand-blue hover:bg-gray-100">
            立即咨询
          </a>
        </div>
      </div>
    </>
  )
}
