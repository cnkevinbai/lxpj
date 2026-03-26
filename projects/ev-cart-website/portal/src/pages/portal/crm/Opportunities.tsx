import { useState, useEffect } from 'react'
import { Table, Button, Space, Input, Tag, Modal, Form, Select, InputNumber, DatePicker, message } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import PageHeaderWrapper from '@shared/components/PageHeaderWrapper'
import { opportunityService } from '@shared/services/opportunity'
import dayjs from 'dayjs'

const Opportunities = () => {
  const [loading, setLoading] = useState(false)
  const [opportunities, setOpportunities] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingData, setEditingData] = useState(null)
  const [form] = Form.useForm()

  const loadOpportunities = async () => {
    setLoading(true)
    try {
      const response = await opportunityService.getList({ page, pageSize })
      setOpportunities(response.data || [])
      setTotal(response.total || 0)
    } catch (error) {
      message.error('加载商机列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOpportunities() }, [page, pageSize])

  const handleCreate = async (values: any) => {
    try {
      await opportunityService.create({
        ...values,
        closeDate: values.closeDate?.toISOString(),
      })
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      loadOpportunities()
    } catch (error) {
      message.error('创建失败')
    }
  }

  const handleWin = async (id: string) => {
    try {
      await opportunityService.win(id)
      message.success('赢单成功')
      loadOpportunities()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleLose = async (id: string) => {
    try {
      await opportunityService.lose(id, '输单原因')
      message.success('输单成功')
      loadOpportunities()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns = [
    { title: '商机名称', dataIndex: 'name', key: 'name', fixed: 'left' },
    { title: '客户', dataIndex: 'customer', key: 'customer', render: (c: any) => c?.name || '-' },
    { 
      title: '金额', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (amount: number) => `¥${(amount || 0).toLocaleString()}`
    },
    { 
      title: '阶段', 
      dataIndex: 'stage', 
      key: 'stage',
      render: (stage: string) => {
        const map: Record<string, string> = {
          INITIAL_CONTACT: '初步接触',
          NEEDS_ANALYSIS: '需求分析',
          PROPOSAL: '方案报价',
          NEGOTIATION: '谈判审核',
          CLOSED_WON: '赢单',
          CLOSED_LOST: '输单'
        }
        const colorMap: Record<string, string> = {
          INITIAL_CONTACT: 'blue',
          NEEDS_ANALYSIS: 'cyan',
          PROPOSAL: 'orange',
          NEGOTIATION: 'purple',
          CLOSED_WON: 'green',
          CLOSED_LOST: 'red'
        }
        return <Tag color={colorMap[stage] || 'default'}>{map[stage] || stage}</Tag>
      }
    },
    { title: '赢率', dataIndex: 'probability', key: 'probability', render: (p: number) => `${p}%` },
    { title: '预计关闭', dataIndex: 'closeDate', key: 'closeDate', render: (d: string) => d ? dayjs(d).format('YYYY-MM-DD') : '-' },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          {record.status === 'OPEN' && (
            <>
              <Button type="link" size="small" onClick={() => handleWin(record.id)}>赢单</Button>
              <Button type="link" size="small" danger onClick={() => handleLose(record.id)}>输单</Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <PageHeaderWrapper
      title="商机管理"
      subtitle="商机创建、推进、赢单/输单管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingData(null)
          form.resetFields()
          setModalVisible(true)
        }}>
          新建商机
        </Button>
      }
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={opportunities}
        rowKey="id"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => { setPage(page); setPageSize(pageSize || 10) },
        }}
        scroll={{ x: 1400 }}
      />

      <Modal
        title={editingData ? '编辑商机' : '新建商机'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="商机名称" rules={[{ required: true }]}>
            <Input placeholder="请输入商机名称" />
          </Form.Item>
          <Form.Item name="customerId" label="客户" rules={[{ required: true }]}>
            <Select placeholder="请选择客户">
              <Select.Option value="customer1">XX 有限公司</Select.Option>
              <Select.Option value="customer2">YY 集团</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
            <InputNumber prefix="¥" style={{ width: '100%' }} placeholder="请输入金额" />
          </Form.Item>
          <Form.Item name="stage" label="阶段" rules={[{ required: true }]}>
            <Select placeholder="请选择阶段">
              <Select.Option value="INITIAL_CONTACT">初步接触</Select.Option>
              <Select.Option value="NEEDS_ANALYSIS">需求分析</Select.Option>
              <Select.Option value="PROPOSAL">方案报价</Select.Option>
              <Select.Option value="NEGOTIATION">谈判审核</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="probability" label="赢率 (%)" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="closeDate" label="预计关闭日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default Opportunities
