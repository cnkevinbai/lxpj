/**
 * 物料清单(BOM)管理页面
 * 统一UI风格
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Typography, Tree } from 'antd'
import { PlusOutlined, SearchOutlined, ExportOutlined, FolderOutlined, FileTextOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

// BOM状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '启用' },
  INACTIVE: { color: 'default', text: '停用' },
}

// 模拟BOM数据
const mockBomList = [
  { id: '1', code: 'BOM001', name: '智能控制器 A100 BOM', productId: 'PRD001', productName: '智能控制器 A100', version: 'V1.0', itemCount: 12, status: 'ACTIVE', createdAt: '2024-01-15' },
  { id: '2', code: 'BOM002', name: '伺服电机 SM-500 BOM', productId: 'PRD002', productName: '伺服电机 SM-500', version: 'V2.1', itemCount: 18, status: 'ACTIVE', createdAt: '2024-01-18' },
  { id: '3', code: 'BOM003', name: 'PLC控制板 BOM', productId: 'PRD003', productName: 'PLC控制板', version: 'V1.5', itemCount: 8, status: 'ACTIVE', createdAt: '2024-02-01' },
  { id: '4', code: 'BOM004', name: '工业传感器 IS-200 BOM', productId: 'PRD005', productName: '工业传感器 IS-200', version: 'V1.0', itemCount: 6, status: 'INACTIVE', createdAt: '2024-02-10' },
]

interface Bom {
  id: string
  code: string
  name: string
  productId: string
  productName: string
  version: string
  itemCount: number
  status: string
  createdAt: string
}

// BOM明细数据
const mockBomItems = [
  { id: '1', code: 'MAT001', name: 'PCB主板', specification: 'FR-4, 4层板', quantity: 1, unit: '块', unitCost: 150 },
  { id: '2', code: 'MAT002', name: '外壳组件', specification: '铝合金', quantity: 1, unit: '套', unitCost: 80 },
  { id: '3', code: 'MAT003', name: '显示屏', specification: '3.5寸TFT', quantity: 1, unit: '块', unitCost: 120 },
  { id: '4', code: 'MAT004', name: '按键模组', specification: '4x4矩阵', quantity: 1, unit: '套', unitCost: 35 },
  { id: '5', code: 'MAT005', name: '接线端子', specification: '10P', quantity: 4, unit: '个', unitCost: 5 },
  { id: '6', code: 'MAT006', name: '螺丝包', specification: 'M3x10', quantity: 8, unit: '个', unitCost: 0.5 },
]

export default function BomList() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as string | undefined,
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedBom, setSelectedBom] = useState<Bom | null>(null)
  const [form] = Form.useForm()

  // 表格列定义
  const columns: ColumnsType<Bom> = [
    {
      title: 'BOM编码',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: 'BOM名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '关联产品',
      dataIndex: 'productName',
      width: 180,
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 80,
    },
    {
      title: '物料数量',
      dataIndex: 'itemCount',
      width: 100,
      render: (count: number) => `${count} 项`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: string) => {
        const config = statusMap[status]
        return <Tag color={config?.color}>{config?.text || status}</Tag>
      },
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => { setSelectedBom(record); setDetailModalVisible(true); }}>查看明细</a>
          <a onClick={() => message.info('编辑功能开发中')}>编辑</a>
          <a onClick={() => message.info('复制功能开发中')}>复制</a>
        </Space>
      ),
    },
  ]

  // BOM明细表格列
  const itemColumns = [
    { title: '物料编码', dataIndex: 'code', width: 100 },
    { title: '物料名称', dataIndex: 'name', width: 150 },
    { title: '规格型号', dataIndex: 'specification', width: 120 },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '单位', dataIndex: 'unit', width: 60 },
    { title: '单价', dataIndex: 'unitCost', width: 80, render: (v: number) => `¥${v}` },
  ]

  // 过滤数据
  const filteredData = mockBomList.filter(item => {
    if (filters.keyword && !item.name.includes(filters.keyword) && !item.code.includes(filters.keyword)) {
      return false
    }
    if (filters.status && item.status !== filters.status) {
      return false
    }
    return true
  })

  const handleCreate = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      message.success('BOM创建成功')
      setModalVisible(false)
    } catch (error) {
      // 表单验证失败
    }
  }

  return (
    <div className="page-container">
      {/* 页面标题区 */}
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">物料清单(BOM)</Title>
        </div>
        <div className="page-header-actions">
          <Button icon={<ExportOutlined />}>导出</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建BOM
          </Button>
        </div>
      </div>

      {/* 搜索筛选区 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <div className="filter-section" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
          <Input
            placeholder="搜索BOM编码/名称"
            prefix={<SearchOutlined />}
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            style={{ width: 200 }}
          />
          <Select
            placeholder="状态"
            allowClear
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            style={{ width: 120 }}
            options={[
              { value: 'ACTIVE', label: '启用' },
              { value: 'INACTIVE', label: '停用' },
            ]}
          />
        </div>
      </Card>

      {/* 数据表格 */}
      <Card className="daoda-card">
        <Table
          className="daoda-table"
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 新建BOM弹窗 */}
      <Modal
        title="新建BOM"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="code" label="BOM编码" rules={[{ required: true }]}>
            <Input placeholder="请输入BOM编码" />
          </Form.Item>
          <Form.Item name="name" label="BOM名称" rules={[{ required: true }]}>
            <Input placeholder="请输入BOM名称" />
          </Form.Item>
          <Form.Item name="productId" label="关联产品" rules={[{ required: true }]}>
            <Select placeholder="请选择关联产品" options={[
              { value: 'PRD001', label: '智能控制器 A100' },
              { value: 'PRD002', label: '伺服电机 SM-500' },
              { value: 'PRD003', label: 'PLC控制板' },
            ]} />
          </Form.Item>
          <Form.Item name="version" label="版本号">
            <Input placeholder="请输入版本号，如 V1.0" />
          </Form.Item>
        </Form>
      </Modal>

      {/* BOM明细弹窗 */}
      <Modal
        title={`BOM明细 - ${selectedBom?.name || ''}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <Space size="large">
            <Text>BOM编码: <Text strong>{selectedBom?.code}</Text></Text>
            <Text>版本: <Text strong>{selectedBom?.version}</Text></Text>
            <Text>物料数量: <Text strong>{selectedBom?.itemCount}</Text> 项</Text>
          </Space>
        </div>
        <Table
          columns={itemColumns}
          dataSource={mockBomItems}
          rowKey="id"
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={5} align="right">
                <Text strong>合计成本</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong style={{ color: '#1890ff' }}>
                  ¥{mockBomItems.reduce((sum, item) => sum + item.quantity * item.unitCost, 0).toLocaleString()}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Modal>
    </div>
  )
}