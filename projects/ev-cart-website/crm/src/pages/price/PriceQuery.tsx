import React, { useState } from 'react'
import { Card, Input, Button, Descriptions, Table, Tag } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { priceApi } from '@/services/price'

const PriceQuery: React.FC = () => {
  const [productId, setProductId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [price, setPrice] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!productId) return
    setLoading(true)
    try {
      const result = await priceApi.getProductPrice(productId, customerId || undefined)
      setPrice(result)
    } catch (error) {
      console.error('查询价格失败', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <Card title="产品价格查询">
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="产品 ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            style={{ width: 200 }}
          />
          <Input
            placeholder="客户 ID (可选)"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
            查询
          </Button>
        </div>

        {price && (
          <Descriptions title="价格信息" column={2} bordered>
            <Descriptions.Item label="产品 ID">{price.product_id}</Descriptions.Item>
            <Descriptions.Item label="基础价格">¥{price.base_price.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="客户等级">
              <Tag color="blue">{price.customer_level}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="折扣">{(price.discount * 100).toFixed(0)}%</Descriptions.Item>
            <Descriptions.Item label="最终价格" span={2}>
              <span className="text-red-600 font-bold text-lg">¥{price.final_price.toLocaleString()}</span>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </div>
  )
}

export default PriceQuery
