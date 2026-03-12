import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 页面配置实体
 * 用于管理官网所有页面的可配置内容
 */
@Entity('page_configs')
export class PageConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  pageKey: string; // home, about, contact, products, header, footer

  @Column({ length: 200 })
  pageTitle: string;

  @Column({ type: 'text', nullable: true })
  pageDescription: string;

  @Column({ type: 'jsonb', nullable: true })
  heroSection: HeroSection;

  @Column({ type: 'jsonb', nullable: true })
  features: FeatureItem[];

  @Column({ type: 'jsonb', nullable: true })
  companyInfo: CompanyInfo;

  @Column({ type: 'jsonb', nullable: true })
  contactInfo: ContactInfo;

  @Column({ type: 'jsonb', nullable: true })
  seoConfig: SeoConfig;

  @Column({ length: 20, default: 'published' })
  status: 'published' | 'draft';

  @Column({ default: 0 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Hero Section 类型
export interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

// Feature Item 类型
export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  orderIndex: number;
}

// Company Info 类型
export interface CompanyInfo {
  name: string;
  slogan: string;
  description: string;
  years: number;
  dealers: number;
  customers: number;
  certifications: string[];
}

// Contact Info 类型
export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  fax?: string;
  workingHours?: string;
  mapUrl?: string;
  socialMedia: SocialMediaItem[];
}

export interface SocialMediaItem {
  platform: string; // wechat, weibo, linkedin, facebook
  url: string;
  icon: string;
}

// SEO Config 类型
export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage?: string;
  canonicalUrl?: string;
}
