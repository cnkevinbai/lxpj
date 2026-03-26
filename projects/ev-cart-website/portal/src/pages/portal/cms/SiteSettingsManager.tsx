import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Tabs, Card, Row, Col, Image, Switch, Divider } from 'antd';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { TextArea } = Input;
const { TabPane } = Tabs;

interface SiteSettings {
  siteName: string;
  siteSlogan: string;
  siteLogo: string;
  siteFavicon: string;
  siteUrl: string;
  
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultMetaKeywords: string;
  
  contactPhone: string;
  contactEmail: string;
  contactFax: string;
  contactAddress: string;
  contactWorkingHours: string;
  
  socialWechat: string;
  socialWeibo: string;
  socialLinkedin: string;
  socialFacebook: string;
  socialBilibili: string;
  
  analyticsBaiduId: string;
  analyticsGaId: string;
  
  chatEnabled: boolean;
  chatProvider: string;
  chatId: string;
  
  icpNumber: string;
  icpUrl: string;
  policeNumber: string;
  policeUrl: string;
}

const SiteSettingsManager: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // TODO: 调用 API
      const mockData: SiteSettings = {
        siteName: '道达智能',
        siteSlogan: '电动观光车专家',
        siteLogo: '/images/logo.png',
        siteFavicon: '/favicon.ico',
        siteUrl: 'https://www.evcart.com',
        defaultMetaTitle: '道达智能 - 专业电动观光车制造商',
        defaultMetaDescription: '四川道达智能，15 年电动观光车生产经验',
        defaultMetaKeywords: '电动观光车，巡逻车，高尔夫球车',
        contactPhone: '400-XXX-XXXX',
        contactEmail: 'info@evcart.com',
        contactFax: '+86-XXX-XXXX',
        contactAddress: '四川省 XXX 市 XXX 区',
        contactWorkingHours: '9:00-18:00',
        socialWechat: 'wechat_qr.png',
        socialWeibo: 'https://weibo.com/evcart',
        socialLinkedin: 'https://linkedin.com/company/evcart',
        socialFacebook: '',
        socialBilibili: 'https://space.bilibili.com/xxxxx',
        analyticsBaiduId: '',
        analyticsGaId: '',
        chatEnabled: true,
        chatProvider: 'meiqia',
        chatId: 'xxxxx',
        icpNumber: '蜀 ICP 备 XXXXXXXX 号',
        icpUrl: 'https://beian.miit.gov.cn/',
        policeNumber: '川公网安备 XXXXXXXXXXXXXX 号',
        policeUrl: 'http://www.beian.gov.cn/',
      };
      form.setFieldsValue(mockData);
    } catch (error) {
      message.error('加载设置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // TODO: 调用 API 保存
      message.success('保存成功');
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
      return isImage && file.size / 1024 / 1024 < 5;
    },
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">网站设置</h1>
          <p className="text-gray-500">管理全局网站配置信息</p>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          size="large"
        >
          保存设置
        </Button>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          {/* 基础设置 */}
          <TabPane tab="基础信息" key="basic">
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="siteName"
                    label="网站名称"
                    rules={[{ required: true, message: '请输入网站名称' }]}
                  >
                    <Input placeholder="道达智能" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="siteSlogan"
                    label="网站口号"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="电动观光车专家" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="siteLogo" label="网站 Logo">
                    <Upload {...uploadProps}>
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>上传 Logo</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="siteFavicon" label="网站 Favicon">
                    <Upload {...uploadProps}>
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>上传 Favicon</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="siteUrl"
                label="网站 URL"
                rules={[{ required: true, type: 'url' }]}
              >
                <Input placeholder="https://www.evcart.com" />
              </Form.Item>
            </Form>
          </TabPane>

          {/* SEO 设置 */}
          <TabPane tab="SEO 配置" key="seo">
            <Form form={form} layout="vertical">
              <Form.Item
                name="defaultMetaTitle"
                label="默认 Meta Title"
                extra="建议 50-60 个字符"
              >
                <Input placeholder="道达智能 - 专业电动观光车制造商" />
              </Form.Item>

              <Form.Item
                name="defaultMetaDescription"
                label="默认 Meta Description"
                extra="建议 150-160 个字符"
              >
                <TextArea rows={3} placeholder="四川道达智能，15 年电动观光车生产经验..." />
              </Form.Item>

              <Form.Item
                name="defaultMetaKeywords"
                label="默认 Meta Keywords"
                extra="用逗号分隔关键词"
              >
                <Input placeholder="电动观光车，巡逻车，高尔夫球车，景区接驳车" />
              </Form.Item>
            </Form>
          </TabPane>

          {/* 联系方式 */}
          <TabPane tab="联系方式" key="contact">
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="contactPhone"
                    label="联系电话"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="400-XXX-XXXX" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="contactEmail"
                    label="联系邮箱"
                    rules={[{ required: true, type: 'email' }]}
                  >
                    <Input placeholder="info@evcart.com" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="contactFax" label="传真">
                    <Input placeholder="+86-XXX-XXXX" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="contactAddress"
                label="详细地址"
                rules={[{ required: true }]}
              >
                <TextArea rows={2} placeholder="四川省 XXX 市 XXX 区 XXX 路 XXX 号" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="contactWorkingHours" label="工作时间">
                    <Input placeholder="周一至周五 9:00-18:00" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="contactMapUrl" label="地图链接">
                    <Input placeholder="百度/高德地图链接" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>

          {/* 社交媒体 */}
          <TabPane tab="社交媒体" key="social">
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="socialWechat" label="微信公众号">
                    <Input placeholder="上传二维码" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="socialWeibo" label="微博">
                    <Input placeholder="https://weibo.com/xxx" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="socialLinkedin" label="LinkedIn">
                    <Input placeholder="https://linkedin.com/company/xxx" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="socialFacebook" label="Facebook">
                    <Input placeholder="https://facebook.com/xxx" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="socialBilibili" label="B 站">
                    <Input placeholder="https://space.bilibili.com/xxxxx" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>

          {/* 统计代码 */}
          <TabPane tab="统计代码" key="analytics">
            <Form form={form} layout="vertical">
              <Form.Item
                name="analyticsBaiduId"
                label="百度统计 ID"
                extra="从 https://tongji.baidu.com 获取"
              >
                <Input placeholder="xxxxxxxxxxxxxxxx" />
              </Form.Item>

              <Form.Item
                name="analyticsGaId"
                label="Google Analytics ID"
                extra="从 https://analytics.google.com 获取"
              >
                <Input placeholder="G-XXXXXXXXXX" />
              </Form.Item>
            </Form>
          </TabPane>

          {/* 客服配置 */}
          <TabPane tab="客服配置" key="chat">
            <Form form={form} layout="vertical">
              <Form.Item
                name="chatEnabled"
                label="启用客服"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="chatProvider"
                label="客服服务商"
              >
                <Input placeholder="meiqia | easemob | qidian" />
              </Form.Item>

              <Form.Item
                name="chatId"
                label="客服系统 ID"
              >
                <Input placeholder="从客服平台获取" />
              </Form.Item>
            </Form>
          </TabPane>

          {/* ICP 备案 */}
          <TabPane tab="ICP 备案" key="icp">
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="icpNumber" label="ICP 备案号">
                    <Input placeholder="蜀 ICP 备 XXXXXXXX 号" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="icpUrl" label="ICP 备案链接">
                    <Input placeholder="https://beian.miit.gov.cn/" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="policeNumber" label="公安备案号">
                    <Input placeholder="川公网安备 XXXXXXXXXXXXXX 号" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="policeUrl" label="公安备案链接">
                    <Input placeholder="http://www.beian.gov.cn/" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SiteSettingsManager;
