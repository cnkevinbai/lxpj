import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { Equipment } from './equipment.entity';

/**
 * 设备保养记录实体
 */
@Entity('equipment_maintenances')
@Index(['equipmentId', 'status'])
@Index(['maintenanceType', 'status'])
export class EquipmentMaintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  maintenanceNo: string; // 保养单号

  @ManyToOne(() => Equipment, equipment => equipment.maintenances)
  equipment: Equipment;

  @Column()
  equipmentId: string;

  @Column({ length: 200 })
  equipmentName: string; // 设备名称

  @Column({ length: 50 })
  maintenanceType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'special'; // 保养类型

  @Column({ length: 50, default: 'planned' })
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'; // 状态

  @Column({ nullable: true })
  planDate: Date; // 计划日期

  @Column({ nullable: true })
  startDate: Date; // 开始日期

  @Column({ nullable: true })
  completedDate: Date; // 完成日期

  @Column({ type: 'integer', default: 0 })
  actualHours: number; // 实际工时（小时）

  @Column({ nullable: true })
  executorId: string; // 执行人 ID

  @Column({ length: 100, nullable: true })
  executorName: string; // 执行人姓名

  @Column({ nullable: true })
  verifierId: string; // 验证人 ID

  @Column({ length: 100, nullable: true })
  verifierName: string; // 验证人姓名

  @Column({ nullable: true })
  verifyDate: Date; // 验证日期

  @Column('text', { nullable: true })
  maintenanceItems: string; // 保养项目

  @Column('text', { nullable: true })
  maintenanceContent: string; // 保养内容

  @Column('text', { nullable: true })
 发现的问题: string; // 发现的问题

  @Column('text', { nullable: true })
  handlingMeasures: string; // 处理措施

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  maintenanceCost: number; // 保养成本

  @Column('simple-array', { nullable: true })
  replacedParts: string[]; // 更换配件

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  equipmentStatus: number; // 设备状态评分（0-100）

  @Column('text', { nullable: true })
  remark: string; // 备注

  @Column('simple-array', { nullable: true })
  photos: string[]; // 保养照片

  @Column({ nullable: true })
  createdBy: string; // 创建人

  @Column({ length: 100, nullable: true })
  createdByName: string; // 创建人姓名

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
