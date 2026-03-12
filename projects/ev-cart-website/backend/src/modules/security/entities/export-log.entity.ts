import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * 数据导出日志实体
 * 记录所有数据导出操作
 */
@Entity('export_logs')
export class ExportLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ length: 100 })
  userName: string;

  @Column({ length: 50 })
  exportType: string; // customer/contact/order/product/etc.

  @Column()
  recordCount: number;

  @Column({ length: 200 })
  fileName: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ length: 20, default: 'success' })
  status: 'success' | 'failed' | 'blocked';

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
