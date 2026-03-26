/**
 * 产品展示区组件 - 简化版
 */

import { useTranslation } from 'react-i18next'
import { Card, Typography, Button } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const products = [
  {
    key: 'sightseeing',
    icon: '🚗',
    title: '新能源观光车',
    subtitle: '经典系列 · 传承，进化',
    features: ['800km 续航', '快速充电', '智能驾驶辅助'],
  },
  {
    key: 'patrol',
    icon: '🚓',
    title: '电动巡逻车',
    subtitle: '守护者 · 静默，迅捷',
    features: ['静音行驶', '快速响应', '全景监控'],
  },
  {
    key: 'golf',
    icon: '⛳',
    title: '高尔夫球车',
    subtitle: '奢华款 · 舒适，风尚',
    features: ['豪华座椅', '智能导航', '长续航'],
  },
  {
    key: 'autonomous',
    icon: '🤖',
    title: '无人驾驶观光车',
    subtitle: '未来款 · L4 自动驾驶',
    features: ['L4 自动驾驶', '智能避障', '远程监控'],
  },
  {
    key: 'sharing',
    icon: '🔄',
    title: '景区共享漫游车',
    subtitle: '共享款 · 扫码即走',
    features: ['智能扫码', '自动计费', 'GPS 定位'],
  },
]

const ProductsSection = () => {
  const { t } = useTranslation()

  return (
    <section className="products-section">
      <div className="container">
        <Title level={2} className="section-title">
          全系列产品
        </Title>
        <Paragraph className="section-subtitle">
          探索道达智能出行解决方案
        </Paragraph>

        <div className="products-grid">
          {products.map((product) => (
            <Card
              key={product.key}
              className="product-card"
              hoverable
            >
              <div className="product-icon">{product.icon}</div>
              <Title level={4} className="product-title">
                {product.title}
              </Title>
              <Paragraph className="product-subtitle">
                {product.subtitle}
              </Paragraph>
              
              <div className="product-features">
                {product.features.map((feature, i) => (
                  <div key={i} className="feature-item">
                    <span className="feature-dot" />
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                type="primary"
                shape="round"
                icon={<ArrowRightOutlined />}
                className="learn-more-btn"
              >
                了解详情
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <style>{`
        .products-section {
          padding: 160px 24px;
          background: linear-gradient(180deg, #0A0A0A 0%, #050505 100%);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 48px !important;
          color: #FFFFFF !important;
          text-align: center;
          margin-bottom: 16px !important;
        }

        .section-subtitle {
          font-size: 20px !important;
          color: #A0A0A0 !important;
          text-align: center;
          margin-bottom: 64px !important;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 32px;
        }

        .product-card {
          background: rgba(18, 18, 18, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-align: center;
        }

        .product-card:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: rgba(0, 102, 255, 0.3) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .product-icon {
          font-size: 80px;
          margin-bottom: 24px;
        }

        .product-title {
          color: #FFFFFF !important;
          margin-bottom: 8px !important;
        }

        .product-subtitle {
          color: #A0A0A0 !important;
          margin-bottom: 20px !important;
        }

        .product-features {
          text-align: left;
          margin-bottom: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .feature-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%);
          flex-shrink: 0;
        }

        .feature-text {
          color: #E0E0E0;
          font-size: 14px;
        }

        .learn-more-btn {
          width: 100%;
          height: 44px;
          background: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%);
          border: none;
        }

        .learn-more-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(0, 102, 255, 0.5);
        }

        @media (max-width: 768px) {
          .products-section {
            padding: 80px 24px;
          }

          .section-title {
            font-size: 28px !important;
          }

          .section-subtitle {
            font-size: 16px !important;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}

export default ProductsSection
