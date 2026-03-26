/**
 * 车辆管理页面 (完善版)
 * 
 * @author daod-team
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Tag, Input, Select, 
  Modal, Form, Descriptions, Badge, Progress, message 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  EyeOutlined, EnvironmentOutlined, ReloadOutlined 
} from '@ant-design/icons';
import { PageHeader, SearchBar, StatusTag } from '@/components/common';
import { useVehicles, getVehicleStatusInfo } from '@/hooks/useVehicle';
import type { Vehicle, VehicleStatus } from '@/types';

const VehicleListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      // 模拟数据
      setVehicles([
        {
          id: '1',
          vehicleId: 'V001',
          vehicleNo: '粤A12345',
          vehicleType: '轿车',
          brand: '比亚迪',
          model: '秦PLUS',
          color: '白色',
          status: 'running',
          terminalId: 'T001',
          location: { lat: 30.123, lng: 103.456 },
          speed: 45,
          batteryLevel: 78,
          mileage: 12500,
          createTime: '2026-03-01 10:00:00',
        },
        {
          id: '2',
          vehicleId: 'V002',
          vehicleNo: '粤A67890',
          vehicleType: 'SUV',
          brand: '特斯拉',
          model: 'Model Y',
          color: '黑色',
          status: 'charging',
          terminalId: 'T002',
          location: { lat: 30.234, lng: 103.567 },
          batteryLevel: 45,
          mileage: 8900,
          createTime: '2026-03-05 14:00:00',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record: Vehicle) => {
    setCurrentVehicle(record);
    setDetailVisible(true);
  };

  const handleRefresh = () => {
    loadVehicles();
    message.success('数据已刷新');
  };

  const getStatusTag = (status: VehicleStatus) => {
    const info = getVehicleStatusInfo(status);
    return <Tag color={info.color}>{info.text}</Tag>;
  };

  const columns = [
    { 
      title: '车牌号', 
      dataIndex: 'vehicleNo', 
      key: 'vehicleNo',
      render: (text: string) => <a onClick={() => handleView(vehicles.find(v => v.vehicleNo === text)!)}>{text}</a>
    },
    { title: '品牌型号', key: 'brandModel', render: (_: any, r: Vehicle) => `${r.brand} ${r.model}` },
    { title: '车辆类型', dataIndex: 'vehicleType', key: 'vehicleType' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: VehicleStatus) => getStatusTag(status)
    },
    { title: '终端ID', dataIndex: 'terminalId', key: 'terminalId' },
    { 
      title: '电量', 
      dataIndex: 'batteryLevel', 
      key: 'batteryLevel',
      render: (level: number) => (
        <Progress 
          percent={level} 
          size="small" 
          status={level < 20 ? 'exception' : 'active'}
          format={(p) => `${p}%`}
        />
      )
    },
    { 
      title: '速度(km/h)', 
      dataIndex: 'speed', 
      key: 'speed',
      render: (speed: number) => speed || '-'
    },
    { title: '里程(km)', dataIndex: 'mileage', key: 'mileage' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Vehicle) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EnvironmentOutlined />}>
            定位
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="vehicle-list-page">
      <PageHeader 
        title="车辆管理" 
        subtitle="管理车辆信息和状态"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />}>新增车辆</Button>
          </Space>
        }
      />

      <Card>
        <SearchBar 
          fields={[
            { name: 'keyword', label: '关键字', type: 'input' },
            { name: 'status', label: '状态', type: 'select', options: [
              { label: '全部', value: '' },
              { label: '行驶中', value: 'running' },
              { label: '停止', value: 'stopped' },
              { label: '充电中', value: 'charging' },
              { label: '离线', value: 'offline' },
            ]},
            { name: 'vehicleType', label: '车辆类型', type: 'select', options: [
              { label: '全部', value: '' },
              { label: '轿车', value: '轿车' },
              { label: 'SUV', value: 'SUV' },
              { label: 'MPV', value: 'MPV' },
            ]},
          ]}
          onSearch={(values) => console.log('search:', values)}
        />
        
        <Table 
          columns={columns}
          dataSource={vehicles}
          rowKey="id"
          loading={loading}
          pagination={{
            total: vehicles.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 辆`,
          }}
        />
      </Card>

      <Modal
        title="车辆详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {currentVehicle && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="车牌号">{currentVehicle.vehicleNo}</Descriptions.Item>
            <Descriptions.Item label="车辆ID">{currentVehicle.vehicleId}</Descriptions.Item>
            <Descriptions.Item label="品牌">{currentVehicle.brand}</Descriptions.Item>
            <Descriptions.Item label="型号">{currentVehicle.model}</Descriptions.Item>
            <Descriptions.Item label="车辆类型">{currentVehicle.vehicleType}</Descriptions.Item>
            <Descriptions.Item label="颜色">{currentVehicle.color}</Descriptions.Item>
            <Descriptions.Item label="状态">
              {getStatusTag(currentVehicle.status)}
            </Descriptions.Item>
            <Descriptions.Item label="终端ID">{currentVehicle.terminalId}</Descriptions.Item>
            <Descriptions.Item label="电量">{currentVehicle.batteryLevel}%</Descriptions.Item>
            <Descriptions.Item label="速度">{currentVehicle.speed || 0} km/h</Descriptions.Item>
            <Descriptions.Item label="里程">{currentVehicle.mileage} km</Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentVehicle.createTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default VehicleListPage;