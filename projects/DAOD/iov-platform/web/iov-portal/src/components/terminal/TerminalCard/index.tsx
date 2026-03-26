/**
 * 终端卡片组件
 * 
 * @description 终端信息展示卡片
 * @author daod-team
 */

import React from 'react';
import { Card, Space, Typography, Tooltip } from 'antd';
import { 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  WifiOutlined,
  CarOutlined,
} from '@ant-design/icons';
import type { Terminal } from '@/types';
import { StatusTag, STATUS_CONFIG } from '@/components/common/StatusTag';
import { formatRelativeTime } from '@/utils/date';

const { Text } = Typography;

interface TerminalCardProps {
  terminal: Terminal;
  onClick?: (terminal: Terminal) => void;
  selected?: boolean;
  style?: React.CSSProperties;
}

export const TerminalCard: React.FC<TerminalCardProps> = ({
  terminal,
  onClick,
  selected = false,
  style,
}) => {
  return (
    <Card
      hoverable
      size="small"
      onClick={() => onClick?.(terminal)}
      style={{
        ...style,
        border: selected ? '2px solid #1890ff' : undefined,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Text strong>{terminal.terminalId}</Text>
          <StatusTag 
            status={terminal.status} 
            config={STATUS_CONFIG.terminal} 
          />
        </Space>
        <Space size={4}>
          {/* 信号强度 */}
          <Tooltip title={`信号强度: ${terminal.signalStrength}/4`}>
            <WifiOutlined 
              style={{ 
                color: terminal.signalStrength >= 3 ? '#52c41a' : 
                       terminal.signalStrength >= 2 ? '#faad14' : '#ff4d4f' 
              }} 
            />
          </Tooltip>
        </Space>
      </div>

      {terminal.vehicleNo && (
        <div style={{ marginTop: 8 }}>
          <Space>
            <CarOutlined />
            <Text type="secondary">{terminal.vehicleNo}</Text>
          </Space>
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          {terminal.location && (
            <Space>
              <EnvironmentOutlined />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {terminal.address || `${terminal.location.lat.toFixed(4)}, ${terminal.location.lng.toFixed(4)}`}
              </Text>
            </Space>
          )}
          
          {terminal.lastCommunicationTime && (
            <Space>
              <ClockCircleOutlined />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatRelativeTime(terminal.lastCommunicationTime)}
              </Text>
            </Space>
          )}
        </Space>
      </div>
    </Card>
  );
};

export default TerminalCard;