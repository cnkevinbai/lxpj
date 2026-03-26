# API接口设计文档

> **版本**: v1.0  
> **设计日期**: 2026-03-18  
> **所属系统**: 道达智能数字化平台  
> **协议**: RESTful API + WebSocket

---

## 📋 文档目录

1. [API设计规范](#一api设计规范)
2. [认证授权](#二认证授权)
3. [公共接口](#三公共接口)
4. [CRM接口](#四crm模块接口)
5. [ERP接口](#五erp模块接口)
6. [MES接口](#六mes模块接口)
7. [服务接口](#七售后服务接口)
8. [WebSocket接口](#八websocket接口)
9. [错误码定义](#九错误码定义)

---

# 一、API设计规范

## 1.1 基础规范

```
┌─────────────────────────────────────────────────────────────────┐
│                     API设计规范                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. URL规范                                                     │
│     • 基础路径: /api/v1                                         │
│     • 资源命名: 小写复数名词                                     │
│     • 层级关系: /resources/{id}/sub-resources                   │
│     • 示例: /api/v1/customers/{id}/contacts                     │
│                                                                 │
│  2. HTTP方法                                                    │
│     • GET    查询资源                                           │
│     • POST   创建资源/执行操作                                   │
│     • PUT    更新资源(完整)                                      │
│     • PATCH  更新资源(部分)                                      │
│     • DELETE 删除资源                                           │
│                                                                 │
│  3. 请求格式                                                    │
│     • Content-Type: application/json                            │
│     • 字符编码: UTF-8                                           │
│     • 时间格式: ISO 8601 (2026-03-18T14:30:00Z)                 │
│                                                                 │
│  4. 响应格式                                                    │
│     • 成功: { code: 0, data: {...}, message: "success" }        │
│     • 失败: { code: 10001, message: "错误描述", errors: [...] } │
│                                                                 │
│  5. 版本控制                                                    │
│     • URL版本: /api/v1/...                                      │
│     • 向下兼容，重大变更升级版本号                                │
│                                                                 │
│  6. 分页规范                                                    │
│     • 参数: page, pageSize                                      │
│     • 响应: { list: [], total: 100, page: 1, pageSize: 20 }     │
│                                                                 │
│  7. 排序规范                                                    │
│     • 参数: sortBy, sortOrder (asc/desc)                        │
│     • 示例: ?sortBy=createdAt&sortOrder=desc                    │
│                                                                 │
│  8. 过滤规范                                                    │
│     • 等于: ?status=active                                      │
│     • 范围: ?createdAtStart=xxx&createdAtEnd=xxx                │
│     • 模糊: ?keyword=xxx                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 1.2 请求头规范

```yaml
# 必需请求头
Headers:
  Content-Type: application/json
  Accept: application/json
  Accept-Language: zh-CN
  Authorization: Bearer {token}
  X-Request-ID: {uuid}        # 请求追踪ID
  X-Tenant-ID: {tenantId}     # 租户ID (多租户场景)

# 可选请求头
X-Timezone: Asia/Shanghai     # 时区
X-Device-ID: {deviceId}       # 设备ID
X-App-Version: 1.0.0          # 应用版本
```

## 1.3 响应格式规范

```typescript
// 成功响应
interface SuccessResponse<T> {
  code: 0;
  data: T;
  message: string;
  timestamp: number;
  requestId: string;
}

// 分页响应
interface PageResponse<T> {
  code: 0;
  data: {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  message: string;
  timestamp: number;
  requestId: string;
}

// 错误响应
interface ErrorResponse {
  code: number;          // 业务错误码
  message: string;       // 错误描述
  errors?: FieldError[]; // 字段错误列表
  timestamp: number;
  requestId: string;
}

interface FieldError {
  field: string;
  message: string;
  code: string;
}

// 响应示例
// 成功
{
  "code": 0,
  "data": {
    "id": "xxx",
    "name": "客户名称"
  },
  "message": "success",
  "timestamp": 1710745800000,
  "requestId": "req-xxx"
}

// 失败
{
  "code": 10001,
  "message": "参数校验失败",
  "errors": [
    { "field": "name", "message": "名称不能为空", "code": "REQUIRED" }
  ],
  "timestamp": 1710745800000,
  "requestId": "req-xxx"
}
```

---

# 二、认证授权

## 2.1 登录认证

### 2.1.1 用户登录

```yaml
POST /api/v1/auth/login
描述: 用户登录认证

请求体:
  {
    "username": "admin",          # 用户名
    "password": "password123",    # 密码
    "captchaId": "xxx",           # 验证码ID
    "captchaCode": "1234",        # 验证码
    "rememberMe": true            # 记住登录
  }

响应:
  {
    "code": 0,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "tokenType": "Bearer",
      "expiresIn": 7200,
      "user": {
        "id": "xxx",
        "username": "admin",
        "realName": "管理员",
        "avatar": "https://...",
        "dept": {...},
        "roles": [...],
        "permissions": [...]
      }
    },
    "message": "success"
  }

错误码:
  - 20001: 用户名或密码错误
  - 20002: 账号已被禁用
  - 20003: 验证码错误
  - 20004: 账号已被锁定
```

### 2.1.2 刷新令牌

```yaml
POST /api/v1/auth/refresh
描述: 刷新访问令牌

请求体:
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }

响应:
  {
    "code": 0,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "tokenType": "Bearer",
      "expiresIn": 7200
    }
  }

错误码:
  - 20005: 刷新令牌无效
  - 20006: 刷新令牌已过期
```

### 2.1.3 退出登录

```yaml
POST /api/v1/auth/logout
描述: 用户退出登录

请求头:
  Authorization: Bearer {token}

响应:
  {
    "code": 0,
    "message": "success"
  }
```

### 2.1.4 获取验证码

```yaml
GET /api/v1/auth/captcha
描述: 获取图形验证码

响应:
  {
    "code": 0,
    "data": {
      "captchaId": "xxx",
      "captchaImage": "data:image/png;base64,..."
    }
  }
```

## 2.2 权限验证

### 2.2.1 获取当前用户信息

```yaml
GET /api/v1/auth/me
描述: 获取当前登录用户信息

响应:
  {
    "code": 0,
    "data": {
      "id": "xxx",
      "username": "admin",
      "realName": "管理员",
      "nickname": "Admin",
      "avatar": "https://...",
      "email": "admin@example.com",
      "phone": "138****1234",
      "gender": "male",
      "dept": {
        "id": "xxx",
        "name": "技术部",
        "path": "/1/2/3"
      },
      "roles": [
        { "id": "xxx", "name": "管理员", "code": "admin" }
      ],
      "permissions": [
        "system:user:view",
        "system:user:create",
        "crm:customer:view"
      ]
    }
  }

错误码:
  - 20007: 未登录或登录已过期
```

### 2.2.2 获取用户菜单

```yaml
GET /api/v1/auth/menus
描述: 获取当前用户菜单树

响应:
  {
    "code": 0,
    "data": [
      {
        "id": "xxx",
        "name": "system",
        "title": "系统管理",
        "icon": "setting",
        "type": "directory",
        "path": "/system",
        "children": [
          {
            "id": "xxx",
            "name": "user",
            "title": "用户管理",
            "icon": "user",
            "type": "menu",
            "path": "/system/user",
            "component": "system/user/index"
          }
        ]
      }
    ]
  }
```

---

# 三、公共接口

## 3.1 文件上传

### 3.1.1 单文件上传

```yaml
POST /api/v1/files/upload
描述: 单文件上传

请求类型: multipart/form-data

请求体:
  file: (binary)           # 文件
  type: "image"            # 类型: image/document/video/other
  module: "crm"            # 模块标识

响应:
  {
    "code": 0,
    "data": {
      "fileId": "xxx",
      "fileName": "image.png",
      "filePath": "/uploads/2026/03/18/xxx.png",
      "fileUrl": "https://cdn.example.com/uploads/...",
      "fileSize": 102400,
      "mimeType": "image/png"
    }
  }

错误码:
  - 30001: 文件大小超过限制
  - 30002: 文件类型不允许
  - 30003: 文件上传失败
```

### 3.1.2 批量上传

```yaml
POST /api/v1/files/upload-batch
描述: 批量文件上传

请求类型: multipart/form-data

请求体:
  files: (binary[])        # 文件数组
  type: "image"
  module: "crm"

响应:
  {
    "code": 0,
    "data": {
      "success": 5,
      "failed": 0,
      "files": [
        { "fileId": "xxx", "fileName": "1.png", "fileUrl": "..." },
        { "fileId": "xxx", "fileName": "2.png", "fileUrl": "..." }
      ]
    }
  }
```

## 3.2 数据字典

### 3.2.1 获取字典列表

```yaml
GET /api/v1/dictionaries/{type}
描述: 获取指定类型的字典数据

路径参数:
  type: 字典类型 (customer_level, customer_stage, order_status等)

响应:
  {
    "code": 0,
    "data": [
      { "value": "A", "label": "A类客户", "color": "#52c41a", "sort": 1 },
      { "value": "B", "label": "B类客户", "color": "#1890ff", "sort": 2 },
      { "value": "C", "label": "C类客户", "color": "#faad14", "sort": 3 }
    ]
  }
```

### 3.2.2 获取多个字典

```yaml
POST /api/v1/dictionaries/batch
描述: 批量获取字典数据

请求体:
  {
    "types": ["customer_level", "customer_stage", "order_status"]
  }

响应:
  {
    "code": 0,
    "data": {
      "customer_level": [...],
      "customer_stage": [...],
      "order_status": [...]
    }
  }
```

## 3.3 组织架构

### 3.3.1 获取部门树

```yaml
GET /api/v1/departments/tree
描述: 获取部门树结构

响应:
  {
    "code": 0,
    "data": [
      {
        "id": "xxx",
        "name": "总公司",
        "code": "HQ",
        "parentId": null,
        "leader": { "id": "xxx", "name": "张三" },
        "children": [
          {
            "id": "xxx",
            "name": "销售部",
            "parentId": "xxx",
            "children": []
          }
        ]
      }
    ]
  }
```

### 3.3.2 获取用户列表

```yaml
GET /api/v1/users
描述: 获取用户列表(下拉选择用)

参数:
  - deptId: 部门ID
  - keyword: 搜索关键词
  - status: 状态
  - page: 页码
  - pageSize: 每页数量

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "username": "zhangsan",
          "realName": "张三",
          "avatar": "...",
          "dept": { "id": "xxx", "name": "销售部" },
          "status": "active"
        }
      ],
      "total": 100
    }
  }
```

---

# 四、CRM模块接口

## 4.1 客户管理

### 4.1.1 客户列表

```yaml
GET /api/v1/crm/customers
描述: 获取客户列表

参数:
  - page: 页码 (默认1)
  - pageSize: 每页数量 (默认20, 最大100)
  - keyword: 搜索关键词 (名称/编码/联系人)
  - level: 客户等级 (VIP/A/B/C/D)
  - stage: 客户阶段 (potential/new/active/loyal/churned)
  - ownerId: 负责人ID
  - deptId: 部门ID
  - industry: 行业
  - source: 来源
  - inPool: 是否在公海
  - createdStart: 创建时间开始
  - createdEnd: 创建时间结束
  - sortBy: 排序字段
  - sortOrder: 排序方向 (asc/desc)

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "code": "C20260318001",
          "name": "四川道达智能科技有限公司",
          "shortName": "道达智能",
          "type": "enterprise",
          "level": "VIP",
          "stage": "active",
          "industry": "制造业",
          "source": "展会",
          "owner": {
            "id": "xxx",
            "name": "张三",
            "avatar": "..."
          },
          "dept": {
            "id": "xxx",
            "name": "销售一部"
          },
          "totalAmount": 1256000.00,
          "totalOrders": 23,
          "lastOrderDate": "2026-03-10",
          "inPool": false,
          "createdAt": "2025-06-15T10:30:00Z"
        }
      ],
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    }
  }
```

### 4.1.2 客户详情

```yaml
GET /api/v1/crm/customers/{id}
描述: 获取客户详情

路径参数:
  id: 客户ID

响应:
  {
    "code": 0,
    "data": {
      "id": "xxx",
      "code": "C20260318001",
      "name": "四川道达智能科技有限公司",
      "shortName": "道达智能",
      "type": "enterprise",
      "level": "VIP",
      "stage": "active",
      "industry": "制造业",
      "subIndustry": "新能源汽车",
      "source": "展会",
      "sourceDetail": "2026成都国际车展",
      "owner": {...},
      "dept": {...},
      "region": {...},
      "totalAmount": 1256000.00,
      "totalOrders": 23,
      "lastOrderDate": "2026-03-10",
      "inPool": false,
      "remark": "重要客户",
      "extData": {...},
      "contacts": [
        {
          "id": "xxx",
          "name": "李明",
          "position": "采购总监",
          "phone": "138****1234",
          "email": "lm@***",
          "role": "decision_maker",
          "isPrimary": true
        }
      ],
      "addresses": [
        {
          "id": "xxx",
          "type": "billing",
          "province": "四川省",
          "city": "成都市",
          "district": "高新区",
          "address": "天府大道xxx号",
          "isDefault": true
        }
      ],
      "tags": [
        { "id": "xxx", "name": "大客户", "color": "#f50" }
      ],
      "createdAt": "2025-06-15T10:30:00Z",
      "updatedAt": "2026-03-10T15:20:00Z"
    }
  }

错误码:
  - 40001: 客户不存在
  - 40002: 无权限查看该客户
```

### 4.1.3 创建客户

```yaml
POST /api/v1/crm/customers
描述: 创建客户

请求体:
  {
    "name": "客户名称",
    "shortName": "简称",
    "type": "enterprise",
    "level": "B",
    "industry": "制造业",
    "subIndustry": "新能源汽车",
    "source": "展会",
    "sourceDetail": "来源详情",
    "ownerId": "xxx",
    "deptId": "xxx",
    "remark": "备注",
    "contacts": [
      {
        "name": "联系人姓名",
        "position": "职位",
        "phone": "电话",
        "email": "邮箱",
        "role": "decision_maker",
        "isPrimary": true
      }
    ],
    "addresses": [
      {
        "type": "billing",
        "province": "四川省",
        "city": "成都市",
        "district": "高新区",
        "address": "详细地址"
      }
    ],
    "tagIds": ["tag1", "tag2"]
  }

响应:
  {
    "code": 0,
    "data": {
      "id": "xxx",
      "code": "C20260318001"
    },
    "message": "创建成功"
  }

错误码:
  - 40003: 客户名称已存在
  - 40004: 联系人信息不完整
```

### 4.1.4 更新客户

```yaml
PUT /api/v1/crm/customers/{id}
描述: 更新客户信息

路径参数:
  id: 客户ID

请求体: (同创建，部分字段可选)

响应:
  {
    "code": 0,
    "message": "更新成功"
  }
```

### 4.1.5 删除客户

```yaml
DELETE /api/v1/crm/customers/{id}
描述: 删除客户(软删除)

路径参数:
  id: 客户ID

响应:
  {
    "code": 0,
    "message": "删除成功"
  }

错误码:
  - 40005: 客户存在关联数据，无法删除
```

### 4.1.6 批量操作

```yaml
POST /api/v1/crm/customers/batch
描述: 批量操作客户

请求体:
  {
    "action": "transfer",    # transfer/delete/export/assignLevel
    "ids": ["id1", "id2"],
    "params": {
      "newOwnerId": "xxx",   # 转移时需要
      "level": "A"           # 分配等级时需要
    }
  }

响应:
  {
    "code": 0,
    "data": {
      "success": 10,
      "failed": 2,
      "errors": [
        { "id": "xxx", "reason": "客户不存在" }
      ]
    }
  }
```

### 4.1.7 客户转移

```yaml
POST /api/v1/crm/customers/{id}/transfer
描述: 转移客户给其他负责人

路径参数:
  id: 客户ID

请求体:
  {
    "newOwnerId": "xxx",
    "reason": "转移原因"
  }

响应:
  {
    "code": 0,
    "message": "转移成功"
  }
```

### 4.1.8 客户公海操作

```yaml
# 领取公海客户
POST /api/v1/crm/customers/pool/claim
请求体:
  {
    "ids": ["id1", "id2"]
  }

# 放入公海
POST /api/v1/crm/customers/{id}/pool
请求体:
  {
    "reason": "放入公海原因"
  }
```

## 4.2 线索管理

### 4.2.1 线索列表

```yaml
GET /api/v1/crm/leads
描述: 获取线索列表

参数:
  - page: 页码
  - pageSize: 每页数量
  - keyword: 搜索关键词
  - status: 线索状态
  - source: 来源渠道
  - ownerId: 负责人ID
  - scoreLevel: 质量等级 (high/medium/low)
  - createdStart: 创建时间开始
  - createdEnd: 创建时间结束

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "code": "L20260318001",
          "name": "线索名称",
          "company": "公司名称",
          "phone": "138****1234",
          "email": "xxx@example.com",
          "source": "官网",
          "status": "new",
          "score": 85,
          "scoreLevel": "high",
          "owner": {...},
          "followUpCount": 3,
          "nextFollowUp": "2026-03-20T10:00:00Z",
          "createdAt": "2026-03-18T08:00:00Z"
        }
      ],
      "total": 100
    }
  }
```

### 4.2.2 创建线索

```yaml
POST /api/v1/crm/leads
描述: 创建线索

请求体:
  {
    "name": "线索名称",
    "company": "公司名称",
    "phone": "电话",
    "email": "邮箱",
    "wechat": "微信",
    "source": "官网",
    "sourceDetail": "来源详情",
    "remark": "备注"
  }

响应:
  {
    "code": 0,
    "data": {
      "id": "xxx",
      "code": "L20260318001"
    }
  }
```

### 4.2.3 线索转化

```yaml
POST /api/v1/crm/leads/{id}/convert
描述: 转化线索为客户/商机

路径参数:
  id: 线索ID

请求体:
  {
    "convertTo": "customer",      # customer/opportunity
    "createOpportunity": true,    # 是否同时创建商机
    "opportunityName": "商机名称",
    "opportunityAmount": 100000,
    "opportunityStage": "qualification"
  }

响应:
  {
    "code": 0,
    "data": {
      "customerId": "xxx",
      "opportunityId": "xxx"
    },
    "message": "转化成功"
  }

错误码:
  - 41001: 线索已转化
  - 41002: 线索信息不完整，无法转化
```

### 4.2.4 线索分配

```yaml
POST /api/v1/crm/leads/assign
描述: 分配线索

请求体:
  {
    "ids": ["id1", "id2"],
    "ownerId": "xxx",
    "assignRule": "manual"       # manual/auto
  }
```

## 4.3 商机管理

### 4.3.1 商机列表

```yaml
GET /api/v1/crm/opportunities
描述: 获取商机列表

参数:
  - page: 页码
  - pageSize: 每页数量
  - keyword: 搜索关键词
  - stage: 商机阶段
  - result: 结果 (pending/won/lost)
  - customerId: 客户ID
  - ownerId: 负责人ID
  - expectedCloseStart: 预计成交日期开始
  - expectedCloseEnd: 预计成交日期结束
  - amountMin: 金额最小值
  - amountMax: 金额最大值

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "code": "O20260318001",
          "name": "商机名称",
          "customer": {...},
          "contact": {...},
          "amount": 300000.00,
          "stage": "proposal",
          "probability": 60,
          "expectedCloseDate": "2026-04-30",
          "result": "pending",
          "owner": {...},
          "createdAt": "2026-03-18T08:00:00Z"
        }
      ],
      "total": 100
    }
  }
```

### 4.3.2 销售管道

```yaml
GET /api/v1/crm/opportunities/pipeline
描述: 获取销售管道视图

参数:
  - ownerId: 负责人ID
  - deptId: 部门ID

响应:
  {
    "code": 0,
    "data": {
      "stages": [
        {
          "name": "线索确认",
          "code": "qualification",
          "amount": 2500000,
          "count": 12,
          "opportunities": [
            {
              "id": "xxx",
              "name": "道达科技采购项目",
              "customer": {...},
              "amount": 300000,
              "owner": {...}
            }
          ]
        },
        {
          "name": "需求确认",
          "code": "needs_analysis",
          "amount": 1800000,
          "count": 8,
          "opportunities": [...]
        }
      ],
      "total": {
        "amount": 6800000,
        "count": 30
      }
    }
  }
```

### 4.3.3 商机阶段推进

```yaml
POST /api/v1/crm/opportunities/{id}/stage
描述: 推进商机阶段

路径参数:
  id: 商机ID

请求体:
  {
    "stage": "proposal",
    "note": "进入报价阶段"
  }

响应:
  {
    "code": 0,
    "message": "阶段更新成功"
  }
```

### 4.3.4 赢单/输单

```yaml
POST /api/v1/crm/opportunities/{id}/close
描述: 关闭商机(赢单/输单)

路径参数:
  id: 商机ID

请求体:
  {
    "result": "won",             # won/lost
    "reason": "客户选择我们",
    "actualAmount": 280000,
    "actualCloseDate": "2026-03-18"
  }

响应:
  {
    "code": 0,
    "message": "商机已关闭"
  }
```

## 4.4 跟进记录

### 4.4.1 跟进记录列表

```yaml
GET /api/v1/crm/follow-ups
描述: 获取跟进记录列表

参数:
  - relatedType: 关联类型 (customer/lead/opportunity)
  - relatedId: 关联ID
  - page: 页码
  - pageSize: 每页数量

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "relatedType": "customer",
          "relatedId": "xxx",
          "type": "phone",
          "content": "电话沟通了客户需求...",
          "nextFollowUpDate": "2026-03-20T10:00:00Z",
          "nextFollowUpContent": "发送报价单",
          "attachments": [...],
          "creator": {...},
          "createdAt": "2026-03-18T14:30:00Z"
        }
      ],
      "total": 50
    }
  }
```

### 4.4.2 添加跟进记录

```yaml
POST /api/v1/crm/follow-ups
描述: 添加跟进记录

请求体:
  {
    "relatedType": "customer",
    "relatedId": "xxx",
    "type": "phone",              # phone/visit/email/wechat/meeting/other
    "content": "跟进内容",
    "nextFollowUpDate": "2026-03-20T10:00:00Z",
    "nextFollowUpContent": "下次跟进内容",
    "attachments": [
      {
        "fileId": "xxx",
        "fileName": "报价单.pdf"
      }
    ]
  }

响应:
  {
    "code": 0,
    "data": {
      "id": "xxx"
    }
  }
```

---

# 五、ERP模块接口

## 5.1 产品管理

### 5.1.1 产品列表

```yaml
GET /api/v1/erp/products
描述: 获取产品列表

参数:
  - page: 页码
  - pageSize: 每页数量
  - keyword: 搜索关键词
  - code: 产品编码
  - name: 产品名称
  - categoryId: 分类ID
  - type: 产品类型
  - status: 状态
  - isProducible: 是否可生产
  - isPurchasable: 是否可采购
  - isSellable: 是否可销售

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "code": "P001",
          "name": "电动观光车 DD-EV-2026",
          "shortName": "观光车A型",
          "spec": "4座/48V",
          "model": "DD-EV-2026",
          "category": {...},
          "brand": "道达",
          "unit": "台",
          "type": "finished",
          "costPrice": 35000.00,
          "salePrice": 58000.00,
          "status": "active",
          "mainImage": "https://...",
          "createdAt": "2026-01-01T00:00:00Z"
        }
      ],
      "total": 200
    }
  }
```

### 5.1.2 产品详情

```yaml
GET /api/v1/erp/products/{id}
描述: 获取产品详情

响应:
  {
    "code": 0,
    "data": {
      "id": "xxx",
      "code": "P001",
      "name": "电动观光车 DD-EV-2026",
      "shortName": "观光车A型",
      "spec": "4座/48V",
      "model": "DD-EV-2026",
      "category": {...},
      "brand": "道达",
      "unit": "台",
      "weight": 850.00,
      "volume": 5.2,
      "type": "finished",
      "isProducible": true,
      "isPurchasable": false,
      "isSellable": true,
      "hasBom": true,
      "costPrice": 35000.00,
      "salePrice": 58000.00,
      "minPrice": 52000.00,
      "status": "active",
      "mainImage": "https://...",
      "images": [...],
      "description": "产品描述...",
      "remark": "备注",
      "inventory": [
        {
          "warehouseId": "xxx",
          "warehouseName": "成品仓",
          "quantity": 50,
          "lockedQuantity": 5,
          "availableQuantity": 45
        }
      ],
      "bom": {
        "id": "xxx",
        "items": [...]
      }
    }
  }
```

### 5.1.3 创建产品

```yaml
POST /api/v1/erp/products
描述: 创建产品

请求体:
  {
    "code": "P001",
    "name": "产品名称",
    "shortName": "简称",
    "spec": "规格",
    "model": "型号",
    "categoryId": "xxx",
    "brand": "品牌",
    "unit": "台",
    "weight": 850,
    "volume": 5.2,
    "type": "finished",
    "isProducible": true,
    "isPurchasable": false,
    "isSellable": true,
    "costPrice": 35000,
    "salePrice": 58000,
    "minPrice": 52000,
    "description": "产品描述",
    "remark": "备注",
    "images": ["fileId1", "fileId2"]
  }

响应:
  {
    "code": 0,
    "data": {
      "id": "xxx"
    }
  }
```

## 5.2 库存管理

### 5.2.1 库存列表

```yaml
GET /api/v1/erp/inventory
描述: 获取库存列表

参数:
  - page: 页码
  - pageSize: 每页数量
  - keyword: 搜索关键词(产品编码/名称)
  - warehouseId: 仓库ID
  - categoryId: 分类ID
  - quantityMin: 库存数量最小值
  - quantityMax: 库存数量最大值
  - warningType: 预警类型 (low/over)

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "product": {...},
          "warehouse": {...},
          "location": "A-01-01",
          "quantity": 50,
          "lockedQuantity": 5,
          "availableQuantity": 45,
          "costPrice": 35000.00,
          "costAmount": 1750000.00,
          "safetyStock": 10,
          "minStock": 5,
          "maxStock": 100,
          "isLowStock": false
        }
      ],
      "total": 500,
      "summary": {
        "totalProducts": 200,
        "totalQuantity": 15000,
        "totalAmount": 12500000.00,
        "lowStockCount": 15
      }
    }
  }
```

### 5.2.2 库存流水

```yaml
GET /api/v1/erp/inventory/transactions
描述: 获取库存流水

参数:
  - page: 页码
  - pageSize: 每页数量
  - productId: 产品ID
  - warehouseId: 仓库ID
  - transType: 事务类型
  - transNo: 单据号
  - dateStart: 日期开始
  - dateEnd: 日期结束

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "transNo": "IN20260318001",
          "transType": "in",
          "product": {...},
          "warehouse": {...},
          "location": "A-01-01",
          "batchNo": "B20260318001",
          "beforeQuantity": 45,
          "changeQuantity": 10,
          "afterQuantity": 55,
          "costPrice": 35000.00,
          "costAmount": 350000.00,
          "relatedType": "purchase_in",
          "relatedNo": "PO20260318001",
          "remark": "采购入库",
          "creator": {...},
          "createdAt": "2026-03-18T14:30:00Z"
        }
      ],
      "total": 1000
    }
  }
```

### 5.2.3 库存调整

```yaml
POST /api/v1/erp/inventory/adjust
描述: 库存调整

请求体:
  {
    "items": [
      {
        "productId": "xxx",
        "warehouseId": "xxx",
        "location": "A-01-01",
        "quantity": 50,          # 调整后数量
        "reason": "盘点调整"
      }
    ],
    "remark": "月度盘点调整"
  }

响应:
  {
    "code": 0,
    "data": {
      "transNo": "AD20260318001"
    }
  }
```

## 5.3 采购管理

### 5.3.1 采购订单列表

```yaml
GET /api/v1/erp/purchases
描述: 获取采购订单列表

参数:
  - page: 页码
  - pageSize: 每页数量
  - keyword: 搜索关键词
  - status: 订单状态
  - supplierId: 供应商ID
  - dateStart: 日期开始
  - dateEnd: 日期结束

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "code": "PO20260318001",
          "supplier": {...},
          "totalAmount": 500000.00,
          "status": "pending",
          "orderDate": "2026-03-18",
          "expectedDate": "2026-03-25",
          "itemCount": 5,
          "creator": {...},
          "createdAt": "2026-03-18T10:00:00Z"
        }
      ],
      "total": 100
    }
  }
```

---

# 六、MES模块接口

## 6.1 工单管理

### 6.1.1 工单列表

```yaml
GET /api/v1/mes/work-orders
描述: 获取生产工单列表

参数:
  - page: 页码
  - pageSize: 每页数量
  - keyword: 搜索关键词
  - code: 工单编号
  - productId: 产品ID
  - lineId: 产线ID
  - status: 工单状态
  - priority: 优先级
  - planDateStart: 计划日期开始
  - planDateEnd: 计划日期结束

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "code": "WO20260318001",
          "product": {...},
          "planQuantity": 10,
          "completedQuantity": 7,
          "goodQuantity": 7,
          "rejectQuantity": 0,
          "priority": "urgent",
          "status": "in_progress",
          "line": {...},
          "planStartDate": "2026-03-18",
          "planEndDate": "2026-03-18",
          "actualStartTime": "2026-03-18T08:00:00Z",
          "progress": 70,
          "createdAt": "2026-03-17T15:00:00Z"
        }
      ],
      "total": 50
    }
  }
```

### 6.1.2 创建工单

```yaml
POST /api/v1/mes/work-orders
描述: 创建生产工单

请求体:
  {
    "orderId": "xxx",            # 销售订单ID (可选)
    "productId": "xxx",
    "quantity": 10,
    "priority": "normal",
    "planStartDate": "2026-03-18",
    "planEndDate": "2026-03-18",
    "lineId": "xxx",
    "routeId": "xxx",            # 工艺路线ID
    "remark": "备注"
  }

响应:
  {
    "code": 0,
    "data": {
      "id": "xxx",
      "code": "WO20260318001"
    }
  }
```

### 6.1.3 工单进度

```yaml
GET /api/v1/mes/work-orders/{id}/progress
描述: 获取工单进度详情

响应:
  {
    "code": 0,
    "data": {
      "workOrder": {...},
      "operations": [
        {
          "id": "xxx",
          "code": "OP-010",
          "name": "车架组装",
          "sequence": 1,
          "status": "completed",
          "planQuantity": 10,
          "completedQuantity": 10,
          "goodQuantity": 10,
          "rejectQuantity": 0,
          "equipment": {...},
          "operator": {...},
          "startTime": "2026-03-18T08:00:00Z",
          "endTime": "2026-03-18T10:00:00Z"
        },
        {
          "id": "xxx",
          "code": "OP-020",
          "name": "电气安装",
          "sequence": 2,
          "status": "in_progress",
          "planQuantity": 10,
          "completedQuantity": 7,
          "progress": 70
        }
      ],
      "materials": [
        {
          "material": {...},
          "requiredQuantity": 10,
          "issuedQuantity": 10,
          "status": "complete"
        }
      ]
    }
  }
```

### 6.1.4 工序报工

```yaml
POST /api/v1/mes/work-orders/{id}/operations/{operationId}/report
描述: 工序报工

请求体:
  {
    "quantity": 10,
    "goodQuantity": 9,
    "rejectQuantity": 1,
    "rejectReason": "尺寸偏差",
    "equipmentId": "xxx",
    "operatorId": "xxx",
    "startTime": "2026-03-18T08:00:00Z",
    "endTime": "2026-03-18T10:00:00Z",
    "remark": "备注"
  }

响应:
  {
    "code": 0,
    "message": "报工成功"
  }
```

## 6.2 生产看板

### 6.2.1 生产概览

```yaml
GET /api/v1/mes/dashboard/overview
描述: 获取生产概览数据

参数:
  - date: 日期
  - lineId: 产线ID

响应:
  {
    "code": 0,
    "data": {
      "planQuantity": 100,
      "actualQuantity": 78,
      "completionRate": 78,
      "yieldRate": 98.5,
      "oee": 85.2,
      "exceptionCount": 3,
      "pendingWorkOrders": 12,
      "onlineWorkers": 45,
      "runningEquipment": 18,
      "faultEquipment": 2
    }
  }
```

### 6.2.2 实时产量

```yaml
GET /api/v1/mes/dashboard/output
描述: 获取实时产量数据

参数:
  - date: 日期
  - interval: hour/shift

响应:
  {
    "code": 0,
    "data": {
      "total": 78,
      "trend": [
        { "time": "08:00", "plan": 12, "actual": 10 },
        { "time": "09:00", "plan": 12, "actual": 12 },
        { "time": "10:00", "plan": 12, "actual": 15 }
      ],
      "byLine": [
        { "lineId": "xxx", "lineName": "产线A", "quantity": 45 },
        { "lineId": "xxx", "lineName": "产线B", "quantity": 33 }
      ]
    }
  }
```

## 6.3 设备监控

### 6.3.1 设备列表

```yaml
GET /api/v1/mes/equipment
描述: 获取设备列表

参数:
  - page: 页码
  - pageSize: 每页数量
  - status: 设备状态
  - typeId: 设备类型ID
  - areaId: 区域ID
  - lineId: 产线ID

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "code": "EQ-001",
          "name": "装配机01",
          "type": {...},
          "area": {...},
          "line": {...},
          "location": "A区1号位",
          "status": "running",
          "currentWorkOrder": {...},
          "oee": 85.2,
          "lastMaintenanceDate": "2026-03-10",
          "nextMaintenanceDate": "2026-04-10"
        }
      ],
      "total": 50,
      "statistics": {
        "running": 18,
        "standby": 4,
        "maintenance": 2,
        "fault": 2,
        "offline": 1
      }
    }
  }
```

### 6.3.2 设备状态

```yaml
GET /api/v1/mes/equipment/{id}/status
描述: 获取设备实时状态

响应:
  {
    "code": 0,
    "data": {
      "equipmentId": "xxx",
      "status": "running",
      "mode": "auto",
      "speed": 100,
      "currentWorkOrder": {...},
      "parameters": [
        { "name": "温度", "value": 45, "unit": "℃", "status": "normal" },
        { "name": "压力", "value": 2.5, "unit": "MPa", "status": "normal" },
        { "name": "转速", "value": 1200, "unit": "rpm", "status": "normal" }
      ],
      "oee": {
        "availability": 92,
        "performance": 95,
        "quality": 98,
        "oee": 85.6
      },
      "alarms": [],
      "updatedAt": "2026-03-18T14:30:00Z"
    }
  }
```

## 6.4 质量追溯

### 6.4.1 正向追溯

```yaml
POST /api/v1/mes/traceability/forward
描述: 正向追溯(物料批次 → 产品)

请求体:
  {
    "materialId": "xxx",
    "batchNo": "BAT240301"
  }

响应:
  {
    "code": 0,
    "data": {
      "material": {
        "id": "xxx",
        "name": "电池组",
        "batchNo": "BAT240301",
        "supplier": {...},
        "incomingDate": "2026-03-01",
        "iqcResult": "合格"
      },
      "products": [
        {
          "serialNo": "SN20260318001",
          "product": {...},
          "productionDate": "2026-03-18",
          "workOrder": {...},
          "customer": {...}
        }
      ],
      "count": 2
    }
  }
```

### 6.4.2 反向追溯

```yaml
POST /api/v1/mes/traceability/backward
描述: 反向追溯(产品 → 物料批次)

请求体:
  {
    "serialNo": "SN20260318001"
  }

响应:
  {
    "code": 0,
    "data": {
      "product": {
        "serialNo": "SN20260318001",
        "product": {...},
        "productionDate": "2026-03-18",
        "workOrder": {...},
        "customer": {...}
      },
      "batches": [
        {
          "material": {...},
          "batchNo": "BAT240301",
          "supplier": {...},
          "incomingDate": "2026-03-01",
          "iqcResult": "合格"
        }
      ],
      "operations": [
        {
          "code": "OP-010",
          "name": "车架组装",
          "operator": {...},
          "equipment": {...},
          "startTime": "2026-03-18T08:00:00Z",
          "endTime": "2026-03-18T09:00:00Z",
          "result": "合格"
        }
      ]
    }
  }
```

---

# 七、售后服务接口

## 7.1 服务工单

### 7.1.1 工单列表

```yaml
GET /api/v1/service/work-orders
描述: 获取服务工单列表

参数:
  - page: 页码
  - pageSize: 每页数量
  - keyword: 搜索关键词
  - status: 工单状态
  - type: 工单类型
  - priority: 优先级
  - customerId: 客户ID
  - assigneeId: 负责人ID
  - slaStatus: SLA状态
  - dateStart: 日期开始
  - dateEnd: 日期结束

响应:
  {
    "code": 0,
    "data": {
      "list": [
        {
          "id": "xxx",
          "code": "WO20260318001",
          "title": "设备故障报修",
          "type": "repair",
          "priority": "urgent",
          "status": "in_progress",
          "customer": {...},
          "contact": {...},
          "equipment": {...},
          "assignee": {...},
          "sla": {
            "responseDeadline": "2026-03-18T09:45:00Z",
            "resolutionDeadline": "2026-03-18T17:30:00Z",
            "responseTime": 10,
            "remainingResolutionTime": 240
          },
          "createdAt": "2026-03-18T09:30:00Z"
        }
      ],
      "total": 128,
      "statistics": {
        "totalCount": 128,
        "pendingAssign": 23,
        "inProgress": 45,
        "completed": 48
      }
    }
  }
```

### 7.1.2 创建工单

```yaml
POST /api/v1/service/work-orders
描述: 创建服务工单

请求体:
  {
    "title": "工单标题",
    "description": "问题描述",
    "type": "repair",
    "priority": "normal",
    "source": "phone",
    "customerId": "xxx",
    "contactId": "xxx",
    "equipmentId": "xxx",
    "contractId": "xxx",
    "attachments": [...]
  }

响应:
  {
    "code": 0,
    "data": {
      "id": "xxx",
      "code": "WO20260318001"
    }
  }
```

### 7.1.3 分配工单

```yaml
POST /api/v1/service/work-orders/{id}/assign
描述: 分配服务工单

请求体:
  {
    "assigneeId": "xxx",
    "note": "分配备注"
  }
```

### 7.1.4 添加处理记录

```yaml
POST /api/v1/service/work-orders/{id}/timeline
描述: 添加工单处理记录

请求体:
  {
    "action": "response",
    "content": "处理内容",
    "attachments": [...]
  }
```

### 7.1.5 完成工单

```yaml
POST /api/v1/service/work-orders/{id}/complete
描述: 完成服务工单

请求体:
  {
    "solution": "解决方案",
    "parts": [
      { "partId": "xxx", "quantity": 1 }
    ],
    "expenses": [
      { "type": "travel", "amount": 200 }
    ],
    "attachments": [...]
  }
```

## 7.2 派单中心

### 7.2.1 派单中心数据

```yaml
GET /api/v1/service/dispatch-center
描述: 获取派单中心数据

响应:
  {
    "code": 0,
    "data": {
      "pendingOrders": [...],
      "technicians": [
        {
          "id": "xxx",
          "name": "张三",
          "status": "idle",
          "currentTask": null,
          "location": {...},
          "todayCompleted": 3,
          "rating": 4.8,
          "skills": ["电动车", "控制器"]
        }
      ],
      "suggestions": [
        {
          "workOrderId": "xxx",
          "suggestedTechnician": "xxx",
          "reason": "距离近、技能匹配、空闲状态"
        }
      ]
    }
  }
```

### 7.2.2 智能派单

```yaml
POST /api/v1/service/dispatch/auto
描述: 智能派单

请求体:
  {
    "workOrderIds": ["id1", "id2"],
    "strategy": "nearest"         # nearest/balanced/skill_match
  }

响应:
  {
    "code": 0,
    "data": {
      "results": [
        {
          "workOrderId": "xxx",
          "technicianId": "xxx",
          "scheduledTime": "2026-03-18T14:00:00Z"
        }
      ]
    }
  }
```

---

# 八、WebSocket接口

## 8.1 连接规范

```yaml
连接地址:
  ws://host/api/v1/ws?token={accessToken}

连接参数:
  - token: 访问令牌

连接示例:
  const ws = new WebSocket('ws://localhost:8080/api/v1/ws?token=xxx');

心跳机制:
  - 客户端每30秒发送: { "action": "ping" }
  - 服务端响应: { "action": "pong" }

重连机制:
  - 断开后自动重连，最多5次
  - 重连间隔: 1s, 2s, 4s, 8s, 16s
```

## 8.2 订阅消息

```typescript
// 订阅主题
interface SubscribeMessage {
  action: 'subscribe';
  topics: string[];
}

// 示例
{
  "action": "subscribe",
  "topics": [
    "equipment.status",
    "equipment.parameters.EQ-001",
    "production.progress.LINE-A",
    "workorder.status.WO-001"
  ]
}

// 取消订阅
{
  "action": "unsubscribe",
  "topics": ["equipment.status"]
}
```

## 8.3 推送消息

```typescript
// 推送消息格式
interface PushMessage {
  topic: string;
  timestamp: number;
  data: any;
}

// 设备状态变化
{
  "topic": "equipment.status",
  "timestamp": 1710745800000,
  "data": {
    "equipmentId": "EQ-001",
    "equipmentName": "装配机01",
    "oldStatus": "running",
    "newStatus": "standby",
    "reason": "等待物料"
  }
}

// 设备参数变化
{
  "topic": "equipment.parameters.EQ-001",
  "timestamp": 1710745800000,
  "data": {
    "equipmentId": "EQ-001",
    "parameters": [
      { "name": "温度", "value": 46, "status": "normal" }
    ]
  }
}

// 生产进度更新
{
  "topic": "production.progress.LINE-A",
  "timestamp": 1710745800000,
  "data": {
    "lineId": "LINE-A",
    "workOrderId": "WO-001",
    "operationId": "OP-030",
    "completed": 7,
    "total": 10,
    "progress": 70
  }
}

// 工单状态变化
{
  "topic": "workorder.status.WO-001",
  "timestamp": 1710745800000,
  "data": {
    "workOrderId": "WO-001",
    "oldStatus": "assigned",
    "newStatus": "in_progress",
    "assignee": {...}
  }
}

// 告警消息
{
  "topic": "alarm",
  "timestamp": 1710745800000,
  "data": {
    "type": "equipment",
    "level": "warning",
    "source": "EQ-001",
    "message": "设备温度接近上限",
    "value": 48,
    "threshold": 50
  }
}
```

## 8.4 订阅主题列表

```yaml
系统级:
  - system.notification      # 系统通知
  - system.announcement      # 系统公告

设备级:
  - equipment.status         # 所有设备状态
  - equipment.status.{id}    # 指定设备状态
  - equipment.parameters.{id} # 设备参数
  - equipment.alarm          # 设备告警

生产级:
  - production.progress.{lineId}  # 产线进度
  - production.output             # 产量更新
  - production.exception          # 生产异常

工单级:
  - workorder.status.{id}   # 工单状态
  - workorder.sla.warning   # SLA预警
  - workorder.sla.timeout   # SLA超时

消息级:
  - message.unread          # 未读消息
  - notification            # 通知提醒
```

---

# 九、错误码定义

## 9.1 通用错误码 (1xxxx)

| 错误码 | 错误描述 |
|--------|----------|
| 10001 | 参数校验失败 |
| 10002 | 请求方法不允许 |
| 10003 | 资源不存在 |
| 10004 | 请求频率超限 |
| 10005 | 服务器内部错误 |

## 9.2 认证错误码 (2xxxx)

| 错误码 | 错误描述 |
|--------|----------|
| 20001 | 用户名或密码错误 |
| 20002 | 账号已被禁用 |
| 20003 | 验证码错误 |
| 20004 | 账号已被锁定 |
| 20005 | 刷新令牌无效 |
| 20006 | 刷新令牌已过期 |
| 20007 | 未登录或登录已过期 |
| 20008 | 无权限访问 |

## 9.3 CRM错误码 (4xxxx)

| 错误码 | 错误描述 |
|--------|----------|
| 40001 | 客户不存在 |
| 40002 | 无权限查看该客户 |
| 40003 | 客户名称已存在 |
| 40004 | 联系人信息不完整 |
| 40005 | 客户存在关联数据，无法删除 |
| 41001 | 线索已转化 |
| 41002 | 线索信息不完整，无法转化 |

## 9.4 ERP错误码 (5xxxx)

| 错误码 | 错误描述 |
|--------|----------|
| 50001 | 产品不存在 |
| 50002 | 产品编码已存在 |
| 50003 | 库存不足 |
| 50004 | 库存已锁定 |

## 9.5 MES错误码 (6xxxx)

| 错误码 | 错误描述 |
|--------|----------|
| 60001 | 工单不存在 |
| 60002 | 工单状态不允许此操作 |
| 60003 | 工序不存在 |
| 60004 | 设备不存在 |
| 60005 | 设备状态异常 |

## 9.6 服务错误码 (7xxxx)

| 错误码 | 错误描述 |
|--------|----------|
| 70001 | 服务工单不存在 |
| 70002 | 工单状态不允许此操作 |
| 70003 | 技术人员不可用 |
| 70004 | 配件库存不足 |

---

*文档版本: v1.0*  
*最后更新: 2026-03-18*  
*作者: 渔晓白*