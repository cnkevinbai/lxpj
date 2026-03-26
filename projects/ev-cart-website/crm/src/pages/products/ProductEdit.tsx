import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, InputNumber, Select, Button, Card, message, Space, Divider, Row, Col, Spin, Alert, Switch } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'

const { Option } = Select

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
}

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setFetchLoading(true)
    try {
      // TODO: 调用 API
      // const response = await fetch(`/api/v1/products/${id}`)
      // const data = await response.json()
      
      // Mock data
      const mockData: Product = {
        id: id || '1',
        productCode: 'P001',
        productName: '智能换电柜 V3',
        category: '换电设备',
        specification: '标准版',
        unit: '台',
        unitPrice: 15000,
        unitCost: 8000,
        stockQuantity: 150,
        safeStock: 50,
        minStock: 20,
        maxStock: 200,
        status: 'active',
      }
      
      setProduct(mockData)
      form.setFieldsValue(mockData)
    } catch (error) {
      message.error('加载产品信息失败')
    } finally {
      setFetchLoading(false)
    }
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success('更新产品成功')
        navigate('/products')
      } else {
        const error = await response.json()
        message.error(error.message || '更新失败')
      }
    } catch (error) {
      message.error('更新失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" tip="加载中..." /></div>
  }

  if (!product) {
    return (
      <Alert
        message="产品不存在"
        description="该产品可能已被删除"
        type="error"
        showIcon
        action={<Button size="small" onClick={() => navigate('/products')}>返回产品列表</Button>}
      />
    )
  }

  return (
    <div>
      <Card
        title="编辑产品"
        extra={
          <Space>
            <Button icon={<CloseOutlined />} onClick={() => navigate('/products')}>
              取消
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={loading}
            >
              保存
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Divider orientation="left">基本信息</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productCode"
                label="产品编码"
                rules={[{ required: true, message: '请输入产品编码' }]}
              >
                <Input placeholder="如：P001" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productName"
                label="产品名称"
                rules={[{ required: true, message: '请输入产品名称' }]}
              >
                <Input placeholder="如：智能换电柜 V3" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="产品类别"
                rules={[{ required: true, message: '请选择产品类别' }]}
              >
                <Select placeholder="请选择类别">
                  <Option value="换电设备">换电设备</Option>
                  <Option value="电池">电池</Option>
                  <Option value="配件">配件</Option>
                  <Option value="软件服务">软件服务</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="specification"
                label="规格型号"
              >
                <Input placeholder="如：标准版" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="单位"
                rules={[{ required: true, message: '请选择单位' }]}
              >
                <Select>
                  <Option value="台">台</Option>
                  <Option value="个">个</Option>
                  <Option value="套">套</Option>
                  <Option value="件">件</Option>
                  <Option value="组">组</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="产品状态"
                rules={[{ required: true, message: '请选择状态' }]}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="在售"
                  unCheckedChildren="停售"
                  checked={form.getFieldValue('status') === 'active'}
                  onChange={(checked) => form.setFieldValue('status', checked ? 'active' : 'inactive')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">价格信息</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="unitCost"
                label="成本价"
                rules={[{ required: true, message: '请输入成本价' }]}
              >
                <InputNumber
                  min={0}
                  formatter={(value) => `¥${Number(value).toLocaleString()}`}
                  parser={(value) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                  style={{ width: '100%' }}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unitPrice"
                label="销售价"
                rules={[{ required: true, message: '请输入销售价' }]}
              >
                <InputNumber
                  min={0}
                  formatter={(value) => `¥${Number(value).toLocaleString()}`}
                  parser={(value) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                  style={{ width: '100%' }}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">库存设置</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="safeStock"
                label="安全库存"
                rules={[{ required: true, message: '请输入安全库存' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="minStock"
                label="最低库存"
                rules={[{ required: true, message: '请输入最低库存' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxStock"
                label="最高库存"
                rules={[{ required: true, message: '请输入最高库存' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default ProductEdit
