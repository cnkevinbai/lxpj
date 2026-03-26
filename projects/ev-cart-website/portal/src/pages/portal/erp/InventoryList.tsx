import { useState } from 'react'
import { Card, Table, Tag, Input, Progress, Space, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

interface Inventory {
  id: string
  sku: string
  productName: string
  quantity: number
  unit: string
  location: string
  minStock: number
  maxStock: number
  lastUpdated: string
}

const { Search } = Input

// 模拟数据
const mockData: Inventory[] = [
  { id: '1', sku: 'SKU001', productName: '钢材 A 型', quantity: 500, unit: '吨', location: 'A-01-01', minStock: 100, maxStock: 1000, lastUpdated: '2026-03-12 10:00:00' },
  { id: '2', sku: 'SKU002', productName: '钢材 B 型', quantity: 80, unit: '吨', location: 'A-01-02', minStock: 100, maxStock: 800, lastUpdated: '2026-03-12 09:30:00' },
  { id: '3', sku: 'SKU003', productName: '电子元件 A', quantity: 2000, unit: '个', location: 'B-02-01', minStock: 500, maxStock: 5000, lastUpdated: '2026-03-11 16:00:00' },
  { id: '4', sku: 'SKU004', productName: '电子元件 B', quantity: 1500, unit: '个', location: 'B-02-02', minStock: 300, maxStock: 3000, lastUpdated: '2026-03-11 14:00:00' },
  { id: '5', sku: 'SKU005', productName: '机械零件 C', quantity: 300, unit: '件', location: 'C-03-01', minStock: 100, maxStock: 500, lastUpdated: '2026-03-10 11:00:00' },
  { id: '6', sku: 'SKU006', productName: '原材料 D', quantity: 50, unit: 'kg', location: 'D-04-01', minStock: 200, maxStock: 1000, lastUpdated: '2026-03-10 09:00:00' },
]

export default function InventoryList() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  const columns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku', width: 100 },
    { title: '产品名称', dataIndex: 'productName', key: 'productName', width: 180 },
    { 
      title: '库存数量', 
      dataIndex: 'quantity', 
      key: 'quantity',
      width: 120,
      render: (qty: number, record: Inventory) => {
        const percent = (qty / record.maxStock) * 100
        const color = qty < record.minStock ? 'red' : qty > record.maxStock * 0.9 ? 'orange' : 'green'
        return (
          <div>
            <div style={{ fontWeight: 'bold', color }}>{qty} {record.unit}</div>
            <Progress percent={percent} size="small" showInfo={false} strokeColor={color} style={{ marginTop: 4 }} />
          </div>
        )
      }
    },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '库位', dataIndex: 'location', key: 'location', width: 100 },
    { 
      title: '状态', 
      key: 'status',
      width: 100,
      render: (_: any, record: Inventory) => {
        if (record.quantity < record.minStock) {
          return <Tag color="red">库存不足</Tag>
        }
        if (record.quantity > record.maxStock * 0.9) {
          return <Tag color="orange">库存偏高</Tag>
        }
        return <Tag color="green">正常</Tag>
      }
    },
    { title: '最后更新', dataIndex: 'lastUpdated', key: 'lastUpdated', width: 160 },
  ]

  const filteredData = mockData.filter(item =>
    item.sku.toLowerCase().includes(searchText.toLowerCase()) ||
    item.productName.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>库存管理</h1>
        <Space>
          <Button type="primary" onClick={() => navigate('/inventory/in')}>入库</Button>
          <Button type="primary" danger onClick={() => navigate('/inventory/out')}>出库</Button>
        </Space>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索 SKU 或产品名称"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          summary={(pageData) => {
            const totalQty = pageData.reduce((sum, item) => sum + item.quantity, 0)
            const warningCount = pageData.filter(item => item.quantity < item.minStock).length
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <strong>{totalQty} 件</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} colSpan={4}>
                    <span style={{ color: warningCount > 0 ? 'red' : 'green' }}>
                      库存预警：{warningCount} 个 SKU
                    </span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }}
        />
      </Card>
    </div>
  )
}
