import { useState } from 'react'
import { Card, Form, Input, InputNumber, Button, Select, message, DatePicker } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import request from '@/shared/utils/request'

const { TextArea } = Input

// 模拟产品数据
const productOptions = [
  { value: 'p1', label: '钢材 A 型 (SKU001)' },
  { value: 'p2', label: '钢材 B 型 (SKU002)' },
  { value: 'p3', label: '电子元件 A (SKU003)' },
  { value: 'p4', label: '电子元件 B (SKU004)' },
  { value: 'p5', label: '机械零件 C (SKU005)' },
]

// 模拟供应商数据
const supplierOptions = [
  { value: 's1', label: '四川钢铁集团' },
  { value: 's2', label: '成都电子科技' },
  { value: 's3', label: '重庆机械制造' },
  { value: 's4', label: '绵阳材料供应' },
]

// 模拟库位数据
const locationOptions = [
  { value: 'A-01-01', label: 'A 区 -01-01' },
  { value: 'A-01-02', label: 'A 区 -01-02' },
  { value: 'B-02-01', label: 'B 区 -02-01' },
  { value: 'B-02-02', label: 'B 区 -02-02' },
  { value: 'C-03-01', label: 'C 区 -03-01' },
  { value: 'D-04-01', label: 'D 区 -04-01' },
]

export default function InventoryIn() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const onFinish = async (values: any) => {
    setSubmitting(true)
    try {
      const data = {
        productId: values.productId,
        quantity: values.quantity,
        batchNo: values.batchNo,
        supplierId: values.supplierId,
        location: values.location,
        productionDate: values.productionDate?.format('YYYY-MM-DD'),
        remark: values.remark,
      }
      await inventoryApi.in(data)
      message.success('入库成功')
      navigate('/inventory')
    } catch (error) {
      message.error('入库失败')
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

      <h1 style={{ marginBottom: 16 }}>入库管理</h1>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="产品"
            name="productId"
            rules={[{ required: true, message: '请选择产品' }]}
          >
            <Select options={productOptions} placeholder="选择产品" style={{ width: 300 }} />
          </Form.Item>

          <Form.Item
            label="入库数量"
            name="quantity"
            rules={[{ required: true, message: '请输入数量' }]}
          >
            <InputNumber min={1} style={{ width: 200 }} placeholder="请输入数量" />
          </Form.Item>

          <Form.Item
            label="批次号"
            name="batchNo"
            rules={[{ required: true, message: '请输入批次号' }]}
          >
            <Input style={{ width: 300 }} placeholder="例如：BATCH20260312001" />
          </Form.Item>

          <Form.Item
            label="供应商"
            name="supplierId"
            rules={[{ required: true, message: '请选择供应商' }]}
          >
            <Select options={supplierOptions} placeholder="选择供应商" style={{ width: 300 }} />
          </Form.Item>

          <Form.Item
            label="库位"
            name="location"
            rules={[{ required: true, message: '请选择库位' }]}
          >
            <Select options={locationOptions} placeholder="选择库位" style={{ width: 300 }} />
          </Form.Item>

          <Form.Item label="生产日期" name="productionDate">
            <DatePicker style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              确认入库
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
