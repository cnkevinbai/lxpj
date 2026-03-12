import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { Employee } from './employee.entity';

/**
 * 考勤记录实体（从钉钉同步）
 */
@Entity('attendance_records')
@Index(['employeeId', 'attendanceDate'])
@Index(['status'])
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  recordNo: string; // 记录编号

  @ManyToOne(() => Employee, employee => employee.attendanceRecords)
  employee: Employee;

  @Column()
  employeeId: string;

  @Column({ length: 200 })
  employeeName: string; // 员工姓名

  @Column({ length: 100, nullable: true })
  employeeCode: string; // 员工工号

  @Column({ nullable: true })
  dingtalkUserId: string; // 钉钉用户 ID

  @Column()
  attendanceDate: Date; // 考勤日期

  @Column({ length: 50, default: 'normal' })
  status: 'normal' | 'late' | 'early_leave' | 'absent' | 'leave' | 'business_trip' | 'outdoor'; // 考勤状态

  @Column({ nullable: true })
  checkInTime: Date; // 打卡时间

  @Column({ nullable: true })
  checkOutTime: Date; // 签退时间

  @Column({ type: 'integer', default: 0 })
  workHours: number; // 工作时长（分钟）

  @Column({ type: 'integer', default: 0 })
  lateMinutes: number; // 迟到分钟数

  @Column({ type: 'integer', default: 0 })
  earlyLeaveMinutes: number; // 早退分钟数

  @Column({ type: 'integer', default: 0 })
  overtimeHours: number; // 加班时长（小时）

  @Column({ length: 100, nullable: true })
  workLocation: string; // 工作地点

  @Column({ nullable: true })
  checkInAddress: string; // 打卡地址

  @Column({ nullable: true })
  checkInDevice: string; // 打卡设备

  @Column({ length: 50, nullable: true })
  leaveType: string; // 请假类型

  @Column({ nullable: true })
  leaveStartDate: Date; // 请假开始时间

  @Column({ nullable: true })
  leaveEndDate: Date; // 请假结束时间

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  leaveDays: number; // 请假天数

  @Column({ length: 100, nullable: true })
  leaveReason: string; // 请假原因

  @Column({ nullable: true })
  businessTripStartDate: Date; // 出差开始时间

  @Column({ nullable: true })
  businessTripEndDate: Date; // 出差结束时间

  @Column({ length: 100, nullable: true })
  businessTripLocation: string; // 出差地点

  @Column({ length: 50, default: 'system' })
  source: 'system' | 'dingtalk' | 'manual'; // 数据来源

  @Column({ nullable: true })
  dingtalkSyncTime: Date; // 钉钉同步时间

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
