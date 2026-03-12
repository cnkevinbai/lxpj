/**
 * 合规性检查服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ComplianceCheck, ComplianceItem, ComplianceType, ComplianceStatus } from './entities/compliance-check.entity'

@Injectable()
export class ComplianceService {
  constructor(
    @InjectRepository(ComplianceCheck)
    private repository: Repository<ComplianceCheck>,
  ) {}

  /**
   * 财务合规检查
   */
  async checkFinancial(entityId: string, data: any): Promise<ComplianceCheck> {
    const checks: ComplianceItem[] = [
      {
        item: '金额准确性',
        passed: this.validateAmount(data.amount),
        severity: 'high',
        description: '检查金额计算是否准确',
        suggestion: '确保所有金额字段计算正确',
      },
      {
        item: '税率合规',
        passed: this.validateTaxRate(data.taxRate),
        severity: 'high',
        description: '检查税率是否符合规定',
        suggestion: '使用最新税率标准',
      },
      {
        item: '发票信息完整',
        passed: this.validateInvoiceInfo(data.invoice),
        severity: 'medium',
        description: '检查发票信息是否完整',
        suggestion: '填写完整的发票信息',
      },
      {
        item: '付款条件合规',
        passed: this.validatePaymentTerms(data.paymentTerms),
        severity: 'medium',
        description: '检查付款条件是否合规',
        suggestion: '遵循公司付款政策',
      },
      {
        item: '审批流程完整',
        passed: this.validateApprovalProcess(data.approvals),
        severity: 'high',
        description: '检查审批流程是否完整',
        suggestion: '确保所有必要审批已完成',
      },
    ]

    const status = this.calculateStatus(checks)

    const check = this.repository.create({
      type: 'financial',
      status,
      entityType: 'finance_record',
      entityId,
      checks,
      checkedBy: 'system',
      checkedAt: new Date(),
    })

    return this.repository.save(check)
  }

  /**
   * 合同合规检查
   */
  async checkContract(entityId: string, data: any): Promise<ComplianceCheck> {
    const checks: ComplianceItem[] = [
      {
        item: '合同条款完整',
        passed: this.validateContractTerms(data.terms),
        severity: 'high',
        description: '检查合同条款是否完整',
        suggestion: '使用标准合同模板',
      },
      {
        item: '法律审查',
        passed: data.legalReview === true,
        severity: 'high',
        description: '检查是否经过法律审查',
        suggestion: '重要合同需法务审核',
      },
      {
        item: '签章完整',
        passed: this.validateSignatures(data.signatures),
        severity: 'high',
        description: '检查签章是否完整',
        suggestion: '确保双方签章齐全',
      },
      {
        item: '有效期合规',
        passed: this.validateValidityPeriod(data.validFrom, data.validTo),
        severity: 'medium',
        description: '检查合同有效期',
        suggestion: '设置合理的合同期限',
      },
      {
        item: '违约责任明确',
        passed: data.breachOfContract !== undefined,
        severity: 'medium',
        description: '检查违约责任条款',
        suggestion: '明确违约责任和赔偿',
      },
      {
        item: '保密条款',
        passed: data.confidentiality !== undefined,
        severity: 'low',
        description: '检查保密条款',
        suggestion: '添加必要的保密条款',
      },
    ]

    const status = this.calculateStatus(checks)

    const check = this.repository.create({
      type: 'contract',
      status,
      entityType: 'contract',
      entityId,
      checks,
      checkedBy: 'system',
      checkedAt: new Date(),
    })

    return this.repository.save(check)
  }

  /**
   * 数据隐私合规检查
   */
  async checkDataPrivacy(entityId: string, data: any): Promise<ComplianceCheck> {
    const checks: ComplianceItem[] = [
      {
        item: '个人信息保护',
        passed: this.validatePersonalInfo(data.personalInfo),
        severity: 'high',
        description: '检查个人信息保护',
        suggestion: '遵循 GDPR/个人信息保护法',
      },
      {
        item: '数据加密',
        passed: data.encrypted === true,
        severity: 'high',
        description: '检查数据是否加密',
        suggestion: '敏感数据必须加密存储',
      },
      {
        item: '访问权限控制',
        passed: this.validateAccessControl(data.accessControl),
        severity: 'high',
        description: '检查访问权限控制',
        suggestion: '实施最小权限原则',
      },
      {
        item: '数据保留政策',
        passed: this.validateDataRetention(data.retention),
        severity: 'medium',
        description: '检查数据保留政策',
        suggestion: '遵循数据保留期限',
      },
    ]

    const status = this.calculateStatus(checks)

    const check = this.repository.create({
      type: 'data_privacy',
      status,
      entityType: 'data_record',
      entityId,
      checks,
      checkedBy: 'system',
      checkedAt: new Date(),
    })

    return this.repository.save(check)
  }

  /**
   * 计算整体状态
   */
  private calculateStatus(checks: ComplianceItem[]): ComplianceStatus {
    const failed = checks.filter(c => !c.passed && c.severity === 'high').length
    const warnings = checks.filter(c => !c.passed && c.severity !== 'high').length

    if (failed > 0) return 'failed'
    if (warnings > 0) return 'warning'
    return 'passed'
  }

  /**
   * 验证方法
   */
  private validateAmount(amount: number): boolean {
    return typeof amount === 'number' && amount >= 0 && isFinite(amount)
  }

  private validateTaxRate(rate: number): boolean {
    return typeof rate === 'number' && rate >= 0 && rate <= 1
  }

  private validateInvoiceInfo(invoice: any): boolean {
    return invoice && invoice.title && invoice.code
  }

  private validatePaymentTerms(terms: any): boolean {
    return terms && (terms.days || terms.date)
  }

  private validateApprovalProcess(approvals: any[]): boolean {
    return Array.isArray(approvals) && approvals.length > 0
  }

  private validateContractTerms(terms: any): boolean {
    return terms && Object.keys(terms).length > 0
  }

  private validateSignatures(signatures: any[]): boolean {
    return Array.isArray(signatures) && signatures.length >= 2
  }

  private validateValidityPeriod(from: string, to: string): boolean {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    return fromDate < toDate && toDate > new Date()
  }

  private validatePersonalInfo(info: any): boolean {
    return !info || (info.consent && info.purpose)
  }

  private validateAccessControl(control: any): boolean {
    return control && control.roles && control.permissions
  }

  private validateDataRetention(retention: any): boolean {
    return retention && retention.period && retention.policy
  }

  /**
   * 获取合规报告
   */
  async getComplianceReport(type?: ComplianceType, startDate?: Date, endDate?: Date) {
    const query = this.repository.createQueryBuilder('check')
      .orderBy('check.checkedAt', 'DESC')

    if (type) {
      query.andWhere('check.type = :type', { type })
    }

    if (startDate) {
      query.andWhere('check.checkedAt >= :startDate', { startDate })
    }

    if (endDate) {
      query.andWhere('check.checkedAt <= :endDate', { endDate })
    }

    const checks = await query.getMany()

    const stats = {
      total: checks.length,
      byStatus: {
        passed: checks.filter(c => c.status === 'passed').length,
        failed: checks.filter(c => c.status === 'failed').length,
        warning: checks.filter(c => c.status === 'warning').length,
      },
      byType: {
        financial: checks.filter(c => c.type === 'financial').length,
        contract: checks.filter(c => c.type === 'contract').length,
        data_privacy: checks.filter(c => c.type === 'data_privacy').length,
      },
    }

    return { stats, checks }
  }
}
