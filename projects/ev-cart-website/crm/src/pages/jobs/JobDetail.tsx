import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Descriptions, Card, Tabs, Table, Tag, Button, Space, Timeline, message, Badge } from 'antd'
import { EditOutlined, BackwardOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Job {
  id: string
  jobCode: string
  title: string
  department: string
  location: string
  jobType: string
  experience: string
  education: string
  salaryMin: number
  salaryMax: number
  headcount: number
  description: string
  requirements: string
  benefits: string
  status: string
  publishedAt: string
  createdAt: string
}

interface Resume {
  id: string
  candidateName: string
  phone: string
  email: string
  education: string
  experience: string
  currentCompany: string
  position: string
  status: string
  appliedAt: string
}

interface Interview {
  id: string
  candidateName: string
  interviewType: string
  scheduledAt: string
  interviewer: string
  status: string
  feedback: string
}

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(false)

  const statusColors: Record<string, string> = {
    draft: 'default',
    published: 'success',
    closed: 'error',
  }

  const statusLabels: Record<string, string> = {
    draft: '草稿',
    published: '招聘中',
    closed: '已关闭',
  }

  // 获取职位详情
  const fetchJob = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/jobs/${id}`)
      const data = await response.json()
      setJob(data)
    } catch (error) {
      message.error('加载职位详情失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取简历列表
  const fetchResumes = async () => {
    try {
      const response = await fetch(`/api/v1/resumes?jobId=${id}&limit=10`)
      const data = await response.json()
      setResumes(data.data || [])
    } catch (error) {
      console.error('加载简历失败', error)
    }
  }

  // 获取面试列表
  const fetchInterviews = async () => {
    try {
      const response = await fetch(`/api/v1/interviews?jobId=${id}&limit=10`)
      const data = await response.json()
      setInterviews(data.data || [])
    } catch (error) {
      console.error('加载面试失败', error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchJob()
      fetchResumes()
      fetchInterviews()
    }
  }, [id])

  if (!job) return <div>加载中...</div>

  const resumeColumns: ColumnsType<Resume> = [
    {
      title: '候选人',
      dataIndex: 'candidateName',
      key: 'candidateName',
      width: 120,
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.phone}</div>
          <small style={{ color: '#999' }}>{record.email}</small>
        </div>
      ),
    },
    {
      title: '学历',
      dataIndex: 'education',
      key: 'education',
      width: 80,
    },
    {
      title: '经验',
      dataIndex: 'experience',
      key: 'experience',
      width: 80,
    },
    {
      title: '当前公司',
      dataIndex: 'currentCompany',
      key: 'currentCompany',
      width: 150,
    },
    {
      title: '当前职位',
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Badge
          status={{
            new: 'processing',
            screening: 'processing',
            interview: 'warning',
            offer: 'success',
            rejected: 'error',
          }[status] || 'default'}
          text={{
            new: '新简历',
            screening: '筛选中',
            interview: '面试中',
            offer: '已发 Offer',
            rejected: '已拒绝',
          }[status] || status}
        />
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ]

  const interviewColumns: ColumnsType<Interview> = [
    {
      title: '候选人',
      dataIndex: 'candidateName',
      key: 'candidateName',
      width: 120,
    },
    {
      title: '面试类型',
      dataIndex: 'interviewType',
      key: 'interviewType',
      width: 100,
      render: (type) => ({
        phone: '电话面试',
        video: '视频面试',
        onsite: '现场面试',
      }[type] || type),
    },
    {
      title: '面试时间',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      width: 150,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: '面试官',
      dataIndex: 'interviewer',
      key: 'interviewer',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => ({
        scheduled: '待面试',
        completed: '已完成',
        cancelled: '已取消',
      }[status] || status),
    },
    {
      title: '面试反馈',
      dataIndex: 'feedback',
      key: 'feedback',
      width: 200,
      ellipsis: true,
    },
  ]

  return (
    <div>
      {/* 头部操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<BackwardOutlined />} onClick={() => navigate('/jobs')}>
            返回列表
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/jobs/${id}/edit`)}
          >
            编辑职位
          </Button>
        </Space>
      </Card>

      <Tabs
        items={[
          {
            key: 'info',
            label: '职位信息',
            children: (
              <Card>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="职位编码">{job.jobCode}</Descriptions.Item>
                  <Descriptions.Item label="发布状态">
                    <Tag color={statusColors[job.status]}>{statusLabels[job.status]}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="职位名称">{job.title}</Descriptions.Item>
                  <Descriptions.Item label="所属部门">{job.department}</Descriptions.Item>
                  <Descriptions.Item label="工作地点">{job.location}</Descriptions.Item>
                  <Descriptions.Item label="职位类型">
                    {{
                      full_time: '全职',
                      part_time: '兼职',
                      intern: '实习',
                      contract: '合同',
                    }[job.jobType] || job.jobType}
                  </Descriptions.Item>
                  <Descriptions.Item label="经验要求">{job.experience}</Descriptions.Item>
                  <Descriptions.Item label="学历要求">{job.education}</Descriptions.Item>
                  <Descriptions.Item label="薪资范围">
                    ¥{job.salaryMin?.toLocaleString()} - ¥{job.salaryMax?.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="招聘人数">{job.headcount}人</Descriptions.Item>
                  <Descriptions.Item label="发布日期" span={2}>
                    {job.publishedAt ? new Date(job.publishedAt).toLocaleDateString() : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="岗位职责" span={2}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{job.description}</div>
                  </Descriptions.Item>
                  <Descriptions.Item label="任职要求" span={2}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{job.requirements}</div>
                  </Descriptions.Item>
                  <Descriptions.Item label="福利待遇" span={2}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{job.benefits}</div>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            ),
          },
          {
            key: 'resumes',
            label: `收到的简历 (${resumes.length})`,
            children: (
              <Card>
                <Table
                  columns={resumeColumns}
                  dataSource={resumes}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'interviews',
            label: `面试安排 (${interviews.length})`,
            children: (
              <Card>
                <Table
                  columns={interviewColumns}
                  dataSource={interviews}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'timeline',
            label: '招聘进度',
            children: (
              <Card>
                <Timeline>
                  <Timeline.Item color="green">
                    职位创建 - {new Date(job.createdAt).toLocaleDateString()}
                  </Timeline.Item>
                  {job.publishedAt && (
                    <Timeline.Item color="blue">
                      职位发布 - {new Date(job.publishedAt).toLocaleDateString()}
                    </Timeline.Item>
                  )}
                  <Timeline.Item color="purple">
                    收到简历 - {resumes.length}份
                  </Timeline.Item>
                  <Timeline.Item color="orange">
                    面试进行中 - {interviews.filter(i => i.status === 'scheduled').length}人
                  </Timeline.Item>
                </Timeline>
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}

export default JobDetail
