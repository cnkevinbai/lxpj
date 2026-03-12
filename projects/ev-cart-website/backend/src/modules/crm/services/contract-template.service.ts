import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ContractTemplate } from '../entities/contract-template.entity';

/**
 * 合同模板服务
 */
@Injectable()
export class ContractTemplateService {
  private readonly logger = new Logger(ContractTemplateService.name);

  constructor(
    @InjectRepository(ContractTemplate)
    private templateRepository: Repository<ContractTemplate>,
    private dataSource: DataSource,
  ) {}

  // ========== 模板管理 ==========

  /**
   * 创建合同模板
   */
  async createTemplate(data: CreateTemplateDto): Promise<ContractTemplate> {
    this.logger.log(`创建合同模板：${data.templateName}`);

    const template = this.templateRepository.create({
      ...data,
      templateCode: await this.generateTemplateCode(data.category),
      status: 'draft',
      usageCount: 0,
      rating: 0,
    });

    await this.templateRepository.save(template);

    this.logger.log(`合同模板创建成功：${template.templateCode}`);

    return template;
  }

  /**
   * 更新合同模板
   */
  async updateTemplate(templateId: string, data: UpdateTemplateDto): Promise<ContractTemplate> {
    this.logger.log(`更新合同模板：${templateId}`);

    const template = await this.templateRepository.findOne({ where: { id: templateId } });
    if (!template) {
      throw new Error('模板不存在');
    }

    Object.assign(template, data);
    template.version = this.incrementVersion(template.version);

    await this.templateRepository.save(template);

    this.logger.log(`合同模板更新成功：${template.templateCode}`);

    return template;
  }

  /**
   * 审批合同模板
   */
  async approveTemplate(templateId: string, approverId: string, approverName: string): Promise<ContractTemplate> {
    this.logger.log(`审批合同模板：${templateId}, 审批人：${approverName}`);

    const template = await this.templateRepository.findOne({ where: { id: templateId } });
    if (!template) {
      throw new Error('模板不存在');
    }

    template.status = 'active';
    template.approvedBy = approverId;
    template.approvedAt = new Date();
    template.effectiveDate = new Date();

    await this.templateRepository.save(template);

    this.logger.log(`合同模板审批通过：${template.templateCode}`);

    return template;
  }

  // ========== 模板查询 ==========

  /**
   * 获取模板列表
   */
  async getTemplates(query: TemplateQuery): Promise<TemplateResult> {
    const { category, contractType, status, keyword, page = 1, limit = 20 } = query;

    const queryBuilder = this.templateRepository.createQueryBuilder('template');

    if (category) {
      queryBuilder.andWhere('template.category = :category', { category });
    }

    if (contractType) {
      queryBuilder.andWhere('template.contractType = :contractType', { contractType });
    }

    if (status) {
      queryBuilder.andWhere('template.status = :status', { status });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(template.templateName LIKE :keyword OR template.plainText LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // 只显示有效模板
    queryBuilder.andWhere('template.status = :activeStatus', { activeStatus: 'active' });

    const [items, total] = await queryBuilder
      .orderBy('template.usageCount', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 获取模板详情
   */
  async getTemplate(templateId: string): Promise<ContractTemplate> {
    const template = await this.templateRepository.findOne({ where: { id: templateId } });
    if (!template) {
      throw new Error('模板不存在');
    }

    // 增加使用次数
    template.usageCount += 1;
    await this.templateRepository.save(template);

    return template;
  }

  /**
   * 根据条件推荐模板
   */
  async recommendTemplate(data: {
    contractType?: string;
    category?: string;
    amount?: number;
    productId?: string;
  }): Promise<ContractTemplate[]> {
    const queryBuilder = this.templateRepository.createQueryBuilder('template');

    queryBuilder.andWhere('template.status = :status', { status: 'active' });

    if (data.contractType) {
      queryBuilder.andWhere('template.contractType = :contractType', { contractType: data.contractType });
    }

    if (data.category) {
      queryBuilder.andWhere('template.category = :category', { category: data.category });
    }

    if (data.amount !== undefined) {
      queryBuilder.andWhere(
        '(template.minAmount IS NULL OR template.minAmount <= :amount)',
        { amount: data.amount },
      );
      queryBuilder.andWhere(
        '(template.maxAmount IS NULL OR template.maxAmount >= :amount)',
        { amount: data.amount },
      );
    }

    // 按使用次数和评分排序
    queryBuilder
      .orderBy('template.usageCount', 'DESC')
      .addOrderBy('template.rating', 'DESC')
      .limit(5);

    return queryBuilder.getMany();
  }

  // ========== 模板内容生成 ==========

  /**
   * 根据模板生成合同内容
   */
  async generateContractContent(templateId: string, variables: Record<string, any>): Promise<string> {
    const template = await this.templateRepository.findOne({ where: { id: templateId } });
    if (!template) {
      throw new Error('模板不存在');
    }

    let content = template.content;

    // 替换变量
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, String(value));
    });

    return content;
  }

  // ========== 模板统计 ==========

  /**
   * 获取模板统计
   */
  async getStatistics(): Promise<TemplateStatistics> {
    const total = await this.templateRepository.count();

    const categoryCount = await this.templateRepository
      .createQueryBuilder('template')
      .select('template.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('template.category')
      .getRawMany();

    const typeCount = await this.templateRepository
      .createQueryBuilder('template')
      .select('template.templateType', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('template.templateType')
      .getRawMany();

    const totalUsage = await this.templateRepository
      .createQueryBuilder('template')
      .select('SUM(template.usageCount)', 'total')
      .getRawOne();

    return {
      total,
      categoryCount: categoryCount.reduce((acc, item) => {
        acc[item.category] = parseInt(item.count);
        return acc;
      }, {}),
      typeCount: typeCount.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count);
        return acc;
      }, {}),
      totalUsage: parseInt(totalUsage.total) || 0,
    };
  }

  // ========== 辅助方法 ==========

  /**
   * 生成模板编码
   */
  private async generateTemplateCode(category: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const categoryCode: Record<string, string> = {
      sales: 'SL',
      purchase: 'PU',
      service: 'SV',
      distribution: 'DT',
      other: 'OT',
    };

    const todayCount = await this.templateRepository.count({
      where: {
        category,
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(3, '0');

    return `TM${categoryCode[category] || 'OT'}${year}${month}${sequence}`;
  }

  /**
   * 版本号递增
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.');
    if (parts.length === 2) {
      const major = parseInt(parts[0]);
      const minor = parseInt(parts[1]);
      return `${major}.${minor + 1}`;
    }
    return '1.1';
  }
}

// ========== 类型定义 ==========

interface CreateTemplateDto {
  templateName: string;
  contractType: 'domestic' | 'foreign';
  category: 'sales' | 'purchase' | 'service' | 'distribution' | 'other';
  templateType?: 'standard' | 'custom' | 'simple';
  content: string;
  plainText?: string;
  variables?: any[];
  clauses?: any[];
  attachments?: string[];
  applicableProducts?: string;
  applicableRegions?: string;
  minAmount?: number;
  maxAmount?: number;
  usage?: string;
  notes?: string;
  createdBy?: string;
  createdByName?: string;
}

interface UpdateTemplateDto {
  templateName?: string;
  content?: string;
  plainText?: string;
  variables?: any[];
  clauses?: any[];
  attachments?: string[];
  applicableProducts?: string;
  applicableRegions?: string;
  minAmount?: number;
  maxAmount?: number;
  usage?: string;
  notes?: string;
}

interface TemplateQuery {
  category?: string;
  contractType?: string;
  status?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

interface TemplateResult {
  items: ContractTemplate[];
  total: number;
  page: number;
  limit: number;
}

interface TemplateStatistics {
  total: number;
  categoryCount: Record<string, number>;
  typeCount: Record<string, number>;
  totalUsage: number;
}
