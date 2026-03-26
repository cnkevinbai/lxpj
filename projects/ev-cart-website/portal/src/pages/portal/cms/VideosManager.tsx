import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, Space, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

interface VideoItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  videoType: 'bilibili' | 'youku' | 'local';
  thumbnail: string;
  duration: string;
  description: string;
  tags: string[];
  views: number;
  status: 'published' | 'draft';
  publishedAt: string;
  createdAt: string;
}

const VideosManager: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const mockData: VideoItem[] = [
        {
          id: '1',
          title: '道达智能工厂实拍 - 现代化生产线',
          category: '工厂实拍',
          videoUrl: 'https://www.bilibili.com/video/BV1xxxxx',
          videoType: 'bilibili',
          thumbnail: '/images/videos/factory-tour.jpg',
          duration: '5:32',
          description: '走进道达智能生产基地...',
          tags: ['工厂', '生产线'],
          views: 12580,
          status: 'published',
          publishedAt: '2026-03-01T10:00:00Z',
          createdAt: '2026-03-01T10:00:00Z',
        },
      ];
      setVideos(mockData);
    } catch (error) {
      message.error('加载视频列表失败');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (record?: VideoItem) => {
    if (record) {
      setEditingVideo(record);
      form.setFieldsValue(record);
    } else {
      setEditingVideo(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      message.success(editingVideo ? '更新成功' : '创建成功');
      setModalVisible(false);
      loadVideos();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      message.success('删除成功');
      loadVideos();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const statusMap: Record<string, { text: string; color: string }> = {
    published: { text: '已发布', color: 'green' },
    draft: { text: '草稿', color: 'orange' },
  };

  const categoryMap: Record<string, string> = {
    '产品介绍': 'blue',
    '客户见证': 'green',
    '工厂实拍': 'purple',
    '技术展示': 'orange',
    '项目案例': 'cyan',
    '公司动态': 'red',
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
      title: '视频',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: VideoItem) => (
        <Space>
          {record.thumbnail && (
            <div className="relative">
              <img src={record.thumbnail} alt="" className="w-20 h-12 object-cover rounded" />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                <PlayCircleOutlined className="text-white text-xl" />
              </div>
            </div>
          )}
          <div>
            <div className="font-medium line-clamp-2">{text}</div>
            <div className="text-xs text-gray-500">{record.duration} · {record.views.toLocaleString()}次播放</div>
          </div>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (text: string) => <Tag color={categoryMap[text] || 'default'}>{text}</Tag>,
    },
    {
      title: '来源',
      dataIndex: 'videoType',
      key: 'videoType',
      width: 80,
      render: (type: string) => {
        const map: Record<string, string> = {
          bilibili: 'B 站',
          youku: '优酷',
          local: '本地',
        };
        return <Tag>{map[type] || type}</Tag>;
      },
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
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
      render: (_: any, record: VideoItem) => (
        <Space>
          <Button
            type="link"
            icon={<PlayCircleOutlined />}
            onClick={() => window.open(record.videoUrl, '_blank')}
          >
            播放
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个视频吗？"
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
          <h1 className="text-2xl font-bold mb-2">视频管理</h1>
          <p className="text-gray-500">管理官网视频中心内容</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          size="large"
        >
          新建视频
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-blue-600">{videos.length}</div>
          <div className="text-gray-500">总视频数</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-green-600">
            {videos.filter(v => v.status === 'published').length}
          </div>
          <div className="text-gray-500">已发布</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-orange-600">
            {videos.filter(v => v.status === 'draft').length}
          </div>
          <div className="text-gray-500">草稿箱</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-purple-600">
            {videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}
          </div>
          <div className="text-gray-500">总播放量</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={videos}
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
        title={editingVideo ? '编辑视频' : '新建视频'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={900}
      >
        <Form form={form} layout="vertical" className="max-h-[70vh] overflow-y-auto pr-4">
          <Form.Item name="title" label="视频标题" rules={[{ required: true }]}>
            <Input placeholder="输入视频标题" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="分类" rules={[{ required: true }]}>
              <Select>
                <Option value="产品介绍">产品介绍</Option>
                <Option value="客户见证">客户见证</Option>
                <Option value="工厂实拍">工厂实拍</Option>
                <Option value="技术展示">技术展示</Option>
                <Option value="项目案例">项目案例</Option>
                <Option value="公司动态">公司动态</Option>
              </Select>
            </Form.Item>
            <Form.Item name="videoType" label="视频来源" rules={[{ required: true }]}>
              <Select>
                <Option value="bilibili">B 站</Option>
                <Option value="youku">优酷</Option>
                <Option value="local">本地上传</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item 
            name="videoUrl" 
            label="视频链接" 
            rules={[{ required: true, message: '请输入视频链接' }]}
            extra="B 站/优酷链接或本地文件路径"
          >
            <Input placeholder="https://www.bilibili.com/video/..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="duration" label="时长">
              <Input placeholder="5:32" />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select>
                <Option value="draft">草稿</Option>
                <Option value="published">已发布</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="description" label="视频描述" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="视频简介" />
          </Form.Item>

          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="输入标签后按回车" />
          </Form.Item>

          <Form.Item name="thumbnail" label="封面图片">
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

export default VideosManager;
