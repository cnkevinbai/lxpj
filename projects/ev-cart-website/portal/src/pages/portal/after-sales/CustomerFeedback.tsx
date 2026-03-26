import React, { useState } from 'react'
import { Card, Table, Tag, Space, Button, Modal, Form, Input, Rate, DatePicker, message, Statistic, Row, Col, Progress } from 'antd'
import { StarOutlined, SmileOutlined, MehOutlined, FrownOutlined } from '@ant-design/icons'

const { TextArea } = Input

interface Feedback {
  id: string
  orderNo: string
  customer: string
  serviceType: string
  rating: number
  content: string
  tags: string[]
  createTime: string
  status: string
}

const CustomerFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      orderNo: 'SV20260313001',
      customer: '某某物流公司',
      serviceType: '维修',
      rating: 5,
      content: '工程师很专业，问题解决得很及时，服务态度也很好！',
      tags: ['专业', '及时', '态度好'],
      createTime: '2026-03-13',
      status: 'processed',
    },
    {
      id: '2',
      orderNo: 'SV20260313002',
      customer: '某某科技公司',
      serviceType: '安装',
      rating: 4,
      content: '整体满意，就是响应速度可以再快一些',
      tags: ['满意', '待改进'],
      createTime: '2026-03-12',
      status: 'processed',
    },
    {
      id: '3',
      orderNo: 'SV20260313003',
      customer: '某某贸易公司',
      serviceType: '保养',
      rating: 3,
      content: '服务一般，工程师迟到了',
      tags: ['一般', '迟到'],
      createTime: '2026-03-11',
      status: 'pending',
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const ratingMap = {
    5: { icon: <SmileOutlined />, color: '#52c41a', label: '非常满意' },
    4: { icon: <SmileOutlined />, color: '#73d13d', label: '满意' },
    3: { icon: <MehOutlined />, color: '#faad14', label: '一般' },
    2: { icon: <FrownOutlined />, color: '#ff7875', label: '不满意' },
    1: { icon: <FrownOutlined />, color: '#ff4d4f', label: '非常不满意' },
  }

  const handleReply = async (values: any) => {
    message.success('回复成功')
    setModalVisible(false)
    form.resetFields()
  }

  const avgRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
  const satisfiedRate = feedbacks.filter(f => f.rating >= 4).length / feedbacks.length * 100

  const columns = [
    {
      title: '服务单号',
      dataIndex: 'orderNo',
      width: 150,
    },
    {
      title: '客户',
      dataIndex: 'customer',
      width: 150,
    },
    {
      title: '服务类型',
      dataIndex: 'serviceType',
      width: 90,
    },
    {
      title: '满意度',
      dataIndex: 'rating',
      width: 120,
      render: (rating: number) => {
        const { icon, color, label } = ratingMap[rating as keyof typeof ratingMap]
        return (
          <Tag color={color} icon={icon}>
            {label}
          </Tag>
        )
      },
    },
    {
      title: '评价内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <Space size={4}>
          {tags.map((tag) => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '评价时间',
      dataIndex: 'createTime',
      width: 110,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={status === 'processed' ? 'success' : 'warning'}>
          {status === 'processed' ? '已处理' : '待处理'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Feedback) => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          {record.status === 'pending' && <Button type="link" size="small">回复</Button>}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总评价数"
              value={feedbacks.length}
              suffix="条"
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均满意度"
              value={avgRating}
              precision={1}
              suffix="分"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="满意率"
              value={satisfiedRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="⭐ 客户评价管理">
        <Table
          columns={columns}
          dataSource={feedbacks}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="回复客户评价"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleReply}>
          <Form.Item
            name="reply"
            label="回复内容"
            rules={[{ required: true, message: '请输入回复内容' }]}
          >
            <TextArea rows={6} placeholder="请输入回复内容，感谢客户的评价..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CustomerFeedback
