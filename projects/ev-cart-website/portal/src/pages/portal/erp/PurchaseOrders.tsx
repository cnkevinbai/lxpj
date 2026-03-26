import { useState } from 'react'
import { Table, Button, Space, Tag, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import PageHeaderWrapper from '@shared/components/PageHeaderWrapper'

const PurchaseOrders = () => {
  const columns = [
    {
      title: '采购订单号',
      dataIndex: 'order_number',
      key: 'order_number',
    },
    {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
    },
    {
      title: '采购金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          draft: 'default',
          approved: 'blue',
          received: 'green',
          cancelled: 'red',
        }
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
        </Space>
      ),
    },
  ]

  return (
    <PageHeaderWrapper
      title="采购管理"
      subtitle="采购申请、采购订单、供应商管理"
      extra={<Button type="primary" icon={<PlusOutlined />}>新建采购订单</Button>}
    >
      <Table columns={columns} dataSource={[]} rowKey="id" />
    </PageHeaderWrapper>
  )
}

export default PurchaseOrders
