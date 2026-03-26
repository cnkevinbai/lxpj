/**
 * 设备绑定统计卡片组件
 * 
 * @description 展示三种协议的绑定统计信息
 * @author 渔晓白
 */

import { Card, Row, Col, Statistic, Progress, Tag, Tooltip } from 'antd'
import { 
  ApiOutlined, 
  WifiOutlined, 
  GlobalOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import type { BindingStatistics } from '@/types/binding'

interface BindingStatsProps {
  statistics: BindingStatistics | null
  loading?: boolean
}

export default function BindingStats({ statistics, loading }: BindingStatsProps) {
  if (!statistics) {
    return null
  }
  
  const onlineRate = statistics.totalBindings > 0 
    ? ((statistics.onlineDevices / statistics.totalBindings) * 100).toFixed(1)
    : '0'
  
  return (
    <Card title="绑定统计" loading={loading}>
      <Row gutter={[16, 16]}>
        {/* 总体统计 */}
        <Col span={6}>
          <Statistic 
            title="绑定总数" 
            value={statistics.totalBindings}
            prefix={<ApiOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="在线设备" 
            value={statistics.onlineDevices}
            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="离线设备" 
            value={statistics.offlineDevices}
            prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="在线率" 
            value={onlineRate}
            suffix="%"
            prefix={<SyncOutlined />}
          />
        </Col>
      </Row>
      
      {/* 协议分布 */}
      <div style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>协议分布</div>
        <Row gutter={16}>
          <Col span={8}>
            <Tooltip title={`JT/T 808 协议绑定数: ${statistics.jtt808Bindings}`}>
              <div style={{ textAlign: 'center' }}>
                <Tag color="blue" style={{ marginBottom: 4 }}>
                  <WifiOutlined /> JT/T 808
                </Tag>
                <Progress 
                  percent={statistics.totalBindings > 0 
                    ? Math.round((statistics.jtt808Bindings / statistics.totalBindings) * 100)
                    : 0
                  }
                  size="small"
                  format={() => statistics.jtt808Bindings}
                  strokeColor="#1890ff"
                />
              </div>
            </Tooltip>
          </Col>
          <Col span={8}>
            <Tooltip title={`MQTT 协议绑定数: ${statistics.mqttBindings}`}>
              <div style={{ textAlign: 'center' }}>
                <Tag color="green" style={{ marginBottom: 4 }}>
                  <ApiOutlined /> MQTT
                </Tag>
                <Progress 
                  percent={statistics.totalBindings > 0 
                    ? Math.round((statistics.mqttBindings / statistics.totalBindings) * 100)
                    : 0
                  }
                  size="small"
                  format={() => statistics.mqttBindings}
                  strokeColor="#52c41a"
                />
              </div>
            </Tooltip>
          </Col>
          <Col span={8}>
            <Tooltip title={`HTTP 协议绑定数: ${statistics.httpBindings}`}>
              <div style={{ textAlign: 'center' }}>
                <Tag color="orange" style={{ marginBottom: 4 }}>
                  <GlobalOutlined /> HTTP
                </Tag>
                <Progress 
                  percent={statistics.totalBindings > 0 
                    ? Math.round((statistics.httpBindings / statistics.totalBindings) * 100)
                    : 0
                  }
                  size="small"
                  format={() => statistics.httpBindings}
                  strokeColor="#fa8c16"
                />
              </div>
            </Tooltip>
          </Col>
        </Row>
      </div>
      
      {/* 今日统计 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Statistic 
            title="今日新增" 
            value={statistics.todayNewBindings}
            valueStyle={{ fontSize: 16 }}
          />
        </Col>
        <Col span={8}>
          <Statistic 
            title="今日解绑" 
            value={statistics.todayUnbindings}
            valueStyle={{ fontSize: 16 }}
          />
        </Col>
        <Col span={8}>
          <Statistic 
            title="绑定成功率" 
            value={statistics.successRate}
            suffix="%"
            precision={1}
            valueStyle={{ fontSize: 16 }}
          />
        </Col>
      </Row>
    </Card>
  )
}