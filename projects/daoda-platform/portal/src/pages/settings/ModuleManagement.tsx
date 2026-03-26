import { useState, useEffect } from 'react'
import { Table, Switch, Empty, Space, Button, Tag, Modal, Form, Input, InputNumber, message } from 'antd'
import type { ModuleConfig } from '@/services/module-config.service'
import { moduleConfigService } from '@/services/module-config.service'
import { useModuleStore } from '@/stores/moduleStore'

export default function ModuleManagement() {
  const [modules, setModules] = useState<ModuleConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [editingModule, setEditingModule] = useState<ModuleConfig | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const enabledModules = useModuleStore(state => state.enabledModules)

  // 从 store 同步模块状态
  useEffect(() => {
    const storeModules = useModuleStore.getState().modules
    if (storeModules.length > 0) {
      setModules(storeModules)
    } else {
      fetchModules()
    }
  }, [enabledModules.length])

  const fetchModules = async () => {
    setLoading(true)
    try {
      const data = await moduleConfigService.getAll()
      setModules(data)
      // 同步到 store
      const enabledCodes = data.filter(m => m.enabled).map(m => m.moduleCode)
      useModuleStore.getState().toggleModule('dummy', false) // 触发初始化
    } catch (error) {
      console.error('Failed to fetch modules:', error)
      message.error('获取模块列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (moduleCode: string, enabled: boolean) => {
    try {
      await moduleConfigService.toggle(moduleCode, enabled)
      message.success(`模块已${enabled ? '启用' : '禁用'}`)
      setModules(prev =>
        prev.map(m =>
          m.moduleCode === moduleCode ? { ...m, enabled } : m
        )
      )
    } catch (error) {
      console.error('Failed to toggle module:', error)
      message.error('切换模块状态失败')
    }
  }

  const handleEdit = (module: ModuleConfig) => {
    setEditingModule(module)
    setIsModalOpen(true)
  }

  const handleModalOk = async () => {
    if (!editingModule) return
    try {
      await moduleConfigService.update(editingModule.moduleCode, editingModule)
      message.success('模块配置已更新')
      setIsModalOpen(false)
      setEditingModule(null)
      // 刷新列表
      setModules(prev =>
        prev.map(m =>
          m.moduleCode === editingModule.moduleCode ? { ...m, ...editingModule } : m
        )
      )
    } catch (error) {
      console.error('Failed to update module:', error)
      message.error('更新模块配置失败')
    }
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    setEditingModule(null)
  }

  const handleInputChange = (field: keyof ModuleConfig, value: any) => {
    if (editingModule) {
      setEditingModule({ ...editingModule, [field]: value })
    }
  }

  const columns = [
    {
      title: '模块编码',
      dataIndex: 'moduleCode',
      key: 'moduleCode',
      width: 150,
    },
    {
      title: '模块名称',
      dataIndex: 'moduleName',
      key: 'moduleName',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: ModuleConfig) => (
        <Tag color={record.enabled ? 'success' : 'default'}>
          {record.enabled ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_: any, record: ModuleConfig) => (
        <Space>
          <Switch
            checked={record.enabled}
            onChange={enabled => handleToggle(record.moduleCode, enabled)}
            size="small"
          />
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>模块管理</h2>
        <p style={{ color: '#888', marginTop: 8 }}>控制各功能模块的启用/禁用状态</p>
      </div>

      {modules.length === 0 ? (
        <Empty description="暂无模块配置" />
      ) : (
        <Table
          columns={columns}
          dataSource={modules}
          rowKey="moduleCode"
          loading={loading}
          pagination={false}
        />
      )}

      {/* 编辑模态框 */}
      <Modal
        title="编辑模块配置"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="保存"
        cancelText="取消"
        width={500}
      >
        {editingModule && (
          <Form layout="vertical">
            <Form.Item label="模块编码">
              <Input value={editingModule.moduleCode} disabled />
            </Form.Item>
            <Form.Item label="模块名称">
              <Input
                value={editingModule.moduleName || ''}
                onChange={e => handleInputChange('moduleName', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="描述">
              <Input.TextArea
                value={editingModule.description || ''}
                onChange={e => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </Form.Item>
            <Form.Item label="排序">
              <InputNumber
                value={editingModule.sortOrder || 0}
                onChange={(value) => handleInputChange('sortOrder', value ?? 0)}
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}
