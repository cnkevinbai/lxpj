import React, { useState } from 'react'
import { Card, Table, Tag, Space, Button, Modal, Form, Input, Select, DatePicker, message, Statistic, Row, Col, Progress } from 'antd'
import { BookOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input

interface Knowledge {
  id: string
  title: string
  category: string
  tags: string[]
  views: number
  helpful: number
  author: string
  updateTime: string
  status: string
}

const KnowledgeBase: React.FC = () => {
  const [knowledge, setKnowledge] = useState<Knowledge[]>([
    {
      id: '1',
      title: '智能换电柜常见故障排查指南',
      category: '产品知识',
      tags: ['换电柜', '故障排查', '维修'],
      views: 1280,
      helpful: 156,
      author: '技术部',
      updateTime: '2026-03-10',
      status: 'published',
    },
    {
      id: '2',
      title: '锂电池保养与维护手册',
      category: '产品知识',
      tags: ['电池', '保养', '维护'],
      views: 980,
      helpful: 128,
      author: '技术部',
      updateTime: '2026-03-08',
      status: 'published',
    },
    {
      id: '3',
      title: '售后服务标准流程',
      category: '服务规范',
      tags: ['售后', '流程', '标准'],
      views: 750,
      helpful: 95,
      author: '客服部',
      updateTime: '2026-03-05',
      status: 'published',
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const categoryColors: Record<string, string> = {
    '产品知识': 'blue',
    '服务规范': 'green',
    '技术文档': 'purple',
    '常见问题': 'orange',
    '培训资料': 'cyan',
  }

  const handleCreate = async (values: any) => {
    message.success('创建知识文档成功')
    setModalVisible(false)
    form.resetFields()
  }

  const totalDocs = knowledge.length
  const totalViews = knowledge.reduce((sum, k) => sum + k.views, 0)
  const totalHelpful = knowledge.reduce((sum, k) => sum + k.helpful, 0)

  const columns = [
    {
      title: '文档标题',
      dataIndex: 'title',
      width: 300,
      render: (title: string) => <span style={{ color: '#1890ff', cursor: 'pointer' }}>{title}</span>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 120,
      render: (category: string) => <Tag color={categoryColors[category]}>{category}</Tag>,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <Space size={4}>
          {tags.slice(0, 3).map((tag) => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      width: 100,
      sorter: (a: any, b: any) => a.views - b.views,
    },
    {
      title: '有帮助',
      dataIndex: 'helpful',
      width: 100,
      render: (helpful: number) => <span style={{ color: '#52c41a' }}>👍 {helpful}</span>,
    },
    {
      title: '作者',
      dataIndex: 'author',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Knowledge) => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">统计</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="知识文档总数"
              value={totalDocs}
              suffix="篇"
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总浏览量"
              value={totalViews}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总点赞数"
              value={totalHelpful}
              valueStyle={{ color: '#52c41a' }}
              prefix="👍"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月新增"
              value={12}
              suffix="篇"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="📚 知识库管理"
        extra={
          <Space>
            <Input.Search
              placeholder="搜索文档标题、标签"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
              新建文档
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={knowledge}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="新建知识文档"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="title"
              label="文档标题"
              rules={[{ required: true, message: '请输入文档标题' }]}
            >
              <Input placeholder="请输入文档标题" />
            </Form.Item>

            <Form.Item
              name="category"
              label="文档分类"
              rules={[{ required: true, message: '请选择文档分类' }]}
            >
              <Select placeholder="请选择分类">
                <Option value="产品知识">产品知识</Option>
                <Option value="服务规范">服务规范</Option>
                <Option value="技术文档">技术文档</Option>
                <Option value="常见问题">常见问题</Option>
                <Option value="培训资料">培训资料</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Select mode="tags" placeholder="请输入标签，回车确认" />
          </Form.Item>

          <Form.Item
            name="content"
            label="文档内容"
            rules={[{ required: true, message: '请输入文档内容' }]}
          >
            <TextArea rows={12} placeholder="请输入文档详细内容，支持 Markdown 格式" />
          </Form.Item>

          <Form.Item
            name="author"
            label="作者"
            rules={[{ required: true, message: '请输入作者' }]}
          >
            <Input placeholder="请输入作者" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default KnowledgeBase
