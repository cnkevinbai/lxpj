/**
 * 协议绑定流程说明组件
 * 
 * @description 展示三种协议 (JT/T 808、MQTT、HTTP) 的绑定流程差异
 * @author 渔晓白
 */

import { Card, Tabs, Steps, Tag, Typography, Divider, Alert, Space } from 'antd'
import { 
  WifiOutlined, ApiOutlined, GlobalOutlined, 
  CheckCircleOutlined, SyncOutlined, SafetyOutlined,
  ClockCircleOutlined, ReconciliationOutlined,
} from '@ant-design/icons'
import type { ProtocolType } from '@/types/binding'
import { ProtocolConfig } from '@/types/binding'

const { Text, Paragraph } = Typography

interface ProtocolBindingGuideProps {
  activeProtocol?: ProtocolType
  onProtocolChange?: (protocol: ProtocolType) => void
}

export default function ProtocolBindingGuide({ 
  activeProtocol = 'JTT808',
  onProtocolChange 
}: ProtocolBindingGuideProps) {
  return (
    <Card title="协议绑定流程说明" size="small">
      <Tabs
        activeKey={activeProtocol}
        onChange={(key) => onProtocolChange?.(key as ProtocolType)}
        items={[
          {
            key: 'JTT808',
            label: (
              <Space>
                <WifiOutlined />
                JT/T 808
              </Space>
            ),
            children: <Jtt808Guide />,
          },
          {
            key: 'MQTT',
            label: (
              <Space>
                <ApiOutlined />
                MQTT
              </Space>
            ),
            children: <MqttGuide />,
          },
          {
            key: 'HTTP',
            label: (
              <Space>
                <GlobalOutlined />
                HTTP
              </Space>
            ),
            children: <HttpGuide />,
          },
        ]}
      />
    </Card>
  )
}

/** JT/T 808 绑定流程 */
function Jtt808Guide() {
  return (
    <div>
      <Alert 
        type="info" 
        message="JT/T 808 协议 - 道路运输车辆卫星定位系统终端通讯协议"
        description="适用于合规车载终端，支持 TCP 长连接，需要鉴权码验证"
        style={{ marginBottom: 16 }}
      />
      
      <Steps
        direction="vertical"
        size="small"
        items={[
          {
            title: '终端注册 (0x0100)',
            description: (
              <div>
                <Text>终端发送注册消息，包含：省域ID、市域ID、制造商ID、终端型号、终端ID</Text>
                <br />
                <Tag color="blue" style={{ marginTop: 8 }}>平台生成鉴权码</Tag>
              </div>
            ),
            icon: <ReconciliationOutlined />,
          },
          {
            title: '终端鉴权 (0x0102)',
            description: (
              <div>
                <Text>终端使用鉴权码进行鉴权</Text>
                <br />
                <Tag color="green" style={{ marginTop: 8 }}>鉴权成功后建立绑定关系</Tag>
              </div>
            ),
            icon: <SafetyOutlined />,
          },
          {
            title: '心跳保活',
            description: (
              <div>
                <Text>终端定期发送心跳消息 (默认 5 分钟超时)</Text>
                <br />
                <Tag color="orange" style={{ marginTop: 8 }}>断线后 30 分钟内重连可恢复绑定</Tag>
              </div>
            ),
            icon: <SyncOutlined />,
          },
          {
            title: '数据上报',
            description: '绑定成功后，终端可正常上报位置、状态等数据',
            icon: <CheckCircleOutlined />,
          },
        ]}
      />
      
      <Divider>可靠性保证</Divider>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <div><Tag color="blue">鉴权码</Tag> 24小时有效期，一次性使用</div>
        <div><Tag color="green">重连恢复</Tag> 30分钟内重连自动恢复绑定</div>
        <div><Tag color="orange">心跳检测</Tag> 5分钟超时自动标记离线</div>
      </Space>
    </div>
  )
}

/** MQTT 绑定流程 */
function MqttGuide() {
  return (
    <div>
      <Alert 
        type="info" 
        message="MQTT 协议 - 消息队列遥测传输协议"
        description="适用于 IoT 智能设备，支持 QoS、遗嘱消息、设备影子"
        style={{ marginBottom: 16 }}
      />
      
      <Steps
        direction="vertical"
        size="small"
        items={[
          {
            title: 'MQTT CONNECT',
            description: (
              <div>
                <Text>终端连接时携带 Token 进行认证</Text>
                <br />
                <Text code>ClientId: terminal_{'{序列号}'}</Text>
                <br />
                <Text code>Password: {'{JWT Token}'}</Text>
                <br />
                <Tag color="green" style={{ marginTop: 8 }}>认证成功后建立绑定</Tag>
              </div>
            ),
            icon: <ApiOutlined />,
          },
          {
            title: '遗嘱消息配置',
            description: (
              <div>
                <Text>连接时配置遗嘱消息，异常断开时自动发布离线状态</Text>
                <br />
                <Tag color="orange" style={{ marginTop: 8 }}>QoS=1, Retained=true</Tag>
              </div>
            ),
            icon: <SafetyOutlined />,
          },
          {
            title: '设备影子同步',
            description: (
              <div>
                <Text>设备上报状态到 reported，平台下发期望到 desired</Text>
                <br />
                <Tag color="blue" style={{ marginTop: 8 }}>双向状态同步</Tag>
              </div>
            ),
            icon: <SyncOutlined />,
          },
          {
            title: '数据上报与指令接收',
            description: '订阅指令主题，接收平台下发的控制指令',
            icon: <CheckCircleOutlined />,
          },
        ]}
      />
      
      <Divider>可靠性保证</Divider>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <div><Tag color="blue">Token 认证</Tag> JWT Token 验证身份</div>
        <div><Tag color="green">遗嘱消息</Tag> 异常断开自动通知</div>
        <div><Tag color="orange">设备影子</Tag> 状态缓存与同步</div>
        <div><Tag color="purple">会话保持</Tag> 24小时会话有效期</div>
      </Space>
    </div>
  )
}

/** HTTP 绑定流程 */
function HttpGuide() {
  return (
    <div>
      <Alert 
        type="info" 
        message="HTTP 协议 - 超文本传输协议"
        description="适用于轻量设备、第三方平台，使用签名验证和幂等设计"
        style={{ marginBottom: 16 }}
      />
      
      <Steps
        direction="vertical"
        size="small"
        items={[
          {
            title: '设备注册',
            description: (
              <div>
                <Text>终端通过 HTTP POST 注册并绑定</Text>
                <br />
                <Text code>POST /api/v1/terminal/{'{id}'}/register</Text>
                <br />
                <Tag color="blue" style={{ marginTop: 8 }}>需要签名验证</Tag>
              </div>
            ),
            icon: <ReconciliationOutlined />,
          },
          {
            title: '签名验证',
            description: (
              <div>
                <Text>请求必须携带签名和时间戳</Text>
                <br />
                <Text code>X-Timestamp: {'{时间戳}'}</Text>
                <br />
                <Text code>X-Nonce: {'{随机数}'}</Text>
                <br />
                <Text code>X-Signature: {'{签名}'}</Text>
                <br />
                <Tag color="green" style={{ marginTop: 8 }}>HMAC-SHA256 签名</Tag>
              </div>
            ),
            icon: <SafetyOutlined />,
          },
          {
            title: '心跳/数据上报',
            description: (
              <div>
                <Text>终端定期上报数据维持绑定状态</Text>
                <br />
                <Tag color="orange" style={{ marginTop: 8 }}>10分钟超时</Tag>
              </div>
            ),
            icon: <SyncOutlined />,
          },
          {
            title: '指令轮询',
            description: '终端主动轮询获取待执行指令',
            icon: <CheckCircleOutlined />,
          },
        ]}
      />
      
      <Divider>可靠性保证</Divider>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <div><Tag color="blue">签名验证</Tag> 防止请求伪造</div>
        <div><Tag color="green">时间戳验证</Tag> 5分钟有效期防重放</div>
        <div><Tag color="orange">Nonce 缓存</Tag> 防止重复请求</div>
        <div><Tag color="purple">幂等设计</Tag> 重复注册返回已有绑定</div>
      </Space>
    </div>
  )
}