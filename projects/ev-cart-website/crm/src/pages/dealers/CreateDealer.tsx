import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, InputNumber, Select, Button, Card, message, Space, Divider, Row, Col } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select

interface CreateDealerFormData {
  companyName: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  province: string
  city: string
  address?: string
  latitude?: number
  longitude?: number
  level?: string
  authorizedArea?: string
  contractStart?: string
  contractEnd?: string
  salesTarget?: number
}

const CreateDealer: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const onFinish = async (values: CreateDealerFormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/dealers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success('创建经销商成功')
        navigate('/dealers')
      } else {
        const error = await response.json()
        message.error(error.message || '创建失败')
      }
    } catch (error) {
      message.error('创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    message.error('请检查必填项')
  }

  return (
    <div>
      <Card
        title="创建经销商"
        extra={
          <Space>
            <Button icon={<CloseOutlined />} onClick={() => navigate('/dealers')}>
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
          onFinishFailed={onFinishFailed}
          initialValues={{
            level: 'standard',
          }}
        >
          <Divider orientation="left">基本信息</Divider>

          <Form.Item
            name="companyName"
            label="公司名称"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="请输入公司全称" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人姓名' }]}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="联系邮箱"
                rules={[
                  { required: true, message: '请输入联系邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' },
                ]}
              >
                <Input placeholder="请输入邮箱地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="经销商等级"
                rules={[{ required: true, message: '请选择经销商等级' }]}
              >
                <Select>
                  <Option value="trial">试用经销商</Option>
                  <Option value="standard">标准经销商</Option>
                  <Option value="gold">金牌经销商</Option>
                  <Option value="platinum">白金经销商</Option>
                  <Option value="strategic">战略经销商</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">区域信息</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="province"
                label="省份"
                rules={[{ required: true, message: '请选择省份' }]}
              >
                <Select placeholder="请选择省份">
                  <Option value="广东">广东</Option>
                  <Option value="江苏">江苏</Option>
                  <Option value="浙江">浙江</Option>
                  <Option value="山东">山东</Option>
                  <Option value="四川">四川</Option>
                  <Option value="北京">北京</Option>
                  <Option value="上海">上海</Option>
                  <Option value="河北">河北</Option>
                  <Option value="河南">河南</Option>
                  <Option value="湖北">湖北</Option>
                  <Option value="湖南">湖南</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="city"
                label="城市"
                rules={[{ required: true, message: '请输入城市' }]}
              >
                <Input placeholder="请输入城市" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="详细地址"
          >
            <TextArea rows={3} placeholder="请输入详细地址" />
          </Form.Item>

          <Divider orientation="left">合同信息</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contractStart"
                label="合同开始日期"
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contractEnd"
                label="合同结束日期"
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="salesTarget"
                label="年度销售目标"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  prefix="¥"
                  placeholder="请输入销售目标"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                创建经销商
              </Button>
              <Button
                htmlType="button"
                icon={<CloseOutlined />}
                onClick={() => navigate('/dealers')}
                size="large"
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default CreateDealer
