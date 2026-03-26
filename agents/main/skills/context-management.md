# 上下文管理技能

## 📋 技能说明

管理会话状态、历史记录和用户偏好，确保多轮对话连贯性。

---

## 🎯 管理内容

### 会话状态

```typescript
interface SessionContext {
  // 会话标识
  sessionId: string
  
  // 创建时间
  createdAt: Date
  
  // 最后活跃
  lastActiveAt: Date
  
  // 当前状态
  status: 'idle' | 'processing' | 'waiting_input'
  
  // 当前任务
  currentTask?: Task
  
  // 活跃子 Agent
  activeAgents: AgentId[]
}
```

### 任务历史

```typescript
interface TaskHistory {
  // 任务记录
  tasks: TaskRecord[]
  
  // 成功任务
  successful: TaskRecord[]
  
  // 失败任务
  failed: TaskRecord[]
}

interface TaskRecord {
  taskId: string
  type: TaskType
  agent: AgentId
  input: string
  output: string
  status: 'success' | 'failed'
  duration: number
  timestamp: Date
}
```

### 用户偏好

```typescript
interface UserPreferences {
  // 首选模型
  preferredModel?: ModelId
  
  // 首选 Agent
  preferredAgent?: AgentId
  
  // 响应风格
  responseStyle: 'concise' | 'detailed'
  
  // 语言偏好
  language: 'zh' | 'en'
  
  // 通知设置
  notifications: {
    completion: boolean
    error: boolean
  }
}
```

---

## 📝 状态管理

### 任务追踪

```typescript
class TaskTracker {
  private tasks = new Map<string, TaskState>()
  
  startTask(taskId: string, task: Task): void {
    this.tasks.set(taskId, {
      ...task,
      status: 'running',
      startTime: Date.now()
    })
  }
  
  completeTask(taskId: string, result: Result): void {
    const task = this.tasks.get(taskId)
    if (task) {
      task.status = 'completed'
      task.result = result
      task.endTime = Date.now()
    }
  }
  
  failTask(taskId: string, error: Error): void {
    const task = this.tasks.get(taskId)
    if (task) {
      task.status = 'failed'
      task.error = error
    }
  }
}
```

### 上下文传递

```typescript
// 向子 Agent 传递上下文
function buildContextForAgent(
  agent: AgentId,
  task: Task,
  history: TaskHistory
): AgentContext {
  return {
    // 当前任务
    currentTask: task,
    
    // 相关历史
    relevantHistory: findRelevantHistory(history, task),
    
    // 父会话信息
    parentSession: {
      id: session.sessionId,
      preferences: session.userPreferences
    }
  }
}
```

---

## 📝 持久化

```typescript
interface ContextStorage {
  // 保存会话
  saveSession(session: SessionContext): Promise<void>
  
  // 加载会话
  loadSession(sessionId: string): Promise<SessionContext>
  
  // 保存历史
  saveHistory(history: TaskHistory): Promise<void>
  
  // 加载历史
  loadHistory(sessionId: string): Promise<TaskHistory>
}
```

---

## ✅ 管理检查

- [ ] 会话状态正确
- [ ] 历史记录完整
- [ ] 偏好设置生效
- [ ] 上下文传递正确

---

## 📚 相关元技能

- `task-analysis` - 任务理解
- `result-aggregation` - 结果聚合