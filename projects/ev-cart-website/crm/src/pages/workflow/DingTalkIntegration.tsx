import React, { useState } from 'react'
import { Card, Row, Col, Statistic, Switch, Button, Space, Tag, Modal, Form, Input, message, Alert, Steps, Timeline, Qrcode } from 'antd'
import { CheckCircleOutlined, SyncOutlined, LinkOutlined, QrcodeOutlined, ScanOutlined } from '@ant-design/icons'

const DingTalkIntegration: React.FC = () => {
  const [connected, setConnected] = useState(true)
  const [syncEnabled, setSyncEnabled] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)

  const dingtalkConfig = {
    corpId: 'ding12345678',
    agentId: '1234567890',
    appKey: 'app_key_xxxxx',
    status: 'connected',
    lastSync: '2026-03-13 09:00',
  }

  const syncStats = {
    totalApprovals: 156,
    syncedToday: 28,
    pending: 5,
    failed: 0,
  }

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>🔗 钉钉审批集成</h1>
        <p style={{ color: '#666' }}>实现内部审批流与钉钉第三方审批双向同步</p>
      </div>

      {/* 连接状态 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: '#0089FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              color: 'white',
            }}>
              💬
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>钉钉审批</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag color="success" icon={<CheckCircleOutlined />}>已连接</Tag>
                <span style={{ color: '#999', fontSize: 13 }}>企业 ID: {dingtalkConfig.corpId}</span>
              </div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                最后同步：{dingtalkConfig.lastSync}
              </div>
            </div>
          </div>
          <Space size="large">
            <Button
              type={connected ? 'primary' : 'default'}
              onClick={() => setConnected(!connected)}
            >
              {connected ? '断开连接' : '连接钉钉'}
            </Button>
          </Space>
        </div>
      </Card>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总审批数"
              value={syncStats.totalApprovals}
              suffix="个"
              valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日同步"
              value={syncStats.syncedToday}
              suffix="个"
              valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 700 }}
              prefix={<SyncOutlined spin />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理"
              value={syncStats.pending}
              suffix="个"
              valueStyle={{ color: '#faad14', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="同步失败"
              value={syncStats.failed}
              suffix="个"
              valueStyle={{ color: '#ff4d4f', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="⚙️ 集成设置">
            <Alert
              message="钉钉审批集成已启用"
              description="内部审批流与钉钉审批双向同步，审批数据实时同步到钉钉，钉钉审批结果同步回系统"
              type="success"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>同步设置</h3>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>审批同步</div>
                    <div style={{ fontSize: 12, color: '#999' }}>内部审批同步到钉钉</div>
                  </div>
                  <Switch
                    checked={syncEnabled}
                    onChange={setSyncEnabled}
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>状态同步</div>
                    <div style={{ fontSize: 12, color: '#999' }}>钉钉审批状态同步回系统</div>
                  </div>
                  <Switch defaultChecked checkedChildren="开启" unCheckedChildren="关闭" />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>消息通知</div>
                    <div style={{ fontSize: 12, color: '#999' }}>审批通知发送到钉钉</div>
                  </div>
                  <Switch defaultChecked checkedChildren="开启" unCheckedChildren="关闭" />
                </div>
              </div>
            </div>

            <Divider orientation="left">审批类型映射</Divider>

            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>采购审批</span>
                  <Tag color="blue">钉钉采购审批</Tag>
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>内部采购审批 ↔ 钉钉采购审批</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>费用报销</span>
                  <Tag color="green">钉钉费用报销</Tag>
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>内部费用报销 ↔ 钉钉费用报销</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>合同审批</span>
                  <Tag color="purple">钉钉合同审批</Tag>
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>内部合同审批 ↔ 钉钉合同审批</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>请假申请</span>
                  <Tag color="cyan">钉钉请假审批</Tag>
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>内部请假审批 ↔ 钉钉请假审批</div>
              </div>
            </div>

            <Space>
              <Button type="primary">保存设置</Button>
              <Button icon={<SyncOutlined />}>立即同步</Button>
              <Button onClick={() => setModalVisible(true)}>查看同步日志</Button>
            </Space>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="📱 钉钉扫码绑定">
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: 180,
                height: 180,
                margin: '0 auto 16px',
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}>
                <QrcodeOutlined style={{ fontSize: 120, color: '#0089FF' }} />
              </div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>使用钉钉扫码绑定</div>
              <div style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>
                使用钉钉 APP 扫描二维码完成绑定
              </div>
              <Button icon={<ScanOutlined />} block>重新生成二维码</Button>
            </div>
          </Card>

          <Card title="📊 同步统计" style={{ marginTop: 16 }}>
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <div>同步成功 28 个审批</div>
                      <div style={{ fontSize: 12, color: '#999' }}>今天 09:00</div>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  children: (
                    <div>
                      <div>同步成功 15 个审批</div>
                      <div style={{ fontSize: 12, color: '#999' }}>昨天 18:00</div>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <div>完成钉钉配置</div>
                      <div style={{ fontSize: 12, color: '#999' }}>2026-03-01</div>
                    </div>
                  ),
                },
              ]}
            />
          </Card>

          <Card title="❓ 常见问题" style={{ marginTop: 16 }}>
            <Collapse>
              <Panel header="如何配置钉钉审批？" key="1">
                <div style={{ fontSize: 13, color: '#666' }}>
                  1. 在钉钉管理后台创建审批模板<br/>
                  2. 获取 CorpId 和 AgentId<br/>
                  3. 在系统中配置钉钉参数<br/>
                  4. 完成审批类型映射
                </div>
              </Panel>
              <Panel header="审批同步失败怎么办？" key="2">
                <div style={{ fontSize: 13, color: '#666' }}>
                  1. 检查钉钉连接状态<br/>
                  2. 查看同步日志<br/>
                  3. 确认审批类型映射正确<br/>
                  4. 联系技术支持
                </div>
              </Panel>
              <Panel header="支持哪些审批类型？" key="3">
                <div style={{ fontSize: 13, color: '#666' }}>
                  支持采购审批、费用报销、合同审批、付款申请、请假申请等常见审批类型，也支持自定义审批类型映射。
                </div>
              </Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>

      <Modal
        title="同步日志"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={[
            { id: '1', type: '采购审批', title: 'PO20260313001', status: 'success', time: '2026-03-13 09:00' },
            { id: '2', type: '费用报销', title: '报销 - 差旅费', status: 'success', time: '2026-03-13 08:45' },
            { id: '3', type: '合同审批', title: '合同 - 某某物流', status: 'success', time: '2026-03-13 08:30' },
          ]}
          rowKey="id"
          pagination={false}
          columns={[
            { title: '审批类型', dataIndex: 'type', width: 120 },
            { title: '审批主题', dataIndex: 'title' },
            {
              title: '状态',
              dataIndex: 'status',
              width: 100,
              render: (status: string) => <Tag color={status === 'success' ? 'success' : 'error'}>{status === 'success' ? '成功' : '失败'}</Tag>,
            },
            { title: '同步时间', dataIndex: 'time', width: 160 },
          ]}
        />
      </Modal>
    </div>
  )
}

export default DingTalkIntegration
