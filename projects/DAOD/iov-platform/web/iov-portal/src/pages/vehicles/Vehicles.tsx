/**
 * 车辆管理
 */
import { Card, Table, Input, Select, Button, Tag, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

export default function Vehicles() {
  const columns = [
    { title: '车牌号', dataIndex: 'vehicleNo', key: 'vehicleNo', width: 100 },
    { title: '车辆类型', dataIndex: 'vehicleType', key: 'vehicleType', width: 100 },
    { title: '终端号', dataIndex: 'terminalId', key: 'terminalId', width: 140 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (s: string) => <Tag color={s === 'active' ? 'success' : 'default'}>{s === 'active' ? '运营中' : '停运'}</Tag> },
    { title: '所属租户', dataIndex: 'tenant', key: 'tenant', width: 120 },
    { title: '当前位置', dataIndex: 'location', key: 'location', ellipsis: true },
    { title: '接入时间', dataIndex: 'accessTime', key: 'accessTime', width: 160 },
  ]
  
  const mockData = [
    { key: '1', vehicleNo: '川A12345', vehicleType: '观光车', terminalId: '13800001111', status: 'active', tenant: '成都景区', location: '成都市高新区', accessTime: '2026-01-15 10:30' },
    { key: '2', vehicleNo: '川B67890', vehicleType: '观光车', terminalId: '13800002222', status: 'active', tenant: '眉山景区', location: '眉山市东坡区', accessTime: '2026-01-16 14:20' },
  ]
  
  return (
    <Card className="daoda-card" title="车辆管理">
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="搜索车牌号" style={{ width: 200 }} />
        <Select placeholder="状态" style={{ width: 100 }} options={[{ label: '运营中', value: 'active' }, { label: '停运', value: 'inactive' }]} allowClear />
        <Button icon={<ReloadOutlined />}>刷新</Button>
      </Space>
      <Table columns={columns} dataSource={mockData} pagination={{ showTotal: (t) => `共 ${t} 条` }} />
    </Card>
  )
}