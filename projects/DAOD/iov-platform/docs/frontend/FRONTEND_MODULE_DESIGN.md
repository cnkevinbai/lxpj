# 前端功能模块设计文档

**项目名称**: iov-portal (道达智能车辆管理平台)  
**版本**: 1.0.0  
**日期**: 2026-03-24  
**作者**: 渔晓白

---

## 1. 概述

### 1.1 设计原则

| 原则 | 说明 |
|------|------|
| **模块化** | 功能拆分为独立组件，支持复用 |
| **类型安全** | TypeScript 严格模式，完整类型定义 |
| **状态管理** | Zustand 集中式状态管理 |
| **响应式设计** | 支持桌面端和移动端适配 |
| **实时通信** | WebSocket 支持实时数据推送 |

### 1.2 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2.0 | UI 框架 |
| TypeScript | 5.3.2 | 类型系统 |
| Ant Design | 5.12.0 | UI 组件库 |
| Vite | 5.0.3 | 构建工具 |
| Zustand | 4.4.7 | 状态管理 |
| React Query | 5.x | 数据请求 |
| React Router | 6.x | 路由管理 |
| Leaflet | 1.9.4 | 地图组件 |
| ECharts | 5.x | 图表组件 |
| Socket.io | 4.x | WebSocket 客户端 |

---

## 2. 目录结构设计

```
iov-portal/
├── src/
│   ├── components/                 # 公共组件 ⬅️ 待开发
│   │   ├── common/                # 通用组件
│   │   │   ├── PageHeader/
│   │   │   ├── SearchBar/
│   │   │   ├── StatusTag/
│   │   │   └── EmptyState/
│   │   ├── terminal/              # 终端相关组件
│   │   │   ├── TerminalCard/
│   │   │   ├── TerminalStatusBadge/
│   │   │   └── TerminalSignalIcon/
│   │   ├── vehicle/               # 车辆相关组件
│   │   │   ├── VehicleCard/
│   │   │   └── VehicleStatusBadge/
│   │   ├── map/                   # 地图相关组件
│   │   │   ├── MapView/
│   │   │   ├── MapMarker/
│   │   │   └── MapCluster/
│   │   └── charts/                # 图表组件
│   │       ├── LineChart/
│   │       ├── BarChart/
│   │       └── PieChart/
│   │
│   ├── stores/                    # 状态管理 ⬅️ 待开发
│   │   ├── authStore.ts           # 认证状态
│   │   ├── terminalStore.ts       # 终端状态
│   │   ├── vehicleStore.ts        # 车辆状态
│   │   ├── alarmStore.ts          # 告警状态
│   │   ├── mapStore.ts            # 地图状态
│   │   └── settingsStore.ts       # 设置状态
│   │
│   ├── hooks/                     # 自定义 Hooks ⬅️ 待开发
│   │   ├── useWebSocket.ts        # WebSocket Hook
│   │   ├── useMap.ts              # 地图 Hook
│   │   ├── useTerminal.ts         # 终端 Hook
│   │   ├── useVehicle.ts          # 车辆 Hook
│   │   ├── useAlarm.ts            # 告警 Hook
│   │   └── useNotification.ts     # 通知 Hook
│   │
│   ├── utils/                     # 工具函数 ⬅️ 待开发
│   │   ├── request.ts             # 请求封装
│   │   ├── websocket.ts           # WebSocket 封装
│   │   ├── storage.ts             # 本地存储
│   │   ├── format.ts              # 格式化工具
│   │   ├── date.ts                # 日期工具
│   │   └── permission.ts          # 权限工具
│   │
│   ├── types/                     # 类型定义 ⬅️ 待开发
│   │   ├── terminal.ts            # 终端类型
│   │   ├── vehicle.ts             # 车辆类型
│   │   ├── alarm.ts               # 告警类型
│   │   ├── user.ts                # 用户类型
│   │   ├── api.ts                 # API 类型
│   │   └── websocket.ts           # WebSocket 类型
│   │
│   ├── pages/                     # 页面组件
│   │   ├── dashboard/             # ✅ 已实现
│   │   ├── terminals/             # ✅ 已实现
│   │   ├── vehicles/              # ⚠️ 部分实现
│   │   ├── map/                   # ✅ 已实现
│   │   ├── alarms/                # ✅ 已实现
│   │   ├── login/                 # ✅ 已实现
│   │   ├── settings/              # ❌ 待开发
│   │   ├── profile/               # ❌ 待开发
│   │   ├── reports/               # ❌ 待开发
│   │   ├── firmware/              # ❌ 待开发
│   │   ├── commands/              # ❌ 待开发
│   │   ├── trajectory/            # ❌ 待开发 (轨迹回放)
│   │   └── geofence/              # ❌ 待开发 (电子围栏)
│   │
│   └── services/                  # ✅ 已实现
│       ├── api.ts
│       ├── auth.ts
│       ├── dashboard.ts
│       └── terminal.ts
│
└── package.json
```

---

## 3. 待开发功能模块详细设计

### 3.1 公共组件模块 (components/)

#### 3.1.1 TerminalCard 组件

```typescript
// src/components/terminal/TerminalCard/index.tsx

interface TerminalCardProps {
  terminal: Terminal;
  onClick?: (terminal: Terminal) => void;
  onCommand?: (terminal: Terminal) => void;
  showActions?: boolean;
}

/**
 * 终端卡片组件
 * 
 * 功能：
 * - 显示终端基本信息 (终端号、车牌号、状态)
 * - 显示信号强度、位置、最后通信时间
 * - 支持点击查看详情
 * - 支持快捷操作按钮
 */
export function TerminalCard({ terminal, onClick, onCommand, showActions = true }: TerminalCardProps) {
  return (
    <Card className="terminal-card" hoverable onClick={() => onClick?.(terminal)}>
      <div className="terminal-header">
        <TerminalStatusBadge status={terminal.status} />
        <TerminalSignalIcon signal={terminal.signalStrength} />
      </div>
      <Descriptions column={1} size="small">
        <Descriptions.Item label="终端号">{terminal.terminalId}</Descriptions.Item>
        <Descriptions.Item label="车牌号">{terminal.vehicleNo}</Descriptions.Item>
        <Descriptions.Item label="位置">{terminal.location}</Descriptions.Item>
      </Descriptions>
      {showActions && (
        <div className="terminal-actions">
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small" onClick={() => onCommand?.(terminal)}>指令</Button>
        </div>
      )}
    </Card>
  );
}
```

#### 3.1.2 MapView 组件

```typescript
// src/components/map/MapView/index.tsx

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  terminals?: Terminal[];
  onMarkerClick?: (terminal: Terminal) => void;
  showCluster?: boolean;
  autoFitBounds?: boolean;
}

/**
 * 地图视图组件
 * 
 * 功能：
 * - 基于 Leaflet 封装
 * - 支持终端标记显示
 * - 支持聚合显示
 * - 支持自动定位
 * - 支持轨迹绘制
 */
export function MapView({ 
  center = [30.123456, 103.845678], 
  zoom = 11,
  terminals = [],
  onMarkerClick,
  showCluster = true,
  autoFitBounds = false
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  
  // 初始化地图
  useEffect(() => {
    mapRef.current = L.map('map-container').setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
    return () => mapRef.current?.remove();
  }, []);
  
  // 添加标记
  useEffect(() => {
    terminals.forEach(terminal => {
      const marker = L.circleMarker([terminal.lat, terminal.lng], {
        fillColor: getStatusColor(terminal.status),
        color: '#fff',
        radius: 8,
      }).addTo(mapRef.current!);
      
      marker.on('click', () => onMarkerClick?.(terminal));
    });
  }, [terminals]);
  
  return <div id="map-container" style={{ height: '100%', width: '100%' }} />;
}
```

---

### 3.2 状态管理模块 (stores/)

#### 3.2.1 authStore

```typescript
// src/stores/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      
      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        return user.permissions.includes('ALL') || user.permissions.includes(permission);
      },
    }),
    { name: 'auth-storage' }
  )
);
```

#### 3.2.2 terminalStore

```typescript
// src/stores/terminalStore.ts

import { create } from 'zustand';

interface TerminalState {
  terminals: Terminal[];
  selectedTerminal: Terminal | null;
  filters: {
    keyword?: string;
    status?: string;
  };
  
  // Actions
  setTerminals: (terminals: Terminal[]) => void;
  selectTerminal: (terminal: Terminal | null) => void;
  updateTerminal: (id: string, data: Partial<Terminal>) => void;
  setFilters: (filters: Partial<TerminalState['filters']>) => void;
  
  // Computed
  getOnlineCount: () => number;
  getOfflineCount: () => number;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  terminals: [],
  selectedTerminal: null,
  filters: {},
  
  setTerminals: (terminals) => set({ terminals }),
  
  selectTerminal: (terminal) => set({ selectedTerminal: terminal }),
  
  updateTerminal: (id, data) => set((state) => ({
    terminals: state.terminals.map(t => 
      t.id === id ? { ...t, ...data } : t
    )
  })),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  getOnlineCount: () => get().terminals.filter(t => t.status === 'online').length,
  
  getOfflineCount: () => get().terminals.filter(t => t.status === 'offline').length,
}));
```

---

### 3.3 自定义 Hooks 模块 (hooks/)

#### 3.3.1 useWebSocket

```typescript
// src/hooks/useWebSocket.ts

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketOptions {
  url: string;
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoConnect?: boolean;
}

interface WebSocketState {
  connected: boolean;
  error: Error | null;
}

/**
 * WebSocket Hook
 * 
 * 功能：
 * - 自动连接/重连
 * - 消息订阅
 * - 连接状态管理
 * - 心跳检测
 */
export function useWebSocket(options: WebSocketOptions) {
  const { url, onMessage, onConnect, onDisconnect, autoConnect = true } = options;
  
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    error: null,
  });
  
  useEffect(() => {
    if (!autoConnect) return;
    
    socketRef.current = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    socketRef.current.on('connect', () => {
      setState({ connected: true, error: null });
      onConnect?.();
    });
    
    socketRef.current.on('disconnect', () => {
      setState({ connected: false, error: null });
      onDisconnect?.();
    });
    
    socketRef.current.on('message', (data) => {
      onMessage?.(data);
    });
    
    socketRef.current.on('error', (error) => {
      setState({ connected: false, error });
    });
    
    return () => {
      socketRef.current?.disconnect();
    };
  }, [url, autoConnect]);
  
  const send = (event: string, data: any) => {
    socketRef.current?.emit(event, data);
  };
  
  const subscribe = (channel: string, callback: (data: any) => void) => {
    socketRef.current?.on(channel, callback);
    return () => socketRef.current?.off(channel, callback);
  };
  
  return {
    ...state,
    send,
    subscribe,
    socket: socketRef.current,
  };
}
```

#### 3.3.2 useTerminal

```typescript
// src/hooks/useTerminal.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTerminals, getTerminalDetail, sendCommand } from '@/services/terminal';
import { useWebSocket } from './useWebSocket';

/**
 * 终端管理 Hook
 * 
 * 功能：
 * - 终端列表查询
 * - 终端详情查询
 * - 指令下发
 * - 实时状态更新
 */
export function useTerminal(params?: { keyword?: string; status?: string }) {
  const queryClient = useQueryClient();
  
  // 终端列表
  const { data: terminals, isLoading } = useQuery({
    queryKey: ['terminals', params],
    queryFn: () => getTerminals(params),
    refetchInterval: 30000, // 30秒刷新
  });
  
  // WebSocket 实时更新
  useWebSocket({
    url: 'wss://api.daod.io/ws',
    onMessage: (data) => {
      if (data.type === 'terminal_status') {
        queryClient.invalidateQueries({ queryKey: ['terminals'] });
      }
    },
  });
  
  return {
    terminals: terminals?.list || [],
    total: terminals?.total || 0,
    isLoading,
  };
}

export function useTerminalDetail(id: string) {
  return useQuery({
    queryKey: ['terminal', id],
    queryFn: () => getTerminalDetail(id),
    enabled: !!id,
  });
}

export function useSendCommand() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ terminalId, command, params }: {
      terminalId: string;
      command: string;
      params: any;
    }) => sendCommand(terminalId, command, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminals'] });
    },
  });
}
```

---

### 3.4 待开发页面模块

#### 3.4.1 系统设置页面 (settings/)

```typescript
// src/pages/settings/Settings.tsx

/**
 * 系统设置页面
 * 
 * 功能模块：
 * - 基础设置：系统名称、Logo、主题配置
 * - 通知设置：邮件、短信、推送配置
 * - 安全设置：密码策略、登录限制、IP白名单
 * - 存储设置：文件存储、数据保留策略
 * - 日志设置：日志级别、日志保留
 */

interface SettingsPageProps {}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('basic');
  
  const tabs = [
    { key: 'basic', label: '基础设置', icon: <SettingOutlined /> },
    { key: 'notification', label: '通知设置', icon: <BellOutlined /> },
    { key: 'security', label: '安全设置', icon: <SafetyOutlined /> },
    { key: 'storage', label: '存储设置', icon: <DatabaseOutlined /> },
    { key: 'log', label: '日志设置', icon: <FileTextOutlined /> },
  ];
  
  return (
    <Card className="daoda-card">
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({
        key: tab.key,
        label: <span>{tab.icon} {tab.label}</span>,
        children: <SettingsPanel type={tab.key} />,
      }))} />
    </Card>
  );
}

// 基础设置面板
function BasicSettings() {
  const [form] = Form.useForm();
  
  return (
    <Form form={form} layout="vertical">
      <Form.Item name="systemName" label="系统名称">
        <Input placeholder="道达智能车辆管理平台" />
      </Form.Item>
      <Form.Item name="logo" label="系统Logo">
        <Upload>
          <Button icon={<UploadOutlined />}>上传Logo</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="theme" label="主题">
        <Radio.Group>
          <Radio.Button value="light">浅色</Radio.Button>
          <Radio.Button value="dark">深色</Radio.Button>
          <Radio.Button value="auto">跟随系统</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
}
```

#### 3.4.2 固件管理页面 (firmware/)

```typescript
// src/pages/firmware/Firmware.tsx

/**
 * 固件管理页面
 * 
 * 功能模块：
 * - 固件列表：版本、大小、状态、创建时间
 * - 固件上传：文件上传、版本信息、签名验证
 * - 版本分发：选择设备、分批推送
 * - 升级记录：升级历史、成功/失败统计
 */

export default function Firmware() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  const columns: ColumnsType<Firmware> = [
    { title: '版本号', dataIndex: 'version', key: 'version' },
    { title: '文件大小', dataIndex: 'size', key: 'size', render: (v) => `${(v / 1024 / 1024).toFixed(2)} MB` },
    { title: '设备型号', dataIndex: 'deviceModel', key: 'deviceModel' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    { title: '操作', key: 'action', render: (_, record) => (
      <Space>
        <Button type="link" size="small">分发</Button>
        <Button type="link" size="small">下载</Button>
        <Button type="link" size="small" danger>删除</Button>
      </Space>
    )},
  ];
  
  return (
    <div>
      <Card className="daoda-card" title="固件管理" extra={
        <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModalOpen(true)}>
          上传固件
        </Button>
      }>
        <Table columns={columns} dataSource={mockFirmware} />
      </Card>
      
      <FirmwareUploadModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </div>
  );
}

// 固件上传弹窗
function FirmwareUploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm();
  
  return (
    <Modal title="上传固件" open={open} onCancel={onClose} onOk={() => form.submit()}>
      <Form form={form} layout="vertical">
        <Form.Item name="version" label="版本号" rules={[{ required: true }]}>
          <Input placeholder="1.0.0" />
        </Form.Item>
        <Form.Item name="deviceModel" label="设备型号" rules={[{ required: true }]}>
          <Select options={[
            { label: 'DAOD-TBOX-001', value: 'DAOD-TBOX-001' },
            { label: 'DAOD-TBOX-002', value: 'DAOD-TBOX-002' },
          ]} />
        </Form.Item>
        <Form.Item name="file" label="固件文件" rules={[{ required: true }]}>
          <Upload.Dragger>
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">点击或拖拽文件到此区域</p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item name="description" label="更新说明">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
```

#### 3.4.3 指令管理页面 (commands/)

```typescript
// src/pages/commands/Commands.tsx

/**
 * 指令管理页面
 * 
 * 功能模块：
 * - 指令模板：预定义指令模板管理
 * - 批量指令：批量下发指令
 * - 指令记录：下发历史、执行状态
 * - 指令统计：成功率、响应时间
 */

export default function Commands() {
  const tabs = [
    { key: 'templates', label: '指令模板', children: <CommandTemplates /> },
    { key: 'batch', label: '批量指令', children: <BatchCommands /> },
    { key: 'history', label: '指令记录', children: <CommandHistory /> },
    { key: 'stats', label: '指令统计', children: <CommandStats /> },
  ];
  
  return (
    <Card className="daoda-card">
      <Tabs items={tabs} />
    </Card>
  );
}

// 指令模板
function CommandTemplates() {
  const templates = [
    { id: '1', name: '重启设备', command: 'REBOOT', params: '{}', description: '远程重启终端设备' },
    { id: '2', name: '查询位置', command: 'QUERY_LOCATION', params: '{}', description: '查询设备当前位置' },
    { id: '3', name: '参数设置', command: 'SET_PARAMS', params: '{"interval": 30}', description: '设置上报间隔' },
  ];
  
  return (
    <List
      dataSource={templates}
      renderItem={(item) => (
        <List.Item actions={[<Button type="link">编辑</Button>, <Button type="link" danger>删除</Button>]}>
          <List.Item.Meta
            title={item.name}
            description={item.description}
          />
          <Tag>{item.command}</Tag>
        </List.Item>
      )}
    />
  );
}
```

#### 3.4.4 轨迹回放页面 (trajectory/)

```typescript
// src/pages/trajectory/Trajectory.tsx

/**
 * 轨迹回放页面
 * 
 * 功能模块：
 * - 设备选择：选择要查看的终端
 * - 时间范围：选择时间区间
 * - 轨迹播放：地图上动态展示轨迹
 * - 播放控制：播放/暂停/快进/倍速
 * - 轨迹详情：速度、方向、位置信息
 */

export default function Trajectory() {
  const [selectedTerminal, setSelectedTerminal] = useState<string>();
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>();
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  return (
    <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 200px)' }}>
      {/* 控制面板 */}
      <Card className="daoda-card" style={{ width: 320 }}>
        <Form layout="vertical">
          <Form.Item label="选择终端">
            <TerminalSelect value={selectedTerminal} onChange={setSelectedTerminal} />
          </Form.Item>
          <Form.Item label="时间范围">
            <DatePicker.RangePicker 
              showTime 
              value={timeRange} 
              onChange={(v) => setTimeRange(v as any)} 
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block onClick={() => setPlaying(true)}>
              查询轨迹
            </Button>
          </Form.Item>
        </Form>
        
        {/* 播放控制 */}
        <div style={{ marginTop: 16 }}>
          <Slider defaultValue={0} />
          <Space>
            <Button icon={playing ? <PauseOutlined /> : <CaretRightOutlined />} onClick={() => setPlaying(!playing)} />
            <Select value={speed} onChange={setSpeed} style={{ width: 80 }}>
              <Select.Option value={1}>1x</Select.Option>
              <Select.Option value={2}>2x</Select.Option>
              <Select.Option value={4}>4x</Select.Option>
            </Select>
          </Space>
        </div>
      </Card>
      
      {/* 地图区域 */}
      <Card className="daoda-card" style={{ flex: 1 }} bodyStyle={{ padding: 0, height: '100%' }}>
        <MapView />
      </Card>
    </div>
  );
}
```

#### 3.4.5 电子围栏页面 (geofence/)

```typescript
// src/pages/geofence/Geofence.tsx

/**
 * 电子围栏页面
 * 
 * 功能模块：
 * - 围栏列表：已创建的围栏列表
 * - 围栏创建：在地图上绘制围栏
 * - 围栏编辑：修改围栏范围和属性
 * - 围栏绑定：绑定设备到围栏
 * - 告警规则：进出围栏告警配置
 */

export default function Geofence() {
  const [drawMode, setDrawMode] = useState<'circle' | 'polygon' | 'rectangle' | null>(null);
  
  return (
    <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 200px)' }}>
      {/* 围栏列表 */}
      <Card className="daoda-card" style={{ width: 320 }} title="围栏管理" extra={
        <Dropdown menu={{ items: [
          { key: 'circle', label: '圆形围栏', icon: <RadiusSettingOutlined /> },
          { key: 'polygon', label: '多边形围栏', icon: <BorderOutlined /> },
          { key: 'rectangle', label: '矩形围栏', icon: <BorderOuterOutlined /> },
        ] }} onClick={({ key }) => setDrawMode(key as any)}>
          <Button type="primary" icon={<PlusOutlined />}>新建围栏</Button>
        </Dropdown>
      }>
        <List
          dataSource={mockGeofences}
          renderItem={(item) => (
            <List.Item actions={[<Button type="link" size="small">编辑</Button>]}>
              <List.Item.Meta
                title={<span><Tag color={item.type === 'circle' ? 'blue' : 'green'}>{item.type === 'circle' ? '圆形' : '多边形'}</Tag> {item.name}</span>}
                description={`绑定设备: ${item.deviceCount} 台`}
              />
            </List.Item>
          )}
        />
      </Card>
      
      {/* 地图区域 */}
      <Card className="daoda-card" style={{ flex: 1 }} bodyStyle={{ padding: 0, height: '100%' }}>
        <MapView drawMode={drawMode} onDrawComplete={(geo) => {
          console.log('绘制完成:', geo);
          setDrawMode(null);
        }} />
      </Card>
    </div>
  );
}
```

#### 3.4.6 报表统计页面 (reports/)

```typescript
// src/pages/reports/Reports.tsx

/**
 * 报表统计页面
 * 
 * 功能模块：
 * - 终端报表：在线率、接入统计
 * - 车辆报表：行驶里程、油耗统计
 * - 告警报表：告警类型分布、处理效率
 * - 消息报表：消息量统计、响应时间
 * - 导出功能：Excel/PDF 导出
 */

export default function Reports() {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  
  return (
    <div>
      {/* 筛选条件 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Space>
          <DatePicker.RangePicker value={dateRange} onChange={(v) => setDateRange(v as any)} />
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button icon={<DownloadOutlined />}>导出报表</Button>
        </Space>
      </Card>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic title="总接入终端" value={1234} suffix="台" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic title="平均在线率" value={95.6} suffix="%" precision={1} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic title="总告警数" value={56} suffix="次" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic title="处理率" value={89.3} suffix="%" precision={1} />
          </Card>
        </Col>
      </Row>
      
      {/* 图表 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card className="daoda-card" title="终端在线趋势">
            <LineChart data={onlineTrendData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="daoda-card" title="告警类型分布">
            <PieChart data={alarmTypeData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
```

---

## 4. 开发优先级

### 4.1 P0 - 核心基础 (必须)

| 模块 | 工作量 | 说明 |
|------|--------|------|
| **components/** | 2 天 | 提取公共组件，提高代码复用 |
| **stores/** | 1 天 | Zustand 状态管理 |
| **hooks/** | 1 天 | 自定义 Hooks 封装 |
| **types/** | 0.5 天 | TypeScript 类型定义 |

### 4.2 P1 - 重要功能

| 模块 | 工作量 | 说明 |
|------|--------|------|
| **settings/** | 1 天 | 系统设置页面 |
| **commands/** | 1.5 天 | 指令管理页面 |
| **firmware/** | 1.5 天 | 固件管理页面 |

### 4.3 P2 - 增强功能

| 模块 | 工作量 | 说明 |
|------|--------|------|
| **trajectory/** | 2 天 | 轨迹回放功能 |
| **geofence/** | 2 天 | 电子围栏功能 |
| **reports/** | 1.5 天 | 报表统计页面 |
| **profile/** | 0.5 天 | 个人中心页面 |

---

## 5. 技术要点

### 5.1 WebSocket 实时通信

```typescript
// 实时数据推送
const { connected, subscribe } = useWebSocket({
  url: 'wss://api.daod.io/ws',
  onMessage: (data) => {
    switch (data.type) {
      case 'terminal_status':
        // 更新终端状态
        updateTerminalStatus(data.payload);
        break;
      case 'alarm':
        // 新告警通知
        showAlarmNotification(data.payload);
        break;
    }
  },
});

// 订阅特定频道
subscribe('terminal:123456', (data) => {
  console.log('终端数据:', data);
});
```

### 5.2 权限控制

```typescript
// 路由守卫
function PrivateRoute({ children, permission }: { children: React.ReactNode; permission?: string }) {
  const { isAuthenticated, hasPermission } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (permission && !hasPermission(permission)) {
    return <Result status="403" title="无访问权限" />;
  }
  
  return <>{children}</>;
}

// 使用
<Route path="/settings" element={
  <PrivateRoute permission="system:settings">
    <Settings />
  </PrivateRoute>
} />
```

### 5.3 地图组件集成

```typescript
// Leaflet + React-Leaflet 集成
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function MapView() {
  return (
    <MapContainer center={[30.123456, 103.845678]} zoom={11}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {terminals.map(t => (
        <Marker key={t.id} position={[t.lat, t.lng]}>
          <Popup>{t.terminalId}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

---

## 6. 总结

### 6.1 当前完成度

| 模块 | 状态 | 完成度 |
|------|------|--------|
| 页面 (6/12) | ⚠️ | 50% |
| 组件库 | ❌ | 0% |
| 状态管理 | ❌ | 0% |
| Hooks | ❌ | 0% |
| 类型定义 | ❌ | 0% |
| 服务层 | ✅ | 80% |

### 6.2 预计总工作量

| 阶段 | 工作量 | 内容 |
|------|--------|------|
| P0 基础 | 4.5 天 | components + stores + hooks + types |
| P1 功能 | 4 天 | settings + commands + firmware |
| P2 增强 | 6 天 | trajectory + geofence + reports + profile |
| **总计** | **14.5 天** | |

---

_文档维护：渔晓白_