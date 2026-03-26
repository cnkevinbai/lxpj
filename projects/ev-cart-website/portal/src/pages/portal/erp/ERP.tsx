import { useState } from 'react'
import { Typography, Card, Row, Col, Table, Button, Space, Tag, Input, Select, Badge, Progress } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  LineChartOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const ERP = () => {
  const [selectedTab, setSelectedTab] = useState('production')

  // 生产订单数据
  const productionData = [
    { key: '1', orderNo: 'PO20260315001', product: '新能源观光车 T100', quantity: 50, status: 'producing', progress: 65, deadline: '2026-03-25', manager: '张三' },
    { key: '2', orderNo: 'PO20260315002', product: '电动巡逻车 P200', quantity: 30, status: 'pending', progress: 20, deadline: '2026-03-30', manager: '李四' },
    { key: '3', orderNo: 'PO20260315003', product: '高尔夫球车 G100', quantity: 20, status: 'completed', progress: 100, deadline: '2026-03-20', manager: '王五' },
    { key: '4', orderNo: 'PO20260315004', product: '无人驾驶观光车 A300', quantity: 10, status: 'planning', progress: 10, deadline: '2026-04-10', manager: '赵六' },
  ]

  // 库存数据
  const inventoryData = [
    { key: '1', item: '磷酸铁锂电池', category: '核心部件', stock: 500, unit: '组', status: 'normal', warning: 100 },
    { key: '2', item: 'AC 电机 5kW', category: '核心部件', stock: 200, unit: '台', status: 'normal', warning: 50 },
    { key: '3', item: '轮胎 13 寸', category: '通用部件', stock: 800, unit: '个', status: 'low', warning: 200 },
    { key: '4', item: '座椅', category: '内饰件', stock: 300, unit: '个', status: 'normal', warning: 100 },
  ]

  const stats = [
    { label: '生产订单', value: 45, suffix: '个', icon: <AppstoreOutlined />, color: '#1890FF' },
    { label: '在制品', value: 120, suffix: '台', icon: <LineChartOutlined />, color: '#FAAD14' },
    { label: '库存总额', value: '¥850 万', suffix: '', icon: <DollarOutlined />, color: '#52C41A' },
    { label: '采购申请', value: 12, suffix: '个', icon: <ShoppingCartOutlined />, color: '#722ED1' },
  ]

  const productionColumns = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '产品名称', dataIndex: 'product', key: 'product' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          planning: { text: '计划中', color: 'gray' },
          pending: { text: '待生产', color: 'orange' },
          producing: { text: '生产中', color: 'blue' },
          completed: { text: '已完成', color: 'green' },
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
        <Progress percent={progress} size="small" strokeColor={progress === 100 ? '#52C41A' : '#1890FF'} />
      ),
    },
    { title: '交付日期', dataIndex: 'deadline', key: 'deadline' },
    { title: '负责人', dataIndex: 'manager', key: 'manager' },
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

  const inventoryColumns = [
    { title: '物料名称', dataIndex: 'item', key: 'item' },
    { title: '类别', dataIndex: 'category', key: 'category' },
    { title: '库存数量', dataIndex: 'stock', key: 'stock' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          normal: { text: '正常', color: 'green' },
          low: { text: '偏低', color: 'orange' },
          critical: { text: '严重不足', color: 'red' },
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Badge color={s.color} text={s.text} />
      },
    },
    { title: '预警线', dataIndex: 'warning', key: 'warning' },
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
    <div className="erp-page">
      {/* Header */}
      <div className="erp-header">
        <div className="header-content">
          <div>
            <Title level={2} style={{ margin: 0, color: '#FFFFFF' }}>ERP 企业资源计划</Title>
            <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Enterprise Resource Planning</Paragraph>
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
      <div className="erp-stats">
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
      <Card className="erp-tabs">
        <div className="tab-buttons">
          <Button
            type={selectedTab === 'production' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('production')}
          >
            <AppstoreOutlined /> 生产订单
          </Button>
          <Button
            type={selectedTab === 'inventory' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('inventory')}
          >
            <ShoppingCartOutlined /> 库存管理
          </Button>
          <Button type="default">
            <DollarOutlined /> 采购管理
          </Button>
          <Button type="default">
            <CheckCircleOutlined /> 质量管理
          </Button>
        </div>

        {/* 筛选区 */}
        {selectedTab === 'production' && (
          <div className="filter-section">
            <Space wrap size="large">
              <Input
                placeholder="搜索订单编号、产品..."
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
              />
              <Select placeholder="订单状态" style={{ width: 120 }}>
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="planning">计划中</Select.Option>
                <Select.Option value="pending">待生产</Select.Option>
                <Select.Option value="producing">生产中</Select.Option>
                <Select.Option value="completed">已完成</Select.Option>
              </Select>
            </Space>
          </div>
        )}

        {selectedTab === 'inventory' && (
          <div className="filter-section">
            <Space wrap size="large">
              <Input
                placeholder="搜索物料名称..."
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
              />
              <Select placeholder="物料类别" style={{ width: 120 }}>
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="core">核心部件</Select.Option>
                <Select.Option value="general">通用部件</Select.Option>
                <Select.Option value="interior">内饰件</Select.Option>
              </Select>
              <Select placeholder="库存状态" style={{ width: 120 }}>
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="normal">正常</Select.Option>
                <Select.Option value="low">偏低</Select.Option>
                <Select.Option value="critical">严重不足</Select.Option>
              </Select>
            </Space>
          </div>
        )}

        {/* 表格 */}
        {selectedTab === 'production' ? (
          <Table
            columns={productionColumns}
            dataSource={productionData}
            pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
            size="middle"
          />
        ) : (
          <Table
            columns={inventoryColumns}
            dataSource={inventoryData}
            pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
            size="middle"
          />
        )}
      </Card>

      <style>{`
        .erp-page { min-height: 100vh; background: #F0F2F5; }
        
        .erp-header {
          background: linear-gradient(135deg, #52C41A 0%, #389E0D 100%);
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
        
        .erp-stats { padding: 0 24px 24px; }
        
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
        
        .erp-tabs {
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

export default ERP
