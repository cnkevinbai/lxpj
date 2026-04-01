/**
 * Workflow 前端页面 - 流程定义列表
 * 
 * 功能:
 * - 流程定义列表展示
 * - 创建/编辑/激活/停用流程
 * - 流程节点可视化编辑
 * 
 * @version 1.0.0
 * @since 2026-03-30
 */

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Card,
  Typography,
  Tooltip,
  Popconfirm,
  message,
  Drawer,
  Steps,
  Divider,
  Row,
  Col,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EyeOutlined,
  BranchesOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// ============================================
// 类型定义
// ============================================

interface WorkflowDefinition {
  id: string;
  name: string;
  code: string;
  category: string;
  version: number;
  description?: string;
  nodes: WorkflowNode[];
  isActive: boolean;
  dingtalkEnabled?: boolean;
  dingtalkProcessCode?: string;
  syncDirection?: 'to_dingtalk' | 'bidirectional';
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

interface WorkflowNode {
  id: string;
  name: string;
  type: 'start' | 'approve' | 'condition' | 'parallel' | 'end';
  order: number;
  approverType?: 'user' | 'role' | 'dept_head' | 'initiator';
  approverId?: string;
  approverRole?: string;
  approveMode?: 'single' | 'all' | 'any' | 'sequence';
  dingtalkSync?: boolean;
}

// 流程类别
const CATEGORY_OPTIONS = [
  { value: 'hr', label: '人事审批' },
  { value: 'finance', label: '财务审批' },
  { value: 'purchase', label: '采购审批' },
  { value: 'service', label: '服务审批' },
  { value: 'general', label: '通用审批' },
];

// ============================================
// 流程定义列表页面
// ============================================

const WorkflowDefinitionList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [definitions, setDefinitions] = useState<WorkflowDefinition[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentDefinition, setCurrentDefinition] = useState<WorkflowDefinition | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Mock 数据
  useEffect(() => {
    setLoading(true);
    // TODO: 调用 API 获取数据
    setTimeout(() => {
      setDefinitions([
        {
          id: 'wf-leave-001',
          name: '请假审批流程',
          code: 'leave_approval',
          category: 'hr',
          version: 1,
          description: '员工请假申请审批流程',
          nodes: [
            { id: 'start', name: '开始', type: 'start', order: 0 },
            { id: 'dept_head', name: '部门主管审批', type: 'approve', order: 1, approverType: 'dept_head', approveMode: 'single' },
            { id: 'hr', name: '人事确认', type: 'approve', order: 2, approverType: 'role', approverRole: 'hr_manager', approveMode: 'single' },
            { id: 'end', name: '结束', type: 'end', order: 3 },
          ],
          isActive: true,
          dingtalkEnabled: true,
          dingtalkProcessCode: 'PROC-LEAVE',
          syncDirection: 'bidirectional',
          createdBy: 'admin',
          createdAt: '2026-03-28 10:00:00',
        },
        {
          id: 'wf-purchase-001',
          name: '采购申请审批',
          code: 'purchase_approval',
          category: 'purchase',
          version: 2,
          description: '采购申请多级审批流程',
          nodes: [
            { id: 'start', name: '开始', type: 'start', order: 0 },
            { id: 'dept_mgr', name: '部门经理审批', type: 'approve', order: 1, approverType: 'dept_head', approveMode: 'single' },
            { id: 'finance', name: '财务审核', type: 'approve', order: 2, approverType: 'role', approverRole: 'finance_manager', approveMode: 'single' },
            { id: 'ceo', name: 'CEO审批(>10万)', type: 'approve', order: 3, approverType: 'user', approverId: 'ceo', approveMode: 'single' },
            { id: 'end', name: '结束', type: 'end', order: 4 },
          ],
          isActive: true,
          dingtalkEnabled: true,
          dingtalkProcessCode: 'PROC-PURCHASE',
          syncDirection: 'to_dingtalk',
          createdBy: 'admin',
          createdAt: '2026-03-29 14:00:00',
        },
        {
          id: 'wf-overtime-001',
          name: '加班申请审批',
          code: 'overtime_approval',
          category: 'hr',
          version: 1,
          description: '员工加班申请审批流程',
          nodes: [
            { id: 'start', name: '开始', type: 'start', order: 0 },
            { id: 'manager', name: '主管审批', type: 'approve', order: 1, approverType: 'dept_head', approveMode: 'single' },
            { id: 'end', name: '结束', type: 'end', order: 2 },
          ],
          isActive: false,
          dingtalkEnabled: false,
          createdBy: 'admin',
          createdAt: '2026-03-30 09:00:00',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // 表格列定义
  const columns: ColumnsType<WorkflowDefinition> = [
    {
      title: '流程名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: WorkflowDefinition) => (
        <Space>
          <BranchesOutlined style={{ color: '#6600ff' }} />
          <Typography.Text strong>{text}</Typography.Text>
          <Tag color="purple">{record.code}</Tag>
        </Space>
      ),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const option = CATEGORY_OPTIONS.find(o => o.value === category);
        return <Tag color={category === 'hr' ? 'blue' : category === 'finance' ? 'green' : 'orange'}>{option?.label || category}</Tag>;
      },
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version: number) => <Badge count={version} style={{ backgroundColor: '#6600ff' }} />,
    },
    {
      title: '节点数',
      key: 'nodes',
      render: (_, record: WorkflowDefinition) => (
        <Typography.Text>{record.nodes?.length || 0} 个节点</Typography.Text>
      ),
    },
    {
      title: '钉钉同步',
      key: 'dingtalk',
      render: (_, record: WorkflowDefinition) => (
        record.dingtalkEnabled ? (
          <Space>
            <ApiOutlined style={{ color: '#52c41a' }} />
            <Typography.Text type="success">
              {record.syncDirection === 'bidirectional' ? '双向同步' : '推送'}
            </Typography.Text>
          </Space>
        ) : (
          <Typography.Text type="secondary">未启用</Typography.Text>
        )
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'warning'}>
          {isActive ? '已激活' : '未激活'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: WorkflowDefinition) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setCurrentDefinition(record);
                setDetailDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentDefinition(record);
                editForm.setFieldsValue(record);
                setEditModalVisible(true);
              }}
            />
          </Tooltip>
          {record.isActive ? (
            <Popconfirm
              title="确定停用该流程？"
              onConfirm={() => handleDeactivate(record.id)}
            >
              <Tooltip title="停用">
                <Button type="text" icon={<StopOutlined />} danger />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Tooltip title="激活">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleActivate(record.id)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="确定删除该流程？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="删除">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 创建流程
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      // TODO: 调用 API 创建流程
      const newDefinition: WorkflowDefinition = {
        id: `wf-${values.code}-${Date.now()}`,
        name: values.name,
        code: values.code,
        category: values.category,
        version: 1,
        description: values.description,
        nodes: [
          { id: 'start', name: '开始', type: 'start', order: 0 },
          { id: 'end', name: '结束', type: 'end', order: 1 },
        ],
        isActive: false,
        dingtalkEnabled: values.dingtalkEnabled || false,
        dingtalkProcessCode: values.dingtalkProcessCode,
        syncDirection: values.syncDirection,
        createdBy: 'current_user',
        createdAt: new Date().toISOString(),
      };
      setDefinitions([...definitions, newDefinition]);
      setCreateModalVisible(false);
      createForm.resetFields();
      message.success('流程创建成功');
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  // 编辑流程
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();
      // TODO: 调用 API 更新流程
      setDefinitions(definitions.map(d => 
        d.id === currentDefinition?.id 
          ? { ...d, ...values, updatedAt: new Date().toISOString() }
          : d
      ));
      setEditModalVisible(false);
      message.success('流程更新成功');
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  // 激活流程
  const handleActivate = (id: string) => {
    // TODO: 调用 API 激活流程
    setDefinitions(definitions.map(d => 
      d.id === id ? { ...d, isActive: true } : d
    ));
    message.success('流程已激活');
  };

  // 停用流程
  const handleDeactivate = (id: string) => {
    // TODO: 调用 API 停用流程
    setDefinitions(definitions.map(d => 
      d.id === id ? { ...d, isActive: false } : d
    ));
    message.success('流程已停用');
  };

  // 删除流程
  const handleDelete = (id: string) => {
    // TODO: 调用 API 删除流程
    setDefinitions(definitions.filter(d => d.id !== id));
    message.success('流程已删除');
  };

  return (
    <div className="workflow-definition-list">
      {/* 页面头部 */}
      <Card className="glass-card" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              <BranchesOutlined style={{ marginRight: 8, color: '#6600ff' }} />
              流程定义管理
            </Typography.Title>
            <Typography.Text type="secondary">
              管理审批流程定义，支持钉钉审批双向同步
            </Typography.Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
              className="glass-button-primary"
            >
              创建流程
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 流程列表 */}
      <Card className="glass-card">
        <Table
          columns={columns}
          dataSource={definitions}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* 创建流程弹窗 */}
      <Modal
        title="创建审批流程"
        open={createModalVisible}
        onOk={handleCreate}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        width={600}
        className="glass-modal"
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="name"
            label="流程名称"
            rules={[{ required: true, message: '请输入流程名称' }]}
          >
            <Input placeholder="如：请假审批流程" />
          </Form.Item>

          <Form.Item
            name="code"
            label="流程编码"
            rules={[
              { required: true, message: '请输入流程编码' },
              { pattern: /^[a-z_]+$/, message: '只能使用小写字母和下划线' },
            ]}
          >
            <Input placeholder="如：leave_approval" />
          </Form.Item>

          <Form.Item
            name="category"
            label="流程类别"
            rules={[{ required: true, message: '请选择流程类别' }]}
          >
            <Select options={CATEGORY_OPTIONS} placeholder="选择类别" />
          </Form.Item>

          <Form.Item name="description" label="流程描述">
            <Input.TextArea rows={3} placeholder="描述该流程的用途和适用场景" />
          </Form.Item>

          <Divider>钉钉集成配置</Divider>

          <Form.Item name="dingtalkEnabled" label="启用钉钉同步" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="dingtalkProcessCode" label="钉钉流程编码">
            <Input placeholder="钉钉审批流程编码，如：PROC-LEAVE" />
          </Form.Item>

          <Form.Item name="syncDirection" label="同步方向">
            <Select
              options={[
                { value: 'to_dingtalk', label: '推送至钉钉' },
                { value: 'bidirectional', label: '双向同步' },
              ]}
              placeholder="选择同步方式"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑流程弹窗 */}
      <Modal
        title="编辑审批流程"
        open={editModalVisible}
        onOk={handleEdit}
        onCancel={() => setEditModalVisible(false)}
        width={600}
        className="glass-modal"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="流程名称"
            rules={[{ required: true, message: '请输入流程名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="流程描述">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Divider>钉钉集成配置</Divider>

          <Form.Item name="dingtalkEnabled" label="启用钉钉同步" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="dingtalkProcessCode" label="钉钉流程编码">
            <Input />
          </Form.Item>

          <Form.Item name="syncDirection" label="同步方向">
            <Select
              options={[
                { value: 'to_dingtalk', label: '推送至钉钉' },
                { value: 'bidirectional', label: '双向同步' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 流程详情抽屉 */}
      <Drawer
        title={
          <Space>
            <BranchesOutlined style={{ color: '#6600ff' }} />
            {currentDefinition?.name}
          </Space>
        }
        placement="right"
        width={500}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        className="glass-drawer"
      >
        {currentDefinition && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Typography.Text type="secondary">基本信息</Typography.Text>
              <Divider style={{ margin: '8px 0' }} />
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Typography.Text strong>编码: </Typography.Text>
                  <Tag color="purple">{currentDefinition.code}</Tag>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>版本: </Typography.Text>
                  <Badge count={currentDefinition.version} style={{ backgroundColor: '#6600ff' }} />
                </Col>
                <Col span={12}>
                  <Typography.Text strong>类别: </Typography.Text>
                  <Tag color="blue">
                    {CATEGORY_OPTIONS.find(o => o.value === currentDefinition.category)?.label}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>状态: </Typography.Text>
                  <Tag color={currentDefinition.isActive ? 'success' : 'warning'}>
                    {currentDefinition.isActive ? '已激活' : '未激活'}
                  </Tag>
                </Col>
              </Row>
              {currentDefinition.description && (
                <div style={{ marginTop: 8 }}>
                  <Typography.Text type="secondary">描述: </Typography.Text>
                  <Typography.Text>{currentDefinition.description}</Typography.Text>
                </div>
              )}
            </Card>

            {/* 流程节点可视化 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Typography.Text type="secondary">审批节点</Typography.Text>
              <Divider style={{ margin: '8px 0' }} />
              <Steps
                direction="vertical"
                current={-1}
                items={currentDefinition.nodes.map((node, index) => ({
                  title: node.name,
                  description: node.type === 'approve' 
                    ? `审批人: ${node.approverType === 'dept_head' ? '部门主管' : node.approverType === 'role' ? node.approverRole : '指定用户'}`
                    : undefined,
                  status: 'wait',
                  icon: node.type === 'start' ? <CheckCircleOutlined /> 
                    : node.type === 'end' ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    : <BranchesOutlined />,
                }))}
              />
            </Card>

            {/* 钉钉配置 */}
            {currentDefinition.dingtalkEnabled && (
              <Card size="small">
                <Typography.Text type="secondary">钉钉同步配置</Typography.Text>
                <Divider style={{ margin: '8px 0' }} />
                <Space direction="vertical" size="small">
                  <div>
                    <ApiOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    <Typography.Text strong>钉钉流程编码: </Typography.Text>
                    <Tag color="green">{currentDefinition.dingtalkProcessCode}</Tag>
                  </div>
                  <div>
                    <Typography.Text strong>同步方向: </Typography.Text>
                    <Tag color="blue">
                      {currentDefinition.syncDirection === 'bidirectional' ? '双向同步' : '推送至钉钉'}
                    </Tag>
                  </div>
                </Space>
              </Card>
            )}

            {/* 编辑节点按钮 */}
            <Button
              type="primary"
              icon={<EditOutlined />}
              block
              style={{ marginTop: 16 }}
              onClick={() => {
                // TODO: 打开节点编辑器
                message.info('节点编辑器待实现');
              }}
            >
              编辑审批节点
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default WorkflowDefinitionList;