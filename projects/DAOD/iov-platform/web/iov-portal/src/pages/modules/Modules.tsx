/**
 * 模块管理页面
 * 
 * @description 管理系统热插拔模块，展示所有后端模块状态
 * @author daod-team
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Tag, Badge, Drawer, Descriptions, 
  Modal, Upload, message, Switch, Tooltip, Progress, Typography 
} from 'antd';
import { 
  UploadOutlined, ReloadOutlined, EyeOutlined, 
  PlayCircleOutlined, PauseCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  SyncOutlined, ApiOutlined, AppstoreOutlined,
  SafetyOutlined, TeamOutlined, CloudOutlined,
  CarOutlined, ControlOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import type { Module } from '@/types';

const { Text } = Typography

// 后端模块完整列表
const backendModules: Module[] = [
  // 核心模块
  {
    id: '1',
    name: 'auth-service',
    version: '1.0.0',
    type: 'core',
    state: 'running',
    healthStatus: 'healthy',
    priority: 100,
    description: '认证授权服务 - JWT Token 验证、权限校验',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '2',
    name: 'user-service',
    version: '1.0.0',
    type: 'core',
    state: 'running',
    healthStatus: 'healthy',
    priority: 95,
    description: '用户服务 - 用户管理、个人中心',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '3',
    name: 'tenant-service',
    version: '1.0.0',
    type: 'core',
    state: 'running',
    healthStatus: 'healthy',
    priority: 90,
    description: '租户服务 - 多租户管理、租户配置',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '4',
    name: 'role-service',
    version: '1.0.0',
    type: 'core',
    state: 'running',
    healthStatus: 'healthy',
    priority: 85,
    description: '角色服务 - 角色管理、权限分配',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '5',
    name: 'sub-account-service',
    version: '1.0.0',
    type: 'core',
    state: 'running',
    healthStatus: 'healthy',
    priority: 80,
    description: '子账号服务 - 子账号管理、权限隔离',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  // 业务模块
  {
    id: '6',
    name: 'vehicle-access',
    version: '1.0.0',
    type: 'business',
    state: 'running',
    healthStatus: 'healthy',
    priority: 70,
    description: '车辆接入服务 - 终端注册、设备绑定、车辆认证',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '7',
    name: 'monitor-service',
    version: '1.0.0',
    type: 'business',
    state: 'running',
    healthStatus: 'healthy',
    priority: 70,
    description: '实时监控服务 - 位置监控、状态跟踪',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '8',
    name: 'vehicle-monitor-service',
    version: '1.0.0',
    type: 'business',
    state: 'running',
    healthStatus: 'healthy',
    priority: 65,
    description: '车辆监控服务 - 车辆状态、实时数据',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '9',
    name: 'alarm-service',
    version: '1.0.0',
    type: 'business',
    state: 'running',
    healthStatus: 'healthy',
    priority: 75,
    description: '告警服务 - 告警规则、告警处理、通知推送',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '10',
    name: 'ota-service',
    version: '1.0.0',
    type: 'business',
    state: 'running',
    healthStatus: 'healthy',
    priority: 50,
    description: 'OTA升级服务 - 固件管理、任务调度、进度监控',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '11',
    name: 'remote-control',
    version: '1.0.0',
    type: 'business',
    state: 'running',
    healthStatus: 'healthy',
    priority: 60,
    description: '远程控制服务 - 远程指令、锁车控制、参数下发',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '12',
    name: 'planning-service',
    version: '1.0.0',
    type: 'business',
    state: 'running',
    healthStatus: 'healthy',
    priority: 55,
    description: '智能规划服务 - 路径规划、行程规划、车队调度',
    createTime: '2026-03-25 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  // 适配器模块
  {
    id: '13',
    name: 'jtt808-adapter',
    version: '1.0.0',
    type: 'adapter',
    state: 'running',
    healthStatus: 'healthy',
    priority: 40,
    description: 'JT/T 808协议适配器 - 国标协议解析、设备通信',
    createTime: '2026-03-24 10:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '14',
    name: 'mqtt-adapter',
    version: '1.0.0',
    type: 'adapter',
    state: 'stopped',
    healthStatus: 'offline',
    priority: 30,
    description: 'MQTT协议适配器 - MQTT消息收发、Topic管理',
    createTime: '2026-03-25 11:00:00',
    updateTime: '2026-03-25 15:00:00',
  },
  // 边缘模块
  {
    id: '15',
    name: 'edge-gateway',
    version: '1.0.0',
    type: 'extension',
    state: 'running',
    healthStatus: 'healthy',
    priority: 25,
    description: '边缘网关 - 边缘计算、数据聚合、本地缓存',
    createTime: '2026-03-25 09:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
  {
    id: '16',
    name: 'edge-proxy',
    version: '1.0.0',
    type: 'extension',
    state: 'running',
    healthStatus: 'healthy',
    priority: 20,
    description: '边缘代理 - 协议转换、数据转发、断网续传',
    createTime: '2026-03-25 09:00:00',
    updateTime: '2026-03-25 18:00:00',
  },
]

const ModuleManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    setLoading(true);
    try {
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      setModules(backendModules);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record: Module) => {
    setCurrentModule(record);
    setDrawerVisible(true);
  };

  const handleToggle = (record: Module) => {
    const newState = record.state === 'running' ? 'stopped' : 'running';
    setModules(modules.map(m => 
      m.id === record.id 
        ? { ...m, state: newState, healthStatus: newState === 'running' ? 'healthy' : 'offline' }
        : m
    ));
    message.success(`${record.name} 已${newState === 'running' ? '启动' : '停止'}`);
  };

  const handleUpload = (file: File) => {
    message.success(`模块 ${file.name} 上传成功，正在安装...`);
    return false;
  };

  const getStateTag = (state: string) => {
    const stateConfig: Record<string, { color: string; text: string }> = {
      running: { color: 'success', text: '运行中' },
      stopped: { color: 'default', text: '已停止' },
      error: { color: 'error', text: '异常' },
      initialized: { color: 'processing', text: '初始化' },
    };
    const config = stateConfig[state] || { color: 'default', text: state };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getHealthBadge = (status: string) => {
    const statusConfig: Record<string, { status: 'success' | 'error' | 'warning' | 'default'; text: string }> = {
      healthy: { status: 'success', text: '健康' },
      unhealthy: { status: 'error', text: '异常' },
      unknown: { status: 'warning', text: '未知' },
      offline: { status: 'default', text: '离线' },
    };
    const config = statusConfig[status] || { status: 'default', text: status };
    return <Badge status={config.status} text={config.text} />;
  };

  const getTypeTag = (type: string) => {
    const config: Record<string, { color: string; text: string }> = {
      core: { color: 'blue', text: '核心模块' },
      business: { color: 'green', text: '业务模块' },
      adapter: { color: 'orange', text: '适配器' },
      extension: { color: 'purple', text: '扩展模块' },
    };
    const { color, text } = config[type] || { color: 'default', text: type };
    return <Tag color={color}>{text}</Tag>;
  };

  // 统计数据
  const stats = {
    total: modules.length,
    running: modules.filter(m => m.state === 'running').length,
    stopped: modules.filter(m => m.state === 'stopped').length,
    healthy: modules.filter(m => m.healthStatus === 'healthy').length,
  };

  const columns = [
    { 
      title: '模块名称', 
      dataIndex: 'name', 
      key: 'name',
      render: (name: string) => <Text code>{name}</Text>
    },
    { title: '版本', dataIndex: 'version', key: 'version', width: 80 },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type',
      width: 100,
      render: getTypeTag
    },
    { title: '状态', dataIndex: 'state', key: 'state', width: 100, render: getStateTag },
    { 
      title: '健康状态', 
      dataIndex: 'healthStatus', 
      key: 'healthStatus',
      width: 100,
      render: getHealthBadge
    },
    { title: '优先级', dataIndex: 'priority', key: 'priority', width: 80 },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Module) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            详情
          </Button>
          <Tooltip title={record.state === 'running' ? '停止模块' : '启动模块'}>
            <Switch
              size="small"
              checked={record.state === 'running'}
              onChange={() => handleToggle(record)}
              disabled={record.type === 'core'} // 核心模块不允许停止
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="module-manage-page">
      {/* 统计卡片 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Card size="small" style={{ width: 150 }}>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">总模块数</Text>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.total}</div>
          </div>
        </Card>
        <Card size="small" style={{ width: 150 }}>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">运行中</Text>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>{stats.running}</div>
          </div>
        </Card>
        <Card size="small" style={{ width: 150 }}>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">已停止</Text>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#999' }}>{stats.stopped}</div>
          </div>
        </Card>
        <Card size="small" style={{ width: 150 }}>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">健康率</Text>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
              {stats.total > 0 ? Math.round(stats.healthy / stats.total * 100) : 0}%
            </div>
          </div>
        </Card>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
          <Upload 
            accept=".jar,.zip"
            beforeUpload={handleUpload}
            showUploadList={false}
          >
            <Button type="primary" icon={<UploadOutlined />}>上传模块</Button>
          </Upload>
          <Button icon={<ReloadOutlined />} onClick={loadModules}>刷新</Button>
        </div>
      </div>

      {/* 模块列表 */}
      <Card>
        <Table 
          columns={columns}
          dataSource={modules}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 模块详情抽屉 */}
      <Drawer
        title={`模块详情 - ${currentModule?.name}`}
        placement="right"
        width={500}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {currentModule && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="模块名称">
              <Text code>{currentModule.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="版本">
              {currentModule.version}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {getTypeTag(currentModule.type)}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {getStateTag(currentModule.state)}
            </Descriptions.Item>
            <Descriptions.Item label="健康状态">
              {getHealthBadge(currentModule.healthStatus)}
            </Descriptions.Item>
            <Descriptions.Item label="优先级">
              {currentModule.priority}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {currentModule.createTime}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {currentModule.updateTime}
            </Descriptions.Item>
            <Descriptions.Item label="描述">
              {currentModule.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default ModuleManagePage;