import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 解决方案实体
 */
@Entity('solutions')
export class Solution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 50 })
  icon: string;

  @Column({ length: 50 })
  color: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array')
  features: string[];

  @Column({ type: 'text' })
  applicable: string;

  @Column({ type: 'text' })
  vehicles: string;

  @Column({ default: 0 })
  orderIndex: number;

  @Column({ length: 20, default: 'published' })
  status: 'published' | 'draft';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
