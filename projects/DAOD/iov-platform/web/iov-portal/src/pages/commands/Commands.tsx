/**
 * 指令管理页面
 * 
 * @author daod-team
 */

import React, { useState } from 'react';
import { 
  Card, Table, Button, Space, Modal, Form, Input, Select, 
  Tag, Popconfirm, message, Tabs 
} from 'antd';
import { PlusOutlined, SendOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/common';
import type { CommandTemplate, CommandRecord } from '@/types';

const CommandPage: React.FC = () => {
  const [templates, setTemplates] = useState<CommandTemplate[]>([]);
  const [records, setRecords] = useState<CommandRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [sendForm] = Form.useForm();

  const handleAddTemplate = (values: any) => {
    const newTemplate: CommandTemplate = {
      id: Date.now().toString(),
      name: values.name,
      command: values.command,
      params: values.params ? JSON.parse(values.params) : undefined,
      description: values.description,
      createTime: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
    message.success('模板创建成功');
    setModalVisible(false);
    form.resetFields();
  };

  const handleSendCommand = (values: any) => {
    message.success(`指令已发送到 ${values.terminalIds?.length || 0} 个终端`);
    setSendModalVisible(false);
    sendForm.resetFields();
  };

  const templateColumns = [
    { title: '模板名称', dataIndex: 'name', key: 'name' },
    { title: '指令', dataIndex: 'command', key: 'command' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CommandTemplate) => (
        <Space>
          <Button type="link" size="small" icon={<SendOutlined />}>
            发送
          </Button>
          <Popconfirm
            title="确定要删除此模板吗？"
            onConfirm={() => {
              setTemplates(templates.filter(t => t.id !== record.id));
              message.success('删除成功');
            }}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const recordColumns = [
    { title: '指令名称', dataIndex: 'commandName', key: 'commandName' },
    { title: '终端ID', dataIndex: 'terminalId', key: 'terminalId' },
    { title: '状态', dataIndex: 'status', key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          sent: 'processing',
          success: 'success',
          failed: 'error',
          timeout: 'warning',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      }
    },
    { title: '发送时间', dataIndex: 'sendTime', key: 'sendTime' },
    { title: '响应时间', dataIndex: 'responseTime', key: 'responseTime' },
    { title: '响应内容', dataIndex: 'response', key: 'response', ellipsis: true },
  ];

  const items = [
    {
      key: 'templates',
      label: '指令模板',
      children: (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
              新建模板
            </Button>
          </div>
          <Table 
            columns={templateColumns}
            dataSource={templates}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </>
      ),
    },
    {
      key: 'records',
      label: '发送记录',
      children: (
        <Table 
          columns={recordColumns}
          dataSource={records}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <div className="command-page">
      <PageHeader 
        title="指令管理" 
        subtitle="管理指令模板和发送记录"
        extra={
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={() => setSendModalVisible(true)}
          >
            批量发送
          </Button>
        }
      />

      <Card>
        <Tabs items={items} />
      </Card>

      <Modal
        title="新建指令模板"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddTemplate}>
          <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item name="command" label="指令" rules={[{ required: true }]}>
            <Input placeholder="请输入指令" />
          </Form.Item>
          <Form.Item name="params" label="参数 (JSON)">
            <Input.TextArea rows={4} placeholder='{"key": "value"}' />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="批量发送指令"
        open={sendModalVisible}
        onCancel={() => setSendModalVisible(false)}
        onOk={() => sendForm.submit()}
      >
        <Form form={sendForm} layout="vertical" onFinish={handleSendCommand}>
          <Form.Item name="terminalIds" label="终端" rules={[{ required: true }]}>
            <Select 
              mode="multiple"
              placeholder="请选择终端"
              options={[]}
            />
          </Form.Item>
          <Form.Item name="commandId" label="指令模板" rules={[{ required: true }]}>
            <Select placeholder="请选择指令模板">
              {templates.map(t => (
                <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CommandPage;