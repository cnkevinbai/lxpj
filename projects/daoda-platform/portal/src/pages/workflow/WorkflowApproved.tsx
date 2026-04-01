/**
 * Workflow 前端页面 - 已审批记录
 * 
 * 功能:
 * - 已审批记录列表
 * - 审批结果查看
 * - 审批历史追溯
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
  Badge,
  Drawer,
  Divider,
  Row,
  Col,
  Avatar,
  List,
  Empty,
  DatePicker,
  Select,
  Statistic,
  Progress,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  HistoryOutlined,
  BranchesOutlined,
  SwapOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;

// ============================================
// 类型定义
// ============================================

interface ApprovalRecord {
  id: string;
  instanceId: string;
  definitionCode: string;
  definitionName: string;
  businessType: string;
  businessId: string;
  title: string;
  initiatorName: string;
  action: 'approve' | 'reject' | 'transfer';
  comment?: string;
  approvedAt: string;
  source: 'system' | 'dingtalk';
  transferToName?: string;
}

// 状态配置
const ACTION_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  approve: { color: 'success', label: '同意', icon: <CheckCircleOutlined /> },
  reject: { color: 'error', label: '拒绝', icon: <CloseCircleOutlined /> },
  transfer: { color: 'purple', label: '转交', icon: <SwapOutlined /> },
};

// 业务类型配置
const BUSINESS_TYPE_CONFIG: Record<string, { color: string; label: string }> = {
  leave: { color: 'blue', label: '请假' },
  purchase: { color: 'orange', label: '采购' },
  expense: { color: 'green', label: '报销' },
  overtime: { color: 'purple', label: '加班' },
  travel: { color: 'cyan', label: '出差' },
};

// ============================================
// 已审批记录页面
// ============================================

const WorkflowApproved: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<ApprovalRecord[]>([]);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ApprovalRecord | null>(null);
  const [filters, setFilters] = useState<{
    dateRange: [string, string] | null;
    actionType: string | null;
    businessType: string | null;
  }>({
    dateRange: null,
    actionType: null,
    businessType: null,
  });

  // 统计数据
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    transferred: 0,
  });

  // Mock 数据
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockRecords: ApprovalRecord[] = [
        {
          id: 'ar-wf-001',
          instanceId: 'wi-leave-001',
          definitionCode: 'leave_approval',
          definitionName: '请假审批流程',
          businessType: 'leave',
          businessId: 'LEAVE-2026-003',
          title: '张三请假申请 - 3天',
          initiatorName: '张三',
          action: 'approve',
          comment: '同意，情况属实，批准请假',
          approvedAt: '2026-03-30 09:30:00',
          source: 'system',
        },
        {
          id: 'ar-wf-002',
          instanceId: 'wi-purchase-001',
          definitionCode: 'purchase_approval',
          definitionName: '采购审批流程',
          businessType: 'purchase',
          businessId: 'PUR-2026-001',
          title: '采购申请 - 办公设备',
          initiatorName: '李四',
          action: 'approve',
          comment: '预算合理，同意采购',
          approvedAt: '2026-03-29 16:00:00',
          source: 'dingtalk',
        },
        {
          id: 'ar-wf-003',
          instanceId: 'wi-overtime-001',
          definitionCode: 'overtime_approval',
          definitionName: '加班审批流程',
          businessType: 'overtime',
          businessId: 'OT-2026-001',
          title: '王五加班申请 - 4小时',
          initiatorName: '王五',
          action: 'approve',
          comment: '同意加班，注意休息',
          approvedAt: '2026-03-27 19:00:00',
          source: 'system',
        },
        {
          id: 'ar-wf-004',
          instanceId: 'wi-expense-002',
          definitionCode: 'expense_approval',
          definitionName: '报销审批流程',
          businessType: 'expense',
          businessId: 'EXP-2026-002',
          title: '赵六报销申请 - 1500元',
          initiatorName: '赵六',
          action: 'reject',
          comment: '发票不完整，请补充材料',
          approvedAt: '2026-03-26 14:00:00',
          source: 'system',
        },
        {
          id: 'ar-wf-005',
          instanceId: 'wi-travel-001',
          definitionCode: 'travel_approval',
          definitionName: '出差审批流程',
          businessType: 'travel',
          businessId: 'TRV-2026-001',
          title: '孙七出差申请 - 上海',
          initiatorName: '孙七',
          action: 'transfer',
          comment: '转交给部门经理审批',
          approvedAt: '2026-03-25 10:00:00',
          source: 'system',
          transferToName: '部门经理',
        },
      ];

      setRecords(mockRecords);
      setStats({
        total: mockRecords.length,
        approved: mockRecords.filter(r => r.action === 'approve').length,
        rejected: mockRecords.filter(r => r.action === 'reject').length,
        transferred: mockRecords.filter(r => r.action === 'transfer').length,
      });
      setLoading(false);
    }, 500);
  }, []);

  // 筛选数据
  const filteredRecords = records.filter(r => {
    if (filters.actionType && r.action !== filters.actionType) return false;
    if (filters.businessType && r.businessType !== filters.businessType) return false;
    // TODO: 日期筛选
    return true;
  });

  // 表格列定义
  const columns: ColumnsType<ApprovalRecord> = [
    {
      title: '审批标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: ApprovalRecord) => (
        <Space>
          <BranchesOutlined style={{ color: '#6600ff' }} />
          <Typography.Text strong>{text}</Typography.Text>
          {record.source === 'dingtalk' && (
            <Tag color="blue">钉钉</Tag>
          )}
        </Space>
      ),
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
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      render: (type: string) => (
        <Tag color={BUSINESS_TYPE_CONFIG[type]?.color || 'default'}>
          {BUSINESS_TYPE_CONFIG[type]?.label || type}
        </Tag>
      ),
    },
    {
      title: '审批结果',
      dataIndex: 'action',
      key: 'action',
      render: (action: string, record: ApprovalRecord) => {
        const config = ACTION_CONFIG[action];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
            {record.transferToName && ` → ${record.transferToName}`}
          </Tag>
        );
      },
    },
    {
      title: '审批意见',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment: string) => (
        <Typography.Text 
          type="secondary"
          style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {comment || '-'}
        </Typography.Text>
      ),
    },
    {
      title: '审批时间',
      dataIndex: 'approvedAt',
      key: 'approvedAt',
      render: (time: string) => (
        <Space>
          <ClockCircleOutlined />
          {new Date(time).toLocaleString('zh-CN')}
        </Space>
      ),
      sorter: (a, b) => new Date(a.approvedAt).getTime() - new Date(b.approvedAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record: ApprovalRecord) => (
        <Tooltip title="查看详情">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setCurrentRecord(record);
              setDetailDrawerVisible(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="workflow-approved">
      {/* 页面头部 */}
      <Card className="glass-card" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              <CheckCircleOutlined style={{ marginRight: 8, color: '#6600ff' }} />
              已审批记录
            </Typography.Title>
            <Typography.Text type="secondary">
              查看我的审批历史记录
            </Typography.Text>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className="glass-card">
            <Statistic
              title="审批总数"
              value={stats.total}
              prefix={<BranchesOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="glass-card">
            <Statistic
              title="同意"
              value={stats.approved}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="glass-card">
            <Statistic
              title="拒绝"
              value={stats.rejected}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="glass-card">
            <Statistic
              title="转交"
              value={stats.transferred}
              prefix={<SwapOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选区域 */}
      <Card className="glass-card" style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <FilterOutlined style={{ color: '#6600ff' }} />
            <Typography.Text strong style={{ marginLeft: 8 }}>筛选</Typography.Text>
          </Col>
          <Col>
            <RangePicker 
              placeholder={['开始日期', '结束日期']}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates as [string, string] | null })}
            />
          </Col>
          <Col>
            <Select
              placeholder="审批结果"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => setFilters({ ...filters, actionType: value })}
              options={[
                { value: 'approve', label: '同意' },
                { value: 'reject', label: '拒绝' },
                { value: 'transfer', label: '转交' },
              ]}
            />
          </Col>
          <Col>
            <Select
              placeholder="业务类型"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => setFilters({ ...filters, businessType: value })}
              options={[
                { value: 'leave', label: '请假' },
                { value: 'purchase', label: '采购' },
                { value: 'expense', label: '报销' },
                { value: 'overtime', label: '加班' },
                { value: 'travel', label: '出差' },
              ]}
            />
          </Col>
          <Col>
            <Button onClick={() => setFilters({ dateRange: null, actionType: null, businessType: null })}>
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 审批记录列表 */}
      <Card className="glass-card">
        {filteredRecords.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredRecords}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        ) : (
          <Empty description="暂无审批记录" />
        )}
      </Card>

      {/* 审批详情抽屉 */}
      <Drawer
        title={
          <Space>
            <HistoryOutlined style={{ color: '#6600ff' }} />
            审批详情
          </Space>
        }
        placement="right"
        width={400}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        className="glass-drawer"
      >
        {currentRecord && (
          <div>
            {/* 审批结果 */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={64}
                icon={ACTION_CONFIG[currentRecord.action].icon}
                style={{ 
                  background: ACTION_CONFIG[currentRecord.action].color === 'success' ? '#52c41a' 
                    : ACTION_CONFIG[currentRecord.action].color === 'error' ? '#ff4d4f' : '#6600ff'
                }}
              />
              <Typography.Title level={5} style={{ marginTop: 12 }}>
                {ACTION_CONFIG[currentRecord.action].label}
                {currentRecord.transferToName && ` → ${currentRecord.transferToName}`}
              </Typography.Title>
            </div>

            {/* 基本信息 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Typography.Text type="secondary">申请信息</Typography.Text>
              <Divider style={{ margin: '8px 0' }} />
              <Typography.Title level={5}>{currentRecord.title}</Typography.Title>
              <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Typography.Text strong>流程: </Typography.Text>
                  <Typography.Text>{currentRecord.definitionName}</Typography.Text>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>发起人: </Typography.Text>
                  <Space>
                    <Avatar size="small">{currentRecord.initiatorName.charAt(0)}</Avatar>
                    <Typography.Text>{currentRecord.initiatorName}</Typography.Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>业务ID: </Typography.Text>
                  <Typography.Text>{currentRecord.businessId}</Typography.Text>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>来源: </Typography.Text>
                  <Tag color={currentRecord.source === 'dingtalk' ? 'blue' : 'purple'}>
                    {currentRecord.source === 'dingtalk' ? '钉钉' : '系统'}
                  </Tag>
                </Col>
              </Row>
            </Card>

            {/* 审批意见 */}
            <Card size="small">
              <Typography.Text type="secondary">审批意见</Typography.Text>
              <Divider style={{ margin: '8px 0' }} />
              <Typography.Text>{currentRecord.comment || '无'}</Typography.Text>
              <div style={{ marginTop: 12 }}>
                <Typography.Text type="secondary">
                  审批时间: {new Date(currentRecord.approvedAt).toLocaleString('zh-CN')}
                </Typography.Text>
              </div>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default WorkflowApproved;