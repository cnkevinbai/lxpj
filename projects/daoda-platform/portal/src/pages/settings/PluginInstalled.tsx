/**
 * 已安装插件页面
 */
import { useState } from 'react'
import { Table, Card, Button, Modal, Space, Tag, Typography, Switch, message } from 'antd'
import { EditOutlined, DeleteOutlined, SyncOutlined, StarOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pluginService, Plugin } from '@/services/plugin.service'
import PluginDetailModal from '@/components/PluginDetailModal'
import { useNavigate } from 'react-router-dom'

const { Text, Title } = Typography

export default function PluginInstalled() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  // 插件详情弹窗
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  
  // 获取已安装插件列表
  const { data: plugins = [], isLoading, refetch } = useQuery({
    queryKey: ['plugins-installed'],
    queryFn: () => pluginService.getInstalled(),
  })
  
  // 启用/禁用插件
  const enableMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => 
      enabled ? pluginService.enable(id) : pluginService.disable(id),
    onSuccess: (_, variables) => {
      message.success(variables.enabled ? '启用成功' : '禁用成功')
      queryClient.invalidateQueries({ queryKey: ['plugins-installed'] })
    },
  })
  
  // 卸载插件
  const uninstallMutation = useMutation({
    mutationFn: (id: string) => pluginService.uninstall(id),
    onSuccess: () => {
      message.success('卸载成功')
      queryClient.invalidateQueries({ queryKey: ['plugins-installed'] })
    },
  })
  
  // 更新插件
  const updateMutation = useMutation({
    mutationFn: (id: string) => pluginService.update(id),
    onSuccess: () => {
      message.success('更新成功')
      queryClient.invalidateQueries({ queryKey: ['plugins-installed'] })
    },
  })
  
  // 显示插件详情
  const handleShowDetail = (plugin: Plugin) => {
    setSelectedPlugin(plugin)
    setDetailModalVisible(true)
  }
  
  // 处理启用/禁用开关
  const handleStatusChange = (checked: boolean, record: Plugin) => {
    enableMutation.mutate({ id: record.id, enabled: checked })
  }
  
  // 处理卸载
  const handleUninstall = (id: string) => {
    Modal.confirm({
      title: '确认卸载',
      content: '确定要卸载该插件吗？此操作或导致数据丢失。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => uninstallMutation.mutate(id),
    })
  }
  
  // 处理更新
  const handleUpdate = (id: string) => {
    Modal.confirm({
      title: '确认更新',
      content: '确定要更新该插件吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => updateMutation.mutate(id),
    })
  }
  
  // 表格列定义
  const columns: ColumnsType<Plugin> = [
    {
      title: '插件名称',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      render: (name: string, record: Plugin) => (
        <Space>
          <Button 
            type="link" 
            onClick={() => handleShowDetail(record)}
          >
            {name}
          </Button>
        </Space>
      ),
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 100,
    },
    {
      title: '作者',
      dataIndex: 'author',
      width: 150,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      width: 100,
      render: (rating: number) => (
        <Space>
          <StarOutlined style={{ color: '#ffc107' }} />
          <Text strong>{rating.toFixed(1)}</Text>
        </Space>
      ),
    },
    {
      title: '下载量',
      dataIndex: 'downloads',
      width: 100,
      render: (downloads: number) => `${(downloads / 1000).toFixed(1)}k`,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      render: (enabled: boolean, record: Plugin) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleStatusChange(checked, record)}
          loading={enableMutation.isPending}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleShowDetail(record)}
          >
            详情
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<SyncOutlined />}
            onClick={() => handleUpdate(record.id)}
            loading={updateMutation.isPending}
          >
            更新
          </Button>
          <Button 
            type="link" 
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleUninstall(record.id)}
            loading={uninstallMutation.isPending}
          >
            卸载
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Title level={2} style={{ marginBottom: 24 }}>已安装插件</Title>
      
      {/* 操作按钮 */}
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          onClick={() => {
            navigate('/settings/plugin-market')
          }}
        >
          浏览更多插件
        </Button>
        <Button 
          style={{ marginLeft: 8 }} 
          onClick={() => refetch()}
          loading={isLoading}
        >
          刷新
        </Button>
      </div>
      
      {/* 插件列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={plugins}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </Card>
      
      {/* 插件详情弹窗 */}
      <PluginDetailModal 
        visible={detailModalVisible}
        plugin={selectedPlugin}
        onClose={() => {
          setDetailModalVisible(false)
          setSelectedPlugin(null)
        }}
      />
    </div>
  )
}
