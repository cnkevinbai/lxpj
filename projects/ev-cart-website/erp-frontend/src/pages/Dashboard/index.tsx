import { Card, Row, Col, Statistic, Table, Tag, Space } from 'antd'
import {
  ShoppingCartOutlined,
  AppstoreOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons'

// 模拟数据 - 实际应从 API 获取
const dashboardData = {
  purchase: { total: 156, pending: 12, amount: 1250000 },
  inventory: { total: 2340, warning: 23, turnover: 85.6 },
  finance: { receivable: 890000, payable: 450000, profit: 440000 },
  production: { planned: 45, inProgress: 18, completed: 156 },
}

const recentPurchases = [
  { id: 1, no: 'PO20260312001', supplier: '四川钢铁集团', amount: 125000, status: 'pending', date: '2026-03-12' },
  { id: 2, no: 'PO20260312002', supplier: '成都电子科技', amount: 89000, status: 'approved', date: '2026-03-12' },
  { id: 3, no: 'PO20260311001', supplier: '重庆机械制造', amount: 230000, status: 'completed', date: '2026-03-11' },
  { id: 4, no: 'PO20260311002', supplier: '绵阳材料供应', amount: 67000, status: 'completed', date: '2026-03-11' },
]

const purchaseColumns = [
  { title: '采购单号', dataIndex: 'no', key: 'no' },
  { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
  { title: '金额 (元)', dataIndex: 'amount', key: 'amount', render: (v: number) => `¥${v.toLocaleString()}` },
  { 
    title: '状态', 
    dataIndex: 'status', 
    key: 'status',
    render: (status: string) => {
      const statusMap: Record<string, { color: string; text: string }> = {
        pending: { color: 'orange', text: '待审批' },
        approved: { color: 'blue', text: '已批准' },
        completed: { color: 'green', text: '已完成' },
      }
      const s = statusMap[status] || { color: 'default', text: status }
      return <Tag color={s.color}>{s.text}</Tag>
    }
  },
  { title: '日期', dataIndex: 'date', key: 'date' },
]

export default function Dashboard() {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>
      
      {/* 核心指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="采购订单"
              value={dashboardData.purchase.total}
              prefix={<ShoppingCartOutlined />}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
              待审批：{dashboardData.purchase.pending} 个
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="库存总量"
              value={dashboardData.inventory.total}
              prefix={<AppstoreOutlined />}
              suffix="件"
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8, color: '#ff4d4f', fontSize: 12 }}>
              库存预警：{dashboardData.inventory.warning} 个 SKU
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="应收账款"
              value={dashboardData.finance.receivable}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
              应付账款：¥{dashboardData.finance.payable.toLocaleString()}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="生产计划"
              value={dashboardData.production.planned}
              prefix={<RiseOutlined />}
              suffix="个"
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
              进行中：{dashboardData.production.inProgress} 个
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最近采购 */}
      <Card title="最近采购订单" style={{ marginBottom: 24 }}>
        <Table
          columns={purchaseColumns}
          dataSource={recentPurchases}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  )
}
