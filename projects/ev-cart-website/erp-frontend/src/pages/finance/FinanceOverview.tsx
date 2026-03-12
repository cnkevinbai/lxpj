import { Card, Row, Col, Statistic, Table, Tag } from 'antd'
import { DollarOutlined, RiseOutlined, FallOutlined, WalletOutlined } from '@ant-design/icons'

// 模拟数据
const stats = {
  receivable: 890000,
  payable: 450000,
  profit: 440000,
  cashFlow: 1200000,
}

const recentTransactions = [
  { id: 1, type: 'receive', no: 'REC20260312001', party: '成都客户 A', amount: 125000, date: '2026-03-12', status: 'completed' },
  { id: 2, type: 'pay', no: 'PAY20260312001', party: '四川钢铁集团', amount: 89000, date: '2026-03-12', status: 'completed' },
  { id: 3, type: 'receive', no: 'REC20260311001', party: '重庆客户 B', amount: 230000, date: '2026-03-11', status: 'completed' },
  { id: 4, type: 'pay', no: 'PAY20260311001', party: '成都电子科技', amount: 67000, date: '2026-03-11', status: 'pending' },
  { id: 5, type: 'receive', no: 'REC20260310001', party: '绵阳客户 C', amount: 178000, date: '2026-03-10', status: 'completed' },
]

const columns = [
  { title: '单据类型', dataIndex: 'type', key: 'type', width: 100, render: (t: string) => t === 'receive' ? '收款' : '付款' },
  { title: '单据号', dataIndex: 'no', key: 'no', width: 180 },
  { title: '对方单位', dataIndex: 'party', key: 'party', width: 180 },
  { 
    title: '金额 (元)', 
    dataIndex: 'amount', 
    key: 'amount',
    width: 120,
    render: (v: number, r: any) => (
      <span style={{ color: r.type === 'receive' ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
        {r.type === 'receive' ? '+' : '-'}¥{v.toLocaleString()}
      </span>
    )
  },
  { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
  { 
    title: '状态', 
    dataIndex: 'status', 
    key: 'status',
    width: 100,
    render: (s: string) => <Tag color={s === 'completed' ? 'green' : 'orange'}>{s === 'completed' ? '已完成' : '待处理'}</Tag>
  },
]

export default function FinanceOverview() {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>财务总览</h1>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="应收账款"
              value={stats.receivable}
              prefix={<WalletOutlined />}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="应付账款"
              value={stats.payable}
              prefix={<FallOutlined />}
              precision={0}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="利润"
              value={stats.profit}
              prefix={<RiseOutlined />}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="现金流"
              value={stats.cashFlow}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近交易记录">
        <Table columns={columns} dataSource={recentTransactions} rowKey="id" pagination={false} />
      </Card>
    </div>
  )
}
