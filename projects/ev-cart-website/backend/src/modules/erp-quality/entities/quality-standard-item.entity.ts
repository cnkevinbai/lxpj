import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { QualityStandard } from './quality-standard.entity';

/**
 * 质检标准项实体
 */
@Entity('quality_standard_items')
export class QualityStandardItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => QualityStandard, standard => standard.items)
  standard: QualityStandard;

  @Column()
  standardId: string;

  @Column({ length: 100 })
  itemCode: string; // 检验项编码

  @Column({ length: 200 })
  itemName: string; // 检验项名称

  @Column({ length: 50 })
  itemType: 'dimension' | 'appearance' | 'function' | 'performance' | 'safety' | 'other'; // 检验项类型

  @Column({ length: 500, nullable: true })
  inspectionMethod: string; // 检验方法

  @Column({ length: 50, nullable: true })
  unit: string; // 单位

  @Column({ length: 100, nullable: true })
  standardValue: string; // 标准值

  @Column({ length: 100, nullable: true })
  upperLimit: string; // 上限

  @Column({ length: 100, nullable: true })
  lowerLimit: string; // 下限

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  weight: number; // 权重

  @Column({ length: 50, default: 'required' })
  isRequired: 'required' | 'optional'; // 是否必检

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defectRate: number; // 允许不良率

  @Column('text', { nullable: true })
  inspectionTool: string; // 检验工具

  @Column('text', { nullable: true })
  inspectionEnvironment: string; // 检验环境要求

  @Column({ type: 'integer', default: 0 })
  sortOrder: number; // 排序

  @Column('text', { nullable: true })
  remark: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
