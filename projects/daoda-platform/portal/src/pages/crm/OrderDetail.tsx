/**
 * 订单详情页面
 * 统一UI风格
 */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Descriptions, Tag, Button, Tabs, Table, Typography, Space, Steps, message } from 'antd'
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PrinterOutlined,
  FileTextOutlined,
  CarOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

// 订单状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  DRAFT: { color: 'default', text: '草稿' },
  PENDING: { color: 'orange', text: '待审批' },
  APPROVED: { color: 'blue', text: '已批准' },
  IN_PRODUCTION: { color: 'processing', text: '生产中' },
  SHIPPED: { color: 'cyan', text: '已发货' },
  COMPLETED: { color: 'green', text: '已完成' },
  CANCELLED: { color: 'red', text: '已取消' },
}

// 模拟订单详情
const mockOrderDetail = {
  id: '1',
  code: 'SO202403001',
  customerName: '北京科技有限公司',
  customerId: 'cust001',
  contactName: '张三',
  contactPhone: '13800138000',
  salesPerson: '李四',
  status: 'IN_PRODUCTION',
  totalAmount: 156800,
  paidAmount: 50000,
  currency: 'CNY',
  paymentMethod: '银行转账',
  deliveryAddress: '北京市朝阳区建国路88号',
  deliveryDate: '2024-04-15',
  orderDate: '2024-03-10',
  note: '客户要求加急处理',
  createdAt: '2024-03-10 09:30',
  updatedAt: '2024-03-18 14:20',
}

// 订单明细
const mockOrderItems = [
  { id: '1', productCode: 'PRD001', productName: '智能控制器 A100', quantity: 50, unit: '台', price: 2999, amount: 149950 },
  { id: '2', productCode: 'MAT001', productName: '安装套件', quantity: 50, unit: '套', price: 137, amount: 6850 },
]

// 操作记录
const mockOrderLogs = [
  { id: '1', action: '创建订单', operator: '李四', time: '2024-03-10 09:30' },
  { id: '2', action: '提交审批', operator: '李四', time: '2024-03-10 10:00' },
  { id: '3', action: '审批通过', operator: '王五', time: '2024-03-10 14:00' },
  { id: '4', action: '开始生产', operator: '系统', time: '2024-03-11 08:00' },
  { id: '5', action: '收到首付款 ¥50,000', operator: '财务', time: '2024-03-12 16:30' },
]

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order] = useState(mockOrderDetail)

  // 订单明细表格列
  const itemColumns = [
    { title: '产品编码', dataIndex: 'productCode', width: 100 },
    { title: '产品名称', dataIndex: 'productName', width: 180 },
    { title: '数量', dataIndex: 'quantity', width: 80 },
    { title: '单位', dataIndex: 'unit', width: 60 },
    { title: '单价', dataIndex: 'price', width: 100, render: (v: number) => `¥${v.toLocaleString()}` },
    { title: '金额', dataIndex: 'amount', width: 120, render: (v: number) => `¥${v.toLocaleString()}` },
  ]

  // 操作日志表格列
  const logColumns = [
    { title: '操作', dataIndex: 'action', width: 200 },
    { title: '操作人', dataIndex: 'operator', width: 100 },
    { title: '时间', dataIndex: 'time', width: 160 },
  ]

  // 订单流程步骤
  const currentStep = {
    DRAFT: 0,
    PENDING: 1,
    APPROVED: 2,
    IN_PRODUCTION: 3,
    SHIPPED: 4,
    COMPLETED: 5,
  }[order.status] || 0

  return (
    <div className="page-container">
      {/* 页面标题区 */}
      <div className="page-header">
        <div className="page-header-left">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/crm/orders')}>
            返回
          </Button>
          <Title level={4} className="page-header-title" style={{ marginLeft: 16 }}>
            订单详情
          </Title>
          <Tag color={statusMap[order.status]?.color} style={{ marginLeft: 8 }}>
            {statusMap[order.status]?.text}
          </Tag>
        </div>
        <div className="page-header-actions">
          <Button icon={<PrinterOutlined />}>打印</Button>
          <Button icon={<EditOutlined />} onClick={() => message.info('编辑功能开发中')}>编辑</Button>
          <Button danger onClick={() => message.info('取消功能开发中')}>取消订单</Button>
        </div>
      </div>

      {/* 订单流程 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Steps
          current={currentStep}
          items={[
            { title: '草稿' },
            { title: '待审批' },
            { title: '已批准' },
            { title: '生产中' },
            { title: '已发货' },
            { title: '已完成' },
          ]}
        />
      </Card>

      <Row gutter={[16, 16]}>
        {/* 基本信息 */}
        <Col xs={24} lg={16}>
          <Card className="daoda-card" title="基本信息">
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="订单编号">{order.code}</Descriptions.Item>
              <Descriptions.Item label="客户">
                <a onClick={() => navigate(`/crm/customers/${order.customerId}`)}>{order.customerName}</a>
              </Descriptions.Item>
              <Descriptions.Item label="联系人">{order.contactName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{order.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="销售人员">{order.salesPerson}</Descriptions.Item>
              <Descriptions.Item label="订单日期">{order.orderDate}</Descriptions.Item>
              <Descriptions.Item label="交货日期">{order.deliveryDate}</Descriptions.Item>
              <Descriptions.Item label="付款方式">{order.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="订单金额">
                <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                  ¥{order.totalAmount.toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="已付款">
                <Text type="success">¥{order.paidAmount.toLocaleString()}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="待付款">
                <Text type="danger">¥{(order.totalAmount - order.paidAmount).toLocaleString()}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="收货地址" span={3}>{order.deliveryAddress}</Descriptions.Item>
              <Descriptions.Item label="备注" span={3}>{order.note}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 快捷操作 */}
        <Col xs={24} lg={8}>
          <Card className="daoda-card" title="快捷操作">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block icon={<FileTextOutlined />}>
                生成合同
              </Button>
              <Button block icon={<CarOutlined />}>
                创建发货单
              </Button>
              <Button block onClick={() => navigate('/finance/receivables')}>
                创建收款单
              </Button>
              <Button block onClick={() => navigate('/erp/production')}>
                查看生产进度
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 详细信息标签页 */}
      <Card className="daoda-card" style={{ marginTop: 16 }}>
        <Tabs
          defaultActiveKey="items"
          items={[
            {
              key: 'items',
              label: '订单明细',
              children: (
                <div>
                  <Table
                    className="daoda-table"
                    columns={itemColumns}
                    dataSource={mockOrderItems}
                    rowKey="id"
                    pagination={false}
                    summary={() => (
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={5} align="right">
                          <Text strong>合计金额</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                            ¥{order.totalAmount.toLocaleString()}
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    )}
                  />
                </div>
              ),
            },
            {
              key: 'logs',
              label: '操作记录',
              children: (
                <Table
                  className="daoda-table"
                  columns={logColumns}
                  dataSource={mockOrderLogs}
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