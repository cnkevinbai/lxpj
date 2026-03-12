import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { ContractItem } from '../entities/contract-item.entity';

/**
 * 合同管理服务
 */
@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(ContractItem)
    private contractItemRepository: Repository<ContractItem>,
    private dataSource: DataSource,
  ) {}

  // ========== 合同创建 ==========

  /**
   * 创建合同
   */
  async createContract(data: CreateContractDto): Promise<Contract> {
    this.logger.log(`创建合同：${data.contractNo}, 客户：${data.customerName}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 创建合同
      const contract = queryRunner.manager.create(Contract, {
        ...data,
        status: 'draft',
        remainingAmount: data.totalAmount - data.depositAmount,
      });

      await queryRunner.manager.save(contract);

      // 2. 创建合同项
      if (data.items && data.items.length > 0) {
        const items = data.items.map(itemData =>
          queryRunner.manager.create(ContractItem, {
            contractId: contract.id,
            contract,
            ...itemData,
            amount: itemData.quantity * itemData.unitPrice * (1 - itemData.discountRate / 100),
            remainingQuantity: itemData.quantity,
          })
        );
        await queryRunner.manager.save(items);
      }

      await queryRunner.commitTransaction();

      this.logger.log(`合同创建成功：${contract.contractNo}`);

      return contract;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`创建合同失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ========== 合同审批 ==========

  /**
   * 审批合同
   */
  async approveContract(contractId: string, approverId: string, approverName: string): Promise<Contract> {
    this.logger.log(`审批合同：${contractId}, 审批人：${approverName}`);

    const contract = await this.contractRepository.findOne({ where: { id: contractId } });
    if (!contract) {
      throw new Error('合同不存在');
    }

    contract.status = 'approved';
    contract.approverId = approverId;
    contract.approvedAt = new Date();

    await this.contractRepository.save(contract);

    this.logger.log(`合同审批通过：${contract.contractNo}`);

    return contract;
  }

  // ========== 合同执行 ==========

  /**
   * 更新合同执行进度
   */
  async updateContractProgress(contractId: string, data: UpdateProgressDto): Promise<Contract> {
    this.logger.log(`更新合同进度：${contractId}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const contract = await queryRunner.manager.findOne(Contract, { where: { id: contractId } });
      if (!contract) {
        throw new Error('合同不存在');
      }

      // 更新已付金额
      if (data.paidAmount !== undefined) {
        contract.paidAmount = data.paidAmount;
        contract.remainingAmount = contract.totalAmount - data.paidAmount;
        contract.lastPaymentDate = new Date();
      }

      // 更新执行进度
      if (data.deliveredAmount !== undefined) {
        contract.deliveredAmount = data.deliveredAmount;
        contract.deliveredRate = (data.deliveredAmount / contract.totalAmount) * 100;
      }

      // 检查是否完成
      if (contract.deliveredRate >= 100 && contract.paidAmount >= contract.totalAmount) {
        contract.status = 'completed';
        contract.completedDate = new Date();
      }

      await queryRunner.manager.save(contract);

      await queryRunner.commitTransaction();

      this.logger.log(`合同进度更新成功：${contract.contractNo}`);

      return contract;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`更新合同进度失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ========== 合同统计 ==========

  /**
   * 获取合同统计
   */
  async getStatistics(userContext: UserContext): Promise<ContractStatistics> {
    const queryBuilder = this.contractRepository.createQueryBuilder('contract');

    // 根据用户角色过滤
    if (!['admin', 'manager'].includes(userContext.roleType)) {
      queryBuilder.andWhere('contract.salespersonId = :salespersonId', {
        salespersonId: userContext.userId,
      });
    }

    const total = await queryBuilder.getCount();

    const statusCount = await queryBuilder
      .select('contract.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('contract.status')
      .getRawMany();

    const totalAmount = await queryBuilder
      .select('SUM(contract.totalAmount)', 'total')
      .getRawOne();

    const executedAmount = await queryBuilder
      .select('SUM(contract.deliveredAmount)', 'total')
      .getRawOne();

    return {
      total,
      statusCount: statusCount.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      totalAmount: parseFloat(totalAmount.total) || 0,
      executedAmount: parseFloat(executedAmount.total) || 0,
      executionRate: 0,
    };
  }

  // ========== 合同提醒 ==========

  /**
   * 获取即将到期合同
   */
  async getExpiringContracts(days: number = 30): Promise<Contract[]> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    return this.contractRepository
      .createQueryBuilder('contract')
      .where('contract.status = :status', { status: 'active' })
      .andWhere('contract.endDate <= :expiryDate', { expiryDate })
      .orderBy('contract.endDate', 'ASC')
      .getMany();
  }

  /**
   * 获取未付款合同
   */
  async getUnpaidContracts(): Promise<Contract[]> {
    return this.contractRepository
      .createQueryBuilder('contract')
      .where('contract.status IN (:...statuses)', { statuses: ['active', 'completed'] })
      .andWhere('contract.remainingAmount > 0')
      .orderBy('contract.endDate', 'ASC')
      .getMany();
  }
}

// ========== 类型定义 ==========

interface CreateContractDto {
  contractNo: string;
  contractType: 'domestic' | 'foreign';
  customerId: string;
  customerName: string;
  type: 'sales' | 'purchase' | 'service' | 'distribution';
  totalAmount: number;
  currency?: string;
  exchangeRate?: number;
  signDate?: Date;
  startDate?: Date;
  endDate?: Date;
  deliveryDate?: Date;
  paymentTerms?: string;
  depositRate?: number;
  depositAmount?: number;
  incoterms?: string;
  portOfLoading?: string;
  portOfDestination?: string;
  lcNo?: string;
  lcBank?: string;
  lcAmount?: number;
  notes?: string;
  salespersonId?: string;
  salespersonName?: string;
  attachments?: string[];
  termsAndConditions?: string;
  items?: Array<{
    productId: string;
    productName: string;
    productModel?: string;
    quantity: number;
    unit?: string;
    unitPrice: number;
    discountRate?: number;
    deliveryDate?: Date;
    notes?: string;
  }>;
}

interface UpdateProgressDto {
  paidAmount?: number;
  deliveredAmount?: number;
  completedDate?: Date;
}

interface UserContext {
  userId: string;
  roleType: 'domestic' | 'foreign' | 'admin' | 'manager';
}

interface ContractStatistics {
  total: number;
  statusCount: Record<string, number>;
  totalAmount: number;
  executedAmount: number;
  executionRate: number;
}
