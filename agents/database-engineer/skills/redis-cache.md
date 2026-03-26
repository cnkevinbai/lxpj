# Redis 缓存技能

## 📋 技能说明

使用 Redis 进行缓存设计和实现。

---

## 🎯 适用场景

- 缓存设计
- 会话管理
- 分布式锁

---

## 📝 缓存策略

| 策略 | 说明 | 场景 |
|-----|------|------|
| Cache Aside | 先查缓存，再查数据库 | 通用场景 |
| Write Through | 写入时同时更新缓存 | 强一致性 |
| Write Behind | 异步写入数据库 | 高性能 |

---

## 📝 常用命令

```bash
# 字符串
SET key value EX 3600
GET key

# 哈希
HSET user:1 name "John"
HGET user:1 name

# 列表
LPUSH queue "task"
RPOP queue

# 分布式锁
SET lock:1 "uuid" NX EX 10
```

---

## ✅ 检查清单

- [ ] 设置过期时间
- [ ] 避免大 Key
- [ ] 缓存穿透防护
- [ ] 缓存雪崩防护

---

## 📚 相关技能

- `schema-design` - Schema 设计