import React, { useState } from 'react'
import { Form, Input, Button, Upload, message, Divider, Space } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const CompanySettings: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // TODO: 调用 API
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('保存成功')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>公司设置</h2>
      <p style={{ color: '#999', marginBottom: 24 }}>配置公司基本信息和品牌形象</p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          companyName: '道达智能',
          companyCode: 'DDZN',
          address: '四川省眉山市',
          phone: '028-12345678',
          email: 'contact@evcart.com',
          website: 'https://www.evcart.com',
          description: '专注于新能源汽车智能换电技术',
        }}
      >
        <Divider orientation="left">基本信息</Divider>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="companyName"
            label="公司名称"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="请输入公司名称" />
          </Form.Item>

          <Form.Item
            name="companyCode"
            label="公司编码"
            rules={[{ required: true, message: '请输入公司编码' }]}
          >
            <Input placeholder="请输入公司编码" />
          </Form.Item>

          <Form.Item
            name="address"
            label="公司地址"
            rules={[{ required: true, message: '请输入公司地址' }]}
          >
            <Input placeholder="请输入公司地址" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="email"
            label="联系邮箱"
            rules={[
              { required: true, message: '请输入联系邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入联系邮箱" />
          </Form.Item>

          <Form.Item
            name="website"
            label="公司网站"
          >
            <Input placeholder="请输入公司网站" />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="公司简介"
        >
          <Input.TextArea rows={4} placeholder="请输入公司简介" />
        </Form.Item>

        <Divider orientation="left">品牌标识</Divider>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ marginBottom: 8 }}>公司 Logo</div>
            <Upload>
              <Button icon={<UploadOutlined />}>上传 Logo</Button>
            </Upload>
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>公司印章</div>
            <Upload>
              <Button icon={<UploadOutlined />}>上传印章</Button>
            </Upload>
          </div>
        </div>

        <Divider />

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CompanySettings
