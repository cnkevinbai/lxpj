import React, { useState } from 'react'
import { Card, Input, Button, Progress, Table, Tag, Space, Descriptions } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { productionApi } from '@/services/production'

interface ProductionOrder {
  production_order_id: string
  product_name: string
  quantity: number
  status: string
  progress: number
  planned_start_date: string
  planned_end_date: string
  actual_start_date?: string
  estimated_delivery_date: string
}

const ProgressQuery: React.FC = () => {
  const [orderId, setOrderId] = useState('')
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!orderId) return
    setLoading(true)
    try {
      const result = await productionApi.getProgress(orderId)
      setProgress(result)
    } catch (error) {
      console.error('查询生产进度失败', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      planned: 'blue',
      in_progress: 'orange',
      completed: 'green',
      delayed: 'red',
    }
    return colorMap[status] || 'default'
  }

  const columns = [
    { title: '生产工单号', dataIndex: 'production_order_id', key: 'production_order_id' },
    { title: '产品名称', dataIndex: 'product_name', key: 'product_name' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => <Progress percent={progress} />
    },
    { title: '预计交付', dataIndex: 'estimated_delivery_date', key: 'estimated_delivery_date' },
  ]

  return (
    <div className="p-4">
      <Card title="生产进度查询">
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="请输入销售订单号"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
            查询
          </Button>
        </div>

        {progress && (
          <>
            <Card className="mb-4" size="small">
              <Descriptions title="订单概况" column={3}>
                <Descriptions.Item label="订单号">{progress.order_id}</Descriptions.Item>
                <Descriptions.Item label="总体进度">
                  <Progress percent={progress.overall_progress} />
                </Descriptions.Item>
                <Descriptions.Item label="预计交付日期">
                  {progress.estimated_delivery_date}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Table
              columns={columns}
              dataSource={progress.production_orders}
              rowKey="production_order_id"
              pagination={false}
            />
          </>
        )}
      </Card>
    </div>
  )
}

export default ProgressQuery
