import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { Employee } from './employee.entity';

/**
 * 绩效考核记录实体
 */
@Entity('performance_records')
@Index(['employeeId', 'performancePeriod'])
@Index(['status'])
export class PerformanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  performanceNo: string; // 绩效单号

  @ManyToOne(() => Employee)
  employee: Employee;

  @Column()
  employeeId: string;

  @Column({ length: 200 })
  employeeName: string; // 员工姓名

  @Column({ length: 100, nullable: true })
  employeeCode: string; // 员工工号

  @Column({ nullable: true })
  departmentId: string; // 部门 ID

  @Column({ length: 200, nullable: true })
  departmentName: string; // 部门名称

  @Column({ length: 20 })
  performancePeriod: string; // 考核期间

  @Column({ length: 50 })
  performanceType: 'monthly' | 'quarterly' | 'annual' | 'probation' | 'project'; // 考核类型

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'self_assessment' | 'manager_assessment' | 'approved' | 'completed'; // 状态

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  selfScore: number; // 自评得分

  @Column({ type: 'text', nullable: true })
  selfComment: string; // 自评说明

  @Column({ nullable: true })
  selfAssessmentDate: Date; // 自评日期

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  managerScore: number; // 上级评分

  @Column({ type: 'text', nullable: true })
  managerComment: string; // 上级评语

  @Column({ nullable: true })
  managerId: string; // 上级 ID

  @Column({ length: 100, nullable: true })
  managerName: string; // 上级姓名

  @Column({ nullable: true })
  managerAssessmentDate: Date; // 上级评分日期

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  finalScore: number; // 最终得分

  @Column({ length: 50, nullable: true })
  performanceLevel: 'S' | 'A' | 'B' | 'C' | 'D'; // 绩效等级

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  performanceBonus: number; // 绩效奖金

  @Column('jsonb', { nullable: true })
  kpiData: any; // KPI 数据

  @Column('jsonb', { nullable: true })
  goals: any; // 目标数据

  @Column('text', { nullable: true })
  improvement: string; // 改进建议

  @Column({ nullable: true })
  approvedById: string; // 审批人

  @Column({ length: 100, nullable: true })
  approvedByName: string; // 审批人姓名

  @Column({ nullable: true })
  approvedDate: Date; // 审批日期

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
