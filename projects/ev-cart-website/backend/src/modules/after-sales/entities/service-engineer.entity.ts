import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * 服务工程师实体
 */
@Entity('service_engineers')
@Index(['employeeId', 'status'])
@Index(['serviceArea'])
export class ServiceEngineer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  engineerCode: string; // 工程师编码

  @Column()
  employeeId: string; // 员工 ID

  @Column({ length: 200 })
  employeeName: string; // 员工姓名

  @Column({ length: 100, nullable: true })
  phone: string; // 电话

  @Column({ length: 100, nullable: true })
  email: string; // 邮箱

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'on_leave' | 'busy'; // 状态

  @Column('simple-array')
  skills: string[]; // 技能列表

  @Column('simple-array', { nullable: true })
  certification: string[]; // 资质证书

  @Column('simple-array', { nullable: true })
  serviceArea: string[]; // 服务区域

  @Column({ length: 500, nullable: true })
  serviceAreaDetail: string; // 服务区域详情

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  currentLatitude: number; // 当前位置纬度

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  currentLongitude: number; // 当前位置经度

  @Column({ type: 'integer', default: 10 })
  maxDailyOrders: number; // 日最大派单数

  @Column({ type: 'integer', default: 0 })
  currentOrders: number; // 当前派单数

  @Column({ type: 'integer', default: 0 })
  totalServices: number; // 总服务数

  @Column({ type: 'integer', default: 0 })
  completedServices: number; // 完成服务数

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  avgRating: number; // 平均评分

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  avgResponseTime: number; // 平均响应时间（分钟）

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  avgResolutionTime: number; // 平均解决时间（分钟）

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  customerSatisfaction: number; // 客户满意度

  @Column({ type: 'integer', default: 0 })
  overtimeCount: number; // 加班次数

  @Column({ type: 'integer', default: 0 })
  complaintCount: number; // 投诉次数

  @Column({ nullable: true })
  lastServiceTime: Date; // 最后服务时间

  @Column({ nullable: true })
  nextAvailableTime: Date; // 下次可用时间

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
