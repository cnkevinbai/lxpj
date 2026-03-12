import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Descriptions, Card, Tabs, Table, Tag, Button, Space, message, Progress } from 'antd'
import { EditOutlined, BackwardOutlined } from '@ant-design/icons'

interface Product {
  id: string
  productCode: string
  productName: string
  category: string
  specification: string
  unit: string
  unitPrice: number
  unitCost: number
  stockQuantity: number
  safeStock: number
  minStock: number
  maxStock: number
  status: string
  createdAt: string
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  const statusColors: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    discontinued: 'error',
  }

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/products/${id}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      message.error('加载产品详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  if (loading || !product) {
    return <div>加载中...</div>
  }

  const stockPercent = product.maxStock > 0 ? (product.stockQuantity / product.maxStock) * 100 : 0
  const isLowStock = product.stockQuantity < product.safeStock
  const isOutOfStock = product.stockQuantity === 0

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<BackwardOutlined />} onClick={() => navigate('/products')}>
            返回列表
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/products/${id}/edit`)}
          >
            编辑产品
          </Button>
        </Space>
      </Card>

      <Card title="产品详情">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="产品编码">{product.productCode}</Descriptions.Item>
          <Descriptions.Item label="产品名称">{product.productName}</Descriptions.Item>
          <Descriptions.Item label="产品类别">{product.category}</Descriptions.Item>
          <Descriptions.Item label="规格型号">{product.specification || '-'}</Descriptions.Item>
          <Descriptions.Item label="单位">{product.unit}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusColors[product.status]}>
              {product.status === 'active' ? '在售' : product.status === 'inactive' ? '停售' : '停产'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="成本价">¥{(product.unitCost || 0).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="销售价">
            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>¥{(product.unitPrice || 0).toLocaleString()}</span>
          </Descriptions.Item>
          <Descriptions.Item label="毛利率">
            <span style={{ color: product.unitPrice > product.unitCost ? '#52c41a' : '#ff4d4f' }}>
              {product.unitPrice > product.unitCost ? (((product.unitPrice - product.unitCost) / product.unitPrice) * 100).toFixed(1) : 0}%
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="当前库存" span={2}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <span style={{ fontSize: 24, fontWeight: 'bold', color: isOutOfStock ? '#ff4d4f' : isLowStock ? '#faad14' : '#52c41a' }}>
                  {product.stockQuantity}
                </span>
                <span style={{ marginLeft: 8, color: '#999' }}>件</span>
                {isOutOfStock && <Tag color="error" style={{ marginLeft: 8 }}>缺货</Tag>}
                {isLowStock && !isOutOfStock && <Tag color="warning" style={{ marginLeft: 8 }}>库存不足</Tag>}
              </div>
              <Progress
                percent={stockPercent}
                strokeColor={isLowStock ? '#faad14' : '#52c41a'}
                format={() => `${stockPercent.toFixed(1)}%`}
              />
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="安全库存">{product.safeStock || 0} 件</Descriptions.Item>
          <Descriptions.Item label="最低库存">{product.minStock || 0} 件</Descriptions.Item>
          <Descriptions.Item label="最高库存">{product.maxStock || 0} 件</Descriptions.Item>
          <Descriptions.Item label="创建时间">{new Date(product.createdAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}

export default ProductDetail
