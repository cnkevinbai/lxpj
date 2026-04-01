# 审批流程引擎 + 通知系统设计方案

> 设计日期：2026-03-30  
> 版本：v1.0.0  
> 目标：支持审批流转到钉钉平台，双向同步审批结果

---

## 一、系统架构总览

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        审批流程 + 通知系统架构                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     业务模块层                                    │   │
│  │  CRM ──── ERP ──── HR ──── Finance ──── Service                   │   │
│  │   │       │       │       │           │                          │   │
│  │   └───┬───┴───┬───┴───┬───┴───────────┘                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                      │                                                  │
│                      ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  审批流程引擎 (Workflow)                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │ 流程定义器  │  │ 流程运行器  │  │ 钉钉同步器  │              │   │
│  │  │ Definition  │  │ Runtime     │  │ DingTalk    │              │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │
│  │                                                                  │   │
│  │  核心功能:                                                        │   │
│  │  ├── 流程定义 (节点、审批人、条件分支)                             │   │
│  │  ├── 流程启动 (业务触发、实例创建)                                 │   │
│  │  ├── 流程流转 (审批操作、节点推进)                                 │   │
│  │  ├── 钉钉推送 (审批同步到钉钉)                                     │   │
│  │  └── 钉钉回调 (审批结果回写)                                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                      │                                                  │
│                      ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  通知提醒系统 (Notification)                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │ 消息中心    │  │ 多通道适配  │  │ 消息模板    │              │   │
│  │  │ MessageHub │  │ Adapters    │  │ Templates   │              │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │
│  │                                                                  │   │
│  │  通知通道:                                                        │   │
│  │  ├── 站内消息 (WebSocket实时推送)                                 │   │
│  │  ├── 邮件通知 (SMTP发送)                                          │   │
│  │  ├── 钉钉通知 (钉钉工作通知)                                      │   │
│  │  └── 系统提醒 (浏览器Notification)                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 二、审批流程引擎设计

### 2.1 数据模型

```typescript
// 流程定义
interface WorkflowDefinition {
  id: string;                  // 流程定义ID
  name: string;                // 流程名称
  code: string;                // 流程编码 (如: purchase-approval)
  category: string;            // 流程分类 (crm/erp/hr/finance)
  version: number;             // 版本号
  description?: string;        // 流程描述
  nodes: WorkflowNode[];       // 流程节点
  isActive: boolean;           // 是否激活
  createdBy: string;           // 创建人
  createdAt: Date;             // 创建时间
}

// 流程节点
interface WorkflowNode {
  id: string;                  // 节点ID
  name: string;                // 节点名称
  type: NodeType;              // 节点类型
  order: number;               // 节点顺序
  
  // 审批节点配置
  approverType?: ApproverType; // 审批人类型
  approverId?: string;         // 指定审批人
  approverRole?: string;       // 审批角色
  approveMode?: ApproveMode;   // 审批模式 (单人/会签/或签)
  
  // 条件分支配置
  conditions?: BranchCondition[]; // 分支条件
  
  // 钉钉同步配置
  dingtalkSync?: boolean;      // 是否同步到钉钉
  dingtalkProcessCode?: string; // 钉钉流程编码
  
  // 超时配置
  timeout?: number;            // 超时时间(小时)
  timeoutAction?: TimeoutAction; // 超时动作
  
  // 通知配置
  notifyChannels?: NotifyChannel[]; // 通知渠道
}

// 节点类型
enum NodeType {
  START = 'start',             // 开始节点
  APPROVE = 'approve',         // 审批节点
  CONDITION = 'condition',     // 条件分支节点
  PARALLEL = 'parallel',       // 并行节点
  END = 'end',                 // 结束节点
}

// 审批人类型
enum ApproverType {
  USER = 'user',               // 指定用户
  ROLE = 'role',               // 角色
  DEPT_HEAD = 'dept_head',     // 部门主管
  INITIATOR = 'initiator',     // 发起人自选
  FORM_FIELD = 'form_field',   // 表单字段指定
}

// 审批模式
enum ApproveMode {
  SINGLE = 'single',           // 单人审批
  ALL = 'all',                 // 会签 (所有人都需审批)
  ANY = 'any',                 // 或签 (任一人审批即可)
  SEQUENCE = 'sequence',       // 顺序审批
}

// 流程实例
interface WorkflowInstance {
  id: string;                  // 实例ID
  definitionId: string;        // 流程定义ID
  businessType: string;        // 业务类型 (purchase/leave/expense)
  businessId: string;          // 业务ID
  title: string;               // 审批标题
  content?: string;            // 审批内容
  initiatorId: string;         // 发起人ID
  status: InstanceStatus;      // 实例状态
  currentNodeId: string;       // 当前节点ID
  dingtalkInstanceId?: string; // 钉钉实例ID
  createdAt: Date;             // 创建时间
  updatedAt: Date;             // 更新时间
  finishedAt?: Date;           // 完成时间
}

// 实例状态
enum InstanceStatus {
  RUNNING = 'running',         // 运行中
  APPROVED = 'approved',       // 已通过
  REJECTED = 'rejected',       // 已拒绝
  CANCELLED = 'cancelled',     // 已撤销
  TIMEOUT = 'timeout',         // 已超时
}

// 审批记录
interface ApprovalRecord {
  id: string;                  // 记录ID
  instanceId: string;          // 实例ID
  nodeId: string;              // 节点ID
  approverId: string;          // 审批人ID
  action: ApprovalAction;      // 审批动作
  comment?: string;            // 审批意见
  attachments?: string[];      // 附件
  approvedAt: Date;            // 审批时间
  source: ApprovalSource;      // 审批来源
}

// 审批动作
enum ApprovalAction {
  APPROVE = 'approve',         // 同意
  REJECT = 'reject',           // 拒绝
  TRANSFER = 'transfer',       // 转交
  RETURN = 'return',           // 退回
  CANCEL = 'cancel',           // 撤销
}

// 审批来源
enum ApprovalSource {
  SYSTEM = 'system',           // 系统内审批
  DINGTALK = 'dingtalk',       // 钉钉审批
}
```

### 2.2 钉钉审批集成设计

```typescript
// 钉钉审批同步配置
interface DingTalkApprovalConfig {
  enabled: boolean;            // 是否启用钉钉同步
  processCode: string;         // 钉钉审批流程编码
  syncDirection: SyncDirection; // 同步方向
  callbackUrl: string;         // 回调地址
}

// 同步方向
enum SyncDirection {
  TO_DINGTALK = 'to_dingtalk', // 单向同步到钉钉
  BIDIRECTIONAL = 'bidirectional', // 双向同步
}

// 钉钉审批实例
interface DingTalkApprovalInstance {
  processInstanceId: string;   // 钉钉实例ID
  businessId: string;          // 业务ID
  systemInstanceId: string;    // 系统实例ID
  title: string;               // 审批标题
  originatorUserId: string;    // 发起人钉钉ID
  formComponentValues: FormValue[]; // 表单数据
  status: DingTalkStatus;      // 钉钉状态
  result: DingTalkResult;      // 审批结果
}

// 钉钉审批状态
enum DingTalkStatus {
  NEW = 'NEW',                 // 新建
  RUNNING = 'RUNNING',         // 运行中
  COMPLETED = 'COMPLETED',     // 完成
  CANCELED = 'CANCELED',       // 取消
}

// 钉钉审批结果
enum DingTalkResult {
  AGREE = 'agree',             // 同意
  REFUSE = 'refuse',           // 拒绝
  REDIRECT = 'redirect',       // 转交
}
```

### 2.3 核心服务接口

```typescript
// 流程定义服务
interface IWorkflowDefinitionService {
  // 流程定义 CRUD
  create(dto: CreateWorkflowDto): Promise<WorkflowDefinition>;
  update(id: string, dto: UpdateWorkflowDto): Promise<WorkflowDefinition>;
  delete(id: string): Promise<void>;
  get(id: string): Promise<WorkflowDefinition>;
  list(filter: WorkflowFilter): Promise<WorkflowDefinition[]>;
  
  // 流程激活/停用
  activate(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
  
  // 流程版本管理
  publish(id: string): Promise<WorkflowDefinition>;
  getVersionHistory(id: string): Promise<WorkflowDefinition[]>;
}

// 流程运行服务
interface IWorkflowRuntimeService {
  // 流程启动
  start(dto: StartWorkflowDto): Promise<WorkflowInstance>;
  
  // 审批操作
  approve(instanceId: string, dto: ApproveDto): Promise<WorkflowInstance>;
  reject(instanceId: string, dto: RejectDto): Promise<WorkflowInstance>;
  transfer(instanceId: string, dto: TransferDto): Promise<WorkflowInstance>;
  return(instanceId: string, dto: ReturnDto): Promise<WorkflowInstance>;
  cancel(instanceId: string, reason: string): Promise<WorkflowInstance>;
  
  // 流程查询
  getMyPending(userId: string): Promise<WorkflowInstance[]>;
  getMyInitiated(userId: string): Promise<WorkflowInstance[]>;
  getMyApproved(userId: string): Promise<WorkflowInstance[]>;
  getDetail(instanceId: string): Promise<WorkflowInstance>;
  getHistory(instanceId: string): Promise<ApprovalRecord[]>;
}

// 钉钉同步服务
interface IDingTalkWorkflowService {
  // 同步审批到钉钉
  syncToDingTalk(instance: WorkflowInstance): Promise<DingTalkApprovalInstance>;
  
  // 接收钉钉审批回调
  handleCallback(callback: DingTalkCallback): Promise<void>;
  
  // 查询钉钉审批状态
  queryStatus(dingtalkInstanceId: string): Promise<DingTalkApprovalInstance>;
  
  // 映射钉钉审批结果
  mapDingTalkResult(result: DingTalkResult): ApprovalAction;
}
```

---

## 三、通知提醒系统设计

### 3.1 数据模型

```typescript
// 通知消息
interface NotificationMessage {
  id: string;                  // 消息ID
  type: MessageType;           // 消息类型
  title: string;               // 消息标题
  content: string;             // 消息内容
  category: MessageCategory;   // 消息分类
  
  // 发送信息
  senderId?: string;           // 发送人ID
  receiverIds: string[];       // 接收人ID列表
  channels: NotifyChannel[];   // 发送渠道
  
  // 关联信息
  businessType?: string;       // 业务类型
  businessId?: string;         // 业务ID
  workflowInstanceId?: string; // 审批实例ID
  
  // 状态
  status: MessageStatus;       // 消息状态
  sentAt?: Date;               // 发送时间
  readAt?: Date;               // 阅读时间
  
  // 模板
  templateId?: string;         // 消息模板ID
  templateData?: object;       // 模板数据
  
  createdAt: Date;             // 创建时间
}

// 消息类型
enum MessageType {
  SYSTEM = 'system',           // 系统消息
  APPROVAL = 'approval',       // 审批消息
  REMINDER = 'reminder',       // 提醒消息
  NOTICE = 'notice',           // 公告消息
  TASK = 'task',               // 任务消息
}

// 消息分类
enum MessageCategory {
  INFO = 'info',               // 信息
  WARNING = 'warning',         // 警告
  ERROR = 'error',             // 错误
  SUCCESS = 'success',         // 成功
}

// 消息状态
enum MessageStatus {
  PENDING = 'pending',         // 待发送
  SENT = 'sent',               // 已发送
  READ = 'read',               // 已阅读
  FAILED = 'failed',           // 发送失败
}

// 通知渠道
enum NotifyChannel {
  IN_APP = 'in_app',           // 站内消息
  EMAIL = 'email',             // 邮件
  DINGTALK = 'dingtalk',       // 钉钉
  BROWSER = 'browser',         // 浏览器通知
  SMS = 'sms',                 // 短信 (可选)
}

// 消息模板
interface MessageTemplate {
  id: string;                  // 模板ID
  code: string;                // 模板编码
  name: string;                // 模板名称
  type: MessageType;           // 消息类型
  
  // 内容模板
  titleTemplate: string;       // 标题模板
  contentTemplate: string;     // 内容模板
  
  // 渠道模板
  emailTemplate?: string;      // 邮件模板 (HTML)
  dingtalkTemplate?: string;   // 钉钉模板 (Markdown)
  
  // 变量定义
  variables: TemplateVariable[]; // 模板变量
  
  isActive: boolean;           // 是否激活
}

// 模板变量
interface TemplateVariable {
  name: string;                // 变量名
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;           // 是否必填
  defaultValue?: any;          // 默认值
}

// 用户通知偏好
interface UserNotifyPreference {
  userId: string;              // 用户ID
  enabledChannels: NotifyChannel[]; // 启用的渠道
  disabledTypes?: MessageType[]; // 禁用的类型
  quietHours?: QuietHours;     // 免打扰时段
  emailEnabled?: boolean;      // 邮件开关
  dingtalkEnabled?: boolean;   // 钉钉开关
}

// 免打扰时段
interface QuietHours {
  start: string;               // 开始时间 (HH:mm)
  end: string;                 // 结束时间 (HH:mm)
}
```

### 3.2 核心服务接口

```typescript
// 通知服务
interface INotificationService {
  // 发送消息
  send(dto: SendNotificationDto): Promise<NotificationMessage>;
  sendBatch(dto: BatchNotificationDto): Promise<NotificationMessage[]>;
  
  // 消息管理
  getMyMessages(userId: string, filter: MessageFilter): Promise<NotificationMessage[]>;
  getUnreadCount(userId: string): Promise<number>;
  markAsRead(messageId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  delete(messageId: string): Promise<void>;
  
  // 模板管理
  createTemplate(dto: CreateTemplateDto): Promise<MessageTemplate>;
  updateTemplate(id: string, dto: UpdateTemplateDto): Promise<MessageTemplate>;
  getTemplate(id: string): Promise<MessageTemplate>;
  
  // 偏好管理
  setPreference(userId: string, dto: PreferenceDto): Promise<UserNotifyPreference>;
  getPreference(userId: string): Promise<UserNotifyPreference>;
}

// 通道适配器接口
interface INotifyChannelAdapter {
  channel: NotifyChannel;      // 渠道类型
  
  // 发送消息
  send(message: NotificationMessage, receiver: ReceiverInfo): Promise<SendResult>;
  
  // 检查配置
  isConfigured(): boolean;
  
  // 获取配置
  getConfig(): ChannelConfig;
}

// 发送结果
interface SendResult {
  success: boolean;            // 是否成功
  messageId?: string;          // 消息ID
  error?: string;              // 错误信息
  sentAt: Date;                // 发送时间
}
```

---

## 四、钉钉审批双向同步流程

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     钉钉审批双向同步流程                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  系统内发起审批                                                          │
│  ━━━━━━━━━━━━━━━━━                                                      │
│                                                                         │
│  ┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │ 用户    │───▶│ 业务模块    │───▶│ Workflow    │───▶│ DingTalk    │  │
│  │ 发起    │    │ 创建申请    │    │ 启动流程    │    │ 同步到钉钉  │  │
│  └─────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                         │
│                       │                                                 │
│                       ▼                                                 │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       钉钉平台                                    │   │
│  │                                                                  │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │   │
│  │  │ 创建审批    │───▶│ 推送给审批人 │───▶│ 审批人在钉钉 │          │   │
│  │  │ 实例        │    │ 手机/PC      │    │ 进行审批    │          │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘          │   │
│  │                                                                  │   │
│  │                         审批操作                                 │   │
│  │                         ━━━━━━━━━                                │   │
│  │                         同意/拒绝/转交                           │   │
│  │                                                                  │   │
│  │                         │                                        │   │
│  │                         ▼                                        │   │
│  │                                                                  │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │                    钉钉回调 Webhook                         │  │   │
│  │  │  POST /api/v1/workflow/dingtalk/callback                   │  │   │
│  │  │  {                                                          │  │   │
│  │  │    processInstanceId: "xxx",                                │  │   │
│  │  │    result: "agree/refuse/redirect",                         │  │   │
│  │  │    approverUserId: "xxx",                                   │  │   │
│  │  │    comment: "审批意见",                                      │  │   │
│  │  │    timestamp: 1234567890                                    │  │   │
│  │  │  }                                                          │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                       │                                                 │
│                       ▼                                                 │
│                                                                         │
│  系统内处理回调                                                          │
│  ━━━━━━━━━━━━━━━━━                                                      │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐  │
│  │ DingTalk    │───▶│ Workflow    │───▶│ Notification│───▶│ 用户    │  │
│  │ 解析回调    │    │ 更新状态    │    │ 发送通知    │    │ 收到通知│  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────┘  │
│                                                                         │
│  ┌─────────────┐                                                        │
│  │ 业务模块    │◀─── 审批结果回写，业务状态更新                          │
│  │ 更新状态    │                                                        │
│  └─────────────┘                                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 五、模块文件结构

### 5.1 Workflow 模块

```
backend/src/modules/workflow/
├── workflow.module.ts          # 热插拔模块主文件
├── workflow.nest.module.ts     # NestJS 包装器
├── index.ts                    # 导出
├── services/
│   ├── workflow-definition.service.ts  # 流程定义服务
│   ├── workflow-runtime.service.ts     # 流程运行服务
│   ├── dingtalk-sync.service.ts        # 钉钉同步服务
│   └── approval-record.service.ts      # 审批记录服务
├── controllers/
│   ├── workflow.controller.ts          # 流程管理API
│   ├── approval.controller.ts          # 审批操作API
│   └── dingtalk-callback.controller.ts # 钉钉回调API
├── dto/
│   ├── create-workflow.dto.ts
│   ├── start-workflow.dto.ts
│   ├── approve.dto.ts
│   └── dingtalk-callback.dto.ts
├── entities/
│   ├── workflow-definition.entity.ts
│   ├── workflow-instance.entity.ts
│   ├── workflow-node.entity.ts
│   ├── approval-record.entity.ts
└── utils/
    ├── node-executor.ts       # 节点执行器
    ├── dingtalk-mapper.ts     # 钉钉数据映射
    └── status-machine.ts      # 状态机
```

### 5.2 Notification 模块

```
backend/src/modules/notification/
├── notification.module.ts      # 热插拔模块主文件
├── notification.nest.module.ts # NestJS 包装器
├── index.ts                    # 导出
├── services/
│   ├── notification.service.ts         # 通知服务
│   ├── template.service.ts             # 模板服务
│   ├── preference.service.ts           # 偏好服务
│   └── adapters/
│       ├── in-app.adapter.ts           # 站内消息适配器
│       ├── email.adapter.ts            # 邮件适配器
│       ├── dingtalk.adapter.ts         # 钉钉适配器
│       └── browser.adapter.ts          # 浏览器通知适配器
├── controllers/
│   ├── notification.controller.ts      # 通知API
│   ├── template.controller.ts          # 模板API
│   └── preference.controller.ts        # 偏好API
├── dto/
│   ├── send-notification.dto.ts
│   ├── create-template.dto.ts
│   └── preference.dto.ts
├── entities/
│   ├── notification-message.entity.ts
│   ├── notification-template.entity.ts
│   ├── user-preference.entity.ts
└── utils/
    ├── template-renderer.ts   # 模板渲染器
    ├── channel-router.ts      # 渠道路由器
    └── websocket-pusher.ts    # WebSocket推送
```

---

## 六、API 端点设计

### 6.1 Workflow API

```
流程定义管理:
├── POST   /api/v1/workflow/definitions          # 创建流程定义
├── PUT    /api/v1/workflow/definitions/:id      # 更新流程定义
├── DELETE /api/v1/workflow/definitions/:id      # 删除流程定义
├── GET    /api/v1/workflow/definitions          # 流程定义列表
├── GET    /api/v1/workflow/definitions/:id      # 流程定义详情
├── POST   /api/v1/workflow/definitions/:id/activate   # 激活流程
├── POST   /api/v1/workflow/definitions/:id/deactivate # 停用流程

流程实例管理:
├── POST   /api/v1/workflow/instances            # 启动流程
├── GET    /api/v1/workflow/instances/pending    # 我的待审批
├── GET    /api/v1/workflow/instances/initiated  # 我发起的
├── GET    /api/v1/workflow/instances/approved   # 我已审批的
├── GET    /api/v1/workflow/instances/:id        # 审批详情
├── GET    /api/v1/workflow/instances/:id/history # 审批历史

审批操作:
├── POST   /api/v1/workflow/instances/:id/approve   # 同意
├── POST   /api/v1/workflow/instances/:id/reject    # 拒绝
├── POST   /api/v1/workflow/instances/:id/transfer  # 转交
├── POST   /api/v1/workflow/instances/:id/return    # 退回
├── POST   /api/v1/workflow/instances/:id/cancel    # 撤销

钉钉集成:
├── POST   /api/v1/workflow/dingtalk/sync/:id    # 同步到钉钉
├── POST   /api/v1/workflow/dingtalk/callback    # 钉钉回调接收
├── GET    /api/v1/workflow/dingtalk/status/:id  # 查询钉钉状态
```

### 6.2 Notification API

```
消息管理:
├── POST   /api/v1/notification/send             # 发送消息
├── POST   /api/v1/notification/batch            # 批量发送
├── GET    /api/v1/notification/messages         # 我的消息
├── GET    /api/v1/notification/unread-count     # 未读数量
├── POST   /api/v1/notification/read/:id         # 标记已读
├── POST   /api/v1/notification/read-all         # 全部已读
├── DELETE /api/v1/notification/messages/:id     # 删除消息

模板管理:
├── POST   /api/v1/notification/templates        # 创建模板
├── PUT    /api/v1/notification/templates/:id    # 更新模板
├── DELETE /api/v1/notification/templates/:id    # 删除模板
├── GET    /api/v1/notification/templates        # 模板列表
├── GET    /api/v1/notification/templates/:id    # 模板详情

偏好管理:
├── GET    /api/v1/notification/preference       # 获取偏好
├── PUT    /api/v1/notification/preference       # 更新偏好
```

---

## 七、钉钉审批表单映射

### 7.1 采购审批表单

```json
{
  "processCode": "PROC-XXXXX",
  "formComponentValues": [
    {
      "name": "采购单号",
      "value": "${businessId}"
    },
    {
      "name": "采购标题",
      "value": "${title}"
    },
    {
      "name": "采购金额",
      "value": "${amount}"
    },
    {
      "name": "采购明细",
      "value": "${itemsJson}"
    },
    {
      "name": "申请理由",
      "value": "${reason}"
    },
    {
      "name": "申请人",
      "value": "${initiatorName}"
    }
  ]
}
```

### 7.2 请假审批表单

```json
{
  "processCode": "PROC-YYYYY",
  "formComponentValues": [
    {
      "name": "请假类型",
      "value": "${leaveType}"
    },
    {
      "name": "开始时间",
      "value": "${startTime}"
    },
    {
      "name": "结束时间",
      "value": "${endTime}"
    },
    {
      "name": "请假时长",
      "value": "${duration}天"
    },
    {
      "name": "请假事由",
      "value": "${reason}"
    }
  ]
}
```

---

## 八、实施计划

| 步骤 | 内容 | 时间 |
|------|------|------|
| 1 | 创建 Workflow 模块骨架 | 0.5天 |
| 2 | 实现流程定义服务 | 1天 |
| 3 | 实现流程运行服务 | 1天 |
| 4 | 实现钉钉同步服务 | 0.5天 |
| 5 | 创建 Notification 模块骨架 | 0.5天 |
| 6 | 实现通知服务 + 通道适配器 | 1天 |
| 7 | 实现消息模板服务 | 0.5天 |
| 8 | 联调测试 | 0.5天 |
| **总计** | | **5天** |

---

_设计方案 v1.0.0 - 2026-03-30_