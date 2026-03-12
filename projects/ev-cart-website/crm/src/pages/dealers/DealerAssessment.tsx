import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message, Card, Progress, Rate } from 'antd'
import { PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined, CalculatorOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Assessment {
  id: string
  dealerId: string
  dealer: {
    id: string
    companyName: string
    dealerCode: string
  }
  period: string
  periodType: string
  totalScore: number
  grade: string
  status: string
  salesTarget: number
  salesActual: number
  targetAchievementRate: number
  customerSatisfaction: number
  complianceScore: number
  assessedByName: string
  createdAt: string
}

const DealerAssessment: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [createVisible, setCreateVisible] = useState(false)
  const [approveVisible, setApproveVisible] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [form] = Form.useForm()
  const [approveForm] = Form.useForm()

  const gradeColors: Record<string, string> = {
    S: 'red',
    A: 'gold',
    B: 'blue',
    C: 'orange',
    D: 'red',
  }

  const statusColors: Record<string, string> = {
    draft: 'default',
    submitted: 'processing',
    approved: 'success',
    rejected: 'error',
  }

  const statusLabels: Record<string, string> = {
    draft: '草稿',
    submitted: '已提交',
    approved: '已通过',
    rejected: '已拒绝',
  }

  // 获取考核列表
  const fetchAssessments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      const response = await fetch(`/api/v1/dealer-assessments?${params}`)
      const data = await response.json()
      setAssessments(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      message.error('加载考核列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssessments()
  }, [page, limit])

  // 创建考核
  const handleCreate = async (values: any) => {
    try {
      await fetch('/api/v1/dealer-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      message.success('创建考核成功')
      setCreateVisible(false)
      form.resetFields()
      fetchAssessments()
    } catch (error) {
      message.error('创建考核失败')
    }
  }

  // 提交考核
  const handleSubmit = async (id: string) => {
    try {
      await fetch(`/api/v1/dealer-assessments/${id}/submit`, { method: 'POST' })
      message.success('提交成功')
      fetchAssessments()
    } catch (error) {
      message.error('提交失败')
    }
  }

  // 审批考核
  const handleApprove = async (values: any) => {
    try {
      await fetch(`/api/v1/dealer-assessments/${selectedAssessment?.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      message.success('审批通过')
      setApproveVisible(false)
      approveForm.resetFields()
      fetchAssessments()
    } catch (error) {
      message.error('审批失败')
    }
  }

  // 拒绝考核
  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/v1/dealer-assessments/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: '考核不通过' }),
      })
      message.success('已拒绝')
      fetchAssessments()
    } catch (error) {
      message.error('拒绝失败')
    }
  }

  // 自动计算考核
  const handleCalculate = async () => {
    try {
      const currentQuarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`
      const year = new Date().getFullYear()
      await fetch('/api/v1/dealer-assessments/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period: `${year}-${currentQuarter}`,
          periodType: 'quarterly',
        }),
      })
      message.success('自动计算成功')
      fetchAssessments()
    } catch (error) {
      message.error('计算失败')
    }
  }

  const columns: ColumnsType<Assessment> = [
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
      title: '考核期间',
      dataIndex: 'period',
      key: 'period',
      width: 120,
    },
    {
      title: '周期类型',
      dataIndex: 'periodType',
      key: 'periodType',
      width: 100,
      render: (type) => ({
        monthly: '月度',
        quarterly: '季度',
        yearly: '年度',
      }[type] || type),
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 100,
      render: (score) => (
        <div>
          <Progress
            type="circle"
            percent={score}
            size={40}
            strokeColor={score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f'}
            format={(percent) => percent?.toFixed(0)}
          />
        </div>
      ),
    },
    {
      title: '等级',
      dataIndex: 'grade',
      key: 'grade',
      width: 80,
      render: (grade) => (
        <Tag color={gradeColors[grade]} style={{ fontSize: 16, padding: '4px 12px' }}>{grade}</Tag>
      ),
    },
    {
      title: '目标达成率',
      dataIndex: 'targetAchievementRate',
      key: 'targetAchievementRate',
      width: 120,
      render: (rate) => (
        <span style={{ color: rate >= 100 ? '#52c41a' : '#ff4d4f' }}>
          {rate?.toFixed(1)}%
        </span>
      ),
    },
    {
      title: '客户满意度',
      dataIndex: 'customerSatisfaction',
      key: 'customerSatisfaction',
      width: 100,
      render: (score) => score ? <Rate disabled defaultValue={score / 20} /> : '-',
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
      title: '考核人',
      dataIndex: 'assessedByName',
      key: 'assessedByName',
      width: 100,
    },
    {
      title: '考核日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'draft' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleSubmit(record.id)}
              >
                提交
              </Button>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
              >
                编辑
              </Button>
            </>
          )}
          {record.status === 'submitted' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => {
                  setSelectedAssessment(record)
                  setApproveVisible(true)
                }}
              >
                审批
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
              >
                拒绝
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Tag color="success">已通过</Tag>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateVisible(true)}
          >
            创建考核
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
        dataSource={assessments}
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

      {/* 创建考核弹窗 */}
      <Modal
        title="创建考核"
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
              {assessments.map((a) => (
                <Select.Option key={a.dealer.id} value={a.dealer.id}>
                  {a.dealer.companyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="period"
            label="考核期间"
            rules={[{ required: true, message: '请输入考核期间' }]}
          >
            <Input placeholder="如：2026-Q1" />
          </Form.Item>
          <Form.Item
            name="periodType"
            label="周期类型"
            rules={[{ required: true, message: '请选择周期类型' }]}
          >
            <Select>
              <Select.Option value="monthly">月度</Select.Option>
              <Select.Option value="quarterly">季度</Select.Option>
              <Select.Option value="yearly">年度</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="salesTarget"
            label="销售目标"
          >
            <InputNumber style={{ width: '100%' }} prefix="¥" />
          </Form.Item>
          <Form.Item
            name="salesActual"
            label="实际销售"
          >
            <InputNumber style={{ width: '100%' }} prefix="¥" />
          </Form.Item>
          <Form.Item
            name="customerSatisfaction"
            label="客户满意度"
          >
            <InputNumber min={0} max={100} suffix="分" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="complianceScore"
            label="合规分数"
          >
            <InputNumber min={0} max={100} suffix="分" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 审批考核弹窗 */}
      <Modal
        title="审批考核"
        open={approveVisible}
        onCancel={() => setApproveVisible(false)}
        onOk={() => approveForm.submit()}
      >
        {selectedAssessment && (
          <div>
            <p><strong>经销商:</strong> {selectedAssessment.dealer?.companyName}</p>
            <p><strong>考核期间:</strong> {selectedAssessment.period}</p>
            <p><strong>总分:</strong> {selectedAssessment.totalScore?.toFixed(1)}分</p>
            <p><strong>等级:</strong> <Tag color={gradeColors[selectedAssessment.grade]}>{selectedAssessment.grade}</Tag></p>
            <p><strong>目标达成率:</strong> {selectedAssessment.targetAchievementRate?.toFixed(1)}%</p>
            
            <Form form={approveForm} layout="vertical" onFinish={handleApprove}>
              <Form.Item
                name="comments"
                label="审批意见"
              >
                <Input.TextArea rows={4} placeholder="请输入审批意见" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DealerAssessment
