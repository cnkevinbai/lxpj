/**
 * 报表统计页面
 * 
 * @author daod-team
 */

import React, { useState } from 'react';
import { Card, Row, Col, DatePicker, Select, Button, Space, Statistic, Table } from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/common';

const { RangePicker } = DatePicker;

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const statistics = [
    { title: '总行驶里程', value: 125680, suffix: 'km' },
    { title: '平均速度', value: 45.6, suffix: 'km/h' },
    { title: '告警次数', value: 128, suffix: '次' },
    { title: '在线率', value: 92.5, suffix: '%' },
  ];

  const mileageColumns = [
    { title: '车牌号', dataIndex: 'plateNo', key: 'plateNo' },
    { title: '里程(km)', dataIndex: 'mileage', key: 'mileage' },
    { title: '时长(h)', dataIndex: 'duration', key: 'duration' },
    { title: '平均速度(km/h)', dataIndex: 'avgSpeed', key: 'avgSpeed' },
    { title: '最高速度(km/h)', dataIndex: 'maxSpeed', key: 'maxSpeed' },
  ];

  const alarmColumns = [
    { title: '告警类型', dataIndex: 'type', key: 'type' },
    { title: '告警次数', dataIndex: 'count', key: 'count' },
    { title: '占比', dataIndex: 'percent', key: 'percent' },
    { title: '处理率', dataIndex: 'handleRate', key: 'handleRate' },
  ];

  return (
    <div className="reports-page">
      <PageHeader 
        title="报表统计" 
        subtitle="查看运营数据统计报表"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button type="primary" icon={<DownloadOutlined />}>导出报表</Button>
          </Space>
        }
      />

      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>时间范围:</span>
          <RangePicker />
          <span>车辆:</span>
          <Select style={{ width: 200 }} placeholder="全部车辆" allowClear options={[]} />
          <Button type="primary">查询</Button>
        </Space>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        {statistics.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic 
                title={stat.title} 
                value={stat.value} 
                suffix={stat.suffix}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="里程统计">
            <Table 
              columns={mileageColumns}
              dataSource={[]}
              rowKey="plateNo"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="告警统计">
            <Table 
              columns={alarmColumns}
              dataSource={[]}
              rowKey="type"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportsPage;