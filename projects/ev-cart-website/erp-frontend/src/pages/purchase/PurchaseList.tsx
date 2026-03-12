import { useState } from 'react'
import { Card, Table, Button, Tag, Space, Input, Modal, message } from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { purchaseApi } from '../../services/api'
import type { PurchaseOrder } from '../../types'

const { Search } = Input

// 模拟数据
const mockData: PurchaseOrder[] = [
  { id: '1', no: 'PO20260312001', supplierId: 's1', supplierName: '四川钢铁集团', totalAmount: 125000, status: 'pending', createdAt: '2026-03-12 10:30:00', items: [] },
  { id: '2', no: 'PO20260312002', supplierId: 's2', supplierName: '成都电子科技', totalAmount: 89000, status: 'approved', createdAt: '2026-03-12 09:15:00', items: [] },
  { id: '3', no: 'PO20260311001', supplierId: 's3', supplierName: '重庆机械制造', totalAmount: 230000, status: 'completed', createdAt: '2026-03-11 14:20:00', items: [] },
  { id: '4', no: 'PO20260311002', supplierId: 's4', supplierName: '绵阳材料供应', totalAmount: 67000, status: 'completed', createdAt: '2026-03-11 11:00:00', items: [] },
  { id: '5', no: 'PO20260310001', supplierId: 's1', supplierName: '四川钢铁集团', totalAmount: 178000, status: 'rejected', createdAt: '2026-03-10 16:45:00', items: [] },
]

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待审批' },
  approved: { color: 'blue', text: '已批准' },
  rejected: { color: 'red', text: '已拒绝' },
  completed: { color: 'green', text: '已完成' },
}

export default function PurchaseList() {
  const navigate = useNavigate()
  const [data, setData] = useState<PurchaseOrder[]>(mockData)
  const [searchText, setSearchText] = useState('')

  const columns = [
    { title: '采购单号', dataIndex: 'no', key: 'no', width: 160 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 180 },
    { 
      title: '金额 (元)', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      width: 120,
      render: (v: number) => `¥${v.toLocaleString()}`
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 100,
      render: (status: string) => {
        const s = statusMap[status] || { color: 'default', text: status }
        return <Tag color={s.color}>{s.text}</Tag>
      }
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: PurchaseOrder) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/purchase/${record.id}`)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该采购订单吗？',
      onOk: async () => {
        try {
          await purchaseApi.delete(id)
          message.success('删除成功')
          setData(data.filter(item => item.id !== id))
        } catch (error) {
          message.error('删除失败')
        }
      },
    })
  }

  const filteredData = data.filter(item =>
    item.no.toLowerCase().includes(searchText.toLowerCase()) ||
    item.supplierName.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>采购管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/purchase/create')}
        >
          新建采购
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索采购单号或供应商"
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
        />
      </Card>
    </div>
  )
}
