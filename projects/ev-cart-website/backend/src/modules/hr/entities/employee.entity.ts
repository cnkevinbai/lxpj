import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { Department } from '../../system/entities/department.entity';
import { AttendanceRecord } from './attendance-record.entity';
import { PayrollRecord } from './payroll-record.entity';

/**
 * 员工档案实体
 */
@Entity('employees')
@Index(['employeeCode', 'status'])
@Index(['departmentId', 'status'])
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  employeeCode: string; // 员工工号

  @Column({ length: 200 })
  employeeName: string; // 员工姓名

  @Column({ length: 50, default: 'male' })
  gender: 'male' | 'female'; // 性别

  @Column({ nullable: true })
  birthday: Date; // 出生日期

  @Column({ length: 50, nullable: true })
  nationality: string; // 国籍

  @Column({ length: 50, nullable: true })
  ethnicity: string; // 民族

  @Column({ length: 100, nullable: true })
  idCardNo: string; // 身份证号

  @Column({ length: 100, nullable: true })
  idCardAddress: string; // 身份证地址

  @Column({ length: 500, nullable: true })
  currentAddress: string; // 现住址

  @Column({ length: 50, nullable: true })
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'; // 婚姻状况

  @Column({ type: 'integer', default: 0 })
  childrenCount: number; // 子女数量

  @Column({ length: 50, nullable: true })
  politicalStatus: string; // 政治面貌

  @Column({ length: 50, nullable: true })
  education: string; // 学历

  @Column({ length: 200, nullable: true })
  major: string; // 专业

  @Column({ nullable: true })
  graduationDate: Date; // 毕业日期

  @Column({ length: 200, nullable: true })
  graduationSchool: string; // 毕业院校

  // ========== 工作信息 ==========

  @ManyToOne(() => Department)
  department: Department;

  @Column({ nullable: true })
  departmentId: string; // 部门 ID

  @Column({ length: 200, nullable: true })
  departmentName: string; // 部门名称

  @Column({ length: 100, nullable: true })
  position: string; // 职位

  @Column({ length: 50, default: 'employee' })
  employeeType: 'full_time' | 'part_time' | 'intern' | 'contract' | 'dispatch'; // 员工类型

  @Column({ length: 50, default: 'active' })
  status: 'probation' | 'active' | 'resigned' | 'terminated' | 'retired'; // 状态

  @Column({ nullable: true })
  hireDate: Date; // 入职日期

  @Column({ nullable: true })
  probationStartDate: Date; // 试用期开始

  @Column({ nullable: true })
  probationEndDate: Date; // 试用期结束

  @Column({ nullable: true })
  regularDate: Date; // 转正日期

  @Column({ nullable: true })
  resignationDate: Date; // 离职日期

  @Column({ length: 50, nullable: true })
  resignationReason: string; // 离职原因

  @Column({ length: 50, nullable: true })
  resignationType: string; // 离职类型

  // ========== 联系信息 ==========

  @Column({ length: 50, nullable: true })
  phone: string; // 手机号

  @Column({ length: 100, nullable: true })
  email: string; // 邮箱

  @Column({ length: 100, nullable: true })
  emergencyContact: string; // 紧急联系人

  @Column({ length: 50, nullable: true })
  emergencyPhone: string; // 紧急联系人电话

  @Column({ length: 50, nullable: true })
  emergencyRelation: string; // 紧急联系人关系

  // ========== 薪酬信息 ==========

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  baseSalary: number; // 基本工资

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  performanceSalary: number; // 绩效工资

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  allowance: number; // 津贴补贴

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalSalary: number; // 应发工资合计

  @Column({ length: 50, default: 'CNY' })
  currency: string; // 币种

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  socialSecurityBase: number; // 社保基数

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  housingFundBase: number; // 公积金基数

  @Column({ length: 100, nullable: true })
  bankAccount: string; // 工资卡号

  @Column({ length: 200, nullable: true })
  bankName: string; // 开户行

  // ========== 钉钉集成 ==========

  @Column({ length: 100, nullable: true })
  dingtalkUserId: string; // 钉钉用户 ID

  @Column({ length: 100, nullable: true })
  dingtalkJobNumber: string; // 钉钉工号

  @Column({ type: 'boolean', default: false })
  isDingtalkSync: boolean; // 是否同步钉钉

  // ========== 其他 ==========

  @Column('simple-array', { nullable: true })
  skills: string[]; // 技能

  @Column('text', { nullable: true })
  workExperience: string; // 工作经历

  @Column('text', { nullable: true })
  educationExperience: string; // 教育经历

  @Column('simple-array', { nullable: true })
  certificates: string[]; // 证书

  @Column('simple-array', { nullable: true })
  attachments: string[]; // 附件

  @Column('text', { nullable: true })
  remark: string; // 备注

  @Column({ nullable: true })
  createdBy: string; // 创建人

  @Column({ length: 100, nullable: true })
  createdByName: string; // 创建人姓名

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AttendanceRecord, record => record.employee)
  attendanceRecords: AttendanceRecord[];

  @OneToMany(() => PayrollRecord, record => record.employee)
  payrollRecords: PayrollRecord[];
}
