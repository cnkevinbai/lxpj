# 道达智能鸿蒙应用开发指南

> 版本：v1.0.0  
> 更新日期：2026-03-12  
> 作者：渔晓白 ⚙️

---

## 📋 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [环境搭建](#环境搭建)
4. [项目结构](#项目结构)
5. [开发规范](#开发规范)
6. [API 调用](#api 调用)
7. [状态管理](#状态管理)
8. [测试指南](#测试指南)
9. [发布流程](#发布流程)

---

## 项目概述

### 应用信息

| 项目 | 值 |
|-----|-----|
| **应用名称** | 道达智能 |
| **应用 ID** | com.daoda.crm |
| **版本号** | 1.0.0 |
| **最低 API 版本** | API 9 |
| **目标 API 版本** | API 11 |
| **开发语言** | ArkTS |

### 功能模块

| 模块 | 说明 | 优先级 |
|-----|------|--------|
| **首页** | 工作台/数据概览 | P0 |
| **CRM** | 客户/线索/商机/订单 | P0 |
| **ERP** | 库存/采购/财务 (精简) | P1 |
| **审批** | 统一审批中心 | P0 |
| **消息** | 通知中心 | P0 |
| **我的** | 个人设置 | P1 |

---

## 技术栈

### 核心技术

| 技术 | 版本 | 用途 |
|-----|------|------|
| **ArkTS** | 1.0 | 开发语言 |
| **ArkUI** | 1.0 | UI 框架 |
| **Router** | 1.0 | 路由管理 |
| **HTTP** | 1.0 | 网络请求 |

### 状态管理

| 技术 | 用途 |
|-----|------|
| **@State** | 组件内状态 |
| **@Prop** | 父子组件通信 |
| **@Link** | 双向绑定 |
| **@Provide/@Consume** | 跨组件状态共享 |
| **AppStorage** | 全局状态 |

### 第三方库

| 库 | 用途 |
|-----|------|
| **@ohos/request** | HTTP 请求封装 |
| **@ohos/storage** | 本地存储 |
| **@ohos/push** | 消息推送 |

---

## 环境搭建

### 系统要求

| 系统 | 版本 |
|-----|------|
| **DevEco Studio** | 4.0+ |
| **Node.js** | 16.0+ |
| **ohpm** | 1.0+ |
| **SDK** | API 11 |

### 安装步骤

#### 1. 安装 DevEco Studio

```bash
# 下载地址
https://developer.harmonyos.com/cn/develop/deveco-studio

# 安装后配置
- SDK 路径：默认
- 模拟器：创建 Phone 模拟器
```

#### 2. 克隆项目

```bash
git clone <repository-url>
cd harmonyos-app
```

#### 3. 安装依赖

```bash
ohpm install
```

#### 4. 配置环境

```bash
# 复制环境配置
cp .env.example .env

# 编辑配置
vim .env
```

#### 5. 运行项目

```bash
# 连接模拟器或真机
# 点击运行按钮 或
ohpm run
```

---

## 项目结构

```
entry/
├── src/
│   ├── main/
│   │   ├── ets/
│   │   │   ├── entryability/
│   │   │   │   └── EntryAbility.ets       # 入口 Ability
│   │   │   ├── pages/
│   │   │   │   ├── Index.ets              # 首页
│   │   │   │   ├── Login.ets              # 登录页
│   │   │   │   ├── CRM/
│   │   │   │   │   ├── CustomerList.ets   # 客户列表
│   │   │   │   │   ├── CustomerDetail.ets # 客户详情
│   │   │   │   │   ├── LeadList.ets       # 线索列表
│   │   │   │   │   └── OpportunityList.ets# 商机列表
│   │   │   │   ├── ERP/
│   │   │   │   │   ├── InventoryList.ets  # 库存列表
│   │   │   │   │   ├── PurchaseList.ets   # 采购列表
│   │   │   │   │   └── FinanceBrief.ets   # 财务简报
│   │   │   │   ├── Approval/
│   │   │   │   │   ├── ApprovalList.ets   # 审批列表
│   │   │   │   │   └── ApprovalDetail.ets # 审批详情
│   │   │   │   └── Message/
│   │   │   │       └── MessageList.ets    # 消息列表
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   │   ├── NavBar.ets         # 导航栏
│   │   │   │   │   ├── TabBar.ets         # 底部导航
│   │   │   │   │   ├── SearchBar.ets      # 搜索框
│   │   │   │   │   └── Loading.ets        # 加载组件
│   │   │   │   ├── business/
│   │   │   │   │   ├── CustomerCard.ets   # 客户卡片
│   │   │   │   │   ├── OrderCard.ets      # 订单卡片
│   │   │   │   │   └── ApprovalCard.ets   # 审批卡片
│   │   │   │   └── charts/
│   │   │   │       ├── LineChart.ets      # 折线图
│   │   │   │       └── PieChart.ets       # 饼图
│   │   │   ├── services/
│   │   │   │   ├── api.ts                 # API 配置
│   │   │   │   ├── customer.ts            # 客户 API
│   │   │   │   ├── order.ts               # 订单 API
│   │   │   │   └── approval.ts            # 审批 API
│   │   │   ├── store/
│   │   │   │   ├── UserStore.ets          # 用户状态
│   │   │   │   ├── AppStore.ets           # 应用状态
│   │   │   │   └── MessageStore.ets       # 消息状态
│   │   │   ├── utils/
│   │   │   │   ├── format.ts              # 格式化工具
│   │   │   │   ├── validate.ts            # 验证工具
│   │   │   │   └── storage.ts             # 存储工具
│   │   │   └── constants/
│   │   │       ├── colors.ts              # 颜色常量
│   │   │       ├── styles.ts              # 样式常量
│   │   │       └── config.ts              # 配置常量
│   │   ├── resources/
│   │   │   ├── base/
│   │   │   │   ├── element/
│   │   │   │   │   ├── string.json        # 字符串资源
│   │   │   │   │   └── color.json         # 颜色资源
│   │   │   │   ├── media/
│   │   │   │   │   ├── icon_add.png       # 图标资源
│   │   │   │   │   └── logo.png           # Logo
│   │   │   │   └── profile/
│   │   │   │       └── main_pages.json    # 页面配置
│   │   │   └── zh_CN/
│   │   │       └── element/
│   │   │           └── string.json        # 中文资源
│   │   └── module.json5                   # 模块配置
│   └── ohosTest/                          # 测试代码
├── AppScope/
│   ├── resources/
│   │   └── base/
│   │       ├── element/
│   │       │   └── string.json            # 应用名称
│   │       └── media/
│   │           └── app_icon.png           # 应用图标
│   └── app.json5                          # 应用配置
├── .env                                   # 环境变量
├── .gitignore                             # Git 忽略
├── build-profile.json5                    # 构建配置
├── hvigorfile.ts                          # 构建脚本
├── oh-package.json5                       # 依赖配置
└── README.md                              # 项目说明
```

---

## 开发规范

### 命名规范

#### 文件命名

```typescript
// 页面：PascalCase
CustomerList.ets
CustomerDetail.ets

// 组件：PascalCase
NavBar.ets
CustomerCard.ets

// 服务：camelCase
customer.ts
approval.ts

// 工具：camelCase
format.ts
validate.ts
```

#### 变量命名

```typescript
// 常量：UPPER_SNAKE_CASE
const MAX_PAGE_SIZE = 100
const API_BASE_URL = 'https://api.example.com'

// 变量：camelCase
let customerList = []
const userName = '张三'

// 组件：PascalCase
const CustomerCard = () => {}
const NavBar = () => {}
```

#### 函数命名

```typescript
// 普通函数：camelCase
function getData() {}
function handleSave() {}

// 事件处理：handle + 事件名
function handleClick() {}
function handleSubmit() {}

// 生命周期：on + 事件名
function onPageShow() {}
function onBackPress() {}
```

### 代码规范

#### 组件结构

```typescript
@Entry
@Component
struct CustomerList {
  // 状态变量
  @State customerList: Customer[] = []
  @State loading: boolean = false
  @State refreshing: boolean = false
  
  // 生命周期
  aboutToAppear() {
    this.loadCustomers()
  }
  
  // 方法
  async loadCustomers() {
    this.loading = true
    try {
      this.customerList = await CustomerService.getList()
    } finally {
      this.loading = false
    }
  }
  
  // 构建函数
  build() {
    Column() {
      // 页面内容
    }
  }
}
```

#### 注释规范

```typescript
/**
 * 客户服务类
 * 提供客户相关的 API 调用
 */
class CustomerService {
  /**
   * 获取客户列表
   * @param page 页码
   * @param limit 每页数量
   * @returns 客户列表
   */
  static async getList(page: number, limit: number): Promise<Customer[]> {
    // 实现代码
  }
}
```

---

## API 调用

### 配置

```typescript
// services/api.ts
export const API_CONFIG = {
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}
```

### 请求封装

```typescript
// services/http.ts
export class Http {
  static async get(url: string, params?: any): Promise<any> {
    return request({
      url,
      method: 'GET',
      params,
      ...API_CONFIG
    })
  }
  
  static async post(url: string, data?: any): Promise<any> {
    return request({
      url,
      method: 'POST',
      data,
      ...API_CONFIG
    })
  }
}
```

### 使用示例

```typescript
// services/customer.ts
import { Http } from './http'

export class CustomerService {
  static async getList(page: number, limit: number) {
    return Http.get('/customers', { page, limit })
  }
  
  static async getDetail(id: string) {
    return Http.get(`/customers/${id}`)
  }
  
  static async create(data: Customer) {
    return Http.post('/customers', data)
  }
}
```

---

## 状态管理

### 组件内状态

```typescript
@Entry
@Component
struct Counter {
  @State count: number = 0
  
  build() {
    Column() {
      Text(`计数：${this.count}`)
      Button('增加')
        .onClick(() => {
          this.count++
        })
    }
  }
}
```

### 跨组件状态

```typescript
// 父组件
@Component
struct Parent {
  @Provide count: number = 0
  
  build() {
    Column() {
      Child()
    }
  }
}

// 子组件
@Component
struct Child {
  @Consume count: number
  
  build() {
    Button('增加')
      .onClick(() => {
        this.count++
      })
  }
}
```

### 全局状态

```typescript
// store/UserStore.ts
class UserStore {
  @StorageLink('user') user: UserInfo | null = null
  
  login(user: UserInfo) {
    this.user = user
  }
  
  logout() {
    this.user = null
  }
}

// 使用
const userStore = new UserStore()
userStore.login(userInfo)
```

---

## 测试指南

### 单元测试

```typescript
// ohosTest/ets/utils/format.test.ts
import { describe, it, expect } from '@ohos/hypium'

describe('FormatUtils', () => {
  it('should format currency correctly', () => {
    const result = FormatUtils.formatCurrency(1234.56)
    expect(result).assertEquals('¥1,234.56')
  })
})
```

### 组件测试

```typescript
// ohosTest/ets/components/Button.test.ts
import { describe, it, expect } from '@ohos/hypium'

describe('Button Component', () => {
  it('should render correctly', () => {
    // 测试代码
  })
})
```

### 运行测试

```bash
# 运行所有测试
ohpm test

# 运行特定测试
ohpm test --grep "FormatUtils"
```

---

## 发布流程

### 1. 版本更新

```bash
# 更新版本号
# oh-package.json5
{
  "version": "1.0.1"
}

# 更新构建配置
# build-profile.json5
{
  "versionCode": 2,
  "versionName": "1.0.1"
}
```

### 2. 构建签名

```bash
# 生成签名密钥
keytool -genkey -keystore my.keystore -alias myalias

# 配置签名
# build-profile.json5
{
  "signingConfigs": {
    "release": {
      "storeFile": "my.keystore",
      "keyAlias": "myalias"
    }
  }
}
```

### 3. 构建发布包

```bash
# 构建 Release 包
ohpm run build --mode release

# 输出路径
entry/build/default/outputs/default/entry-default-signed.hap
```

### 4. 上架应用市场

1. 登录华为应用市场
2. 创建应用
3. 上传 HAP 包
4. 填写应用信息
5. 提交审核

---

## 性能优化

### 列表优化

```typescript
// 使用 LazyForEach
LazyForEach(this.dataSource, (item) => {
  ListItem() {
    CustomerCard(item)
  }
}, (item) => item.id)
```

### 图片优化

```typescript
// 使用缓存
Image(url)
  .cachedImage({
    cache: CacheType.MEMORY
  })

// 懒加载
Image(url)
  .lazyLoad(true)
```

### 内存优化

```typescript
// 及时清理
aboutToDisappear() {
  this.dataSource.clear()
}
```

---

## 常见问题

### Q: 如何调试？

A: 使用 DevEco Studio 的调试工具，支持断点、日志、网络监控。

### Q: 如何适配暗黑模式？

A: 使用资源限定符，在 resources 下创建 dark 目录。

### Q: 如何实现推送？

A: 使用@ohos/push 库，配置推送证书。

---

_道达智能 · 版权所有_
