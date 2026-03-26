# OpenClaw Dashboard API 文档

> **API 版本**: v1.0  
> **框架**: NestJS  
> **认证**: JWT Bearer Token

---

## 📚 目录

- [认证 API](#认证-api)
- [消息 API](#消息-api)
- [会话 API](#会话-api)
- [仪表盘 API](#仪表盘-api)

---

## 认证 API

### POST `/api/auth/login` - 用户登录

**请求体**:
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**响应**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

---

### POST `/api/auth/logout` - 用户登出

**Headers**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "message": "Logged out successfully",
  "suggestion": "请删除客户端存储的 access_token"
}
```

---

### GET `/api/auth/me` - 获取当前用户

**Headers**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "id": "admin",
  "username": "admin",
  "email": "admin@openclaw.local",
  "role": "admin"
}
```

---

### POST `/api/auth/refresh` - 刷新 Token

**Headers**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

---

## 会话 API

### GET `/api/chat/sessions` - 获取会话列表

**Query Parameters**:
- `page` (default: 1) - 页码
- `limit` (default: 10) - 每页数量

**响应**:
```json
{
  "sessions": [
    {
      "id": "session-id",
      "title": "会话标题",
      "createdAt": "2026-03-19T12:00:00.000Z",
      "updatedAt": "2026-03-19T12:00:00.000Z",
      "lastMessageAt": "2026-03-19T12:00:00.000Z",
      "agentId": "agent-123"
    }
  ],
  "total": 1
}
```

---

### POST `/api/chat/sessions` - 创建新会话

**请求体**:
```json
{
  "title": "新会话",
  "agentId": "agent-123",
  "metadata": {}
}
```

**响应**:
```json
{
  "id": "session-id",
  "title": "新会话",
  "agentId": "agent-123",
  "metadata": {},
  "createdAt": "2026-03-19T12:00:00.000Z",
  "updatedAt": "2026-03-19T12:00:00.000Z"
}
```

---

### GET `/api/chat/sessions/:id` - 获取会话详情

**响应**:
同 POST `/api/chat/sessions` 的响应格式

---

### PATCH `/api/chat/sessions/:id` - 更新会话标题

**请求体**:
```json
{
  "title": "新标题"
}
```

---

### DELETE `/api/chat/sessions/:id` - 删除会话

**响应**:
```json
{
  "success": true,
  "sessionId": "session-id"
}
```

---

## 消息 API

### GET `/api/chat/sessions/:id/messages` - 获取消息列表

**Query Parameters**:
- `page` (default: 1) - 页码
- `limit` (default: 10) - 每页数量

---

### POST `/api/chat/sessions/:id/messages` - 发送消息

**请求体**:
```json
{
  "content": "消息内容",
  "agentId": "agent-123"
}
```

**响应**:
```json
{
  "id": "message-id",
  "sessionId": "session-id",
  "content": "消息内容",
  "type": "user",
  "agentId": "agent-123",
  "createdAt": "2026-03-19T12:00:00.000Z"
}
```

---

### DELETE `/api/chat/sessions/:sessionId/messages/:messageId` - 删除消息

**响应**:
```json
{
  "success": true,
  "messageId": "message-id"
}
```

---

### GET `/api/chat/sessions/search` - 搜索消息

**Query Parameters**:
- `q` (required) - 搜索关键词
- `sessionId` (optional) - 会话 ID，指定搜索特定会话
- `page` (default: 1) - 页码
- `limit` (default: 50) - 每页数量

**响应**:
```json
{
  "messages": [
    {
      "id": "message-id",
      "sessionId": "session-id",
      "content": "搜索匹配的内容",
      "type": "user",
      "createdAt": "2026-03-19T12:00:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 仪表盘 API

所有仪表盘 API 都需要认证。

### GET `/api/dashboard/stats` - 统计数据

**响应**:
```json
{
  "activeSessions": 5,
  "tasksCompleted": 12,
  "agentsOnline": 12,
  "totalMessages": 156
}
```

---

### GET `/api/dashboard/activities` - 最近活动

**Query Parameters**:
- `limit` (default: 10) - 返回数量

**响应**:
```json
[
  {
    "id": "activity-id",
    "type": "message",
    "message": "新消息发送",
    "timestamp": "2026-03-19T12:00:00.000Z"
  }
]
```

---

### GET `/api/dashboard/charts` - 图表数据

**响应**:
```json
{
  "messageTrends": {
    "labels": ["2026-03-13", "2026-03-14", ..., "2026-03-19"],
    "datasets": [
      {
        "label": "消息数量",
        "data": [10, 15, 12, 20, 18, 25],
        "borderColor": "rgb(75, 192, 192)",
        "backgroundColor": "rgba(75, 192, 192, 0.5)"
      }
    ]
  },
  "agentUsage": {
    "labels": ["agent-1", "agent-2", "agent-3"],
    "datasets": [
      {
        "label": "使用次数",
        "data": [45, 30, 25],
        "backgroundColor": ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"]
      }
    ]
  }
}
```

---

## 错误响应

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Not Found"
}
```

### 422 Validation Error
```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "errors": ["username is required"]
}
```

---

## 认证示例

### cURL 示例

```bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'

# 使用 Token 访问受保护的接口
curl -X GET http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## WebSocket 实时通信

除了 REST API，系统还支持 WebSocket 进行实时消息推送。

**连接地址**: `ws://localhost:3000/ws`

**消息格式**:
```json
{
  "type": "message",
  "sessionId": "session-id",
  "messageId": "message-id",
  "content": "消息内容",
  "type": "user|agent",
  "timestamp": "2026-03-19T12:00:00.000Z"
}
```

---

*文档版本: 2026-03-19*
