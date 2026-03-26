/**
 * 状态标签组件
 * 
 * @description 统一的状态显示标签
 * @author daod-team
 */

import React from 'react';
import { Tag, Badge } from 'antd';
import type { BadgeProps, TagProps } from 'antd';

interface StatusConfig {
  text: string;
  color: string;
}

interface StatusTagProps {
  status: string;
  config: Record<string, StatusConfig>;
  type?: 'tag' | 'badge';
  style?: React.CSSProperties;
}

export const StatusTag: React.FC<StatusTagProps> = ({
  status,
  config,
  type = 'tag',
  style,
}) => {
  const statusInfo = config[status] || { text: '未知', color: 'default' };

  if (type === 'badge') {
    return (
      <Badge 
        status={statusInfo.color as BadgeProps['status']} 
        text={statusInfo.text}
        style={style}
      />
    );
  }

  return (
    <Tag color={statusInfo.color} style={style}>
      {statusInfo.text}
    </Tag>
  );
};

// 预设状态配置
export const STATUS_CONFIG = {
  // 终端状态
  terminal: {
    online: { text: '在线', color: 'success' },
    offline: { text: '离线', color: 'default' },
    fault: { text: '故障', color: 'error' },
    sleep: { text: '休眠', color: 'warning' },
  },
  // 车辆状态
  vehicle: {
    running: { text: '行驶中', color: 'processing' },
    stopped: { text: '停止', color: 'default' },
    charging: { text: '充电中', color: 'success' },
    fault: { text: '故障', color: 'error' },
    offline: { text: '离线', color: 'warning' },
  },
  // 告警级别
  alarmLevel: {
    critical: { text: '严重', color: 'error' },
    major: { text: '主要', color: 'warning' },
    minor: { text: '次要', color: 'processing' },
    warning: { text: '警告', color: 'default' },
  },
  // 告警状态
  alarmStatus: {
    pending: { text: '待处理', color: 'error' },
    processing: { text: '处理中', color: 'processing' },
    resolved: { text: '已解决', color: 'success' },
    ignored: { text: '已忽略', color: 'default' },
  },
  // 模块状态
  moduleState: {
    running: { text: '运行中', color: 'success' },
    stopped: { text: '已停止', color: 'default' },
    initialized: { text: '已初始化', color: 'processing' },
    error: { text: '错误', color: 'error' },
    uninitialized: { text: '未初始化', color: 'default' },
  },
} as const;

export default StatusTag;