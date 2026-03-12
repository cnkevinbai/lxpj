import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

/**
 * 设备监控数据实体
 */
@Entity('equipment_monitoring')
@Index(['equipmentId', 'timestamp'])
@Index(['status'])
export class EquipmentMonitoring {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  equipmentId: string; // 设备 ID

  @Column({ length: 200 })
  equipmentName: string; // 设备名称

  @Column({ length: 50, default: 'running' })
  status: 'running' | 'idle' | 'fault' | 'maintenance' | 'stopped'; // 运行状态

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  speed: number; // 运行速度

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  temperature: number; // 温度

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pressure: number; // 压力

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  vibration: number; // 振动

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  current: number; // 电流

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  voltage: number; // 电压

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  power: number; // 功率

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  efficiency: number; // 效率

  @Column({ type: 'integer', default: 0 })
  output: number; // 产量

  @Column({ type: 'integer', default: 0 })
  defectCount: number; // 不良数

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  qualityRate: number; // 合格率

  @Column('jsonb', { nullable: true })
  parameters: any; // 其他参数

  @Column({ nullable: true })
  faultCode: string; // 故障代码

  @Column({ length: 500, nullable: true })
  faultDescription: string; // 故障描述

  @Column({ type: 'integer', default: 0 })
  runningTime: number; // 运行时间（分钟）

  @Column({ type: 'integer', default: 0 })
  idleTime: number; // 空闲时间（分钟）

  @Column({ type: 'integer', default: 0 })
  downtime: number; // 停机时间（分钟）

  @Column({ nullable: true })
  operatorId: string; // 操作员 ID

  @Column({ length: 100, nullable: true })
  operatorName: string; // 操作员姓名

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date; // 时间戳

  @CreateDateColumn()
  createdAt: Date;
}
