import React, { useState } from 'react'
import { Card, Row, Col, Table, Switch, Button, Space, Tag, Modal, Form, Input, Select, message, Divider, Collapse, Steps, Drawer, Empty, Tooltip, Badge, Avatar, Radio, InputNumber, Alert, Timeline, Typography, Statistic } from 'antd'
import { 
  SettingOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  DragOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  BellOutlined,
  ThunderboltOutlined,
  CopyOutlined,
  EyeOutlined,
  RocketOutlined,
  DollarOutlined,
  WalletOutlined,
  FileTextOutlined,
} from '@ant-design/icons'

const { Option } = Select
const { Panel } = Collapse
const { Title, Text } = Typography
const { Step } = Steps

interface ApprovalFlow {
  id: string
  name: string
  type: string
  steps: number
  enabled: boolean
  description: string
  approvers: string[]
  conditions: any
}

const ApprovalSettings: React.FC = () => {
  const [flows, setFlows] = useState<ApprovalFlow[]>([
    {
      id: '1',
      name: '采购审批流程',
      type: '采购审批',
      steps: 3,
      enabled: true,
      description: '采购金额 < 10 万：部门经理→财务经理；≥10 万：加总经理审批',
      approvers: ['部门经理', '财务经理', '总经理'],
      conditions: { amount: 100000 },
    },
    {
      id: '2',
      name: '费用报销流程',
      type: '费用报销',
      steps: 2,
      enabled: true,
      description: '报销金额 < 5000：部门经理审批；≥5000：加财务审批',
      approvers: ['部门经理', '财务经理'],
      conditions: { amount: 5000 },
    },
    {
      id: '3',
      name: '合同审批流程',
      type: '合同审批',
      steps: 4,
      enabled: true,
      description: '合同金额 < 50 万：部门→财务→法务；≥50 万：加总经理审批',
      approvers: ['部门经理', '财务经理', '法务', '总经理'],
      conditions: { amount: 500000 },
    },
    {
      id: '4',
      name: '付款申请流程',
      type: '付款申请',
      steps: 3,
      enabled: true,
      description: '付款申请：部门经理→财务经理→总经理',
      approvers: ['部门经理', '财务经理', '总经理'],
      conditions: {},
    },
    {
      id: '5',
      name: '请假审批流程',
      type: '请假申请',
      steps: 2,
      enabled: true,
      description: '请假 < 3 天：部门经理审批；≥3 天：加 HR 审批',
      approvers: ['部门经理', 'HR 经理'],
      conditions: { days: 3 },
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<ApprovalFlow | null>(null)
  const [form] = Form.useForm()

  const typeColors: Record<string, string> = {
    '采购审批': 'blue',
    '费用报销': 'green',
    '合同审批': 'purple',
    '付款申请': 'orange',
    '请假申请': 'cyan',
  }

  const typeIcons: Record<string, JSX.Element> = {
    '采购审批': <ThunderboltOutlined />,
    '费用报销': <DollarOutlined />,
    '合同审批': <FileTextOutlined />,
    '付款申请': <WalletOutlined />,
    '请假申请': <ClockCircleOutlined />,
  }

  const handleToggle = (id: string) => {
    setFlows(flows.map(f => 
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ))
    const flow = flows.find(f => f.id === id)
    message.success(`流程已${flow?.enabled ? '禁用' : '启用'}`)
  }

  const handleEdit = (flow: ApprovalFlow) => {
    setSelectedFlow(flow)
    form.setFieldsValue(flow)
    setDrawerVisible(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后将无法恢复，确定要删除该审批流程吗？',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        setFlows(flows.filter(f => f.id !== id))
        message.success('删除成功')
      },
    })
  }

  const handleDuplicate = (flow: ApprovalFlow) => {
    const newFlow = {
      ...flow,
      id: Date.now().toString(),
      name: `${flow.name} (副本)`,
      enabled: false,
    }
    setFlows([...flows, newFlow])
    message.success('复制成功，请编辑新流程')
  }

  const columns = [
    {
      title: '流程名称',
      dataIndex: 'name',
      width: 220,
      render: (name: string, record: any) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.steps}步审批</div>
        </div>
      ),
    },
    {
      title: '审批类型',
      dataIndex: 'type',
      width: 140,
      render: (type: string) => (
        <Tag color={typeColors[type]} icon={typeIcons[type]}>
          {type}
        </Tag>
      ),
    },
    {
      title: '审批人',
      key: 'approvers',
      width: 200,
      render: (_: any, record: ApprovalFlow) => (
        <Space size={4}>
          {record.approvers.slice(0, 3).map((approver, index) => (
            <Tooltip key={index} title={approver}>
              <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
                {approver[0]}
              </Avatar>
            </Tooltip>
          ))}
          {record.approvers.length > 3 && (
            <Avatar size="small" style={{ backgroundColor: '#f5f5f5', color: '#666' }}>
              +{record.approvers.length - 3}
            </Avatar>
          )}
        </Space>
      ),
    },
    {
      title: '流程说明',
      dataIndex: 'description',
      ellipsis: { showTitle: false },
      render: (description: string) => (
        <Tooltip title={description}>
          <Text type="secondary" style={{ fontSize: 13 }}>{description}</Text>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      key: 'enabled',
      width: 120,
      render: (_: any, record: ApprovalFlow) => (
        <Switch
          checked={record.enabled}
          onChange={() => handleToggle(record.id)}
          checkedChildren={<CheckCircleOutlined />}
          unCheckedChildren={<CloseCircleOutlined />}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: ApprovalFlow) => (
        <Space size="small">
          <Tooltip title="查看流程">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => { setSelectedFlow(record); setDrawerVisible(true); }}
            />
          </Tooltip>
          <Tooltip title="编辑流程">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="复制流程">
            <Button type="text" icon={<CopyOutlined />} onClick={() => handleDuplicate(record)} />
          </Tooltip>
          <Tooltip title="删除流程">
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>⚙️ 审批流设置</Title>
            <Text type="secondary">配置审批流程、审批人和审批规则，支持内外部审批流</Text>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />}
            onClick={() => { setSelectedFlow(null); form.resetFields(); setDrawerVisible(true); }}
            style={{ height: 40 }}
          >
            新建审批流程
          </Button>
        </div>
      </div>

      {/* 快速统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="总流程数"
              value={flows.length}
              suffix="个"
              valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 700 }}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="启用中"
              value={flows.filter(f => f.enabled).length}
              suffix="个"
              valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 700 }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="已禁用"
              value={flows.filter(f => !f.enabled).length}
              suffix="个"
              valueStyle={{ color: '#999', fontSize: 24, fontWeight: 700 }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="平均步骤"
              value={(flows.reduce((sum, f) => sum + f.steps, 0) / flows.length).toFixed(1)}
              suffix="步"
              valueStyle={{ color: '#722ed1', fontSize: 24, fontWeight: 700 }}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={18}>
          <Card
            title="📋 审批流程列表"
            extra={
              <Space>
                <Radio.Group defaultValue="all" size="small">
                  <Radio.Button value="all">全部</Radio.Button>
                  <Radio.Button value="enabled">启用中</Radio.Button>
                  <Radio.Button value="disabled">已禁用</Radio.Button>
                </Radio.Group>
              </Space>
            }
          >
            {flows.length > 0 ? (
              <Table
                columns={columns}
                dataSource={flows}
                rowKey="id"
                pagination={false}
                scroll={{ y: 600 }}
              />
            ) : (
              <Empty 
                description="暂无审批流程" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>
                  创建第一个流程
                </Button>
              </Empty>
            )}
          </Card>
        </Col>

        <Col span={6}>
          {/* 快速设置 */}
          <Card title="🔧 全局设置" size="small" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>审批方式</div>
              <Select defaultValue="serial" style={{ width: '100%' }} size="large">
                <Option value="serial">串行审批 (按顺序)</Option>
                <Option value="parallel">并行审批 (同时)</Option>
                <Option value="mixed">混合审批</Option>
              </Select>
              <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                串行：按顺序依次审批 | 并行：同时发送给所有审批人
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>审批超时 (小时)</div>
              <InputNumber 
                defaultValue={24} 
                style={{ width: '100%' }} 
                size="large"
                min={0}
                max={168}
              />
              <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                0 表示不限制，超时自动流转
              </Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>自动通过</div>
              <Switch defaultChecked style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 12, color: '#999' }}>
                审批人超时未处理，自动通过审批
              </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                <BellOutlined style={{ marginRight: 4 }} />
                审批通知
              </div>
              <Space direction="vertical">
                <Switch defaultChecked checkedChildren="站内信" unCheckedChildren="站内信" />
                <Switch defaultChecked checkedChildren="邮件" unCheckedChildren="邮件" />
                <Switch checkedChildren="钉钉" unCheckedChildren="钉钉" />
              </Space>
            </div>

            <Button type="primary" block size="large">保存全局设置</Button>
          </Card>

          {/* 审批人设置 */}
          <Card title="👥 审批人管理" size="small" style={{ marginBottom: 16 }}>
            <Collapse>
              <Panel header={<span><UserOutlined /> 部门经理 (2)</span>} key="1">
                <Timeline
                  items={[
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <div style={{ fontWeight: 500 }}>张三</div>
                          <div style={{ fontSize: 12, color: '#999' }}>生产部</div>
                        </div>
                      ),
                    },
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <div style={{ fontWeight: 500 }}>李四</div>
                          <div style={{ fontSize: 12, color: '#999' }}>销售部</div>
                        </div>
                      ),
                    },
                  ]}
                />
                <Button type="link" size="small" icon={<PlusOutlined />}>添加审批人</Button>
              </Panel>
              <Panel header={<span><TeamOutlined /> 财务经理 (1)</span>} key="2">
                <Timeline
                  items={[
                    {
                      color: 'green',
                      children: (
                        <div>
                          <div style={{ fontWeight: 500 }}>王五</div>
                          <div style={{ fontSize: 12, color: '#999' }}>财务部</div>
                        </div>
                      ),
                    },
                  ]}
                />
                <Button type="link" size="small" icon={<PlusOutlined />}>添加审批人</Button>
              </Panel>
              <Panel header={<span><UserOutlined /> 总经理 (1)</span>} key="3">
                <Timeline
                  items={[
                    {
                      color: 'purple',
                      children: (
                        <div>
                          <div style={{ fontWeight: 500 }}>赵六</div>
                          <div style={{ fontSize: 12, color: '#999' }}>总经办</div>
                        </div>
                      ),
                    },
                  ]}
                />
                <Button type="link" size="small" icon={<PlusOutlined />}>添加审批人</Button>
              </Panel>
            </Collapse>
          </Card>

          {/* 快捷操作 */}
          <Card title="⚡ 快捷操作" size="small">
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              <Button block icon={<CopyOutlined />}>批量导出流程</Button>
              <Button block icon={<ThunderboltOutlined />}>一键启用所有</Button>
              <Button block danger icon={<CloseCircleOutlined />}>一键禁用所有</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 新建/编辑流程抽屉 */}
      <Drawer
        title={selectedFlow ? `编辑：${selectedFlow.name}` : '新建审批流程'}
        placement="right"
        width={720}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => setDrawerVisible(false)}>保存流程</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" size="large">
          <Title level={5}>基本信息</Title>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <Form.Item 
              name="name" 
              label="流程名称" 
              rules={[{ required: true, message: '请输入流程名称' }]}
            >
              <Input placeholder="如：采购审批流程" />
            </Form.Item>

            <Form.Item 
              name="type" 
              label="审批类型" 
              rules={[{ required: true, message: '请选择审批类型' }]}
            >
              <Select placeholder="请选择">
                <Option value="采购审批">🔵 采购审批</Option>
                <Option value="费用报销">🟢 费用报销</Option>
                <Option value="合同审批">🟣 合同审批</Option>
                <Option value="付款申请">🟠 付款申请</Option>
                <Option value="请假申请">🔷 请假申请</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item 
            name="description" 
            label="流程说明"
            rules={[{ required: true, message: '请输入流程说明' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请描述流程规则和适用场景，如：采购金额 < 10 万：部门经理→财务经理"
            />
          </Form.Item>

          <Divider />

          <Title level={5}>审批步骤</Title>
          
          <Alert
            message="审批流程设计"
            description="拖拽调整审批顺序，点击添加新的审批节点"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <div style={{ marginBottom: 16 }}>
            <Steps
              current={-1}
              items={[
                { title: '申请人', description: '提交申请', icon: <UserOutlined /> },
                { title: '部门经理', description: '审批', icon: <TeamOutlined /> },
                { title: '财务经理', description: '审批', icon: <TeamOutlined /> },
                { title: '总经理', description: '最终审批', icon: <UserOutlined /> },
              ]}
              direction="vertical"
              size="small"
            />
          </div>

          <Button type="dashed" block icon={<PlusOutlined />} size="large">
            添加审批节点
          </Button>

          <Divider />

          <Title level={5}>审批条件</Title>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name={['conditions', 'amount']} label="金额阈值 (元)">
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder="如：100000"
                formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => Number(value?.replace(/¥\s?|(,*)/g, ''))}
              />
            </Form.Item>

            <Form.Item name={['conditions', 'days']} label="天数阈值 (天)">
              <InputNumber style={{ width: '100%' }} placeholder="如：3" />
            </Form.Item>
          </div>

          <Text type="secondary" style={{ fontSize: 12 }}>
            满足条件时触发额外审批节点，如金额超过阈值需要总经理审批
          </Text>

          <Divider />

          <Title level={5}>高级设置</Title>
          
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>审批方式</div>
              <Radio.Group defaultValue="serial">
                <Radio value="serial">串行审批</Radio>
                <Radio value="parallel">并行审批</Radio>
              </Radio.Group>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>可驳回</div>
              <Switch defaultChecked />
              <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>允许审批人驳回申请</Text>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>可转交</div>
              <Switch />
              <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>允许审批人转交给他人</Text>
            </div>
          </div>
        </Form>
      </Drawer>
    </div>
  )
}

export default ApprovalSettings
