/**
 * 系统配置页面
 * 包含基础配置、邮件配置、存储配置、安全配置
 */
import { useState } from 'react'
import { 
  Card, Form, Input, Button, Space, message, Tabs, Switch, 
  InputNumber, Divider, Typography, Row, Col, Upload, Modal
} from 'antd'
import { SaveOutlined, MailOutlined, CloudUploadOutlined, SecurityScanOutlined, SettingOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { systemConfigService, ConfigCategory } from '@/services/system-config.service'

const { Text, Title } = Typography

// 配置项定义
interface ConfigItem {
  key: string
  label: string
  type: 'text' | 'password' | 'number' | 'textarea' | 'switch' | 'upload'
  placeholder?: string
  help?: string
  required?: boolean
  min?: number
  max?: number
  rows?: number // textarea 行数
}

// 各分类配置项
const configDefinitions: Record<ConfigCategory, ConfigItem[]> = {
  basic: [
    { key: 'system.name', label: '系统名称', type: 'text', placeholder: '道达车辆管理平台', required: true },
    { key: 'system.logo', label: '系统 Logo', type: 'upload', help: '建议尺寸：200x50px' },
    { key: 'system.description', label: '系统描述', type: 'textarea', placeholder: '请输入系统描述', rows: 3 },
    { key: 'system.company', label: '公司名称', type: 'text', placeholder: '道达智能车辆制造有限公司' },
    { key: 'system.address', label: '公司地址', type: 'text', placeholder: '四川省眉山市' },
    { key: 'system.phone', label: '联系电话', type: 'text', placeholder: '400-888-8888' },
    { key: 'system.icp', label: 'ICP 备案号', type: 'text', placeholder: '京 ICP 备 xxxxxxxx 号' },
  ],
  email: [
    { key: 'email.host', label: 'SMTP 服务器', type: 'text', placeholder: 'smtp.example.com', required: true },
    { key: 'email.port', label: '端口', type: 'number', placeholder: '587', min: 1, max: 65535, required: true },
    { key: 'email.username', label: '发件人邮箱', type: 'text', placeholder: 'noreply@example.com', required: true },
    { key: 'email.password', label: '邮箱密码', type: 'password', placeholder: '请输入邮箱密码或授权码', required: true },
    { key: 'email.secure', label: '启用 SSL/TLS', type: 'switch', help: '根据 SMTP 服务器要求选择' },
    { key: 'email.fromName', label: '发件人名称', type: 'text', placeholder: '道达平台' },
  ],
  storage: [
    { key: 'storage.provider', label: '存储提供商', type: 'text', placeholder: 'local/oss/cos', help: 'local: 本地，oss: 阿里云，cos: 腾讯云' },
    { key: 'storage.endpoint', label: 'Endpoint', type: 'text', placeholder: 'oss-cn-hangzhou.aliyuncs.com' },
    { key: 'storage.bucket', label: 'Bucket', type: 'text', placeholder: 'daoda-platform' },
    { key: 'storage.accessKey', label: 'Access Key', type: 'text', placeholder: '请输入 Access Key' },
    { key: 'storage.secretKey', label: 'Secret Key', type: 'password', placeholder: '请输入 Secret Key' },
    { key: 'storage.maxSize', label: '最大上传大小 (MB)', type: 'number', placeholder: '10', min: 1, max: 1024 },
    { key: 'storage.allowedTypes', label: '允许的文件类型', type: 'textarea', placeholder: 'image/png,image/jpeg,application/pdf', help: '逗号分隔的 MIME 类型', rows: 2 },
  ],
  security: [
    { key: 'security.passwordMinLength', label: '密码最小长度', type: 'number', placeholder: '6', min: 4, max: 32 },
    { key: 'security.passwordRequireSpecial', label: '要求特殊字符', type: 'switch', help: '密码必须包含特殊字符' },
    { key: 'security.passwordRequireNumber', label: '要求数字', type: 'switch', help: '密码必须包含数字' },
    { key: 'security.passwordExpiryDays', label: '密码过期天数', type: 'number', placeholder: '0 表示永不过期', min: 0, max: 365 },
    { key: 'security.loginMaxAttempts', label: '最大登录尝试次数', type: 'number', placeholder: '5', min: 1, max: 10 },
    { key: 'security.loginLockoutMinutes', label: '锁定时间 (分钟)', type: 'number', placeholder: '30', min: 1, max: 1440 },
    { key: 'security.sessionTimeout', label: '会话超时时间 (分钟)', type: 'number', placeholder: '120', min: 5, max: 1440 },
    { key: 'security.enableCaptcha', label: '启用验证码', type: 'switch', help: '登录时显示验证码' },
    { key: 'security.enable2FA', label: '启用双因素认证', type: 'switch', help: '支持 Google Authenticator' },
  ],
}

// Tab 定义
const tabs = [
  { key: 'basic', label: '基础配置', icon: <SettingOutlined /> },
  { key: 'email', label: '邮件配置', icon: <MailOutlined /> },
  { key: 'storage', label: '存储配置', icon: <CloudUploadOutlined /> },
  { key: 'security', label: '安全配置', icon: <SecurityScanOutlined /> },
]

export default function SystemSettings() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState<ConfigCategory>('basic')
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([])

  // 获取配置
  const { data } = useQuery({
    queryKey: ['systemConfigs'],
    queryFn: () => systemConfigService.getAll(),
  })

  // 保存配置
  const saveMutation = useMutation({
    mutationFn: (configs: { key: string; value: string; remark?: string }[]) => 
      systemConfigService.batchUpdate({ configs }),
    onSuccess: () => {
      message.success('配置保存成功')
      queryClient.invalidateQueries({ queryKey: ['systemConfigs'] })
    },
  })

  // 初始化表单数据
  const initFormData = () => {
    if (data) {
      const values: Record<string, any> = {}
      data.forEach(config => {
        // 转换值为合适的类型
        if (config.value === 'true') {
          values[config.key] = true
        } else if (config.value === 'false') {
          values[config.key] = false
        } else if (!isNaN(Number(config.value)) && config.key.includes('port') || config.key.includes('Size') || config.key.includes('Days') || config.key.includes('Minutes') || config.key.includes('Length') || config.key.includes('Attempts') || config.key.includes('Timeout')) {
          values[config.key] = Number(config.value)
        } else {
          values[config.key] = config.value
        }
      })
      form.setFieldsValue(values)
    }
  }

  // 当数据加载完成时初始化表单
  useState(() => {
    if (data) {
      initFormData()
    }
  })

  // Logo 上传
  const logoUploadProps = {
    onRemove: () => setLogoFileList([]),
    beforeUpload: (file: UploadFile) => {
      const isImage = file.type?.startsWith('image/')
      if (!isImage) {
        message.error('只能上传图片文件')
        return false
      }
      const isLt2M = (file.size || 0) / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB')
        return false
      }
      setLogoFileList([file])
      return false
    },
    fileList: logoFileList,
    maxCount: 1,
    accept: 'image/*',
  }

  // 渲染表单项
  const renderFormItem = (item: ConfigItem) => {
    const rules: any[] = []
    if (item.required) {
      rules.push({ required: true, message: `请输入${item.label}` })
    }
    if (item.min !== undefined) {
      rules.push({ min: item.min, message: `最小值为${item.min}` })
    }
    if (item.max !== undefined) {
      rules.push({ max: item.max, message: `最大值为${item.max}` })
    }

    switch (item.type) {
      case 'textarea':
        return (
          <Form.Item
            key={item.key}
            name={item.key}
            label={item.label}
            rules={rules}
          >
            <Input.TextArea 
              rows={(item as any).rows || 3} 
              placeholder={item.placeholder} 
            />
          </Form.Item>
        )
      case 'switch':
        return (
          <Form.Item
            key={item.key}
            name={item.key}
            label={item.label}
            valuePropName="checked"
            rules={rules}
          >
            <Switch />
          </Form.Item>
        )
      case 'upload':
        return (
          <Form.Item
            key={item.key}
            name={item.key}
            label={item.label}
            extra={item.help}
          >
            <Upload {...logoUploadProps}>
              <Button icon={<CloudUploadOutlined />}>上传 Logo</Button>
            </Upload>
          </Form.Item>
        )
      case 'number':
        return (
          <Form.Item
            key={item.key}
            name={item.key}
            label={item.label}
            rules={rules}
          >
            <InputNumber 
              min={item.min} 
              max={item.max} 
              placeholder={item.placeholder}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )
      case 'password':
        return (
          <Form.Item
            key={item.key}
            name={item.key}
            label={item.label}
            rules={rules}
          >
            <Input.Password placeholder={item.placeholder} />
          </Form.Item>
        )
      default:
        return (
          <Form.Item
            key={item.key}
            name={item.key}
            label={item.label}
            rules={rules}
          >
            <Input placeholder={item.placeholder} />
          </Form.Item>
        )
    }
  }

  // 处理保存
  const handleSave = () => {
    form.validateFields().then(values => {
      const configs = Object.entries(values).map(([key, value]) => ({
        key,
        value: typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value),
      }))
      saveMutation.mutate(configs)
    })
  }

  // 处理重置
  const handleReset = () => {
    Modal.confirm({
      title: '确认重置',
      content: '确定要重置当前分类的配置吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const currentConfigs = configDefinitions[activeTab]
        const resetValues: Record<string, any> = {}
        currentConfigs.forEach(config => {
          resetValues[config.key] = undefined
        })
        form.setFieldsValue(resetValues)
        message.success('配置已重置')
      },
    })
  }

  return (
    <Card
      title="系统配置"
      extra={
        <Space>
          <Button onClick={handleReset}>重置</Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={saveMutation.isPending}
          >
            保存配置
          </Button>
        </Space>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as ConfigCategory)}
        items={tabs.map(tab => ({
          key: tab.key,
          label: (
            <Space>
              {tab.icon}
              <Text>{tab.label}</Text>
            </Space>
          ),
          children: (
            <div style={{ maxWidth: 800, padding: '20px 0' }}>
              <Title level={5} style={{ marginBottom: 24 }}>{tab.label}</Title>
              <Form
                form={form}
                layout="vertical"
                onValuesChange={() => {}}
              >
                <Row gutter={24}>
                  {configDefinitions[activeTab as ConfigCategory].map(item => (
                    <Col span={12} key={item.key}>
                      {renderFormItem(item)}
                    </Col>
                  ))}
                </Row>
              </Form>
            </div>
          ),
        }))}
      />

      <Divider />

      <Space>
        <Button onClick={handleReset}>重置当前分类</Button>
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          onClick={handleSave}
          loading={saveMutation.isPending}
        >
          保存配置
        </Button>
      </Space>
    </Card>
  )
}
