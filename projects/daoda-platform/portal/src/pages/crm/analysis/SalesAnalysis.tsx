/**
 * 销售分析页面
 * 销售数据看板：销售额趋势、客户分布、订单状态等
 */
import { useState } from 'react'
import { Card, Row, Col, Statistic, Space, DatePicker, Table, Tag, Progress } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { orderService, OrderStatistics } from '@/services/order.service'
import { customerService } from '@/services/customer.service'
import { opportunityService, OpportunityStage, stageMap } from '@/services/opportunity.service'
import { Pie, Column, Line } from '@ant-design/plots'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

// 订单状态映射
const orderStatusMap: Record<string, { color: string; text: string }> = {
  PENDING: { color: 'orange', text: '待确认' },
  CONFIRMED: { color: 'blue', text: '已确认' },
  PRODUCING: { color: 'purple', text: '生产中' },
  SHIPPED: { color: 'cyan', text: '已发货' },
  COMPLETED: { color: 'green', text: '已完成' },
  CANCELLED: { color: 'red', text: '已取消' },
}

export default function SalesAnalysis() {
  // 日期范围
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ])

  // 获取订单统计
  const { data: orderStats } = useQuery<OrderStatistics>({
    queryKey: ['orderStatistics', dateRange],
    queryFn: () => orderService.getStatistics({
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
    }),
  })

  // 获取订单列表（用于状态分布）
  const { data: orders } = useQuery({
    queryKey: ['ordersForAnalysis', dateRange],
    queryFn: () => orderService.getList({
      page: 1,
      pageSize: 100,
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
    }),
  })

  // 获取客户统计
  const { data: customers } = useQuery({
    queryKey: ['customersForAnalysis'],
    queryFn: () => customerService.getList({ page: 1, pageSize: 100 }),
  })

  // 获取商机列表
  const { data: opportunities } = useQuery({
    queryKey: ['opportunitiesForAnalysis'],
    queryFn: () => opportunityService.getList({ page: 1, pageSize: 100 }),
  })

  // 计算订单状态分布
  const orderStatusDistribution = orders?.list.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // 计算客户级别分布
  const customerLevelDistribution = customers?.list.reduce((acc, customer) => {
    acc[customer.level] = (acc[customer.level] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // 计算商机阶段分布
  const opportunityStageDistribution = opportunities?.list.reduce((acc, opp) => {
    acc[opp.stage] = (acc[opp.stage] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // 计算销售趋势数据（按天）
  const salesTrendData = orders?.list.reduce((acc, order) => {
    const date = dayjs(order.createdAt).format('YYYY-MM-DD')
    const existing = acc.find(item => item.date === date)
    if (existing) {
      existing.sales += order.totalAmount
      existing.count += 1
    } else {
      acc.push({ date, sales: order.totalAmount, count: 1 })
    }
    return acc
  }, [] as { date: string; sales: number; count: number }[]) || []

  // 排序趋势数据
  salesTrendData.sort((a, b) => a.date.localeCompare(b.date))

  // 计算客户地区分布
  const regionDistribution = customers?.list.reduce((acc, customer) => {
    const region = customer.province || '未知'
    acc[region] = (acc[region] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // 订单状态分布图表数据
  const orderStatusPieData = Object.entries(orderStatusDistribution).map(([key, value]) => ({
    type: orderStatusMap[key]?.text || key,
    value: value,
  }))

  // 客户级别分布图表数据
  const customerLevelPieData = Object.entries(customerLevelDistribution).map(([key, value]) => ({
    type: `${key}级`,
    value: value,
  }))

  // 商机阶段分布图表数据
  const opportunityStagePieData = Object.entries(opportunityStageDistribution).map(([key, value]) => ({
    type: stageMap[key as OpportunityStage]?.text || key,
    value: value,
  }))

  // 地区分布图表数据
  const regionPieData = Object.entries(regionDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, value]) => ({
      type: key,
      value: value,
    }))

  // 销售趋势图表配置
  const lineConfig = {
    data: salesTrendData,
    xField: 'date',
    yField: 'sales',
    seriesField: 'sales',
    point: { size: 5, shape: 'circle' },
    label: {
      style: { fill: '#aaa' },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '销售额',
        value: `¥${datum.sales.toLocaleString()}`,
      }),
    },
    color: ['#1890ff'],
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  }

  // 订单状态饼图配置
  const orderStatusPieConfig = {
    appendPadding: 10,
    data: orderStatusPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    color: ['#fa8c16', '#1890ff', '#722ed1', '#13c2c2', '#52c41a', '#ff4d4f'],
  }

  // 客户级别饼图配置
  const customerLevelPieConfig = {
    appendPadding: 10,
    data: customerLevelPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    color: ['#faad14', '#1890ff', '#8c8c8c'],
  }

  // 商机阶段柱状图配置
  const opportunityStageColumnConfig = {
    data: opportunityStagePieData,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle',
      style: { fill: '#FFFFFF' },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '数量',
        value: datum.value,
      }),
    },
    color: ['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#722ed1', '#52c41a', '#ff4d4f'],
  }

  // 地区分布条形图配置
  const regionColumnConfig = {
    data: regionPieData,
    xField: 'value',
    yField: 'type',
    seriesField: 'type',
    legend: { position: 'top', layout: 'horizontal' },
    label: {
      position: 'right',
      style: { fill: '#000' },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '客户数',
        value: datum.value,
      }),
    },
  }

  // 最近订单表格
  const recentOrdersColumns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '客户', dataIndex: 'customerName', key: 'customerName' },
    { 
      title: '金额', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={orderStatusMap[status]?.color || 'default'}>
          {orderStatusMap[status]?.text || status}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD'),
    },
  ]

  return (
    <div>
      {/* 顶部筛选 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>统计周期：</span>
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
          />
        </Space>
      </Card>

      {/* 核心指标卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={orderStats?.total || 0}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售总额"
              value={orderStats?.totalAmount || 0}
              precision={2}
              prefix="¥"
              suffix=""
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => `¥${(Number(value) / 10000).toFixed(2)}万`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已收款金额"
              value={orderStats?.paidAmount || 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => `¥${(Number(value) / 10000).toFixed(2)}万`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="完成率"
              value={orderStats?.total ? Math.round(((orderStats?.completed || 0) / orderStats?.total) * 100) : 0}
              suffix="%"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 销售趋势图 */}
      <Card title="销售趋势" style={{ marginBottom: 16 }}>
        {salesTrendData.length > 0 ? (
          <Line {...lineConfig} style={{ height: 300 }} />
        ) : (
          <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            暂无数据
          </div>
        )}
      </Card>

      {/* 图表行 1 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card title="订单状态分布">
            {orderStatusPieData.length > 0 ? (
              <Pie {...orderStatusPieConfig} height={300} />
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                暂无数据
              </div>
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="客户级别分布">
            {customerLevelPieData.length > 0 ? (
              <Pie {...customerLevelPieConfig} height={300} />
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                暂无数据
              </div>
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="商机阶段分布">
            {opportunityStagePieData.length > 0 ? (
              <Column {...opportunityStageColumnConfig} height={300} />
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                暂无数据
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 图表行 2 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="客户地区分布 TOP10">
            {regionPieData.length > 0 ? (
              <Column {...regionColumnConfig} height={300} />
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                暂无数据
              </div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近订单">
            <Table
              dataSource={orders?.list?.slice(0, 10) || []}
              columns={recentOrdersColumns}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 商机漏斗 */}
      <Card title="商机漏斗">
        {opportunities && opportunities.list.length > 0 ? (
          <Row gutter={16}>
            {Object.entries(stageMap).map(([key, value], _index) => {
              const count = opportunityStageDistribution[key] || 0
              const maxCount = Math.max(...Object.values(opportunityStageDistribution), 1)
              const percentage = Math.round((count / maxCount) * 100)
              return (
                <Col span={3} key={key}>
                  <div style={{ textAlign: 'center' }}>
                    <Tag color={value.color} style={{ marginBottom: 8 }}>{value.text}</Tag>
                    <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>{count}</div>
                    <div style={{ color: '#999', fontSize: 12 }}>个商机</div>
                    <Progress 
                      percent={percentage} 
                      size="small" 
                      showInfo={false}
                      strokeColor={value.color}
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </Col>
              )
            })}
          </Row>
        ) : (
          <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            暂无数据
          </div>
        )}
      </Card>
    </div>
  )
}
