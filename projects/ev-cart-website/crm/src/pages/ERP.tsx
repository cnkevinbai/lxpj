import React, { useState, useEffect } from 'react'
import { Card, Tabs, Table, Statistic, Row, Col, Tag, Button, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const ERP: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [productionOrders, setProductionOrders] = useState([])
  const [exportOrders, setExportOrders] = useState([])

  const fetchPurchaseOrders = async () => {
    const response = await fetch('/api/v1/purchase/orders')
    const data = await response.json()
    setPurchaseOrders(data.data || [])
  }

  const fetchProductionOrders = async () => {
    const response = await fetch('/api/v1/production/orders')
    const data = await response.json()
    setProductionOrders(data.data || [])
  }

  const fetchExportOrders = async () => {
    const response = await fetch('/api/v1/export/orders')
    const data = await response.json()
    setExportOrders(data.data || [])
  }

  useEffect(() => {
    fetchPurchaseOrders()
    fetchProductionOrders()
    fetchExportOrders()
  }, [])

  const purchaseColumns = [
    { title: '采购单号', dataIndex: 'poCode', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', width: 200 },
    { title: '采购日期', dataIndex: 'orderDate', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { title: '金额', dataIndex: 'totalAmount', width: 120, render: (a: number) => `¥${a.toLocaleString()}` },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag>{s}</Tag> },
  ]

  const productionColumns = [
    { title: '工单号', dataIndex: 'moCode', width: 150 },
    { title: '产品', dataIndex: 'productName', width: 200 },
    { title: '计划数量', dataIndex: 'plannedQuantity', width: 100 },
    { title: '完成数量', dataIndex: 'completedQuantity', width: 100 },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag>{s}</Tag> },
  ]

  const exportColumns = [
    { title: '外贸单号', dataIndex: 'exportCode', width: 150 },
    { title: '客户', dataIndex: 'customerName', width: 200 },
    { title: '国家', dataIndex: 'country', width: 100 },
    { title: '金额', dataIndex: 'totalAmount', width: 120, render: (a: number) => `${a} USD` },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag>{s}</Tag> },
  ]

  return (
    <div>
      <Card title="🏭 ERP 系统">
        <Tabs>
          <Tabs.TabPane tab="采购管理" key="purchase">
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}><Card><Statistic title="采购订单" value={purchaseOrders.length} /></Card></Col>
            </Row>
            <Table columns={purchaseColumns} dataSource={purchaseOrders} rowKey="id" pagination={false} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="生产管理" key="production">
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}><Card><Statistic title="生产工单" value={productionOrders.length} /></Card></Col>
            </Row>
            <Table columns={productionColumns} dataSource={productionOrders} rowKey="id" pagination={false} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="外贸管理" key="export">
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}><Card><Statistic title="外贸订单" value={exportOrders.length} /></Card></Col>
            </Row>
            <Table columns={exportColumns} dataSource={exportOrders} rowKey="id" pagination={false} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default ERP
