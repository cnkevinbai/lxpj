# 代码注释规范

> 四川道达智能官网 + CRM 系统  
> 版本：v1.0.0  
> 更新日期：2026-03-11

---

## 📋 目录

1. [注释原则](#注释原则)
2. [文件注释](#文件注释)
3. [类注释](#类注释)
4. [函数注释](#函数注释)
5. [代码块注释](#代码块注释)
6. [类型注释](#类型注释)

---

## 注释原则

### 基本原则

1. **注释为什么，而不是做什么**
```typescript
// ❌ 不好的注释
// 设置状态为 true
this.status = true

// ✅ 好的注释
// 标记为已激活状态，用于后续权限验证
this.status = true
```

2. **保持注释更新**
```typescript
// 代码修改时同步更新注释
// 过时的注释比没有注释更糟糕
```

3. **简洁明了**
```typescript
// ❌ 冗长
// 这个函数的作用是检查用户是否有权限访问某个资源，
// 它会先验证用户是否登录，然后检查用户的角色...

// ✅ 简洁
// 检查用户资源访问权限
```

---

## 文件注释

### 文件头注释

```typescript
/**
 * @file customer.service.ts
 * @description 客户服务层，处理客户相关的业务逻辑
 * @author 渔晓白
 * @date 2026-03-11
 * @version 1.0.0
 */
```

### 模块注释

```typescript
/**
 * @module CustomerModule
 * @description 客户管理模块，提供客户 CRUD 操作
 * @exports CustomerModule
 */
```

---

## 类注释

### 服务类

```typescript
/**
 * @class CustomerService
 * @description 客户服务，处理客户相关的业务逻辑
 * 
 * @example
 * const customer = await customerService.create(createCustomerDto)
 * 
 * @property {Repository} repository - 客户数据仓库
 */
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private repository: Repository<Customer>,
  ) {}
}
```

### 控制器类

```typescript
/**
 * @class CustomerController
 * @description 客户控制器，处理客户相关的 HTTP 请求
 * 
 * @route /api/v1/customers
 * 
 * @example
 * GET /api/v1/customers - 获取客户列表
 * POST /api/v1/customers - 创建客户
 */
@Controller('customers')
export class CustomerController {}
```

---

## 函数注释

### 公共方法

```typescript
/**
 * 创建客户
 * 
 * @param {CreateCustomerDto} createCustomerDto - 创建客户 DTO
 * @returns {Promise<Customer>} 创建的客户
 * @throws {ConflictException} 客户已存在时抛出
 * 
 * @example
 * const customer = await service.create({
 *   name: '客户名称',
 *   type: 'company'
 * })
 */
async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
  // 检查客户是否已存在
  const existing = await this.findOneByEmail(createCustomerDto.email)
  if (existing) {
    throw new ConflictException('Customer already exists')
  }
  
  // 创建并保存客户
  const customer = this.repository.create(createCustomerDto)
  return this.repository.save(customer)
}
```

### 私有方法

```typescript
/**
 * 根据邮箱查找客户
 * @private
 * @param {string} email - 邮箱地址
 * @returns {Promise<Customer | null>} 客户或 null
 */
private async findOneByEmail(email: string): Promise<Customer | null> {
  return this.repository.findOne({ where: { email } })
}
```

### 复杂逻辑

```typescript
/**
 * 计算客户等级
 * 
 * 等级计算规则:
 * - A 级: 年消费 >= 100 万
 * - B 级: 年消费 >= 50 万
 * - C 级: 年消费 < 50 万
 * 
 * @param {number} annualSpending - 年消费金额
 * @returns {'A' | 'B' | 'C'} 客户等级
 */
private calculateLevel(annualSpending: number): 'A' | 'B' | 'C' {
  if (annualSpending >= 1000000) {
    return 'A'
  } else if (annualSpending >= 500000) {
    return 'B'
  }
  return 'C'
}
```

---

## 代码块注释

### 复杂算法

```typescript
// 使用快速排序算法对订单进行排序
// 时间复杂度: O(n log n)
// 空间复杂度: O(log n)
orders.sort((a, b) => {
  if (a.totalAmount !== b.totalAmount) {
    return b.totalAmount - a.totalAmount
  }
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
})
```

### 业务逻辑

```typescript
// =====================
// 订单状态流转
// =====================
// pending -> confirmed -> production -> ready -> shipped -> completed
// 
// 状态说明:
// - pending: 待处理，等待确认
// - confirmed: 已确认，客户已付款
// - production: 生产中，正在制造
// - ready: 待发货，生产完成
// - shipped: 已发货，物流中
// - completed: 已完成，客户签收

if (order.status === 'pending' && paymentReceived) {
  order.status = 'confirmed'
}
```

### 性能优化

```typescript
// =====================
// 性能优化：使用缓存
// =====================
// 1. 先查 Redis 缓存
// 2. 缓存未命中查数据库
// 3. 写入缓存 (TTL: 1 小时)

const cached = await this.redis.get(`customer:${id}`)
if (cached) {
  return JSON.parse(cached)
}

const customer = await this.repository.findOne({ where: { id } })
await this.redis.setex(`customer:${id}`, 3600, JSON.stringify(customer))
return customer
```

### 临时方案

```typescript
// TODO: 后续优化为消息队列异步处理
// 当前使用同步方式，存在性能瓶颈
// 预计下个版本改为 RabbitMQ
await this.emailService.sendEmail(customer.email, 'Welcome!')
```

### 修复说明

```typescript
// FIX: 修复并发下单时的库存超卖问题
// 使用乐观锁 + 重试机制
// Issue: #123
const updated = await this.repository
  .createQueryBuilder()
  .update()
  .set({ stock: () => 'stock - 1' })
  .where('id = :id AND stock > 0', { id })
  .execute()

if (updated.affected === 0) {
  throw new ConflictException('库存不足')
}
```

---

## 类型注释

### 接口定义

```typescript
/**
 * 客户接口
 * 
 * @description 定义客户的基本数据结构
 * 
 * @property {string} id - 客户 ID (UUID)
 * @property {string} name - 客户名称
 * @property {'company' | 'individual' | 'government'} type - 客户类型
 * @property {string} [industry] - 所属行业
 * @property {string} [contactPerson] - 联系人
 * @property {string} [contactPhone] - 联系电话
 * @property {string} [contactEmail] - 联系邮箱
 * @property {'A' | 'B' | 'C'} level - 客户等级
 * @property {'active' | 'inactive' | 'lost'} status - 客户状态
 * @property {Date} createdAt - 创建时间
 * @property {Date} updatedAt - 更新时间
 */
export interface ICustomer {
  id: string
  name: string
  type: 'company' | 'individual' | 'government'
  industry?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  level: 'A' | 'B' | 'C'
  status: 'active' | 'inactive' | 'lost'
  createdAt: Date
  updatedAt: Date
}
```

### 类型别名

```typescript
/**
 * 订单状态类型
 * 
 * @description 定义订单的生命周期状态
 * 
 * @value pending - 待处理
 * @value confirmed - 已确认
 * @value production - 生产中
 * @value ready - 待发货
 * @value shipped - 已发货
 * @value completed - 已完成
 */
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'production'
  | 'ready'
  | 'shipped'
  | 'completed'
```

---

## 特殊标记

### TODO 标记

```typescript
// TODO: 实现邮件发送功能
// 当前使用 console.log 模拟
// 预计完成时间：2026-03-20
console.log('Sending email to', email)
```

### FIXME 标记

```typescript
// FIXME: 修复并发问题
// 当前存在竞态条件，需要使用分布式锁
// Issue: #456
await this.updateStock(productId, quantity)
```

### NOTE 标记

```typescript
// NOTE: 重要业务逻辑
// 此处修改需经过测试和 Code Review
// 联系人：渔晓白
if (order.totalAmount > 100000) {
  await this.managerApprove(order.id)
}
```

### DEPRECATED 标记

```typescript
/**
 * @deprecated 使用 createV2 代替
 * 
 * @reason 旧版本不支持批量创建
 * @since 1.0.0
 * @deprecatedSince 1.1.0
 * @removeIn 2.0.0
 */
async create(dto: CreateDto): Promise<Entity> {
  // ...
}
```

---

## 注释检查清单

- [ ] 文件头注释完整
- [ ] 类/接口有描述
- [ ] 公共方法有注释
- [ ] 参数有说明
- [ ] 返回值有说明
- [ ] 异常有说明
- [ ] 复杂逻辑有注释
- [ ] 业务规则有注释
- [ ] TODO/FIXME 已标记
- [ ] 注释与代码同步

---

_四川道达智能车辆制造有限公司 · 版权所有_
