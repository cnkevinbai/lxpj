import { useState } from 'react'
import { Card, Table, Tag, Button, Space, Input, Switch, Progress, message, Modal, Form, Select } from 'antd'
import { PlusOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Search } = Input

// 模拟数据
const mockData = [
  {
    id: '1',
    partNo: 'PART-20260312-001',
    name: '电源模块 A 型',
    description: '适用于产品 A',
    stockQuantity: 50,
    safetyStock: 20,
    unit: '个',
    unitPrice: 500,
    warehouseLocation: 'A-01-01',
    isActive: true,
  },
  {
    id: '2',
    partNo: 'PART-20260312-002',
    name: '控制板 B 型',
    description: '适用于产品 B',
    stockQuantity: 15,
    safetyStock: 20,
    unit: '个',
    unitPrice: 800,
    warehouseLocation: 'B-02-01',
    isActive: true,
  },
]

export default function PartList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [searchText, setSearchText] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [stockModal, setStockModal] = useState(false)
  const [selectedPart, setSelectedPart] = useState<any>(null)
  const [form] = Form.useForm()

  const columns = [
    {
      title: '备件编号',
      dataIndex: 'partNo',
      key: 'partNo',
      width: 180,
    },
    {
      title: '备件名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '库存数量',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      width: 150,
      render: (quantity: number, record: any) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            {quantity} {record.unit}
          </div>
          <Progress
            percent={(quantity / record.safetyStock) * 100}
            strokeColor={quantity <= record.safetyStock ? '#ff4d4f' : '#52c41a'}
            size="small"
            format={() => quantity <= record.safetyStock ? '库存不足' : '充足'}
          />
        </div>
      ),
    },
    {
      title: '安全库存',
      dataIndex: 'safetyStock',
      key: 'safetyStock',
      width: 100,
      render: (safety: number, record: any) => (
        <span>{safety} {record.unit}</span>
      ),
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: '库位',
      dataIndex: 'warehouseLocation',
      key: 'warehouseLocation',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setSelectedPart(record)
              setStockModal(true)
            }}
          >
            出入库
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/after-sales/parts/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/after-sales/parts/${record.id}/edit`)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  const filteredData = data.filter(item => {
    if (!showInactive && !item.isActive) return false
    if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })

  const handleStockOperation = async (values: any) => {
    try {
      // await api.stockOperation(selectedPart.id, values)
      message.success('操作成功')
      setStockModal(false)
      form.resetFields()
    } catch (error) {
      message.error('操作失败')
    }
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>备件管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/after-sales/parts/new')}>
          新建备件
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
          <Search
            placeholder="搜索备件名称"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Space>
            <span>显示停用:</span>
            <Switch
              checked={showInactive}
              onChange={setShowInactive}
            />
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>

      <Modal
        title="备件出入库"
        open={stockModal}
        onCancel={() => setStockModal(false)}
        footer={null}
      >
        {selectedPart && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <p><strong>备件:</strong> {selectedPart.name}</p>
              <p><strong>当前库存:</strong> {selectedPart.stockQuantity} {selectedPart.unit}</p>
              <p><strong>安全库存:</strong> {selectedPart.safetyStock} {selectedPart.unit}</p>
            </div>
            <Form form={form} layout="vertical" onFinish={handleStockOperation}>
              <Form.Item
                label="操作类型"
                name="type"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="in">入库</Select.Option>
                  <Select.Option value="out">出库</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="数量"
                name="quantity"
                rules={[{ required: true, min: 1 }]}
              >
                <Input type="number" min={1} />
              </Form.Item>
              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button onClick={() => setStockModal(false)}>取消</Button>
                  <Button type="primary" htmlType="submit">确认</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}
