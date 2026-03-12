import React, { useState, useEffect } from 'react'
import { Table, Card, Input, Button, Tag, Space, Alert } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { inventoryApi } from '@/services/inventory'

interface StockItem {
  material_id: string
  material_name: string
  specification: string
  unit: string
  total_stock: number
  locked_stock: number
  available_stock: number
  safety_stock: number
  warning: boolean
}

const StockQuery: React.FC = () => {
  const [data, setData] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchMaterial, setSearchMaterial] = useState('')

  useEffect(() => {
    loadStock()
  }, [])

  const loadStock = async () => {
    setLoading(true)
    try {
      const result = await inventoryApi.getStock()
      setData(result)
    } catch (error) {
      console.error('加载库存失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchMaterial) {
      loadStock()
      return
    }
    setLoading(true)
    try {
      const result = await inventoryApi.getStockByMaterial(searchMaterial)
      setData(result)
    } catch (error) {
      console.error('查询库存失败', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: '物料编码', dataIndex: 'material_id', key: 'material_id' },
    { title: '物料名称', dataIndex: 'material_name', key: 'material_name' },
    { title: '规格型号', dataIndex: 'specification', key: 'specification' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { 
      title: '总库存', 
      dataIndex: 'total_stock', 
      key: 'total_stock',
      render: (val: number) => <span className="font-medium">{val}</span>
    },
    { 
      title: '锁定库存', 
      dataIndex: 'locked_stock', 
      key: 'locked_stock',
      render: (val: number) => <span className="text-gray-500">{val}</span>
    },
    { 
      title: '可用库存', 
      dataIndex: 'available_stock', 
      key: 'available_stock',
      render: (val: number) => (
        <span className={`font-medium ${val < 10 ? 'text-red-600' : 'text-green-600'}`}>
          {val}
        </span>
      )
    },
    { 
      title: '安全库存', 
      dataIndex: 'safety_stock', 
      key: 'safety_stock' 
    },
    {
      title: '预警',
      key: 'warning',
      render: (_: any, record: StockItem) => (
        record.warning ? (
          <Tag color="red">库存不足</Tag>
        ) : (
          <Tag color="green">正常</Tag>
        )
      )
    }
  ]

  return (
    <div className="p-4">
      <Card title="库存查询">
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="请输入物料编码或名称"
            value={searchMaterial}
            onChange={(e) => setSearchMaterial(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={loadStock}>刷新</Button>
        </div>

        <Alert
          message="温馨提示"
          description="红色标记表示库存低于安全库存，请及时补货"
          type="info"
          showIcon
          className="mb-4"
        />

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="material_id"
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  )
}

export default StockQuery
