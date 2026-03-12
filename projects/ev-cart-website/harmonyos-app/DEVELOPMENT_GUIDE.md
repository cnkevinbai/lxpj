# EV Cart 鸿蒙 APP - 开发设计文档

> 版本：v1.0.0  
> 更新时间：2026-03-12  
> 开发者：渔晓白 ⚙️

---

## 📱 应用概述

EV Cart 鸿蒙 APP 是一款基于 HarmonyOS NEXT 的企业移动办公应用，为企业提供客户管理、订单跟踪、库存查询、财务报表等核心功能的移动访问能力。

---

## 🎯 功能模块

### 1. 认证模块 ✅
- ✅ 登录页面
- ✅ 退出登录
- ✅ Token 管理
- ✅ 自动登录

### 2. 首页模块 ✅
- ✅ 数据统计卡片
- ✅ 快捷功能入口
- ✅ 待办事项
- ✅ 底部导航

### 3. 客户管理 📝
- 📝 客户列表
- 📝 客户详情
- 📝 添加客户
- 📝 客户跟进

### 4. 订单管理 📝
- 📝 订单列表
- 📝 订单详情
- 📝 订单跟踪
- 📝 创建订单

### 5. 库存查询 📝
- 📝 库存列表
- 📝 库存详情
- 📝 库存预警
- 📝 扫码入库

### 6. 财务报表 📝
- 📝 收入统计
- 📝 支出统计
- 📝 利润分析
- 📝 图表展示

### 7. 个人中心 📝
- 📝 个人信息
- 📝 修改密码
- 📝 系统设置
- 📝 关于我们

---

## 📁 项目结构

```
harmonyos-app/
├── entry/
│   └── src/main/ets/
│       ├── entryability/
│       │   └── EntryAbility.ets       # 入口能力
│       ├── pages/
│       │   ├── Index.ets              # 首页 ✅
│       │   ├── Login.ets              # 登录页 📝
│       │   ├── Customers.ets          # 客户列表 📝
│       │   ├── CustomerDetail.ets     # 客户详情 📝
│       │   ├── Orders.ets             # 订单列表 📝
│       │   ├── OrderDetail.ets        # 订单详情 📝
│       │   ├── Inventory.ets          # 库存查询 📝
│       │   ├── Finance.ets            # 财务报表 📝
│       │   └── Profile.ets            # 个人中心 📝
│       ├── common/
│       │   ├── services/
│       │   │   ├── ApiService.ets     # API 服务 ✅
│       │   │   ├── AuthService.ets    # 认证服务 📝
│       │   │   └── StorageService.ets # 存储服务 📝
│       │   ├── components/
│       │   │   ├── NavBar.ets         # 导航栏 📝
│       │   │   ├── TabBar.ets         # 底部导航 📝
│       │   │   └── CustomerCard.ets   # 客户卡片 📝
│       │   └── utils/
│       │       ├── Constants.ets      # 常量定义 📝
│       │       └── DateFormat.ets     # 日期格式化 📝
│       └── resources/
│           └── base/
│               ├── element/           # 资源文件
│               └── media/             # 媒体资源
├── package.json
└── README.md
```

---

## 🎨 UI 设计规范

### 颜色规范
```typescript
// 主色调
const PrimaryColor = '#1890ff'      // 科技蓝
const SuccessColor = '#52c41a'      // 成功绿
const WarningColor = '#faad14'      // 警告黄
const ErrorColor = '#ff4d4f'        // 错误红

// 中性色
const TextPrimary = '#333333'       // 主文字
const TextSecondary = '#666666'     // 次要文字
const TextDisabled = '#999999'      // 禁用文字
const BorderColor = '#d9d9d9'       // 边框色
const BackgroundColor = '#f5f5f5'   // 背景色
```

### 字体规范
```typescript
// 字号
const FontSizeSmall = 12            // 小字
const FontSizeNormal = 14           // 正常
const FontSizeMedium = 16           // 中等
const FontSizeLarge = 18            // 大字
const FontSizeXLarge = 20           // 特大
const FontSizeTitle = 24            // 标题

// 字重
const FontWeightNormal = 400        // 正常
const FontWeightMedium = 500        // 中等
const FontWeightBold = 700          // 粗体
```

### 间距规范
```typescript
// 间距
const SpacingSmall = 8              // 小间距
const SpacingNormal = 16            // 正常间距
const SpacingMedium = 24            // 中间距
const SpacingLarge = 32             // 大间距
```

---

## 🔧 核心服务

### ApiService - API 服务
```typescript
export class ApiService {
  private baseUrl: string = 'https://api.evcart.com/api/v1'
  
  // GET 请求
  async get<T>(url: string): Promise<T>
  
  // POST 请求
  async post<T>(url: string, data: any): Promise<T>
  
  // PUT 请求
  async put<T>(url: string, data: any): Promise<T>
  
  // DELETE 请求
  async delete<T>(url: string): Promise<T>
}
```

### AuthService - 认证服务
```typescript
export class AuthService {
  // 登录
  async login(username: string, password: string): Promise<LoginResult>
  
  // 退出登录
  async logout(): Promise<void>
  
  // 检查登录状态
  async isLoggedIn(): Promise<boolean>
  
  // 获取当前用户
  async getCurrentUser(): Promise<User>
}
```

### StorageService - 存储服务
```typescript
export class StorageService {
  // 保存数据
  async save(key: string, value: string): Promise<void>
  
  // 读取数据
  async load(key: string): Promise<string>
  
  // 删除数据
  async remove(key: string): Promise<void>
  
  // 清空数据
  async clear(): Promise<void>
}
```

---

## 📱 页面设计

### 首页（Index.ets）✅
```typescript
@Entry
@Component
struct Index {
  @State stats: DashboardStats = {}
  @State quickActions: QuickAction[] = []
  
  build() {
    Column() {
      // 顶部导航
      NavBar({ title: 'EV Cart' })
      
      // 数据统计
      StatsCard(stats: this.stats)
      
      // 快捷功能
      QuickActions(actions: this.quickActions)
      
      // 待办事项
      TodoList()
      
      // 底部导航
      TabBar()
    }
  }
}
```

### 登录页（Login.ets）📝
```typescript
@Entry
@Component
struct Login {
  @StorageLink('username'): string = ''
  @StorageLink('password'): string = ''
  @State loading: boolean = false
  
  build() {
    Column() {
      // Logo
      Image($r('app.media.logo'))
        .width(120)
        .height(120)
      
      // 登录表单
      TextInput({ placeholder: '用户名' })
      TextInput({ placeholder: '密码', type: InputType.Password })
      
      Button('登录')
        .onClick(() => this.handleLogin())
    }
  }
}
```

### 客户列表（Customers.ets）📝
```typescript
@Entry
@Component
struct Customers {
  @State customers: Customer[] = []
  @State loading: boolean = false
  @State refreshing: boolean = false
  
  build() {
    Column() {
      // 搜索栏
      SearchBar({ onSearch: (keyword) => this.search(keyword) })
      
      // 客户列表
      List() {
        ForEach(this.customers, (customer) => {
          CustomerCard({ customer: customer })
        })
      }
      .onReachBottom(() => this.loadMore())
      .refreshing({ refreshing: this.refreshing })
      .onRefresh(() => this.refresh())
      
      // 添加按钮
      FloatingActionButton()
    }
  }
}
```

---

## 📊 API 接口

### 认证接口
```
POST /api/v1/auth/login      # 登录
POST /api/v1/auth/logout     # 登出
GET  /api/v1/auth/me         # 获取当前用户
```

### 客户接口
```
GET    /api/v1/customers     # 客户列表
GET    /api/v1/customers/:id # 客户详情
POST   /api/v1/customers     # 创建客户
PUT    /api/v1/customers/:id # 更新客户
DELETE /api/v1/customers/:id # 删除客户
```

### 订单接口
```
GET    /api/v1/orders        # 订单列表
GET    /api/v1/orders/:id    # 订单详情
POST   /api/v1/orders        # 创建订单
```

### 库存接口
```
GET    /api/v1/inventory     # 库存列表
GET    /api/v1/inventory/:id # 库存详情
```

---

## 🚀 开发指南

### 环境搭建
```bash
# 1. 安装 DevEco Studio
下载并安装 DevEco Studio 4.0+

# 2. 安装 HarmonyOS SDK
在 DevEco Studio 中安装 SDK API 10+

# 3. 克隆项目
git clone https://github.com/cnkevinbai/lxpj.git
cd harmonyos-app

# 4. 安装依赖
ohpm install
```

### 运行调试
```bash
# 1. 连接设备或启动模拟器
# 2. 点击运行按钮
# 3. 查看日志
```

### 构建发布
```bash
# 开发构建
npm run build:debug

# 发布构建
npm run build:release

# 打包签名
npm run package
```

---

## 📱 适配设备

| 设备类型 | 支持 | 说明 |
|---------|------|------|
| 鸿蒙手机 | ✅ | 完全适配 |
| 鸿蒙平板 | ✅ | 完全适配 |
| 鸿蒙手表 | 📝 | 精简版（规划中） |
| 鸿蒙车机 | 📝 | 规划中 |

---

## 🎯 开发计划

### Phase 1: 基础功能（已完成）
- ✅ 项目框架
- ✅ API 服务
- ✅ 首页框架
- ✅ 导航组件

### Phase 2: 核心功能（进行中）
- 📝 登录认证
- 📝 客户管理
- 📝 订单管理
- 📝 库存查询

### Phase 3: 高级功能（规划中）
- 📝 财务报表
- 📝 数据图表
- 📝 消息推送
- 📝 离线缓存

### Phase 4: 优化完善（规划中）
- 📝 性能优化
- 📝 用户体验优化
- 📝 多设备适配
- 📝 自动化测试

---

## 📞 技术支持

- **官网**: https://www.evcart.com
- **邮箱**: dev@evcart.com
- **文档**: https://docs.evcart.com

---

## 📄 许可证

Copyright © 2026 EV Cart. All rights reserved.
