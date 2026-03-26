# Schema 设计技能

## 📋 技能说明

设计高效、可扩展的数据库 Schema。

---

## 🎯 适用场景

- 表结构设计
- 索引设计
- 关系设计

---

## 📝 设计原则

1. **范式化** - 消除数据冗余
2. **反范式化** - 优化查询性能
3. **索引策略** - 平衡读写性能
4. **分区策略** - 大表处理

---

## 📝 Prisma Schema 示例

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  status    UserStatus @default(ACTIVE)
  
  orders    Order[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([status])
  @@map("users")
}
```

---

## ✅ 检查清单

- [ ] 主键设计合理
- [ ] 外键关系正确
- [ ] 索引覆盖查询
- [ ] 字段类型合适

---

## 📚 相关技能

- `query-optimization` - 查询优化