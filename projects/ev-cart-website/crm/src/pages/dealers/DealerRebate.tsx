import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message, Card, Statistic, Row, Col } from 'antd'
import { PlusOutlined, DollarOutlined, CheckOutlined, CloseOutlined, CalculatorOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Rebate {
  id: string
  dealerId: string
  dealer: {
    id: string
    companyName: string
    dealerCode: string
  }
  rebateType: string
  period: string
  amount: number
  basisAmount: number
  rebateRate: number
  status: string
  paymentMethod: string
  paidAt: string
  createdByName: string
  createdAt: string
}

const DealerRebate: React.FC = () => {
  const [rebates, setRebates] = useState<Rebate[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [createVisible, setCreateVisible] = useState(false)
  const [payVisible, setPayVisible] = useState(false)
  const [selectedRebate, setSelectedRebate] = useState<Rebate | null>(null)
  const [form] = Form.useForm()
  const [payForm] = Form.useForm()
  const [statistics, setStatistics] = useState<any>({})

  const typeLabels: Record<string, string> = {
    sales: '销售返利',
    growth: '增长返利',
    market: '市场返利',
    special: '专项返利',
  }

  const statusColors: Record<string, string> = {
    pending: 'default',
    approved: 'processing',
    paid: 'success',
    cancelled: 'error',
  }

  const statusLabels: Record<string, string> = {
    pending: '待处理',
    approved: '已审批',
    paid: '已发放',
    cancelled: '已取消',
  }

  // 获取返利列表
  const fetchRebates = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      const response = await fetch(`/api/v1/dealer-rebates?${params}`)
      const data = await response.json()
      setRebates(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      message.error('加载返利列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/v1/dealer-rebates/statistics')
      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error('获取统计数据失败', error)
    }
  }

  useEffect(() => {
    fetchRebates()
    fetchStatistics()
  }, [page, limit])

  // 创建返利
  const handleCreate = async (values: any) => {
    try {
      await fetch('/api/v1/dealer-rebates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      message.success('创建返利成功')
      setCreateVisible(false)
      form.resetFields()
      fetchRebates()
    } catch (error) {
      message.error('创建返利失败')
    }
  }

  // 审批返利
  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/v1/dealer-rebates/${id}/approve`, { method: 'POST' })
      message.success('审批通过')
      fetchRebates()
    } catch (error) {
      message.error('审批失败')
    }
  }

  // 发放返利
  const handlePay = async (values: any) => {
    try {
      await fetch(`/api/v1/dealer-rebates/${selectedRebate?.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      message.success('返利发放成功')
      setPayVisible(false)
      payForm.resetFields()
      fetchRebates()
    } catch (error) {
      message.error('发放失败')
    }
  }

  // 取消返利
  const handleCancel = async (id: string) => {
    try {
      await fetch(`/api/v1/dealer-rebates/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: '取消返利' }),
      })
      message.success('已取消')
      fetchRebates()
    } catch (error) {
      message.error('取消失败')
    }
  }

  // 自动计算返利
  const handleCalculate = async () => {
    try {
      const currentQuarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`
      const year = new Date().getFullYear()
      await fetch('/api/v1/dealer-rebates/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period: `${year}-${currentQuarter}`,
          rebateType: 'sales',
        }),
      })
      message.success('自动计算成功')
      fetchRebates()
    } catch (error) {
      message.error('计算失败')
    }
  }

  const columns: ColumnsType<Rebate> = [
    {
      title: '经销商',
      key: 'dealer',
      width: 200,
      render: (_, record) => (
        <div>
          <strong>{record.dealer?.companyName}</strong>
          <br />
          <small style={{ color: '#999' }}>{record.dealer?.dealerCode}</small>
        </div>
      ),
    },
    {
      title: '返利类型',
      dataIndex: 'rebateType',
      key: 'rebateType',
      width: 120,
      render: (type) => typeLabels[type] || type,
    },
    {
      title: '期间',
      dataIndex: 'period',
      key: 'period',
      width: 100,
    },
    {
      title: '返利金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => (
        <strong style={{ color: '#52c41a', fontSize: 16 }}>¥{amount?.toLocaleString()}</strong>
      ),
    },
    {
      title: '计算基数',
      dataIndex: 'basisAmount',
      key: 'basisAmount',
      width: 120,
      render: (amount) => `¥${amount?.toLocaleString()}`,
    },
    {
      title: '返点比例',
      dataIndex: 'rebateRate',
      key: 'rebateRate',
      width: 100,
      render: (rate) => `${(rate * 100).toFixed(2)}%`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: '发放时间',
      dataIndex: 'paidAt',
      key: 'paidAt',
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: '创建人',
      dataIndex: 'createdByName',
      key: 'createdByName',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                审批
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleCancel(record.id)}
              >
                取消
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Button
              type="link"
              size="small"
              icon={<DollarOutlined />}
              onClick={() => {
                setSelectedRebate(record)
                setPayVisible(true)
              }}
            >
              发放
            </Button>
          )}
          {record.status === 'paid' && (
            <Tag color="success">已发放</Tag>
          )}
        </Space>
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
              title="返利总额"
              value={statistics.totalAmount?.toLocaleString() || 0}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已发放"
              value={statistics.paidAmount?.toLocaleString() || 0}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待发放"
              value={statistics.pendingAmount?.toLocaleString() || 0}
              prefix="¥"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="返利笔数"
              value={statistics.total || 0}
              suffix="笔"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateVisible(true)}
          >
            创建返利
          </Button>
          <Button
            icon={<CalculatorOutlined />}
            onClick={handleCalculate}
          >
            自动计算
          </Button>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={rebates}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPage(page)
            setLimit(pageSize || 20)
          },
        }}
        scroll={{ x: 1200 }}
      />

      {/* 创建返利弹窗 */}
      <Modal
        title="创建返利"
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="dealerId"
            label="经销商"
            rules={[{ required: true, message: '请选择经销商' }]}
          >
            <Select placeholder="选择经销商">
              {rebates.map((r) => (
                <Select.Option key={r.dealer.id} value={r.dealer.id}>
                  {r.dealer.companyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="rebateType"
            label="返利类型"
            rules={[{ required: true, message: '请选择返利类型' }]}
          >
            <Select>
              <Select.Option value="sales">销售返利</Select.Option>
              <Select.Option value="growth">增长返利</Select.Option>
              <Select.Option value="market">市场返利</Select.Option>
              <Select.Option value="special">专项返利</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="period"
            label="返利期间"
            rules={[{ required: true, message: '请输入返利期间' }]}
          >
            <Input placeholder="如：2026-Q1" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="返利金额"
            rules={[{ required: true, message: '请输入返利金额' }]}
          >
            <InputNumber style={{ width: '100%' }} prefix="¥" />
          </Form.Item>
          <Form.Item
            name="basisAmount"
            label="计算基数"
          >
            <InputNumber style={{ width: '100%' }} prefix="¥" />
          </Form.Item>
          <Form.Item
            name="rebateRate"
            label="返点比例"
          >
            <InputNumber style={{ width: '100%' }} min={0} max={1} step={0.0001} />
          </Form.Item>
          <Form.Item
            name="notes"
            label="备注"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 发放返利弹窗 */}
      <Modal
        title="发放返利"
        open={payVisible}
        onCancel={() => setPayVisible(false)}
        onOk={() => payForm.submit()}
      >
        {selectedRebate && (
          <div>
            <p><strong>经销商:</strong> {selectedRebate.dealer?.companyName}</p>
            <p><strong>返利类型:</strong> {typeLabels[selectedRebate.rebateType]}</p>
            <p><strong>返利金额:</strong> <strong style={{ color: '#52c41a', fontSize: 18 }}>¥{selectedRebate.amount?.toLocaleString()}</strong></p>
            
            <Form form={payForm} layout="vertical" onFinish={handlePay}>
              <Form.Item
                name="paymentMethod"
                label="支付方式"
                rules={[{ required: true, message: '请选择支付方式' }]}
              >
                <Select>
                  <Select.Option value="bank_transfer">银行转账</Select.Option>
                  <Select.Option value="check">支票</Select.Option>
                  <Select.Option value="credit_note">信用凭证</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="paymentRef"
                label="支付参考号"
              >
                <Input placeholder="如：转账单号" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DealerRebate
