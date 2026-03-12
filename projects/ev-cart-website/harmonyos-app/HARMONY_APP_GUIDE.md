# 鸿蒙 APP 开发文档

> 道达智能移动办公 APP  
> 版本：v1.0  
> 创建时间：2026-03-12  
> 技术栈：HarmonyOS NEXT + ArkTS

---

## 📱 APP 架构

### 技术选型

**开发语言**: ArkTS (TypeScript for HarmonyOS)  
**UI 框架**: ArkUI (声明式 UI)  
**状态管理**: @State/@Prop/@Link  
**网络请求**: @ohos.net.http  
**数据存储**: @ohos.data.preferences  
**消息推送**: 华为推送服务

### 目录结构

```
harmonyos-app/
├── entry/                          # 主模块
│   ├── src/main/
│   │   ├── ets/
│   │   │   ├── pages/              # 页面
│   │   │   │   ├── Index.ets       # 首页
│   │   │   │   ├── Login.ets       # 登录页
│   │   │   │   ├── Dashboard.ets   # 工作台
│   │   │   │   ├── Customers.ets   # 客户
│   │   │   │   ├── Orders.ets      # 订单
│   │   │   │   ├── Approvals.ets   # 审批
│   │   │   │   └── Settings.ets    # 设置
│   │   │   ├── components/         # 组件
│   │   │   │   ├── CustomerCard.ets
│   │   │   │   ├── OrderItem.ets
│   │   │   │   └── ApprovalCard.ets
│   │   │   ├── services/           # 服务
│   │   │   │   ├── ApiService.ets
│   │   │   │   ├── AuthService.ets
│   │   │   │   └── PushService.ets
│   │   │   ├── models/             # 数据模型
│   │   │   │   ├── Customer.ets
│   │   │   │   ├── Order.ets
│   │   │   │   └── Approval.ets
│   │   │   └── utils/              # 工具类
│   │   │       ├── HttpUtil.ets
│   │   │       └── StorageUtil.ets
│   │   ├── resources/              # 资源文件
│   │   └── module.json5            # 模块配置
│   └── oh-package.json5
├── common/                         # 公共模块
│   └── apis/                       # API 定义
└── App.ets                         # 应用入口
```

---

## 🔑 核心功能

### 1. 登录认证

**功能**:
- 账号密码登录
- 短信验证码登录
- 指纹/面部识别
- 自动登录
- Token 刷新

**API**:
```typescript
POST /api/v1/auth/login
{
  "username": "sales001",
  "password": "password123",
  "deviceType": "harmonyos"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 7200,
  "userInfo": {
    "id": "user-001",
    "name": "张三",
    "role": "sales",
    "department": "销售部"
  }
}
```

---

### 2. 消息中心

**功能**:
- 审批通知
- 工单通知
- 系统通知
- 消息已读
- 消息推送

**通知类型**:
```typescript
enum NotificationType {
  APPROVAL_PENDING = 'approval_pending',     // 待审批
  APPROVAL_RESULT = 'approval_result',       // 审批结果
  WORKORDER_ASSIGNED = 'workorder_assigned', // 工单分配
  ORDER_UPDATE = 'order_update',             // 订单更新
  SYSTEM = 'system'                          // 系统通知
}
```

---

### 3. 工作台

**功能模块**:
- 📊 数据看板（销售/生产/回款）
- ✅ 待办事项
- ⏰ 日程安排
- 📱 快捷入口

**数据看板 API**:
```typescript
GET /api/v1/mobile/dashboard

Response:
{
  "sales": {
    "target": 1000000,
    "completed": 650000,
    "rate": 65,
    "rank": 3
  },
  "pendingApprovals": 5,
  "pendingTasks": 8,
  "todayVisits": 3
}
```

---

### 4. 客户管理

**功能**:
- 客户列表（搜索/筛选）
- 客户详情（360°视图）
- 新建客户
- 编辑客户
- 客户跟进
- 拜访签到

**客户列表 API**:
```typescript
GET /api/v1/mobile/customers?page=1&limit=20&keyword=xxx

Response:
{
  "items": [
    {
      "id": "cust-001",
      "name": "张家界国家森林公园",
      "contactPerson": "张主任",
      "phone": "138****1234",
      "level": "A",
      "status": "active",
      "lastFollowup": "2026-03-10"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

---

### 5. 订单管理

**功能**:
- 订单列表
- 订单详情
- 生产进度查询
- 订单状态跟踪
- 发货通知

**生产进度 API**:
```typescript
GET /api/v1/mobile/orders/:id/progress

Response:
{
  "orderId": "SO20260312ABCD",
  "status": "producing",
  "progress": 60,
  "stages": [
    {
      "name": "物料准备",
      "status": "completed",
      "completedAt": "2026-03-13T10:00:00Z"
    },
    {
      "name": "生产加工",
      "status": "in_progress",
      "progress": 60,
      "startedAt": "2026-03-14T09:00:00Z"
    },
    {
      "name": "质量检验",
      "status": "pending"
    },
    {
      "name": "完工入库",
      "status": "pending"
    }
  ],
  "estimatedComplete": "2026-03-25"
}
```

---

### 6. 审批中心

**功能**:
- 待我审批
- 我已审批
- 我发起的
- 审批详情
- 审批操作（同意/拒绝）

**审批列表 API**:
```typescript
GET /api/v1/mobile/approvals/pending

Response:
{
  "items": [
    {
      "id": "AP20260312ABCD",
      "type": "price",
      "title": "价格调整申请",
      "applicant": "李四",
      "amount": 500000,
      "createdAt": "2026-03-12T10:00:00Z",
      "urgent": true
    }
  ]
}
```

**审批操作 API**:
```typescript
POST /api/v1/mobile/approvals/:id/approve
{
  "action": "approve",  // approve | reject
  "comment": "同意，价格调整合理"
}
```

---

### 7. 工单处理

**功能**:
- 我的工单
- 工单详情
- 工单处理
- 进度更新
- 完工确认

**工单列表 API**:
```typescript
GET /api/v1/mobile/workorders?status=pending&assignee=me

Response:
{
  "items": [
    {
      "id": "WO20260312ABCD",
      "type": "after_sales",
      "title": "车辆充电口故障",
      "customer": "张家界国家森林公园",
      "priority": "high",
      "status": "assigned",
      "createdAt": "2026-03-12T11:00:00Z"
    }
  ]
}
```

---

### 8. 销售功能

**功能**:
- 客户拜访（定位打卡）
- 跟进记录
- 销售日报
- 销售周报
- 业绩查询

**拜访签到 API**:
```typescript
POST /api/v1/mobile/checkin
{
  "latitude": 29.1167,
  "longitude": 110.4792,
  "address": "湖南省张家界市武陵源区",
  "customerId": "cust-001",
  "photo": "base64...",
  "note": "拜访客户，洽谈合作"
}
```

**跟进记录 API**:
```typescript
POST /api/v1/mobile/followups
{
  "customerId": "cust-001",
  "type": "visit",  // visit | call | email | wechat
  "content": "与客户深入沟通，意向强烈",
  "nextFollowupDate": "2026-03-15",
  "photos": ["base64..."]
}
```

---

## 🎨 UI 设计规范

### 颜色规范

```typescript
// 主色调
const colors = {
  primary: '#1976D2',      // 科技蓝
  primaryLight: '#BBDEFB',
  primaryDark: '#0D47A1',
  
  // 辅助色
  secondary: '#4CAF50',    // 生态绿
  accent: '#FF9800',       // 活力橙
  
  // 功能色
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // 中性色
  text: '#212121',
  textSecondary: '#757575',
  divider: '#E0E0E0',
  background: '#F5F5F5'
};
```

### 字体规范

```typescript
const fonts = {
  // 字号
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  
  // 字重
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
};
```

### 间距规范

```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48
};
```

---

## 📡 API 集成

### 基础配置

```typescript
// ApiService.ets
const BASE_URL = 'https://api.evcart.com/api/v1';
const TIMEOUT = 30000; // 30 秒

class ApiService {
  private accessToken: string = '';
  
  // 设置 Token
  setToken(token: string) {
    this.accessToken = token;
  }
  
  // GET 请求
  async get(url: string, params?: any): Promise<any> {
    const fullUrl = `${BASE_URL}${url}?${this.buildParams(params)}`;
    
    const response = await http.get(fullUrl, {
      header: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      connectTimeout: TIMEOUT,
      readTimeout: TIMEOUT
    });
    
    return response.data;
  }
  
  // POST 请求
  async post(url: string, data: any): Promise<any> {
    const response = await http.post(
      `${BASE_URL}${url}`,
      JSON.stringify(data),
      {
        header: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        connectTimeout: TIMEOUT,
        readTimeout: TIMEOUT
      }
    );
    
    return response.data;
  }
  
  // 构建参数
  private buildParams(params: any): string {
    if (!params) return '';
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
}
```

---

## 🔔 消息推送

### 推送配置

```typescript
// PushService.ets
import push from '@ohos.push.notification';

class PushService {
  // 初始化推送
  async init() {
    const pushService = push.getPushService();
    
    // 订阅推送
    await pushService.subscribePushMessage((message) => {
      this.handlePushMessage(message);
    });
  }
  
  // 处理推送消息
  private handlePushMessage(message: any) {
    const { title, body, data } = message;
    
    // 根据类型处理
    switch (data.type) {
      case 'approval':
        this.showApprovalNotification(title, body, data);
        break;
      case 'workorder':
        this.showWorkOrderNotification(title, body, data);
        break;
      case 'order':
        this.showOrderNotification(title, body, data);
        break;
    }
  }
  
  // 显示审批通知
  private showApprovalNotification(title: string, body: string, data: any) {
    // 显示通知栏通知
    // 点击跳转到审批详情
  }
}
```

---

## 💾 本地存储

### 数据存储

```typescript
// StorageUtil.ets
import dataPreferences from '@ohos.data.preferences';

class StorageUtil {
  private static instance: StorageUtil;
  private preferences: dataPreferences.Preferences;
  
  // 获取实例
  static getInstance(): StorageUtil {
    if (!StorageUtil.instance) {
      StorageUtil.instance = new StorageUtil();
    }
    return StorageUtil.instance;
  }
  
  // 初始化
  async init() {
    this.preferences = await dataPreferences.getPreferences('app_data');
  }
  
  // 保存数据
  async set(key: string, value: any): Promise<void> {
    await this.preferences.put(key, value);
    await this.preferences.flush();
  }
  
  // 获取数据
  async get(key: string, defaultValue?: any): Promise<any> {
    return await this.preferences.get(key, defaultValue);
  }
  
  // 删除数据
  async remove(key: string): Promise<void> {
    await this.preferences.delete(key);
    await this.preferences.flush();
  }
}
```

---

## 🚀 开发计划

### 第一周（基础功能）

- [ ] 项目初始化
- [ ] 登录认证
- [ ] 基础组件库
- [ ] 网络框架
- [ ] 消息推送

### 第二周（核心功能）

- [ ] 工作台
- [ ] 客户管理
- [ ] 订单管理
- [ ] 审批中心
- [ ] 工单处理

### 第三周（销售功能）

- [ ] 拜访签到
- [ ] 跟进记录
- [ ] 销售日报
- [ ] 数据看板
- [ ] 设置中心

### 第四周（测试优化）

- [ ] 功能测试
- [ ] 性能优化
- [ ] UI 优化
- [ ] Bug 修复
- [ ] 发布准备

---

_渔晓白 · AI 系统构建者 · 2026-03-12_

**文档版本**: v1.0  
**开发语言**: ArkTS  
**目标平台**: HarmonyOS NEXT
