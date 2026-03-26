/**
 * 产品详情页面
 * 统一UI风格
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Descriptions, Tag, Button, Tabs, Table, Typography, Space, message } from 'antd'
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

// 产品类型映射
const typeMap: Record<string, { color: string; text: string }> = {
  FINISHED: { color: 'blue', text: '成品' },
  SEMI_FINISHED: { color: 'purple', text: '半成品' },
  RAW: { color: 'orange', text: '原料' },
  CONSUMABLE: { color: 'cyan', text: '耗材' },
}

// 状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '在售' },
  INACTIVE: { color: 'default', text: '停售' },
  DISCONTINUED: { color: 'red', text: '停产' },
}

// 模拟产品详情数据
const mockProductDetail = {
  id: '1',
  code: 'PRD001',
  name: '智能控制器 A100',
  type: 'FINISHED',
  category: '电子产品',
  unit: '台',
  status: 'ACTIVE',
  price: 2999,
  cost: 1800,
  stock: 156,
  minStock: 50,
  maxStock: 500,
  weight: 1.5,
  specifications: '220V/50Hz, 功率500W, IP65防护等级',
  description: '高性能工业智能控制器，支持多种通讯协议，适用于自动化生产线控制。',
  createdAt: '2024-01-15',
  updatedAt: '2024-03-01',
  createdBy: '管理员',
}

// 模拟库存记录
const mockStockRecords = [
  { id: '1', type: '入库', quantity: 100, warehouse: '主仓库', date: '2024-03-01', operator: '张三' },
  { id: '2', type: '出库', quantity: 30, warehouse: '主仓库', date: '2024-03-05', operator: '李四' },
  { id: '3', type: '入库', quantity: 50, warehouse: '主仓库', date: '2024-03-10', operator: '张三' },
  { id: '4', type: '出库', quantity: 20, warehouse: '主仓库', date: '2024-03-15', operator: '王五' },
]

// 模拟BOM清单
const mockBomList = [
  { id: '1', code: 'MAT001', name: 'PCB主板', quantity: 1, unit: '块' },
  { id: '2', code: 'MAT002', name: '外壳组件', quantity: 1, unit: '套' },
  { id: '3', code: 'MAT003', name: '显示屏', quantity: 1, unit: '块' },
  { id: '4', code: 'MAT004', name: '按键模组', quantity: 1, unit: '套' },
]

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState(mockProductDetail)

  // 库存记录表格列
  const stockColumns = [
    { title: '类型', dataIndex: 'type', width: 80, render: (v: string) => (
      <Tag color={v === '入库' ? 'green' : 'red'}>{v}</Tag>
    )},
    { title: '数量', dataIndex: 'quantity', width: 100 },
    { title: '仓库', dataIndex: 'warehouse', width: 120 },
    { title: '日期', dataIndex: 'date', width: 120 },
    { title: '操作人', dataIndex: 'operator', width: 100 },
  ]

  // BOM清单表格列
  const bomColumns = [
    { title: '物料编码', dataIndex: 'code', width: 120 },
    { title: '物料名称', dataIndex: 'name', width: 200 },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '单位', dataIndex: 'unit', width: 80 },
  ]

  return (
    <div className="page-container">
      {/* 页面标题区 */}
      <div className="page-header">
        <div className="page-header-left">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/erp/products')}>
            返回
          </Button>
          <Title level={4} className="page-header-title" style={{ marginLeft: 16 }}>
            产品详情
          </Title>
        </div>
        <div className="page-header-actions">
          <Button icon={<EditOutlined />} onClick={() => message.info('编辑功能开发中')}>
            编辑
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => message.info('删除功能开发中')}>
            删除
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* 基本信息 */}
        <Col xs={24} lg={16}>
          <Card className="daoda-card" title="基本信息">
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="产品编码">{product.code}</Descriptions.Item>
              <Descriptions.Item label="产品名称">{product.name}</Descriptions.Item>
              <Descriptions.Item label="产品类型">
                <Tag color={typeMap[product.type]?.color}>{typeMap[product.type]?.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="产品分类">{product.category}</Descriptions.Item>
              <Descriptions.Item label="单位">{product.unit}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[product.status]?.color}>{statusMap[product.status]?.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="销售单价">¥{product.price.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="成本价">¥{product.cost.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="重量">{product.weight} kg</Descriptions.Item>
              <Descriptions.Item label="规格参数" span={3}>{product.specifications}</Descriptions.Item>
              <Descriptions.Item label="产品描述" span={3}>{product.description}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{product.createdAt}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{product.updatedAt}</Descriptions.Item>
              <Descriptions.Item label="创建人">{product.createdBy}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 库存信息 */}
        <Col xs={24} lg={8}>
          <Card className="daoda-card" title="库存信息">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Text type="secondary">当前库存</Text>
              <div style={{ fontSize: 36, fontWeight: 600, color: product.stock < product.minStock ? '#ff4d4f' : '#52c41a' }}>
                {product.stock} <Text type="secondary" style={{ fontSize: 16 }}>{product.unit}</Text>
              </div>
            </div>
            <Descriptions column={1} style={{ marginTop: 16 }}>
              <Descriptions.Item label="最低库存">{product.minStock} {product.unit}</Descriptions.Item>
              <Descriptions.Item label="最高库存">{product.maxStock} {product.unit}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <Button type="primary" icon={<ShoppingCartOutlined />} block>
                采购申请
              </Button>
              <Button icon={<HomeOutlined />} block onClick={() => navigate('/erp/inventory')}>
                库存管理
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 详细信息标签页 */}
      <Card className="daoda-card" style={{ marginTop: 16 }}>
        <Tabs
          defaultActiveKey="stock"
          items={[
            {
              key: 'stock',
              label: '库存记录',
              children: (
                <Table
                  className="daoda-table"
                  columns={stockColumns}
                  dataSource={mockStockRecords}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              ),
            },
            {
              key: 'bom',
              label: 'BOM清单',
              children: (
                <Table
                  className="daoda-table"
                  columns={bomColumns}
                  dataSource={mockBomList}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}