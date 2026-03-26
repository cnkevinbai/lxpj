# OpenClaw Dashboard Backend API

## Tasks API

### Get All Tasks (with pagination and filters)

```
GET /api/tasks
```

**Query Parameters:**
- `status` - Filter by status (pending, in_progress, completed, cancelled)
- `priority` - Filter by priority (low, medium, high)
- `assignee` - Filter by assignee
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Task Title",
      "description": "...",
      "status": "pending",
      "priority": "medium",
      "assignee": "user",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "tags": ["tag1", "tag2"],
      "createdAt": "2024-01-10T00:00:00.000Z",
      "updatedAt": "2024-01-10T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Get Task by ID

```
GET /api/tasks/:id
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Task Title",
  "description": "...",
  "status": "pending",
  "priority": "medium",
  "assignee": "user",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "tags": ["tag1", "tag2"],
  "createdAt": "2024-01-10T00:00:00.000Z",
  "updatedAt": "2024-01-10T00:00:00.000Z"
}
```

### Create New Task

```
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Optional description",
  "status": "pending",
  "priority": "medium",
  "assignee": "user@email.com",
  "dueDate": "2024-01-15",
  "tags": ["tag1", "tag2"]
}
```

**Response:**
```json
{
  "id": "new-uuid",
  "title": "Task Title",
  "description": "Optional description",
  "status": "pending",
  "priority": "medium",
  "assignee": "user@email.com",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "tags": ["tag1", "tag2"],
  "createdAt": "2024-01-10T10:00:00.000Z",
  "updatedAt": "2024-01-10T10:00:00.000Z"
}
```

### Update Task

```
PATCH /api/tasks/:id
```

**Request Body:** (all fields are optional)
```json
{
  "title": "Updated Title",
  "status": "in_progress"
}
```

### Delete Task

```
DELETE /api/tasks/:id
```

**Response:**
```json
{
  "success": true,
  "taskId": "uuid"
}
```

### Complete Task

```
POST /api/tasks/:id/complete
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Task Title",
  "description": "...",
  "status": "completed",
  "priority": "medium",
  "assignee": "user",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "tags": ["tag1", "tag2"],
  "createdAt": "2024-01-10T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### Get Task Statistics

```
GET /api/tasks/stats
```

**Response:**
```json
{
  "total": 10,
  "pending": 3,
  "inProgress": 4,
  "completed": 2,
  "cancelled": 1,
  "byPriority": {
    "low": 2,
    "medium": 5,
    "high": 3
  }
}
```

---

## Settings API

### Get All Settings

```
GET /api/settings
```

**Response:**
```json
{
  "theme": "system",
  "language": "zh",
  "notifications": {
    "enabled": true,
    "sound": true,
    "email": false
  },
  "apiKeys": {
    "openai": "sk-...",
    "anthropic": "sk-..."
  },
  "lastModified": "2024-01-15T10:00:00.000Z"
}
```

### Update Settings

```
PATCH /api/settings
```

**Request Body:** (all fields are optional)
```json
{
  "theme": "dark",
  "language": "en",
  "notifications": {
    "enabled": true,
    "sound": false
  },
  "apiKeys": {
    "openai": "sk-new-key"
  }
}
```

**Response:**
```json
{
  "theme": "dark",
  "language": "en",
  "notifications": {
    "enabled": true,
    "sound": false,
    "email": false
  },
  "apiKeys": {
    "openai": "sk-new-key",
    "anthropic": "sk-..."
  },
  "lastModified": "2024-01-15T11:00:00.000Z"
}
```

### Reset Settings to Default

```
POST /api/settings/reset
```

**Response:**
```json
{
  "theme": "system",
  "language": "zh",
  "notifications": {
    "enabled": true,
    "sound": true,
    "email": false
  },
  "apiKeys": {},
  "lastModified": "2024-01-15T12:00:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Task with ID xxx not found"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```
