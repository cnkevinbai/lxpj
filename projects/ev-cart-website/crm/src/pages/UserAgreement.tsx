import React, { useState, useEffect } from 'react'
import { Card, Typography, Select, Spin, Alert, Checkbox, Button } from 'antd'
import apiClient from '../services/api'

const { Title, Paragraph } = Typography
const { Option } = Select

/**
 * 用户协议页面
 */
const UserAgreement: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [agreement, setAgreement] = useState<any>(null)
  const [versions, setVersions] = useState<any[]>([])
  const [selectedVersion, setSelectedVersion] = useState<string>('current')
  const [hasAgreed, setHasAgreed] = useState(false)

  useEffect(() => {
    loadUserAgreement()
    loadVersions()
    checkAgreementStatus()
  }, [])

  const loadUserAgreement = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/compliance/user-agreement')
      setAgreement(response.data)
    } catch (error) {
      console.error('加载用户协议失败', error)
    } finally {
      setLoading(false)
    }
  }

  const loadVersions = async () => {
    try {
      const response = await apiClient.get('/compliance/user-agreement/history')
      setVersions(response.data)
    } catch (error) {
      console.error('加载版本历史失败', error)
    }
  }

  const checkAgreementStatus = async () => {
    // TODO: 检查用户是否已同意协议
    setHasAgreed(true)
  }

  const handleAgree = async () => {
    try {
      await apiClient.post('/compliance/agree')
      setHasAgreed(true)
      // message.success('已同意用户协议')
    } catch (error) {
      console.error('同意协议失败', error)
    }
  }

  const handleVersionChange = async (version: string) => {
    setSelectedVersion(version)
    if (version === 'current') {
      loadUserAgreement()
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
        title="用户协议"
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
          description="请仔细阅读用户协议，点击"同意"表示您接受协议的所有条款。"
          type="warning"
          showIcon
          className="mb-6"
        />

        {agreement && (
          <div>
            <div className="mb-6">
              <Title level={4}>版本信息</Title>
              <Paragraph>
                <strong>版本号：</strong>{agreement.version}<br />
                <strong>生效日期：</strong>{new Date(agreement.effectiveDate).toLocaleDateString()}<br />
                <strong>更新日期：</strong>{new Date(agreement.updatedAt).toLocaleDateString()}
              </Paragraph>
            </div>

            <div className="prose max-w-none">
              <Title level={5}>一、服务说明</Title>
              <Paragraph>
                本系统为四川道达智能车辆制造有限公司提供的 CRM 客户关系管理系统，
                专为电动观光车行业设计，帮助您高效管理客户和销售流程。
              </Paragraph>

              <Title level={5}>二、用户义务</Title>
              <Paragraph>
                使用本服务，您同意：
              </Paragraph>
              <ul>
                <li>提供真实、准确的个人信息</li>
                <li>妥善保管账户凭证</li>
                <li>不从事任何违法违规活动</li>
                <li>不侵犯他人合法权益</li>
              </ul>

              <Title level={5}>三、服务内容</Title>
              <Paragraph>
                我们提供以下服务：
              </Paragraph>
              <ul>
                <li>客户管理：完整记录客户信息和跟进记录</li>
                <li>销售管理：从线索到订单的全流程跟踪</li>
                <li>数据分析：多维度数据报表和可视化展示</li>
                <li>智能推荐：AI 驱动的销售机会推荐</li>
              </ul>

              <Title level={5}>四、免责声明</Title>
              <Paragraph>
                在以下情况下，我们不承担责任：
              </Paragraph>
              <ul>
                <li>不可抗力导致的服务中断</li>
                <li>用户操作不当导致的数据丢失</li>
                <li>第三方服务导致的问题</li>
                <li>法律法规允许的其他情形</li>
              </ul>

              <Title level={5}>五、协议变更</Title>
              <Paragraph>
                我们可能不时更新本协议。更新后的协议将在网站上公布，
                继续使用服务视为您接受更新后的协议。
              </Paragraph>

              <Title level={5}>六、联系我们</Title>
              <Paragraph>
                如您对本协议有任何疑问，请通过以下方式联系我们：
              </Paragraph>
              <ul>
                <li>邮箱：legal@daoda-auto.com</li>
                <li>电话：400-XXX-XXXX</li>
                <li>地址：四川省眉山市 XX 区 XX 路 XX 号</li>
              </ul>
            </div>

            {!hasAgreed && (
              <div className="mt-8 flex items-center gap-4">
                <Checkbox
                  checked={hasAgreed}
                  onChange={(e) => setHasAgreed(e.target.checked)}
                >
                  我已阅读并同意用户协议
                </Checkbox>
                <Button
                  type="primary"
                  onClick={handleAgree}
                  disabled={!hasAgreed}
                >
                  同意并继续
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

export default UserAgreement
