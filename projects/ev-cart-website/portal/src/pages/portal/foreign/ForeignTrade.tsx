import { useState } from 'react'
import { Typography, Card, Row, Col, Table, Button, Space, Tag, Input, Select, Badge, Progress, Steps } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  GlobalOutlined,
  FileTextOutlined,
  CarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const ForeignTrade = () => {
  const [selectedTab, setSelectedTab] = useState('orders')

  // 出口订单数据
  const orderData = [
    { key: '1', orderNo: 'FT20260315001', customer: 'ABC Company (USA)', product: '新能源观光车 T100', quantity: 20, amount: '$158,000', status: 'producing', progress: 60, deliveryDate: '2026-04-15' },
    { key: '2', orderNo: 'FT20260315002', customer: 'XYZ Ltd (UK)', product: '电动巡逻车 P200', quantity: 15, amount: '$84,000', status: 'customs', progress: 80, deliveryDate: '2026-04-10' },
    { key: '3', orderNo: 'FT20260315003', customer: 'Resort Group (Dubai)', product: '高尔夫球车 G100', quantity: 30, amount: '$96,000', status: 'shipped', progress: 95, deliveryDate: '2026-04-05' },
  ]

  // 报关数据
  const customsData = [
    { key: '1', customsNo: 'CUS20260315001', orderNo: 'FT20260315001', type: '出口报关', status: 'pending', submitDate: '2026-03-14', customs: '上海海关' },
    { key: '2', customsNo: 'CUS20260315002', orderNo: 'FT20260315002', type: '出口报关', status: 'approved', submitDate: '2026-03-13', customs: '深圳海关' },
    { key: '3', customsNo: 'CUS20260315003', orderNo: 'FT20260315003', type: '出口报关', status: 'completed', submitDate: '2026-03-12', customs: '广州海关' },
  ]

  const stats = [
    { label: '出口订单', value: 45, suffix: '个', icon: <GlobalOutlined />, color: '#722ED1' },
    { label: '本月出口额', value: '$580 万', suffix: '', icon: <DollarOutlined />, color: '#52C41A' },
    { label: '待报关', value: 8, suffix: '单', icon: <FileTextOutlined />, color: '#FAAD14' },
    { label: '待发货', value: 12, suffix: '单', icon: <CarOutlined />, color: '#1890FF' },
  ]

  const orderColumns = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '客户', dataIndex: 'customer', key: 'customer' },
    { title: '产品', dataIndex: 'product', key: 'product' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '金额', dataIndex: 'amount', key: 'amount' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          pending: { text: '待生产', color: 'gray' },
          producing: { text: '生产中', color: 'blue' },
          customs: { text: '报关中', color: 'orange' },
          shipped: { text: '已发货', color: 'green' },
          completed: { text: '已完成', color: 'cyan' },
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Badge color={s.color} text={s.text} />
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" strokeColor={progress === 100 ? '#52C41A' : '#722ED1'} />
      ),
    },
    { title: '交付日期', dataIndex: 'deliveryDate', key: 'deliveryDate' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
        </Space>
      ),
    },
  ]

  const customsColumns = [
    { title: '报关单号', dataIndex: 'customsNo', key: 'customsNo' },
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '报关类型', dataIndex: 'type', key: 'type' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          pending: { text: '待提交', color: 'gray' },
          reviewing: { text: '审核中', color: 'blue' },
          approved: { text: '已通过', color: 'green' },
          completed: { text: '已完成', color: 'cyan' },
          rejected: { text: '已驳回', color: 'red' },
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Badge color={s.color} text={s.text} />
      },
    },
    { title: '提交日期', dataIndex: 'submitDate', key: 'submitDate' },
    { title: '海关', dataIndex: 'customs', key: 'customs' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="foreign-trade-page">
      {/* Header */}
      <div className="ft-header">
        <div className="header-content">
          <div>
            <Title level={2} style={{ margin: 0, color: '#FFFFFF' }}>外贸管理系统</Title>
            <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Foreign Trade Management</Paragraph>
          </div>
          <Space size="large">
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              新建订单
            </Button>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="ft-stats">
        <Row gutter={[24, 24]}>
          {stats.map((stat, i) => (
            <Col xs={12} sm={6} key={i}>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                  <div className="stat-info">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value" style={{ color: stat.color }}>
                      {stat.value}{stat.suffix}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Tabs */}
      <Card className="ft-tabs">
        <div className="tab-buttons">
          <Button
            type={selectedTab === 'orders' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('orders')}
          >
            <GlobalOutlined /> 出口订单
          </Button>
          <Button
            type={selectedTab === 'customs' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('customs')}
          >
            <FileTextOutlined /> 报关管理
          </Button>
          <Button type="default">
            <CarOutlined /> 物流跟踪
          </Button>
          <Button type="default">
            <DollarOutlined /> 外汇管理
          </Button>
        </div>

        {/* 筛选区 */}
        <div className="filter-section">
          <Space wrap size="large">
            <Input
              placeholder={selectedTab === 'orders' ? '搜索订单编号、客户...' : '搜索报关单号...'}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Select placeholder="状态" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="pending">待处理</Select.Option>
              <Select.Option value="processing">处理中</Select.Option>
              <Select.Option value="completed">已完成</Select.Option>
            </Select>
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={selectedTab === 'orders' ? orderColumns : customsColumns}
          dataSource={selectedTab === 'orders' ? orderData : customsData}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          size="middle"
        />
      </Card>

      <style>{`
        .foreign-trade-page { min-height: 100vh; background: #F0F2F5; }
        
        .ft-header {
          background: linear-gradient(135deg, #722ED1 0%, #531DAB 100%);
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
        
        .ft-stats { padding: 0 24px 24px; }
        
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
          font-size: 28px;
          font-weight: bold;
        }
        
        .ft-tabs {
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

export default ForeignTrade
