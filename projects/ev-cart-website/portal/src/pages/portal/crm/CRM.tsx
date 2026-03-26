import { useState } from 'react'
import { Typography, Card, Row, Col, Table, Button, Space, Tag, Input, Select, Badge, Modal, Form, DatePicker, Statistic } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  TeamOutlined,
  LineChartOutlined,
  DollarOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography
const { RangePicker } = DatePicker

const CRM = () => {
  const [selectedTab, setSelectedTab] = useState('customers')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 客户数据
  const customerData = [
    { key: '1', name: '张三', company: '某某科技公司', phone: '138****1234', email: 'zhang***@example.com', level: 'A 级', status: 'active', manager: '李四' },
    { key: '2', name: '李四', company: '某某贸易公司', phone: '139****5678', email: 'li***@example.com', level: 'B 级', status: 'active', manager: '王五' },
    { key: '3', name: '王五', company: '某某制造公司', phone: '136****9012', email: 'wang***@example.com', level: 'A 级', status: 'potential', manager: '赵六' },
    { key: '4', name: '赵六', company: '某某服务公司', phone: '137****3456', email: 'zhao***@example.com', level: 'C 级', status: 'inactive', manager: '李四' },
  ]

  // 商机数据
  const opportunityData = [
    { key: '1', title: '新能源观光车采购', customer: '某某景区', amount: '¥1,880,000', stage: '谈判中', probability: 75, expectedDate: '2026-04-15', manager: '李四' },
    { key: '2', title: '电动巡逻车采购', customer: '某某园区', amount: '¥560,000', stage: '方案报价', probability: 50, expectedDate: '2026-04-30', manager: '王五' },
    { key: '3', title: '高尔夫球车采购', customer: '某某高尔夫俱乐部', amount: '¥320,000', stage: '初步接触', probability: 30, expectedDate: '2026-05-15', manager: '赵六' },
  ]

  const stats = [
    { label: '客户总数', value: 128, suffix: '个', icon: <TeamOutlined />, color: '#1890FF' },
    { label: '本月新增', value: 15, suffix: '个', icon: <PlusOutlined />, color: '#52C41A' },
    { label: '商机总数', value: 45, suffix: '个', icon: <LineChartOutlined />, color: '#FAAD14' },
    { label: '预计成交', value: '¥580 万', suffix: '', icon: <DollarOutlined />, color: '#722ED1' },
  ]

  const columns = [
    { title: '客户名称', dataIndex: 'name', key: 'name' },
    { title: '公司', dataIndex: 'company', key: 'company' },
    { title: '联系方式', dataIndex: 'phone', key: 'phone' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { 
      title: '客户等级', 
      dataIndex: 'level', 
      key: 'level',
      render: (level: string) => (
        <Tag color={level === 'A 级' ? 'red' : level === 'B 级' ? 'orange' : 'blue'}>
          {level}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          active: { text: '活跃', color: 'green' },
          potential: { text: '潜在', color: 'blue' },
          inactive: { text: '休眠', color: 'gray' },
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Badge color={s.color} text={s.text} />
      },
    },
    { title: '客户经理', dataIndex: 'manager', key: 'manager' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="crm-page">
      {/* Header */}
      <div className="crm-header">
        <div className="header-content">
          <div>
            <Title level={2} style={{ margin: 0, color: '#FFFFFF' }}>CRM 客户管理系统</Title>
            <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Customer Relationship Management</Paragraph>
          </div>
          <Space size="large">
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              新建客户
            </Button>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="crm-stats">
        <Row gutter={[24, 24]}>
          {stats.map((stat, i) => (
            <Col xs={12} sm={6} key={i}>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                  <div className="stat-info">
                    <Statistic
                      title={stat.label}
                      value={stat.value}
                      suffix={stat.suffix}
                      valueStyle={{ color: stat.color, fontSize: 28 }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 内容区 */}
      <Card className="crm-content">
        {/* 筛选区 */}
        <div className="filter-section">
          <Space wrap size="large">
            <Input
              placeholder="搜索客户名称、公司..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Select placeholder="客户等级" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="a">A 级</Select.Option>
              <Select.Option value="b">B 级</Select.Option>
              <Select.Option value="c">C 级</Select.Option>
            </Select>
            <Select placeholder="状态" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="active">活跃</Select.Option>
              <Select.Option value="potential">潜在</Select.Option>
              <Select.Option value="inactive">休眠</Select.Option>
            </Select>
            <RangePicker />
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={customerData}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          size="middle"
        />
      </Card>

      {/* 新建客户弹窗 */}
      <Modal
        title="新建客户"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" size="large">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="客户名称" name="name" rules={[{ required: true, message: '请输入客户名称' }]}>
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="公司名称" name="company" rules={[{ required: true, message: '请输入公司名称' }]}>
                <Input placeholder="请输入公司名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="联系电话" name="phone" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="电子邮箱" name="email" rules={[{ type: 'email', message: '请输入正确的邮箱' }]}>
                <Input placeholder="请输入电子邮箱" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="客户等级" name="level">
            <Select>
              <Select.Option value="a">A 级</Select.Option>
              <Select.Option value="b">B 级</Select.Option>
              <Select.Option value="c">C 级</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>取消</Button>
              <Button type="primary">保存</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .crm-page { min-height: 100vh; background: #F0F2F5; }
        
        .crm-header {
          background: linear-gradient(135deg, #1890FF 0%, #096DD9 100%);
          padding: 24px 24px;
          margin-bottom: 24px;
        }
        
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .crm-stats { padding: 0 24px 24px; }
        
        .stat-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .stat-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .stat-icon {
          font-size: 40px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
        }
        
        .crm-content {
          margin: 0 24px 24px;
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .filter-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #F0F0F0;
        }
        
        @media (max-width: 768px) {
          .header-content { flex-direction: column; gap: 16px; }
          .stat-content { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  )
}

export default CRM
