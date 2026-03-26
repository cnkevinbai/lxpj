import React, { useState } from 'react'
import { Card, Row, Col, Table, Statistic, Tag, Space, Button, Badge, Avatar, Tabs, Progress, Alert } from 'antd'
import { ClockCircleOutlined, CheckCircleOutlined, UserOutlined, EyeOutlined, ThunderboltOutlined } from '@ant-design/icons'

const { TabPane } = Tabs

const WorkflowApproval: React.FC = () => {
  const [approvals] = useState([
    { id: '1', title: '采购订单 PO20260313001', type: '采购审批', applicant: '张三', amount: 158000, status: 'pending', currentStep: 1, totalSteps: 3 },
    { id: '2', title: '费用报销 - 差旅费', type: '费用报销', applicant: '李四', amount: 5800, status: 'pending', currentStep: 0, totalSteps: 2 },
  ])

  const statusColors: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    cancelled: 'default',
  }

  const columns = [
    { title: '审批主题', dataIndex: 'title', width: 280, render: (title: string, record: any) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
          <Space size={8}>
            <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>{record.applicant[0]}</Avatar>
          </Space>
        </div>
      ),
    },
    { title: '审批类型', dataIndex: 'type', width: 120 },
    { title: '金额', dataIndex: 'amount', width: 120, render: (amount: number) => <span style={{ color: '#ff4d4f', fontWeight: 600 }}>¥{(amount / 10000).toFixed(1)}万</span> },
    { title: '状态', dataIndex: 'status', width: 90, render: (status: string) => <Tag color={statusColors[status]}>{status}</Tag> },
    { title: '进度', key: 'progress', width: 180, render: (_: any, record: any) => (
        <Progress percent={(record.currentStep / record.totalSteps) * 100} size="small" strokeColor="#1890ff" format={() => `${record.currentStep}/${record.totalSteps}`} />
      ),
    },
    { title: '操作', key: 'action', width: 150, render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>详情</Button>
          {record.status === 'pending' && <Button type="link" size="small" style={{ color: '#52c41a' }}>通过</Button>}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>📋 审批流中心</h1>
        <p style={{ color: '#666' }}>统一审批平台 - 支持内部审批流与钉钉第三方审批</p>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="待我审批" value={5} suffix="个" valueStyle={{ color: '#faad14', fontSize: 24, fontWeight: 700 }} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="我已通过" value={28} suffix="个" valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 700 }} prefix={<CheckCircleOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="待审批金额" value={235} precision={0} prefix="¥" suffix="万" valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 700 }} /></Card></Col>
        <Col span={6}><Card><Statistic title="审批流程数" value={12} suffix="个" valueStyle={{ color: '#722ed1', fontSize: 24, fontWeight: 700 }} /></Card></Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="📋 我的审批" extra={<Tabs defaultActiveKey="pending" size="small"><TabPane tab="待我审批" key="pending" /><TabPane tab="我发起的" key="initiated" /><TabPane tab="我已处理" key="handled" /></Tabs>}>
            <Table columns={columns} dataSource={approvals} rowKey="id" pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total: number) => `共 ${total} 条` }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<><ThunderboltOutlined /> 审批渠道</>}>
            <Alert message="双审批流支持" description="内部审批流与钉钉第三方审批双向同步，数据实时互通" type="success" showIcon style={{ marginBottom: 16 }} />
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <div style={{ padding: 12, background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontWeight: 600 }}>💬 内部审批流</div><div style={{ fontSize: 12, color: '#666' }}>系统内置审批引擎</div></div>
                <Badge count="启用" style={{ backgroundColor: '#52c41a' }} />
              </div>
              <div style={{ padding: 12, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontWeight: 600 }}>🔗 钉钉审批</div><div style={{ fontSize: 12, color: '#666' }}>第三方审批集成</div></div>
                <Badge count="已连接" style={{ backgroundColor: '#52c41a' }} />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default WorkflowApproval
