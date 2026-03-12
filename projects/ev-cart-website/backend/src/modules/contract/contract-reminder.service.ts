/**
 * 合同提醒服务 - 到期提醒/续签提醒
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Contract, ContractStatus } from './entities/contract.entity'
import { Cron, CronExpression } from '@nestjs/schedule'

export interface ReminderConfig {
  daysBeforeExpiry: number[]  // 到期前多少天提醒
  reminderChannels: ('email' | 'sms' | 'dingtalk' | 'internal')[]
}

@Injectable()
export class ContractReminderService {
  private readonly logger = new Logger(ContractReminderService.name)
  private defaultConfig: ReminderConfig = {
    daysBeforeExpiry: [30, 15, 7, 3, 1],
    reminderChannels: ['internal', 'dingtalk'],
  }

  constructor(
    @InjectRepository(Contract)
    private repository: Repository<Contract>,
  ) {}

  /**
   * 定时任务：每天检查到期合同
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkExpiringContracts() {
    this.logger.log('开始检查到期合同...')

    const today = new Date()
    const expiringContracts = await this.getExpiringContracts(30)

    for (const contract of expiringContracts) {
      const daysUntilExpiry = this.getDaysUntilExpiry(contract.endDate, today)

      // 检查是否需要提醒
      if (this.defaultConfig.daysBeforeExpiry.includes(daysUntilExpiry)) {
        await this.sendReminder(contract, daysUntilExpiry)
      }
    }

    this.logger.log(`检查完成，共${expiringContracts.length}份即将到期合同`)
  }

  /**
   * 获取即将到期合同
   */
  async getExpiringContracts(days: number = 30): Promise<Contract[]> {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    return this.repository
      .createQueryBuilder('contract')
      .where('contract.status = :status', { status: 'effective' })
      .andWhere('contract.endDate <= :endDate', { endDate })
      .andWhere('contract.endDate > NOW()')
      .andWhere('contract.remindAt IS NULL OR contract.remindAt < NOW()')
      .orderBy('contract.endDate', 'ASC')
      .getMany()
  }

  /**
   * 计算距离到期天数
   */
  private getDaysUntilExpiry(endDate: Date, today: Date): number {
    const diffTime = new Date(endDate).getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  /**
   * 发送提醒
   */
  private async sendReminder(contract: Contract, daysUntilExpiry: number) {
    const reminderText = this.generateReminderText(contract, daysUntilExpiry)

    this.logger.log(`发送合同到期提醒：${contract.contractNo}`)

    // 内部通知
    if (this.defaultConfig.reminderChannels.includes('internal')) {
      await this.sendInternalNotification(contract.ownerId, reminderText)
    }

    // 钉钉通知
    if (this.defaultConfig.reminderChannels.includes('dingtalk')) {
      await this.sendDingTalkNotification(contract.ownerId, reminderText)
    }

    // 更新提醒时间
    contract.remindAt = new Date()
    await this.repository.save(contract)
  }

  /**
   * 生成提醒文本
   */
  private generateReminderText(contract: Contract, daysUntilExpiry: number): string {
    const urgency = daysUntilExpiry <= 3 ? '【紧急】' : daysUntilExpiry <= 7 ? '【重要】' : ''
    
    return `${urgency}合同到期提醒
合同编号：${contract.contractNo}
合同名称：${contract.title}
客户名称：${contract.customerName}
合同金额：¥${contract.amount.toLocaleString()}
到期时间：${new Date(contract.endDate).toLocaleDateString('zh-CN')}
剩余天数：${daysUntilExpiry}天

请及时处理续签或终止事宜。`
  }

  /**
   * 发送内部通知
   */
  private async sendInternalNotification(userId: string, message: string) {
    // TODO: 实现内部通知
    this.logger.log(`内部通知：${userId} - ${message.slice(0, 50)}...`)
  }

  /**
   * 发送钉钉通知
   */
  private async sendDingTalkNotification(userId: string, message: string) {
    // TODO: 调用钉钉通知服务
    this.logger.log(`钉钉通知：${userId} - ${message.slice(0, 50)}...`)
  }

  /**
   * 获取合同提醒统计
   */
  async getReminderStats() {
    const today = new Date()
    const expiring7Days = await this.getExpiringContracts(7)
    const expiring30Days = await this.getExpiringContracts(30)
    const expired = await this.repository
      .createQueryBuilder('contract')
      .where('contract.status = :status', { status: 'effective' })
      .andWhere('contract.endDate < :today', { today })
      .getCount()

    return {
      expiring7Days: expiring7Days.length,
      expiring30Days: expiring30Days.length,
      expired,
      totalEffective: await this.repository.count({ where: { status: 'effective' } }),
    }
  }
}
