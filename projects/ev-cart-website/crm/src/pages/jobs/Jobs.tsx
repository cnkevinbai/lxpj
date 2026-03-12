import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Input, Select, Modal, message, Card, Statistic, Row, Col, Popconfirm } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Job {
  id: string
  jobCode: string
  title: string
  department: string
  location: string
  jobType: string
  experience: string
  education: string
  salaryMin: number
  salaryMax: number
  headcount: number
  appliedCount: number
  status: string
  publishedAt: string
  createdAt: string
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [searchText, setSearchText] = useState('')
  const [filterDepartment, setFilterDepartment] = useState<string>()
  const [filterStatus, setFilterStatus] = useState<string>()
  const [statistics, setStatistics] = useState<any>({})

  const statusColors: Record<string, string> = {
    draft: 'default',
    published: 'success',
    closed: 'error',
  }

  const statusLabels: Record<string, string> = {
    draft: '草稿',
    published: '招聘中',
    closed: '已关闭',
  }

  const jobTypeLabels: Record<string, string> = {
    full_time: '全职',
    part_time: '兼职',
    intern: '实习',
    contract: '合同',
  }

  // 获取职位列表
  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (searchText) params.append('search', searchText)
      if (filterDepartment) params.append('department', filterDepartment)
      if (filterStatus) params.append('status', filterStatus)

      const response = await fetch(`/api/v1/jobs?${params}`)
      const data = await response.json()
      setJobs(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      message.error('加载职位列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/v1/jobs/statistics')
      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error('获取统计数据失败', error)
    }
  }

  useEffect(() => {
    fetchJobs()
    fetchStatistics()
  }, [page, limit, filterDepartment, filterStatus])

  // 删除职位
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/jobs/${id}`, { method: 'DELETE' })
      message.success('删除成功')
      fetchJobs()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns: ColumnsType<Job> = [
    {
      title: '职位编码',
      dataIndex: 'jobCode',
      key: 'jobCode',
      width: 120,
    },
    {
      title: '职位名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '工作地点',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '职位类型',
      dataIndex: 'jobType',
      key: 'jobType',
      width: 80,
      render: (type) => jobTypeLabels[type] || type,
    },
    {
      title: '经验要求',
      dataIndex: 'experience',
      key: 'experience',
      width: 100,
      render: (exp) => exp || '不限',
    },
    {
      title: '学历要求',
      dataIndex: 'education',
      key: 'education',
      width: 100,
    },
    {
      title: '薪资范围',
      key: 'salary',
      width: 120,
      render: (_, record) => (
        <span>
          ¥{(record.salaryMin || 0).toLocaleString()} - ¥{(record.salaryMax || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: '招聘人数',
      dataIndex: 'headcount',
      key: 'headcount',
      width: 80,
    },
    {
      title: '已申请',
      dataIndex: 'appliedCount',
      key: 'appliedCount',
      width: 80,
      render: (count) => (
        <span style={{ color: count > 0 ? '#1890ff' : '#999' }}>{count}人</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: '发布日期',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => window.location.href = `/jobs/${record.id}`}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => window.location.href = `/jobs/${record.id}/edit`}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此职位吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="在招职位"
              value={statistics.published || 0}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月新增"
              value={statistics.newThisMonth || 0}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
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
              title="待面试"
              value={statistics.pendingInterviews || 0}
              suffix="人"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索职位名称"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={fetchJobs}
          />
          <Select
            placeholder="部门"
            style={{ width: 120 }}
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
          <Select
            placeholder="状态"
            style={{ width: 100 }}
            allowClear
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: '草稿', value: 'draft' },
              { label: '招聘中', value: 'published' },
              { label: '已关闭', value: 'closed' },
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={fetchJobs}>
            查询
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => window.location.href = '/jobs/create'}
          >
            发布职位
          </Button>
        </Space>
      </Card>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={jobs}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPage(page)
            setLimit(pageSize || 20)
          },
        }}
        scroll={{ x: 1400 }}
      />
    </div>
  )
}

export default Jobs
