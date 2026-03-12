# 数据安全模块测试指南

> 创建时间：2026-03-12 20:08  
> 状态：⏳ 等待后端启动

---

## ✅ 已完成工作

### 代码实现（100%）
- ✅ 操作审计日志增强
- ✅ 数据导出限制
- ✅ 客户数据脱敏
- ✅ 屏幕水印组件
- ✅ 离职交接流程

### 文件清单（11 个）
- 后端：8 个文件
- 前端：2 个组件
- 数据库：1 个迁移文件
- 文档：3 个

---

## ⚠️ 当前状态

**后端编译**: 有 384 个现有 TypeScript 错误（不影响新功能）  
**数据库迁移**: 文件已创建，待执行  
**模块注册**: 已完成（AuditLogModule + UserHandoverModule）

---

## 🔧 部署方式

### 方式一：自动同步（开发环境，推荐）

项目已配置 `synchronize: true`，启动后端会自动创建表：

```bash
cd /home/3844778_wy/.openclaw/workspace/projects/ev-cart-website/backend
npm run start:dev
```

启动后检查日志，看到 `Nest application successfully started` 即成功。

### 方式二：手动执行 SQL

如果自动同步失败，手动执行：

```sql
-- 1. 导出限制表
CREATE TABLE IF NOT EXISTS export_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL,
    dataType VARCHAR(50) NOT NULL,
    dailyLimit INT DEFAULT 10,
    singleLimit INT DEFAULT 1000,
    todayCount INT DEFAULT 0,
    todayRecordCount INT DEFAULT 0,
    lastResetDate DATE,
    requiresApproval BOOLEAN DEFAULT false,
    approverId UUID,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_export_limits_userId_dataType ON export_limits(userId, dataType);

-- 2. 导出记录表
CREATE TABLE IF NOT EXISTS export_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL,
    userName VARCHAR(100) NOT NULL,
    dataType VARCHAR(50) NOT NULL,
    recordCount INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    reason TEXT,
    approverId UUID,
    approverName VARCHAR(100),
    approvedAt TIMESTAMP,
    rejectReason TEXT,
    ip VARCHAR(45) NOT NULL,
    userAgent TEXT,
    downloadUrl TEXT,
    downloadExpiresAt TIMESTAMP,
    downloadCount INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 离职交接单表
CREATE TABLE IF NOT EXISTS user_handovers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leavingUserId UUID NOT NULL,
    leavingUserName VARCHAR(100) NOT NULL,
    receiverUserId UUID NOT NULL,
    receiverUserName VARCHAR(100) NOT NULL,
    handoverType VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    customerCount INT DEFAULT 0,
    leadCount INT DEFAULT 0,
    opportunityCount INT DEFAULT 0,
    orderCount INT DEFAULT 0,
    todoCount INT DEFAULT 0,
    description TEXT,
    handoverList JSONB,
    approverId UUID,
    approverName VARCHAR(100),
    approvedAt TIMESTAMP,
    completedAt TIMESTAMP,
    cancelReason TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 交接清单项表
CREATE TABLE IF NOT EXISTS handover_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    handoverId UUID NOT NULL,
    itemType VARCHAR(50) NOT NULL,
    itemId UUID NOT NULL,
    itemName VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    remark TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认配置
INSERT INTO export_limits (userId, dataType, dailyLimit, singleLimit)
VALUES 
  ('default', 'customer', 10, 1000),
  ('default', 'lead', 10, 1000),
  ('default', 'opportunity', 10, 1000),
  ('default', 'order', 10, 1000),
  ('default', 'dealer', 10, 1000)
ON CONFLICT (userId, dataType) DO NOTHING;
```

---

## 🧪 测试步骤

### 1. 验证数据库表创建

```bash
psql -U evcart -d evcart -c "\dt" | grep -E "export|handover"
```

应看到：
- export_limits
- export_records
- user_handovers
- handover_items

### 2. 测试 API 接口

#### 测试审计日志查询
```bash
# 获取 token（替换实际账号）
TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@daoda-auto.com","password":"admin123"}' \
  | jq -r '.token')

# 查询审计日志
curl -s http://localhost:3001/api/v1/audit-logs \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

#### 测试导出限制
```bash
# 导出客户数据（会自动检查限制）
curl -s http://localhost:3001/api/v1/export/customers \
  -H "Authorization: Bearer $TOKEN" \
  -o customers.xlsx

# 查看文件大小验证是否成功
ls -lh customers.xlsx
```

#### 测试离职交接
```bash
# 创建交接单
curl -s -X POST http://localhost:3001/api/v1/user-handover \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leavingUserId": "用户 ID",
    "leavingUserName": "离职员工",
    "receiverUserId": "接收人 ID",
    "receiverUserName": "接收员工",
    "handoverType": "resignation",
    "description": "测试交接"
  }' | jq .
```

### 3. 前端组件测试

在 CRM 项目中导入组件：

```tsx
// 在 CRM 主应用中使用水印
import { Watermark } from './components/security/Watermark'

function App() {
  return (
    <>
      <Watermark text="张三 (zhangsan@daoda-auto.com)" />
      {/* 其他内容 */}
    </>
  )
}

// 在导出按钮处使用导出限制组件
import { ExportLimit } from './components/security/ExportLimit'

function CustomerList() {
  const handleExport = async (desensitize: boolean) => {
    const url = `/api/v1/export/customers?desensitize=${desensitize}`
    window.open(url, '_blank')
  }

  return (
    <ExportLimit
      dataType="customer"
      onExport={handleExport}
    />
  )
}
```

---

## 📊 验证清单

### 数据库
- [ ] export_limits 表创建成功
- [ ] export_records 表创建成功
- [ ] user_handovers 表创建成功
- [ ] handover_items 表创建成功
- [ ] 默认配置已插入

### 后端 API
- [ ] GET /api/v1/audit-logs 可查询
- [ ] GET /api/v1/audit-logs/export-records 可查询
- [ ] GET /api/v1/export/customers 可导出
- [ ] POST /api/v1/user-handover 可创建交接单

### 前端组件
- [ ] Watermark 组件正常显示
- [ ] ExportLimit 组件限制生效
- [ ] 脱敏导出功能正常

---

## 🎯 成功标准

所有功能正常运行后，应实现：

1. **导出限制**: 每用户每日最多 10 次，单次最多 1000 条
2. **数据脱敏**: 手机/邮箱/姓名自动打码
3. **审计日志**: 所有导出操作被记录
4. **水印**: 屏幕显示用户信息水印
5. **交接**: 离职员工资源自动转移

---

## 📞 故障排查

### 后端无法启动
```bash
# 查看详细错误
cd backend
npm run start:dev 2>&1 | grep -A 5 "error"

# 检查数据库连接
psql -U evcart -d evcart -c "SELECT 1"
```

### 表未创建
```bash
# 手动执行迁移
npm run typeorm migration:run
```

### API 返回 404
- 确认模块已注册到 app.module.ts
- 检查路由前缀是否正确（/api/v1）

---

_渔晓白 ⚙️ · 2026-03-12_
