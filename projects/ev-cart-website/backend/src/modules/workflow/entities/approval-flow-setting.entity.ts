import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 审批流设置实体
 * 支持多审批平台配置
 */
@Entity('approval_flow_settings')
export class ApprovalFlowSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  settingCode: string; // 设置编码

  @Column({ length: 200 })
  settingName: string; // 设置名称

  @Column({ length: 50, default: 'internal' })
  platformType: 'internal' | 'dingtalk' | 'wecom' | 'feishu'; // 平台类型

  @Column({ length: 50, default: 'active' })
  status: 'active' | 'inactive'; // 状态

  @Column('jsonb', { nullable: true })
  config: any; // 平台配置

  @Column({ nullable: true })
  appId: string; // 应用 ID

  @Column({ nullable: true })
  appSecret: string; // 应用密钥

  @Column({ nullable: true })
  corpId: string; // 企业 ID

  @Column({ nullable: true })
  agentId: string; // 应用 ID（钉钉/企微）

  @Column({ nullable: true })
  webhookUrl: string; // Webhook URL

  @Column({ nullable: true })
  callbackUrl: string; // 回调 URL

  @Column({ type: 'boolean', default: false })
  isDefault: boolean; // 是否默认

  @Column({ length: 50, nullable: true })
  applicableBusinessType: string; // 适用业务类型

  @Column('text', { nullable: true })
  description: string; // 描述

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
