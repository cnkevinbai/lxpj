import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, InputNumber, Select, Button, Card, message, Space, Divider, Row, Col, Spin, Alert } from 'antd'
import { SaveOutlined, CloseOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select

interface Job {
  id: string
  title: string
  department: string
  location: string
  jobType: string
  experience: string
  education: string
  salaryMin: number
  salaryMax: number
  description: string
  requirements: string
  benefits: string
  status: string
  openings: number
}

const EditJob: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [job, setJob] = useState<Job | null>(null)

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    setFetchLoading(true)
    try {
      // TODO: 调用 API
      // const response = await fetch(`/api/v1/jobs/${id}`)
      // const data = await response.json()
      
      // Mock data
      const mockData: Job = {
        id: id || '1',
        title: '高级 Java 工程师',
        department: '技术部',
        location: '北京',
        jobType: 'full_time',
        experience: '3-5 年',
        education: '本科',
        salaryMin: 20000,
        salaryMax: 35000,
        description: '负责公司核心产品的后端开发...',
        requirements: '1. 计算机相关专业本科及以上学历\n2. 3 年以上 Java 开发经验...',
        benefits: '五险一金、年终奖、带薪年假、定期体检',
        status: 'active',
        openings: 2,
      }
      
      setJob(mockData)
      form.setFieldsValue(mockData)
    } catch (error) {
      message.error('加载职位信息失败')
    } finally {
      setFetchLoading(false)
    }
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success('更新职位成功')
        navigate('/jobs')
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

  if (!job) {
    return (
      <Alert
        message="职位不存在"
        description="该职位可能已被删除"
        type="error"
        showIcon
        action={<Button size="small" onClick={() => navigate('/jobs')}>返回职位列表</Button>}
      />
    )
  }

  return (
    <div>
      <Card
        title="编辑职位"
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
                name="openings"
                label="招聘人数"
                rules={[{ required: true, message: '请输入招聘人数' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="salaryMin"
                label="最低薪资"
                rules={[{ required: true, message: '请输入最低薪资' }]}
              >
                <InputNumber
                  min={0}
                  formatter={(value) => `¥${Number(value).toLocaleString()}`}
                  parser={(value) => Number(value?.replace(/¥\s?|(,*)/g, ''))}
                  style={{ width: '100%' }}
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
                  min={0}
                  formatter={(value) => `¥${Number(value).toLocaleString()}`}
                  parser={(value) => Number(value?.replace(/¥\s?|(,*)/g, ''))}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="status"
                label="职位状态"
                rules={[{ required: true, message: '请选择职位状态' }]}
              >
                <Select>
                  <Option value="active">招聘中</Option>
                  <Option value="paused">暂停</Option>
                  <Option value="closed">已关闭</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">职位描述</Divider>

          <Form.Item
            name="description"
            label="职位描述"
            rules={[{ required: true, message: '请输入职位描述' }]}
          >
            <TextArea rows={4} placeholder="描述职位的主要工作内容..." />
          </Form.Item>

          <Form.Item
            name="requirements"
            label="任职要求"
            rules={[{ required: true, message: '请输入任职要求' }]}
          >
            <TextArea rows={6} placeholder="列出候选人的技能和经验要求..." />
          </Form.Item>

          <Form.Item
            name="benefits"
            label="福利待遇"
          >
            <TextArea rows={3} placeholder="如：五险一金、年终奖、带薪年假等" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default EditJob
