/**
 * Notification 前端页面 - 消息模板管理
 * 
 * 功能:
 * - 消息模板列表
 * - 创建/编辑模板
 * - 模板变量配置
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
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Divider,
  Row,
  Col,
  message,
  Popconfirm,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  CodeOutlined,
  FileTextOutlined,
  BellOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;

// ============================================
// 类型定义
// ============================================

interface NotificationTemplate {
  id: string;
  code: string;
  name: string;
  type: 'system' | 'approval' | 'reminder' | 'notice' | 'task';
  category: string;
  title: string;
  content: string;
  variables?: string[];
  channels: ('in_app' | 'email' | 'dingtalk' | 'browser')[];
  isActive: boolean;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

// 消息类型配置
const TYPE_CONFIG: Record<string, { color: string; label: string }> = {
  system: { color: 'default', label: '系统通知' },
  approval: { color: 'purple', label: '审批通知' },
  reminder: { color: 'orange', label: '提醒通知' },
  notice: { color: 'blue', label: '公告通知' },
  task: { color: 'green', label: '任务通知' },
};

// 通知渠道配置
const CHANNEL_CONFIG: Record<string, { color: string; label: string }> = {
  in_app: { color: 'purple', label: '站内' },
  email: { color: 'blue', label: '邮件' },
  dingtalk: { color: 'cyan', label: '钉钉' },
  browser: { color: 'green', label: '浏览器' },
};

// ============================================
// 消息模板管理页面
// ============================================

const NotificationTemplates: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<NotificationTemplate | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Mock 数据
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTemplates([
        {
          id: 'tpl-approval-new',
          code: 'approval_new',
          name: '新审批待处理',
          type: 'approval',
          category: 'workflow',
          title: '待审批: {{title}}',
          content: '您有一条待审批事项: {{title}}。{{content}}。请及时处理。',
          variables: ['title', 'content', 'initiatorName', 'businessId'],
          channels: ['in_app', 'dingtalk', 'browser'],
          isActive: true,
          description: '审批流程启动时通知审批人',
          createdBy: 'admin',
          createdAt: '2026-03-28 10:00:00',
        },
        {
          id: 'tpl-approval-approved',
          code: 'approval_approved',
          name: '审批已通过',
          type: 'approval',
          category: 'workflow',
          title: '审批结果: {{title}}已通过',
          content: '您的审批申请 "{{title}}" 已审批通过。',
          variables: ['title', 'approverName', 'approvedAt'],
          channels: ['in_app', 'dingtalk'],
          isActive: true,
          description: '审批通过后通知申请人',
          createdBy: 'admin',
          createdAt: '2026-03-28 10:00:00',
        },
        {
          id: 'tpl-approval-rejected',
          code: 'approval_rejected',
          name: '审批已拒绝',
          type: 'approval',
          category: 'workflow',
          title: '审批结果: {{title}}已拒绝',
          content: '您的审批申请 "{{title}}" 已被拒绝。原因: {{comment}}',
          variables: ['title', 'approverName', 'comment', 'rejectedAt'],
          channels: ['in_app', 'dingtalk'],
          isActive: true,
          description: '审批拒绝后通知申请人',
          createdBy: 'admin',
          createdAt: '2026-03-28 10:00:00',
        },
        {
          id: 'tpl-task-reminder',
          code: 'task_reminder',
          name: '任务提醒',
          type: 'reminder',
          category: 'task',
          title: '任务提醒: {{taskName}}',
          content: '任务 "{{taskName}}" 将在 {{dueTime}} 到期，请及时处理。',
          variables: ['taskName', 'dueTime', 'priority'],
          channels: ['in_app', 'browser'],
          isActive: true,
          description: '任务即将到期提醒',
          createdBy: 'admin',
          createdAt: '2026-03-28 10:00:00',
        },
        {
          id: 'tpl-system-notice',
          code: 'system_notice',
          name: '系统公告',
          type: 'notice',
          category: 'system',
          title: '{{title}}',
          content: '{{content}}',
          variables: ['title', 'content', 'publisher'],
          channels: ['in_app', 'dingtalk', 'email'],
          isActive: true,
          description: '系统公告通知模板',
          createdBy: 'admin',
          createdAt: '2026-03-28 10:00:00',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // 表格列定义
  const columns: ColumnsType<NotificationTemplate> = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: NotificationTemplate) => (
        <Space>
          <FileTextOutlined style={{ color: '#6600ff' }} />
          <Typography.Text strong>{text}</Typography.Text>
          <Tag color="purple">{record.code}</Tag>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={TYPE_CONFIG[type]?.color || 'default'}>
          {TYPE_CONFIG[type]?.label || type}
        </Tag>
      ),
    },
    {
      title: '标题模板',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Typography.Text 
          code
          style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      title: '通知渠道',
      dataIndex: 'channels',
      key: 'channels',
      render: (channels: string[]) => (
        <Space size="small">
          {channels.map(c => (
            <Tag key={c} color={CHANNEL_CONFIG[c]?.color}>
              {CHANNEL_CONFIG[c]?.label}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '变量数',
      dataIndex: 'variables',
      key: 'variables',
      render: (vars: string[]) => (
        <Tooltip title={vars?.join(', ')}>
          <Typography.Text>
            <CodeOutlined style={{ marginRight: 4 }} />
            {vars?.length || 0} 个
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'warning'}>
          {isActive ? '已启用' : '未启用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record: NotificationTemplate) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentTemplate(record);
                editForm.setFieldsValue(record);
                setEditModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="复制">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定删除该模板？"
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

  // 创建模板
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      const newTemplate: NotificationTemplate = {
        id: `tpl-${values.code}-${Date.now()}`,
        code: values.code,
        name: values.name,
        type: values.type,
        category: values.category,
        title: values.title,
        content: values.content,
        variables: values.variables?.split(',').map((v: string) => v.trim()) || [],
        channels: values.channels || [],
        isActive: values.isActive || false,
        description: values.description,
        createdBy: 'current_user',
        createdAt: new Date().toISOString(),
      };
      setTemplates([...templates, newTemplate]);
      setCreateModalVisible(false);
      createForm.resetFields();
      message.success('模板创建成功');
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  // 编辑模板
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();
      setTemplates(templates.map(t => 
        t.id === currentTemplate?.id 
          ? { ...t, ...values, updatedAt: new Date().toISOString() }
          : t
      ));
      setEditModalVisible(false);
      message.success('模板更新成功');
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  // 复制模板
  const handleCopy = (template: NotificationTemplate) => {
    const newTemplate: NotificationTemplate = {
      ...template,
      id: `tpl-${template.code}-copy-${Date.now()}`,
      code: `${template.code}_copy`,
      name: `${template.name} (复制)`,
      isActive: false,
      createdAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
    message.success('模板已复制');
  };

  // 删除模板
  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    message.success('模板已删除');
  };

  return (
    <div className="notification-templates">
      {/* 页面头部 */}
      <Card className="glass-card" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              <BellOutlined style={{ marginRight: 8, color: '#6600ff' }} />
              消息模板管理
            </Typography.Title>
            <Typography.Text type="secondary">
              配置消息模板，支持变量替换和多渠道发送
            </Typography.Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
              style={{ background: '#6600ff' }}
            >
              创建模板
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 模板列表 */}
      <Card className="glass-card">
        {templates.length > 0 ? (
          <Table
            columns={columns}
            dataSource={templates}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
          />
        ) : (
          <Empty description="暂无消息模板" />
        )}
      </Card>

      {/* 创建模板弹窗 */}
      <Modal
        title="创建消息模板"
        open={createModalVisible}
        onOk={handleCreate}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        width={700}
        className="glass-modal"
      >
        <Form form={createForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="模板名称"
                rules={[{ required: true, message: '请输入模板名称' }]}
              >
                <Input placeholder="如：新审批待处理" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="模板编码"
                rules={[
                  { required: true, message: '请输入模板编码' },
                  { pattern: /^[a-z_]+$/, message: '只能使用小写字母和下划线' },
                ]}
              >
                <Input placeholder="如：approval_new" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="消息类型"
                rules={[{ required: true, message: '请选择消息类型' }]}
              >
                <Select
                  options={Object.entries(TYPE_CONFIG).map(([value, { label }]) => ({
                    value,
                    label,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="分类">
                <Input placeholder="如：workflow, task, system" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="描述">
            <Input placeholder="模板用途说明" />
          </Form.Item>

          <Divider>模板内容</Divider>

          <Form.Item
            name="title"
            label="标题模板"
            rules={[{ required: true, message: '请输入标题模板' }]}
            extra="支持变量: {{variableName}}"
          >
            <Input placeholder="如：待审批: {{title}}" />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容模板"
            rules={[{ required: true, message: '请输入内容模板' }]}
            extra="支持变量: {{variableName}}"
          >
            <TextArea rows={4} placeholder="如：您有一条待审批事项: {{title}}。{{content}}" />
          </Form.Item>

          <Form.Item 
            name="variables" 
            label="模板变量"
            extra="逗号分隔，如：title, content, initiatorName"
          >
            <Input placeholder="title, content, initiatorName" />
          </Form.Item>

          <Divider>通知渠道</Divider>

          <Form.Item name="channels" label="启用渠道">
            <Select
              mode="multiple"
              options={Object.entries(CHANNEL_CONFIG).map(([value, { label }]) => ({
                value,
                label,
              }))}
            />
          </Form.Item>

          <Form.Item name="isActive" label="启用状态" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑模板弹窗 */}
      <Modal
        title="编辑消息模板"
        open={editModalVisible}
        onOk={handleEdit}
        onCancel={() => setEditModalVisible(false)}
        width={700}
        className="glass-modal"
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="模板名称"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="description" label="描述">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider>模板内容</Divider>

          <Form.Item name="title" label="标题模板">
            <Input />
          </Form.Item>

          <Form.Item name="content" label="内容模板">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="variables" label="模板变量">
            <Input />
          </Form.Item>

          <Divider>通知渠道</Divider>

          <Form.Item name="channels" label="启用渠道">
            <Select
              mode="multiple"
              options={Object.entries(CHANNEL_CONFIG).map(([value, { label }]) => ({
                value,
                label,
              }))}
            />
          </Form.Item>

          <Form.Item name="isActive" label="启用状态" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationTemplates;