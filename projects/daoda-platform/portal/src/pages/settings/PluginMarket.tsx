/**
 * 插件市场页面
 */
import { useState } from 'react'
import { Card, Row, Col, Input, Button, Space, Tag, Typography, Modal, message } from 'antd'
import { StarOutlined, DownloadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { Plugin } from '@/services/plugin.service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pluginService } from '@/services/plugin.service'
import PluginDetailModal from '@/components/PluginDetailModal'

const { Text, Title } = Typography

// 插件卡片组件
function PluginCard({ plugin, onInstall, onUninstall, onDetail }: { 
  plugin: Plugin
  onInstall: (id: string) => void
  onUninstall: (id: string) => void
  onDetail: (plugin: Plugin) => void
}) {
  return (
    <Card
      hoverable
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      actions={plugin.installed ? [
        <Button 
          key="uninstall" 
          type="link" 
          danger
          icon={<MinusCircleOutlined />}
          onClick={() => onUninstall(plugin.id)}
        >
          卸载
        </Button>,
        <Button 
          key="detail" 
          type="link"
          onClick={() => onDetail(plugin)}
        >
          详情
        </Button>
      ] : [
        <Button 
          key="install" 
          type="link"
          icon={<PlusOutlined />}
          onClick={() => onInstall(plugin.id)}
        >
          安装
        </Button>,
        <Button 
          key="detail" 
          type="link"
          onClick={() => onDetail(plugin)}
        >
          详情
        </Button>
      ]}
    >
      <div style={{ minHeight: 200, display: 'flex', flexDirection: 'column' }}>
        {/* 插件图标和名称 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          {plugin.icon ? (
            <img 
              src={plugin.icon} 
              alt={plugin.name}
              style={{ width: 48, height: 48, marginRight: 12, borderRadius: 8 }}
            />
          ) : (
            <div 
              style={{ 
                width: 48, 
                height: 48, 
                marginRight: 12, 
                borderRadius: 8,
                backgroundColor: '#0066FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                {plugin.name.charAt(0)}
              </Text>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <Title level={5} style={{ margin: '0 0 4px 0' }}>
              {plugin.name}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              by {plugin.author}
            </Text>
          </div>
        </div>

        {/* 插件描述 */}
        <Text type="secondary" style={{ marginBottom: 12, flex: 1 }}>
          {plugin.description}
        </Text>

        {/* 评分和下载量 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 'auto' }}>
          <Space>
            <StarOutlined style={{ color: '#ffc107' }} />
            <Text strong>{plugin.rating.toFixed(1)}</Text>
          </Space>
          <Space>
            <DownloadOutlined />
            <Text type="secondary">{(plugin.downloads / 1000).toFixed(1)}k</Text>
          </Space>
          <Tag>{plugin.version}</Tag>
        </div>
      </div>
    </Card>
  )
}

export default function PluginMarket() {
  const queryClient = useQueryClient()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    category: 'all',
  })
  
  // 插件详情弹窗
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  
  // 获取市场插件列表
  const { data: marketPlugins = [], isLoading } = useQuery({
    queryKey: ['plugins-market'],
    queryFn: () => pluginService.getMarket(),
  })
  
  // 获取已安装插件列表
  const { data: installedPlugins = [], refetch: refetchInstalled } = useQuery({
    queryKey: ['plugins-installed'],
    queryFn: () => pluginService.getInstalled(),
  })
  
  // 安装插件
  const installMutation = useMutation({
    mutationFn: (id: string) => pluginService.install(id),
    onSuccess: () => {
      message.success('安装成功')
      queryClient.invalidateQueries({ queryKey: ['plugins-installed'] })
    },
  })
  
  // 卸载插件
  const uninstallMutation = useMutation({
    mutationFn: (id: string) => pluginService.uninstall(id),
    onSuccess: () => {
      message.success('卸载成功')
      queryClient.invalidateQueries({ queryKey: ['plugins-installed'] })
      queryClient.invalidateQueries({ queryKey: ['plugins-market'] })
    },
  })
  
  // 显示插件详情
  const handleShowDetail = (plugin: Plugin) => {
    setSelectedPlugin(plugin)
    setDetailModalVisible(true)
  }
  
  // 处理安装
  const handleInstall = (id: string) => {
    installMutation.mutate(id)
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
  
  // 过滤插件列表
  const filteredPlugins = marketPlugins.filter(plugin => {
    const matchesKeyword = plugin.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
                          plugin.description.toLowerCase().includes(filters.keyword.toLowerCase()) ||
                          plugin.author.toLowerCase().includes(filters.keyword.toLowerCase())
    const matchesCategory = filters.category === 'all' || 
                           (filters.category === 'installed' && plugin.installed) ||
                           (filters.category === 'not-installed' && !plugin.installed)
    
    return matchesKeyword && matchesCategory
  })
  
  // 获取已安装插件ID集合
  const installedPluginIds = new Set(installedPlugins.map(p => p.id))
  
  // 添加 installed 标志
  const pluginsWithStatus = filteredPlugins.map(plugin => ({
    ...plugin,
    installed: installedPluginIds.has(plugin.id),
  }))

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Title level={2} style={{ marginBottom: 24 }}>插件市场</Title>
      
      {/* 筛选区域 */}
      <div style={{ marginBottom: 24 }}>
        <Space size="middle">
          <Input
            placeholder="搜索插件..."
            style={{ width: 300 }}
            value={filters.keyword}
            onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
          />
          <Button type="primary" onClick={() => setFilters(prev => ({ ...prev, category: prev.category }))}>
            查询
          </Button>
          <Button onClick={() => setFilters({ keyword: '', category: 'all' })}>
            重置
          </Button>
        </Space>
      </div>
      
      {/* 插件列表 */}
      <Row gutter={[16, 16]}>
        {pluginsWithStatus.map(plugin => (
          <Col key={plugin.id} xs={24} sm={12} md={8} lg={6}>
            <PluginCard 
              plugin={plugin}
              onInstall={handleInstall}
              onUninstall={handleUninstall}
              onDetail={handleShowDetail}
            />
          </Col>
        ))}
      </Row>
      
      {/* 无结果提示 */}
      {pluginsWithStatus.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Typography.Text type="secondary">
            未找到匹配的插件
          </Typography.Text>
        </div>
      )}
      
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
