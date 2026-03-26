import React, { useState, useEffect } from 'react'
import { Card, Table, Descriptions, Tag, Space, Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getCustomerFinance } from './service'

interface CustomerFinance {
  customer_id: string
  customer_name: string
  receivables: number
  payables: number
  credit_limit: number
  used_credit: number
  available_credit: number
}

const CustomerFinance: React.FC = () => {
  const [data, setData] = useState<CustomerFinance[]>([])
  const [loading, setLoading] = useState(false)
  const [searchCustomer, setSearchCustomer] = useState('')

  useEffect(() => {
    loadFinance()
  }, [])

  const loadFinance = async () => {
    setLoading(true)
    try {
      // 使用 mock 数据
      const mockData: CustomerFinance[] = [
        {
          customer_id: 'C001',
          customer_name: '某某景区',
          receivables: 125000,
          payables: 45000,
          credit_limit: 500000,
          used_credit: 125000,
          available_credit: 375000,
        },
        {
          customer_id: 'C002',
          customer_name: '某某园区',
          receivables: 88000,
          payables: 32000,
          credit_limit: 300000,
          used_credit: 88000,
          available_credit: 212000,
        },
      ]
      setData(mockData)
    } catch (error) {
      console.error('加载财务数据失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchCustomer) {
      loadFinance()
      return
    }
    setLoading(true)
    try {
      // 使用 mock 数据
      const mockData: CustomerFinance[] = [
        {
          customer_id: 'C' + searchCustomer,
          customer_name: searchCustomer,
          receivables: 50000,
          payables: 20000,
          credit_limit: 200000,
          used_credit: 50000,
          available_credit: 150000,
        },
      ]
      setData(mockData)
    } catch (error) {
      console.error('查询财务数据失败', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: '客户编号', dataIndex: 'customer_id', key: 'customer_id' },
    { title: '客户名称', dataIndex: 'customer_name', key: 'customer_name' },
    { 
      title: '应收账款', 
      dataIndex: 'receivables', 
      key: 'receivables',
      render: (val: number) => <span className="text-red-600">¥{val.toLocaleString()}</span>
    },
    { 
      title: '应付账款', 
      dataIndex: 'payables', 
      key: 'payables',
      render: (val: number) => <span>¥{val.toLocaleString()}</span>
    },
    { 
      title: '信用额度', 
      dataIndex: 'credit_limit', 
      key: 'credit_limit',
      render: (val: number) => <span>¥{val.toLocaleString()}</span>
    },
    { 
      title: '已用额度', 
      dataIndex: 'used_credit', 
      key: 'used_credit',
      render: (val: number, record: CustomerFinance) => {
        const percent = (val / record.credit_limit) * 100
        return (
          <div>
            <span>¥{val.toLocaleString()}</span>
            <div className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${percent > 80 ? 'bg-red-600' : 'bg-green-600'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        )
      }
    },
    { 
      title: '可用额度', 
      dataIndex: 'available_credit', 
      key: 'available_credit',
      render: (val: number) => <span className="text-green-600">¥{val.toLocaleString()}</span>
    },
  ]

  return (
    <div className="p-4">
      <Card title="客户财务数据">
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="请输入客户编号或名称"
            value={searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={loadFinance}>刷新</Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="customer_id"
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  )
}

export default CustomerFinance
