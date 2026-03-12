import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AccountingSubject } from '../entities/accounting-subject.entity';
import { AccountingVoucher } from '../entities/accounting-voucher.entity';
import { AccountingVoucherItem } from '../entities/accounting-voucher-item.entity';
import { AccountsReceivableDetail } from '../entities/accounts-receivable-detail.entity';
import { AccountsPayableDetail } from '../entities/accounts-payable-detail.entity';
import { FinancialReport } from '../entities/financial-report.entity';

/**
 * 财务管理服务
 */
@Injectable()
export class FinancialManagementService {
  private readonly logger = new Logger(FinancialManagementService.name);

  constructor(
    @InjectRepository(AccountingSubject)
    private subjectRepository: Repository<AccountingSubject>,
    @InjectRepository(AccountingVoucher)
    private voucherRepository: Repository<AccountingVoucher>,
    @InjectRepository(AccountingVoucherItem)
    private voucherItemRepository: Repository<AccountingVoucherItem>,
    @InjectRepository(AccountsReceivableDetail)
    private arRepository: Repository<AccountsReceivableDetail>,
    @InjectRepository(AccountsPayableDetail)
    private apRepository: Repository<AccountsPayableDetail>,
    @InjectRepository(FinancialReport)
    private reportRepository: Repository<FinancialReport>,
    private dataSource: DataSource,
  ) {}

  // ========== 会计科目管理 ==========

  /**
   * 创建会计科目
   */
  async createSubject(data: CreateSubjectDto): Promise<AccountingSubject> {
    this.logger.log(`创建会计科目：${data.subjectName}`);

    const subject = this.subjectRepository.create({
      ...data,
      level: await this.calculateSubjectLevel(data.parentId),
    });

    await this.subjectRepository.save(subject);

    this.logger.log(`会计科目创建成功：${subject.subjectCode}`);

    return subject;
  }

  /**
   * 获取科目树
   */
  async getSubjectTree(): Promise<AccountingSubject[]> {
    return this.subjectRepository
      .createQueryBuilder('subject')
      .orderBy('subject.subjectCode', 'ASC')
      .getMany();
  }

  // ========== 会计凭证管理 ==========

  /**
   * 创建会计凭证
   */
  async createVoucher(data: CreateVoucherDto): Promise<AccountingVoucher> {
    this.logger.log(`创建会计凭证：${data.voucherType}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 生成凭证号
      const voucherNo = await this.generateVoucherNo(data.voucherType, data.voucherDate);

      // 创建凭证
      const voucher = queryRunner.manager.create(AccountingVoucher, {
        ...data,
        voucherNo,
        status: 'draft',
      });

      await queryRunner.manager.save(voucher);

      // 创建凭证项
      if (data.items && data.items.length > 0) {
        let totalDebit = 0;
        let totalCredit = 0;

        const items = data.items.map(itemData => {
          const amount = itemData.amount;
          if (itemData.direction === 'debit') {
            totalDebit += amount;
          } else {
            totalCredit += amount;
          }

          return queryRunner.manager.create(AccountingVoucherItem, {
            voucherId: voucher.id,
            voucher,
            subjectId: itemData.subjectId,
            subjectCode: itemData.subjectCode,
            subjectName: itemData.subjectName,
            direction: itemData.direction,
            amount,
            customerId: itemData.customerId,
            customerName: itemData.customerName,
            supplierId: itemData.supplierId,
            supplierName: itemData.supplierName,
            departmentId: itemData.departmentId,
            departmentName: itemData.departmentName,
            remark: itemData.remark,
          });
        });

        // 检查借贷是否平衡
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
          throw new Error('借贷不平衡');
        }

        voucher.totalAmount = totalDebit;
        await queryRunner.manager.save(voucher);
        await queryRunner.manager.save(items);
      }

      await queryRunner.commitTransaction();

      this.logger.log(`会计凭证创建成功：${voucherNo}`);

      return voucher;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`创建会计凭证失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 审核凭证
   */
  async auditVoucher(voucherId: string, auditorId: string, auditorName: string): Promise<AccountingVoucher> {
    const voucher = await this.voucherRepository.findOne({ where: { id: voucherId } });
    if (!voucher) {
      throw new Error('凭证不存在');
    }

    voucher.status = 'audited';
    voucher.auditedById = auditorId;
    voucher.auditedByName = auditorName;
    voucher.auditedDate = new Date();

    await this.voucherRepository.save(voucher);

    this.logger.log(`凭证审核成功：${voucher.voucherNo}`);

    return voucher;
  }

  /**
   * 过账凭证
   */
  async postVoucher(voucherId: string, posterId: string, posterName: string): Promise<AccountingVoucher> {
    const voucher = await this.voucherRepository.findOne({ where: { id: voucherId } });
    if (!voucher) {
      throw new Error('凭证不存在');
    }

    voucher.status = 'posted';
    voucher.postedById = posterId;
    voucher.postedByName = posterName;
    voucher.postedDate = new Date();

    await this.voucherRepository.save(voucher);

    // 更新科目余额
    await this.updateSubjectBalance(voucher);

    this.logger.log(`凭证过账成功：${voucher.voucherNo}`);

    return voucher;
  }

  // ========== 应收账款管理 ==========

  /**
   * 创建应收账款
   */
  async createReceivable(data: CreateReceivableDto): Promise<AccountsReceivableDetail> {
    this.logger.log(`创建应收账款：${data.customerName}`);

    const receivable = this.arRepository.create({
      ...data,
      arNo: await this.generateReceivableNo(),
      status: 'pending',
      balanceAmount: data.totalAmount,
    });

    await this.arRepository.save(receivable);

    this.logger.log(`应收账款创建成功：${receivable.arNo}`);

    return receivable;
  }

  /**
   * 收款核销
   */
  async receivePayment(receivableId: string, data: ReceivePaymentDto): Promise<AccountsReceivableDetail> {
    const receivable = await this.arRepository.findOne({ where: { id: receivableId } });
    if (!receivable) {
      throw new Error('应收单不存在');
    }

    receivable.paidAmount += data.amount;
    receivable.balanceAmount -= data.amount;
    receivable.lastPaymentDate = new Date();

    if (receivable.balanceAmount <= 0.01) {
      receivable.status = 'paid';
    } else if (receivable.paidAmount > 0) {
      receivable.status = 'partial';
    }

    // 检查是否逾期
    if (receivable.dueDate && new Date() > receivable.dueDate) {
      const overdueDays = Math.floor((new Date().getTime() - receivable.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      receivable.overdueDays = overdueDays;
      if (receivable.status !== 'paid') {
        receivable.status = 'overdue';
      }
    }

    await this.arRepository.save(receivable);

    this.logger.log(`收款核销成功：${receivable.arNo}`);

    return receivable;
  }

  /**
   * 获取应收账款账龄分析
   */
  async getReceivableAgingAnalysis(customerId?: string): Promise<AgingAnalysis> {
    const queryBuilder = this.arRepository.createQueryBuilder('ar');

    if (customerId) {
      queryBuilder.andWhere('ar.customerId = :customerId', { customerId });
    }

    const receivables = await queryBuilder.getMany();

    const analysis: AgingAnalysis = {
      current: 0,
      days30: 0,
      days60: 0,
      days90: 0,
      over90: 0,
      total: 0,
    };

    for (const ar of receivables) {
      if (ar.status === 'paid') continue;

      const overdueDays = ar.overdueDays || 0;
      analysis.total += ar.balanceAmount;

      if (overdueDays === 0) {
        analysis.current += ar.balanceAmount;
      } else if (overdueDays <= 30) {
        analysis.days30 += ar.balanceAmount;
      } else if (overdueDays <= 60) {
        analysis.days60 += ar.balanceAmount;
      } else if (overdueDays <= 90) {
        analysis.days90 += ar.balanceAmount;
      } else {
        analysis.over90 += ar.balanceAmount;
      }
    }

    return analysis;
  }

  // ========== 应付账款管理 ==========

  /**
   * 创建应付账款
   */
  async createPayable(data: CreatePayableDto): Promise<AccountsPayableDetail> {
    this.logger.log(`创建应付账款：${data.supplierName}`);

    const payable = this.apRepository.create({
      ...data,
      apNo: await this.generatePayableNo(),
      status: 'pending',
      balanceAmount: data.totalAmount,
    });

    await this.apRepository.save(payable);

    this.logger.log(`应付账款创建成功：${payable.apNo}`);

    return payable;
  }

  /**
   * 付款核销
   */
  async makePayment(payableId: string, data: MakePaymentDto): Promise<AccountsPayableDetail> {
    const payable = await this.apRepository.findOne({ where: { id: payableId } });
    if (!payable) {
      throw new Error('应付单不存在');
    }

    payable.paidAmount += data.amount;
    payable.balanceAmount -= data.amount;
    payable.lastPaymentDate = new Date();

    if (payable.balanceAmount <= 0.01) {
      payable.status = 'paid';
    } else if (payable.paidAmount > 0) {
      payable.status = 'partial';
    }

    await this.apRepository.save(payable);

    this.logger.log(`付款核销成功：${payable.apNo}`);

    return payable;
  }

  // ========== 财务报表 ==========

  /**
   * 生成财务报表
   */
  async generateReport(data: GenerateReportDto): Promise<FinancialReport> {
    this.logger.log(`生成财务报表：${data.reportType}, ${data.reportPeriod}`);

    // 计算报表数据
    const reportData = await this.calculateReportData(data.reportType, data.startDate, data.endDate);

    const report = this.reportRepository.create({
      ...data,
      ...reportData,
      preparedDate: new Date(),
    });

    await this.reportRepository.save(report);

    this.logger.log(`财务报表生成成功：${data.reportPeriod}`);

    return report;
  }

  // ========== 辅助方法 ==========

  private async generateVoucherNo(voucherType: string, voucherDate: Date): Promise<string> {
    const date = voucherDate || new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const typeCode: Record<string, string> = {
      receipt: '收',
      payment: '付',
      transfer: '转',
    };

    const todayCount = await this.voucherRepository.count({
      where: {
        voucherType,
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `${year}${month}${typeCode[voucherType]}${sequence}`;
  }

  private async generateReceivableNo(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.arRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `AR${year}${month}${sequence}`;
  }

  private async generatePayableNo(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.apRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `AP${year}${month}${sequence}`;
  }

  private async calculateSubjectLevel(parentId?: string): Promise<number> {
    if (!parentId) return 1;

    const parent = await this.subjectRepository.findOne({ where: { id: parentId } });
    if (!parent) return 1;

    return parent.level + 1;
  }

  private async updateSubjectBalance(voucher: AccountingVoucher): Promise<void> {
    // 更新科目余额逻辑
    // 简化处理
  }

  private async calculateReportData(
    reportType: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    // 计算报表数据逻辑
    // 简化处理
    return {
      totalAssets: 0,
      totalLiabilities: 0,
      totalEquity: 0,
      totalRevenue: 0,
      netProfit: 0,
    };
  }
}

// ========== 类型定义 ==========

interface CreateSubjectDto {
  subjectCode: string;
  subjectName: string;
  subjectType: 'asset' | 'liability' | 'equity' | 'cost' | 'profit_loss';
  parentId?: string;
  balance?: number;
  balanceDirection?: 'debit' | 'credit';
  isCashSubject?: boolean;
  isBankSubject?: boolean;
  canUse?: boolean;
  needAuxiliary?: boolean;
  auxiliaryTypes?: string[];
  remark?: string;
}

interface CreateVoucherDto {
  voucherType: 'receipt' | 'payment' | 'transfer';
  voucherDate: Date;
  businessDate?: Date;
  summary: string;
  attachmentCount?: number;
  relatedOrderId?: string;
  relatedType?: string;
  relatedNo?: string;
  items: Array<{
    subjectId: string;
    subjectCode: string;
    subjectName: string;
    direction: 'debit' | 'credit';
    amount: number;
    customerId?: string;
    customerName?: string;
    supplierId?: string;
    supplierName?: string;
    departmentId?: string;
    departmentName?: string;
    remark?: string;
  }>;
  preparedById?: string;
  preparedByName?: string;
  remark?: string;
}

interface CreateReceivableDto {
  customerId: string;
  customerName: string;
  orderType: 'sales' | 'other';
  orderId?: string;
  orderNo?: string;
  totalAmount: number;
  taxAmount?: number;
  currency?: string;
  exchangeRate?: number;
  invoiceDate?: Date;
  invoiceNo?: string;
  dueDate?: Date;
  salespersonId?: string;
  salespersonName?: string;
  departmentId?: string;
  departmentName?: string;
  remark?: string;
}

interface ReceivePaymentDto {
  amount: number;
  paymentMethod?: string;
  paymentNo?: string;
  remark?: string;
}

interface CreatePayableDto {
  supplierId: string;
  supplierName: string;
  orderType: 'purchase' | 'other';
  orderId?: string;
  orderNo?: string;
  totalAmount: number;
  taxAmount?: number;
  currency?: string;
  exchangeRate?: number;
  invoiceDate?: Date;
  invoiceNo?: string;
  dueDate?: Date;
  purchaserId?: string;
  purchaserName?: string;
  departmentId?: string;
  departmentName?: string;
  remark?: string;
}

interface MakePaymentDto {
  amount: number;
  paymentMethod?: string;
  paymentNo?: string;
  remark?: string;
}

interface GenerateReportDto {
  reportType: 'balance_sheet' | 'income_statement' | 'cash_flow';
  reportPeriod: string;
  startDate: Date;
  endDate: Date;
  preparedById?: string;
  preparedByName?: string;
}

interface AgingAnalysis {
  current: number;
  days30: number;
  days60: number;
  days90: number;
  over90: number;
  total: number;
}
