import React, { useState, useEffect } from 'react'
import { Card, Typography, Select, Spin, Alert } from 'antd'
import apiClient from '../../services/api'

const { Title, Paragraph } = Typography
const { Option } = Select

/**
 * 隐私政策页面
 */
const PrivacyPolicy: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [policy, setPolicy] = useState<any>(null)
  const [versions, setVersions] = useState<any[]>([])
  const [selectedVersion, setSelectedVersion] = useState<string>('current')

  useEffect(() => {
    loadPrivacyPolicy()
    loadVersions()
  }, [])

  const loadPrivacyPolicy = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/compliance/privacy-policy')
      setPolicy(response.data)
    } catch (error) {
      console.error('加载隐私政策失败', error)
    } finally {
      setLoading(false)
    }
  }

  const loadVersions = async () => {
    try {
      const response = await apiClient.get('/compliance/privacy-policy/history')
      setVersions(response.data)
    } catch (error) {
      console.error('加载版本历史失败', error)
    }
  }

  const handleVersionChange = async (version: string) => {
    setSelectedVersion(version)
    if (version === 'current') {
      loadPrivacyPolicy()
    } else {
      // TODO: 加载历史版本
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8"><Spin /></div>
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card
        title="隐私政策"
        extra={
          <Select
            value={selectedVersion}
            onChange={handleVersionChange}
            className="w-48"
          >
            <Option value="current">当前版本</Option>
            {versions.map((v) => (
              <Option key={v.version} value={v.version}>
                版本 {v.version} ({new Date(v.createdAt).toLocaleDateString()})
              </Option>
            ))}
          </Select>
        }
      >
        <Alert
          message="重要提示"
          description="请仔细阅读隐私政策，了解我们如何收集、使用和保护您的个人信息。"
          type="info"
          showIcon
          className="mb-6"
        />

        {policy && (
          <div>
            <div className="mb-6">
              <Title level={4}>版本信息</Title>
              <Paragraph>
                <strong>版本号：</strong>{policy.version}<br />
                <strong>生效日期：</strong>{new Date(policy.effectiveDate).toLocaleDateString()}<br />
                <strong>更新日期：</strong>{new Date(policy.updatedAt).toLocaleDateString()}
              </Paragraph>
            </div>

            <div className="prose max-w-none">
              <Title level={5}>一、信息收集</Title>
              <Paragraph>
                我们可能收集以下类型的信息：
              </Paragraph>
              <ul>
                <li>个人信息：姓名、联系方式、公司名称等</li>
                <li>业务信息：客户需求、采购意向等</li>
                <li>使用数据：访问记录、操作日志等</li>
              </ul>

              <Title level={5}>二、信息使用</Title>
              <Paragraph>
                我们使用收集的信息用于：
              </Paragraph>
              <ul>
                <li>提供和改进我们的服务</li>
                <li>与您沟通业务相关事宜</li>
                <li>分析使用情况，优化用户体验</li>
                <li>遵守法律法规要求</li>
              </ul>

              <Title level={5}>三、信息保护</Title>
              <Paragraph>
                我们采取以下措施保护您的信息：
              </Paragraph>
              <ul>
                <li>数据加密存储和传输</li>
                <li>访问控制和权限管理</li>
                <li>定期安全审计</li>
                <li>员工保密培训</li>
              </ul>

              <Title level={5}>四、您的权利</Title>
              <Paragraph>
                根据相关法律法规，您享有以下权利：
              </Paragraph>
              <ul>
                <li>访问权：获取您的个人信息副本</li>
                <li>更正权：更正不准确的个人信息</li>
                <li>删除权：在特定情况下删除个人信息</li>
                <li>可携带权：获取结构化的个人信息数据</li>
                <li>反对权：反对处理您的个人信息</li>
              </ul>

              <Title level={5}>五、联系我们</Title>
              <Paragraph>
                如您对本隐私政策有任何疑问或担忧，请通过以下方式联系我们：
              </Paragraph>
              <ul>
                <li>邮箱：privacy@daoda-auto.com</li>
                <li>电话：400-XXX-XXXX</li>
                <li>地址：四川省眉山市 XX 区 XX 路 XX 号</li>
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default PrivacyPolicy
