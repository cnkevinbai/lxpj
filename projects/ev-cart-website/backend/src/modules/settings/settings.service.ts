import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

interface SystemSettings {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  website: string
  icpLicense: string
}

interface NotificationSettings {
  emailEnabled: boolean
  emailSmtpHost: string
  emailSmtpPort: number
  emailUsername: string
  smsEnabled: boolean
  smsProvider: string
  pushEnabled: boolean
}

@Injectable()
export class SettingsService {
  private settings: any = {
    basic: {
      companyName: 'EV Cart 科技有限公司',
      companyAddress: '深圳市南山区科技园',
      companyPhone: '400-888-8888',
      companyEmail: 'info@evcart.com',
      website: 'https://www.evcart.com',
      icpLicense: '粤 ICP 备 12345678 号',
    },
    notification: {
      emailEnabled: true,
      emailSmtpHost: 'smtp.qq.com',
      emailSmtpPort: 587,
      emailUsername: 'noreply@evcart.com',
      smsEnabled: false,
      smsProvider: 'aliyun',
      pushEnabled: true,
    },
  }

  async getSettings() {
    return this.settings
  }

  async updateBasic(settings: Partial<SystemSettings>) {
    this.settings.basic = { ...this.settings.basic, ...settings }
    return this.settings.basic
  }

  async updateNotification(settings: Partial<NotificationSettings>) {
    this.settings.notification = { ...this.settings.notification, ...settings }
    return this.settings.notification
  }

  async getDictionary(category: string) {
    const dictionaries: any = {
      customerSource: ['官网', '电话', '展会', '推荐', '广告', '其他'],
      customerLevel: ['A 级 - 重点客户', 'B 级 - 普通客户', 'C 级 - 潜在客户'],
      orderStatus: ['待处理', '处理中', '已完成', '已取消'],
    }
    return dictionaries[category] || []
  }

  async addDictionaryItem(category: string, item: string) {
    return { category, item }
  }

  async deleteDictionaryItem(category: string, item: string) {
    return { category, item }
  }
}
