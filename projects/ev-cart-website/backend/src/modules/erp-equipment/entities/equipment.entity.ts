import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { EquipmentMaintenance } from './equipment-maintenance.entity';
import { EquipmentRepair } from './equipment-repair.entity';

/**
 * 设备台账实体
 */
@Entity('equipment')
@Index(['equipmentCode', 'status'])
@Index(['category', 'status'])
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  equipmentCode: string; // 设备编码

  @Column({ length: 200 })
  equipmentName: string; // 设备名称

  @Column({ length: 100, nullable: true })
  equipmentModel: string; // 设备型号

  @Column({ length: 50 })
  category: string; // 设备分类

  @Column({ length: 200, nullable: true })
  categoryName: string; // 分类名称

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'maintenance' | 'fault' | 'scrapped'; // 状态

  @Column({ length: 200, nullable: true })
  supplier: string; // 供应商

  @Column({ length: 100, nullable: true })
  supplierContact: string; // 供应商联系

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  purchasePrice: number; // 购置价格

  @Column({ nullable: true })
  purchaseDate: Date; // 购置日期

  @Column({ nullable: true })
  installationDate: Date; // 安装日期

  @Column({ nullable: true })
  commissioningDate: Date; // 调试日期

  @Column({ nullable: true })
  warrantyDate: Date; // 保修到期

  @Column({ type: 'integer', default: 0 })
  expectedLife: number; // 预计使用年限（月）

  @Column({ nullable: true })
  location: string; // 安装位置

  @Column({ length: 100, nullable: true })
  locationCode: string; // 位置编码

  @Column({ nullable: true })
  departmentId: string; // 使用部门 ID

  @Column({ length: 200, nullable: true })
  departmentName: string; // 使用部门

  @Column({ nullable: true })
  responsiblePersonId: string; // 责任人 ID

  @Column({ length: 100, nullable: true })
  responsiblePersonName: string; // 责任人姓名

  @Column({ length: 100, nullable: true })
  responsiblePersonPhone: string; // 责任人电话

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  oee: number; // OEE（设备综合效率）

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  mtbf: number; // 平均故障间隔时间（小时）

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  mttr: number; // 平均修复时间（小时）

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  utilizationRate: number; // 利用率

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  maintenanceCost: number; // 维护成本（年度累计）

  @Column({ type: 'integer', default: 0 })
  totalRunningTime: number; // 总运行时间（小时）

  @Column({ type: 'integer', default: 0 })
  runningTime: number; // 当前运行时间（小时）

  @Column({ type: 'datetime', nullable: true })
  lastMaintenanceDate: Date; // 最后保养日期

  @Column({ type: 'datetime', nullable: true })
  nextMaintenanceDate: Date; // 下次保养日期

  @Column({ type: 'datetime', nullable: true })
  lastRepairDate: Date; // 最后维修日期

  @Column({ type: 'integer', default: 0 })
  maintenanceCount: number; // 保养次数

  @Column({ type: 'integer', default: 0 })
  repairCount: number; // 维修次数

  @Column({ type: 'integer', default: 0 })
  faultCount: number; // 故障次数

  @Column('text', { nullable: true })
  specification: string; // 规格参数

  @Column('text', { nullable: true })
  technicalParameters: string; // 技术参数

  @Column('simple-array', { nullable: true })
  features: string[]; // 主要功能

  @Column('simple-array', { nullable: true })
  attachments: string[]; // 附件

  @Column('text', { nullable: true })
  manual: string; // 操作手册

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

  @OneToMany(() => EquipmentMaintenance, maintenance => maintenance.equipment)
  maintenances: EquipmentMaintenance[];

  @OneToMany(() => EquipmentRepair, repair => repair.equipment)
  repairs: EquipmentRepair[];
}
