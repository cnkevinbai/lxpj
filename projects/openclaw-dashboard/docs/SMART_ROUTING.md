# 智能代理路由系统 - 7x24 高可用

## 功能概述

主代理（渔晓白）能够自动识别任务关键词，并将任务分配给合适的专业代理。

## 架构

```
用户消息 → 智能路由检测 → 自动切换代理 → 后台任务队列 → 专业代理处理
                ↓                                    ↓
           关键词匹配                          任务状态监控
```

## 支持的专业代理

| 代理 | 关键词 | 任务类型 |
|------|--------|----------|
| **Morgan** (架构师) | 架构、微服务、系统设计、技术选型 | code_generation |
| **Ryan** (后端开发) | 后端、API、接口、NestJS、数据库 | code_generation |
| **Chloe** (前端开发) | 前端、React、Vue、组件、页面 | code_generation |
| **Diana** (数据库工程师) | 数据库、SQL、索引、Prisma | code_generation |
| **Taylor** (测试工程师) | 测试、单元测试、E2E、Jest | test_generation |
| **Blake** (代码审查) | 代码审查、重构、代码质量 | code_review |
| **Sophia** (安全工程师) | 安全、认证、授权、JWT、漏洞 | code_review |
| **Sam** (运维工程师) | 部署、Docker、K8s、CI/CD | batch_process |
| **Maya** (UI设计师) | UI、UX、设计、界面、原型 | agent_chat |
| **Alex** (产品经理) | 产品、需求、PRD、用户故事 | agent_chat |

## 关键文件

### 前端

| 文件 | 功能 |
|------|------|
| `src/services/agent-router.ts` | 智能路由核心逻辑 |
| `src/services/task-scheduler.ts` | 7x24 后台任务队列 |
| `src/pages/ChatPage.tsx` | 集成智能路由和任务提交 |
| `src/components/task/TaskMonitor.tsx` | 任务状态监控组件 |

### 后端

| 文件 | 功能 |
|------|------|
| `backend/src/services/stream.service.ts` | SSE 流式响应 |
| `backend/src/controllers/stream.controller.ts` | SSE 端点 |

## 使用示例

### 自动路由

用户发送：
```
帮我设计一个微服务架构
```

系统自动：
1. 检测关键词 "微服务"、"架构"
2. 匹配到 **Morgan** (架构师)
3. 自动切换到 Morgan
4. 提交后台任务到队列
5. 流式返回响应

### 任务监控

页面右下角显示：
- 📋 运行中任务数量
- ⏳ 待处理任务数量
- ✅ 已完成任务数量

点击展开查看详情。

## 7x24 高可用特性

### 任务持久化
- 任务存储在 localStorage
- 页面刷新后自动恢复
- 运行中任务自动重试

### 失败重试
- 最多重试 3 次
- 指数退避延迟
- 错误信息记录

### 并发控制
- 最大并发 3 个任务
- 按优先级排序
- Agent 独占保护

### 后台处理
- Service Worker 支持
- 离线任务缓存
- 自动清理过期任务

## API

### 提交任务

```typescript
const taskId = taskScheduler.submitTask(
  'code_generation',
  { message: '帮我写一个登录功能', agentId: 'backend-dev' },
  { priority: 8, timeout: 120000 }
);
```

### 查询状态

```typescript
const task = taskScheduler.getTask(taskId);
console.log(task.status); // 'pending' | 'running' | 'completed' | 'failed'
```

### 获取统计

```typescript
const stats = taskScheduler.getStats();
// { total: 10, pending: 2, running: 1, completed: 6, failed: 1 }
```

---

_最后更新: 2026-03-19 16:40_