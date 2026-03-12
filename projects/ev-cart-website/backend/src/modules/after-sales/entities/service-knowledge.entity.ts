import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 服务知识库实体
 */
@Entity('service_knowledge')
export class ServiceKnowledge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string; // 标题

  @Column({ length: 50 })
  category: 'fault' | 'solution' | 'faq' | 'manual' | 'video'; // 分类

  @Column({ length: 100, nullable: true })
  productId: string; // 关联产品 ID

  @Column({ length: 200, nullable: true })
  productName: string; // 产品名称

  @Column('text')
  content: string; // 内容

  @Column('simple-array', { nullable: true })
  keywords: string[]; // 关键词

  @Column('simple-array', { nullable: true })
  faultSymptoms: string[]; // 故障现象

  @Column('simple-array', { nullable: true })
  faultCauses: string[]; // 故障原因

  @Column('text', { nullable: true })
  solution: string; // 解决方案

  @Column('simple-array', { nullable: true })
  requiredParts: string[]; // 所需配件

  @Column('simple-array', { nullable: true })
  requiredTools: string[]; // 所需工具

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedTime: number; // 预计工时（小时）

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  difficultyLevel: number; // 难度等级（1-5）

  @Column({ default: 0 })
  viewCount: number; // 浏览次数

  @Column({ default: 0 })
  usefulCount: number; // 有用次数

  @Column({ default: 0 })
  notUsefulCount: number; // 无用次数

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'draft';

  @Column({ nullable: true })
  authorId: string; // 作者 ID

  @Column({ length: 100, nullable: true })
  authorName: string; // 作者姓名

  @Column('simple-array', { nullable: true })
  attachments: string[]; // 附件

  @Column('text', { nullable: true })
  notes: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
