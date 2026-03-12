import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 视频实体
 */
@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 50 })
  category: string; // 产品介绍/客户见证/工厂实拍/技术展示/项目案例/公司动态

  @Column({ length: 500 })
  videoUrl: string;

  @Column({ length: 20, default: 'bilibili' })
  videoType: 'bilibili' | 'youku' | 'local';

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ length: 20, nullable: true })
  duration: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ length: 20, default: 'draft' })
  status: 'published' | 'draft';

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ default: 0 })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
