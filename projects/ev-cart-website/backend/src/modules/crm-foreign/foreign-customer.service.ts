import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForeignCustomer } from './entities/foreign-customer.entity';

/**
 * 外贸客户服务
 * 支持多语言、多币种、多时区
 */
@Injectable()
export class ForeignCustomerService {
  private readonly logger = new Logger(ForeignCustomerService.name);

  constructor(
    @InjectRepository(ForeignCustomer)
    private foreignCustomerRepository: Repository<ForeignCustomer>,
  ) {}

  // ========== 创建客户 ==========

  /**
   * 创建外贸客户
   */
  async createCustomer(data: CreateForeignCustomerDto): Promise<ForeignCustomer> {
    this.logger.log(`创建外贸客户：${data.customerName}, ${data.country}`);

    const customer = this.foreignCustomerRepository.create({
      ...data,
      customerCode: await this.generateCustomerCode(),
    });

    await this.foreignCustomerRepository.save(customer);

    this.logger.log(`外贸客户创建成功：${customer.customerCode}`);

    return customer;
  }

  // ========== 查询客户 ==========

  /**
   * 获取客户列表
   */
  async getCustomers(query: ForeignCustomerQuery): Promise<ForeignCustomerResult> {
    const { page = 1, limit = 20, country, status, keyword } = query;

    const queryBuilder = this.foreignCustomerRepository.createQueryBuilder('customer');

    if (country) {
      queryBuilder.andWhere('customer.country = :country', { country });
    }

    if (status) {
      queryBuilder.andWhere('customer.status = :status', { status });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(customer.customerName LIKE :keyword OR customer.customerNameLocal LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const [items, total] = await queryBuilder
      .orderBy('customer.createdAt', 'DESC')
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
   * 获取客户详情
   */
  async getCustomer(id: string): Promise<ForeignCustomer> {
    const customer = await this.foreignCustomerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new Error('客户不存在');
    }
    return customer;
  }

  // ========== 更新客户 ==========

  /**
   * 更新客户信息
   */
  async updateCustomer(id: string, data: Partial<ForeignCustomer>): Promise<ForeignCustomer> {
    const customer = await this.getCustomer(id);
    Object.assign(customer, data);
    await this.foreignCustomerRepository.save(customer);
    return customer;
  }

  // ========== 统计 ==========

  /**
   * 获取客户统计
   */
  async getStatistics(): Promise<ForeignCustomerStatistics> {
    const total = await this.foreignCustomerRepository.count();

    const countryCount = await this.foreignCustomerRepository
      .createQueryBuilder('customer')
      .select('customer.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .groupBy('customer.country')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const statusCount = await this.foreignCustomerRepository
      .createQueryBuilder('customer')
      .select('customer.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('customer.status')
      .getRawMany();

    const totalAmount = await this.foreignCustomerRepository
      .createQueryBuilder('customer')
      .select('SUM(customer.totalAmount)', 'total')
      .getRawOne();

    return {
      total,
      countryCount: countryCount.reduce((acc, item) => {
        acc[item.country] = parseInt(item.count);
        return acc;
      }, {}),
      statusCount: statusCount.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      totalAmount: parseFloat(totalAmount.total) || 0,
    };
  }

  // ========== 辅助方法 ==========

  /**
   * 生成客户编码
   */
  private async generateCustomerCode(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const todayCount = await this.foreignCustomerRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');
    
    return `FC${year}${month}${sequence}`;
  }
}

// ========== 类型定义 ==========

interface CreateForeignCustomerDto {
  customerName: string;
  customerNameLocal?: string;
  customerType: 'company' | 'individual' | 'government';
  contactPerson?: string;
  contactTitle?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactWechat?: string;
  contactEmail?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  timezone?: string;
  industry?: string;
  source?: string;
  currency?: string;
  creditLimit?: number;
  notes?: string;
  tags?: string[];
  ownerUserId?: string;
  ownerUserName?: string;
}

interface ForeignCustomerQuery {
  page?: number;
  limit?: number;
  country?: string;
  status?: string;
  keyword?: string;
}

interface ForeignCustomerResult {
  items: ForeignCustomer[];
  total: number;
  page: number;
  limit: number;
}

interface ForeignCustomerStatistics {
  total: number;
  countryCount: Record<string, number>;
  statusCount: Record<string, number>;
  totalAmount: number;
}
