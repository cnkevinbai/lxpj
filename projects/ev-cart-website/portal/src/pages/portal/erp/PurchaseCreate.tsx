import { useState } from 'react'
import { Card, Form, Input, InputNumber, Button, Table, Space, message, Select } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import request from '@/shared/utils/request'

const { TextArea } = Input

interface PurchaseItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  amount: number
}

// 模拟产品数据
const productOptions = [
  { value: 'p1', label: '钢材 A 型' },
  { value: 'p2', label: '电子元件 B 型' },
  { value: 'p3', label: '机械零件 C 型' },
  { value: 'p4', label: '原材料 D 型' },
]

// 模拟供应商数据
const supplierOptions = [
  { value: 's1', label: '四川钢铁集团' },
  { value: 's2', label: '成都电子科技' },
  { value: 's3', label: '重庆机械制造' },
  { value: 'p4', label: '绵阳材料供应' },
]

// 模拟 API 调用
const purchaseApi = {
  create: async (data: any) => {
    // TODO: 实际 API 调用
    return { success: true }
  },
}

export default function PurchaseCreate() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [items, setItems] = useState<PurchaseItem[]>([])
  const [submitting, setSubmitting] = useState(false)

  const addItem = () => {
    setItems([...items, { productId: '', productName: '', quantity: 1, unitPrice: 0, amount: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // 自动计算金额
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice
    }
    
    // 更新产品名称
    if (field === 'productId') {
      const product = productOptions.find(p => p.value === value)
      if (product) {
        newItems[index].productName = product.label
      }
    }
    
    setItems(newItems)
  }

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  const itemColumns = [
    {
      title: '产品',
      dataIndex: 'productId',
      key: 'productId',
      width: 200,
      render: (_: any, __: any, index: number) => (
        <Select
          style={{ width: '100%' }}
          value={items[index].productId}
          onChange={(value) => updateItem(index, 'productId', value)}
          options={productOptions}
          placeholder="选择产品"
        />
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (_: any, __: any, index: number) => (
        <InputNumber
          min={1}
          value={items[index].quantity}
          onChange={(value) => updateItem(index, 'quantity', value || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '单价 (元)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (_: any, __: any, index: number) => (
        <InputNumber
          min={0}
          precision={2}
          value={items[index].unitPrice}
          onChange={(value) => updateItem(index, 'unitPrice', value || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '金额 (元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (_: any, __: any, index: number) => `¥${items[index].amount.toLocaleString()}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Button
          type="link"
          danger
          icon={<MinusCircleOutlined />}
          onClick={() => removeItem(index)}
        >
          删除
        </Button>
      ),
    },
  ]

  const onFinish = async (values: any) => {
    if (items.length === 0) {
      message.error('请至少添加一个产品')
      return
    }

    setSubmitting(true)
    try {
      const data = {
        supplierId: values.supplierId,
        items,
        remark: values.remark,
      }
      await purchaseApi.create(data)
      message.success('采购订单创建成功')
      navigate('/purchase')
    } catch (error) {
      message.error('创建失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>新建采购订单</h1>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="供应商"
            name="supplierId"
            rules={[{ required: true, message: '请选择供应商' }]}
          >
            <Select options={supplierOptions} placeholder="选择供应商" style={{ width: 300 }} />
          </Form.Item>

          <Form.Item label="产品明细">
            <Table
              columns={itemColumns}
              dataSource={items.map((item, index) => ({ ...item, key: index }))}
              pagination={false}
              footer={() => (
                <Button type="dashed" onClick={addItem} block icon={<PlusOutlined />}>
                  添加产品
                </Button>
              )}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: 16, fontSize: 16 }}>
            <strong>总计：¥{totalAmount.toLocaleString()}</strong>
          </div>

          <Form.Item label="备注" name="remark">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button onClick={() => navigate('/purchase')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
