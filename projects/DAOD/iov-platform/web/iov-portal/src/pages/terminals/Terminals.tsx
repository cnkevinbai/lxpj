/**
 * 终端管理列表
 */
import { useState } from 'react'
import { Table, Card, Input, Select, Button, Tag, Space, Modal, Form, message } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getTerminals, sendCommand } from '@/services/terminal'
import type { Terminal } from '@/types'
import type { ColumnsType } from 'antd/es/table'

const { Search } = Input

export default function Terminals() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<string>()
  const [commandModalOpen, setCommandModalOpen] = useState(false)
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null)
  const [form] = Form.useForm()
  
  // 获取终端列表
  const { data, isLoading } = useQuery({
    queryKey: ['terminals', keyword, status],
    queryFn: () => getTerminals({ keyword, status }),
  })
  
  // 发送指令
  const commandMutation = useMutation({
    mutationFn: (params: { terminalId: string; command: string; params: any }) =>
      sendCommand(params.terminalId, params.command, params.params),
    onSuccess: () => {
      message.success('指令发送成功')
      setCommandModalOpen(false)
      form.resetFields()
    },
    onError: () => {
      message.error('指令发送失败')
    },
  })
  
  // 表格列
  const columns: ColumnsType<Terminal> = [
    {
      title: '终端号',
      dataIndex: 'terminalId',
      key: 'terminalId',
      width: 140,
      render: (text: string, record: Terminal) => (
        <a onClick={() => navigate(`/terminals/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '车牌号',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
      width: 100,
    },
    {
      title: '设备型号',
      dataIndex: 'deviceModel',
      key: 'deviceModel',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          online: { color: 'success', text: '在线' },
          offline: { color: 'error', text: '离线' },
          sleep: { color: 'warning', text: '休眠' },
        }
        const { color, text } = config[status] || { color: 'default', text: status }
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '信号强度',
      dataIndex: 'signalStrength',
      key: 'signalStrength',
      width: 100,
      render: (signal: number) => {
        if (signal >= 3) return <Tag color="success">优秀</Tag>
        if (signal >= 2) return <Tag color="processing">良好</Tag>
        if (signal >= 1) return <Tag color="warning">一般</Tag>
        return <Tag color="default">无信号</Tag>
      },
    },
    {
      title: '最后通信',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      width: 160,
    },
    {
      title: '位置',
      key: 'location',
      ellipsis: true,
      render: (_: any, record: Terminal) => record.address || (record.location ? `${record.location.lat.toFixed(4)}, ${record.location.lng.toFixed(4)}` : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record: Terminal) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => navigate(`/terminals/${record.id}`)}>
            详情
          </Button>
          <Button 
            type="link" 
            size="small" 
            onClick={() => {
              setSelectedTerminal(record)
              setCommandModalOpen(true)
            }}
          >
            指令
          </Button>
        </Space>
      ),
    },
  ]
  
  const handleSendCommand = (values: any) => {
    if (selectedTerminal) {
      commandMutation.mutate({
        terminalId: selectedTerminal.id,
        command: 'text',
        params: values,
      })
    }
  }
  
  return (
    <div className="terminals-page">
      {/* 搜索栏 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="搜索终端号/车牌号"
            allowClear
            style={{ width: 250 }}
            onSearch={setKeyword}
          />
          <Select
            placeholder="状态筛选"
            allowClear
            style={{ width: 120 }}
            onChange={setStatus}
            options={[
              { label: '在线', value: 'online' },
              { label: '离线', value: 'offline' },
              { label: '休眠', value: 'sleep' },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={() => queryClient.invalidateQueries({ queryKey: ['terminals'] })}>
            刷新
          </Button>
        </Space>
      </Card>
      
      {/* 终端列表 */}
      <Card className="daoda-card">
        <Table
          columns={columns}
          dataSource={data?.list || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
      
      {/* 发送指令弹窗 */}
      <Modal
        title="发送指令"
        open={commandModalOpen}
        onCancel={() => setCommandModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={commandMutation.isPending}
      >
        <Form form={form} layout="vertical" onFinish={handleSendCommand}>
          <Form.Item label="终端号">
            <Input value={selectedTerminal?.terminalId} disabled />
          </Form.Item>
          <Form.Item
            name="message"
            label="消息内容"
            rules={[{ required: true, message: '请输入消息内容' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入要下发的消息内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}