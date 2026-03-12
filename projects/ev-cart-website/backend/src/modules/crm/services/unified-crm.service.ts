import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { UserRole } from '../entities/user-role.entity';

/**
 * 统一 CRM 服务
 * 国内/外贸客户统一管理，根据用户角色自动过滤
 */
@Injectable()
export class UnifiedCrmService {
  private readonly logger = new Logger(UnifiedCrmService.name);

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  // ========== 客户管理 ==========

  /**
   * 获取客户列表（根据用户角色自动过滤）
   */
  async getCustomers(user: UserContext, query: CustomerQuery): Promise<CustomerResult> {
    const { page = 1, limit = 20, keyword, status, level } = query;

    const queryBuilder = this.customerRepository.createQueryBuilder('customer');

    // 根据用户角色过滤客户类型
    if (user.roleType === 'domestic') {
      // 国内业务员只能看国内客户
      queryBuilder.andWhere('customer.customerType = :customerType', { customerType: 'domestic' });
    } else if (user.roleType === 'foreign') {
      // 外贸业务员只能看外贸客户
      queryBuilder.andWhere('customer.customerType = :customerType', { customerType: 'foreign' });
    }
    // 管理员/经理可以看到所有客户

    // 其他过滤条件
    if (keyword) {
      queryBuilder.andWhere(
        '(customer.customerName LIKE :keyword OR customer.customerNameLocal LIKE :keyword OR customer.contactPerson LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('customer.status = :status', { status });
    }

    if (level) {
      queryBuilder.andWhere('customer.level = :level', { level });
    }

    // 只查看自己的客户（非管理员）
    if (!['admin', 'manager'].includes(user.roleType)) {
      queryBuilder.andWhere('customer.salespersonId = :salespersonId', { salespersonId: user.userId });
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
   * 创建客户（自动判断国内/外贸）
   */
  async createCustomer(user: UserContext, data: CreateCustomerDto): Promise<Customer> {
    this.logger.log(`创建客户：${data.customerName}, 类型：${data.customerType}`);

    // 验证用户权限
    if (user.roleType === 'domestic' && data.customerType === 'foreign') {
      throw new Error('国内业务员不能创建外贸客户');
    }
    if (user.roleType === 'foreign' && data.customerType === 'domestic') {
      throw new Error('外贸业务员不能创建国内客户');
    }

    const customer = this.customerRepository.create({
      ...data,
      customerCode: await this.generateCustomerCode(data.customerType),
      salespersonId: user.userId,
      salespersonName: user.userName,
    });

    await this.customerRepository.save(customer);

    this.logger.log(`客户创建成功：${customer.customerCode}`);

    return customer;
  }

  /**
   * 获取客户详情
   */
  async getCustomer(user: UserContext, customerId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new Error('客户不存在');
    }

    // 权限验证
    if (!['admin', 'manager'].includes(user.roleType)) {
      if (customer.salespersonId !== user.userId) {
        throw new Error('无权查看该客户');
      }
    }

    return customer;
  }

  // ========== 统计 ==========

  /**
   * 获取客户统计（根据用户角色）
   */
  async getStatistics(user: UserContext): Promise<CustomerStatistics> {
    const queryBuilder = this.customerRepository.createQueryBuilder('customer');

    // 根据用户角色过滤
    if (user.roleType === 'domestic') {
      queryBuilder.andWhere('customer.customerType = :customerType', { customerType: 'domestic' });
    } else if (user.roleType === 'foreign') {
      queryBuilder.andWhere('customer.customerType = :customerType', { customerType: 'foreign' });
    }

    // 非管理员只看自己的
    if (!['admin', 'manager'].includes(user.roleType)) {
      queryBuilder.andWhere('customer.salespersonId = :salespersonId', { salespersonId: user.userId });
    }

    const total = await queryBuilder.getCount();

    const statusCount = await queryBuilder
      .select('customer.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('customer.status')
      .getRawMany();

    const levelCount = await queryBuilder
      .select('customer.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('customer.level')
      .getRawMany();

    const totalAmount = await queryBuilder
      .select('SUM(customer.totalAmount)', 'total')
      .getRawOne();

    return {
      total,
      statusCount: statusCount.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      levelCount: levelCount.reduce((acc, item) => {
        acc[item.level] = parseInt(item.count);
        return acc;
      }, {}),
      totalAmount: parseFloat(totalAmount.total) || 0,
    };
  }

  // ========== 辅助方法 ==========

  /**
   * 生成客户编码
   */
  private async generateCustomerCode(customerType: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const prefix = customerType === 'foreign' ? 'FC' : 'DC';

    const todayCount = await this.customerRepository.count({
      where: {
        customerType,
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `${prefix}${year}${month}${sequence}`;
  }
}

// ========== 类型定义 ==========

interface UserContext {
  userId: string;
  userName: string;
  roleType: 'domestic' | 'foreign' | 'admin' | 'manager' | 'service';
}

interface CustomerQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
  level?: string;
}

interface CustomerResult {
  items: Customer[];
  total: number;
  page: number;
  limit: number;
}

interface CreateCustomerDto {
  customerType: 'domestic' | 'foreign';
  customerName: string;
  customerNameLocal?: string;
  companyType: string;
  industry?: string;
  source?: string;
  contactPerson?: string;
  contactTitle?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactWechat?: string;
  contactEmail?: string;
  website?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country: string;
  timezone?: string;
  level?: string;
  currency?: string;
  creditLimit?: number;
  paymentTerms?: string;
  incoterms?: string;
  portOfLoading?: string;
  portOfDestination?: string;
  bankName?: string;
  bankAccount?: string;
  swiftCode?: string;
  taxNo?: string;
  importLicense?: string;
  notes?: string;
  tags?: string[];
}

interface CustomerStatistics {
  total: number;
  statusCount: Record<string, number>;
  levelCount: Record<string, number>;
  totalAmount: number;
}
