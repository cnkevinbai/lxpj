import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, Space, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
// DragDropContext, Droppable, Draggable 需要从 react-beautiful-dnd 导入
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { TextArea } = Input;
const { Option } = Select;

interface SolutionItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
  applicable: string;
  vehicles: string;
  orderIndex: number;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

const SolutionsManager: React.FC = () => {
  const [solutions, setSolutions] = useState<SolutionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSolution, setEditingSolution] = useState<SolutionItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadSolutions();
  }, []);

  const loadSolutions = async () => {
    setLoading(true);
    try {
      // TODO: 调用 API
      const mockData: SolutionItem[] = [
        {
          id: '1',
          title: '景区接驳解决方案',
          icon: '🏞️',
          color: 'from-green-500 to-green-700',
          description: '为 A 级景区提供完整的电动观光车接驳方案',
          features: ['多站点智能调度系统', '高峰时段运力优化', '无障碍车辆配置'],
          applicable: '国家森林公园、5A 级景区、主题公园',
          vehicles: '8-23 座观光车、无障碍车、VIP 豪车',
          orderIndex: 1,
          status: 'published',
          createdAt: '2026-01-01T10:00:00Z',
          updatedAt: '2026-01-01T10:00:00Z',
        },
      ];
      setSolutions(mockData);
    } catch (error) {
      message.error('加载解决方案列表失败');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (record?: SolutionItem) => {
    if (record) {
      setEditingSolution(record);
      form.setFieldsValue(record);
    } else {
      setEditingSolution(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 将 features 从字符串转换为数组
      if (values.features && typeof values.features === 'string') {
        values.features = values.features.split('\n').filter((f: string) => f.trim());
      }
      message.success(editingSolution ? '更新成功' : '创建成功');
      setModalVisible(false);
      loadSolutions();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      message.success('删除成功');
      loadSolutions();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const statusMap: Record<string, { text: string; color: string }> = {
    published: { text: '已发布', color: 'green' },
    draft: { text: '草稿', color: 'orange' },
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: 60,
      render: (index: number) => <DragOutlined className="text-gray-400" />,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '解决方案',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text: string, record: SolutionItem) => (
        <Space>
          <span className="text-2xl">{record.icon}</span>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.description.substring(0, 50)}...</div>
          </div>
        </Space>
      ),
    },
    {
      title: '适用场景',
      dataIndex: 'applicable',
      key: 'applicable',
      width: 200,
      ellipsis: true,
    },
    {
      title: '推荐车型',
      dataIndex: 'vehicles',
      key: 'vehicles',
      width: 150,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: SolutionItem) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个解决方案吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">解决方案管理</h1>
          <p className="text-gray-500">管理官网解决方案内容</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          size="large"
        >
          新建解决方案
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-blue-600">{solutions.length}</div>
          <div className="text-gray-500">总方案数</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-green-600">
            {solutions.filter(s => s.status === 'published').length}
          </div>
          <div className="text-gray-500">已发布</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-orange-600">
            {solutions.filter(s => s.status === 'draft').length}
          </div>
          <div className="text-gray-500">草稿</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={solutions}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      <Modal
        title={editingSolution ? '编辑解决方案' : '新建解决方案'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={900}
      >
        <Form form={form} layout="vertical" className="max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="title" label="方案标题" rules={[{ required: true }]}>
              <Input placeholder="例如：景区接驳解决方案" />
            </Form.Item>
            <Form.Item name="icon" label="图标 Emoji" rules={[{ required: true }]}>
              <Input placeholder="🏞️" maxLength={2} />
            </Form.Item>
          </div>

          <Form.Item name="color" label="渐变颜色" rules={[{ required: true }]}>
            <Select>
              <Option value="from-green-500 to-green-700">绿色渐变</Option>
              <Option value="from-blue-500 to-blue-700">蓝色渐变</Option>
              <Option value="from-purple-500 to-purple-700">紫色渐变</Option>
              <Option value="from-orange-500 to-orange-700">橙色渐变</Option>
              <Option value="from-cyan-500 to-cyan-700">青色渐变</Option>
              <Option value="from-red-500 to-red-700">红色渐变</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="方案描述" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="简要描述解决方案" />
          </Form.Item>

          <Form.Item 
            name="features" 
            label="核心功能（每行一个）" 
            rules={[{ required: true }]}
            extra="按回车换行添加多个功能"
          >
            <TextArea 
              rows={5} 
              placeholder="多站点智能调度系统&#13;&#10;高峰时段运力优化&#13;&#10;无障碍车辆配置" 
            />
          </Form.Item>

          <Form.Item name="applicable" label="适用场景" rules={[{ required: true }]}>
            <TextArea rows={2} placeholder="国家森林公园、5A 级景区、主题公园" />
          </Form.Item>

          <Form.Item name="vehicles" label="推荐车型" rules={[{ required: true }]}>
            <Input placeholder="8-23 座观光车、无障碍车、VIP 豪车" />
          </Form.Item>

          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="published">已发布</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SolutionsManager;
