# 执行 SQL 创建表指南

> 创建时间：2026-03-12 20:11  
> 状态：⏳ 待执行

---

## 📁 SQL 文件位置

```
/home/3844778_wy/.openclaw/workspace/projects/ev-cart-website/database/migrations/security-tables.sql
```

---

## 🔧 执行方式

### 方式一：使用 psql 命令行（推荐）

```bash
# 1. 连接到数据库
psql -U evcart -d evcart

# 2. 执行 SQL 文件
\i /home/3844778_wy/.openclaw/workspace/projects/ev-cart-website/database/migrations/security-tables.sql

# 或者一行命令
psql -U evcart -d evcart -f /home/3844778_wy/.openclaw/workspace/projects/ev-cart-website/database/migrations/security-tables.sql
```

### 方式二：使用数据库管理工具

#### pgAdmin
1. 打开 pgAdmin，连接到 evcart 数据库
2. 点击 "Query Tool"
3. 打开 `security-tables.sql` 文件
4. 点击执行按钮（▶️）

#### DBeaver
1. 连接到 evcart 数据库
2. 右键 → "SQL Editor" → "Open Script"
3. 选择 `security-tables.sql`
4. 执行（Ctrl+Enter）

#### Navicat
1. 连接到 evcart 数据库
2. 点击 "查询" → "新建查询"
3. 复制粘贴 SQL 内容
4. 执行（F5）

---

## ✅ 验证表创建成功

### 方法一：psql 命令
```bash
psql -U evcart -d evcart -c "\dt" | grep -E "export|handover"
```

**预期输出**:
```
 export_limits
 export_records
 user_handovers
 handover_items
```

### 方法二：查询表内容
```bash
psql -U evcart -d evcart -c "SELECT * FROM export_limits WHERE userId = 'default';"
```

**预期输出**:
```
 id | userId  | dataType    | dailyLimit | singleLimit | ...
----+---------+-------------+------------+-------------+...
 xx | default | customer    | 10         | 1000        | ...
 xx | default | lead        | 10         | 1000        | ...
 xx | default | opportunity | 10         | 1000        | ...
 xx | default | order       | 10         | 1000        | ...
 xx | default | dealer      | 10         | 1000        | ...
```

### 方法三：SQL 查询
```sql
-- 查看所有创建的表
SELECT tablename 
FROM pg_tables 
WHERE tablename IN (
    'export_limits', 
    'export_records', 
    'user_handovers', 
    'handover_items'
);

-- 查看默认配置
SELECT dataType, dailyLimit, singleLimit, requiresApproval 
FROM export_limits 
WHERE userId = 'default';
```

---

## 🎯 执行后测试

### 1. 启动后端
```bash
cd /home/3844778_wy/.openclaw/workspace/projects/ev-cart-website/backend
npm run start:dev
```

### 2. 测试 API

#### 获取 Token
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@daoda-auto.com","password":"admin123"}'
```

#### 测试导出 API
```bash
curl http://localhost:3001/api/v1/export/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o test_export.xlsx
```

#### 测试审计日志
```bash
curl http://localhost:3001/api/v1/audit-logs/export-records \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⚠️ 常见问题

### Q1: psql 命令未找到
**解决**: 安装 PostgreSQL 客户端
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql

# CentOS/RHEL
sudo yum install postgresql
```

### Q2: 数据库连接失败
**检查**:
```bash
# 检查 PostgreSQL 是否运行
ps aux | grep postgres

# 检查数据库是否存在
psql -U evcart -d evcart -c "SELECT 1"
```

### Q3: 表已存在
**解决**: SQL 使用了 `IF NOT EXISTS`，可以安全重复执行

### Q4: 权限不足
**解决**: 使用有创建表权限的用户
```bash
psql -U postgres -d evcart -f security-tables.sql
```

---

## 📊 创建的表说明

| 表名 | 用途 | 记录数 |
|-----|------|--------|
| export_limits | 导出限制配置 | 5 条（默认） |
| export_records | 导出操作记录 | 0 条（初始） |
| user_handovers | 离职交接单 | 0 条（初始） |
| handover_items | 交接清单项 | 0 条（初始） |

---

## 🎉 完成标志

执行成功后，你将拥有：

- ✅ 4 张新表已创建
- ✅ 5 条默认导出限制配置
- ✅ 后端模块已注册（AuditLogModule + UserHandoverModule）
- ✅ API 接口已就绪（需启动后端测试）

---

_渔晓白 ⚙️ · 2026-03-12_

**下一步**: 执行 SQL 文件 → 验证表创建 → 启动后端测试
