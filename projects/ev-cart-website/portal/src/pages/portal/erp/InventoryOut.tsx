import { useState } from 'react'
import { Card, Form, Input, InputNumber, Button, Select, message, Radio } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import request from '@/shared/utils/request'

const { TextArea } = Input

// 模拟产品数据
const productOptions = [
  { value: 'p1', label: '钢材 A 型 (SKU001) - 库存：500 吨' },
  { value: 'p2', label: '钢材 B 型 (SKU002) - 库存：80 吨' },
  { value: 'p3', label: '电子元件 A (SKU003) - 库存：2000 个' },
  { value: 'p4', label: '电子元件 B (SKU004) - 库存：1500 个' },
  { value: 'p5', label: '机械零件 C (SKU005) - 库存：300 件' },
]

const reasonOptions = [
  { value: 'production', label: '生产领料' },
  { value: 'sales', label: '销售出库' },
  { value: 'return', label: '退货出库' },
  { value: 'damage', label: '报损出库' },
  { value: 'other', label: '其他' },
]

// 模拟 API 调用
const inventoryApi = {
  out: async (data: any) => {
    // TODO: 实际 API 调用
    return { success: true }
  },
}

export default function InventoryOut() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const onFinish = async (values: any) => {
    setSubmitting(true)
    try {
      const data = {
        productId: values.productId,
        quantity: values.quantity,
        reason: values.reason,
        targetLocation: values.targetLocation,
        remark: values.remark,
      }
      await inventoryApi.out(data)
      message.success('出库成功')
      navigate('/inventory')
    } catch (error) {
      message.error('出库失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/inventory')}>
          返回列表
        </Button>
      </div>

      <h1 style={{ marginBottom: 16 }}>出库管理</h1>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="产品"
            name="productId"
            rules={[{ required: true, message: '请选择产品' }]}
          >
            <Select options={productOptions} placeholder="选择产品" style={{ width: 400 }} />
          </Form.Item>

          <Form.Item
            label="出库数量"
            name="quantity"
            rules={[{ required: true, message: '请输入数量' }]}
          >
            <InputNumber min={1} style={{ width: 200 }} placeholder="请输入数量" />
          </Form.Item>

          <Form.Item
            label="出库原因"
            name="reason"
            rules={[{ required: true, message: '请选择原因' }]}
          >
            <Radio.Group options={reasonOptions} />
          </Form.Item>

          <Form.Item label="目标位置" name="targetLocation">
            <Input style={{ width: 300 }} placeholder="例如：生产车间 A 区" />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              确认出库
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
