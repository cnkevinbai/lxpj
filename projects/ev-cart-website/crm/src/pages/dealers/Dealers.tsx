import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Input, Select, Modal, message, Popconfirm, Card, Statistic, Row, Col } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Dealer {
  id: string
  dealerCode: string
  companyName: string
  contactPerson: string
  contactPhone: string
  province: string
  city: string
  level: string
  status: string
  salesTarget: number
  salesActual: number
  performanceScore: number
  lastAssessmentGrade: string
  totalRebate: number
  createdAt: string
}

interface DealerListProps {
  onDealerSelect?: (dealerId: string) => void
}

const DealerList: React.FC<DealerListProps> = ({ onDealerSelect }) => {
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [searchText, setSearchText] = useState('')
  const [filterProvince, setFilterProvince] = useState<string>()
  const [filterLevel, setFilterLevel] = useState<string>()
  const [filterStatus, setFilterStatus] = useState<string>()
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [statistics, setStatistics] = useState<any>({})

  const levelColors: Record<string, string> = {
    trial: 'default',
    standard: 'blue',
    gold: 'gold',
    platinum: 'purple',
    strategic: 'red',
  }

  const levelLabels: Record<string, string> = {
    trial: '试用',
    standard: '标准',
    gold: '金牌',
    platinum: '白金',
    strategic: '战略',
  }

  const statusColors: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    suspended: 'error',
  }

  const statusLabels: Record<string, string> = {
    active: '活跃',
    inactive: '未激活',
    suspended: '已停用',
  }

  // 获取经销商列表
  const fetchDealers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (searchText) params.append('search', searchText)
      if (filterProvince) params.append('province', filterProvince)
      if (filterLevel) params.append('level', filterLevel)
      if (filterStatus) params.append('status', filterStatus)

      const response = await fetch(`/api/v1/dealers?${params}`)
      const data = await response.json()
      setDealers(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      message.error('加载经销商列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/v1/dealers/statistics')
      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error('获取统计数据失败', error)
    }
  }

  useEffect(() => {
    fetchDealers()
    fetchStatistics()
  }, [page, limit, filterProvince, filterLevel, filterStatus])

  // 删除经销商
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/dealers/${id}`, { method: 'DELETE' })
      message.success('删除成功')
      fetchDealers()
    } catch (error) {
      message.error('删除失败')
    }
  }

  // 查看详情
  const handleViewDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/dealers/${id}`)
      const data = await response.json()
      setSelectedDealer(data)
      setDetailVisible(true)
      onDealerSelect?.(id)
    } catch (error) {
      message.error('加载详情失败')
    }
  }

  const columns: ColumnsType<Dealer> = [
    {
      title: '经销商编码',
      dataIndex: 'dealerCode',
      key: 'dealerCode',
      width: 150,
      fixed: 'left',
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 120,
    },
    {
      title: '区域',
      key: 'location',
      width: 150,
      render: (_, record) => `${record.province}·${record.city}`,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level) => (
        <Tag color={levelColors[level]}>{levelLabels[level] || level}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={statusColors[status]}>{statusLabels[status] || status}</Tag>
      ),
    },
    {
      title: '绩效分数',
      dataIndex: 'performanceScore',
      key: 'performanceScore',
      width: 100,
      render: (score) => (
        <span style={{ fontWeight: score >= 80 ? 'bold' : 'normal', color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f' }}>
          {score?.toFixed(1) || 0}分
        </span>
      ),
    },
    {
      title: '最后考核',
      dataIndex: 'lastAssessmentGrade',
      key: 'lastAssessmentGrade',
      width: 80,
      render: (grade) => grade || '-',
    },
    {
      title: '销售达成',
      key: 'sales',
      width: 120,
      render: (_, record) => {
        const rate = record.salesTarget ? (record.salesActual / record.salesTarget) * 100 : 0
        return (
          <span>
            {rate.toFixed(0)}%
            {rate >= 100 ? <RiseOutlined style={{ color: '#52c41a', marginLeft: 4 }} /> : <FallOutlined style={{ color: '#ff4d4f', marginLeft: 4 }} />}
          </span>
        )
      },
    },
    {
      title: '累计返利',
      dataIndex: 'totalRebate',
      key: 'totalRebate',
      width: 100,
      render: (amount) => `¥${(amount || 0).toLocaleString()}`,
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
            onClick={() => handleViewDetail(record.id)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => window.location.href = `/dealers/${record.id}/edit`}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此经销商吗？"
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
              title="经销商总数"
              value={statistics.total || 0}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃经销商"
              value={statistics.active || 0}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="金牌及以上"
              value={(statistics.levels?.gold || 0) + (statistics.levels?.platinum || 0) + (statistics.levels?.strategic || 0)}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售目标达成率"
              value={statistics.sales?.target ? ((statistics.sales?.actual / statistics.sales?.target) * 100).toFixed(1) : 0}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索公司名称/联系人"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={fetchDealers}
          />
          <Select
            placeholder="省份"
            style={{ width: 120 }}
            allowClear
            value={filterProvince}
            onChange={setFilterProvince}
            options={[
              { label: '广东', value: '广东' },
              { label: '江苏', value: '江苏' },
              { label: '浙江', value: '浙江' },
              { label: '山东', value: '山东' },
              { label: '四川', value: '四川' },
            ]}
          />
          <Select
            placeholder="等级"
            style={{ width: 100 }}
            allowClear
            value={filterLevel}
            onChange={setFilterLevel}
            options={[
              { label: '试用', value: 'trial' },
              { label: '标准', value: 'standard' },
              { label: '金牌', value: 'gold' },
              { label: '白金', value: 'platinum' },
              { label: '战略', value: 'strategic' },
            ]}
          />
          <Select
            placeholder="状态"
            style={{ width: 100 }}
            allowClear
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: '活跃', value: 'active' },
              { label: '未激活', value: 'inactive' },
              { label: '已停用', value: 'suspended' },
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={fetchDealers}>
            查询
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => window.location.href = '/dealers/create'}
          >
            新增经销商
          </Button>
        </Space>
      </Card>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={dealers}
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

      {/* 详情弹窗 */}
      <Modal
        title="经销商详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedDealer && (
          <div>
            <h3>基本信息</h3>
            <p><strong>经销商编码:</strong> {selectedDealer.dealerCode}</p>
            <p><strong>公司名称:</strong> {selectedDealer.companyName}</p>
            <p><strong>联系人:</strong> {selectedDealer.contactPerson}</p>
            <p><strong>联系电话:</strong> {selectedDealer.contactPhone}</p>
            <p><strong>区域:</strong> {selectedDealer.province}·{selectedDealer.city}</p>
            <p><strong>等级:</strong> <Tag color={levelColors[selectedDealer.level]}>{levelLabels[selectedDealer.level]}</Tag></p>
            <p><strong>状态:</strong> <Tag color={statusColors[selectedDealer.status]}>{statusLabels[selectedDealer.status]}</Tag></p>
            
            <h3>业绩数据</h3>
            <p><strong>销售目标:</strong> ¥{(selectedDealer.salesTarget || 0).toLocaleString()}</p>
            <p><strong>实际销售:</strong> ¥{(selectedDealer.salesActual || 0).toLocaleString()}</p>
            <p><strong>绩效分数:</strong> {selectedDealer.performanceScore?.toFixed(1) || 0}分</p>
            <p><strong>最后考核:</strong> {selectedDealer.lastAssessmentGrade || '-'}</p>
            <p><strong>累计返利:</strong> ¥{(selectedDealer.totalRebate || 0).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DealerList
