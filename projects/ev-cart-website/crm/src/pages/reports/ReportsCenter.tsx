import React, { useState } from 'react'
import { Card, Row, Col, Table, Tag, DatePicker, Select, Space, Button, Statistic, Progress } from 'antd'
import { DownloadOutlined, RiseOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons'
import { Column, Line, Pie } from '@ant-design/plots'

const { RangePicker } = DatePicker
const { Option } = Select

const ReportsCenter: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null)

  // 销售报表数据
  const salesReportData = [
    { month: '1 月', target: 100, actual: 120, rate: 120 },
    { month: '2 月', target: 100, actual: 132, rate: 132 },
    { month: '3 月', target: 100, actual: 101, rate: 101 },
    { month: '4 月', target: 100, actual: 134, rate: 134 },
    { month: '5 月', target: 100, actual: 90, rate: 90 },
    { month: '6 月', target: 100, actual: 230, rate: 230 },
  ]

  // 客户分析数据
  const customerData = [
    { industry: '新能源汽车', count: 45, rate: 35 },
    { industry: '共享出行', count: 32, rate: 25 },
    { industry: '物流配送', count: 25, rate: 20 },
    { industry: '制造业', count: 15, rate: 12 },
    { industry: '其他', count: 10, rate: 8 },
  ]

  // 产品销量数据
  const productData = [
    { product: '智能换电柜 V3', sales: 350, revenue: 5250000 },
    { product: '智能换电柜 V2', sales: 180, revenue: 2160000 },
    { product: '锂电池 48V', sales: 1200, revenue: 1440000 },
    { product: '锂电池 60V', sales: 800, revenue: 1200000 },
    { product: '配件包', sales: 2500, revenue: 375000 },
  ]

  const columnConfig = {
    data: salesReportData,
    xField: 'month',
    yField: 'actual',
    seriesField: 'actual',
    legend: { position: 'top', layout: 'horizontal' },
    columnStyle: {
      fill: ({ actual, target }: any) => actual >= target ? '#52c41a' : '#1890ff',
    },
  }

  const lineConfig = {
    data: salesReportData.map(item => ({
      month: item.month,
      '目标': item.target,
      '实际': item.actual,
    })),
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
  }

  const pieConfig = {
    appendPadding: 10,
    data: customerData,
    angleField: 'count',
    colorField: 'industry',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <span style={{ fontSize: 16, fontWeight: 600 }}>📊 报表中心</span>
          <RangePicker onChange={(dates) => setDateRange(dates)} />
        </Space>
        <Space>
          <Button icon={<DownloadOutlined />}>导出 Excel</Button>
          <Button icon={<DownloadOutlined />}>导出 PDF</Button>
        </Space>
      </div>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售目标完成率"
              value={156}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售总额"
              value={1042.5}
              precision={1}
              prefix="¥"
              suffix="万"
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="客户总数"
              value={127}
              suffix="个"
              valueStyle={{ color: '#722ed1' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均客单价"
              value={8.2}
              precision={1}
              prefix="¥"
              suffix="万"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 销售分析 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Card title="📈 销售目标完成情况">
            <Column {...columnConfig} height={300} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📊 客户行业分布">
            <Pie {...pieConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 产品销量排行 */}
      <Card title="🏆 产品销量排行" style={{ marginBottom: 16 }}>
        <Table
          dataSource={productData}
          rowKey="product"
          pagination={false}
          columns={[
            { title: '排名', dataIndex: 'rank', width: 80, render: (_: any, __: any, index: number) => index + 1 },
            { title: '产品名称', dataIndex: 'product', width: 200 },
            { title: '销量', dataIndex: 'sales', width: 120, sorter: (a: any, b: any) => a.sales - b.sales },
            { title: '销售额', dataIndex: 'revenue', width: 150, render: (r: number) => `¥${(r / 10000).toFixed(0)}万`, sorter: (a: any, b: any) => a.revenue - b.revenue },
            {
              title: '销售占比',
              key: 'rate',
              width: 150,
              render: (_: any, record: any) => {
                const total = productData.reduce((sum, p) => sum + p.revenue, 0)
                const rate = Math.round((record.revenue / total) * 100)
                return <Progress percent={rate} size="small" strokeColor="#1890ff" />
              },
            },
          ]}
        />
      </Card>

      {/* 客户分析 */}
      <Card title="👥 客户分析">
        <Table
          dataSource={customerData}
          rowKey="industry"
          pagination={false}
          columns={[
            { title: '行业', dataIndex: 'industry', width: 200 },
            { title: '客户数', dataIndex: 'count', width: 120, sorter: (a: any, b: any) => a.count - b.count },
            { title: '占比', dataIndex: 'rate', width: 150, render: (r: number) => `${r}%` },
            {
              title: '客户质量',
              key: 'quality',
              width: 150,
              render: (_: any, record: any) => (
                <Rate
                  disabled
                  defaultValue={record.rate > 30 ? 5 : record.rate > 20 ? 4 : record.rate > 10 ? 3 : 2}
                  character={<StarOutlined />}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}

export default ReportsCenter
