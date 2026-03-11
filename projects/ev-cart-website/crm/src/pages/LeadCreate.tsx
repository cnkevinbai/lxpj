import React, { useState } from 'react'
import { Form, Input, Button, Select, message, Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/api'

/**
 * 线索录入页面
 * 支持业务员自主录入线索，自动查重
 */
const LeadCreate: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [duplicateCheck, setDuplicateCheck] = useState<{
    isDuplicate: boolean
    existingLeads: any[]
  }>({ isDuplicate: false, existingLeads: [] })

  /**
   * 查重 - 检查手机号是否已存在
   */
  const checkDuplicate = async (phone: string) => {
    if (!phone || phone.length < 11) {
      setDuplicateCheck({ isDuplicate: false, existingLeads: [] })
      return
    }

    try {
      const response = await apiClient.get('/leads/duplicate-check', {
        params: { phone },
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
      message.warning('该手机号已存在线索，请确认是否继续提交')
      return
    }

    setLoading(true)
    try {
      await apiClient.post('/leads', values)
      message.success('线索创建成功')
      navigate('/crm/leads')
      form.resetFields()
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <Card title="录入线索">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入客户姓名" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input
              placeholder="请输入手机号"
              maxLength={11}
              onBlur={(e) => checkDuplicate(e.target.value)}
            />
          </Form.Item>

          {/* 查重提示 */}
          {duplicateCheck.isDuplicate && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">⚠️ 发现重复线索</p>
              <p className="text-yellow-600 text-sm mt-1">
                该手机号已存在 {duplicateCheck.existingLeads.length} 条线索
              </p>
              <div className="mt-2 space-y-1">
                {duplicateCheck.existingLeads.map((lead: any) => (
                  <p key={lead.id} className="text-yellow-600 text-sm">
                    - {lead.name} ({lead.status}) - {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                ))}
              </div>
            </div>
          )}

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '邮箱格式不正确' }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item name="company" label="公司">
            <Input placeholder="请输入公司名称" />
          </Form.Item>

          <Form.Item
            name="productInterest"
            label="意向产品"
            rules={[{ required: true, message: '请选择意向产品' }]}
          >
            <Select placeholder="请选择意向产品">
              <Select.Option value="EC-11">EC-11 电动观光车</Select.Option>
              <Select.Option value="EC-14">EC-14 电动观光车</Select.Option>
              <Select.Option value="EC-23">EC-23 电动巴士</Select.Option>
              <Select.Option value="EP-2">EP-2 电动巡逻车</Select.Option>
              <Select.Option value="EF-1">EF-1 电动货车</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="budget" label="预算">
            <Select placeholder="请选择预算范围">
              <Select.Option value="0-5 万">0-5 万</Select.Option>
              <Select.Option value="5-10 万">5-10 万</Select.Option>
              <Select.Option value="10-20 万">10-20 万</Select.Option>
              <Select.Option value="20-50 万">20-50 万</Select.Option>
              <Select.Option value="50 万以上">50 万以上</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="source" label="来源" initialValue="manual">
            <Select placeholder="请选择来源">
              <Select.Option value="manual">手动录入</Select.Option>
              <Select.Option value="website">官网</Select.Option>
              <Select.Option value="exhibition">展会</Select.Option>
              <Select.Option value="referral">推荐</Select.Option>
              <Select.Option value="ad">广告</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>

          <Form.Item>
            <div className="flex gap-2">
              <Button type="primary" htmlType="submit" loading={loading} block>
                提交
              </Button>
              <Button onClick={() => navigate('/crm/leads')}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LeadCreate
