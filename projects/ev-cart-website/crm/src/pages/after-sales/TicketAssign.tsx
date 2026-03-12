import { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Space, Modal, Select, message, Checkbox } from 'antd'
import { TeamOutlined } from '@ant-design/icons'
import type { ServiceTicket, TicketStatus } from '@/types/after-sales'

const { Option } = Select

// 模拟待分配工单数据
const mockData: ServiceTicket[] = [
  {
    id: '1',
    ticketNo: 'GD-20260312-001',
    type: 'repair',
    status: 'pending',
    priority: 'urgent',
    customerName: '张三',
    customerPhone: '138****1234',
    productName: '产品 A',
    problemDescription: '设备无法启动',
    serviceAddress: '成都市高新区',
    createdAt: '2026-03-12 10:30:00',
  },
  {
    id: '2',
    ticketNo: 'GD-20260312-002',
    type: 'installation',
    status: 'accepted',
    priority: 'normal',
    customerName: '李四',
    customerPhone: '139****5678',
    productName: '产品 B',
    problemDescription: '新设备安装',
    serviceAddress: '重庆市九龙坡区',
    createdAt: '2026-03-12 11:00:00',
  },
]

// 模拟技术人员列表
const technicians = [
  { id: 't1', name: '李师傅', skills: ['维修', '安装'], rating: 4.8 },
  { id: 't2', name: '王师傅', skills: ['安装', '保养'], rating: 4.6 },
  { id: 't3', name: '张师傅', skills: ['维修'], rating: 4.9 },
]

const priorityMap: Record<string, { color: string; text: string }> = {
  normal: { color: 'default', text: '普通' },
  urgent: { color: 'orange', text: '紧急' },
  critical: { color: 'red', text: '特急' },
}

const typeMap: Record<string, { color: string; text: string }> = {
  repair: { color: 'orange', text: '维修' },
  installation: { color: 'blue', text: '安装' },
  maintenance: { color: 'green', text: '保养' },
}

export default function TicketAssign() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ServiceTicket[]>(mockData)
  const [assignModal, setAssignModal] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedTechnician, setSelectedTechnician] = useState<string>('')

  const handleAssign = async () => {
    if (!selectedTechnician) {
      message.error('请选择服务人员')
      return
    }

    try {
      const technician = technicians.find(t => t.id === selectedTechnician)
      // await api.batchAssignTickets(selectedIds, selectedTechnician, technician?.name || '', currentUserId)
      message.success(`已分配 ${selectedIds.length} 个工单给 ${technician?.name}`)
      setAssignModal(false)
      setSelectedIds([])
      setSelectedTechnician('')
      // 刷新列表
    } catch (error) {
      message.error('分配失败')
    }
  }

  const columns = [
    {
      title: <Checkbox />,
      key: 'select',
      width: 50,
      render: (_: any, record: ServiceTicket) => (
        <Checkbox
          checked={selectedIds.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds([...selectedIds, record.id])
            } else {
              setSelectedIds(selectedIds.filter(id => id !== record.id))
            }
          }}
        />
      ),
    },
    {
      title: '工单号',
      dataIndex: 'ticketNo',
      key: 'ticketNo',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => {
        const config = typeMap[type]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => {
        const config = priorityMap[priority]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
      width: 120,
    },
    {
      title: '服务地址',
      dataIndex: 'serviceAddress',
      key: 'serviceAddress',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
  ]

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>工单分配 (售后主管)</h1>
        <Button
          type="primary"
          icon={<TeamOutlined />}
          onClick={() => setAssignModal(true)}
          disabled={selectedIds.length === 0}
        >
          批量分配 ({selectedIds.length})
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          rowSelection={{
            selectedRowKeys: selectedIds,
            onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys as string[]),
          }}
        />
      </Card>

      <Modal
        title="分配工单"
        open={assignModal}
        onCancel={() => setAssignModal(false)}
        onOk={handleAssign}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <p>已选择 <strong>{selectedIds.length}</strong> 个工单</p>
          <p style={{ color: '#999', fontSize: 12 }}>
            工单号：{selectedIds.join(', ')}
          </p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>选择服务人员：</label>
          <Select
            style={{ width: '100%' }}
            placeholder="请选择服务人员"
            value={selectedTechnician}
            onChange={setSelectedTechnician}
            size="large"
          >
            {technicians.map(tech => (
              <Option key={tech.id} value={tech.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{tech.name}</span>
                  <span style={{ color: '#999' }}>
                    {tech.skills.join('/')} ⭐{tech.rating}
                  </span>
                </div>
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
            💡 提示：分配后系统将自动通知服务人员，并发送短信通知客户
          </p>
        </div>
      </Modal>
    </div>
  )
}
