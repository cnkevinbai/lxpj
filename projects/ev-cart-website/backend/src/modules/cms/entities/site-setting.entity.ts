import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 网站设置实体
 * 管理全局网站配置
 */
@Entity('site_settings')
export class SiteSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  settingKey: string; // site_name, site_logo, site_favicon, etc.

  @Column({ type: 'text', nullable: true })
  settingValue: string;

  @Column({ type: 'jsonb', nullable: true })
  settingValueJson: any;

  @Column({ length: 20, default: 'string' })
  valueType: 'string' | 'number' | 'boolean' | 'json' | 'array';

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ length: 20, default: 'active' })
  status: 'active' | 'inactive';

  @Column({ default: 0 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/**
 * 预设的网站设置键
 */
export const SiteSettingKeys = {
  // 基础信息
  SITE_NAME: 'site_name',
  SITE_SLOGAN: 'site_slogan',
  SITE_LOGO: 'site_logo',
  SITE_FAVICON: 'site_favicon',
  SITE_URL: 'site_url',
  
  // SEO 默认值
  DEFAULT_META_TITLE: 'default_meta_title',
  DEFAULT_META_DESCRIPTION: 'default_meta_description',
  DEFAULT_META_KEYWORDS: 'default_meta_keywords',
  DEFAULT_OG_IMAGE: 'default_og_image',
  
  // 联系方式
  CONTACT_PHONE: 'contact_phone',
  CONTACT_EMAIL: 'contact_email',
  CONTACT_FAX: 'contact_fax',
  CONTACT_ADDRESS: 'contact_address',
  CONTACT_WORKING_HOURS: 'contact_working_hours',
  CONTACT_MAP_URL: 'contact_map_url',
  
  // 社交媒体
  SOCIAL_WECHAT: 'social_wechat',
  SOCIAL_WEIBO: 'social_weibo',
  SOCIAL_LINKEDIN: 'social_linkedin',
  SOCIAL_FACEBOOK: 'social_facebook',
  SOCIAL_TWITTER: 'social_twitter',
  SOCIAL_YOUTUBE: 'social_youtube',
  SOCIAL_BILIBILI: 'social_bilibili',
  
  // 统计代码
  ANALYTICS_BAIDU_ID: 'analytics_baidu_id',
  ANALYTICS_GA_ID: 'analytics_ga_id',
  ANALYTICS_UMENG_ID: 'analytics_umeng_id',
  
  // 客服配置
  CHAT_ENABLED: 'chat_enabled',
  CHAT_PROVIDER: 'chat_provider',
  CHAT_ID: 'chat_id',
  
  // ICP 备案
  ICP_NUMBER: 'icp_number',
  ICP_URL: 'icp_url',
  POLICE_NUMBER: 'police_number',
  POLICE_URL: 'police_url',
  
  // 其他
  SITE_LANGUAGE: 'site_language',
  SITE_TIMEZONE: 'site_timezone',
  SITE_CURRENCY: 'site_currency',
} as const;
