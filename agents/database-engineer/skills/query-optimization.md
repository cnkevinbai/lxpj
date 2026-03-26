# 查询优化技能

## 📋 技能说明

优化 SQL 查询性能，提升数据库效率。

---

## 🎯 适用场景

- 慢查询优化
- 索引优化
- 执行计划分析

---

## 📝 优化技巧

1. **索引优化**
   - 覆盖索引
   - 复合索引顺序
   - 避免索引失效

2. **查询重写**
   - 避免 SELECT *
   - 使用 LIMIT
   - 合理使用 JOIN

3. **分页优化**
   ```sql
   -- 优化前
   SELECT * FROM users ORDER BY id LIMIT 10000, 10
   
   -- 优化后
   SELECT * FROM users WHERE id > 10000 ORDER BY id LIMIT 10
   ```

---

## ✅ 检查清单

- [ ] 执行计划分析
- [ ] 索引使用率
- [ ] 无 N+1 查询
- [ ] 分页高效

---

## 📚 相关技能

- `schema-design` - Schema 设计