import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, InputNumber, Select, Button, Card, message, Space, Divider, Row, Col } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select

const CreateJob: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success('发布职位成功')
        navigate('/jobs')
      } else {
        const error = await response.json()
        message.error(error.message || '发布失败')
      }
    } catch (error) {
      message.error('发布失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card
        title="发布新职位"
        extra={
          <Space>
            <Button icon={<CloseOutlined />} onClick={() => navigate('/jobs')}>
              取消
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={loading}
            >
              发布
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            jobType: 'full_time',
            status: 'draft',
          }}
        >
          <Divider orientation="left">基本信息</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="职位名称"
                rules={[{ required: true, message: '请输入职位名称' }]}
              >
                <Input placeholder="如：高级 Java 工程师" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <Select placeholder="请选择部门">
                  <Option value="技术部">技术部</Option>
                  <Option value="销售部">销售部</Option>
                  <Option value="市场部">市场部</Option>
                  <Option value="人力资源部">人力资源部</Option>
                  <Option value="财务部">财务部</Option>
                  <Option value="运营部">运营部</Option>
                  <Option value="产品部">产品部</Option>
                  <Option value="客服部">客服部</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="工作地点"
                rules={[{ required: true, message: '请输入工作地点' }]}
              >
                <Select placeholder="请选择工作地点">
                  <Option value="北京">北京</Option>
                  <Option value="上海">上海</Option>
                  <Option value="广州">广州</Option>
                  <Option value="深圳">深圳</Option>
                  <Option value="杭州">杭州</Option>
                  <Option value="成都">成都</Option>
                  <Option value="武汉">武汉</Option>
                  <Option value="西安">西安</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="jobType"
                label="职位类型"
                rules={[{ required: true, message: '请选择职位类型' }]}
              >
                <Select>
                  <Option value="full_time">全职</Option>
                  <Option value="part_time">兼职</Option>
                  <Option value="intern">实习</Option>
                  <Option value="contract">合同</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="experience"
                label="经验要求"
                rules={[{ required: true, message: '请选择经验要求' }]}
              >
                <Select placeholder="请选择">
                  <Option value="不限">不限</Option>
                  <Option value="应届生">应届生</Option>
                  <Option value="1-3 年">1-3 年</Option>
                  <Option value="3-5 年">3-5 年</Option>
                  <Option value="5-10 年">5-10 年</Option>
                  <Option value="10 年以上">10 年以上</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="education"
                label="学历要求"
                rules={[{ required: true, message: '请选择学历要求' }]}
              >
                <Select placeholder="请选择">
                  <Option value="不限">不限</Option>
                  <Option value="高中">高中</Option>
                  <Option value="大专">大专</Option>
                  <Option value="本科">本科</Option>
                  <Option value="硕士">硕士</Option>
                  <Option value="博士">博士</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="headcount"
                label="招聘人数"
                rules={[{ required: true, message: '请输入招聘人数' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} max={100} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">薪资福利</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="salaryMin"
                label="最低薪资"
                rules={[{ required: true, message: '请输入最低薪资' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  prefix="¥"
                  placeholder="请输入最低薪资"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salaryMax"
                label="最高薪资"
                rules={[{ required: true, message: '请输入最高薪资' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  prefix="¥"
                  placeholder="请输入最高薪资"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">职位描述</Divider>

          <Form.Item
            name="description"
            label="岗位职责"
            rules={[{ required: true, message: '请输入岗位职责' }]}
          >
            <TextArea rows={4} placeholder="请描述岗位的主要职责" />
          </Form.Item>

          <Form.Item
            name="requirements"
            label="任职要求"
            rules={[{ required: true, message: '请输入任职要求' }]}
          >
            <TextArea rows={4} placeholder="请描述任职要求" />
          </Form.Item>

          <Form.Item
            name="benefits"
            label="福利待遇"
          >
            <TextArea rows={3} placeholder="如：五险一金、带薪年假、定期体检等" />
          </Form.Item>

          <Divider orientation="left">发布设置</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="发布状态"
                rules={[{ required: true, message: '请选择发布状态' }]}
              >
                <Select>
                  <Option value="draft">草稿</Option>
                  <Option value="published">立即发布</Option>
                </Select>
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
                发布职位
              </Button>
              <Button
                htmlType="button"
                icon={<CloseOutlined />}
                onClick={() => navigate('/jobs')}
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

export default CreateJob
