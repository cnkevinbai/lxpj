import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ForeignCustomer } from './foreign-customer.entity';

/**
 * 外贸联系人实体
 */
@Entity('foreign_contacts')
export class ForeignContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ForeignCustomer, customer => customer.contacts)
  customer: ForeignCustomer;

  @Column()
  customerId: string;

  @Column({ length: 100 })
  contactName: string; // 联系人姓名

  @Column({ length: 50, nullable: true })
  contactTitle: string; // 职位

  @Column({ length: 50, nullable: true })
  contactPhone: string; // 电话

  @Column({ length: 100, nullable: true })
  contactWhatsapp: string; // WhatsApp

  @Column({ length: 100, nullable: true })
  contactWechat: string; // 微信

  @Column({ length: 200, nullable: true })
  contactEmail: string; // 邮箱

  @Column({ length: 500, nullable: true })
  address: string; // 地址

  @Column({ length: 50, default: 'primary' })
  contactType: 'primary' | 'technical' | 'financial' | 'other'; // 联系人类型

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean; // 是否主要联系人

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
