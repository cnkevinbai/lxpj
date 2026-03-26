import React, { useState, useEffect } from 'react'
import { Tabs, Card, Form, Input, Button, Switch, Select, message, Space, Divider, Upload, List } from 'antd'
import { SaveOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<any>({})

  // 获取系统设置
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/v1/settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('加载设置失败', error)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  // 保存基础设置
  const saveBasic = async (values: any) => {
    setLoading(true)
    try {
      await fetch('/api/v1/settings/basic', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      message.success('保存成功')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  // 保存通知设置
  const saveNotification = async (values: any) => {
    setLoading(true)
    try {
      await fetch('/api/v1/settings/notification', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      message.success('保存成功')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card title="系统设置">
        <Tabs>
          {/* 基础设置 */}
          <Tabs.TabPane tab="基础设置" key="basic">
            <Form
              layout="vertical"
              onFinish={saveBasic}
              initialValues={settings.basic}
            >
              <Form.Item
                name="companyName"
                label="公司名称"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input placeholder="请输入公司全称" />
              </Form.Item>

              <Form.Item
                name="companyAddress"
                label="公司地址"
              >
                <Input placeholder="请输入公司地址" />
              </Form.Item>

              <Form.Item
                name="companyPhone"
                label="联系电话"
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>

              <Form.Item
                name="companyEmail"
                label="联系邮箱"
              >
                <Input type="email" placeholder="请输入联系邮箱" />
              </Form.Item>

              <Form.Item
                name="website"
                label="公司官网"
              >
                <Input placeholder="请输入官网地址" />
              </Form.Item>

              <Form.Item
                name="icpLicense"
                label="ICP 备案号"
              >
                <Input placeholder="请输入 ICP 备案号" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          {/* 通知设置 */}
          <Tabs.TabPane tab="通知设置" key="notification">
            <Form
              layout="vertical"
              onFinish={saveNotification}
              initialValues={settings.notification}
            >
              <Divider orientation="left">邮件通知</Divider>

              <Form.Item
                name="emailEnabled"
                label="启用邮件通知"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="emailSmtpHost"
                label="SMTP 服务器"
              >
                <Input placeholder="smtp.example.com" />
              </Form.Item>

              <Form.Item
                name="emailSmtpPort"
                label="SMTP 端口"
              >
                <Input type="number" placeholder="587" />
              </Form.Item>

              <Form.Item
                name="emailUsername"
                label="邮箱账号"
              >
                <Input placeholder="请输入邮箱账号" />
              </Form.Item>

              <Divider orientation="left">短信通知</Divider>

              <Form.Item
                name="smsEnabled"
                label="启用短信通知"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="smsProvider"
                label="短信服务商"
              >
                <Select placeholder="请选择">
                  <Option value="aliyun">阿里云</Option>
                  <Option value="tencent">腾讯云</Option>
                  <Option value="huawei">华为云</Option>
                </Select>
              </Form.Item>

              <Divider orientation="left">APP 推送</Divider>

              <Form.Item
                name="pushEnabled"
                label="启用 APP 推送"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          {/* 字典管理 */}
          <Tabs.TabPane tab="字典管理" key="dictionary">
            <Card title="系统字典">
              <Space direction="vertical" style={{ width: '100%' }}>
                <List
                  header={<div>客户来源</div>}
                  dataSource={['官网', '电话', '展会', '推荐', '广告', '其他']}
                  renderItem={(item) => (
                    <List.Item actions={[
                      <Button type="link" size="small">编辑</Button>,
                      <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
                    ]}>
                      {item}
                    </List.Item>
                  )}
                />

                <List
                  header={<div>客户级别</div>}
                  dataSource={['A 级 - 重点客户', 'B 级 - 普通客户', 'C 级 - 潜在客户']}
                  renderItem={(item) => (
                    <List.Item actions={[
                      <Button type="link" size="small">编辑</Button>,
                      <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
                    ]}>
                      {item}
                    </List.Item>
                  )}
                />

                <Button type="dashed" block icon={<UploadOutlined />}>
                  添加字典项
                </Button>
              </Space>
            </Card>
          </Tabs.TabPane>

          {/* 系统维护 */}
          <Tabs.TabPane tab="系统维护" key="maintenance">
            <Card title="数据备份">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <strong>上次备份时间:</strong> 2026-03-12 02:00:00
                </div>
                <div>
                  <strong>备份文件大小:</strong> 1.2 GB
                </div>
                <Space>
                  <Button icon={<UploadOutlined />}>立即备份</Button>
                  <Button>下载备份</Button>
                  <Button danger>恢复数据</Button>
                </Space>
              </Space>
            </Card>

            <Divider />

            <Card title="系统日志">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <strong>日志保留天数:</strong> 30 天
                </div>
                <div>
                  <strong>当前日志大小:</strong> 256 MB
                </div>
                <Space>
                  <Button>查看日志</Button>
                  <Button>下载日志</Button>
                  <Button danger>清空日志</Button>
                </Space>
              </Space>
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default Settings
