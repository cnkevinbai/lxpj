/**
 * 条件分支管理页面
 * 条件表达式配置、分支路由管理、条件评估测试
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Descriptions,
  Badge,
  Switch,
  Divider,
  Alert,
  Tooltip,
  Collapse,
} from 'antd'
import {
  BranchesOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  OrderedListOutlined,
  FunctionOutlined,
  DollarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { Panel } = Collapse

// 条件类型枚举
enum ConditionType {
  FIELD_COMPARE = 'FIELD_COMPARE',
  AMOUNT_RANGE = 'AMOUNT_RANGE',
  DEPARTMENT_MATCH = 'DEPARTMENT_MATCH',
  ROLE_MATCH = 'ROLE_MATCH',
  CUSTOM_EXPRESSION = 'CUSTOM_EXPRESSION',
  TIME_CONDITION = 'TIME_CONDITION',
  USER_ATTRIBUTE = 'USER_ATTRIBUTE',
}

// 比较操作符枚举
enum CompareOperator {
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  GREATER = 'GREATER',
  LESS = 'LESS',
  GREATER_EQUAL = 'GREATER_EQUAL',
  LESS_EQUAL = 'LESS_EQUAL',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  IN_LIST = 'IN_LIST',
  NOT_IN_LIST = 'NOT_IN_LIST',
}

export default function ConditionBranch() {
  const [conditionRules, setConditionRules] = useState<any[]>([])
  const [branchRoutes, setBranchRoutes] = useState<any[]>([])
  const [branchNodes, setBranchNodes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [testModalVisible, setTestModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedRule, setSelectedRule] = useState<any | null>(null)
  const [testResults, setTestResults] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalRules: 8,
    enabledRules: 8,
    avgMatchRate: 45,
  })
  const [form] = Form.useForm()
  const [testForm] = Form.useForm()

  useEffect(() => {
    fetchConditionRules()
    fetchBranchRoutes()
    fetchBranchNodes()
    fetchStats()
  }, [])

  const fetchConditionRules = async () => {
    setLoading(true)
    const mockRules = [
      { id: 'CR-001', name: '金额大于5万', type: ConditionType.AMOUNT_RANGE, field: 'amount', operator: CompareOperator.GREATER, value: 50000, priority: 1, enabled: true, description: '采购金额超过50000元需要总经理审批' },
      { id: 'CR-002', name: '金额大于10万', type: ConditionType.AMOUNT_RANGE, field: 'amount', operator: CompareOperator.GREATER, value: 100000, priority: 2, enabled: true, description: '采购金额超过100000元需要董事会审批' },
      { id: 'CR-003', name: '研发部门申请', type: ConditionType.DEPARTMENT_MATCH, field: 'department', operator: CompareOperator.EQUAL, value: '研发部', priority: 3, enabled: true, description: '研发部门的采购申请需要技术总监审批' },
      { id: 'CR-004', name: '紧急采购', type: ConditionType.FIELD_COMPARE, field: 'isUrgent', operator: CompareOperator.EQUAL, value: true, priority: 10, enabled: true, description: '紧急采购标记为true时走快速通道' },
      { id: 'CR-005', name: '请假天数大于3天', type: ConditionType.FIELD_COMPARE, field: 'leaveDays', operator: CompareOperator.GREATER, value: 3, priority: 1, enabled: true, description: '请假超过3天需要HR审批' },
      { id: 'CR-006', name: '请假天数大于7天', type: ConditionType.FIELD_COMPARE, field: 'leaveDays', operator: CompareOperator.GREATER, value: 7, priority: 2, enabled: true, description: '请假超过7天需要总经理审批' },
      { id: 'CR-007', name: '工作时间申请', type: ConditionType.TIME_CONDITION, expression: 'hour >= 9 && hour <= 18', priority: 5, enabled: true, description: '工作时间内的申请走正常流程' },
      { id: 'CR-008', name: '申请人级别经理', type: ConditionType.USER_ATTRIBUTE, field: 'applicantLevel', operator: CompareOperator.IN_LIST, values: ['经理', '总监', '总经理'], priority: 8, enabled: true, description: '申请人级别为经理时跳过部门审批' },
    ]
    setConditionRules(mockRules)
    setLoading(false)
  }

  const fetchBranchRoutes = async () => {
    const mockRoutes = [
      { id: 'BR-001', name: '总经理审批', conditionId: 'CR-001', targetNodeName: '总经理审批', order: 1 },
      { id: 'BR-002', name: '董事会审批', conditionId: 'CR-002', targetNodeName: '董事会审批', order: 2 },
      { id: 'BR-003', name: '技术总监审批', conditionId: 'CR-003', targetNodeName: '技术总监审批', order: 3 },
      { id: 'BR-004', name: '快速通道', conditionId: 'CR-004', targetNodeName: '快速审批', order: 0 },
      { id: 'BR-005', name: 'HR审批', conditionId: 'CR-005', targetNodeName: 'HR审批', order: 1 },
      { id: 'BR-006', name: '总经理审批请假', conditionId: 'CR-006', targetNodeName: '总经理审批', order: 2 },
    ]
    setBranchRoutes(mockRoutes)
  }

  const fetchBranchNodes = async () => {
    const mockNodes = [
      { id: 'CBN-001', nodeId: 'N-COND-001', nodeName: '采购金额判断', branchType: 'EXCLUSIVE', evaluationMode: 'FIRST_MATCH', conditionsCount: 2 },
      { id: 'CBN-002', nodeId: 'N-COND-002', nodeName: '部门类型判断', branchType: 'CONDITION', evaluationMode: 'FIRST_MATCH', conditionsCount: 1 },
      { id: 'CBN-003', nodeId: 'N-COND-003', nodeName: '请假天数判断', branchType: 'EXCLUSIVE', evaluationMode: 'FIRST_MATCH', conditionsCount: 2 },
      { id: 'CBN-004', nodeId: 'N-COND-004', nodeName: '紧急采购判断', branchType: 'CONDITION', evaluationMode: 'FIRST_MATCH', conditionsCount: 1 },
    ]
    setBranchNodes(mockNodes)
  }

  const fetchStats = async () => {
    setStats({ totalRules: 8, enabledRules: 8, avgMatchRate: 45 })
  }

  const getConditionTypeTag = (type: ConditionType) => {
    const config: Record<ConditionType, { color: string; icon: any; text: string }> = {
      FIELD_COMPARE: { color: 'blue', icon: <OrderedListOutlined />, text: '字段比较' },
      AMOUNT_RANGE: { color: 'gold', icon: <DollarOutlined />, text: '金额范围' },
      DEPARTMENT_MATCH: { color: 'green', icon: <TeamOutlined />, text: '部门匹配' },
      ROLE_MATCH: { color: 'purple', icon: <UserOutlined />, text: '角色匹配' },
      CUSTOM_EXPRESSION: { color: 'cyan', icon: <FunctionOutlined />, text: '自定义表达式' },
      TIME_CONDITION: { color: 'orange', icon: <ClockCircleOutlined />, text: '时间条件' },
      USER_ATTRIBUTE: { color: 'magenta', icon: <UserOutlined />, text: '用户属性' },
    }
    const c = config[type]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getOperatorText = (operator: CompareOperator) => {
    const config: Record<CompareOperator, string> = {
      EQUAL: '=',
      NOT_EQUAL: '≠',
      GREATER: '>',
      LESS: '<',
      GREATER_EQUAL: '≥',
      LESS_EQUAL: '≤',
      CONTAINS: '包含',
      NOT_CONTAINS: '不包含',
      IN_LIST: '在列表中',
      NOT_IN_LIST: '不在列表中',
    }
    return config[operator] || operator
  }

  const getBranchTypeTag = (type: string) => {
    const config: Record<string, { color: string; text: string }> = {
      CONDITION: { color: 'blue', text: '条件分支' },
      EXCLUSIVE: { color: 'purple', text: '排他分支' },
      PARALLEL: { color: 'green', text: '并行分支' },
    }
    return <Tag color={config[type]?.color || 'default'}>{config[type]?.text || type}</Tag>
  }

  const handleTest = async () => {
    try {
      const values = await testForm.validateFields()
      // 模拟测试结果
      const results = conditionRules.map(rule => {
        let matched = false
        const fieldValue = values[rule.field || '']

        // 简化匹配逻辑
        if (rule.operator === CompareOperator.GREATER) {
          matched = fieldValue > rule.value
        } else if (rule.operator === CompareOperator.EQUAL) {
          matched = fieldValue === rule.value
        } else if (rule.operator === CompareOperator.IN_LIST) {
          matched = rule.values?.includes(fieldValue)
        }

        return {
          ruleId: rule.id,
          ruleName: rule.name,
          result: matched,
          input: values,
          reason: matched ? '条件匹配' : '条件不匹配',
        }
      })

      setTestResults(results)
      message.success('条件评估完成')
    } catch (error) {
      console.error('Test failed:', error)
    }
  }

  const conditionColumns: ColumnsType<any> = [
    { title: '规则ID', dataIndex: 'id', width: 80 },
    { title: '规则名称', dataIndex: 'name', width: 150 },
    { title: '类型', dataIndex: 'type', width: 120, render: (type: ConditionType) => getConditionTypeTag(type) },
    { title: '字段', dataIndex: 'field', width: 100 },
    { title: '操作符', dataIndex: 'operator', width: 80, render: (op: CompareOperator) => <Text code>{getOperatorText(op)}</Text> },
    { title: '值', width: 100, render: (_, record) => record.values ? record.values.join(',') : String(record.value || '-') },
    { title: '优先级', dataIndex: 'priority', width: 60, render: (p: number) => <Badge count={p} style={{ backgroundColor: '#1890ff' }} /> },
    { title: '状态', dataIndex: 'enabled', width: 80, render: (enabled: boolean) => <Switch checked={enabled} size="small" /> },
    { title: '操作', key: 'action', width: 120, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setSelectedRule(record); setModalVisible(true); form.setFieldsValue(record) }}>编辑</Button>
        <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => { setSelectedRule(record); setTestModalVisible(true) }}>测试</Button>
      </Space>
    )},
  ]

  const routeColumns: ColumnsType<any> = [
    { title: '路由ID', dataIndex: 'id', width: 80 },
    { title: '路由名称', dataIndex: 'name', width: 120 },
    { title: '条件', dataIndex: 'conditionId', width: 80, render: (id: string) => id ? <Tag color="blue">{id}</Tag> : <Tag>默认</Tag> },
    { title: '目标节点', dataIndex: 'targetNodeName', width: 120 },
    { title: '顺序', dataIndex: 'order', width: 60 },
  ]

  const branchNodeColumns: ColumnsType<any> = [
    { title: '节点ID', dataIndex: 'nodeId', width: 100 },
    { title: '节点名称', dataIndex: 'nodeName', width: 150 },
    { title: '分支类型', dataIndex: 'branchType', width: 100, render: (type: string) => getBranchTypeTag(type) },
    { title: '评估模式', dataIndex: 'evaluationMode', width: 100, render: (mode: string) => <Tag color="cyan">{mode}</Tag> },
    { title: '条件数', dataIndex: 'conditionsCount', width: 60 },
    { title: '操作', key: 'action', width: 80, render: (_, record) => <Button type="link" size="small" icon={<EditOutlined />}>配置</Button> },
  ]

  const testResultColumns: ColumnsType<any> = [
    { title: '规则', dataIndex: 'ruleName', width: 150 },
    { title: '结果', dataIndex: 'result', width: 80, render: (result: boolean) => result ? <Tag color="success" icon={<CheckCircleOutlined />}>匹配</Tag> : <Tag color="default" icon={<CloseCircleOutlined />}>不匹配</Tag> },
    { title: '原因', dataIndex: 'reason', width: 200 },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <BranchesOutlined style={{ marginRight: 8 }} />
            条件分支管理
          </Title>
          <Text type="secondary">条件表达式配置、分支路由管理、条件评估测试</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<PlayCircleOutlined />} onClick={() => setTestModalVisible(true)}>批量测试</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalVisible(true) }}>新建规则</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card className="daoda-card stat-card">
            <Typography.Text type="secondary">规则总数</Typography.Text>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>{stats.totalRules}</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="daoda-card stat-card">
            <Typography.Text type="secondary">启用规则</Typography.Text>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>{stats.enabledRules}</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="daoda-card stat-card">
            <Typography.Text type="secondary">平均匹配率</Typography.Text>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>{stats.avgMatchRate}%</div>
          </Card>
        </Col>
      </Row>

      {/* 条件规则列表 */}
      <Collapse defaultActiveKey={['rules', 'routes', 'nodes']}>
        <Panel header="条件规则" key="rules">
          <Card className="daoda-card" size="small">
            <Table
              columns={conditionColumns}
              dataSource={conditionRules}
              rowKey="id"
              loading={loading}
              pagination={false}
              size="small"
            />
          </Card>
        </Panel>
        <Panel header="分支路由" key="routes">
          <Card className="daoda-card" size="small">
            <Table
              columns={routeColumns}
              dataSource={branchRoutes}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Panel>
        <Panel header="分支节点" key="nodes">
          <Card className="daoda-card" size="small">
            <Table
              columns={branchNodeColumns}
              dataSource={branchNodes}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Panel>
      </Collapse>

      {/* 新建/编辑规则弹窗 */}
      <Modal
        title={selectedRule ? '编辑条件规则' : '新建条件规则'}
        open={modalVisible}
        onOk={() => { message.success('保存成功'); setModalVisible(false) }}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="规则名称" rules={[{ required: true }]}>
                <Input placeholder="如：金额大于5万" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="条件类型" rules={[{ required: true }]}>
                <Select placeholder="选择类型">
                  <Option value={ConditionType.FIELD_COMPARE}>字段比较</Option>
                  <Option value={ConditionType.AMOUNT_RANGE}>金额范围</Option>
                  <Option value={ConditionType.DEPARTMENT_MATCH}>部门匹配</Option>
                  <Option value={ConditionType.ROLE_MATCH}>角色匹配</Option>
                  <Option value={ConditionType.TIME_CONDITION}>时间条件</Option>
                  <Option value={ConditionType.USER_ATTRIBUTE}>用户属性</Option>
                  <Option value={ConditionType.CUSTOM_EXPRESSION}>自定义表达式</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="规则描述">
            <Input.TextArea placeholder="描述规则的用途" rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="field" label="比较字段">
                <Input placeholder="如：amount、department" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="operator" label="操作符">
                <Select placeholder="选择操作符">
                  <Option value={CompareOperator.EQUAL}>= 等于</Option>
                  <Option value={CompareOperator.NOT_EQUAL}>≠ 不等于</Option>
                  <Option value={CompareOperator.GREATER}>&gt; 大于</Option>
                  <Option value={CompareOperator.LESS}>&lt; 小于</Option>
                  <Option value={CompareOperator.GREATER_EQUAL}>≥ 大于等于</Option>
                  <Option value={CompareOperator.LESS_EQUAL}>≤ 小于等于</Option>
                  <Option value={CompareOperator.IN_LIST}>在列表中</Option>
                  <Option value={CompareOperator.NOT_IN_LIST}>不在列表中</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="value" label="比较值">
                <InputNumber placeholder="数值或文本" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="priority" label="优先级">
                <InputNumber min={1} max={99} placeholder="1-99" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="enabled" label="启用状态" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 条件测试弹窗 */}
      <Modal
        title="条件评估测试"
        open={testModalVisible}
        onOk={handleTest}
        onCancel={() => setTestModalVisible(false)}
        width={700}
        okText="执行测试"
        cancelText="取消"
      >
        <Alert message="输入测试数据，系统将评估所有条件规则的匹配结果" type="info" showIcon style={{ marginBottom: 16 }} />
        <Form form={testForm} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="amount" label="采购金额">
                <InputNumber placeholder="金额" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="department" label="申请部门">
                <Select placeholder="选择部门">
                  <Option value="研发部">研发部</Option>
                  <Option value="市场部">市场部</Option>
                  <Option value="财务部">财务部</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="leaveDays" label="请假天数">
                <InputNumber min={1} placeholder="天数" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="isUrgent" label="紧急采购">
                <Select placeholder="是否紧急">
                  <Option value={true}>是</Option>
                  <Option value={false}>否</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="applicantLevel" label="申请人级别">
                <Select placeholder="选择级别">
                  <Option value="员工">员工</Option>
                  <Option value="经理">经理</Option>
                  <Option value="总监">总监</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {testResults.length > 0 && (
          <Divider>测试结果</Divider>
        )}
        {testResults.length > 0 && (
          <Table
            columns={testResultColumns}
            dataSource={testResults}
            rowKey="ruleId"
            pagination={false}
            size="small"
          />
        )}
      </Modal>
    </div>
  )
}