import React, { useState } from 'react'
import { Form, Input, Button, Select, message, Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/api'

/**
 * 客户录入页面
 * 支持业务员自主录入客户，自动查重
 */
const CustomerCreate: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [duplicateCheck, setDuplicateCheck] = useState<{
    isDuplicate: boolean
    existingCustomers: any[]
  }>({ isDuplicate: false, existingCustomers: [] })

  /**
   * 查重 - 检查手机号或邮箱是否已存在
   */
  const checkDuplicate = async (phone: string, email?: string) => {
    if ((!phone || phone.length < 11) && !email) {
      setDuplicateCheck({ isDuplicate: false, existingCustomers: [] })
      return
    }

    try {
      const response = await apiClient.get('/customers/duplicate-check', {
        params: { phone, email },
      })
      setDuplicateCheck(response.data)
    } catch (error) {
      console.error('查重失败', error)
    }
  }

  /**
   * 提交表单
   */
  const handleSubmit = async (values: any) => {
    if (duplicateCheck.isDuplicate) {
      message.warning('该客户已存在，请确认是否继续提交')
      return
    }

    setLoading(true)
    try {
      await apiClient.post('/customers', values)
      message.success('客户创建成功')
      navigate('/crm/customers')
      form.resetFields()
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <Card title="录入客户">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="客户类型"
            rules={[{ required: true, message: '请选择客户类型' }]}
            initialValue="company"
          >
            <Select placeholder="请选择客户类型">
              <Select.Option value="company">企业</Select.Option>
              <Select.Option value="individual">个人</Select.Option>
              <Select.Option value="government">政府</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="industry" label="行业">
            <Select placeholder="请选择行业">
              <Select.Option value="景区">景区</Select.Option>
              <Select.Option value="酒店">酒店</Select.Option>
              <Select.Option value="房地产">房地产</Select.Option>
              <Select.Option value="工厂">工厂</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="contactPerson"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>

          <Form.Item
            name="contactPhone"
            label="联系电话"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input
              placeholder="请输入联系电话"
              maxLength={11}
              onBlur={(e) => checkDuplicate(e.target.value, form.getFieldValue('contactEmail'))}
            />
          </Form.Item>

          <Form.Item
            name="contactEmail"
            label="联系邮箱"
            rules={[{ type: 'email', message: '邮箱格式不正确' }]}
          >
            <Input
              placeholder="请输入联系邮箱"
              onBlur={(e) => checkDuplicate(form.getFieldValue('contactPhone'), e.target.value)}
            />
          </Form.Item>

          {/* 查重提示 */}
          {duplicateCheck.isDuplicate && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">⚠️ 发现重复客户</p>
              <p className="text-yellow-600 text-sm mt-1">
                该联系方式已存在 {duplicateCheck.existingCustomers.length} 个客户
              </p>
              <div className="mt-2 space-y-1">
                {duplicateCheck.existingCustomers.map((customer: any) => (
                  <p key={customer.id} className="text-yellow-600 text-sm">
                    - {customer.name} ({customer.contactPhone}) - {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                ))}
              </div>
            </div>
          )}

          <Form.Item name="province" label="省份">
            <Input placeholder="请输入省份" />
          </Form.Item>

          <Form.Item name="city" label="城市">
            <Input placeholder="请输入城市" />
          </Form.Item>

          <Form.Item name="address" label="详细地址">
            <Input.TextArea rows={3} placeholder="请输入详细地址" />
          </Form.Item>

          <Form.Item
            name="level"
            label="客户等级"
            initialValue="C"
          >
            <Select placeholder="请选择客户等级">
              <Select.Option value="A">A 级 (高意向)</Select.Option>
              <Select.Option value="B">B 级 (中意向)</Select.Option>
              <Select.Option value="C">C 级 (低意向)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex gap-2">
              <Button type="primary" htmlType="submit" loading={loading} block>
                提交
              </Button>
              <Button onClick={() => navigate('/crm/customers')}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default CustomerCreate
