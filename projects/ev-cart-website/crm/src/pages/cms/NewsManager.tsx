import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, Space, Tag, Popconfirm, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

interface NewsItem {
  id: string;
  title: string;
  category: string;
  author: string;
  publishDate: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  views: number;
  status: 'published' | 'draft' | 'scheduled';
  createdAt: string;
  updatedAt: string;
}

const NewsManager: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      // TODO: 调用 API
      const mockData: NewsItem[] = [
        {
          id: '1',
          title: '道达智能荣获 2025 年度新能源汽车行业创新企业奖',
          category: '公司动态',
          author: '市场部',
          publishDate: '2026-03-10',
          excerpt: '在第十三届中国新能源汽车产业峰会上...',
          content: '详细内容...',
          coverImage: '/images/news/award-2025.jpg',
          tags: ['获奖', '创新企业'],
          views: 1280,
          status: 'published',
          createdAt: '2026-03-10T10:00:00Z',
          updatedAt: '2026-03-10T10:00:00Z',
        },
      ];
      setNews(mockData);
    } catch (error) {
      message.error('加载新闻列表失败');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (record?: NewsItem) => {
    if (record) {
      setEditingNews(record);
      form.setFieldsValue(record);
    } else {
      setEditingNews(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      message.success(editingNews ? '更新成功' : '创建成功');
      setModalVisible(false);
      loadNews();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      message.success('删除成功');
      loadNews();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const statusMap: Record<string, { text: string; color: string }> = {
    published: { text: '已发布', color: 'green' },
    draft: { text: '草稿', color: 'orange' },
    scheduled: { text: '定时发布', color: 'blue' },
  };

  const uploadProps: UploadProps = {
    action: '/api/v1/upload',
    listType: 'picture-card',
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) message.error('只能上传图片文件！');
      return isImage && file.size / 1024 / 1024 < 10;
    },
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: NewsItem) => (
        <Space>
          {record.coverImage && (
            <Image width={80} height={50} src={record.coverImage} style={{ objectFit: 'cover' }} />
          )}
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.category} · {record.views}次阅读</div>
          </div>
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
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 80,
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
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
      width: 200,
      render: (_: any, record: NewsItem) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/news/${record.id}`, '_blank')}
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
            title="确定删除这篇新闻吗？"
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
          <h1 className="text-2xl font-bold mb-2">新闻管理</h1>
          <p className="text-gray-500">管理官网新闻中心内容</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          size="large"
        >
          新建新闻
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-blue-600">{news.length}</div>
          <div className="text-gray-500">总新闻数</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-green-600">
            {news.filter(n => n.status === 'published').length}
          </div>
          <div className="text-gray-500">已发布</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-orange-600">
            {news.filter(n => n.status === 'draft').length}
          </div>
          <div className="text-gray-500">草稿箱</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-blue-600">
            {news.reduce((sum, n) => sum + n.views, 0).toLocaleString()}
          </div>
          <div className="text-gray-500">总阅读量</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={news}
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
        title={editingNews ? '编辑新闻' : '新建新闻'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={900}
      >
        <Form form={form} layout="vertical" className="max-h-[70vh] overflow-y-auto pr-4">
          <Form.Item name="title" label="新闻标题" rules={[{ required: true }]}>
            <Input placeholder="输入新闻标题" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="分类" rules={[{ required: true }]}>
              <Select>
                <Option value="公司动态">公司动态</Option>
                <Option value="产品发布">产品发布</Option>
                <Option value="项目动态">项目动态</Option>
                <Option value="行业资讯">行业资讯</Option>
                <Option value="媒体报道">媒体报道</Option>
              </Select>
            </Form.Item>
            <Form.Item name="author" label="作者" rules={[{ required: true }]}>
              <Input placeholder="作者姓名" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="publishDate" label="发布时间">
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select>
                <Option value="draft">草稿</Option>
                <Option value="published">已发布</Option>
                <Option value="scheduled">定时发布</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="excerpt" label="摘要" rules={[{ required: true }]}>
            <TextArea rows={2} placeholder="新闻摘要，用于列表页展示" />
          </Form.Item>

          <Form.Item name="content" label="正文内容" rules={[{ required: true }]}>
            <TextArea rows={10} placeholder="支持 HTML 格式的富文本内容" />
          </Form.Item>

          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="输入标签后按回车" />
          </Form.Item>

          <Form.Item name="coverImage" label="封面图片">
            <Upload {...uploadProps}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传封面</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsManager;
