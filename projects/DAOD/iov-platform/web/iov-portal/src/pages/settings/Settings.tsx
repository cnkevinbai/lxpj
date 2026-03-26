/**
 * 系统设置页面
 * 
 * @author daod-team
 */

import React, { useState } from 'react';
import { 
  Card, Form, Input, Select, Switch, Button, Space, Divider, 
  message, Tabs, InputNumber, ColorPicker 
} from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/common';
import { useSettingsStore } from '@/stores';

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const settings = useSettingsStore();

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // 保存设置
      Object.entries(values).forEach(([key, value]) => {
        // 更新设置
      });
      message.success('设置保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info('已重置为默认值');
  };

  const items = [
    {
      key: 'basic',
      label: '基本设置',
      children: (
        <>
          <Form.Item name="language" label="语言" rules={[{ required: true }]}>
            <Select style={{ width: 200 }}>
              <Select.Option value="zh-CN">简体中文</Select.Option>
              <Select.Option value="en-US">English</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="timezone" label="时区" rules={[{ required: true }]}>
            <Select style={{ width: 200 }}>
              <Select.Option value="Asia/Shanghai">Asia/Shanghai (GMT+8)</Select.Option>
              <Select.Option value="UTC">UTC</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateFormat" label="日期格式">
            <Select style={{ width: 200 }}>
              <Select.Option value="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
              <Select.Option value="DD/MM/YYYY">DD/MM/YYYY</Select.Option>
              <Select.Option value="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      key: 'theme',
      label: '主题设置',
      children: (
        <>
          <Form.Item name="theme" label="主题模式">
            <Select style={{ width: 200 }}>
              <Select.Option value="light">浅色模式</Select.Option>
              <Select.Option value="dark">深色模式</Select.Option>
              <Select.Option value="auto">跟随系统</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="primaryColor" label="主色调">
            <ColorPicker />
          </Form.Item>
          <Form.Item name="compactMode" label="紧凑模式" valuePropName="checked">
            <Switch />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'notification',
      label: '通知设置',
      children: (
        <>
          <Form.Item name="notificationEnabled" label="启用通知" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="notificationSound" label="通知声音" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="emailNotification" label="邮件通知" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="alarmNotification" label="告警通知" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'map',
      label: '地图设置',
      children: (
        <>
          <Form.Item name="mapTileLayer" label="地图图层">
            <Select style={{ width: 200 }}>
              <Select.Option value="openstreetmap">OpenStreetMap</Select.Option>
              <Select.Option value="gaode">高德地图</Select.Option>
              <Select.Option value="baidu">百度地图</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="mapShowTraffic" label="显示路况" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="mapClusterMarkers" label="聚合标记" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item name="mapDefaultZoom" label="默认缩放级别">
            <InputNumber min={1} max={18} style={{ width: 200 }} defaultValue={11} />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'table',
      label: '表格设置',
      children: (
        <>
          <Form.Item name="tablePageSize" label="每页显示条数">
            <Select style={{ width: 200 }}>
              <Select.Option value={10}>10 条</Select.Option>
              <Select.Option value={20}>20 条</Select.Option>
              <Select.Option value={50}>50 条</Select.Option>
              <Select.Option value={100}>100 条</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="tableShowPagination" label="显示分页" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item name="tableShowQuickJumper" label="显示快速跳转" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <div className="settings-page">
      <PageHeader 
        title="系统设置" 
        subtitle="配置系统参数和偏好设置"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              loading={loading}
              onClick={() => form.submit()}
            >
              保存设置
            </Button>
          </Space>
        }
      />

      <Card>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSave}
          initialValues={{
            language: 'zh-CN',
            timezone: 'Asia/Shanghai',
            theme: 'light',
            notificationEnabled: true,
            notificationSound: true,
            mapClusterMarkers: true,
            mapDefaultZoom: 11,
            tablePageSize: 20,
          }}
        >
          <Tabs items={items} />
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage;