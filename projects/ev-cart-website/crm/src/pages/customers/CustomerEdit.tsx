import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, Select, Button, Card, message, Space, Divider, Row, Col, Spin, Alert, Radio } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input

interface Customer {
  id: string
  customerCode: string
  customerName: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  province: string
  city: string
  address: string
  level: string
  status: string
  industry: string
  source: string
  notes: string
}

const CustomerEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [customer, setCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const fetchCustomer = async () => {
    setFetchLoading(true)
    try {
      // TODO: 调用 API
      // const response = await fetch(`/api/v1/customers/${id}`)
      // const data = await response.json()
      
      // Mock data
      const mockData: Customer = {
        id: id || '1',
        customerCode: 'C001',
        customerName: '某某公司',
        contactPerson: '李四',
        contactPhone: '13800138000',
        contactEmail: 'lisi@example.com',
        province: '北京',
        city: '北京',
        address: '北京市朝阳区 xxx 路 xxx 号',
        level: 'A',
        status: 'active',
        industry: '新能源汽车',
        source: '线上咨询',
        notes: '重要客户，需重点维护',
      }
      
      setCustomer(mockData)
      form.setFieldsValue(mockData)
    } catch (error) {
      message.error('加载客户信息失败')
    } finally {
      setFetchLoading(false)
    }
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success('更新客户成功')
        navigate('/customers')
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

  if (!customer) {
    return (
      <Alert
        message="客户不存在"
        description="该客户可能已被删除"
        type="error"
        showIcon
        action={<Button size="small" onClick={() => navigate('/customers')}>返回客户列表</Button>}
      />
    )
  }

  return (
    <div>
      <Card
        title="编辑客户"
        extra={
          <Space>
            <Button icon={<CloseOutlined />} onClick={() => navigate('/customers')}>
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
                name="customerCode"
                label="客户编码"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="客户名称"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="industry"
                label="所属行业"
                rules={[{ required: true, message: '请选择所属行业' }]}
              >
                <Select placeholder="请选择行业">
                  <Option value="新能源汽车">新能源汽车</Option>
                  <Option value="共享出行">共享出行</Option>
                  <Option value="物流配送">物流配送</Option>
                  <Option value="制造业">制造业</Option>
                  <Option value="零售业">零售业</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="source"
                label="客户来源"
                rules={[{ required: true, message: '请选择客户来源' }]}
              >
                <Select placeholder="请选择来源">
                  <Option value="线上咨询">线上咨询</Option>
                  <Option value="线下活动">线下活动</Option>
                  <Option value="客户推荐">客户推荐</Option>
                  <Option value="电话咨询">电话咨询</Option>
                  <Option value="展会">展会</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="level"
                label="客户等级"
                rules={[{ required: true, message: '请选择客户等级' }]}
              >
                <Select>
                  <Option value="A">A 类 - 重要</Option>
                  <Option value="B">B 类 - 一般</Option>
                  <Option value="C">C 类 - 普通</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="客户状态"
                rules={[{ required: true, message: '请选择客户状态' }]}
              >
                <Radio.Group>
                  <Radio value="active">活跃</Radio>
                  <Radio value="inactive">不活跃</Radio>
                  <Radio value="potential">潜在</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">联系信息</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="联系邮箱"
                rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
              >
                <Input placeholder="请输入邮箱地址" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">地址信息</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="province"
                label="省份"
                rules={[{ required: true, message: '请选择省份' }]}
              >
                <Select placeholder="请选择省份">
                  <Option value="北京">北京</Option>
                  <Option value="上海">上海</Option>
                  <Option value="广东">广东</Option>
                  <Option value="江苏">江苏</Option>
                  <Option value="浙江">浙江</Option>
                  <Option value="四川">四川</Option>
                  <Option value="湖北">湖北</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="city"
                label="城市"
                rules={[{ required: true, message: '请选择城市' }]}
              >
                <Select placeholder="请选择城市">
                  <Option value="北京">北京</Option>
                  <Option value="上海">上海</Option>
                  <Option value="广州">广州</Option>
                  <Option value="深圳">深圳</Option>
                  <Option value="杭州">杭州</Option>
                  <Option value="成都">成都</Option>
                  <Option value="武汉">武汉</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="address"
                label="详细地址"
                rules={[{ required: true, message: '请输入详细地址' }]}
              >
                <TextArea rows={2} placeholder="请输入详细街道地址" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">备注信息</Divider>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="notes" label="客户备注">
                <TextArea rows={4} placeholder="请输入客户备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default CustomerEdit
