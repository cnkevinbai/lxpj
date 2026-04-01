/**
 * Workflow 前端页面 - 我发起的审批
 * 
 * 功能:
 * - 我发起的审批列表
 * - 审批进度追踪
 * - 撤销申请
 * 
 * @version 1.0.0
 * @since 2026-03-30
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  Badge,
  Drawer,
  Steps,
  Divider,
  Row,
  Col,
  Avatar,
  List,
  Empty,
  message,
  Progress,
} from 'antd';
import {
  FileTextOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  HistoryOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// ============================================
// 类型定义
// ============================================

interface WorkflowInstance {
  id: string;
  definitionId: string;
  definitionCode: string;
  definitionName: string;
  businessType: string;
  businessId: string;
  title: string;
  content?: string;
  formData?: Record<string, any>;
  initiatorId: string;
  initiatorName: string;
  status: 'running' | 'approved' | 'rejected' | 'cancelled' | 'timeout';
  currentNodeId: string;
  currentNodeName?: string;
  currentApproverIds?: string[];
  currentApproverNames?: string[];
  progress: number;
  dingtalkInstanceId?: string;
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
  approvedAt: string;
  source: 'system' | 'dingtalk';
}

// 业务类型配置
const BUSINESS_TYPE_CONFIG: Record<string, { color: string; label: string }> = {
  leave: { color: 'blue', label: '请假申请' },
  purchase: { color: 'orange', label: '采购申请' },
  expense: { color: 'green', label: '报销申请' },
  overtime: { color: 'purple', label: '加班申请' },
  travel: { color: 'cyan', label: '出差申请' },
};

// 状态配置
const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  running: { color: 'processing', label: '审批中', icon: <ClockCircleOutlined /> },
  approved: { color: 'success', label: '已通过', icon: <CheckCircleOutlined /> },
  rejected: { color: 'error', label: '已拒绝', icon: <CloseCircleOutlined /> },
  cancelled: { color: 'warning', label: '已撤销', icon: <CloseCircleOutlined /> },
  timeout: { color: 'default', label: '已超时', icon: <ClockCircleOutlined /> },
};

// ============================================
// 我发起的审批页面
// ============================================

const WorkflowInitiated: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [instances, setInstances] = useState<WorkflowInstance[]>([]);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentInstance, setCurrentInstance] = useState<WorkflowInstance | null>(null);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalRecord[]>([]);

  // Mock 数据
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setInstances([
        {
          id: 'wi-expense-001',
          definitionId: 'def-expense-001',
          definitionCode: 'expense_approval',
          definitionName: '报销审批流程',
          businessType: 'expense',
          businessId: 'EXP-2026-001',
          title: '差旅报销申请 - 北京客户拜访',
          content: '出差北京拜访客户，报销差旅费用3200元',
          formData: {
            expenseType: '差旅报销',
            amount: 3200,
            travelDates: '2026-03-25 - 2026-03-27',
            reason: '拜访北京客户',
          },
          initiatorId: 'current_user',
          initiatorName: '当前用户',
          status: 'running',
          currentNodeId: 'finance',
          currentNodeName: '财务审核',
          currentApproverNames: ['财务经理'],
          progress: 50,
          createdAt: '2026-03-28 10:00:00',
          updatedAt: '2026-03-29 16:00:00',
        },
        {
          id: 'wi-leave-002',
          definitionId: 'def-leave-002',
          definitionCode: 'leave_approval',
          definitionName: '请假审批流程',
          businessType: 'leave',
          businessId: 'LEAVE-2026-002',
          title: '病假申请 - 2天',
          content: '身体不适需要休息',
          formData: {
            leaveType: '病假',
            startDate: '2026-04-01',
            endDate: '2026-04-02',
            days: 2,
            reason: '身体不适',
          },
          initiatorId: 'current_user',
          initiatorName: '当前用户',
          status: 'approved',
          currentNodeId: 'end',
          currentNodeName: '流程结束',
          progress: 100,
          createdAt: '2026-03-20 09:00:00',
          updatedAt: '2026-03-20 15:00:00',
          finishedAt: '2026-03-20 15:00:00',
        },
        {
          id: 'wi-overtime-002',
          definitionId: 'def-overtime-002',
          definitionCode: 'overtime_approval',
          definitionName: '加班审批流程',
          businessType: 'overtime',
          businessId: 'OT-2026-002',
          title: '周末加班申请 - 8小时',
          content: '项目紧急需要加班赶工',
          formData: {
            overtimeDate: '2026-03-29',
            hours: 8,
            reason: '项目紧急赶工',
          },
          initiatorId: 'current_user',
          initiatorName: '当前用户',
          status: 'rejected',
          currentNodeId: 'manager',
          currentNodeName: '主管审批',
          progress: 33,
          createdAt: '2026-03-15 18:00:00',
          updatedAt: '2026-03-16 09:00:00',
          finishedAt: '2026-03-16 09:00:00',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // 获取审批历史
  const fetchApprovalHistory = (instanceId: string) => {
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

  // 表格列定义
  const columns: ColumnsType<WorkflowInstance> = [
    {
      title: '申请标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: WorkflowInstance) => (
        <Space>
          <FileTextOutlined style={{ color: '#6600ff' }} />
          <Typography.Text strong>{text}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '流程类型',
      dataIndex: 'definitionName',
      key: 'definitionName',
      render: (name: string, record: WorkflowInstance) => (
        <Space direction="vertical" size="small">
          <Typography.Text>{name}</Typography.Text>
          <Tag color={BUSINESS_TYPE_CONFIG[record.businessType]?.color || 'default'}>
            {BUSINESS_TYPE_CONFIG[record.businessType]?.label || record.businessType}
          </Tag>
        </Space>
      ),
    },
    {
      title: '审批进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number, record: WorkflowInstance) => (
        <Space direction="vertical" size="small" style={{ width: 120 }}>
          <Progress 
            percent={progress} 
            size="small" 
            status={record.status === 'approved' ? 'success' : record.status === 'rejected' ? 'exception' : 'active'}
            strokeColor={record.status === 'running' ? '#6600ff' : undefined}
          />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {record.currentNodeName}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = STATUS_CONFIG[status] || STATUS_CONFIG.running;
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: '当前审批人',
      dataIndex: 'currentApproverNames',
      key: 'currentApproverNames',
      render: (names: string[]) => (
        names ? (
          <Space>
            {names.map(name => (
              <Avatar size="small" key={name}>
                {name.charAt(0)}
              </Avatar>
            ))}
            <Typography.Text type="secondary">{names.join(', ')}</Typography.Text>
          </Space>
        ) : '-'
      ),
    },
    {
      title: '发起时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
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
          {record.status === 'running' && (
            <Popconfirm
              title="确定撤销该申请？"
              description="撤销后需要重新发起"
              onConfirm={() => handleCancel(record.id)}
            >
              <Button type="text" danger icon={<CloseCircleOutlined />}>
                撤销
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 撤销申请
  const handleCancel = (instanceId: string) => {
    setInstances(instances.map(i => 
      i.id === instanceId 
        ? { ...i, status: 'cancelled', updatedAt: new Date().toISOString() }
        : i
    ));
    message.success('申请已撤销');
  };

  return (
    <div className="workflow-initiated">
      {/* 页面头部 */}
      <Card className="glass-card" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              <BranchesOutlined style={{ marginRight: 8, color: '#6600ff' }} />
              我发起的审批
            </Typography.Title>
            <Typography.Text type="secondary">
              查看我发起的所有审批申请及其进度
            </Typography.Text>
          </Col>
          <Col>
            <Space>
              <Badge count={instances.filter(i => i.status === 'running').length} style={{ backgroundColor: '#6600ff' }}>
                <Typography.Text strong>进行中</Typography.Text>
              </Badge>
              <Badge count={instances.filter(i => i.status === 'approved').length} style={{ backgroundColor: '#52c41a' }}>
                <Typography.Text strong>已通过</Typography.Text>
              </Badge>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 审批列表 */}
      <Card className="glass-card">
        {instances.length > 0 ? (
          <Table
            columns={columns}
            dataSource={instances}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        ) : (
          <Empty description="暂无发起的审批" />
        )}
      </Card>

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
              <Row justify="space-between" align="middle">
                <Col>
                  <Typography.Title level={5}>{currentInstance.title}</Typography.Title>
                </Col>
                <Col>
                  <Tag color={STATUS_CONFIG[currentInstance.status].color}>
                    {STATUS_CONFIG[currentInstance.status].label}
                  </Tag>
                </Col>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Typography.Text strong>流程: </Typography.Text>
                  <Typography.Text>{currentInstance.definitionName}</Typography.Text>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>业务ID: </Typography.Text>
                  <Typography.Text>{currentInstance.businessId}</Typography.Text>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>发起时间: </Typography.Text>
                  <Typography.Text>
                    {new Date(currentInstance.createdAt).toLocaleString('zh-CN')}
                  </Typography.Text>
                </Col>
                {currentInstance.finishedAt && (
                  <Col span={12}>
                    <Typography.Text strong>完成时间: </Typography.Text>
                    <Typography.Text>
                      {new Date(currentInstance.finishedAt).toLocaleString('zh-CN')}
                    </Typography.Text>
                  </Col>
                )}
              </Row>
              {currentInstance.content && (
                <div style={{ marginTop: 12 }}>
                  <Typography.Text type="secondary">申请内容:</Typography.Text>
                  <Typography.Text>{currentInstance.content}</Typography.Text>
                </div>
              )}
            </Card>

            {/* 审批进度 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Typography.Text type="secondary">审批进度</Typography.Text>
              <Divider style={{ margin: '8px 0' }} />
              <Progress 
                percent={currentInstance.progress}
                status={currentInstance.status === 'approved' ? 'success' : currentInstance.status === 'rejected' ? 'exception' : 'active'}
                strokeColor="#6600ff"
              />
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
                          <Avatar size="small">{record.approverName.charAt(0)}</Avatar>
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

            {/* 撤销按钮 */}
            {currentInstance.status === 'running' && (
              <Button
                danger
                block
                style={{ marginTop: 16 }}
                onClick={() => {
                  handleCancel(currentInstance.id);
                  setDetailDrawerVisible(false);
                }}
              >
                撤销申请
              </Button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default WorkflowInitiated;