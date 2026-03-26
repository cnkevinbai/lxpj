import { useState, useEffect } from 'react'
import { Table, Button, Space, Input, Tag, Modal } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import PageHeaderWrapper from '@shared/components/PageHeaderWrapper'
import { customerService } from '@shared/services/customer'

const Customers = () => {
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const response = await customerService.getList({ page, pageSize, keyword })
      setCustomers(response.data || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error('加载客户列表失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCustomers() }, [page, pageSize, keyword])

  const columns = [
    { title: '客户名称', dataIndex: 'name', key: 'name', fixed: 'left' },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = { ENTERPRISE: 'blue', INDIVIDUAL: 'green', GOVERNMENT: 'purple' }
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>
      }
    },
    { title: '行业', dataIndex: 'industry', key: 'industry' },
    { 
      title: '等级', 
      dataIndex: 'level', 
      key: 'level',
      render: (level: string) => {
        const colorMap: Record<string, string> = { A: 'red', B: 'orange', C: 'green' }
        return <Tag color={colorMap[level] || 'default'}>{level}</Tag>
      }
    },
    { title: '联系人', dataIndex: 'contactName', key: 'contactName' },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <PageHeaderWrapper
      title="客户管理"
      subtitle="管理企业客户信息"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          新建客户
        </Button>
      }
    >
      <div style={{ marginBottom: '16px' }}>
        <Input
          placeholder="搜索客户名称"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={() => { setPage(1); loadCustomers() }}
        />
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={customers}
        rowKey="id"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => { setPage(page); setPageSize(pageSize || 10) },
        }}
        scroll={{ x: 1200 }}
      />
    </PageHeaderWrapper>
  )
}

export default Customers
