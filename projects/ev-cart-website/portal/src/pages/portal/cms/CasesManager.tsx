import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, Space, Tag, Popconfirm, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

interface CaseItem {
  id: string;
  title: string;
  category: string;
  location: string;
  year: number;
  vehicles: number;
  dailyPassengers?: number;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
  testimonialPosition?: string;
  images: string[];
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const CasesManager: React.FC = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCase, setEditingCase] = useState<CaseItem | null>(null);
  const [form] = Form.useForm();

  // 加载案例列表
  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      // TODO: 替换为实际 API 调用
      // const response = await fetch('/api/v1/cms/cases');
      // const data = await response.json();
      
      // 模拟数据
      const mockData: CaseItem[] = [
        {
          id: '1',
          title: '张家界国家森林公园观光车项目',
          category: '景区',
          location: '湖南 · 张家界',
          year: 2025,
          vehicles: 50,
          dailyPassengers: 10000,
          description: '部署 50 辆电动观光车，覆盖主要景点接驳路线',
          challenge: '面积大、景点分散、坡度多',
          solution: '提供 50 辆 23 座电动观光车，搭载大容量锂电池',
          results: ['日均服务游客 10000+ 人次', '年运营里程超过 50 万公里'],
          testimonialQuote: '道达智能的观光车性能稳定，续航给力',
          testimonialAuthor: '张主任',
          testimonialPosition: '张家界国家森林公园管理处',
          images: ['/images/cases/zhangjiajie.jpg'],
          status: 'published',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z',
        },
      ];
      
      setCases(mockData);
    } catch (error) {
      message.error('加载案例列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 打开新建/编辑弹窗
  const openModal = (record?: CaseItem) => {
    if (record) {
      setEditingCase(record);
      form.setFieldsValue(record);
    } else {
      setEditingCase(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // TODO: 调用 API 保存
      // await fetch('/api/v1/cms/cases', {
      //   method: editingCase ? 'PUT' : 'POST',
      //   body: JSON.stringify(values),
      // });

      message.success(editingCase ? '更新成功' : '创建成功');
      setModalVisible(false);
      loadCases();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 删除案例
  const handleDelete = async (id: string) => {
    try {
      // TODO: 调用 API 删除
      // await fetch(`/api/v1/cms/cases/${id}`, { method: 'DELETE' });
      
      message.success('删除成功');
      loadCases();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 状态标签
  const statusMap: Record<string, { text: string; color: string }> = {
    published: { text: '已发布', color: 'green' },
    draft: { text: '草稿', color: 'orange' },
    archived: { text: '已归档', color: 'gray' },
  };

  // 上传组件
  const uploadProps: UploadProps = {
    action: '/api/v1/upload',
    listType: 'picture-card',
    multiple: true,
    maxCount: 10,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('图片大小不能超过 10MB！');
      }
      return isImage && isLt10M;
    },
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '案例标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text: string, record: CaseItem) => (
        <Space>
          {record.images[0] && (
            <Image width={60} height={40} src={record.images[0]} style={{ objectFit: 'cover' }} />
          )}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '车辆数',
      dataIndex: 'vehicles',
      key: 'vehicles',
      width: 80,
      render: (num: number) => `${num}辆`,
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
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: CaseItem) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/cases/${record.id}`, '_blank')}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个案例吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
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
      {/* 头部 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">案例管理</h1>
          <p className="text-gray-500">管理官网客户案例内容</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          size="large"
        >
          新建案例
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-blue-600">{cases.length}</div>
          <div className="text-gray-500">总案例数</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-green-600">
            {cases.filter(c => c.status === 'published').length}
          </div>
          <div className="text-gray-500">已发布</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-orange-600">
            {cases.filter(c => c.status === 'draft').length}
          </div>
          <div className="text-gray-500">草稿</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-gray-600">
            {cases.filter(c => c.status === 'archived').length}
          </div>
          <div className="text-gray-500">已归档</div>
        </div>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={cases}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      {/* 编辑弹窗 */}
      <Modal
        title={editingCase ? '编辑案例' : '新建案例'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          className="max-h-[60vh] overflow-y-auto pr-4"
        >
          <Form.Item
            name="title"
            label="案例标题"
            rules={[{ required: true, message: '请输入案例标题' }]}
          >
            <Input placeholder="例如：张家界国家森林公园观光车项目" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="category"
              label="分类"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select placeholder="请选择">
                <Option value="景区">景区</Option>
                <Option value="酒店">酒店</Option>
                <Option value="园区">园区</Option>
                <Option value="城市观光">城市观光</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="location"
              label="地点"
              rules={[{ required: true, message: '请输入地点' }]}
            >
              <Input placeholder="例如：湖南 · 张家界" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="year"
              label="年份"
              rules={[{ required: true, message: '请输入年份' }]}
            >
              <Input type="number" placeholder="2025" />
            </Form.Item>

            <Form.Item
              name="vehicles"
              label="部署车辆数"
              rules={[{ required: true, message: '请输入车辆数' }]}
            >
              <Input type="number" placeholder="50" />
            </Form.Item>
          </div>

          <Form.Item
            name="dailyPassengers"
            label="日均服务人次（可选）"
          >
            <Input type="number" placeholder="10000" />
          </Form.Item>

          <Form.Item
            name="description"
            label="案例描述"
            rules={[{ required: true, message: '请输入案例描述' }]}
          >
            <TextArea rows={3} placeholder="简要描述案例情况" />
          </Form.Item>

          <Form.Item
            name="challenge"
            label="面临挑战"
            rules={[{ required: true, message: '请输入面临的挑战' }]}
          >
            <TextArea rows={2} placeholder="客户面临的问题和挑战" />
          </Form.Item>

          <Form.Item
            name="solution"
            label="解决方案"
            rules={[{ required: true, message: '请输入解决方案' }]}
          >
            <TextArea rows={3} placeholder="提供的解决方案" />
          </Form.Item>

          <Form.Item
            name="results"
            label="项目成果（每行一个）"
            rules={[{ required: true, message: '请输入项目成果' }]}
          >
            <TextArea rows={4} placeholder="&#13;&#10;日均服务游客 10000+ 人次&#13;&#10;年运营里程超过 50 万公里" />
          </Form.Item>

          <Form.Item label="客户评价">
            <div className="space-y-3">
              <Form.Item name={['testimonialQuote']} noStyle>
                <TextArea rows={2} placeholder="客户评价内容" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name={['testimonialAuthor']} noStyle>
                  <Input placeholder="评价人姓名" />
                </Form.Item>
                <Form.Item name={['testimonialPosition']} noStyle>
                  <Input placeholder="评价人职位" />
                </Form.Item>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="images"
            label="案例图片"
          >
            <Upload {...uploadProps}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="published">已发布</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CasesManager;
