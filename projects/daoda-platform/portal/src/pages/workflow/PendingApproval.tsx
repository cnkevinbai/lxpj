/**
 * Workflow 前端页面 - 我的待审批
 * 
 * 功能:
 * - 待审批列表展示
 * - 审批同意/拒绝/转交
 * - 审批详情查看
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
  Card,
  Typography,
  Tooltip,
  Badge,
  Drawer,
  Steps,
  Divider,
  Row,
  Col,
  Avatar,
  List,
  Tabs,
  Upload,
  message,
  Popconfirm,
  Select,
  Empty,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SwapOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  HistoryOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// ============================================
// 类型定义
// ============================================

interface WorkflowInstance {
  id: string;
  definitionId: string;
  definitionCode: string;
  businessType: string;
  businessId: string;
  title: string;
  content?: string;
  formData?: Record<string, any>;
  initiatorId: string;
  initiatorName?: string;
  status: 'running' | 'approved' | 'rejected' | 'cancelled' | 'timeout';
  currentNodeId: string;
  currentNodeName?: string;
  currentApproverIds?: string[];
  dingtalkInstanceId?: string;
  dingtalkStatus?: string;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
}

interface ApprovalRecord {
  id: string;
  instanceId: string;
  nodeId: string;
  nodeName: string;
  approverId: string;
  approverName: string;
  action: 'approve' | 'reject' | 'transfer' | 'return';
  comment?: string;
  attachments?: string[];
  approvedAt: string;
  source: 'system' | 'dingtalk';
  transferToId?: string;
  transferToName?: string;
}

// 业务类型
const BUSINESS_TYPE_OPTIONS = [
  { value: 'leave', label: '请假申请' },
  { value: 'purchase', label: '采购申请' },
  { value: 'expense', label: '报销申请' },
  { value: 'overtime', label: '加班申请' },
  { value: 'travel', label: '出差申请' },
];

// ============================================
// 我的待审批页面
// ============================================

const PendingApproval: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pendingList, setPendingList] = useState<WorkflowInstance[]>([]);
  const [initiatedList, setInitiatedList] = useState<WorkflowInstance[]>([]);
  const [approvedList, setApprovedList] = useState<WorkflowInstance[]>([]);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [currentInstance, setCurrentInstance] = useState<WorkflowInstance | null>(null);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalRecord[]>([]);
  const [approveForm] = Form.useForm();
  const [rejectForm] = Form.useForm();
  const [transferForm] = Form.useForm();

  // 当前Tab
  const [activeTab, setActiveTab] = useState('pending');

  // Mock 数据
  useEffect(() => {
    setLoading(true);
    // TODO: 调用 API 获取数据
    setTimeout(() => {
      // 待审批列表
      setPendingList([
        {
          id: 'wi-leave-001',
          definitionId: 'def-leave-001',
          definitionCode: 'leave_approval',
          businessType: 'leave',
          businessId: 'LEAVE-2026-001',
          title: '张三请假申请 - 3天',
          content: '请假原因：家中有事需要处理',
          formData: {
            leaveType: '事假',
            startDate: '2026-03-31',
            endDate: '2026-04-02',
            days: 3,
            reason: '家中有事需要处理',
          },
          initiatorId: 'user-001',
          initiatorName: '张三',
          status: 'running',
          currentNodeId: 'dept_head',
          currentNodeName: '部门主管审批',
          createdAt: '2026-03-30 08:30:00',
          updatedAt: '2026-03-30 08:30:00',
        },
        {
          id: 'wi-purchase-001',
          definitionId: 'def-purchase-001',
          definitionCode: 'purchase_approval',
          businessType: 'purchase',
          businessId: 'PUR-2026-001',
          title: '采购申请 - 办公设备',
          content: '采购5台笔记本电脑，预算50000元',
          formData: {
            item: '笔记本电脑',
            quantity: 5,
            budget: 50000,
            supplier: '联想',
          },
          initiatorId: 'user-002',
          initiatorName: '李四',
          status: 'running',
          currentNodeId: 'finance',
          currentNodeName: '财务审核',
          createdAt: '2026-03-29 14:00:00',
          updatedAt: '2026-03-29 16:00:00',
        },
      ]);

      // 我发起的列表
      setInitiatedList([
        {
          id: 'wi-expense-001',
          definitionId: 'def-expense-001',
          definitionCode: 'expense_approval',
          businessType: 'expense',
          businessId: 'EXP-2026-001',
          title: '差旅报销申请 - 3200元',
          content: '出差北京客户拜访报销',
          initiatorId: 'current_user',
          initiatorName: '当前用户',
          status: 'running',
          currentNodeId: 'finance',
          currentNodeName: '财务审核',
          createdAt: '2026-03-28 10:00:00',
          updatedAt: '2026-03-29 12:00:00',
        },
      ]);

      // 已审批列表
      setApprovedList([
        {
          id: 'wi-overtime-001',
          definitionId: 'def-overtime-001',
          definitionCode: 'overtime_approval',
          businessType: 'overtime',
          businessId: 'OT-2026-001',
          title: '王五加班申请 - 4小时',
          initiatorId: 'user-003',
          initiatorName: '王五',
          status: 'approved',
          currentNodeId: 'end',
          currentNodeName: '流程结束',
          createdAt: '2026-03-27 18:00:00',
          updatedAt: '2026-03-27 19:00:00',
          finishedAt: '2026-03-27 19:00:00',
        },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  // 获取审批历史
  const fetchApprovalHistory = (instanceId: string) => {
    // Mock 数据
    const history: ApprovalRecord[] = [
      {
        id: 'ar-001',
        instanceId,
        nodeId: 'dept_head',
        nodeName: '部门主管审批',
        approverId: 'manager-001',
        approverName: '部门经理',
        action: 'approve',
        comment: '同意，情况属实',
        approvedAt: '2026-03-29 12:00:00',
        source: 'system',
      },
    ];
    setApprovalHistory(history);
  };

  // 表格列定义 - 待审批
  const pendingColumns: ColumnsType<WorkflowInstance> = [
    {
      title: '申请标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: WorkflowInstance) => (
        <Space>
          <FileTextOutlined style={{ color: '#6600ff' }} />
          <Typography.Text strong>{text}</Typography.Text>
          {record.dingtalkInstanceId && (
            <Tooltip title="来自钉钉">
              <Tag color="blue">钉钉</Tag>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      render: (type: string) => {
        const option = BUSINESS_TYPE_OPTIONS.find(o => o.value === type);
        return <Tag color="purple">{option?.label || type}</Tag>;
      },
    },
    {
      title: '发起人',
      dataIndex: 'initiatorName',
      key: 'initiatorName',
      render: (name: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Typography.Text>{name}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '当前节点',
      dataIndex: 'currentNodeName',
      key: 'currentNodeName',
      render: (name: string) => (
        <Tag color="orange">
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {name}
        </Tag>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => {
        const diff = Math.floor((Date.now() - new Date(time).getTime()) / (1000 * 60 * 60));
        return (
          <Typography.Text type={diff > 24 ? 'danger' : 'secondary'}>
            {diff > 24 ? `${Math.floor(diff / 24)}天前` : `${diff}小时前`}
          </Typography.Text>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_, record: WorkflowInstance) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setCurrentInstance(record);
                fetchApprovalHistory(record.id);
                setDetailDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              setCurrentInstance(record);
              setApproveModalVisible(true);
            }}
            style={{ background: '#6600ff' }}
          >
            同意
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => {
              setCurrentInstance(record);
              setRejectModalVisible(true);
            }}
          >
            拒绝
          </Button>
          <Tooltip title="转交">
            <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={() => {
                setCurrentInstance(record);
                setTransferModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 表格列定义 - 我发起的/已审批
  const historyColumns: ColumnsType<WorkflowInstance> = [
    {
      title: '申请标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#6600ff' }} />
          <Typography.Text strong>{text}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      render: (type: string) => {
        const option = BUSINESS_TYPE_OPTIONS.find(o => o.value === type);
        return <Tag color="purple">{option?.label || type}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
          running: { color: 'processing', text: '审批中' },
          approved: { color: 'success', text: '已通过' },
          rejected: { color: 'error', text: '已拒绝' },
          cancelled: { color: 'warning', text: '已撤销' },
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '当前节点',
      dataIndex: 'currentNodeName',
      key: 'currentNodeName',
    },
    {
      title: '发起时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: '完成时间',
      dataIndex: 'finishedAt',
      key: 'finishedAt',
      render: (time: string) => time ? new Date(time).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record: WorkflowInstance) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setCurrentInstance(record);
                fetchApprovalHistory(record.id);
                setDetailDrawerVisible(true);
              }}
            />
          </Tooltip>
          {record.status === 'running' && record.initiatorId === 'current_user' && (
            <Popconfirm title="确定撤销该申请？" onConfirm={() => handleCancel(record.id)}>
              <Button type="text" danger>撤销</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 审批同意
  const handleApprove = async () => {
    try {
      const values = await approveForm.validateFields();
      // TODO: 调用 API 审批同意
      setPendingList(pendingList.filter(p => p.id !== currentInstance?.id));
      setApproveModalVisible(false);
      approveForm.resetFields();
      message.success('审批已同意');
    } catch (error) {
      console.error('审批失败:', error);
    }
  };

  // 审批拒绝
  const handleReject = async () => {
    try {
      const values = await rejectForm.validateFields();
      // TODO: 调用 API 审批拒绝
      setPendingList(pendingList.filter(p => p.id !== currentInstance?.id));
      setRejectModalVisible(false);
      rejectForm.resetFields();
      message.success('审批已拒绝');
    } catch (error) {
      console.error('拒绝失败:', error);
    }
  };

  // 审批转交
  const handleTransfer = async () => {
    try {
      const values = await transferForm.validateFields();
      // TODO: 调用 API 审批转交
      setTransferModalVisible(false);
      transferForm.resetFields();
      message.success(`审批已转交给 ${values.transferToName}`);
    } catch (error) {
      console.error('转交失败:', error);
    }
  };

  // 撤销申请
  const handleCancel = (instanceId: string) => {
    // TODO: 调用 API 撤销申请
    setInitiatedList(initiatedList.map(i => 
      i.id === instanceId ? { ...i, status: 'cancelled' } : i
    ));
    message.success('申请已撤销');
  };

  return (
    <div className="pending-approval">
      {/* 页面头部 */}
      <Card className="glass-card" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              <ClockCircleOutlined style={{ marginRight: 8, color: '#6600ff' }} />
              审批中心
            </Typography.Title>
            <Typography.Text type="secondary">
              处理待审批事项，查看审批进度
            </Typography.Text>
          </Col>
          <Col>
            <Badge count={pendingList.length} style={{ backgroundColor: '#6600ff' }}>
              <Typography.Text strong>{pendingList.length} 项待处理</Typography.Text>
            </Badge>
          </Col>
        </Row>
      </Card>

      {/* Tab切换 */}
      <Card className="glass-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'pending',
              label: (
                <Space>
                  <Badge count={pendingList.length} size="small" style={{ backgroundColor: '#6600ff' }} />
                  待审批
                </Space>
              ),
              children: pendingList.length > 0 ? (
                <Table
                  columns={pendingColumns}
                  dataSource={pendingList}
                  rowKey="id"
                  loading={loading}
                  pagination={false}
                />
              ) : (
                <Empty description="暂无待审批事项" />
              ),
            },
            {
              key: 'initiated',
              label: (
                <Space>
                  <Badge count={initiatedList.length} size="small" />
                  我发起的
                </Space>
              ),
              children: (
                <Table
                  columns={historyColumns}
                  dataSource={initiatedList}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'approved',
              label: '已审批',
              children: (
                <Table
                  columns={historyColumns}
                  dataSource={approvedList}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* 审批同意弹窗 */}
      <Modal
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            审批同意
          </Space>
        }
        open={approveModalVisible}
        onOk={handleApprove}
        onCancel={() => {
          setApproveModalVisible(false);
          approveForm.resetFields();
        }}
        okText="同意"
        cancelText="取消"
        className="glass-modal"
      >
        <Form form={approveForm} layout="vertical">
          <Typography.Text type="secondary">
            正在审批: {currentInstance?.title}
          </Typography.Text>
          <Divider />
          <Form.Item name="comment" label="审批意见">
            <Input.TextArea 
              rows={3} 
              placeholder="请输入审批意见（可选）" 
            />
          </Form.Item>
          <Form.Item name="attachments" label="附件">
            <Upload>
              <Button icon={<UploadOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 审批拒绝弹窗 */}
      <Modal
        title={
          <Space>
            <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            审批拒绝
          </Space>
        }
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          rejectForm.resetFields();
        }}
        okText="拒绝"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        className="glass-modal"
      >
        <Form form={rejectForm} layout="vertical">
          <Typography.Text type="secondary">
            正在审批: {currentInstance?.title}
          </Typography.Text>
          <Divider />
          <Form.Item
            name="comment"
            label="拒绝原因"
            rules={[{ required: true, message: '请输入拒绝原因' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请输入拒绝原因" 
            />
          </Form.Item>
          <Form.Item name="attachments" label="附件">
            <Upload>
              <Button icon={<UploadOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 审批转交弹窗 */}
      <Modal
        title={
          <Space>
            <SwapOutlined style={{ color: '#6600ff' }} />
            审批转交
          </Space>
        }
        open={transferModalVisible}
        onOk={handleTransfer}
        onCancel={() => {
          setTransferModalVisible(false);
          transferForm.resetFields();
        }}
        okText="转交"
        cancelText="取消"
        className="glass-modal"
      >
        <Form form={transferForm} layout="vertical">
          <Typography.Text type="secondary">
            正在审批: {currentInstance?.title}
          </Typography.Text>
          <Divider />
          <Form.Item
            name="transferToId"
            label="转交给"
            rules={[{ required: true, message: '请选择转交对象' }]}
          >
            <Select
              showSearch
              placeholder="搜索用户"
              options={[
                { value: 'user-001', label: '张三' },
                { value: 'user-002', label: '李四' },
                { value: 'user-003', label: '王五' },
              ]}
            />
          </Form.Item>
          <Form.Item name="comment" label="转交说明">
            <Input.TextArea 
              rows={2} 
              placeholder="请输入转交说明（可选）" 
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 审批详情抽屉 */}
      <Drawer
        title={
          <Space>
            <FileTextOutlined style={{ color: '#6600ff' }} />
            审批详情
          </Space>
        }
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        className="glass-drawer"
      >
        {currentInstance && (
          <div>
            {/* 基本信息 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Typography.Text type="secondary">申请信息</Typography.Text>
              <Divider style={{ margin: '8px 0' }} />
              <Typography.Title level={5}>{currentInstance.title}</Typography.Title>
              <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Typography.Text strong>业务类型: </Typography.Text>
                  <Tag color="purple">
                    {BUSINESS_TYPE_OPTIONS.find(o => o.value === currentInstance.businessType)?.label}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>业务ID: </Typography.Text>
                  <Typography.Text>{currentInstance.businessId}</Typography.Text>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>发起人: </Typography.Text>
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <Typography.Text>{currentInstance.initiatorName}</Typography.Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>状态: </Typography.Text>
                  <Tag color="processing">审批中</Tag>
                </Col>
                <Col span={24}>
                  <Typography.Text strong>申请时间: </Typography.Text>
                  <Typography.Text>{new Date(currentInstance.createdAt).toLocaleString('zh-CN')}</Typography.Text>
                </Col>
              </Row>
              {currentInstance.content && (
                <div style={{ marginTop: 12 }}>
                  <Typography.Text type="secondary">申请内容:</Typography.Text>
                  <Typography.Text>{currentInstance.content}</Typography.Text>
                </div>
              )}
            </Card>

            {/* 表单数据 */}
            {currentInstance.formData && (
              <Card size="small" style={{ marginBottom: 16 }}>
                <Typography.Text type="secondary">表单详情</Typography.Text>
                <Divider style={{ margin: '8px 0' }} />
                <List
                  size="small"
                  dataSource={Object.entries(currentInstance.formData)}
                  renderItem={([key, value]) => (
                    <List.Item>
                      <Typography.Text strong>{key}: </Typography.Text>
                      <Typography.Text>{String(value)}</Typography.Text>
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {/* 审批进度 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Typography.Text type="secondary">审批进度</Typography.Text>
              <Divider style={{ margin: '8px 0' }} />
              <Steps
                direction="vertical"
                current={1}
                items={[
                  {
                    title: '提交申请',
                    description: `${currentInstance.initiatorName} 提交`,
                    status: 'finish',
                  },
                  {
                    title: currentInstance.currentNodeName || '审批中',
                    description: '等待审批',
                    status: 'process',
                  },
                  {
                    title: '审批完成',
                    status: 'wait',
                  },
                ]}
              />
            </Card>

            {/* 审批历史 */}
            {approvalHistory.length > 0 && (
              <Card size="small">
                <Typography.Text type="secondary">
                  <HistoryOutlined style={{ marginRight: 4 }} />
                  审批记录
                </Typography.Text>
                <Divider style={{ margin: '8px 0' }} />
                <List
                  size="small"
                  dataSource={approvalHistory}
                  renderItem={(record) => (
                    <List.Item>
                      <Row gutter={16} align="middle">
                        <Col>
                          <Avatar size="small" icon={<UserOutlined />} />
                        </Col>
                        <Col>
                          <Typography.Text strong>{record.approverName}</Typography.Text>
                        </Col>
                        <Col>
                          <Tag color={record.action === 'approve' ? 'success' : 'error'}>
                            {record.action === 'approve' ? '同意' : '拒绝'}
                          </Tag>
                        </Col>
                        <Col>
                          <Typography.Text type="secondary">
                            {new Date(record.approvedAt).toLocaleString('zh-CN')}
                          </Typography.Text>
                        </Col>
                      </Row>
                      {record.comment && (
                        <Typography.Text type="secondary" style={{ marginTop: 4, display: 'block' }}>
                          意见: {record.comment}
                        </Typography.Text>
                      )}
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {/* 操作按钮 */}
            {activeTab === 'pending' && (
              <Space style={{ marginTop: 16 }} wrap>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    setDetailDrawerVisible(false);
                    setApproveModalVisible(true);
                  }}
                  style={{ background: '#6600ff' }}
                >
                  同意
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    setDetailDrawerVisible(false);
                    setRejectModalVisible(true);
                  }}
                >
                  拒绝
                </Button>
                <Button
                  icon={<SwapOutlined />}
                  onClick={() => {
                    setDetailDrawerVisible(false);
                    setTransferModalVisible(true);
                  }}
                >
                  转交
                </Button>
              </Space>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default PendingApproval;