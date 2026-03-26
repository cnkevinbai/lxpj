/**
 * 电子围栏页面
 * 
 * @author daod-team
 */

import React, { useState } from 'react';
import { 
  Card, Table, Button, Space, Modal, Form, Input, Select, 
  InputNumber, Switch, Tag, Popconfirm, message 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AimOutlined } from '@ant-design/icons';
import { PageHeader, SearchBar } from '@/components/common';
import type { Geofence } from '@/types';

const GeofencePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fences, setFences] = useState<Geofence[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFence, setCurrentFence] = useState<Geofence | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setCurrentFence(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Geofence) => {
    setCurrentFence(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setFences(fences.filter(f => f.id !== id));
    message.success('删除成功');
  };

  const handleSubmit = async (values: any) => {
    if (currentFence) {
      // 编辑
      setFences(fences.map(f => 
        f.id === currentFence.id ? { ...f, ...values } : f
      ));
      message.success('更新成功');
    } else {
      // 新增
      const newFence: Geofence = {
        id: Date.now().toString(),
        ...values,
        deviceCount: 0,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      };
      setFences([...fences, newFence]);
      message.success('创建成功');
    }
    setModalVisible(false);
  };

  const columns = [
    { title: '围栏名称', dataIndex: 'name', key: 'name' },
    { title: '围栏类型', dataIndex: 'type', key: 'type', 
      render: (type: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          circle: { color: 'blue', text: '圆形' },
          polygon: { color: 'green', text: '多边形' },
          rectangle: { color: 'orange', text: '矩形' },
        };
        const config = typeMap[type] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    { title: '报警类型', dataIndex: 'alarmType', key: 'alarmType',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          enter: '进入报警',
          exit: '离开报警',
          both: '进出报警',
        };
        return typeMap[type] || type;
      }
    },
    { title: '绑定设备', dataIndex: 'deviceCount', key: 'deviceCount' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Geofence) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            icon={<AimOutlined />}
          >
            定位
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此围栏吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button 
              type="link" 
              size="small" 
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="geofence-page">
      <PageHeader 
        title="电子围栏" 
        subtitle="管理车辆电子围栏"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建围栏
          </Button>
        }
      />

      <Card>
        <Table 
          columns={columns}
          dataSource={fences}
          rowKey="id"
          loading={loading}
          pagination={{
            total: fences.length,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={currentFence ? '编辑围栏' : '新建围栏'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item 
            name="name" 
            label="围栏名称" 
            rules={[{ required: true, message: '请输入围栏名称' }]}
          >
            <Input placeholder="请输入围栏名称" />
          </Form.Item>
          
          <Form.Item 
            name="type" 
            label="围栏类型" 
            rules={[{ required: true, message: '请选择围栏类型' }]}
          >
            <Select placeholder="请选择围栏类型">
              <Select.Option value="circle">圆形</Select.Option>
              <Select.Option value="polygon">多边形</Select.Option>
              <Select.Option value="rectangle">矩形</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="alarmType" 
            label="报警类型" 
            rules={[{ required: true, message: '请选择报警类型' }]}
          >
            <Select placeholder="请选择报警类型">
              <Select.Option value="enter">进入报警</Select.Option>
              <Select.Option value="exit">离开报警</Select.Option>
              <Select.Option value="both">进出报警</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="radius" label="半径(米)">
            <InputNumber min={10} max={10000} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="status" label="状态" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GeofencePage;