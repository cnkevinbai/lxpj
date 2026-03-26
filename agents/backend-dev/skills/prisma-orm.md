# Prisma ORM 技能

## 📋 技能说明

使用 Prisma 进行数据库操作，包括模型定义、查询、事务处理。

---

## 🎯 适用场景

- 数据库模型设计
- CRUD 操作
- 复杂查询
- 数据迁移

---

## 📝 Schema 定义

```prisma
// prisma/schema.prisma

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  role      UserRole @default(USER)
  status    UserStatus @default(ACTIVE)
  avatar    String?
  
  // 关联
  posts     Post[]
  orders    Order[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([email])
  @@index([status])
  @@map("users")
}

enum UserRole {
  ADMIN
  USER
  GUEST
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BANNED
}
```

---

## 📝 常用查询

```typescript
// 创建
const user = await prisma.user.create({
  data: {
    email: 'test@example.com',
    name: 'Test User',
    password: hashedPassword
  }
})

// 查询单个
const user = await prisma.user.findUnique({
  where: { id },
  include: { posts: true }
})

// 查询列表
const users = await prisma.user.findMany({
  where: { status: 'ACTIVE' },
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * limit,
  take: limit
})

// 更新
const user = await prisma.user.update({
  where: { id },
  data: { name: 'New Name' }
})

// 删除
await prisma.user.delete({ where: { id } })

// 软删除
await prisma.user.update({
  where: { id },
  data: { deletedAt: new Date() }
})

// 事务
await prisma.$transaction([
  prisma.order.create({ data: orderData }),
  prisma.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } }
  })
])
```

---

## ✅ 检查清单

- [ ] 有合适的索引
- [ ] 关联关系正确
- [ ] 使用事务保证一致性
- [ ] 软删除重要数据

---

## 📚 相关技能

- `nestjs-api` - NestJS API 开发
- `schema-design` - 数据库设计