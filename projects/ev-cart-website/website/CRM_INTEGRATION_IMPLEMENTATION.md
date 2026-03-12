# CRM 与官网联动实现方案

> 版本：v2.0  
> 公司：四川道达智能车辆制造有限公司  
> 更新时间：2026-03-12  
> 开发者：渔晓白 ⚙️

---

## 🎯 联动场景总览

```
┌──────────────────────────────────────────────────────────────┐
│                         官网 (Website)                        │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ 首页   │ │ 产品   │ │ 新闻   │ │ 案例   │ │ 联系   │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ REST API / WebSocket
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    API 网关层 (NestJS)                        │
│         认证 │ 限流 │ 日志 │ 路由 │ 数据转换                 │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                      CRM 系统                                 │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ 客户   │ │ 线索   │ │ 订单   │ │ 工单   │ │ 产品   │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 八大联动场景

### 1. 客户注册联动 👤

**流程**:
```
官网注册页面
    │
    ▼
填写信息（姓名/电话/邮箱/公司）
    │
    ▼
验证码验证
    │
    ▼
调用 CRM API：POST /api/v1/customers
    │
    ▼
CRM 创建客户 + 发送欢迎邮件
    │
    ▼
官网显示注册成功 + 自动登录
    │
    ▼
分配销售顾问（CRM 自动分配）
    │
    ▼
销售跟进（CRM 任务）
```

**API 实现**:
```typescript
// 官网前端
async function register(data: RegisterDto) {
  const response = await fetch('/api/v1/website/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const customer = await response.json();
  
  // 保存 token
  localStorage.setItem('token', customer.access_token);
  
  // 跳转到客户门户
  router.push('/portal');
}

// CRM 后端
@Post('website/customers')
async createFromWebsite(@Body() dto: CreateCustomerDto) {
  // 1. 检查是否已存在
  const existing = await this.customerRepo.findOne({
    where: { email: dto.email },
  });
  
  if (existing) {
    throw new ConflictException('邮箱已注册');
  }
  
  // 2. 创建客户
  const customer = this.customerRepo.create({
    ...dto,
    source: 'website', // 来源标记
    status: 'active',
  });
  
  await this.customerRepo.save(customer);
  
  // 3. 发送欢迎邮件
  await this.emailService.sendWelcome(customer);
  
  // 4. 分配销售顾问
  const sales = await this.assignSalesRep(customer);
  
  // 5. 创建跟进任务
  await this.taskService.create({
    customerId: customer.id,
    assignedTo: sales.id,
    type: 'follow_up',
    dueDate: addDays(new Date(), 1),
  });
  
  // 6. 生成 token
  const access_token = this.jwtService.sign({
    sub: customer.id,
    username: customer.email,
  });
  
  return { ...customer, access_token };
}
```

---

### 2. 产品询价联动 💰

**流程**:
```
官网产品详情页
    │
    ▼
点击"立即询价"
    │
    ▼
填写询价表单（产品/数量/预算/时间）
    │
    ▼
调用 CRM API：POST /api/v1/opportunities
    │
    ▼
CRM 创建商机 + 关联客户 + 关联产品
    │
    ▼
自动报价（CRM 价格引擎）
    │
    ▼
销售跟进报价
    │
    ▼
官网查看报价进度
```

**API 实现**:
```typescript
// 官网前端
async function requestQuote(data: QuoteDto) {
  const response = await fetch('/api/v1/website/opportunities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const opportunity = await response.json();
  
  // 显示成功消息
  message.success('询价已提交，销售将在 24 小时内联系您');
  
  // 跳转到询价进度页
  router.push(`/portal/quotes/${opportunity.id}`);
}

// CRM 后端
@Post('website/opportunities')
async createOpportunityFromWebsite(@Body() dto: CreateOpportunityDto) {
  // 1. 获取或创建客户
  let customer = await this.customerRepo.findOne({
    where: { email: dto.email },
  });
  
  if (!customer) {
    customer = this.customerRepo.create({
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
      source: 'website',
    });
    await this.customerRepo.save(customer);
  }
  
  // 2. 创建商机
  const opportunity = this.opportunityRepo.create({
    customerId: customer.id,
    productId: dto.productId,
    name: `${dto.productName} 询价`,
    amount: dto.budget,
    quantity: dto.quantity,
    stage: 'inquiry', // 询价阶段
    probability: 20,
    expectedCloseDate: dto.purchaseDate,
    source: 'website',
  });
  
  await this.opportunityRepo.save(opportunity);
  
  // 3. 通知销售
  await this.notificationService.send({
    type: 'new_opportunity',
    customerId: customer.id,
    opportunityId: opportunity.id,
  });
  
  // 4. 创建跟进任务
  await this.taskService.create({
    opportunityId: opportunity.id,
    type: 'call',
    dueDate: addHours(new Date(), 2),
  });
  
  return opportunity;
}
```

---

### 3. 在线咨询联动 💬

**流程**:
```
官网咨询表单/AI 客服
    │
    ▼
填写咨询内容（需求/联系方式）
    │
    ▼
调用 CRM API：POST /api/v1/leads
    │
    ▼
CRM 创建线索 + 自动分类
    │
    ▼
AI 初步回复（知识库）
    │
    ▼
复杂问题转人工
    │
    ▼
客服跟进（CRM 工单）
    │
    ▼
官网查看回复进度
```

**API 实现**:
```typescript
// 官网前端
async function submitInquiry(data: InquiryDto) {
  const response = await fetch('/api/v1/website/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const lead = await response.json();
  
  // AI 客服立即回复
  const aiResponse = await fetch('/api/v1/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ question: data.content }),
  });
  
  message.success('咨询已提交，客服将尽快联系您');
}

// CRM 后端
@Post('website/leads')
async createLeadFromWebsite(@Body() dto: CreateLeadDto) {
  // 1. 创建线索
  const lead = this.leadRepo.create({
    ...dto,
    source: 'website',
    status: 'new',
    category: this.classifyLead(dto.content), // AI 分类
  });
  
  await this.leadRepo.save(lead);
  
  // 2. 根据分类分配
  if (lead.category === 'product') {
    await this.assignToSales(lead);
  } else if (lead.category === 'support') {
    await this.assignToSupport(lead);
  } else if (lead.category === 'complaint') {
    await this.assignToManager(lead);
  }
  
  // 3. 发送确认邮件
  await this.emailService.sendLeadConfirmation(lead);
  
  // 4. 创建跟进任务
  await this.taskService.create({
    leadId: lead.id,
    type: 'contact',
    dueDate: addHours(new Date(), 4),
  });
  
  return lead;
}

// AI 分类
private classifyLead(content: string): LeadCategory {
  const keywords = {
    product: ['价格', '多少钱', '报价', '购买'],
    support: ['问题', '故障', '维修', '怎么办'],
    complaint: ['投诉', '不满', '差评', '举报'],
  };
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => content.includes(word))) {
      return category as LeadCategory;
    }
  }
  
  return 'general';
}
```

---

### 4. 服务申请联动 🔧

**流程**:
```
官网服务申请页面
    │
    ▼
填写服务需求（问题描述/产品/联系方式）
    │
    ▼
调用 CRM API：POST /api/v1/tickets
    │
    ▼
CRM 创建工单 + 分配技术人员
    │
    ▼
技术人员联系客户
    │
    ▼
上门服务
    │
    ▼
官网查看服务进度 + 评价
```

**API 实现**:
```typescript
// 官网前端
async function submitServiceRequest(data: ServiceRequestDto) {
  const response = await fetch('/api/v1/website/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const ticket = await response.json();
  
  message.success('服务申请已提交，技术人员将在 2 小时内联系您');
  router.push(`/portal/tickets/${ticket.id}`);
}

// CRM 后端
@Post('website/tickets')
async createTicketFromWebsite(@Body() dto: CreateTicketDto) {
  // 1. 创建工单
  const ticket = this.ticketRepo.create({
    ...dto,
    source: 'website',
    status: 'pending',
    priority: this.calculatePriority(dto.issue),
  });
  
  await this.ticketRepo.save(ticket);
  
  // 2. 根据问题类型分配技术人员
  const technician = await this.findAvailableTechnician(dto.issueType);
  ticket.assignedTo = technician.id;
  await this.ticketRepo.save(ticket);
  
  // 3. 通知技术人员
  await this.notificationService.send({
    type: 'new_ticket',
    ticketId: ticket.id,
    assignedTo: technician.id,
  });
  
  // 4. 发送确认短信
  await this.smsService.send(dto.phone, 
    `您的服务申请已受理，技术人员${technician.name}将联系您，电话：${technician.phone}`);
  
  return ticket;
}
```

---

### 5. 订单状态同步联动 📦

**流程**:
```
CRM 订单状态变更
    │
    ▼
触发 Webhook
    │
    ▼
推送至官网
    │
    ▼
官网客户门户更新
    │
    ▼
发送通知（邮件/短信）
    │
    ▼
客户查看订单进度
```

**API 实现**:
```typescript
// CRM 后端 - 订单状态变更
@Patch('orders/:id/status')
async updateOrderStatus(
  @Param('id') id: string,
  @Body('status') status: OrderStatus,
) {
  // 1. 更新订单状态
  const order = await this.orderRepo.findOne({ where: { id } });
  order.status = status;
  await this.orderRepo.save(order);
  
  // 2. 推送至官网（WebSocket）
  this.gateway.server.to(`customer_${order.customerId}`).emit('order_update', {
    orderId: order.id,
    status: status,
    updatedAt: new Date(),
  });
  
  // 3. 发送通知
  await this.notificationService.sendOrderUpdate(order);
  
  return order;
}

// 官网前端 - 监听订单更新
useEffect(() => {
  const socket = io('https://api.ddzn.com', {
    auth: { token: localStorage.getItem('token') },
  });
  
  socket.on('order_update', (data) => {
    // 更新订单状态
    setOrders(prev => prev.map(order => 
      order.id === data.orderId 
        ? { ...order, status: data.status, updatedAt: data.updatedAt }
        : order
    ));
    
    // 显示通知
    message.success(`订单${data.orderId}状态已更新为${data.status}`);
  });
  
  return () => socket.disconnect();
}, []);
```

---

### 6. 库存实时同步联动 📊

**流程**:
```
CRM 库存变更
    │
    ▼
触发库存同步任务
    │
    ▼
更新 Redis 缓存
    │
    ▼
官网产品页显示实时库存
    │
    ▼
库存不足时显示"缺货"
```

**API 实现**:
```typescript
// CRM 后端 - 库存变更
@Patch('inventory/:id/quantity')
async updateInventory(
  @Param('id') id: string,
  @Body('quantity') quantity: number,
) {
  // 1. 更新库存
  const inventory = await this.inventoryRepo.findOne({ where: { id } });
  inventory.quantity = quantity;
  inventory.updatedAt = new Date();
  await this.inventoryRepo.save(inventory);
  
  // 2. 更新 Redis 缓存
  await this.redis.set(
    `inventory:${inventory.productId}`,
    JSON.stringify({ quantity, status: this.getStockStatus(quantity) }),
    'EX', 60, // 1 分钟过期
  );
  
  // 3. 如果库存不足，通知采购
  if (quantity < inventory.safeStock) {
    await this.notificationService.sendLowStockAlert(inventory);
  }
  
  return inventory;
}

// 官网前端 - 获取实时库存
async function getProductStock(productId: string) {
  // 先从缓存获取
  const cached = await fetch(`/api/v1/website/inventory/${productId}`);
  const stock = await cached.json();
  
  return {
    quantity: stock.quantity,
    status: stock.status, // 'in_stock' | 'low_stock' | 'out_of_stock'
  };
}
```

---

### 7. 客户数据同步联动 👥

**流程**:
```
官网客户信息更新
    │
    ▼
调用 CRM API：PUT /api/v1/customers/:id
    │
    ▼
CRM 更新客户信息
    │
    ▼
同步至所有关联系统
    │
    ▼
官网显示更新成功
```

**API 实现**:
```typescript
// 官网前端
async function updateProfile(data: UpdateProfileDto) {
  const response = await fetch('/api/v1/website/customers/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  const customer = await response.json();
  message.success('个人信息已更新');
}

// CRM 后端
@Put('website/customers/me')
@UseGuards(JwtAuthGuard)
async updateProfile(
  @CurrentUser() user: JwtUser,
  @Body() dto: UpdateCustomerDto,
) {
  // 1. 更新客户信息
  const customer = await this.customerRepo.findOne({ 
    where: { id: user.sub } 
  });
  
  Object.assign(customer, dto);
  await this.customerRepo.save(customer);
  
  // 2. 同步至关联系统
  await this.syncToOtherSystems(customer);
  
  return customer;
}
```

---

### 8. 数据统计展示联动 📈

**流程**:
```
CRM 统计数据
    │
    ▼
定时任务聚合
    │
    ▼
缓存到 Redis
    │
    ▼
官网首页展示（客户数/订单数/案例数）
    │
    ▼
增强信任背书
```

**API 实现**:
```typescript
// CRM 后端 - 统计数据
@Get('website/statistics')
async getWebsiteStatistics() {
  // 1. 尝试从缓存获取
  const cached = await this.redis.get('website:stats');
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 2. 从数据库聚合
  const [customerCount, orderCount, caseCount] = await Promise.all([
    this.customerRepo.count({ where: { status: 'active' } }),
    this.orderRepo.count({ where: { status: 'completed' } }),
    this.caseRepo.count({ where: { isPublished: true } }),
  ]);
  
  const stats = {
    customers: customerCount,
    orders: orderCount,
    cases: caseCount,
    updatedAt: new Date(),
  };
  
  // 3. 缓存 10 分钟
  await this.redis.set('website:stats', JSON.stringify(stats), 'EX', 600);
  
  return stats;
}

// 官网前端
// 首页展示统计数据
<div className="stats">
  <div className="stat-item">
    <span className="number">{stats.customers}+</span>
    <span className="label">服务客户</span>
  </div>
  <div className="stat-item">
    <span className="number">{stats.orders}+</span>
    <span className="label">完成订单</span>
  </div>
  <div className="stat-item">
    <span className="number">{stats.cases}+</span>
    <span className="label">成功案例</span>
  </div>
</div>
```

---

## 🔧 技术实现方案

### API 网关设计

```typescript
// NestJS API 网关
@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]), // 限流
    CacheModule.register({ ttl: 300 }), // 缓存
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService, JwtStrategy],
})
export class WebsiteModule {}

// 官网专用控制器
@Controller('website')
export class WebsiteController {
  constructor(
    private customerService: CustomerService,
    private leadService: LeadService,
    private opportunityService: OpportunityService,
    private ticketService: TicketService,
  ) {}
  
  @Post('customers')
  @Throttle() // 限流
  async createCustomer(@Body() dto: CreateCustomerDto) {
    return this.customerService.createFromWebsite(dto);
  }
  
  @Post('leads')
  async createLead(@Body() dto: CreateLeadDto) {
    return this.leadService.createFromWebsite(dto);
  }
  
  @Post('opportunities')
  async createOpportunity(@Body() dto: CreateOpportunityDto) {
    return this.opportunityService.createFromWebsite(dto);
  }
  
  @Post('tickets')
  async createTicket(@Body() dto: CreateTicketDto) {
    return this.ticketService.createFromWebsite(dto);
  }
  
  @Get('products')
  @CacheInterceptor() // 缓存
  async getProducts() {
    return this.productService.findAll();
  }
  
  @Get('statistics')
  @CacheInterceptor()
  async getStatistics() {
    return this.statisticsService.getWebsiteStats();
  }
}
```

### WebSocket 实时推送

```typescript
// CRM 后端 - WebSocket 网关
@WebSocketGateway({
  namespace: '/realtime',
  cors: { origin: 'https://www.ddzn.com' },
})
export class RealtimeGateway {
  @WebSocketServer()
  server: Server;
  
  // 订单状态更新推送
  sendOrderUpdate(orderId: string, status: string, customerId: string) {
    this.server.to(`customer_${customerId}`).emit('order_update', {
      orderId,
      status,
      updatedAt: new Date(),
    });
  }
  
  // 工单进度推送
  sendTicketUpdate(ticketId: string, progress: string, customerId: string) {
    this.server.to(`customer_${customerId}`).emit('ticket_update', {
      ticketId,
      progress,
      updatedAt: new Date(),
    });
  }
}

// 官网前端 - 连接 WebSocket
const socket = io('https://api.ddzn.com/realtime', {
  auth: { token: localStorage.getItem('token') },
});

// 加入客户房间
socket.on('connect', () => {
  socket.emit('join', { room: `customer_${customerId}` });
});

// 监听订单更新
socket.on('order_update', (data) => {
  // 更新 UI
});

// 监听工单更新
socket.on('ticket_update', (data) => {
  // 更新 UI
});
```

---

## 🔒 安全策略

### 1. 认证授权
```typescript
// JWT Guard
@Injectable()
export class WebsiteJwtGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

// 使用示例
@UseGuards(WebsiteJwtGuard)
@Get('customers/me')
async getProfile(@CurrentUser() user: JwtUser) {
  return this.customerService.findOne(user.sub);
}
```

### 2. API 限流
```typescript
// 限流配置
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000, // 1 秒
    limit: 10, // 10 次
  },
  {
    name: 'medium',
    ttl: 60000, // 1 分钟
    limit: 100, // 100 次
  },
])

// 使用示例
@Post('customers')
@Throttle('short') // 严格限流
async createCustomer(@Body() dto: CreateCustomerDto) {
  // ...
}
```

### 3. 数据验证
```typescript
// DTO 验证
export class CreateCustomerDto {
  @IsString()
  @MaxLength(50)
  name: string;
  
  @IsEmail()
  email: string;
  
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;
  
  @IsOptional()
  @IsString()
  company?: string;
}
```

---

## 📊 数据同步策略

| 数据类型 | 同步方式 | 频率 | 缓存策略 |
|---------|---------|------|---------|
| 产品信息 | API 拉取 | 实时 | 5 分钟 |
| 库存数量 | API 拉取 + WebSocket | 实时 | 1 分钟 |
| 订单状态 | WebSocket 推送 | 实时 | 不缓存 |
| 工单进度 | WebSocket 推送 | 实时 | 不缓存 |
| 新闻内容 | API 拉取 | 10 分钟 | 10 分钟 |
| 案例内容 | API 拉取 | 10 分钟 | 10 分钟 |
| 统计数据 | API 拉取 | 5 分钟 | 10 分钟 |
| 客户数据 | API 推送 | 实时 | 不缓存 |

---

## 🚀 开发计划

### Phase 1：基础对接（1 周）📝
- [ ] API 网关搭建
- [ ] 客户注册对接
- [ ] 线索创建对接
- [ ] JWT 认证

### Phase 2：业务对接（2 周）📝
- [ ] 产品询价对接
- [ ] 服务申请对接
- [ ] 订单状态同步
- [ ] WebSocket 推送

### Phase 3：客户门户（2 周）📝
- [ ] 客户登录
- [ ] 订单查询
- [ ] 服务进度
- [ ] 个人信息管理

### Phase 4：优化完善（1 周）📝
- [ ] 性能优化
- [ ] 缓存策略
- [ ] 安全加固
- [ ] 测试验收

---

## 📞 联系方式

- **公司**: 四川道达智能车辆制造有限公司
- **官网**: https://www.ddzn.com
- **邮箱**: info@ddzn.com
- **电话**: 400-888-8888

---

Copyright © 2026 四川道达智能车辆制造有限公司。All rights reserved.
