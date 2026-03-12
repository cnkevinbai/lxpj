import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApprovalFlowInstance } from './approval-flow-instance.entity';

/**
 * 审批流定义实体
 * 定义审批流程模板
 */
@Entity('approval_flows')
export class ApprovalFlow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string; // 审批流名称（如：价格审批、订单审批）

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ length: 50 })
  type: 'price' | 'order' | 'discount' | 'refund' | 'special'; // 审批类型

  @Column({ length: 50 })
  businessType: string; // 关联业务类型（product/order/refund）

  @Column('jsonb')
  flowDefinition: FlowDefinition; // 流程定义（JSON）

  @Column('jsonb', { nullable: true })
  conditions: ApprovalCondition[]; // 触发条件

  @Column({ default: true })
  isActive: boolean; // 是否启用

  @Column({ default: 0 })
  version: number; // 版本号

  @Column({ nullable: true })
  effectiveDate: Date; // 生效日期

  @Column({ nullable: true })
  expiryDate: Date; // 失效日期

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 关联审批实例
  @OneToMany(() => ApprovalFlowInstance, instance => instance.flow)
  instances: ApprovalFlowInstance[];
}

// ========== 类型定义 ==========

/**
 * 流程定义
 */
export interface FlowDefinition {
  nodes: FlowNode[]; // 流程节点
  transitions: FlowTransition[]; // 节点转换
}

/**
 * 流程节点
 */
export interface FlowNode {
  id: string; // 节点 ID
  name: string; // 节点名称
  type: 'start' | 'approval' | 'condition' | 'end'; // 节点类型
  approvers: ApproverConfig[]; // 审批人配置
  actions?: NodeAction[]; // 节点动作
  timeout?: number; // 超时时间（小时）
  timeoutAction?: 'auto_approve' | 'auto_reject' | 'escalate'; // 超时动作
}

/**
 * 审批人配置
 */
export interface ApproverConfig {
  type: 'user' | 'role' | 'department' | 'manager'; // 审批人类型
  userId?: string; // 用户 ID（type=user 时）
  roleId?: string; // 角色 ID（type=role 时）
  departmentId?: string; // 部门 ID（type=department 时）
  relation?: 'direct_manager' | 'indirect_manager'; // 上级关系（type=manager 时）
  approveType?: 'any' | 'all'; // 审批方式（任意一人/所有人）
}

/**
 * 节点动作
 */
export interface NodeAction {
  type: 'notify' | 'webhook' | 'script';
  config: any;
}

/**
 * 流程转换
 */
export interface FlowTransition {
  from: string; // 起始节点 ID
  to: string; // 目标节点 ID
  condition: string; // 转换条件（approve/reject）
}

/**
 * 审批条件
 */
export interface ApprovalCondition {
  field: string; // 字段名
  operator: '>' | '<' | '>=' | '<=' | '=' | '!=' | 'in' | 'contains'; // 操作符
  value: any; // 值
}
