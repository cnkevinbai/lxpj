/**
 * 财务中心概览页
 * 包含关键指标卡片、收支趋势图、待办提醒
 */
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Typography, Spin, Alert } from 'antd'
import { 
  DollarOutlined, 
  RiseOutlined, 
  FallOutlined, 
  WarningOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { financeStatsService, receivableService, payableService, invoiceService } from '@/services/finance.service'
import { Line } from '@ant-design/plots'
import dayjs from 'dayjs'

const { Title } = Typography

// 状态映射
const receivableStatusMap: Record<string, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待收款' },
  PARTIAL: { color: 'blue', text: '部分收款' },
  PAID: { color: 'green', text: '已收款' },
  OVERDUE: { color: 'red', text: '逾期' },
}

const payableStatusMap: Record<string, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待付款' },
  PARTIAL: { color: 'blue', text: '部分付款' },
  PAID: { color: 'green', text: '已付款' },
  OVERDUE: { color: 'red', 'text': '逾期' },
}

const invoiceStatusMap: Record<string, { color: string; text: string }> = {
  PENDING: { color: 'default', text: '待开票' },
  ISSUED: { color: 'blue', text: '已开具' },
  RECEIVED: { color: 'green', text: '已收到' },
  CANCELLED: { color: 'red', text: '已作废' },
}

export default function Finance() {
  const navigate = useNavigate()

  // 获取财务统计
  const { data: stats } = useQuery({
    queryKey: ['finance-stats'],
    queryFn: () => financeStatsService.getStats(),
    refetchInterval: 60000, // 每分钟刷新
  })

  // 获取收支趋势
  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ['finance-trend'],
    queryFn: () => financeStatsService.getTrend(
      dayjs().startOf('month').format('YYYY-MM-DD'),
      dayjs().endOf('month').format('YYYY-MM-DD')
    ),
  })

  // 获取待收款列表
  const { data: receivablesData } = useQuery({
    queryKey: ['receivables-pending'],
    queryFn: () => receivableService.getList({ 
      status: 'PENDING', 
      page: 1, 
      pageSize: 5 
    }),
  })

  // 获取待付款列表
  const { data: payablesData } = useQuery({
    queryKey: ['payables-pending'],
    queryFn: () => payableService.getList({ 
      status: 'PENDING', 
      page: 1, 
      pageSize: 5 
    }),
  })

  // 获取待开票列表
  const { data: invoicesData } = useQuery({
    queryKey: ['invoices-pending'],
    queryFn: () => invoiceService.getList({ 
      status: 'PENDING', 
      page: 1, 
      pageSize: 5 
    }),
  })

  // 转换趋势数据格式
  const chartData = trendData ? [
    ...trendData.map(d => ({ date: d.date, type: 'revenue', value: d.revenue })),
    ...trendData.map(d => ({ date: d.date, type: 'expense', value: d.expense })),
    ...trendData.map(d => ({ date: d.date, type: 'profit', value: d.profit })),
  ] : []

  const revenueTrendConfig = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    color: ['#52c41a', '#ff4d4f', '#1890ff'],
    smooth: true,
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: true,
        formatter: (v: string) => dayjs(v).format('MM-DD'),
      },
    },
    legend: {
      position: 'top' as const,
      itemName: {
        formatter: (name: string) => {
          const map: Record<string, string> = { revenue: '收入', expense: '支出', profit: '利润' }
          return map[name] || name
        },
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        const names: Record<string, string> = { revenue: '收入', expense: '支出', profit: '利润' }
        return {
          name: names[datum.type] || datum.type,
          value: `¥${datum.value.toLocaleString()}`,
        }
      },
    },
    height: 300,
  }

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <Title level={2} style={{ marginBottom: 24 }}>财务中心</Title>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="营业收入（本月）"
              value={stats?.monthRevenue || 0}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="营业支出（本月）"
              value={stats?.monthExpense || 0}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<FallOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="利润（本月）"
              value={stats?.monthProfit || 0}
              precision={2}
              prefix={<><span style={{ marginRight: 4 }}>¥</span><RiseOutlined /></>}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总应收账款"
              value={stats?.totalReceivable || 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="已收款"
              value={stats?.paidReceivable || 0}
              precision={2}
              prefix={<><span style={{ marginRight: 4 }}>¥</span><CheckCircleOutlined /></>}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待收款"
              value={(stats?.totalReceivable || 0) - (stats?.paidReceivable || 0)}
              precision={2}
              prefix={<><span style={{ marginRight: 4 }}>¥</span><ClockCircleOutlined /></>}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总应付账款"
              value={stats?.totalPayable || 0}
              precision={2}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="逾期应收"
              value={stats?.overdueReceivable || 0}
              precision={2}
              prefix={<><span style={{ marginRight: 4 }}>¥</span><WarningOutlined /></>}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 收支趋势图 */}
      <Card title="本月收支趋势" style={{ marginBottom: 24 }}>
        {trendLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : chartData.length > 0 ? (
          <Line {...revenueTrendConfig} />
        ) : (
          <Alert
            message="暂无数据"
            description="本月暂无收支记录"
            type="info"
            showIcon
          />
        )}
      </Card>

      {/* 待办事项 */}
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>待收款提醒</span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('receivable')}>
                查看全部 <ArrowRightOutlined />
              </Button>
            }
          >
            {receivablesData?.list && receivablesData.list.length > 0 ? (
              <Table
                dataSource={receivablesData.list}
                rowKey="id"
                size="small"
                pagination={false}
                columns={[
                  {
                    title: '客户',
                    dataIndex: ['customer', 'name'],
                    render: (name: string) => name || '未知客户',
                  },
                  {
                    title: '金额',
                    dataIndex: 'amount',
                    render: (v: number) => `¥${v.toLocaleString()}`,
                  },
                  {
                    title: '到期日',
                    dataIndex: 'dueDate',
                    render: (d: string) => dayjs(d).format('YYYY-MM-DD'),
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    render: (s: string) => (
                      <Tag color={receivableStatusMap[s]?.color}>
                        {receivableStatusMap[s]?.text}
                      </Tag>
                    ),
                  },
                ]}
              />
            ) : (
              <Alert message="暂无待收款" type="success" showIcon />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>待付款提醒</span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('payable')}>
                查看全部 <ArrowRightOutlined />
              </Button>
            }
          >
            {payablesData?.list && payablesData.list.length > 0 ? (
              <Table
                dataSource={payablesData.list}
                rowKey="id"
                size="small"
                pagination={false}
                columns={[
                  {
                    title: '供应商',
                    dataIndex: ['supplier', 'name'],
                    render: (name: string) => name || '未知供应商',
                  },
                  {
                    title: '金额',
                    dataIndex: 'amount',
                    render: (v: number) => `¥${v.toLocaleString()}`,
                  },
                  {
                    title: '到期日',
                    dataIndex: 'dueDate',
                    render: (d: string) => dayjs(d).format('YYYY-MM-DD'),
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    render: (s: string) => (
                      <Tag color={payableStatusMap[s]?.color}>
                        {payableStatusMap[s]?.text}
                      </Tag>
                    ),
                  },
                ]}
              />
            ) : (
              <Alert message="暂无待付款" type="success" showIcon />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>待开票提醒</span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/finance/invoice')}>
                查看全部 <ArrowRightOutlined />
              </Button>
            }
          >
            {invoicesData?.list && invoicesData.list.length > 0 ? (
              <Table
                dataSource={invoicesData.list}
                rowKey="id"
                size="small"
                pagination={false}
                columns={[
                  {
                    title: '发票号',
                    dataIndex: 'invoiceNo',
                  },
                  {
                    title: '类型',
                    dataIndex: 'type',
                    render: (t: string) => t === 'SALES' ? '销售' : '采购',
                  },
                  {
                    title: '金额',
                    dataIndex: 'amount',
                    render: (v: number) => `¥${v.toLocaleString()}`,
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    render: (s: string) => (
                      <Tag color={invoiceStatusMap[s]?.color}>
                        {invoiceStatusMap[s]?.text}
                      </Tag>
                    ),
                  },
                ]}
              />
            ) : (
              <Alert message="暂无待开票" type="success" showIcon />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
