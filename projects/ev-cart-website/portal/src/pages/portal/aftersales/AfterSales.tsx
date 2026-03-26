import { useState } from 'react'
import { Typography, Card, Row, Col, Table, Button, Space, Tag, Input, Select, Badge, Rate, Descriptions } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  ToolOutlined,
  CustomerServiceOutlined,
  BookOutlined,
  BarChartOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const AfterSales = () => {
  const [selectedTab, setSelectedTab] = useState('tickets')

  // 服务工单数据
  const ticketData: { key: string; ticketNo: string; customer: string; product: string; issue: string; priority: string; status: string; assignee: string; createDate: string }[] = [
    { key: '1', ticketNo: 'AS20260315001', customer: '某某景区', product: '新能源观光车 T100', issue: '电池续航不足', priority: 'high', status: 'processing', assignee: '张三', createDate: '2026-03-14' },
    { key: '2', ticketNo: 'AS20260315002', customer: '某某园区', product: '电动巡逻车 P200', issue: '电机异响', priority: 'medium', status: 'pending', assignee: '李四', createDate: '2026-03-13' },
    { key: '3', ticketNo: 'AS20260315003', customer: '某某俱乐部', product: '高尔夫球车 G100', issue: '轮胎磨损', priority: 'low', status: 'completed', assignee: '王五', createDate: '2026-03-10' },
  ]

  // 配件库存数据
  const partsData: { key: string; partNo: string; name: string; category: string; stock: number; unit: string; price: string; status: string }[] = [
    { key: '1', partNo: 'P001', name: '磷酸铁锂电池组', category: '核心部件', stock: 50, unit: '组', price: '¥15,000', status: 'normal' },
    { key: '2', partNo: 'P002', name: 'AC 电机 5kW', category: '核心部件', stock: 30, unit: '台', price: '¥8,000', status: 'normal' },
    { key: '3', partNo: 'P003', name: '轮胎 13 寸', category: '通用部件', stock: 100, unit: '个', price: '¥500', status: 'low' },
    { key: '4', partNo: 'P004', name: '座椅', category: '内饰件', stock: 80, unit: '个', price: '¥1,200', status: 'normal' },
  ]

  const stats = [
    { label: '工单总数', value: 256, suffix: '个', icon: <ToolOutlined />, color: '#13C2C2' },
    { label: '待处理', value: 15, suffix: '个', icon: <ClockCircleOutlined />, color: '#FAAD14' },
    { label: '配件 SKU', value: 128, suffix: '个', icon: <BookOutlined />, color: '#52C41A' },
    { label: '客户满意度', value: 4.8, suffix: '分', icon: <CustomerServiceOutlined />, color: '#722ED1' },
  ]

  const ticketColumns = [
    { title: '工单编号', dataIndex: 'ticketNo', key: 'ticketNo' },
    { title: '客户', dataIndex: 'customer', key: 'customer' },
    { title: '产品', dataIndex: 'product', key: 'product' },
    { title: '问题描述', dataIndex: 'issue', key: 'issue', ellipsis: true },
    { 
      title: '优先级', 
      dataIndex: 'priority', 
      key: 'priority',
      render: (priority: string) => {
        const priorityMap: any = {
          high: { text: '高', color: 'red' },
          medium: { text: '中', color: 'orange' },
          low: { text: '低', color: 'blue' },
        }
        const p = priorityMap[priority] || { text: priority, color: 'default' }
        return <Tag color={p.color}>{p.text}</Tag>
      },
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          pending: { text: '待处理', color: 'gray' },
          processing: { text: '处理中', color: 'blue' },
          completed: { text: '已完成', color: 'green' },
          closed: { text: '已关闭', color: 'cyan' },
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Badge color={s.color} text={s.text} />
      },
    },
    { title: '负责人', dataIndex: 'assignee', key: 'assignee' },
    { title: '创建日期', dataIndex: 'createDate', key: 'createDate' },
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

  const partsColumns = [
    { title: '配件编号', dataIndex: 'partNo', key: 'partNo' },
    { title: '配件名称', dataIndex: 'name', key: 'name' },
    { title: '类别', dataIndex: 'category', key: 'category' },
    { title: '库存数量', dataIndex: 'stock', key: 'stock' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '单价', dataIndex: 'price', key: 'price' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          normal: { text: '充足', color: 'green' },
          low: { text: '偏低', color: 'orange' },
          critical: { text: '不足', color: 'red' },
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Badge color={s.color} text={s.text} />
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">入库</Button>
          <Button type="link" size="small">出库</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="aftersales-page">
      {/* Header */}
      <div className="as-header">
        <div className="header-content">
          <div>
            <Title level={2} style={{ margin: 0, color: '#FFFFFF' }}>售后服务系统</Title>
            <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>After-Sales Service System</Paragraph>
          </div>
          <Space size="large">
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              新建工单
            </Button>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="as-stats">
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
      <Card className="as-tabs">
        <div className="tab-buttons">
          <Button
            type={selectedTab === 'tickets' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('tickets')}
          >
            <ToolOutlined /> 服务工单
          </Button>
          <Button
            type={selectedTab === 'parts' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('parts')}
          >
            <BookOutlined /> 配件管理
          </Button>
          <Button type="default">
            <CustomerServiceOutlined /> 知识库
          </Button>
          <Button type="default">
            <BarChartOutlined /> 服务统计
          </Button>
        </div>

        {/* 筛选区 */}
        <div className="filter-section">
          <Space wrap size="large">
            <Input
              placeholder={selectedTab === 'tickets' ? '搜索工单编号、客户...' : '搜索配件名称、编号...'}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Select placeholder="状态" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="pending">待处理</Select.Option>
              <Select.Option value="processing">处理中</Select.Option>
              <Select.Option value="completed">已完成</Select.Option>
            </Select>
            {selectedTab === 'tickets' && (
              <Select placeholder="优先级" style={{ width: 120 }}>
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="high">高</Select.Option>
                <Select.Option value="medium">中</Select.Option>
                <Select.Option value="low">低</Select.Option>
              </Select>
            )}
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={selectedTab === 'tickets' ? ticketColumns : partsColumns}
          dataSource={selectedTab === 'tickets' ? ticketData : partsData}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          size="middle"
        />
      </Card>

      <style>{`
        .aftersales-page { min-height: 100vh; background: #F0F2F5; }
        
        .as-header {
          background: linear-gradient(135deg, #13C2C2 0%, #08979C 100%);
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
        
        .as-stats { padding: 0 24px 24px; }
        
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
        
        .as-tabs {
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

export default AfterSales
