import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Progress, Table, Tag, DatePicker, Select, message } from 'antd'
import { TeamOutlined, CheckCircleOutlined, ClockCircleOutlined, RiseOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Line, Bar, Pie } from '@ant-design/charts'

interface JobAnalytics {
  id: string
  title: string
  department: string
  appliedCount: number
  interviewCount: number
  offerCount: number
  hiredCount: number
  avgTimeToFill: number
}

const RecruitmentAnalytics: React.FC = () => {
  const [jobs, setJobs] = useState<JobAnalytics[]>([])
  const [statistics, setStatistics] = useState<any>({})
  const [filterDepartment, setFilterDepartment] = useState<string>()
  const [dateRange, setDateRange] = useState<[any, any]>()

  // 获取数据
  const fetchData = async () => {
    try {
      const response = await fetch('/api/v1/jobs/analytics')
      const data = await response.json()
      setJobs(data.jobs || [])
      setStatistics(data.statistics || {})
    } catch (error) {
      message.error('加载数据失败')
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterDepartment])

  // 部门分布数据
  const departmentData = Object.entries(statistics.byDepartment || {}).map(([key, value]) => ({
    department: key,
    count: (value as any).jobs || 0,
    resumes: (value as any).resumes || 0,
  }))

  const departmentPieConfig = {
    appendPadding: 10,
    data: departmentData,
    angleField: 'count',
    colorField: 'department',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  }

  // 招聘漏斗数据
  const funnelData = [
    { stage: '收到简历', count: statistics.totalResumes || 0 },
    { stage: '筛选通过', count: statistics.screeningPassed || 0 },
    { stage: '面试中', count: statistics.interviewing || 0 },
    { stage: '已发 Offer', count: statistics.offered || 0 },
    { stage: '已入职', count: statistics.hired || 0 },
  ]

  // 职位招聘情况表格
  const columns: ColumnsType<JobAnalytics> = [
    {
      title: '职位名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '收到简历',
      dataIndex: 'appliedCount',
      key: 'appliedCount',
      width: 100,
      sorter: (a, b) => a.appliedCount - b.appliedCount,
    },
    {
      title: '面试人数',
      dataIndex: 'interviewCount',
      key: 'interviewCount',
      width: 100,
    },
    {
      title: '发 Offer 数',
      dataIndex: 'offerCount',
      key: 'offerCount',
      width: 100,
    },
    {
      title: '已入职',
      dataIndex: 'hiredCount',
      key: 'hiredCount',
      width: 100,
      render: (count) => <span style={{ color: count > 0 ? '#52c41a' : '#999' }}>{count}人</span>,
    },
    {
      title: '平均到岗时间',
      dataIndex: 'avgTimeToFill',
      key: 'avgTimeToFill',
      width: 120,
      render: (days) => `${days || 0}天`,
    },
    {
      title: '招聘进度',
      key: 'progress',
      width: 150,
      render: (_, record) => (
        <Progress
          percent={record.hiredCount > 0 ? (record.hiredCount / record.appliedCount) * 100 : 0}
          size="small"
          strokeColor="#52c41a"
        />
      ),
    },
  ]

  return (
    <div>
      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Select
              placeholder="选择部门"
              style={{ width: 200 }}
              allowClear
              value={filterDepartment}
              onChange={setFilterDepartment}
              options={[
                { label: '技术部', value: '技术部' },
                { label: '销售部', value: '销售部' },
                { label: '市场部', value: '市场部' },
                { label: '人力资源部', value: '人力资源部' },
                { label: '财务部', value: '财务部' },
                { label: '运营部', value: '运营部' },
              ]}
            />
          </Col>
          <Col span={12}>
            <DatePicker.RangePicker
              onChange={(dates) => setDateRange(dates as [any, any])}
            />
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="在招职位"
              value={statistics.openJobs || 0}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="收到简历"
              value={statistics.totalResumes || 0}
              suffix="份"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="面试中"
              value={statistics.interviewing || 0}
              suffix="人"
              valueStyle={{ color: '#722ed1' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已入职"
              value={statistics.hired || 0}
              suffix="人"
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 招聘漏斗 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="招聘漏斗">
            <div style={{ padding: '20px 0' }}>
              {funnelData.map((item, index) => (
                <div key={item.stage} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>{item.stage}</span>
                    <strong>{item.count}人</strong>
                  </div>
                  <Progress
                    percent={funnelData[0].count ? (item.count / funnelData[0].count) * 100 : 0}
                    strokeColor={[
                      { color: '#f5222d', ratio: 0.2 },
                      { color: '#faad14', ratio: 0.5 },
                      { color: '#52c41a', ratio: 1 },
                    ]}
                    format={() => ''}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="部门职位分布">
            <Pie {...departmentPieConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 职位招聘情况 */}
      <Card title="📊 职位招聘情况">
        <Table
          columns={columns}
          dataSource={jobs}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  )
}

export default RecruitmentAnalytics
