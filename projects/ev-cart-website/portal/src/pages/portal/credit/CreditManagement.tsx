import React, { useState } from 'react'
import { Table, Card, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message, Statistic, Row, Col, Progress } from 'antd'
import { PlusOutlined, CreditCardOutlined, RiseOutlined } from '@ant-design/icons'

const { Option } = Select

interface CreditRecord {
  id: string
  customerName: string
  creditLimit: number
  usedAmount: number
  availableAmount: number
  creditLevel: string
  status: string
  reviewDate: string
}

const CreditManagement: React.FC = () => {
  const [credits, setCredits] = useState<CreditRecord[]>([
    {
      id: '1',
      customerName: '某某物流公司',
      creditLimit: 1000000,
      usedAmount: 350000,
      availableAmount: 650000,
      creditLevel: 'A',
      status: 'normal',
      reviewDate: '2026-06-30',
    },
    {
      id: '2',
      customerName: '某某科技公司',
      creditLimit: 500000,
      usedAmount: 480000,
      availableAmount: 20000,
      creditLevel: 'B',
      status: 'warning',
      reviewDate: '2026-04-30',
    },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const levelColors: Record<string, string> = {
    A: 'success',
    B: 'blue',
    C: 'warning',
    D: 'error',
  }

  const statusColors: Record<string, string> = {
    normal: 'success',
    warning: 'warning',
    frozen: 'error',
  }

  const handleCreate = async (values: any) => {
    message.success('设置成功')
    setModalVisible(false)
    form.resetFields()
  }

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 180,
    },
    {
      title: '信用等级',
      dataIndex: 'creditLevel',
      width: 100,
      render: (level: string) => (
        <Tag color={levelColors[level]}>{level}级</Tag>
      ),
    },
    {
      title: '信用额度',
      dataIndex: 'creditLimit',
      width: 120,
      render: (amount: number) => `¥${(amount / 10000).toFixed(0)}万`,
    },
    {
      title: '已用额度',
      dataIndex: 'usedAmount',
      width: 120,
      render: (amount: number) => `¥${(amount / 10000).toFixed(0)}万`,
    },
    {
      title: '可用额度',
      dataIndex: 'availableAmount',
      width: 120,
      render: (amount: number) => (
        <span style={{ color: amount < 50000 ? '#ff4d4f' : '#52c41a' }}>
          ¥${(amount / 10000).toFixed(1)}万
        </span>
      ),
    },
    {
      title: '使用率',
      key: 'usage',
      width: 150,
      render: (_: any, record: CreditRecord) => (
        <Progress
          percent={Math.round((record.usedAmount / record.creditLimit) * 100)}
          strokeColor={
            record.usedAmount / record.creditLimit > 0.8 ? '#ff4d4f' :
            record.usedAmount / record.creditLimit > 0.5 ? '#faad14' : '#52c41a'
          }
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={statusColors[status]}>
          {status === 'normal' ? '正常' : status === 'warning' ? '预警' : '冻结'}
        </Tag>
      ),
    },
    {
      title: '复审日期',
      dataIndex: 'reviewDate',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: CreditRecord) => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small">调整</Button>
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
              title="授信客户数"
              value={credits.length}
              suffix="个"
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总授信额度"
              value={credits.reduce((sum, c) => sum + c.creditLimit, 0)}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已用额度"
              value={credits.reduce((sum, c) => sum + c.usedAmount, 0)}
              precision={0}
              prefix={<RiseOutlined />}
              suffix="¥"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            设置授信
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={credits}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="设置客户授信"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="customerId"
              label="客户"
              rules={[{ required: true, message: '请选择客户' }]}
            >
              <Select placeholder="请选择客户">
                <Option value="C001">某某物流公司</Option>
                <Option value="C002">某某科技公司</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="creditLevel"
              label="信用等级"
              rules={[{ required: true, message: '请选择信用等级' }]}
            >
              <Select>
                <Option value="A">A 级 - 优秀</Option>
                <Option value="B">B 级 - 良好</Option>
                <Option value="C">C 级 - 一般</Option>
                <Option value="D">D 级 - 较差</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="creditLimit"
              label="信用额度"
              rules={[{ required: true, message: '请输入信用额度' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value?: string | number) => `¥${Number(value || 0).toLocaleString()}`}
                parser={(value?: string) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="validMonths"
              label="有效期 (月)"
              rules={[{ required: true, message: '请输入有效期' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={24}
                formatter={(value) => `${value}个月`}
                parser={(value) => Number(String(value || 0).replace(/个月/g, ''))}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CreditManagement
