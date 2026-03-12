import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

/**
 * 操作日志实体
 * 记录所有后台管理操作
 */
@Entity('operation_logs')
@Index(['userId', 'createdAt'])
@Index(['module', 'action'])
@Index(['ipAddress'])
export class OperationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  userId: string; // 用户 ID

  @Column({ length: 200 })
  userName: string; // 用户姓名

  @Column({ length: 100, nullable: true })
  userDepartment: string; // 用户部门

  @Column({ length: 50 })
  module: string; // 模块（user/department/permission 等）

  @Column({ length: 50 })
  action: string; // 操作（create/update/delete/login 等）

  @Column({ length: 200 })
  actionName: string; // 操作名称

  @Column({ length: 50, default: 'success' })
  status: 'success' | 'failed' | 'error'; // 状态

  @Column({ length: 100, nullable: true })
  targetId: string; // 目标对象 ID

  @Column({ length: 200, nullable: true })
  targetName: string; // 目标对象名称

  @Column({ length: 50, nullable: true })
  targetType: string; // 目标类型

  @Column('text', { nullable: true })
  requestUrl: string; // 请求 URL

  @Column('text', { nullable: true })
  requestMethod: string; // 请求方法

  @Column('jsonb', { nullable: true })
  requestBody: any; // 请求参数

  @Column('jsonb', { nullable: true })
  responseData: any; // 响应数据

  @Column({ length: 50, nullable: true })
  ipAddress: string; // IP 地址

  @Column({ length: 200, nullable: true })
  userAgent: string; // 浏览器信息

  @Column({ length: 20, nullable: true })
  browser: string; // 浏览器

  @Column({ length: 20, nullable: true })
  os: string; // 操作系统

  @Column({ length: 20, nullable: true })
  device: string; // 设备类型

  @Column({ type: 'bigint', default: 0 })
  duration: number; // 耗时（毫秒）

  @Column({ type: 'text', nullable: true })
  errorMessage: string; // 错误信息

  @Column({ type: 'text', nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;
}
