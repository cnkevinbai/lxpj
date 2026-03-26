/**
 * 插件详情弹窗
 */
import { Modal, Descriptions, Tag, Typography, Divider, Space } from 'antd'
import { StarOutlined, DownloadOutlined } from '@ant-design/icons'
import type { Plugin } from '@/services/plugin.service'

const { Text } = Typography

interface PluginDetailModalProps {
  visible: boolean
  plugin?: Plugin | null
  onClose: () => void
}

export function PluginDetailModal({ visible, plugin, onClose }: PluginDetailModalProps) {
  if (!plugin) return null

  // 评分星星
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarOutlined
          key={i}
          style={{
            color: i < Math.floor(rating) ? '#ffc107' : '#d9d9d9',
            fontSize: 16,
          }}
        />
      )
    }
    return (
      <Space size={2}>
        {stars}
        <Text type="secondary" style={{ marginLeft: 4 }}>
          ({rating.toFixed(1)})
        </Text>
      </Space>
    )
  }

  // 权限列表
  const renderPermissions = (permissions: string[]) => {
    if (!permissions || permissions.length === 0) {
      return <Tag color="default">无</Tag>
    }
    return (
      <Space size={[4, 8]} wrap>
        {permissions.map((perm, index) => (
          <Tag key={index} color="blue">
            {perm}
          </Tag>
        ))}
      </Space>
    )
  }

  // 依赖列表
  const renderDependencies = (dependencies: { id: string; version: string }[]) => {
    if (!dependencies || dependencies.length === 0) {
      return <Tag color="default">无</Tag>
    }
    return (
      <Space size={[4, 8]} wrap>
        {dependencies.map((dep, index) => (
          <Tag key={index} color="orange">
            {dep.id}@{dep.version}
          </Tag>
        ))}
      </Space>
    )
  }

  return (
    <Modal
      title={plugin.name}
      open={visible}
      onCancel={onClose}
      width={700}
      footer={null}
      maskClosable={true}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 插件基本信息 */}
        <Descriptions bordered column={2}>
          <Descriptions.Item label="名称">{plugin.name}</Descriptions.Item>
          <Descriptions.Item label="版本">{plugin.version}</Descriptions.Item>
          <Descriptions.Item label="作者">{plugin.author}</Descriptions.Item>
          <Descriptions.Item label="评分">
            {renderStars(plugin.rating)}
          </Descriptions.Item>
          <Descriptions.Item label="下载量" span={2}>
            <Space>
              <DownloadOutlined />
              {plugin.downloads.toLocaleString()}
            </Space>
          </Descriptions.Item>
        </Descriptions>

        {/* 插件描述 */}
        <div>
          <Typography.Text strong>描述</Typography.Text>
          <Typography.Paragraph style={{ marginTop: 8 }}>
            {plugin.description}
          </Typography.Paragraph>
        </div>

        {/* 权限列表 */}
        <div>
          <Typography.Text strong>所需权限</Typography.Text>
          <div style={{ marginTop: 8 }}>{renderPermissions(plugin.permissions)}</div>
        </div>

        {/* 依赖列表 */}
        <div>
          <Typography.Text strong>依赖</Typography.Text>
          <div style={{ marginTop: 8 }}>{renderDependencies(plugin.dependencies)}</div>
        </div>
      </Space>
    </Modal>
  )
}

export default PluginDetailModal
