import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { Equipment } from './equipment.entity';

/**
 * 设备维修记录实体
 */
@Entity('equipment_repairs')
@Index(['equipmentId', 'status'])
@Index(['faultType', 'status'])
export class EquipmentRepair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  repairNo: string; // 维修单号

  @ManyToOne(() => Equipment, equipment => equipment.repairs)
  equipment: Equipment;

  @Column()
  equipmentId: string;

  @Column({ length: 200 })
  equipmentName: string; // 设备名称

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'verified' | 'closed'; // 状态

  @Column({ length: 50 })
  faultType: string; // 故障类型

  @Column({ length: 50, default: 'normal' })
  priority: 'low' | 'normal' | 'high' | 'urgent'; // 优先级

  @Column({ length: 500, nullable: true })
  faultDescription: string; // 故障描述

  @Column({ nullable: true })
  reportedById: string; // 报告人 ID

  @Column({ length: 100, nullable: true })
  reportedByName: string; // 报告人姓名

  @Column({ nullable: true })
  reportedDate: Date; // 报告日期

  @Column({ nullable: true })
  assignedToId: string; // 指派人 ID

  @Column({ length: 100, nullable: true })
  assignedToName: string; // 指派人姓名

  @Column({ nullable: true })
  assignedDate: Date; // 指派日期

  @Column({ nullable: true })
  acceptedById: string; // 接单 人 ID

  @Column({ length: 100, nullable: true })
  acceptedByName: string; // 接单 人姓名

  @Column({ nullable: true })
  acceptedDate: Date; // 接单日期

  @Column({ nullable: true })
  arrivedDate: Date; // 到达现场日期

  @Column({ nullable: true })
  startDate: Date; // 开始维修日期

  @Column({ nullable: true })
  completedDate: Date; // 完成维修日期

  @Column({ type: 'integer', default: 0 })
  actualHours: number; // 实际工时（小时）

  @Column({ type: 'integer', default: 0 })
  downtimeHours: number; // 停机时间（小时）

  @Column('text', { nullable: true })
  faultCause: string; // 故障原因

  @Column('text', { nullable: true })
  repairMethod: string; // 维修方法

  @Column('text', { nullable: true })
  repairContent: string; // 维修内容

  @Column('simple-array', { nullable: true })
  replacedParts: string[]; // 更换配件

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  partsCost: number; // 配件成本

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  laborCost: number; // 人工成本

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number; // 总成本

  @Column({ nullable: true })
  verifiedById: string; // 验证人 ID

  @Column({ length: 100, nullable: true })
  verifiedByName: string; // 验证人姓名

  @Column({ nullable: true })
  verifiedDate: Date; // 验证日期

  @Column('text', { nullable: true })
  preventiveMeasures: string; // 预防措施

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  satisfaction: number; // 满意度（0-5）

  @Column('simple-array', { nullable: true })
  photos: string[]; // 维修照片

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
