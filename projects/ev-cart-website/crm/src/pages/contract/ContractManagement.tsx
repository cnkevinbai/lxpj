import React, { useState } from 'react'
import { Table, Card, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, DatePicker, message, Statistic, Row, Col } from 'antd'
import { PlusOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const { Option } = Select

interface Contract {
  id: string
  contractNo: string
  contractName: string
  customerId: string
  customerName: string
  amount: number
  signDate: string
  startDate: string
  endDate: string
  status: string
  owner: string
}

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      contractNo: 'CT20260313001',
      contractName: '智能换电柜采购合同',
      customerId: 'C001',
      customerName: '某某物流公司',
      amount: 150000,
      signDate: '2026-03-10',
      startDate: '2026-03-15',
      endDate: '2027-03-14',
      status: 'active',
      owner: '销售 A',
    },
    {
      id: '2',
      contractNo: 'CT20260313002',
      contractName: '电池年度采购合同',
      customerId: 'C002',
      customerName: '某某科技公司',
      amount: 500000,
      signDate: '2026-03-05',
      startDate: '2026-03-01',
      endDate: '2027-02-28',
      status: 'active',
      owner: '销售 B',
    },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    draft: 'default',
    active: 'success',
    expired: 'warning',
    terminated: 'error',
  }

  const statusLabels: Record<string, string> = {
    draft: '草稿',
    active: '执行中',
    expired: '已到期',
    terminated: '已终止',
  }

  const handleCreate = async (values: any) => {
    message.success('创建合同成功')
    setModalVisible(false)
    form.resetFields()
  }

  const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0)
  const activeCount = contracts.filter(c => c.status === 'active').length

  const columns = [
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      width: 150,
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      width: 200,
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 150,
    },
    {
      title: '合同金额',
      dataIndex: 'amount',
      width: 120,
      render: (amount: number) => `¥${(amount / 10000).toFixed(1)}万`,
    },
    {
      title: '签订日期',
      dataIndex: 'signDate',
      width: 110,
    },
    {
      title: '有效期',
      key: 'period',
      width: 180,
      render: (_: any, record: Contract) => `${record.startDate} 至 ${record.endDate}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status] || status}</Tag>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      width: 90,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Contract) => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="合同总数"
              value={contracts.length}
              suffix="个"
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="执行中"
              value={activeCount}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="合同总额"
              value={totalAmount}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="即将到期"
              value={2}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            新建合同
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={contracts}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="新建合同"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="contractName"
              label="合同名称"
              rules={[{ required: true, message: '请输入合同名称' }]}
            >
              <Input placeholder="请输入合同名称" />
            </Form.Item>

            <Form.Item
              name="customerId"
              label="客户"
              rules={[{ required: true, message: '请选择客户' }]}
            >
              <Select placeholder="请选择客户">
                <Option value="C001">某某物流公司</Option>
                <Option value="C002">某某科技公司</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="amount"
              label="合同金额"
              rules={[{ required: true, message: '请输入合同金额' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value?: string | number) => `¥${Number(value || 0).toLocaleString()}`}
                parser={(value?: string) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="signDate"
              label="签订日期"
              rules={[{ required: true, message: '请选择签订日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="startDate"
              label="开始日期"
              rules={[{ required: true, message: '请选择开始日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="结束日期"
              rules={[{ required: true, message: '请选择结束日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ContractManagement
