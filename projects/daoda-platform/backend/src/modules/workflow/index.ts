/**
 * Workflow 审批流程引擎模块导出
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

// 模块导出
export { WorkflowModule, WORKFLOW_MANIFEST } from './workflow.module'
export { WorkflowNestModule } from './workflow.nest.module'

// 类型导出
export {
  // 枚举
  NodeType,
  ApproverType,
  ApproveMode,
  InstanceStatus,
  ApprovalAction,
  ApprovalSource,
  SyncDirection,
  DingTalkStatus,
  DingTalkResult,

  // 接口
  BranchCondition,
  WorkflowNode,
  WorkflowDefinition,
  WorkflowInstance,
  ApprovalRecord,

  // DTO
  CreateWorkflowDefinitionDto,
  UpdateWorkflowDefinitionDto,
  StartWorkflowDto,
  ApproveDto,
  RejectDto,
  TransferDto,
  CancelDto,
  DingTalkCallbackDto,
} from './workflow.module'
