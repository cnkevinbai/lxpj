import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, Space, Tag, Tabs, Card, Row, Col, Switch } from 'antd';
import { EditOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface PageConfig {
  id: string;
  pageKey: string;
  pageTitle: string;
  pageDescription: string;
  status: 'published' | 'draft';
  version: number;
  updatedAt: string;
}

interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  orderIndex: number;
}

interface CompanyInfo {
  name: string;
  slogan: string;
  description: string;
  years: number;
  dealers: number;
  customers: number;
  certifications: string[];
}

const PageConfigManager: React.FC = () => {
  const [pages, setPages] = useState<PageConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPage, setEditingPage] = useState<PageConfig | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [form] = Form.useForm();

  const pageTypes = [
    { key: 'home', name: '首页', icon: '🏠' },
    { key: 'about', name: '关于我们', icon: '📖' },
    { key: 'contact', name: '联系我们', icon: '📞' },
    { key: 'products', name: '产品列表', icon: '🚗' },
    { key: 'header', name: '网站头部', icon: '🔝' },
    { key: 'footer', name: '网站底部', icon: '🔽' },
  ];

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      // TODO: 调用 API
      const mockData: PageConfig[] = [
        {
          id: '1',
          pageKey: 'home',
          pageTitle: '道达智能 - 电动观光车专家',
          pageDescription: '专业生产电动观光车 15 年',
          status: 'published',
          version: 3,
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          pageKey: 'about',
          pageTitle: '关于我们 - 道达智能',
          pageDescription: '了解道达智能的企业故事',
          status: 'published',
          version: 2,
          updatedAt: new Date().toISOString(),
        },
      ];
      setPages(mockData);
    } catch (error) {
      message.error('加载页面配置失败');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (record?: PageConfig) => {
    if (record) {
      setEditingPage(record);
      form.resetFields();
    } else {
      setEditingPage(null);
      form.resetFields();
    }
    setModalVisible(true);
    setActiveTab('basic');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      message.success('保存成功');
      setModalVisible(false);
      loadPages();
    } catch (error) {
      message.error('保存失败');
    }
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">页面配置管理</h1>
          <p className="text-gray-500">管理官网所有页面的可配置内容</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-blue-600">{pages.length}</div>
          <div className="text-gray-500">可配置页面</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-green-600">
            {pages.filter(p => p.status === 'published').length}
          </div>
          <div className="text-gray-500">已发布</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-3xl font-bold text-orange-600">
            {pages.filter(p => p.status === 'draft').length}
          </div>
          <div className="text-gray-500">草稿</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={[
            {
              title: '页面',
              dataIndex: 'pageKey',
              key: 'pageKey',
              width: 200,
              render: (key: string) => {
                const pageType = pageTypes.find(p => p.key === key);
                return (
                  <Space>
                    <span className="text-2xl">{pageType?.icon}</span>
                    <div>
                      <div className="font-medium">{pageType?.name}</div>
                      <div className="text-xs text-gray-500">/{key}</div>
                    </div>
                  </Space>
                );
              },
            },
            {
              title: '页面标题',
              dataIndex: 'pageTitle',
              key: 'pageTitle',
              width: 300,
              ellipsis: true,
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 80,
              render: (status: string) => (
                <Tag color={status === 'published' ? 'green' : 'orange'}>
                  {status === 'published' ? '已发布' : '草稿'}
                </Tag>
              ),
            },
            {
              title: '版本',
              dataIndex: 'version',
              key: 'version',
              width: 60,
            },
            {
              title: '更新时间',
              dataIndex: 'updatedAt',
              key: 'updatedAt',
              width: 160,
              render: (date: string) => new Date(date).toLocaleString('zh-CN'),
            },
            {
              title: '操作',
              key: 'action',
              width: 200,
              render: (_: any, record: PageConfig) => (
                <Space>
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => window.open(`/${record.pageKey}`, '_blank')}
                  >
                    查看
                  </Button>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => openModal(record)}
                  >
                    编辑配置
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={pages}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </div>

      <Modal
        title={editingPage ? '编辑页面配置' : '新建页面配置'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="preview" icon={<EyeOutlined />}>
            预览
          </Button>,
          <Button key="submit" type="primary" icon={<SaveOutlined />} onClick={handleSubmit}>
            保存
          </Button>,
        ]}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab="基础设置" key="basic">
            <Form form={form} layout="vertical">
              <Form.Item label="页面标题" rules={[{ required: true }]}>
                <Input placeholder="页面 Title 标签内容" />
              </Form.Item>
              <Form.Item label="页面描述">
                <TextArea rows={2} placeholder="Meta Description" />
              </Form.Item>
              <Form.Item label="发布状态">
                <Select defaultValue="published">
                  <Option value="published">已发布</Option>
                  <Option value="draft">草稿</Option>
                </Select>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Hero 区域" key="hero">
            <Form form={form} layout="vertical">
              <Form.Item label="主标题">
                <Input placeholder="Hero 大标题" />
              </Form.Item>
              <Form.Item label="副标题">
                <TextArea rows={2} placeholder="Hero 副标题" />
              </Form.Item>
              <Form.Item label="背景图片">
                <Upload {...uploadProps}>
                  <div>
                    <span className="text-2xl">+</span>
                    <div>上传图片</div>
                  </div>
                </Upload>
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="主按钮文字">
                    <Input placeholder="例如：探索产品" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="主按钮链接">
                    <Input placeholder="/products" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="次按钮文字">
                    <Input placeholder="例如：联系我们" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="次按钮链接">
                    <Input placeholder="/contact" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>

          <TabPane tab="核心优势" key="features">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((index) => (
                <Card key={index} size="small" className="mb-4">
                  <Row gutter={16}>
                    <Col span={4}>
                      <Form.Item label="图标">
                        <Input placeholder="🔋" maxLength={2} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="标题">
                        <Input placeholder="超长续航" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="描述">
                        <Input placeholder="80-120km 续航" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
              <Button type="dashed" block>
                + 添加优势项
              </Button>
            </div>
          </TabPane>

          <TabPane tab="公司信息" key="company">
            <Form form={form} layout="vertical">
              <Form.Item label="公司名称">
                <Input placeholder="四川道达智能科技有限公司" />
              </Form.Item>
              <Form.Item label="公司口号">
                <Input placeholder="引领绿色出行新时代" />
              </Form.Item>
              <Form.Item label="公司简介">
                <TextArea rows={4} placeholder="公司介绍内容" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="成立年限">
                    <Input type="number" placeholder="15" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="经销商数量">
                    <Input type="number" placeholder="200" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="客户数量">
                    <Input type="number" placeholder="50000" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="资质证书">
                <Select mode="tags" placeholder="输入证书名称" />
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="联系方式" key="contact">
            <Form form={form} layout="vertical">
              <Form.Item label="地址">
                <TextArea rows={2} placeholder="详细地址" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="电话">
                    <Input placeholder="400-XXX-XXXX" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="邮箱">
                    <Input placeholder="info@evcart.com" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="传真">
                    <Input placeholder="+86-XXX-XXXX" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="工作时间">
                    <Input placeholder="9:00-18:00" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="地图链接">
                <Input placeholder="百度/高德地图链接" />
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="SEO 设置" key="seo">
            <Form form={form} layout="vertical">
              <Form.Item label="Meta Title">
                <Input placeholder="搜索引擎显示的标题" />
              </Form.Item>
              <Form.Item label="Meta Description">
                <TextArea rows={2} placeholder="搜索引擎显示的描述（150-160 字符）" />
              </Form.Item>
              <Form.Item label="Meta Keywords">
                <Select mode="tags" placeholder="输入关键词" />
              </Form.Item>
              <Form.Item label="OG 图片">
                <Upload {...uploadProps}>
                  <div>
                    <span className="text-2xl">+</span>
                    <div>上传社交分享图片</div>
                  </div>
                </Upload>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default PageConfigManager;
