import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { QualityInspection } from './quality-inspection.entity';

/**
 * 质检单项实体
 */
@Entity('quality_inspection_items')
export class QualityInspectionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => QualityInspection, inspection => inspection.items)
  inspection: QualityInspection;

  @Column()
  inspectionId: string;

  @Column({ length: 100 })
  itemCode: string; // 检验项编码

  @Column({ length: 200 })
  itemName: string; // 检验项名称

  @Column({ length: 50 })
  itemType: 'dimension' | 'appearance' | 'function' | 'performance' | 'safety' | 'other'; // 检验项类型

  @Column({ length: 50 })
  inspectionMethod: string; // 检验方法

  @Column({ length: 50, nullable: true })
  unit: string; // 单位

  @Column({ length: 100, nullable: true })
  standardValue: string; // 标准值

  @Column({ length: 100, nullable: true })
  upperLimit: string; // 上限

  @Column({ length: 100, nullable: true })
  lowerLimit: string; // 下限

  @Column({ length: 100, nullable: true })
  actualValue: string; // 实测值

  @Column({ length: 50, default: 'pending' })
  result: 'pending' | 'qualified' | 'unqualified'; // 检验结果

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defectRate: number; // 不良率

  @Column('text', { nullable: true })
  remark: string; // 备注

  @Column({ nullable: true })
  inspectorId: string; // 检验员

  @Column({ length: 100, nullable: true })
  inspectorName: string;

  @Column({ nullable: true })
  inspectionTime: Date; // 检验时间

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
