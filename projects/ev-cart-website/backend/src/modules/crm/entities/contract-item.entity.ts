import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Contract } from './contract.entity';

/**
 * 合同项实体
 */
@Entity('contract_items')
export class ContractItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Contract, contract => contract.items)
  contract: Contract;

  @Column()
  contractId: string;

  @Column()
  productId: string;

  @Column({ length: 200 })
  productName: string;

  @Column({ length: 100, nullable: true })
  productModel: string; // 型号

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  quantity: number; // 数量

  @Column({ length: 50, nullable: true })
  unit: string; // 单位

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitPrice: number; // 单价

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountRate: number; // 折扣率

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number; // 金额

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  deliveredQuantity: number; // 已交付数量

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  remainingQuantity: number; // 未交付数量

  @Column({ nullable: true })
  deliveryDate: Date; // 交货日期

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
