# OpenClaw Dashboard Backend API

## API Endpoints

### Session Management

#### GET /api/chat/sessions
获取会话列表（支持分页）

Query Parameters:
- `page` (optional): 页码，默认 1
- `limit` (optional): 每页数量，默认 10

Response:
```json
{
  "sessions": [
    {
      "id": "uuid",
      "title": "会话标题",
      "createdAt": "2026-03-19T10:00:00.000Z",
      "updatedAt": "2026-03-19T10:00:00.000Z",
      "lastMessageAt": "2026-03-19T10:00:00.000Z",
      "agentId": "agent-uuid"
    }
  ],
  "total": 10
}
```

#### POST /api/chat/sessions
创建新会话

Request Body:
```json
{
  "title": "会话标题",
  "agentId": "可选的agent ID"
}
```

Response:
```json
{
  "id": "uuid",
  "title": "会话标题",
  "agentId": "agent-uuid",
  "createdAt": "2026-03-19T10:00:00.000Z",
  "updatedAt": "2026-03-19T10:00:00.000Z"
}
```

#### PATCH /api/chat/sessions/:id
更新会话标题

Request Body:
```json
{
  "title": "新的会话标题"
}
```

Response:
```json
{
  "id": "uuid",
  "title": "新的会话标题",
  "agentId": "agent-uuid",
  "createdAt": "2026-03-19T10:00:00.000Z",
  "updatedAt": "2026-03-19T10:00:00.000Z"
}
```

#### DELETE /api/chat/sessions/:id
删除会话

Response:
```json
{
  "success": true,
  "sessionId": "uuid"
}
```

### Message Operations

#### GET /api/chat/sessions/:id/messages
获取会话消息（支持分页）

Query Parameters:
- `page` (optional): 页码，默认 1
- `limit` (optional): 每页数量，默认 50

Response:
```json
{
  "messages": [
    {
      "id": "uuid",
      "sessionId": "session-uuid",
      "content": "消息内容",
      "type": "user|agent|system",
      "agentId": "agent-uuid",
      "createdAt": "2026-03-19T10:00:00.000Z"
    }
  ],
  "total": 10
}
```

#### POST /api/chat/sessions/:id/messages
发送消息

Request Body:
```json
{
  "content": "消息内容",
  "agentId": "可选的agent ID"
}
```

Response:
```json
{
  "id": "uuid",
  "sessionId": "session-uuid",
  "content": "消息内容",
  "type": "user|agent",
  "agentId": "agent-uuid",
  "createdAt": "2026-03-19T10:00:00.000Z"
}
```

#### DELETE /api/chat/sessions/:sessionId/messages/:messageId
删除消息

Response:
```json
{
  "success": true,
  "messageId": "uuid"
}
```

## WebSocket Events

### Connection Events
- `connected` - 连接成功，返回 `{ socketId, timestamp }`

### Session Events
- `associate_session` - 关联客户端到会话，发送 `{ sessionId, userId? }`
- `session_associated` - 确认会话关联，返回 `{ sessionId, socketId }`

### Message Events
- `message` - 接收/发送消息，返回 `{ ..., senderId, timestamp }`

### Typing Events
- `typing` - 打字状态通知，发送 `{ sessionId, userId, isTyping, timestamp }`

### Streaming Events (for agent responses)
- `stream_start` - 开始流式响应，发送 `{ sessionId, agentId, messageId }`
- `stream_chunk` - 流式消息片段，发送 `{ sessionId, agentId, messageId, content, completed }`
- `stream_end` - 流式响应结束，发送 `{ sessionId, agentId, messageId }`

### User Events
- `user_connected` - 用户连接，返回 `{ socketId, timestamp }`
- `user_disconnected` - 用户断开连接，返回 `{ socketId, timestamp }`

## Usage Example

### Frontend Example (JavaScript)

```javascript
// Connect to WebSocket
const socket = io('http://localhost:3000');

socket.on('connected', ({ socketId }) => {
  console.log('Connected with socket ID:', socketId);
  
  // Associate with session
  socket.emit('associate_session', {
    sessionId: 'session-uuid',
    userId: 'user-uuid'
  });
});

// Listen for messages
socket.on('message', (data) => {
  console.log('Received message:', data);
});

// Listen for typing events
socket.on('typing', (data) => {
  console.log('Typing event:', data);
});

// Send a message
socket.emit('message', {
  sessionId: 'session-uuid',
  content: 'Hello!',
});

// Start typing
socket.emit('typing', {
  sessionId: 'session-uuid',
  isTyping: true
});

// Stop typing
socket.emit('typing', {
  sessionId: 'session-uuid',
  isTyping: false
});

// Receive streaming response
socket.on('stream_chunk', (data) => {
  console.log('Stream chunk:', data.content);
  if (data.completed) {
    console.log('Stream completed');
  }
});
```
