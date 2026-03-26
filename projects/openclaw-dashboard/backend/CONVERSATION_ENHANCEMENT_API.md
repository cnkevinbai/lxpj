# OpenClaw Dashboard - 对话增强功能 API 文档

## 概述

本文档描述了 OpenClaw Dashboard 的对话增强功能 API，包括：

1. **上下文压缩** - 自动压缩长对话历史
2. **会话摘要** - 生成会话摘要
3. **Agent 记忆持久化** - 管理 Agent 的记忆

## 一、上下文压缩 (Context Compression)

当会话消息数量超过阈值时，自动压缩早期消息，保留最近 N 条消息的完整内容。

### 压缩上下文

**接口**: `POST /chat/sessions/:id/compress`

**描述**: 主动压缩指定会话的上下文

**请求参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `keepLatest` | number | 否 | 保留最近 N 条消息，默认 5 |
| `summaryPrompt` | string | 否 | 自定义摘要提示 |

**响应示例**:
```json
{
  "success": true,
  "compressedCount": 45,
  "newSummaryId": "msg_123abc",
  "message": "Compressed 45 messages into summary"
}
```

### 自动压缩上下文

**接口**: `POST /chat/sessions/:id/auto-compress`

**描述**: 检查消息数量，如果超过阈值则自动压缩

**请求参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `threshold` | number | 否 | 压缩阈值，默认 50 |

**响应示例**:
```json
{
  "success": true,
  "compressedCount": 45,
  "newSummaryId": "msg_123abc",
  "message": "Compressed 45 messages into summary"
}
```

**空响应示例**（不需要压缩）:
```json
null
```

## 二、会话摘要 (Session Summary)

在用户离开会话时生成摘要，包含主要话题、关键决策和待办事项。

### 生成会话摘要

**接口**: `POST /chat/sessions/:id/summary`

**描述**: 为指定会话生成摘要

**请求参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `prompt` | string | 否 | 自定义摘要提示 |
| `format` | string | 否 | 输出格式，可选 'text' 或 'json' |

**响应示例**:
```json
{
  "success": true,
  "sessionId": "session_123",
  "summary": {
    "mainTopics": ["项目架构设计", "API 开发", "数据库优化"],
    "keyDecisions": [
      "使用 NestJS 框架",
      "采用 PostgreSQL 数据库"
    ],
    "pendingTasks": ["实现认证功能", "编写单元测试"],
    "summaryText": "本次会话主要讨论了项目架构设计和 API 开发。决定使用 NestJS 框架开发后端服务，并采用 PostgreSQL 数据库。待办事项包括实现认证功能和编写单元测试。"
  }
}
```

## 三、Agent 记忆 (Agent Memory)

Agent 记忆分为三种类型：
- `short-term`: 短期记忆，当前会话上下文
- `long-term`: 长期记忆，跨会话的重要信息
- `preference`: 用户偏好，用户习惯和偏好

### 创建 Agent 记忆

**接口**: `POST /chat/sessions/memories`

**请求体**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `agentId` | string | 否 | Agent ID |
| `sessionId` | string | 否 | 会话 ID |
| `type` | string | 是 | 记忆类型：'short-term' \| 'long-term' \| 'preference' |
| `key` | string | 是 | 记忆的键，用于查询 |
| `value` | string | 是 | 记忆的值 |
| `metadata` | object | 否 | 额外元数据 |
| `expiresAt` | string | 否 | 过期时间（ISO 8601） |

**响应示例**:
```json
{
  "id": "mem_123",
  "agentId": "agent_abc",
  "sessionId": "session_xyz",
  "type": "short-term",
  "key": "user_preference",
  "value": "prefers dark mode",
  "metadata": {"source": "conversation"},
  "expiresAt": "2026-03-30T23:59:59.000Z",
  "createdAt": "2026-03-21T08:00:00.000Z",
  "updatedAt": "2026-03-21T08:00:00.000Z"
}
```

### 查询 Agent 记忆

**接口**: `GET /chat/sessions/memories`

**请求参数**:

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `agentId` | string | 否 | Agent ID |
| `sessionId` | string | 否 | 会话 ID |
| `type` | string | 否 | 记忆类型 |
| `key` | string | 否 | 记忆键 |
| `search` | string | 否 | 模糊搜索关键词 |
| `page` | number | 否 | 页码，默认 1 |
| `limit` | number | 否 | 每页数量，默认 20 |

**响应示例**:
```json
{
  "memories": [
    {
      "id": "mem_123",
      "agentId": "agent_abc",
      "sessionId": "session_xyz",
      "type": "short-term",
      "key": "user_preference",
      "value": "prefers dark mode",
      "metadata": {"source": "conversation"},
      "expiresAt": "2026-03-30T23:59:59.000Z",
      "createdAt": "2026-03-21T08:00:00.000Z",
      "updatedAt": "2026-03-21T08:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

### 获取 Agent 的特定记忆

**接口**: `GET /chat/sessions/memories/:id`

**描述**: 根据 ID 获取特定记忆（注意：需要通过 agentId 和 key 查询）

### 更新 Agent 记忆

**接口**: `PATCH /chat/sessions/memories/:id`

**请求体**: 支持的字段：

| 参数 | 类型 | 描述 |
|------|------|------|
| `value` | string | 记忆的值 |
| `metadata` | object | 元数据 |
| `expiresAt` | string | 过期时间 |

**响应示例**:
```json
{
  "id": "mem_123",
  "agentId": "agent_abc",
  "sessionId": "session_xyz",
  "type": "short-term",
  "key": "user_preference",
  "value": "prefers light mode",
  "metadata": {"source": "conversation", "updated": true},
  "expiresAt": "2026-03-30T23:59:59.000Z",
  "createdAt": "2026-03-21T08:00:00.000Z",
  "updatedAt": "2026-03-21T09:00:00.000Z"
}
```

### 删除 Agent 记忆

**接口**: `DELETE /chat/sessions/memories/:id`

**描述**: 删除指定记忆

**响应示例**:
```json
true
```

### 清理过期记忆

**接口**: `POST /chat/sessions/memories/cleanup`

**描述**: 删除所有已过期的记忆

**响应示例**:
```json
{
  "deleted": 5
}
```

## 数据模型

### Session (扩展)

新增字段：
- `summary?: string` - 会话摘要

### ContextCompression (新增)

| 字段 | 类型 | 描述 |
|------|------|------|
| `id` | string | 主键 |
| `sessionId` | string | 会话 ID |
| `summary` | string | 压缩摘要 |
| `startMessageId` | string | 起始消息 ID |
| `endMessageId` | string | 结束消息 ID |
| `messageCount` | number | 压缩的消息数量 |
| `createdAt` | datetime | 创建时间 |

### AgentMemory (新增)

| 字段 | 类型 | 描述 |
|------|------|------|
| `id` | string | 主键 |
| `agentId` | string \| null | Agent ID |
| `sessionId` | string \| null | 会话 ID |
| `type` | string | 记忆类型 |
| `key` | string | 记忆键 |
| `value` | string | 记忆值 |
| `metadata` | JSON \| null | 元数据 |
| `expiresAt` | datetime \| null | 过期时间 |
| `createdAt` | datetime | 创建时间 |
| `updatedAt` | datetime | 更新时间 |

## 使用示例

### 前端集成示例 (JavaScript)

```javascript
// 压缩上下文
await fetch('/api/chat/sessions/session_123/compress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ keepLatest: 5 })
});

// 生成会话摘要
const summary = await fetch('/api/chat/sessions/session_123/summary', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}).then(r => r.json());

console.log(summary.summary.mainTopics);
console.log(summary.summary.keyDecisions);
console.log(summary.summary.pendingTasks);

// 创建 Agent 记忆
await fetch('/api/chat/sessions/memories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentId: 'agent_abc',
    sessionId: 'session_123',
    type: 'short-term',
    key: 'user_context',
    value: 'User is working on project X',
    expiresAt: '2026-03-30T23:59:59.000Z'
  })
});

// 查询 Agent 记忆
const memories = await fetch('/api/chat/sessions/memories?agentId=agent_abc&type=short-term')
  .then(r => r.json());
```

## 注意事项

1. **自动压缩**: 建议在用户关闭会话或切换会话时调用自动压缩功能
2. **摘要生成**: 在用户长时间未操作时生成摘要
3. **记忆管理**: 定期清理过期记忆以保持数据库整洁
4. **权限控制**: 确保 Agent 只能访问自己的记忆
5. **过期处理**: 短期记忆应及时清理，避免占用存储空间
