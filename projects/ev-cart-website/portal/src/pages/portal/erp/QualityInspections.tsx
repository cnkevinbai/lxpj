import { Table, Button, Space, Tag } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'
import PageHeaderWrapper from '@shared/components/PageHeaderWrapper'

const QualityInspections = () => {
  const columns = [
    {
      title: '检验单号',
      dataIndex: 'inspection_number',
      key: 'inspection_number',
    },
    {
      title: '检验类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          IQC: 'blue',
          IPQC: 'green',
          FQC: 'orange',
          OQC: 'purple',
        }
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>
      },
    },
    {
      title: '检验结果',
      dataIndex: 'result',
      key: 'result',
      render: (result: string) => {
        const colorMap: Record<string, string> = {
          pass: 'green',
          fail: 'red',
          pending: 'orange',
        }
        return <Tag color={colorMap[result] || 'default'}>{result}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
        </Space>
      ),
    },
  ]

  return (
    <PageHeaderWrapper
      title="质量管理"
      subtitle="来料检验、过程检验、成品质检"
      extra={<Button type="primary" icon={<PlusOutlined />}>新建检验单</Button>}
    >
      <Table columns={columns} dataSource={[]} rowKey="id" />
    </PageHeaderWrapper>
  )
}

export default QualityInspections
