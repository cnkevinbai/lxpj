/**
 * 轨迹回放页面
 * 
 * @author daod-team
 */

import React, { useState, useEffect } from 'react';
import { Card, Form, DatePicker, Select, Button, Space, Slider, Progress, Table, Tag } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, FastForwardOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/common';
import { useNotification } from '@/hooks';
import type { TrajectoryPoint, Vehicle } from '@/types';

const { RangePicker } = DatePicker;

const TrajectoryPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const notification = useNotification();

  // 播放控制
  useEffect(() => {
    if (playing && currentIndex < trajectory.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1000 / speed);
      return () => clearTimeout(timer);
    } else if (currentIndex >= trajectory.length - 1) {
      setPlaying(false);
    }
  }, [playing, currentIndex, speed, trajectory.length]);

  const handleSearch = async (values: any) => {
    setLoading(true);
    try {
      // 调用轨迹查询接口
      // const result = await trajectoryApi.query(values);
      // setTrajectory(result);
      
      // 模拟数据
      setTrajectory([]);
      notification.info('轨迹查询', '暂无轨迹数据');
    } catch (error) {
      notification.error('查询失败', '轨迹数据获取失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (trajectory.length === 0) return;
    setPlaying(!playing);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setPlaying(false);
  };

  const progress = trajectory.length > 0 
    ? Math.round((currentIndex / (trajectory.length - 1)) * 100) 
    : 0;

  return (
    <div className="trajectory-page">
      <PageHeader 
        title="轨迹回放" 
        subtitle="查看车辆历史行驶轨迹"
      />
      
      <Card title="查询条件" style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item name="vehicleId" label="车辆" rules={[{ required: true }]}>
            <Select 
              placeholder="请选择车辆" 
              style={{ width: 200 }}
              showSearch
              filterOption={(input, option) =>
                ((option as any)?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[] as { value: string; label: string }[]}
            />
          </Form.Item>
          <Form.Item name="timeRange" label="时间范围" rules={[{ required: true }]}>
            <RangePicker showTime />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button onClick={() => form.resetFields()}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {trajectory.length > 0 && (
        <>
          <Card title="轨迹地图" style={{ marginBottom: 16 }}>
            <div style={{ height: 400, background: '#f5f5f5', marginBottom: 16 }}>
              {/* 地图组件 */}
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                地图区域 - 显示轨迹
              </div>
            </div>
            
            {/* 播放控制 */}
            <div style={{ padding: '16px 0' }}>
              <Space size="large" align="center">
                <Button 
                  type="primary" 
                  icon={playing ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={handlePlay}
                >
                  {playing ? '暂停' : '播放'}
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                <span>播放速度:</span>
                <Slider 
                  style={{ width: 100 }}
                  min={0.5} 
                  max={4} 
                  step={0.5} 
                  value={speed}
                  onChange={setSpeed}
                  marks={{ 1: '1x', 2: '2x', 4: '4x' }}
                />
              </Space>
              
              <div style={{ marginTop: 16 }}>
                <Progress percent={progress} status="active" />
              </div>
            </div>
          </Card>

          <Card title="轨迹详情">
            <Table 
              dataSource={trajectory.slice(currentIndex, currentIndex + 10)}
              rowKey="time"
              pagination={false}
              columns={[
                { title: '时间', dataIndex: 'time', key: 'time' },
                { 
                  title: '位置', 
                  key: 'location',
                  render: (_, record) => (
                    <span>{record.location?.lat?.toFixed(4)}, {record.location?.lng?.toFixed(4)}</span>
                  )
                },
                { title: '速度(km/h)', dataIndex: 'speed', key: 'speed' },
                { title: '方向(°)', dataIndex: 'direction', key: 'direction' },
                { title: '里程(km)', dataIndex: 'mileage', key: 'mileage' },
              ]}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default TrajectoryPage;