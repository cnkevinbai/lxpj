import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Table, Statistic, Tag, Button, Space, Modal, Form, Input, InputNumber, DatePicker, Select, message } from 'antd'
import { PlusOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons'

const Finance: React.FC = () => {
  const [receivables, setReceivables] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [statistics, setStatistics] = useState<any>({})
  const [paymentVisible, setPaymentVisible] = useState(false)
  const [selectedReceivable, setSelectedReceivable] = useState<any>(null)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    pending: 'warning',
    partial: 'processing',
    paid: 'success',
    overdue: 'error',
  }

  const statusLabels: Record<string, string> = {
    pending: '待收款',
    partial: '部分收款',
    paid: '已收款',
    overdue: '已逾期',
  }

  // 获取应收账款列表
  const fetchReceivables = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/finance/receivables')
      const data = await response.json()
      setReceivables(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/v1/finance/statistics')
      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error('获取统计失败', error)
    }
  }

  useEffect(() => {
    fetchReceivables()
    fetchStatistics()
  }, [])

  // 记录收款
  const handlePayment = async (values: any) => {
    try {
      await fetch('/api/v1/finance/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      message.success('收款成功')
      setPaymentVisible(false)
      form.resetFields()
      fetchReceivables()
      fetchStatistics()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns = [
    {
      title: '应收单号',
      dataIndex: 'receivableCode',
      key: 'receivableCode',
      width: 150,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
    },
    {
      title: '订单编号',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 120,
    },
    {
      title: '应收金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '已收金额',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      width: 120,
      render: (amount: number) => <span style={{ color: '#52c41a' }}>¥{amount.toLocaleString()}</span>,
    },
    {
      title: '未收金额',
      key: 'balance',
      width: 120,
      render: (_: any, record: any) => (
        <span style={{ color: record.balance > 0 ? '#ff4d4f' : '#52c41a' }}>
          ¥{record.balance.toLocaleString()}
        </span>
      ),
    },
    {
      title: '到期日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status] || status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Button
          type="link"
          size="small"
          disabled={record.status === 'paid'}
          onClick={() => {
            setSelectedReceivable(record)
            setPaymentVisible(true)
          }}
        >
          收款
        </Button>
      ),
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="应收账款总额"
              value={statistics.totalAmount || 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已收款金额"
              value={statistics.paidAmount || 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待收款笔数"
              value={statistics.pendingReceivables || 0}
              suffix="笔"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="回款率"
              value={statistics.collectionRate || 0}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 应收账款列表 */}
      <Card
        title="应收账款"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            创建应收单
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={receivables}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 收款弹窗 */}
      <Modal
        title="记录收款"
        open={paymentVisible}
        onCancel={() => setPaymentVisible(false)}
        onOk={() => form.submit()}
      >
        {selectedReceivable && (
          <Form form={form} layout="vertical" onFinish={handlePayment}>
            <Form.Item label="应收单号">
              <Input value={selectedReceivable.receivableCode} disabled />
            </Form.Item>
            <Form.Item label="客户名称">
              <Input value={selectedReceivable.customerName} disabled />
            </Form.Item>
            <Form.Item label="未收金额">
              <Input value={`¥${selectedReceivable.balance.toLocaleString()}`} disabled />
            </Form.Item>
            <Form.Item
              name="receivableId"
              initialValue={selectedReceivable.id}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="amount"
              label="收款金额"
              rules={[{ required: true, message: '请输入收款金额' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                prefix="¥"
                max={selectedReceivable.balance}
              />
            </Form.Item>
            <Form.Item
              name="paymentMethod"
              label="收款方式"
              rules={[{ required: true, message: '请选择收款方式' }]}
            >
              <Select>
                <Select.Option value="bank_transfer">银行转账</Select.Option>
                <Select.Option value="cash">现金</Select.Option>
                <Select.Option value="check">支票</Select.Option>
                <Select.Option value="wechat">微信</Select.Option>
                <Select.Option value="alipay">支付宝</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="paymentDate"
              label="收款日期"
              rules={[{ required: true, message: '请选择收款日期' }]}
              initialValue={new Date().toISOString().split('T')[0]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="notes"
              label="备注"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}

export default Finance
