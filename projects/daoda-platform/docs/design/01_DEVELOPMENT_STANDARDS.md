# 道达智能数字化平台 - 开发规范与编码标准

> **版本**: v1.0  
> **创建日期**: 2026-03-19  
> **适用范围**: 全体开发人员、所有代码仓库  
> **强制级别**: 必须遵守

---

## 📋 文档目录

1. [代码规范](#一代码规范)
2. [命名规范](#二命名规范)
3. [Git规范](#三git规范)
4. [API规范](#四api规范)
5. [数据库规范](#五数据库规范)
6. [前端规范](#六前端规范)
7. [后端规范](#七后端规范)
8. [测试规范](#八测试规范)
9. [安全规范](#九安全规范)
10. [文档规范](#十文档规范)

---

## 一、代码规范

### 1.1 TypeScript 编码规范

```typescript
// ============================================
// TypeScript 代码规范
// ============================================

// ✅ 使用 const/let，禁用 var
const name = 'John';
let count = 0;

// ✅ 明确类型定义
function getCustomer(id: string): Promise<Customer> {
  return this.customerRepository.findOne(id);
}

// ✅ 使用接口定义对象结构
interface CustomerQuery {
  name?: string;
  status?: CustomerStatus;
  page?: number;
  pageSize?: number;
}

// ✅ 使用枚举或联合类型定义有限值
enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

type CustomerType = 'individual' | 'corporate';

// ✅ 使用可选链和空值合并
const customerName = customer?.profile?.name ?? 'Unknown';

// ✅ 使用 async/await，避免回调地狱
async function processOrder(orderId: string): Promise<void> {
  try {
    const order = await this.orderService.getOrder(orderId);
    const validated = await this.validateOrder(order);
    await this.paymentService.processPayment(validated);
    await this.notificationService.sendConfirmation(order);
  } catch (error) {
    this.logger.error('Order processing failed', error);
    throw error;
  }
}

// ✅ 错误处理使用自定义错误类
class CustomerNotFoundError extends Error {
  constructor(id: string) {
    super(`Customer not found: ${id}`);
    this.name = 'CustomerNotFoundError';
  }
}

// ✅ 使用装饰器增强代码
@Controller('customers')
@ApiTags('客户管理')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':id')
  @ApiOperation({ summary: '获取客户详情' })
  @ApiResponse({ status: 200, description: '成功' })
  async getCustomer(@Param('id') id: string): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }
}
```

### 1.2 代码注释规范

```typescript
// ============================================
// 代码注释规范
// ============================================

/**
 * 根据ID获取客户详情
 * 
 * @param id - 客户ID
 * @returns 客户详情
 * @throws CustomerNotFoundError - 客户不存在时抛出
 * 
 * @example
 * const customer = await customerService.getCustomerById('123');
 */
async getCustomerById(id: string): Promise<Customer> {
  // 验证ID格式
  if (!this.isValidId(id)) {
    throw new InvalidIdError(id);
  }

  // 查询客户
  const customer = await this.customerRepository.findOne(id);
  
  // 检查是否存在
  if (!customer) {
    throw new CustomerNotFoundError(id);
  }

  return customer;
}

// ✅ TODO注释规范
// TODO: [高优先级] 添加缓存支持 - @张三 2026-03-19
// FIXME: 并发情况下可能出现重复创建
// HACK: 临时解决方案，需要重构
// NOTE: 这里使用延迟加载是为了优化性能
```

### 1.3 代码格式化

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

```json
// .eslintrc.js
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

---

## 二、命名规范

### 2.1 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `CustomerList.tsx` |
| 服务文件 | camelCase + .service | `customer.service.ts` |
| 控制器文件 | camelCase + .controller | `customer.controller.ts` |
| 实体文件 | camelCase + .entity | `customer.entity.ts` |
| DTO文件 | camelCase + .dto | `create-customer.dto.ts` |
| 接口文件 | camelCase + .interface | `customer.interface.ts` |
| 类型文件 | camelCase + .d | `customer.d.ts` |
| 常量文件 | UPPER_SNAKE_CASE | `ERROR_CODES.constant.ts` |
| 工具文件 | camelCase + .util | `date.util.ts` |
| 配置文件 | camelCase + .config | `database.config.ts` |
| Hook文件 | use + PascalCase | `useCustomer.ts` |
| Store文件 | camelCase + .store | `customer.store.ts` |

### 2.2 变量命名

```typescript
// ✅ 变量: camelCase
const customerName = 'John';
const orderList = [];
const totalPrice = 0;

// ✅ 常量: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 20;
const API_BASE_URL = 'https://api.example.com';

// ✅ 枚举: PascalCase，值为 camelCase
const CustomerStatus = {
  Active: 'active',
  Inactive: 'inactive',
  Pending: 'pending',
} as const;

// ✅ 私有变量: 下划线前缀
class CustomerService {
  private _cache: Map<string, Customer>;
  private _config: ServiceConfig;
}

// ✅ 布尔变量: is/has/can/should 前缀
const isLoading = false;
const hasPermission = true;
const canEdit = false;
const shouldRender = true;
```

### 2.3 函数命名

```typescript
// ✅ 查询: get + 实体 + By + 条件
function getCustomerById(id: string) { }
function getCustomersByStatus(status: string) { }
function getCustomerList(query: Query) { }

// ✅ 创建: create + 实体
function createCustomer(data: CreateCustomerDto) { }
function createOrder(data: CreateOrderDto) { }

// ✅ 更新: update + 实体
function updateCustomer(id: string, data: UpdateCustomerDto) { }
function updateOrderStatus(id: string, status: string) { }

// ✅ 删除: delete + 实体
function deleteCustomer(id: string) { }
function deleteOrder(id: string) { }

// ✅ 计算: calculate + 结果
function calculateTotalAmount(items: Item[]) { }
function calculateDiscount(price: number, rate: number) { }

// ✅ 验证: validate + 对象
function validateEmail(email: string) { }
function validateOrderData(data: OrderData) { }

// ✅ 转换: transform + 对象 / to + 目标类型
function transformData(data: any) { }
function toCamelCase(str: string) { }

// ✅ 事件处理: handle + 事件名
function handleButtonClick(event: Event) { }
function handleFormSubmit(data: FormData) { }

// ✅ 异步操作: 前缀表示动作
async function fetchCustomer(id: string) { }
async function saveCustomer(data: Customer) { }
```

### 2.4 类命名

```typescript
// ✅ 服务: 实体 + Service
class CustomerService { }
class OrderService { }

// ✅ 控制器: 实体 + Controller
class CustomerController { }
class OrderController { }

// ✅ 仓储: 实体 + Repository
class CustomerRepository { }
class OrderRepository { }

// ✅ 实体: 实体名 (无后缀)
class Customer { }
class Order { }

// ✅ DTO: 动作 + 实体 + Dto
class CreateCustomerDto { }
class UpdateCustomerDto { }
class QueryCustomerDto { }

// ✅ 异常: 描述 + Error
class CustomerNotFoundError extends Error { }
class InvalidOrderStatusError extends Error { }

// ✅ 工厂: 产品 + Factory
class CustomerFactory { }
class OrderFactory { }

// ✅ 策略: 策略名 + Strategy
class PricingStrategy { }
class DiscountStrategy { }
```

### 2.5 接口命名

```typescript
// ✅ 接口: I + 实体名
interface ICustomer { }
interface IOrder { }

// ✅ 服务接口: I + 实体 + Service
interface ICustomerService { }
interface IOrderService { }

// ✅ 仓储接口: I + 实体 + Repository
interface ICustomerRepository { }
interface IOrderRepository { }

// ✅ 配置接口: 描述 + Config
interface DatabaseConfig { }
interface ApiConfig { }

// ✅ 选项接口: 描述 + Options
interface QueryOptions { }
interface PaginationOptions { }
```

### 2.6 数据库命名

```sql
-- ✅ 表名: snake_case, 复数形式
CREATE TABLE customers ( );
CREATE TABLE order_items ( );
CREATE TABLE work_orders ( );

-- ✅ 字段名: snake_case
customer_name VARCHAR(100);
created_at TIMESTAMP;
is_active BOOLEAN;

-- ✅ 主键: id 或 表名_id
id UUID PRIMARY KEY;
customer_id UUID PRIMARY KEY;

-- ✅ 外键: 关联表名_id
customer_id UUID REFERENCES customers(id);
order_id UUID REFERENCES orders(id);

-- ✅ 索引: idx_表名_字段名
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_status ON orders(status);

-- ✅ 唯一约束: uq_表名_字段名
CREATE UNIQUE INDEX uq_customers_email ON customers(email);
```

---

## 三、Git规范

### 3.1 分支命名

```
main                # 主分支，生产环境代码
develop             # 开发分支，最新开发代码

feature/xxx         # 功能分支，开发新功能
feature/crm-customer-import
feature/erp-inventory-batch

bugfix/xxx          # 修复分支，修复非紧急Bug
bugfix/crm-email-validation
bugfix/erp-price-calculation

hotfix/xxx          # 热修复分支，修复生产环境紧急Bug
hotfix/auth-token-expire
hotfix/payment-gateway-error

release/x.x.x       # 发布分支，准备发布版本
release/1.0.0
release/1.1.0
```

### 3.2 提交信息规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### type 类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | feat(crm): 新增客户批量导入功能 |
| `fix` | 修复Bug | fix(erp): 修复库存盘点数据不一致问题 |
| `docs` | 文档更新 | docs: 更新API文档 |
| `style` | 代码格式调整 | style: 格式化代码 |
| `refactor` | 重构 | refactor(crm): 重构客户查询逻辑 |
| `perf` | 性能优化 | perf(erp): 优化订单查询性能 |
| `test` | 测试相关 | test(crm): 添加客户服务单元测试 |
| `chore` | 构建/工具/依赖 | chore: 更新依赖版本 |
| `ci` | CI配置相关 | ci: 添加自动化测试流程 |
| `revert` | 回滚提交 | revert: 回滚xxx提交 |

#### scope 范围

| scope | 说明 |
|-------|------|
| `crm` | CRM模块 |
| `erp` | ERP模块 |
| `service` | 售后服务模块 |
| `mes` | MES模块 |
| `auth` | 认证模块 |
| `workflow` | 工作流模块 |
| `common` | 公共模块 |
| `portal` | 门户前端 |
| `backend` | 后端服务 |

#### 提交示例

```bash
# 新功能
feat(crm): 新增客户批量导入功能

- 支持Excel/CSV格式导入
- 自动去重和验证
- 导入结果邮件通知

Closes #123

# Bug修复
fix(erp): 修复库存盘点数据不一致问题

盘点半成品时，由于事务处理不当，
导致盘点单和库存表数据不一致。

问题原因：事务未正确嵌套
解决方案：使用分布式事务

Fixes #456

# 重构
refactor(service): 重构工单分配逻辑

将工单分配逻辑从Controller抽离到Service层，
支持更灵活的分配策略配置。

Breaking change: 分配API参数格式变更

# 文档
docs(workflow): 新增工作流开发指南

添加审批工作流集成开发文档，
包含流程定义、任务处理、事件监听等内容。
```

### 3.3 Pull Request 规范

```markdown
## PR 标题
feat(crm): 新增客户批量导入功能

## 变更说明
- 新增客户批量导入接口
- 新增Excel/CSV解析服务
- 新增导入结果通知功能

## 关联Issue
Closes #123

## 测试情况
- [x] 单元测试已通过
- [x] 集成测试已通过
- [x] 手动测试已完成

## 变更影响
- [ ] 数据库变更（需执行迁移）
- [ ] API变更（需更新文档）
- [ ] 配置变更（需更新配置）

## 截图
（如有UI变更，附上截图）
```

### 3.4 Code Review 清单

```markdown
## 代码审查清单

### 功能正确性
- [ ] 功能是否符合需求
- [ ] 边界条件是否处理
- [ ] 错误处理是否完善

### 代码质量
- [ ] 命名是否清晰
- [ ] 逻辑是否简洁
- [ ] 是否有重复代码
- [ ] 注释是否充分

### 性能
- [ ] 是否有性能问题
- [ ] 数据库查询是否优化
- [ ] 是否有内存泄漏风险

### 安全
- [ ] 输入是否验证
- [ ] 权限是否检查
- [ ] 敏感数据是否加密

### 测试
- [ ] 单元测试覆盖
- [ ] 集成测试覆盖
- [ ] 测试是否通过
```

---

## 四、API规范

### 4.1 RESTful API 设计

```
# ✅ URL设计规范

# 使用名词复数
GET    /api/v1/customers
GET    /api/v1/orders

# 层级关系清晰
GET    /api/v1/customers/{id}/orders
GET    /api/v1/orders/{id}/items

# 查询参数用于过滤、排序、分页
GET    /api/v1/customers?status=active&sort=-created_at&page=1&page_size=20

# 使用kebab-case
GET    /api/v1/order-items

# ❌ 避免动词
GET    /api/v1/getCustomers
POST   /api/v1/createCustomer
```

### 4.2 HTTP 方法语义

| 方法 | 用途 | 幂等性 |
|------|------|--------|
| `GET` | 查询资源 | 是 |
| `POST` | 创建资源 | 否 |
| `PUT` | 完整更新资源 | 是 |
| `PATCH` | 部分更新资源 | 是 |
| `DELETE` | 删除资源 | 是 |

### 4.3 HTTP 状态码

| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| `200` | OK | 成功 |
| `201` | Created | 创建成功 |
| `204` | No Content | 删除成功，无返回内容 |
| `400` | Bad Request | 请求参数错误 |
| `401` | Unauthorized | 未认证 |
| `403` | Forbidden | 无权限 |
| `404` | Not Found | 资源不存在 |
| `409` | Conflict | 资源冲突 |
| `422` | Unprocessable Entity | 业务逻辑验证失败 |
| `429` | Too Many Requests | 请求过于频繁 |
| `500` | Internal Server Error | 服务器内部错误 |

### 4.4 响应格式

```typescript
// ✅ 成功响应（单个资源）
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "123",
    "name": "张三",
    "status": "active"
  },
  "timestamp": "2026-03-19T10:00:00Z"
}

// ✅ 成功响应（列表资源）
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      { "id": "1", "name": "张三" },
      { "id": "2", "name": "李四" }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": "2026-03-19T10:00:00Z"
}

// ✅ 错误响应
{
  "code": 400,
  "message": "参数验证失败",
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    },
    {
      "field": "phone",
      "message": "手机号不能为空"
    }
  ],
  "timestamp": "2026-03-19T10:00:00Z",
  "traceId": "abc123"
}
```

### 4.5 分页参数

```typescript
// 请求参数
?page=1&page_size=20

// 响应包含
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 4.6 排序参数

```bash
# 单字段排序
?sort=created_at          # 升序
?sort=-created_at         # 降序

# 多字段排序
?sort=status,-created_at
```

### 4.7 过滤参数

```bash
# 精确匹配
?status=active

# 模糊匹配
?name__like=张

# 范围查询
?created_at__gte=2026-01-01&created_at__lte=2026-12-31

# 包含查询
?status__in=active,pending
```

---

## 五、数据库规范

### 5.1 表设计规范

```sql
-- ✅ 主键使用 UUID
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- ...
);

-- ✅ 必备字段
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 业务字段
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1
);

-- ✅ 软删除
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  -- 业务字段
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES users(id)
);

-- ✅ 使用合适的字段类型
-- 字符串: VARCHAR(n) / TEXT
-- 金额: DECIMAL(precision, scale)
-- 状态: VARCHAR(20) / ENUM
-- 时间: TIMESTAMP WITH TIME ZONE
-- JSON: JSONB
```

### 5.2 索引规范

```sql
-- ✅ 主键索引（自动创建）
PRIMARY KEY (id)

-- ✅ 唯一索引
CREATE UNIQUE INDEX uq_customers_email ON customers(email);

-- ✅ 普通索引
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ✅ 复合索引（注意顺序）
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);

-- ✅ 部分索引
CREATE INDEX idx_active_customers ON customers(email) WHERE is_deleted = FALSE;

-- ✅ 全文索引
CREATE INDEX idx_customers_name_search ON customers USING gin(to_tsvector('simple', name));
```

### 5.3 查询规范

```sql
-- ✅ 避免 SELECT *
SELECT id, name, email FROM customers;

-- ✅ 使用参数化查询（防止SQL注入）
-- 使用 Prisma/TypeORM 等ORM框架

-- ✅ 分页查询
SELECT * FROM customers
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;

-- ✅ 使用索引
-- 确保 WHERE/ORDER BY/GROUP BY 字段有索引

-- ✅ 批量操作
INSERT INTO customers (name, email) VALUES
  ('张三', 'zhangsan@example.com'),
  ('李四', 'lisi@example.com');
```

---

## 六、前端规范

### 6.1 组件规范

```tsx
// ✅ 组件结构
import { FC, memo } from 'react';
import { Button, Form, Input } from 'antd';
import { useCustomerStore } from '@/stores/customer.store';
import { useCustomer } from '@/hooks/useCustomer';
import styles from './CustomerForm.module.less';

// 类型定义
interface CustomerFormProps {
  customerId?: string;
  onSuccess?: (customer: Customer) => void;
}

// 组件实现
export const CustomerForm: FC<CustomerFormProps> = memo(({ customerId, onSuccess }) => {
  // Hooks
  const { customer, loading, fetchCustomer, createCustomer, updateCustomer } = useCustomer();
  const { setRefresh } = useCustomerStore();
  const [form] = Form.useForm();

  // Effects
  useEffect(() => {
    if (customerId) {
      fetchCustomer(customerId);
    }
  }, [customerId]);

  // Handlers
  const handleSubmit = async (values: CreateCustomerDto) => {
    try {
      const result = customerId
        ? await updateCustomer(customerId, values)
        : await createCustomer(values);
      message.success('保存成功');
      onSuccess?.(result);
      setRefresh();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // Render
  return (
    <Form form={form} onFinish={handleSubmit}>
      {/* 表单内容 */}
    </Form>
  );
});

CustomerForm.displayName = 'CustomerForm';
```

### 6.2 状态管理规范

```typescript
// ✅ Zustand Store
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CustomerState {
  // 状态
  customers: Customer[];
  currentCustomer: Customer | null;
  loading: boolean;
  total: number;

  // 操作
  setCustomers: (customers: Customer[]) => void;
  setCurrentCustomer: (customer: Customer | null) => void;
  setLoading: (loading: boolean) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  reset: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  devtools(
    persist(
      (set) => ({
        // 初始状态
        customers: [],
        currentCustomer: null,
        loading: false,
        total: 0,

        // 操作实现
        setCustomers: (customers) => set({ customers }),
        setCurrentCustomer: (customer) => set({ currentCustomer: customer }),
        setLoading: (loading) => set({ loading }),
        addCustomer: (customer) =>
          set((state) => ({ customers: [...state.customers, customer] })),
        updateCustomer: (id, data) =>
          set((state) => ({
            customers: state.customers.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
          })),
        deleteCustomer: (id) =>
          set((state) => ({
            customers: state.customers.filter((c) => c.id !== id),
          })),
        reset: () =>
          set({
            customers: [],
            currentCustomer: null,
            loading: false,
            total: 0,
          }),
      }),
      { name: 'customer-store' }
    )
  )
);
```

### 6.3 样式规范

```less
// ✅ CSS Modules
// CustomerList.module.less

.container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.table {
  :global {
    .ant-table-thead > tr > th {
      background: #fafafa;
    }
  }
}

// ✅ 使用变量
@primary-color: #1890ff;
@border-radius: 8px;

.container {
  border-radius: @border-radius;
}

.button {
  background-color: @primary-color;
}
```

---

## 七、后端规范

### 7.1 模块结构

```
module/
├── controllers/          # 控制器
│   ├── index.ts
│   └── customer.controller.ts
├── services/             # 服务
│   ├── index.ts
│   └── customer.service.ts
├── repositories/         # 仓储
│   ├── index.ts
│   └── customer.repository.ts
├── entities/             # 实体
│   ├── index.ts
│   └── customer.entity.ts
├── dto/                  # DTO
│   ├── index.ts
│   ├── create-customer.dto.ts
│   ├── update-customer.dto.ts
│   └── query-customer.dto.ts
├── interfaces/           # 接口
│   └── customer.interface.ts
├── events/               # 事件
│   └── customer.event.ts
├── subscribers/          # 订阅者
│   └── customer.subscriber.ts
├── guards/               # 守卫
│   └── customer.guard.ts
├── interceptors/         # 拦截器
│   └── customer.interceptor.ts
├── pipes/                # 管道
│   └── customer.pipe.ts
├── constants/            # 常量
│   └── customer.constant.ts
├── utils/                # 工具
│   └── customer.util.ts
├── customer.module.ts    # 模块定义
└── index.ts              # 导出
```

### 7.2 Controller 规范

```typescript
// customer.controller.ts

@Controller('customers')
@ApiTags('客户管理')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: '获取客户列表' })
  @ApiResponse({ status: 200, description: '成功' })
  async findAll(@Query() query: QueryCustomerDto): Promise<PaginatedResult<Customer>> {
    return this.customerService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取客户详情' })
  @ApiResponse({ status: 200, description: '成功' })
  @ApiResponse({ status: 404, description: '客户不存在' })
  async findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建客户' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @CurrentUser() user: User,
  ): Promise<Customer> {
    return this.customerService.create(createCustomerDto, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新客户' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @CurrentUser() user: User,
  ): Promise<Customer> {
    return this.customerService.update(id, updateCustomerDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除客户' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.customerService.remove(id);
  }
}
```

### 7.3 Service 规范

```typescript
// customer.service.ts

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly cacheManager: Cache,
  ) {}

  /**
   * 获取客户列表
   */
  async findAll(query: QueryCustomerDto): Promise<PaginatedResult<Customer>> {
    const { page = 1, pageSize = 20, ...filters } = query;

    // 缓存键
    const cacheKey = `customers:${JSON.stringify(query)}`;

    // 尝试从缓存获取
    const cached = await this.cacheManager.get<PaginatedResult<Customer>>(cacheKey);
    if (cached) {
      return cached;
    }

    // 查询数据库
    const [items, total] = await this.customerRepository.findAndCount({
      where: this.buildWhereClause(filters),
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    const result = {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    // 写入缓存
    await this.cacheManager.set(cacheKey, result, 300);

    return result;
  }

  /**
   * 获取客户详情
   */
  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne(id);
    if (!customer) {
      throw new CustomerNotFoundError(id);
    }
    return customer;
  }

  /**
   * 创建客户
   */
  async create(dto: CreateCustomerDto, userId: string): Promise<Customer> {
    // 验证邮箱唯一性
    const exists = await this.customerRepository.findByEmail(dto.email);
    if (exists) {
      throw new DuplicateEmailError(dto.email);
    }

    // 创建客户
    const customer = this.customerRepository.create({
      ...dto,
      createdBy: userId,
    });

    const saved = await this.customerRepository.save(customer);

    // 发布事件
    this.eventEmitter.emit('customer.created', saved);

    this.logger.log(`Customer created: ${saved.id}`);
    return saved;
  }

  /**
   * 更新客户
   */
  async update(id: string, dto: UpdateCustomerDto, userId: string): Promise<Customer> {
    const customer = await this.findOne(id);

    // 更新客户
    Object.assign(customer, dto, { updatedBy: userId });
    const saved = await this.customerRepository.save(customer);

    // 发布事件
    this.eventEmitter.emit('customer.updated', saved);

    this.logger.log(`Customer updated: ${id}`);
    return saved;
  }

  /**
   * 删除客户
   */
  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.softDelete(id);

    // 发布事件
    this.eventEmitter.emit('customer.deleted', { id, customer });

    this.logger.log(`Customer deleted: ${id}`);
  }

  // 私有方法
  private buildWhereClause(filters: any): any {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.name) {
      where.name = Like(`%${filters.name}%`);
    }

    return where;
  }
}
```

---

## 八、测试规范

### 8.1 单元测试

```typescript
// customer.service.spec.ts

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: MockType<CustomerRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: CustomerRepository, useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get(CustomerService);
    repository = module.get(CustomerRepository);
  });

  describe('findAll', () => {
    it('应该返回分页客户列表', async () => {
      // Arrange
      const mockCustomers = [
        { id: '1', name: '张三' },
        { id: '2', name: '李四' },
      ];
      repository.findAndCount.mockResolvedValue([mockCustomers, 2]);

      // Act
      const result = await service.findAll({ page: 1, pageSize: 20 });

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 20,
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('应该返回客户详情', async () => {
      // Arrange
      const mockCustomer = { id: '1', name: '张三' };
      repository.findOne.mockResolvedValue(mockCustomer);

      // Act
      const result = await service.findOne('1');

      // Assert
      expect(result).toEqual(mockCustomer);
    });

    it('客户不存在时应该抛出错误', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('999')).rejects.toThrow(CustomerNotFoundError);
    });
  });

  describe('create', () => {
    it('应该创建客户', async () => {
      // Arrange
      const dto = { name: '张三', email: 'zhangsan@example.com' };
      repository.findByEmail.mockResolvedValue(null);
      repository.create.mockReturnValue({ id: '1', ...dto });
      repository.save.mockResolvedValue({ id: '1', ...dto });

      // Act
      const result = await service.create(dto, 'user1');

      // Assert
      expect(result.name).toBe('张三');
      expect(repository.save).toHaveBeenCalled();
    });

    it('邮箱重复时应该抛出错误', async () => {
      // Arrange
      const dto = { name: '张三', email: 'existing@example.com' };
      repository.findByEmail.mockResolvedValue({ id: '1', email: dto.email });

      // Act & Assert
      await expect(service.create(dto, 'user1')).rejects.toThrow(DuplicateEmailError);
    });
  });
});
```

### 8.2 E2E测试

```typescript
// customer.e2e-spec.ts

describe('CustomerController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 获取访问令牌
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'password' });
    accessToken = response.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/customers (GET)', () => {
    it('应该返回客户列表', () => {
      return request(app.getHttpServer())
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.items).toBeDefined();
          expect(res.body.data.pagination).toBeDefined();
        });
    });
  });

  describe('/api/v1/customers (POST)', () => {
    it('应该创建客户', () => {
      return request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: '测试客户',
          email: 'test@example.com',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.name).toBe('测试客户');
        });
    });

    it('缺少必填字段时应该返回400', () => {
      return request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });
  });
});
```

### 8.3 测试覆盖率要求

| 类型 | 最低覆盖率 |
|------|------------|
| 单元测试 | 80% |
| 分支覆盖 | 70% |
| 函数覆盖 | 85% |
| 行覆盖 | 80% |

---

## 九、安全规范

### 9.1 认证授权

```typescript
// ✅ JWT认证
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}

// ✅ 角色守卫
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}

// ✅ 权限装饰器
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

// ✅ 权限守卫
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.hasPermissions(user, requiredPermissions);
  }

  private hasPermissions(user: User, permissions: string[]): boolean {
    return permissions.every((p) => user.permissions.includes(p));
  }
}
```

### 9.2 输入验证

```typescript
// ✅ DTO验证
export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty({ message: '客户名称不能为空' })
  @MaxLength(100, { message: '客户名称不能超过100个字符' })
  name: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsPhoneNumber('CN', {}, { message: '手机号格式不正确' })
  phone: string;

  @IsOptional()
  @IsEnum(CustomerStatus, { message: '状态值不正确' })
  status?: CustomerStatus;
}
```

### 9.3 敏感数据处理

```typescript
// ✅ 密码加密
import * as bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ✅ 敏感字段脱敏
@Entity('users')
export class User {
  @Column()
  password: string;

  @Column()
  idCard: string;

  // 脱敏显示
  get maskedIdCard(): string {
    if (!this.idCard || this.idCard.length < 8) return this.idCard;
    return this.idCard.substring(0, 4) + '****' + this.idCard.substring(14);
  }
}

// ✅ 日志脱敏
@Injectable()
export class SensitiveDataInterceptor implements NestInterceptor {
  private sensitiveFields = ['password', 'token', 'idCard', 'bankCard'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = this.maskSensitiveData(request.body);
    request.body = body;
    return next.handle();
  }

  private maskSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const result = { ...data };
    for (const field of this.sensitiveFields) {
      if (result[field]) {
        result[field] = '******';
      }
    }
    return result;
  }
}
```

### 9.4 SQL注入防护

```typescript
// ✅ 使用ORM参数化查询
// 正确方式
const customer = await this.customerRepository.findOne({
  where: { email: userInputEmail },
});

// ✅ 使用QueryBuilder时注意参数化
const customers = await this.customerRepository
  .createQueryBuilder('customer')
  .where('customer.name LIKE :name', { name: `%${userInputName}%` })
  .getMany();

// ❌ 错误方式 - 存在SQL注入风险
const query = `SELECT * FROM customers WHERE name = '${userInputName}'`;
```

---

## 十、文档规范

### 10.1 代码文档

```typescript
/**
 * 客户服务 - 处理客户相关的业务逻辑
 * 
 * @module CustomerService
 * @description 提供客户的CRUD操作、查询、导入导出等功能
 * 
 * @example
 * // 在模块中导入
 * @Module({
 *   providers: [CustomerService],
 * })
 * export class CustomerModule {}
 */
@Injectable()
export class CustomerService {
  // ...
}
```

### 10.2 API文档

```typescript
// 使用Swagger装饰器
@ApiTags('客户管理')
@Controller('customers')
export class CustomerController {
  @Post()
  @ApiOperation({
    summary: '创建客户',
    description: '创建一个新客户，需要客户管理权限',
  })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    type: Customer,
  })
  @ApiResponse({
    status: 400,
    description: '参数验证失败',
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
  })
  @ApiResponse({
    status: 403,
    description: '无权限',
  })
  async create(@Body() dto: CreateCustomerDto): Promise<Customer> {
    // ...
  }
}
```

### 10.3 README文档

```markdown
# 模块名称

## 功能概述

简要描述模块功能。

## 技术栈

- 技术1
- 技术2

## 目录结构

\`\`\`
module/
├── controllers/
├── services/
└── ...
\`\`\`

## 安装

\`\`\`bash
npm install
\`\`\`

## 配置

说明配置项。

## 使用

\`\`\`typescript
import { Module } from './module';
\`\`\`

## API文档

链接到Swagger文档。

## 测试

\`\`\`bash
npm test
\`\`\`

## 变更日志

### v1.0.0
- 初始版本
```

---

## 附录：规范检查清单

### 代码提交前检查

```markdown
- [ ] 代码格式化通过
- [ ] ESLint检查通过
- [ ] 类型检查通过
- [ ] 单元测试通过
- [ ] 测试覆盖率达标
- [ ] 无安全漏洞
- [ ] 文档已更新
- [ ] 提交信息符合规范
```

### Code Review 检查

```markdown
- [ ] 代码符合命名规范
- [ ] 代码有充分注释
- [ ] 错误处理完善
- [ ] 无重复代码
- [ ] 无性能问题
- [ ] 无安全隐患
- [ ] 测试覆盖充分
```

---

> **文档维护**: 渔晓白  
> **最后更新**: 2026-03-19