import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 新闻实体
 */
@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 50 })
  category: string; // 公司动态/产品发布/项目动态/行业资讯/媒体报道

  @Column({ length: 50 })
  author: string;

  @Column({ nullable: true })
  publishDate: Date;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ default: 0 })
  viewCount: number;

  @Column({ length: 20, default: 'draft' })
  status: 'published' | 'draft' | 'scheduled';

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ length: 200, nullable: true })
  seoTitle: string;

  @Column({ type: 'text', nullable: true })
  seoDescription: string;

  @Column({ type: 'text', nullable: true })
  seoKeywords: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
