/**
 * 帮助中心组件
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState } from 'react'
import { Modal, Input, Collapse, Button } from 'antd'
import { QuestionCircleOutlined, BookOutlined, VideoCameraOutlined, CustomerServiceOutlined } from '@ant-design/icons'

const { Search } = Input
const { Panel } = Collapse

interface FAQ {
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    category: '客户管理',
    question: '如何新建客户？',
    answer: '点击客户管理页面右上角的"新建客户"按钮，填写客户信息后保存即可。'
  },
  {
    category: '客户管理',
    question: '如何导入客户？',
    answer: '在客户列表页面，点击"导入"按钮，下载模板后填写数据，然后上传 Excel 文件即可。'
  },
  {
    category: '工单管理',
    question: '如何创建工单？',
    answer: '点击工单管理页面右上角的"新建工单"按钮，选择工单类型，填写客户信息和问题描述后提交。'
  },
  {
    category: '工单管理',
    question: '如何分配工单？',
    answer: '售后主管可以在"工单分配"页面选择待分配的工单，然后选择服务人员进行分配。'
  },
  {
    category: '审批流程',
    question: '如何提交审批？',
    answer: '在需要审批的页面（如合同、采购单），填写完成后点击"提交审批"按钮，选择审批流程即可。'
  },
  {
    category: '系统设置',
    question: '如何修改个人信息？',
    answer: '点击右上角头像，选择"个人设置"，可以修改个人信息、密码和通知设置。'
  }
]

interface HelpCenterProps {
  open: boolean
  onClose: () => void
}

export default function HelpCenter({ open, onClose }: HelpCenterProps) {
  const [searchValue, setSearchValue] = useState('')
  const [activeKey, setActiveKey] = useState<string[]>([])

  // 搜索 FAQ
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchValue.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchValue.toLowerCase())
  )

  // 按分类分组
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {} as Record<string, FAQ[]>)

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOutlined />
          帮助中心
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div style={{ marginBottom: 24 }}>
        <Search
          placeholder="搜索帮助文档"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          size="large"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <Button
          icon={<QuestionCircleOutlined />}
          block
          onClick={() => setActiveKey(Object.keys(groupedFaqs))}
        >
          常见问题
        </Button>
        <Button
          icon={<BookOutlined />}
          block
          onClick={() => window.open('/docs/user-manual')}
        >
          用户手册
        </Button>
        <Button
          icon={<VideoCameraOutlined />}
          block
          onClick={() => window.open('/docs/video-tutorials')}
        >
          视频教程
        </Button>
      </div>

      <Collapse
        activeKey={activeKey}
        onChange={(keys) => setActiveKey(keys as string[])}
        accordion
      >
        {Object.entries(groupedFaqs).map(([category, faqs]) => (
          <Panel header={`${category} (${faqs.length})`} key={category}>
            {faqs.map((faq, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 500, marginBottom: 8, color: '#1890FF' }}>
                  Q: {faq.question}
                </div>
                <div style={{ color: '#666', lineHeight: 1.6 }}>
                  A: {faq.answer}
                </div>
              </div>
            ))}
          </Panel>
        ))}
      </Collapse>

      <div style={{ marginTop: 24, textAlign: 'center', padding: 16, background: '#F5F7FA', borderRadius: 8 }}>
        <div style={{ marginBottom: 12 }}>
          <CustomerServiceOutlined style={{ fontSize: 24, color: '#1890FF' }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          需要更多帮助？
        </div>
        <Button type="primary" onClick={() => window.open('/feedback')}>
          联系我们
        </Button>
      </div>
    </Modal>
  )
}
