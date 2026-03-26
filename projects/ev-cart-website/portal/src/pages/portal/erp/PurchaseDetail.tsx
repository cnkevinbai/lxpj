import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tag, Table, Button, Space, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import request from '@/shared/utils/request'
import type { PurchaseOrder } from './types'

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待审批' },
  approved: { color: 'blue', text: '已批准' },
  rejected: { color: 'red', text: '已拒绝' },
  completed: { color: 'green', text: '已完成' },
}

// 模拟数据
const mockDetail: PurchaseOrder = {
  id: '1',
  no: 'PO20260312001',
  supplierId: 's1',
  supplierName: '四川钢铁集团',
  totalAmount: 125000,
  status: 'pending',
  createdAt: '2026-03-12 10:30:00',
  items: [
    { productId: 'p1', productName: '钢材 A 型', quantity: 100, unitPrice: 500, amount: 50000 },
    { productId: 'p2', productName: '钢材 B 型', quantity: 50, unitPrice: 1500, amount: 75000 },
  ],
}

// 模拟 API 调用
const purchaseApi = {
  getDetail: async (id: string) => {
    // TODO: 实际 API 调用
    return mockDetail
  },
}

export default function PurchaseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<PurchaseOrder | null>(mockDetail)

  const itemColumns = [
    { title: '产品名称', dataIndex: 'productName', key: 'productName' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单价 (元)', dataIndex: 'unitPrice', key: 'unitPrice', render: (v: number) => `¥${v.toLocaleString()}` },
    { title: '金额 (元)', dataIndex: 'amount', key: 'amount', render: (v: number) => `¥${v.toLocaleString()}` },
  ]

  const handleApprove = async () => {
    try {
      await purchaseApi.approve(id!)
      message.success('审批通过')
      setData({ ...data!, status: 'approved' })
    } catch (error) {
      message.error('审批失败')
    }
  }

  if (!data) return null

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/purchase')}>
          返回列表
        </Button>
      </div>

      <Card title={`采购订单 - ${data.no}`} style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="采购单号">{data.no}</Descriptions.Item>
          <Descriptions.Item label="供应商">{data.supplierName}</Descriptions.Item>
          <Descriptions.Item label="订单金额">¥{data.totalAmount.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusMap[data.status].color}>{statusMap[data.status].text}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createdAt}</Descriptions.Item>
          {data.approvedAt && (
            <Descriptions.Item label="批准时间">{data.approvedAt}</Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title="产品明细" style={{ marginBottom: 16 }}>
        <Table
          columns={itemColumns}
          dataSource={data.items}
          rowKey="productId"
          pagination={false}
          summary={(pageData) => {
            const total = pageData.reduce((sum, item) => sum + item.amount, 0)
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <strong>合计</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <strong>¥{total.toLocaleString()}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }}
        />
      </Card>

      {data.status === 'pending' && (
        <Card>
          <Space>
            <Button type="primary" onClick={handleApprove}>
              批准
            </Button>
            <Button danger>拒绝</Button>
          </Space>
        </Card>
      )}
    </div>
  )
}
