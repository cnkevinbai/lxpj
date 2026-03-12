import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { Employee } from './employee.entity';

/**
 * 薪酬记录实体
 */
@Entity('payroll_records')
@Index(['employeeId', 'payrollPeriod'])
@Index(['status'])
export class PayrollRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  payrollNo: string; // 薪酬单号

  @ManyToOne(() => Employee, employee => employee.payrollRecords)
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
  payrollPeriod: string; // 薪酬期间（如 2026-03）

  @Column({ nullable: true })
  payrollMonth: Date; // 薪酬月份

  @Column({ length: 50, default: 'draft' })
  status: 'draft' | 'calculated' | 'audited' | 'approved' | 'paid'; // 状态

  // ========== 应发项目 ==========

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  baseSalary: number; // 基本工资

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  performanceSalary: number; // 绩效工资

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  positionAllowance: number; // 岗位津贴

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  mealAllowance: number; // 餐补

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  transportAllowance: number; // 交通补

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  communicationAllowance: number; // 通讯补

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overtimePay: number; // 加班费

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  bonus: number; // 奖金

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherIncome: number; // 其他收入

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  grossSalary: number; // 应发工资合计

  // ========== 扣款项目 ==========

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  socialSecurityPersonal: number; // 社保个人部分

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  housingFundPersonal: number; // 公积金个人部分

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  individualIncomeTax: number; // 个人所得税

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  leaveDeduction: number; // 请假扣款

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  absentDeduction: number; // 缺勤扣款

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherDeduction: number; // 其他扣款

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDeduction: number; // 扣款合计

  // ========== 实发工资 ==========

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  netSalary: number; // 实发工资

  // ========== 社保公积金 ==========

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  socialSecurityBase: number; // 社保基数

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  pensionInsurance: number; // 养老保险

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  medicalInsurance: number; // 医疗保险

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unemploymentInsurance: number; // 失业保险

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  workInjuryInsurance: number; // 工伤保险

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  maternityInsurance: number; // 生育保险

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  housingFund: number; // 公积金

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  socialSecurityCompany: number; // 社保公司部分

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  housingFundCompany: number; // 公积金公司部分

  // ========== 考勤数据 ==========

  @Column({ type: 'integer', default: 0 })
  workDays: number; // 应出勤天数

  @Column({ type: 'integer', default: 0 })
  actualWorkDays: number; // 实际出勤天数

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  leaveDays: number; // 请假天数

  @Column({ type: 'integer', default: 0 })
  overtimeHours: number; // 加班时长

  @Column({ type: 'integer', default: 0 })
  lateCount: number; // 迟到次数

  @Column({ type: 'integer', default: 0 })
  absentDays: number; // 缺勤天数

  // ========== 发放信息 ==========

  @Column({ length: 100, nullable: true })
  bankAccount: string; // 工资卡号

  @Column({ length: 200, nullable: true })
  bankName: string; // 开户行

  @Column({ nullable: true })
  paidDate: Date; // 发放日期

  @Column({ nullable: true })
  paidById: string; // 发放人

  @Column({ length: 100, nullable: true })
  paidByName: string; // 发放人姓名

  // ========== 审批信息 ==========

  @Column({ nullable: true })
  calculatedById: string; // 计算人

  @Column({ length: 100, nullable: true })
  calculatedByName: string; // 计算人姓名

  @Column({ nullable: true })
  calculatedDate: Date; // 计算日期

  @Column({ nullable: true })
  auditedById: string; // 审核人

  @Column({ length: 100, nullable: true })
  auditedByName: string; // 审核人姓名

  @Column({ nullable: true })
  auditedDate: Date; // 审核日期

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
