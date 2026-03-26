import { useState } from 'react'
import { Typography, Card, Row, Col, Table, Button, Space, Tag, Input, Select, Badge, Statistic } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  WalletOutlined,
  FileTextOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const Finance = () => {
  const [selectedTab, setSelectedTab] = useState('receivable')

  // 应收账款数据
  const receivableData = [
    { key: '1', invoiceNo: 'INV20260315001', customer: '某某景区', amount: '¥188,000', dueDate: '2026-03-25', status: 'unpaid', days: 10 },
    { key: '2', invoiceNo: 'INV20260315002', customer: '某某园区', amount: '¥56,000', dueDate: '2026-03-20', status: 'overdue', days: -5 },
    { key: '3', invoiceNo: 'INV20260315003', customer: '某某俱乐部', amount: '¥32,000', dueDate: '2026-03-18', status: 'paid', days: 0 },
  ]

  // 应付账款数据
  const payableData = [
    { key: '1', invoiceNo: 'PAY20260315001', supplier: '某某电池厂', amount: '¥250,000', dueDate: '2026-03-28', status: 'unpaid', days: 13 },
    { key: '2', invoiceNo: 'PAY20260315002', supplier: '某某电机厂', amount: '¥80,000', dueDate: '2026-03-22', status: 'pending', days: 7 },
  ]

  const stats = [
    { label: '应收账款', value: '¥276,000', trend: 'up', icon: <DollarOutlined />, color: '#1890FF' },
    { label: '应付账款', value: '¥330,000', trend: 'down', icon: <WalletOutlined />, color: '#FAAD14' },
    { label: '本月收入', value: '¥1,580,000', trend: 'up', icon: <RiseOutlined />, color: '#52C41A' },
    { label: '本月支出', value: '¥980,000', trend: 'down', icon: <FallOutlined />, color: '#F5222D' },
  ]

  const columns = [
    { title: '单据编号', dataIndex: 'invoiceNo', key: 'invoiceNo' },
    { title: '客户/供应商', dataIndex: selectedTab === 'receivable' ? 'customer' : 'supplier', key: 'name' },
    { title: '金额', dataIndex: 'amount', key: 'amount' },
    { title: '到期日期', dataIndex: 'dueDate', key: 'dueDate' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          paid: { text: '已支付', color: 'green' },
          unpaid: { text: '未支付', color: 'blue' },
          overdue: { text: '已逾期', color: 'red' },
          pending: { text: '待审核', color: 'orange' },
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Badge color={s.color} text={s.text} />
      },
    },
    { 
      title: '逾期天数', 
      dataIndex: 'days', 
      key: 'days',
      render: (days: number) => {
        if (days > 0) return <span style={{ color: '#52C41A' }}>剩余{days}天</span>
        if (days < 0) return <span style={{ color: '#F5222D' }}>逾期{Math.abs(days)}天</span>
        return <span style={{ color: '#8C8C8C' }}>到期</span>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          {selectedTab === 'receivable' ? (
            <Button type="link" size="small">催款</Button>
          ) : (
            <Button type="link" size="small">支付</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="finance-page">
      {/* Header */}
      <div className="finance-header">
        <div className="header-content">
          <div>
            <Title level={2} style={{ margin: 0, color: '#FFFFFF' }}>财务管理系统</Title>
            <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Financial Management System</Paragraph>
          </div>
          <Space size="large">
            <Button icon={<ExportOutlined />}>导出报表</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              新建单据
            </Button>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="finance-stats">
        <Row gutter={[24, 24]}>
          {stats.map((stat, i) => (
            <Col xs={12} sm={6} key={i}>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                  <div className="stat-info">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value" style={{ color: stat.color }}>
                      {stat.value}
                      {stat.trend === 'up' ? (
                        <RiseOutlined style={{ marginLeft: 8, color: '#52C41A' }} />
                      ) : (
                        <FallOutlined style={{ marginLeft: 8, color: '#F5222D' }} />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Tabs */}
      <Card className="finance-tabs">
        <div className="tab-buttons">
          <Button
            type={selectedTab === 'receivable' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('receivable')}
          >
            <DollarOutlined /> 应收账款
          </Button>
          <Button
            type={selectedTab === 'payable' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('payable')}
          >
            <WalletOutlined /> 应付账款
          </Button>
          <Button type="default">
            <FileTextOutlined /> 费用报销
          </Button>
          <Button type="default">
            <DollarOutlined /> 资金管理
          </Button>
        </div>

        {/* 筛选区 */}
        <div className="filter-section">
          <Space wrap size="large">
            <Input
              placeholder="搜索单据编号、客户/供应商..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Select placeholder="状态" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="paid">已支付</Select.Option>
              <Select.Option value="unpaid">未支付</Select.Option>
              <Select.Option value="overdue">已逾期</Select.Option>
            </Select>
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={selectedTab === 'receivable' ? receivableData : payableData}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          size="middle"
        />
      </Card>

      <style>{`
        .finance-page { min-height: 100vh; background: #F0F2F5; }
        
        .finance-header {
          background: linear-gradient(135deg, #FAAD14 0%, #D48806 100%);
          padding: 24px 24px;
          margin-bottom: 24px;
        }
        
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .finance-stats { padding: 0 24px 24px; }
        
        .stat-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .stat-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .stat-icon {
          font-size: 40px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
        }
        
        .stat-label {
          color: #8C8C8C;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: bold;
        }
        
        .finance-tabs {
          margin: 0 24px 24px;
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .tab-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #F0F0F0;
        }
        
        .filter-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #F0F0F0;
        }
        
        @media (max-width: 768px) {
          .header-content { flex-direction: column; gap: 16px; }
          .stat-content { flex-direction: column; text-align: center; }
          .tab-buttons { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  )
}

export default Finance
