# 审批流系统完整指南

**版本**: 1.0  
**更新时间**: 2026-03-14  
**状态**: ✅ 生产就绪

---

## 📊 系统概览

道达智能审批流系统提供可视化流程设计器和灵活的审批引擎，支持企业各类审批场景，实现审批流程自动化、规范化。

### 核心模块
| 模块 | 功能 | 状态 |
|------|------|------|
| 流程设计 | 可视化流程设计器 | ✅ |
| 审批节点 | 多级审批配置 | ✅ |
| 待办事项 | 待审批列表 | ✅ |
| 已办事项 | 审批历史记录 | ✅ |
| 流程监控 | 流程进度监控 | ✅ |
| 流程分析 | 审批效率分析 | ✅ |

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                审批流前端 (React + Vite)                     │
│  /workflow  /approvals  /my-tasks  /process-designer        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                审批流后端模块 (NestJS)                       │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │ workflow │   node   │  task    │  monitor │ analytics│  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────┐
│                  数据库 (PostgreSQL)                         │
│  workflow_definitions  workflow_instances  workflow_tasks   │
│  workflow_nodes  workflow_logs                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 模块详解

### 1. 流程设计器 (Process Designer)

**路径**: `/workflow/designer`  
**后端**: `backend/src/modules/workflow/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 可视化设计 | 拖拽式流程设计 | ✅ |
| 节点配置 | 审批节点、条件节点 | ✅ |
| 表单设计 | 审批表单自定义 | ✅ |
| 流程版本 | 多版本管理 | ✅ |
| 流程测试 | 流程模拟测试 | ✅ |
| 流程发布 | 发布、停用、启用 | ✅ |

#### 节点类型
| 节点类型 | 说明 | 图标 |
|---------|------|------|
| 开始节点 | 流程起点 | 🟢 |
| 审批节点 | 人员审批 | 👤 |
| 条件节点 | 条件分支 | 🔀 |
| 并行节点 | 并行审批 | ⇉ |
| 抄送节点 | 抄送通知 | 📧 |
| 结束节点 | 流程终点 | 🔴 |

#### 流程设计示例
```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  开始   │ ──→ │ 部门经理│ ──→ │  财务   │ ──→ │  结束   │
│         │     │  审批   │     │  审批   │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                      │
                      ↓ (金额>10 万)
                ┌─────────┐     ┌─────────┐
                │  总经理  │ ──→ │  结束   │
                │  审批   │     │         │
                └─────────┘     └─────────┘
```

---

### 2. 审批节点配置 (Node Configuration)

**路径**: `/workflow/nodes`  
**后端**: `backend/src/modules/workflow/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 审批人设置 | 指定人员/角色/部门 | ✅ |
| 审批方式 | 会签/或签 | ✅ |
| 审批期限 | 审批时限设置 | ✅ |
| 审批权限 | 同意/拒绝/转交/加签 | ✅ |
| 条件设置 | 流转条件配置 | ✅ |

#### 审批方式
| 方式 | 说明 | 适用场景 |
|------|------|----------|
| 会签 | 所有审批人都需同意 | 重要事项、多人决策 |
| 或签 | 任一审批人同意即可 | 日常审批、快速处理 |
| 依次审批 | 按顺序依次审批 | 层级审批 |
| 同时审批 | 同时发送给多人 | 并行审批 |

#### 审批权限
| 权限 | 说明 |
|------|------|
| 同意 | 批准通过，流转到下一节点 |
| 拒绝 | 驳回申请，可退回申请人或上一节点 |
| 转交 | 转交给其他人审批 |
| 加签 | 添加其他人参与审批 |
| 撤回 | 申请人撤回申请 |

---

### 3. 待办事项 (My Tasks)

**路径**: `/workflow/my-tasks`  
**后端**: `backend/src/modules/workflow/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 待办列表 | 待我审批的事项 | ✅ |
| 待办筛选 | 按类型、时间筛选 | ✅ |
| 快速审批 | 列表直接审批 | ✅ |
| 待办提醒 | 即将超时提醒 | ✅ |
| 批量审批 | 批量同意/拒绝 | ✅ |

#### 待办状态
| 状态 | 说明 |
|------|------|
| 待处理 | 等待审批 |
| 处理中 | 已查看未审批 |
| 已超时 | 超过审批期限 |
| 已审批 | 已完成审批 |

---

### 4. 已办事项 (Completed Tasks)

**路径**: `/workflow/completed`  
**后端**: `backend/src/modules/workflow/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 已办列表 | 我已审批的事项 | ✅ |
| 审批历史 | 审批记录详情 | ✅ |
| 审批统计 | 审批数量、效率 | ✅ |
| 流程追踪 | 流程进度追踪 | ✅ |

---

### 5. 流程监控 (Process Monitoring)

**路径**: `/workflow/monitor`  
**后端**: `backend/src/modules/workflow/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 流程实例 | 运行中的流程 | ✅ |
| 流程进度 | 实时进度查看 | ✅ |
| 流程干预 | 管理员干预、跳转 | ✅ |
| 流程终止 | 终止异常流程 | ✅ |
| 流程日志 | 详细操作日志 | ✅ |

#### 流程状态
| 状态 | 说明 |
|------|------|
| 运行中 | 流程正在执行 |
| 已完成 | 流程正常结束 |
| 已终止 | 流程被终止 |
| 已撤销 | 申请人撤销 |
| 已超时 | 超过总时限 |

---

### 6. 流程分析 (Process Analytics)

**路径**: `/workflow/analytics`  
**后端**: `backend/src/modules/workflow/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 流程统计 | 流程数量、类型分布 | ✅ |
| 效率分析 | 平均审批时长 | ✅ |
| 瓶颈分析 | 审批瓶颈节点 | ✅ |
| 人员分析 | 审批人效率排名 | ✅ |
| 趋势分析 | 流程趋势变化 | ✅ |

#### 分析报表
| 报表 | 周期 | 说明 |
|------|------|------|
| 流程日报 | 每日 | 当日流程统计 |
| 流程周报 | 每周 | 周流程分析 |
| 流程月报 | 每月 | 月度汇总分析 |
| 效率报告 | 每月 | 审批效率分析 |

---

## 🔄 常见审批流程

### 费用报销流程
```
员工申请 → 部门经理审批 → 财务审核 → (金额>5000) 总经理审批 → 出纳付款 → 完成
```

### 采购申请流程
```
申请人 → 部门经理 → 采购部 → 财务部 → (金额>10 万) 总经理 → 采购执行 → 完成
```

### 请假审批流程
```
员工申请 → 部门经理审批 → (天数>3) 人事备案 → 完成
```

### 合同审批流程
```
经办人 → 部门经理 → 法务审核 → 财务审核 → 总经理审批 → 盖章 → 完成
```

### 用印申请流程
```
申请人 → 部门经理 → 行政审核 → 用印登记 → 完成
```

---

## 📈 关键指标 (KPI)

| 指标 | 公式 | 目标值 |
|------|------|--------|
| 审批及时率 | 及时审批数 / 总审批数 | ≥ 95% |
| 平均审批时长 | 总时长 / 审批数 | ≤ 4 小时 |
| 流程完成率 | 完成流程数 / 发起流程数 | ≥ 90% |
| 流程退回率 | 退回流程数 / 总流程数 | ≤ 10% |
| 审批满意度 | 满意评价数 / 总评价数 | ≥ 90% |

---

## 🔧 技术实现

### 数据表结构
```sql
-- 流程定义表
CREATE TABLE workflow_definitions (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  key VARCHAR(50),
  version INT,
  nodes JSONB,
  form_schema JSONB,
  status VARCHAR(20),
  created_at TIMESTAMP,
  published_at TIMESTAMP
);

-- 流程实例表
CREATE TABLE workflow_instances (
  id UUID PRIMARY KEY,
  definition_id UUID,
  title VARCHAR(200),
  applicant_id UUID,
  current_node_id UUID,
  status VARCHAR(20),
  form_data JSONB,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- 流程任务表
CREATE TABLE workflow_tasks (
  id UUID PRIMARY KEY,
  instance_id UUID,
  node_id UUID,
  assignee_id UUID,
  action VARCHAR(20),
  comment TEXT,
  status VARCHAR(20),
  created_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- 流程节点表
CREATE TABLE workflow_nodes (
  id UUID PRIMARY KEY,
  definition_id UUID,
  node_key VARCHAR(50),
  node_name VARCHAR(100),
  node_type VARCHAR(50),
  config JSONB,
  position_x INT,
  position_y INT
);

-- 流程日志表
CREATE TABLE workflow_logs (
  id UUID PRIMARY KEY,
  instance_id UUID,
  task_id UUID,
  action VARCHAR(50),
  operator_id UUID,
  comment TEXT,
  created_at TIMESTAMP
);
```

### 流程引擎核心代码
```typescript
// 流程引擎服务
@Injectable()
export class WorkflowEngineService {
  async startProcess(definitionId: string, formData: any, applicantId: string) {
    // 创建流程实例
    const instance = await this.createInstance(definitionId, formData, applicantId);
    // 启动第一个节点
    await this.startNode(instance.id, instance.currentNodeId);
    return instance;
  }

  async approveTask(taskId: string, userId: string, action: string, comment: string) {
    // 完成任务
    await this.completeTask(taskId, action, comment);
    // 流转到下一节点
    await this.moveToNextNode(taskId);
  }

  async moveToNextNode(taskId: string) {
    // 获取下一节点
    const nextNode = await this.getNextNode(taskId);
    if (nextNode) {
      // 创建下一节点任务
      await this.createTask(nextNode);
    }
  }
}
```

---

## 📚 相关文档

- 审批流与 ERP 整合完成报告.md
- APPROVAL_FLOW_COMPLETION.md
- APPROVAL_UX_ENHANCEMENT.md
- PHASE9_APPROVAL_FLOW_ENHANCEMENT_COMPLETE.md

---

## 🚀 待开发功能

| 功能模块 | 优先级 | 预计完成 |
|---------|--------|---------|
| 移动端审批 | 高 | 2026-03-20 |
| 智能推荐审批人 | 中 | 2026-03-25 |
| 流程自动化 | 中 | 2026-03-30 |
| 语音审批 | 低 | 2026-04-05 |

---

**最后更新**: 2026-03-14  
**下次审查**: 2026-03-21  
**维护人**: 渔晓白 ⚙️
