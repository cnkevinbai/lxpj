import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 离职交接流程实体
 */
@Entity('offboard_processes')
export class OffboardProcess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  processNo: string; // 流程编号

  @Column()
  employeeId: string;

  @Column({ length: 100 })
  employeeName: string;

  @Column({ length: 100 })
  department: string;

  @Column({ length: 100 })
  position: string;

  @Column()
  lastWorkingDay: Date;

  @Column({ type: 'text', nullable: true })
  reason: string; // 离职原因

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ default: 0 })
  customerCount: number; // 客户数量

  @Column({ default: 0 })
  opportunityCount: number; // 商机数量

  @Column({ default: 0 })
  orderCount: number; // 订单数量

  @Column('jsonb', { nullable: true })
  handoverList: any; // 交接清单

  @Column({ nullable: true })
  handoverToId: string; // 接手人 ID

  @Column({ length: 100, nullable: true })
  handoverToName: string; // 接手人姓名

  @Column({ type: 'text', nullable: true })
  managerComment: string; // 主管意见

  @Column({ nullable: true })
  completedAt: Date; // 完成时间

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
