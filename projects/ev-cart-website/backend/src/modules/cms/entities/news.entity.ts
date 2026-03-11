import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 200 })
  title: string

  @Column({ length: 50, nullable: true })
  category: string

  @Column({ type: 'text' })
  content: string

  @Column({ length: 500, nullable: true })
  summary: string

  @Column({ length: 500, nullable: true })
  coverImage: string

  @Column({ length: 100, nullable: true })
  author: string

  @Column({ default: 'draft' })
  status: string

  @Column({ nullable: true })
  publishedAt: Date

  @Column({ default: 0 })
  viewCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
