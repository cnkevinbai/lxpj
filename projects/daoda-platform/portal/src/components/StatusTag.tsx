/**
 * 状态标签组件
 * 统一的状态显示样式
 */
import { Tag, Badge } from 'antd'
import type { BadgeProps } from 'antd'

interface StatusConfig {
  color: string
  text: string
}

// 预定义的状态配置
export const STATUS_CONFIGS: Record<string, Record<string, StatusConfig>> = {
  // 通用状态
  common: {
    active: { color: 'green', text: '启用' },
    inactive: { color: 'default', text: '禁用' },
    enabled: { color: 'green', text: '已启用' },
    disabled: { color: 'red', text: '已禁用' },
  },
  // 审批状态
  approval: {
    pending: { color: 'orange', text: '待审批' },
    approved: { color: 'green', text: '已通过' },
    rejected: { color: 'red', text: '已拒绝' },
    cancelled: { color: 'default', text: '已取消' },
  },
  // 订单状态
  order: {
    draft: { color: 'default', text: '草稿' },
    pending: { color: 'orange', text: '待处理' },
    processing: { color: 'blue', text: '处理中' },
    completed: { color: 'green', text: '已完成' },
    cancelled: { color: 'red', text: '已取消' },
  },
  // 支付状态
  payment: {
    unpaid: { color: 'orange', text: '未支付' },
    partial: { color: 'blue', text: '部分支付' },
    paid: { color: 'green', text: '已支付' },
    refunded: { color: 'purple', text: '已退款' },
  },
  // 合同状态
  contract: {
    draft: { color: 'default', text: '草稿' },
    active: { color: 'green', text: '生效中' },
    expired: { color: 'red', text: '已过期' },
    pending_renewal: { color: 'orange', text: '待续约' },
    terminated: { color: 'default', text: '已终止' },
  },
  // 考勤状态
  attendance: {
    normal: { color: 'green', text: '正常' },
    late: { color: 'orange', text: '迟到' },
    early: { color: 'orange', text: '早退' },
    absent: { color: 'red', text: '缺勤' },
    leave: { color: 'blue', text: '请假' },
    overtime: { color: 'purple', text: '加班' },
  },
  // 工单状态
  ticket: {
    pending: { color: 'orange', text: '待处理' },
    processing: { color: 'blue', text: '处理中' },
    resolved: { color: 'green', text: '已解决' },
    closed: { color: 'default', text: '已关闭' },
  },
}

interface StatusTagProps {
  status: string
  type?: keyof typeof STATUS_CONFIGS
  customConfig?: Record<string, StatusConfig>
  useBadge?: boolean
  badgeStatus?: BadgeProps['status']
}

export default function StatusTag({ status, type = 'common', customConfig, useBadge = false }: StatusTagProps) {
  const config = customConfig || STATUS_CONFIGS[type] || STATUS_CONFIGS.common
  const { color, text } = config[status] || { color: 'default', text: status }

  if (useBadge) {
    const badgeStatus = color as BadgeProps['status']
    return <Badge status={badgeStatus} text={text} />
  }

  return <Tag color={color}>{text}</Tag>
}