import { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Input, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import PageHeaderWrapper from '@shared/components/PageHeaderWrapper'

interface InventoryItem {
  id: string
  productId: string
  productName: string
  quantity: number
  warehouse: string
  location: string
}

const Inventory = () => {
  const [loading, setLoading] = useState(false)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [keyword, setKeyword] = useState('')

  const loadInventory = async () => {
    setLoading(true)
    try {
      // TODO: 调用实际 API
      setInventory([
        { id: '1', productId: 'P001', productName: '产品 A', quantity: 100, warehouse: '主仓库', location: 'A-01-01' },
        { id: '2', productId: 'P002', productName: '产品 B', quantity: 200, warehouse: '主仓库', location: 'A-02-01' },
        { id: '3', productId: 'P003', productName: '产品 C', quantity: 50, warehouse: '分仓库', location: 'B-01-01' },
      ])
    } catch (error) {
      console.error('加载失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadInventory() }, [])

  const columns = [
    { title: '产品 ID', dataIndex: 'productId', key: 'productId' },
    { title: '产品名称', dataIndex: 'productName', key: 'productName' },
    { title: '库存数量', dataIndex: 'quantity', key: 'quantity', render: (q: number) => (
        <Tag color={q < 50 ? 'red' : q < 100 ? 'orange' : 'green'}>{q}</Tag>
      )},
    { title: '仓库', dataIndex: 'warehouse', key: 'warehouse' },
    { title: '库位', dataIndex: 'location', key: 'location' },
    { title: '操作', key: 'action', render: (_: any) => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">入库</Button>
          <Button type="link" size="small">出库</Button>
        </Space>
      )},
  ]

  return (
    <PageHeaderWrapper title="库存管理" subtitle="入库、出库、调拨、盘点管理">
      <Input
        placeholder="搜索产品名称"
        prefix={<SearchOutlined />}
        style={{ width: 300, marginBottom: '16px' }}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Table loading={loading} columns={columns} dataSource={inventory} rowKey="id" pagination={{ showSizeChanger: true }} />
    </PageHeaderWrapper>
  )
}

export default Inventory
