/**
 * 财务报表页面
 * 利润表、资产负债表、现金流量表
 */
import { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Table,
  DatePicker,
  Select,
  Button,
  Space,
  Statistic,
  Typography,
  Tabs,
  Tag,
  Tooltip,
  Progress,
  Divider,
} from 'antd'
import {
  DownloadOutlined,
  PrinterOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

// 报表期间
const PERIODS = [
  { value: '2026-03', label: '2026年3月' },
  { value: '2026-02', label: '2026年2月' },
  { value: '2026-01', label: '2026年1月' },
  { value: '2025-12', label: '2025年12月' },
]

export default function FinanceReport() {
  const [period, setPeriod] = useState('2026-03')
  const [activeTab, setActiveTab] = useState('profit')

  // 利润表数据
  const profitData = [
    { key: '1', item: '一、营业收入', amount: 2850000, ratio: 100, level: 1 },
    { key: '2', item: '  主营业务收入', amount: 2600000, ratio: 91.2, level: 2 },
    { key: '3', item: '  其他业务收入', amount: 250000, ratio: 8.8, level: 2 },
    { key: '4', item: '二、营业成本', amount: -1560000, ratio: 54.7, level: 1, isNegative: true },
    { key: '5', item: '  主营业务成本', amount: -1450000, ratio: 50.9, level: 2, isNegative: true },
    { key: '6', item: '  其他业务成本', amount: -110000, ratio: 3.9, level: 2, isNegative: true },
    { key: '7', item: '三、营业毛利', amount: 1290000, ratio: 45.3, level: 1, isHighlight: true },
    { key: '8', item: '四、期间费用', amount: -680000, ratio: 23.9, level: 1, isNegative: true },
    { key: '9', item: '  销售费用', amount: -280000, ratio: 9.8, level: 2, isNegative: true },
    { key: '10', item: '  管理费用', amount: -250000, ratio: 8.8, level: 2, isNegative: true },
    { key: '11', item: '  财务费用', amount: -150000, ratio: 5.3, level: 2, isNegative: true },
    { key: '12', item: '五、营业利润', amount: 610000, ratio: 21.4, level: 1, isHighlight: true },
    { key: '13', item: '六、利润总额', amount: 610000, ratio: 21.4, level: 1, isHighlight: true },
    { key: '14', item: '七、所得税费用', amount: -152500, ratio: 5.4, level: 1, isNegative: true },
    { key: '15', item: '八、净利润', amount: 457500, ratio: 16.1, level: 1, isTotal: true },
  ]

  // 资产负债表数据
  const balanceData = {
    assets: [
      { key: '1', item: '流动资产', amount: 1850000, level: 1 },
      { key: '2', item: '  货币资金', amount: 850000, level: 2 },
      { key: '3', item: '  应收账款', amount: 520000, level: 2 },
      { key: '4', item: '  存货', amount: 380000, level: 2 },
      { key: '5', item: '  其他流动资产', amount: 100000, level: 2 },
      { key: '6', item: '非流动资产', amount: 2150000, level: 1 },
      { key: '7', item: '  固定资产', amount: 1600000, level: 2 },
      { key: '8', item: '  无形资产', amount: 350000, level: 2 },
      { key: '9', item: '  其他非流动资产', amount: 200000, level: 2 },
      { key: '10', item: '资产合计', amount: 4000000, level: 1, isTotal: true },
    ],
    liabilities: [
      { key: '1', item: '流动负债', amount: 920000, level: 1 },
      { key: '2', item: '  应付账款', amount: 450000, level: 2 },
      { key: '3', item: '  短期借款', amount: 300000, level: 2 },
      { key: '4', item: '  其他流动负债', amount: 170000, level: 2 },
      { key: '5', item: '非流动负债', amount: 280000, level: 1 },
      { key: '6', item: '  长期借款', amount: 200000, level: 2 },
      { key: '7', item: '  其他非流动负债', amount: 80000, level: 2 },
      { key: '8', item: '负债合计', amount: 1200000, level: 1, isTotal: true },
    ],
    equity: [
      { key: '1', item: '实收资本', amount: 2000000, level: 1 },
      { key: '2', item: '盈余公积', amount: 300000, level: 1 },
      { key: '3', item: '未分配利润', amount: 500000, level: 1 },
      { key: '4', item: '所有者权益合计', amount: 2800000, level: 1, isTotal: true },
    ],
  }

  // 现金流量表数据
  const cashFlowData = [
    { key: '1', item: '一、经营活动产生的现金流量', amount: 520000, level: 1 },
    { key: '2', item: '  销售商品收到的现金', amount: 2680000, level: 2 },
    { key: '3', item: '  购买商品支付的现金', amount: -1560000, level: 2, isNegative: true },
    { key: '4', item: '  支付职工薪酬', amount: -450000, level: 2, isNegative: true },
    { key: '5', item: '  支付税费', amount: -150000, level: 2, isNegative: true },
    { key: '6', item: '二、投资活动产生的现金流量', amount: -180000, level: 1, isNegative: true },
    { key: '7', item: '  购建固定资产', amount: -180000, level: 2, isNegative: true },
    { key: '8', item: '三、筹资活动产生的现金流量', amount: -100000, level: 1, isNegative: true },
    { key: '9', item: '  偿还借款', amount: -100000, level: 2, isNegative: true },
    { key: '10', item: '四、现金净增加额', amount: 240000, level: 1, isTotal: true },
  ]

  // 表格列定义
  const getColumns = (showRatio = false): ColumnsType<any> => [
    {
      title: '项目',
      dataIndex: 'item',
      render: (text: string, record: any) => (
        <Text
          strong={record.level === 1 || record.isTotal}
          style={{
            paddingLeft: (record.level - 1) * 16,
            color: record.isTotal ? '#6600ff' : record.level === 1 ? '#f1f5f9' : '#94a3b8',
          }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 150,
      align: 'right',
      render: (amount: number, record: any) => (
        <Text
          strong={record.isTotal || record.isHighlight}
          style={{
            color: record.isTotal ? '#6600ff' : record.isNegative ? '#ff4d4f' : '#52c41a',
          }}
        >
          {amount >= 0 ? '' : ''}¥{Math.abs(amount).toLocaleString()}
        </Text>
      ),
    },
    ...(showRatio ? [{
      title: '占比',
      dataIndex: 'ratio',
      width: 100,
      align: 'right' as const,
      render: (ratio: number) => <Text type="secondary">{ratio?.toFixed(1)}%</Text>,
    }] : []),
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">财务报表</Title>
          <Text type="secondary">企业财务状况分析</Text>
        </div>
        <div className="page-header-actions">
          <Select value={period} onChange={setPeriod} style={{ width: 150 }}>
            {PERIODS.map(p => (
              <Option key={p.value} value={p.value}>{p.label}</Option>
            ))}
          </Select>
          <Button icon={<PrinterOutlined />}>打印</Button>
          <Button type="primary" icon={<DownloadOutlined />}>导出</Button>
        </div>
      </div>

      {/* 关键指标 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">营业收入</Text>}
              value={2850000}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="green"><RiseOutlined /> 同比+15.2%</Tag>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">净利润</Text>}
              value={457500}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#6600ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="green"><RiseOutlined /> 同比+8.5%</Tag>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">毛利率</Text>}
              value={45.3}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#fa8c16' }}
            />
            <Progress percent={45.3} size="small" strokeColor="#fa8c16" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">净利率</Text>}
              value={16.1}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#13c2c2' }}
            />
            <Progress percent={16.1} size="small" strokeColor="#13c2c2" />
          </Card>
        </Col>
      </Row>

      {/* 报表 Tabs */}
      <Card className="daoda-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'profit',
              label: <><BarChartOutlined /> 利润表</>,
              children: (
                <Table
                  columns={getColumns(true)}
                  dataSource={profitData}
                  pagination={false}
                  size="small"
                  bordered
                />
              ),
            },
            {
              key: 'balance',
              label: <><PieChartOutlined /> 资产负债表</>,
              children: (
                <Row gutter={24}>
                  <Col span={12}>
                    <Title level={5}>资产</Title>
                    <Table
                      columns={getColumns()}
                      dataSource={balanceData.assets}
                      pagination={false}
                      size="small"
                      bordered
                    />
                  </Col>
                  <Col span={12}>
                    <Title level={5}>负债及所有者权益</Title>
                    <Table
                      columns={getColumns()}
                      dataSource={[...balanceData.liabilities, ...balanceData.equity]}
                      pagination={false}
                      size="small"
                      bordered
                    />
                  </Col>
                </Row>
              ),
            },
            {
              key: 'cashflow',
              label: <><LineChartOutlined /> 现金流量表</>,
              children: (
                <Table
                  columns={getColumns()}
                  dataSource={cashFlowData}
                  pagination={false}
                  size="small"
                  bordered
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}