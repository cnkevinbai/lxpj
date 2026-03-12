# EV Cart 鸿蒙 APP

> 鸿蒙原生应用 - HarmonyOS NEXT

## 📱 应用介绍

EV Cart 鸿蒙 APP 是一款面向企业用户的移动办公应用，提供销售管理、库存查询、客户管理等功能。

## 🚀 快速开始

### 环境要求

- DevEco Studio 4.0+
- HarmonyOS SDK API 10+
- Node.js 18+

### 安装依赖

```bash
cd harmonyos-app
ohpm install
```

### 运行应用

1. 打开 DevEco Studio
2. 导入项目
3. 连接设备或启动模拟器
4. 点击运行

## 📁 项目结构

```
harmonyos-app/
├── entry/
│   └── src/
│       └── main/
│           ├── ets/
│           │   ├── entryability/     # 入口能力
│           │   ├── pages/            # 页面
│           │   │   ├── Index.ets     # 首页
│           │   │   ├── Dashboard.ets # 仪表盘
│           │   │   ├── Customers.ets # 客户
│           │   │   ├── Orders.ets    # 订单
│           │   │   ├── Inventory.ets # 库存
│           │   │   └── Profile.ets   # 我的
│           │   ├── common/           # 公共模块
│           │   │   ├── services/     # 服务层
│           │   │   │   ├── ApiService.ets
│           │   │   │   ├── AuthService.ets
│           │   │   │   └── StorageService.ets
│           │   │   ├── components/   # 组件
│           │   │   └── utils/        # 工具类
│           │   └── entryability/
│           ├── resources/            # 资源文件
│           └── module.json5
├── AppScope/
└── build-profile.json5
```

## 🎯 功能模块

### 1. 登录认证
- ✅ 账号密码登录
- ✅ 生物识别登录
- ✅ Token 自动刷新

### 2. 仪表盘
- ✅ 销售数据统计
- ✅ 待办事项提醒
- ✅ 快捷入口

### 3. 客户管理
- ✅ 客户列表
- ✅ 客户详情
- ✅ 添加客户
- ✅ 客户跟进

### 4. 订单管理
- ✅ 订单列表
- ✅ 订单详情
- ✅ 订单状态跟踪
- ✅ 创建订单

### 5. 库存查询
- ✅ 库存列表
- ✅ 库存详情
- ✅ 库存预警
- ✅ 扫码入库

### 6. 消息中心
- ✅ 系统通知
- ✅ 审批提醒
- ✅ 消息已读标记

### 7. 个人中心
- ✅ 个人信息
- ✅ 修改密码
- ✅ 设置
- ✅ 退出登录

## 🔧 核心技术

### 网络请求
```typescript
// ApiService.ets
@ohos.net.http

export class ApiService {
  private baseUrl: string = 'https://api.evcart.com'
  
  async get<T>(url: string): Promise<T> {
    // 实现 GET 请求
  }
  
  async post<T>(url: string, data: any): Promise<T> {
    // 实现 POST 请求
  }
}
```

### 数据持久化
```typescript
// StorageService.ets
import dataPreferences from '@ohos.data.preferences'

export class StorageService {
  async save(key: string, value: string): Promise<void>
  async load(key: string): Promise<string>
  async remove(key: string): Promise<void>
}
```

### UI 组件
```typescript
// 使用 ArkUI 声明式开发
Column() {
  Text('欢迎使用 EV Cart')
    .fontSize(24)
    .fontWeight(FontWeight.Bold)
  
  Button('登录')
    .width('100%')
    .onClick(() => {
      // 登录逻辑
    })
}
```

## 📊 API 接口

```typescript
// 登录
POST /api/v1/auth/login

// 获取客户列表
GET /api/v1/customers

// 获取订单列表
GET /api/v1/orders

// 获取库存列表
GET /api/v1/inventory/products

// 获取消息列表
GET /api/v1/messages
```

## 🎨 设计规范

### 颜色
- 主色：#1890ff
- 成功色：#52c41a
- 警告色：#faad14
- 错误色：#ff4d4f

### 字体
- 标题：24px
- 正文：16px
- 辅助文字：14px

### 间距
- 页面边距：16px
- 组件间距：12px
- 卡片内边距：16px

## 🚀 构建发布

### 开发构建
```bash
npm run build:debug
```

### 发布构建
```bash
npm run build:release
```

### 打包签名
```bash
npm run package
```

## 📱 设备支持

- ✅ 鸿蒙手机
- ✅ 鸿蒙平板
- ✅ 鸿蒙手表（精简版）

## 📝 开发注意事项

1. 使用 TypeScript 开发
2. 遵循鸿蒙开发规范
3. 适配不同屏幕尺寸
4. 注意内存管理
5. 做好错误处理

## 📞 联系方式

- 官网：https://www.evcart.com
- 邮箱：dev@evcart.com

## 📄 许可证

Copyright © 2026 EV Cart
