import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApprovalFlow } from './approval-flow.entity';
import { ApprovalFlowTask } from './approval-flow-task.entity';

/**
 * 审批流实例实体
 * 每次审批发起创建一个实例
 */
@Entity('approval_flow_instances')
export class ApprovalFlowInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  instanceNo: string; // 实例编号

  @ManyToOne(() => ApprovalFlow, { eager: true })
  flow: ApprovalFlow; // 关联审批流定义

  @Column({ length: 50 })
  flowId: string;

  @Column({ length: 50 })
  businessType: string; // 业务类型

  @Column({ nullable: true })
  businessId: string; // 业务 ID（订单 ID/产品 ID 等）

  @Column('jsonb')
  businessData: any; // 业务数据快照

  @Column({ length: 50 })
  status: 'pending' | 'approving' | 'approved' | 'rejected' | 'cancelled'; // 实例状态

  @Column({ nullable: true })
  currentNodeId: string; // 当前节点 ID

  @Column({ nullable: true })
  currentApproverId: string; // 当前审批人 ID

  @ManyToOne(() => User)
  applicant: User; // 申请人

  @Column()
  applicantId: string;

  @Column('text', { nullable: true })
  applicantComment: string; // 申请备注

  @Column({ nullable: true })
  submittedAt: Date; // 提交时间

  @Column({ nullable: true })
  completedAt: Date; // 完成时间

  @Column({ default: 0 })
  totalNodes: number; // 总节点数

  @Column({ default: 0 })
  completedNodes: number; // 已完成节点数

  @Column({ nullable: true })
  expiredAt: Date; // 过期时间

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 关联审批任务
  @OneToMany(() => ApprovalFlowTask, task => task.instance)
  tasks: ApprovalFlowTask[];
}

/**
 * 审批流任务实体
 * 每个审批节点创建一个任务
 */
@Entity('approval_flow_tasks')
export class ApprovalFlowTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ApprovalFlowInstance, instance => instance.tasks)
  instance: ApprovalFlowInstance;

  @Column()
  instanceId: string;

  @Column({ length: 100 })
  taskNo: string; // 任务编号

  @Column({ length: 50 })
  nodeId: string; // 节点 ID

  @Column({ length: 200 })
  nodeName: string; // 节点名称

  @ManyToOne(() => User)
  approver: User; // 审批人

  @Column({ nullable: true })
  approverId: string;

  @Column({ length: 50 })
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'; // 任务状态

  @Column('text', { nullable: true })
  comment: string; // 审批意见

  @Column({ nullable: true })
  action: 'approve' | 'reject'; // 审批动作

  @Column({ nullable: true })
  actedAt: Date; // 审批时间

  @Column({ nullable: true })
  expiredAt: Date; // 过期时间

  @Column({ default: false })
  isRead: boolean; // 是否已读

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// 简单的 User 实体引用（实际应导入用户模块的 User 实体）
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  email: string;
}
