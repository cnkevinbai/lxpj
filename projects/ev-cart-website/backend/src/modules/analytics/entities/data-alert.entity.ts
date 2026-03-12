import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * 数据预警实体
 */
@Entity('data_alerts')
@Index(['alertType', 'status'])
export class DataAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  alertCode: string; // 预警编码

  @Column({ length: 200 })
  alertName: string; // 预警名称

  @Column({ length: 50 })
  alertType: 'sales' | 'inventory' | 'finance' | 'production' | 'quality' | 'hr'; // 预警类型

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive'; // 状态

  @Column({ length: 50, default: 'info' })
  severity: 'info' | 'warning' | 'error' | 'critical'; // 严重程度

  @Column('jsonb')
  condition: any; // 预警条件

  @Column({ length: 50 })
  dataSource: string; // 数据源

  @Column('simple-array', { nullable: true })
  notifyUsers: string[]; // 通知用户

  @Column('simple-array', { nullable: true })
  notifyRoles: string[]; // 通知角色

  @Column({ type: 'boolean', default: true })
  sendEmail: boolean; // 发送邮件

  @Column({ type: 'boolean', default: true })
  sendSms: boolean; // 发送短信

  @Column({ type: 'boolean', default: true })
  sendDingtalk: boolean; // 发送钉钉

  @Column({ type: 'integer', default: 0 })
  triggerCount: number; // 触发次数

  @Column({ nullable: true })
  lastTriggerTime: Date; // 最后触发时间

  @Column('text', { nullable: true })
  description: string; // 描述

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
