import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Input, Select, Modal, Form, message, Card, Badge, Upload } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { RcFile } from 'antd/lib/upload'

interface Resume {
  id: string
  resumeCode: string
  candidateName: string
  phone: string
  email: string
  education: string
  major: string
  experience: string
  currentCompany: string
  position: string
  expectedSalary: string
  jobId: string
  job: {
    id: string
    title: string
  }
  status: string
  source: string
  resumeUrl: string
  appliedAt: string
}

const Resumes: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>()
  const [importVisible, setImportVisible] = useState(false)

  const statusColors: Record<string, string> = {
    new: 'processing',
    screening: 'processing',
    interview: 'warning',
    offer: 'success',
    rejected: 'error',
    hired: 'success',
  }

  const statusLabels: Record<string, string> = {
    new: '新简历',
    screening: '筛选中',
    interview: '面试中',
    offer: '已发 Offer',
    rejected: '已拒绝',
    hired: '已入职',
  }

  // 获取简历列表
  const fetchResumes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (searchText) params.append('search', searchText)
      if (filterStatus) params.append('status', filterStatus)

      const response = await fetch(`/api/v1/resumes?${params}`)
      const data = await response.json()
      setResumes(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      message.error('加载简历列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [page, limit, filterStatus])

  // 更新简历状态
  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/v1/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      message.success('更新成功')
      fetchResumes()
    } catch (error) {
      message.error('更新失败')
    }
  }

  const columns: ColumnsType<Resume> = [
    {
      title: '简历编号',
      dataIndex: 'resumeCode',
      key: 'resumeCode',
      width: 120,
    },
    {
      title: '候选人',
      dataIndex: 'candidateName',
      key: 'candidateName',
      width: 100,
      render: (text) => <strong>{text}</strong>,
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
      title: '专业',
      dataIndex: 'major',
      key: 'major',
      width: 100,
    },
    {
      title: '工作经验',
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
      title: '应聘职位',
      key: 'job',
      width: 150,
      render: (_, record) => record.job?.title || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
          status={statusColors[status] || 'default'}
          text={statusLabels[status] || status}
        />
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source) => ({
        website: '官网',
        zhilian: '智联',
      }[source] || source),
    },
    {
      title: '申请时间',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => window.open(`/resumes/${record.id}`)}
            >
              查看
            </Button>
            <Button
              type="link"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => window.open(record.resumeUrl, '_blank')}
            >
              下载
            </Button>
          </Space>
          <Space size="small">
            <Select
              size="small"
              value={record.status}
              style={{ width: 100 }}
              onChange={(value) => updateStatus(record.id, value)}
              options={[
                { label: '新简历', value: 'new' },
                { label: '筛选中', value: 'screening' },
                { label: '面试中', value: 'interview' },
                { label: '已发 Offer', value: 'offer' },
                { label: '已拒绝', value: 'rejected' },
                { label: '已入职', value: 'hired' },
              ]}
            />
          </Space>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索候选人姓名/公司"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={fetchResumes}
          />
          <Select
            placeholder="简历状态"
            style={{ width: 120 }}
            allowClear
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: '新简历', value: 'new' },
              { label: '筛选中', value: 'screening' },
              { label: '面试中', value: 'interview' },
              { label: '已发 Offer', value: 'offer' },
              { label: '已拒绝', value: 'rejected' },
              { label: '已入职', value: 'hired' },
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={fetchResumes}>
            查询
          </Button>
          <Button
            icon={<UploadOutlined />}
            onClick={() => setImportVisible(true)}
          >
            导入简历
          </Button>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={resumes}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPage(page)
            setLimit(pageSize || 20)
          },
        }}
        scroll={{ x: 1600 }}
      />

      {/* 导入简历弹窗 */}
      <Modal
        title="导入简历"
        open={importVisible}
        onCancel={() => setImportVisible(false)}
        footer={null}
      >
        <Upload.Dragger
          name="file"
          multiple={true}
          accept=".pdf,.doc,.docx"
          action="/api/v1/resumes/import"
          onChange={(info) => {
            if (info.file.status === 'done') {
              message.success(`${info.file.name} 上传成功`)
              fetchResumes()
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 上传失败`)
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">支持 PDF、Word 格式，单次可上传多个文件</p>
        </Upload.Dragger>
      </Modal>
    </div>
  )
}

export default Resumes
