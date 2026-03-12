import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 案例实体
 */
@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 50 })
  category: string; // 景区/酒店/园区/城市观光

  @Column({ length: 100 })
  location: string;

  @Column()
  year: number;

  @Column()
  vehicles: number;

  @Column({ nullable: true })
  dailyPassengers?: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  challenge: string;

  @Column({ type: 'text' })
  solution: string;

  @Column('simple-array', { nullable: true })
  results: string[];

  @Column({ type: 'text', nullable: true })
  testimonialQuote?: string;

  @Column({ length: 100, nullable: true })
  testimonialAuthor?: string;

  @Column({ length: 100, nullable: true })
  testimonialPosition?: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ length: 20, default: 'draft' })
  status: 'published' | 'draft' | 'archived';

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
