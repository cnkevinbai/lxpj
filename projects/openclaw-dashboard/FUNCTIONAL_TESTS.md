# OpenClaw Dashboard P0 功能测试计划

> **日期**: 2026-03-19  
> **测试框架**: Manual Testing / Postman Collection

---

## ✅ 任务1: 消息持久化测试

### 1.1 创建会话
```
POST /api/chat/sessions
{
  "title": "测试会话",
  "agentId": "test-agent"
}
```
**预期**: 返回新创建的 session 对象，包含 id

### 1.2 发送消息
```
POST /api/chat/sessions/{id}/messages
{
  "content": "这是测试消息",
  "agentId": "test-agent"
}
```
**预期**: 返回新创建的 message 对象

### 1.3 获取会话列表
```
GET /api/chat/sessions?page=1&limit=10
```
**预期**: 返回包含测试会话的列表

### 1.4 搜索消息
```
GET /api/chat/sessions/search?q=测试&page=1&limit=50
```
**预期**: 返回匹配的搜索结果

### 1.5 获取会话消息历史
```
GET /api/chat/sessions/{id}/messages?page=1&limit=50
```
**预期**: 返回该会话的所有消息

---

## ✅ 任务2: Dashboard 统计 API 测试

### 2.1 获取统计数据
```
GET /api/dashboard/stats
Authorization: Bearer <token>
```
**预期**:
```json
{
  "activeSessions": 1,
  "tasksCompleted": 0,
  "agentsOnline": 0,
  "totalMessages": 1
}
```

### 2.2 获取活动记录
```
GET /api/dashboard/activities?limit=10
Authorization: Bearer <token>
```
**预期**: 返回最近的活动记录列表

### 2.3 获取图表数据
```
GET /api/dashboard/charts
Authorization: Bearer <token>
```
**预期**: 返回包含 messageTrends 和 agentUsage 的图表数据

---

## ✅ 任务3: 用户认证模块测试

### 3.1 用户登录
```
POST /api/auth/login
{
  "username": "admin",
  "password": "123456"
}
```
**预期**: 返回 access_token 和 expires_in

### 3.2 获取当前用户 (使用 Token)
```
GET /api/auth/me
Authorization: Bearer <token>
```
**预期**: 返回当前用户信息

### 3.3 刷新 Token
```
POST /api/auth/refresh
Authorization: Bearer <token>
```
**预期**: 返回新的 access_token

### 3.4 错误测试 - 无效凭证
```
POST /api/auth/login
{
  "username": "admin",
  "password": "wrong_password"
}
```
**预期**: 返回 401 Unauthorized

### 3.5 错误测试 - 无效 Token
```
GET /api/auth/me
Authorization: Bearer invalid_token
```
**预期**: 返回 401 Unauthorized

---

## 📊 手动测试步骤

1. **启动服务器**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **使用 Postman 或 curl 测试所有端点**

3. **验证响应格式和状态码**

---

## 🔄 自动化测试 (可选)

可以使用 Jest 编写单元测试:

```typescript
// dashboard.controller.spec.ts
describe('DashboardController', () => {
  it('should get stats', async () => {
    const stats = await controller.getStats();
    expect(stats).toHaveProperty('activeSessions');
    expect(stats).toHaveProperty('totalMessages');
  });
});
```

---

## ✅ 通过标准

- [ ] 所有 API 端点返回正确的 HTTP 状态码
- [ ] 响应体格式符合 API 文档
- [ ] JWT 认证正常工作
- [ ] 搜索功能返回正确结果
- [ ] 统计数据实时计算
- [ ] 错误处理正确

---

*测试时间: 2026-03-19*
