# 道达智能数字化平台 - 审批工作流开发指南

> **版本**: v1.0  
> **创建日期**: 2026-03-19  
> **适用范围**: 需要集成审批工作流的业务模块开发人员  
> **前置阅读**: `11_WORKFLOW_MODULE.md` (审批工作流模块设计文档)

---

## 📋 文档目录

1. [快速开始](#一快速开始)
2. [流程定义](#二流程定义)
3. [流程发起](#三流程发起)
4. [任务处理](#四任务处理)
5. [事件监听](#五事件监听)
6. [条件表达式](#六条件表达式)
7. [自定义节点](#七自定义节点)
8. [最佳实践](#八最佳实践)
9. [常见问题](#九常见问题)

---

## 一、快速开始

### 1.1 工作流集成步骤

```
┌─────────────────────────────────────────────────────────────────┐
│                    工作流集成流程                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: 定义流程                                               │
│     └── 在流程管理后台创建流程定义                              │
│                                                                 │
│  Step 2: 业务模块集成                                           │
│     ├── 引入 WorkflowService                                   │
│     ├── 调用发起流程接口                                        │
│     └── 监听流程事件                                            │
│                                                                 │
│  Step 3: 配置权限                                               │
│     └── 为角色配置流程发起和审批权限                            │
│                                                                 │
│  Step 4: 测试验证                                               │
│     └── 发起测试流程，验证审批流程                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 引入工作流服务

```typescript
// 在业务模块中引入 WorkflowModule

import { Module } from '@nestjs/common';
import { WorkflowModule } from '../workflow/workflow.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    WorkflowModule, // 引入工作流模块
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
```

### 1.3 快速示例

```typescript
// order.service.ts

import { Injectable } from '@nestjs/common';
import { WorkflowService } from '../workflow/workflow.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly workflowService: WorkflowService,
  ) {}

  /**
   * 提交订单审批
   */
  async submitForApproval(orderId: string, userId: string): Promise<void> {
    // 1. 获取订单信息
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new OrderNotFoundError(orderId);
    }

    // 2. 检查订单状态
    if (order.status !== 'draft') {
      throw new InvalidOrderStatusError('只有草稿状态的订单可以提交审批');
    }

    // 3. 发起审批流程
    const instance = await this.workflowService.startProcess({
      processKey: 'order_approval',           // 流程定义Key
      businessKey: orderId,                   // 业务ID
      variables: {                            // 流程变量
        orderAmount: order.totalAmount,
        orderType: order.type,
        customerId: order.customerId,
        department: order.department,
      },
      starterId: userId,                      // 发起人ID
    });

    // 4. 更新订单状态
    order.status = 'pending_approval';
    order.processInstanceId = instance.id;
    await this.orderRepository.save(order);

    // 5. 发送通知
    await this.notificationService.send({
      type: 'order_submitted',
      data: { orderId, processInstanceId: instance.id },
    });
  }

  /**
   * 处理审批通过
   */
  async handleApproved(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne(orderId);
    
    // 更新订单状态
    order.status = 'approved';
    order.approvedAt = new Date();
    await this.orderRepository.save(order);

    // 触发后续业务
    await this.orderApprovedHandler.execute(order);
  }

  /**
   * 处理审批拒绝
   */
  async handleRejected(orderId: string, reason: string): Promise<void> {
    const order = await this.orderRepository.findOne(orderId);
    
    // 更新订单状态
    order.status = 'rejected';
    order.rejectReason = reason;
    await this.orderRepository.save(order);

    // 发送通知
    await this.notificationService.send({
      type: 'order_rejected',
      to: order.createdBy,
      data: { orderId, reason },
    });
  }
}
```

---

## 二、流程定义

### 2.1 流程定义结构

```typescript
// 流程定义 JSON 结构
interface ProcessDefinition {
  // 基本信息
  key: string;                    // 流程唯一标识
  name: string;                   // 流程名称
  description?: string;           // 流程描述
  category?: string;              // 流程分类

  // 流程配置
  formKey?: string;               // 表单Key
  initiator?: string;             // 发起人变量名

  // 节点定义
  nodes: NodeDefinition[];        // 节点列表
  edges: EdgeDefinition[];        // 连线列表

  // 事件配置
  listeners?: EventListener[];    // 事件监听器

  // 版本信息
  version: number;                // 版本号
  status: 'draft' | 'published' | 'deprecated';  // 状态
}
```

### 2.2 节点类型

```typescript
// 节点类型枚举
enum NodeType {
  // 基础节点
  START = 'start',               // 开始节点
  END = 'end',                   // 结束节点
  
  // 任务节点
  USER_TASK = 'user_task',       // 用户任务
  SERVICE_TASK = 'service_task', // 服务任务
  
  // 网关节点
  EXCLUSIVE_GATEWAY = 'exclusive_gateway',  // 排他网关
  PARALLEL_GATEWAY = 'parallel_gateway',    // 并行网关
  INCLUSIVE_GATEWAY = 'inclusive_gateway',  // 包容网关
  
  // 其他节点
  SUB_PROCESS = 'sub_process',   // 子流程
  CALL_ACTIVITY = 'call_activity', // 调用活动
  SCRIPT_TASK = 'script_task',   // 脚本任务
}
```

### 2.3 节点定义示例

```typescript
// 用户任务节点
interface UserTaskNode extends NodeDefinition {
  type: NodeType.USER_TASK;
  
  // 任务配置
  taskName: string;              // 任务名称
  taskDescription?: string;      // 任务描述
  
  // 审批人配置
  assignee?: string;             // 指定审批人 (变量或固定值)
  candidateUsers?: string[];     // 候选用户
  candidateGroups?: string[];    // 候选组
  
  // 任务配置
  priority?: number;             // 优先级
  dueDate?: string;              // 到期时间 (表达式)
  
  // 表单配置
  formKey?: string;              // 表单Key
  formFields?: FormField[];      // 表单字段
  
  // 操作配置
  actions?: TaskAction[];        // 允许的操作
}

// 任务操作
interface TaskAction {
  type: 'approve' | 'reject' | 'delegate' | 'transfer' | 'return' | 'add_sign';
  name: string;
  requiredReason?: boolean;      // 是否需要填写原因
  nextAssignee?: string;         // 下一步审批人 (委托/转办)
}
```

### 2.4 完整流程定义示例

```json
{
  "key": "order_approval",
  "name": "订单审批流程",
  "description": "用于订单提交后的审批流程",
  "category": "order",
  "version": 1,
  "status": "published",
  
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "name": "开始"
    },
    {
      "id": "dept_leader_approval",
      "type": "user_task",
      "name": "部门领导审批",
      "assignee": "${deptLeader}",
      "actions": [
        { "type": "approve", "name": "通过" },
        { "type": "reject", "name": "拒绝", "requiredReason": true },
        { "type": "return", "name": "退回" }
      ]
    },
    {
      "id": "amount_gateway",
      "type": "exclusive_gateway",
      "name": "金额判断"
    },
    {
      "id": "finance_approval",
      "type": "user_task",
      "name": "财务审批",
      "candidateGroups": ["finance_manager"],
      "condition": "${orderAmount > 100000}"
    },
    {
      "id": "ceo_approval",
      "type": "user_task",
      "name": "CEO审批",
      "assignee": "ceo",
      "condition": "${orderAmount > 500000}"
    },
    {
      "id": "service_notify",
      "type": "service_task",
      "name": "发送通知",
      "service": "notificationService",
      "method": "sendApprovalResult"
    },
    {
      "id": "end",
      "type": "end",
      "name": "结束"
    }
  ],
  
  "edges": [
    { "id": "e1", "source": "start", "target": "dept_leader_approval" },
    { "id": "e2", "source": "dept_leader_approval", "target": "amount_gateway" },
    { "id": "e3", "source": "amount_gateway", "target": "finance_approval", "condition": "${orderAmount > 100000}" },
    { "id": "e4", "source": "amount_gateway", "target": "service_notify", "condition": "${orderAmount <= 100000}" },
    { "id": "e5", "source": "finance_approval", "target": "ceo_approval", "condition": "${orderAmount > 500000}" },
    { "id": "e6", "source": "finance_approval", "target": "service_notify", "condition": "${orderAmount <= 500000}" },
    { "id": "e7", "source": "ceo_approval", "target": "service_notify" },
    { "id": "e8", "source": "service_notify", "target": "end" }
  ],
  
  "listeners": [
    {
      "event": "process_completed",
      "type": "service",
      "service": "orderService",
      "method": "handleProcessCompleted"
    }
  ]
}
```

---

## 三、流程发起

### 3.1 发起流程API

```typescript
// 发起流程参数
interface StartProcessDto {
  processKey: string;             // 流程定义Key (必填)
  businessKey: string;            // 业务ID (必填)
  variables: Record<string, any>; // 流程变量 (可选)
  starterId: string;              // 发起人ID (必填)
  attachments?: Attachment[];     // 附件列表 (可选)
  urgent?: boolean;               // 是否紧急 (可选)
}

// 发起流程响应
interface ProcessInstance {
  id: string;                     // 流程实例ID
  processKey: string;             // 流程定义Key
  businessKey: string;            // 业务ID
  status: ProcessStatus;          // 流程状态
  currentNodes: NodeInstance[];   // 当前节点
  startTime: Date;                // 开始时间
  starterId: string;              // 发起人ID
  variables: Record<string, any>; // 流程变量
}
```

### 3.2 发起流程示例

```typescript
// 基本流程发起
const instance = await workflowService.startProcess({
  processKey: 'leave_approval',
  businessKey: leaveId,
  starterId: userId,
  variables: {
    applicant: userId,
    leaveType: 'annual',
    startDate: '2026-04-01',
    endDate: '2026-04-05',
    days: 5,
    reason: '个人休假',
  },
});

// 带附件的流程发起
const instance = await workflowService.startProcess({
  processKey: 'expense_reimbursement',
  businessKey: expenseId,
  starterId: userId,
  variables: {
    amount: 5000,
    category: 'travel',
    department: 'sales',
  },
  attachments: [
    {
      name: '发票.pdf',
      url: 'https://storage.example.com/invoice.pdf',
      type: 'application/pdf',
    },
  ],
  urgent: true,
});
```

---

## 四、任务处理

### 4.1 任务操作类型

```typescript
// 操作类型
enum TaskActionType {
  APPROVE = 'approve',          // 通过
  REJECT = 'reject',            // 拒绝
  DELEGATE = 'delegate',        // 委托
  TRANSFER = 'transfer',        // 转办
  RETURN = 'return',            // 退回
  ADD_SIGN = 'add_sign',        // 加签
  CLAIM = 'claim',              // 认领
  UNCLAIM = 'unclaim',          // 取消认领
}
```

### 4.2 任务操作示例

```typescript
// 审批通过
await workflowService.completeTask({
  taskId: 'task_123',
  action: 'approve',
  userId: 'user_001',
  opinion: '同意，符合审批条件',
});

// 审批拒绝
await workflowService.completeTask({
  taskId: 'task_123',
  action: 'reject',
  userId: 'user_001',
  opinion: '金额超出预算，请重新调整',
});

// 委托给他人审批
await workflowService.completeTask({
  taskId: 'task_123',
  action: 'delegate',
  userId: 'user_001',
  opinion: '请财务经理协助审核',
  nextAssignee: 'user_002',
});

// 转办
await workflowService.completeTask({
  taskId: 'task_123',
  action: 'transfer',
  userId: 'user_001',
  opinion: '我无权审批，转给部门经理',
  nextAssignee: 'user_003',
});

// 退回到上一个节点
await workflowService.completeTask({
  taskId: 'task_123',
  action: 'return',
  userId: 'user_001',
  opinion: '信息不完整，请补充材料',
});

// 认领任务
await workflowService.claimTask({
  taskId: 'task_123',
  userId: 'user_001',
});
```

---

## 五、事件监听

### 5.1 事件类型

```typescript
// 流程事件类型
enum ProcessEventType {
  // 流程生命周期事件
  PROCESS_STARTED = 'process_started',
  PROCESS_COMPLETED = 'process_completed',
  PROCESS_TERMINATED = 'process_terminated',
  PROCESS_CANCELLED = 'process_cancelled',

  // 任务生命周期事件
  TASK_CREATED = 'task_created',
  TASK_ASSIGNED = 'task_assigned',
  TASK_COMPLETED = 'task_completed',
  TASK_TIMEOUT = 'task_timeout',
}
```

### 5.2 事件订阅示例

```typescript
@Injectable()
export class OrderWorkflowSubscriber {
  constructor(private readonly orderService: OrderService) {}

  @OnEvent('process_completed')
  async handleProcessCompleted(event: ProcessCompletedEvent) {
    if (event.processKey !== 'order_approval') {
      return;
    }

    const approved = event.variables.approved;
    
    if (approved) {
      await this.orderService.handleApproved(event.businessKey);
    } else {
      await this.orderService.handleRejected(
        event.businessKey,
        event.variables.rejectReason,
      );
    }
  }

  @OnEvent('task_created')
  async handleTaskCreated(event: TaskCreatedEvent) {
    // 发送待办通知
    await this.orderService.sendTaskNotification({
      taskId: event.taskId,
      assignee: event.assignee,
      businessKey: event.businessKey,
    });
  }

  @OnEvent('task_timeout')
  async handleTaskTimeout(event: TaskTimeoutEvent) {
    // 发送催办通知
    await this.orderService.sendUrgentNotification({
      taskId: event.taskId,
      assignee: event.assignee,
    });
  }
}
```

---

## 六、条件表达式

### 6.1 表达式语法

```typescript
// 变量引用
${variableName}
${user.name}
${order.totalAmount}

// 比较运算
${amount > 10000}
${status == 'approved'}
${type != 'urgent'}
${days >= 3}

// 逻辑运算
${amount > 10000 && status == 'pending'}
${type == 'urgent' || priority == 'high'}
${!(amount > 10000)}

// 条件表达式
${amount > 100000 ? 'high' : 'normal'}
```

### 6.2 条件网关示例

```json
// 排他网关 (只能选择一条路径)
{
  "id": "amount_check",
  "type": "exclusive_gateway",
  "outgoing": [
    { "target": "ceo_approval", "condition": "${orderAmount > 500000}" },
    { "target": "finance_approval", "condition": "${orderAmount > 100000}" },
    { "target": "auto_approve", "condition": "${orderAmount <= 100000}" }
  ]
}

// 并行网关 (所有路径都执行)
{
  "id": "parallel_approval",
  "type": "parallel_gateway",
  "outgoing": [
    { "target": "dept_approval" },
    { "target": "finance_approval" },
    { "target": "legal_approval" }
  ]
}
```

---

## 七、自定义节点

### 7.1 自定义节点接口

```typescript
interface CustomNodeHandler {
  type: string;
  execute(context: NodeExecutionContext): Promise<NodeExecutionResult>;
  rollback?(context: NodeExecutionContext): Promise<void>;
}
```

### 7.2 实现示例

```typescript
@Injectable()
export class DataSyncNodeHandler implements CustomNodeHandler {
  type = 'data_sync';
  
  constructor(private readonly dataSyncService: DataSyncService) {}

  async execute(context: NodeExecutionContext): Promise<NodeExecutionResult> {
    const { nodeConfig, variables, businessKey } = context;
    
    try {
      const result = await this.dataSyncService.sync({
        source: nodeConfig.config.source,
        target: nodeConfig.config.target,
        data: variables,
        businessKey: businessKey,
      });

      return {
        success: true,
        variables: { syncResult: result },
      };
    } catch (error) {
      return { success: false, error };
    }
  }
}
```

---

## 八、最佳实践

### 8.1 流程设计原则

```
1. 单一职责 - 每个流程只处理一种业务场景
2. 简化流程 - 审批层级不超过4级
3. 明确状态 - 每个节点输出状态要明确
4. 异常处理 - 设计异常分支和回退路径
5. 可追溯性 - 记录审批历史和操作日志
```

### 8.2 变量设计规范

```typescript
// 好的变量设计
const variables = {
  orderAmount: 50000,
  orderType: 'normal',
  deptLeader: 'user_001',
  approved: true,
  opinion: '同意',
};

// 避免的设计
const variables = {
  a: 50000,              // 变量名不清晰
  password: 'xxx',       // 包含敏感信息
  order: { ... },        // 嵌套太深
};
```

---

## 九、常见问题

### 9.1 流程发起失败

```typescript
// 问题: 流程定义不存在
// 解决: 检查流程Key是否正确，流程是否已发布

try {
  await workflowService.startProcess({...});
} catch (error) {
  if (error instanceof ProcessDefinitionNotFoundError) {
    console.error('流程定义不存在:', error.processKey);
  }
}
```

### 9.2 任务无法处理

```typescript
// 问题: 任务已分配给其他人
const task = await workflowService.getTask(taskId);
if (task.assignee && task.assignee !== userId) {
  throw new Error('任务已分配给其他人');
}

// 问题: 没有权限
const hasPermission = 
  task.assignee === userId ||
  task.candidateUsers?.includes(userId);

if (!hasPermission) {
  throw new NoPermissionError();
}
```

### 9.3 流程卡住不流转

```typescript
// 排查步骤
const processInstance = await workflowService.getProcessInstance(processInstanceId);
const currentNode = processInstance.currentNodes[0];

console.log('当前节点:', currentNode);
console.log('流程变量:', processInstance.variables);

// 检查条件表达式
for (const edge of currentNode.outgoing) {
  const result = evaluateExpression(edge.condition, processInstance.variables);
  console.log(`条件 ${edge.condition} = ${result}`);
}
```

---

## 附录：API参考

### 流程定义API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/workflow/definitions` | 获取流程定义列表 |
| GET | `/workflow/definitions/:key` | 获取流程定义详情 |
| POST | `/workflow/definitions` | 创建流程定义 |
| PUT | `/workflow/definitions/:key` | 更新流程定义 |
| POST | `/workflow/definitions/:key/publish` | 发布流程定义 |

### 流程实例API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/workflow/instances` | 发起流程 |
| GET | `/workflow/instances/:id` | 获取流程实例详情 |
| POST | `/workflow/instances/:id/cancel` | 取消流程 |
| GET | `/workflow/instances/:id/history` | 获取流程历史 |

### 任务API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/workflow/tasks/todo` | 获取待办任务 |
| GET | `/workflow/tasks/done` | 获取已办任务 |
| POST | `/workflow/tasks/:id/complete` | 完成任务 |
| POST | `/workflow/tasks/:id/claim` | 认领任务 |
| POST | `/workflow/tasks/:id/delegate` | 委托任务 |

---

> **文档维护**: 渔晓白  
> **最后更新**: 2026-03-19