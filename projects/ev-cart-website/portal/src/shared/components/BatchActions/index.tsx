import { useState } from 'react'
import { Button, Modal, Select, message, Space, Tooltip, Form } from 'antd'
import {
  ExportOutlined,
  UsergroupAddOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

interface BatchActionsProps {
  selectedIds: string[]
  onAssign?: (ids: string[], ownerId: string) => Promise<void>
  onExport?: (ids: string[]) => Promise<void>
  onDelete?: (ids: string[]) => Promise<void>
  type?: 'lead' | 'customer' | 'order' | 'opportunity'
}

export default function BatchActions({
  selectedIds,
  onAssign,
  onExport,
  onDelete,
  type = 'customer',
}: BatchActionsProps) {
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [selectedOwner, setSelectedOwner] = useState<string>('')
  const [processing, setProcessing] = useState(false)

  // 模拟销售人员数据
  const salesOptions = [
    { value: 's1', label: '张三' },
    { value: 's2', label: '李四' },
    { value: 's3', label: '王五' },
  ]

  const handleAssign = async () => {
    if (!selectedOwner) {
      message.error('请选择负责人')
      return
    }
    setProcessing(true)
    try {
      await onAssign?.(selectedIds, selectedOwner)
      message.success(`已将 ${selectedIds.length} 条记录分配给负责人`)
      setAssignModalOpen(false)
      setSelectedOwner('')
    } catch (error) {
      message.error('分配失败')
    } finally {
      setProcessing(false)
    }
  }

  const handleExport = async () => {
    setProcessing(true)
    try {
      await onExport?.(selectedIds)
      message.success('导出成功，文件正在下载')
    } catch (error) {
      message.error('导出失败')
    } finally {
      setProcessing(false)
    }
  }

  const handleDelete = async () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedIds.length} 条记录吗？此操作不可恢复。`,
      okText: '确定删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        setProcessing(true)
        try {
          await onDelete?.(selectedIds)
          message.success('删除成功')
        } catch (error) {
          message.error('删除失败')
        } finally {
          setProcessing(false)
        }
      },
    })
  }

  if (selectedIds.length === 0) return null

  return (
    <>
      <div style={{
        padding: '12px 16px',
        background: '#e6f4ff',
        borderRadius: 8,
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontWeight: 600, color: '#1890ff' }}>
          已选择 {selectedIds.length} 条记录
        </div>
        <Space>
          <Tooltip title="批量分配">
            <Button
              icon={<UsergroupAddOutlined />}
              onClick={() => setAssignModalOpen(true)}
              disabled={processing}
            >
              分配
            </Button>
          </Tooltip>
          <Tooltip title="批量导出">
            <Button
              icon={<ExportOutlined />}
              onClick={handleExport}
              disabled={processing}
            >
              导出
            </Button>
          </Tooltip>
          <Tooltip title="批量删除">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              disabled={processing}
            >
              删除
            </Button>
          </Tooltip>
        </Space>
      </div>

      <Modal
        title="批量分配负责人"
        open={assignModalOpen}
        onCancel={() => setAssignModalOpen(false)}
        onOk={handleAssign}
        confirmLoading={processing}
      >
        <div style={{ marginBottom: 16 }}>
          将要把 <strong>{selectedIds.length}</strong> 条记录分配给：
        </div>
        <Select
          placeholder="选择负责人"
          style={{ width: '100%' }}
          value={selectedOwner}
          onChange={setSelectedOwner}
          options={salesOptions}
          size="large"
        />
      </Modal>
    </>
  )
}
