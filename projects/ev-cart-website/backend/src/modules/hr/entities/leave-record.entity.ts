import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { Employee } from './employee.entity';

/**
 * 请假记录实体
 */
@Entity('leave_records')
@Index(['employeeId', 'status'])
@Index(['leaveType', 'status'])
export class LeaveRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  leaveNo: string; // 请假单号

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

  @Column({ length: 50 })
  leaveType: 'annual' | 'sick' | 'personal' | 'marriage' | 'maternity' | 'paternity' | 'bereavement' | 'other'; // 请假类型

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'; // 状态

  @Column()
  startDate: Date; // 开始时间

  @Column()
  endDate: Date; // 结束时间

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalDays: number; // 总天数

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  usedDays: number; // 已用天数

  @Column({ length: 500, nullable: true })
  reason: string; // 请假事由

  @Column('simple-array', { nullable: true })
  attachments: string[]; // 附件（病假证明等）

  @Column({ nullable: true })
  approverId: string; // 审批人 ID

  @Column({ length: 100, nullable: true })
  approverName: string; // 审批人姓名

  @Column({ nullable: true })
  approvedDate: Date; // 审批时间

  @Column('text', { nullable: true })
  approvalComment: string; // 审批意见

  @Column({ nullable: true })
  submittedById: string; // 提交人 ID

  @Column({ length: 100, nullable: true })
  submittedByName: string; // 提交人姓名

  @Column({ nullable: true })
  submittedDate: Date; // 提交时间

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
