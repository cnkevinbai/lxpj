import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SmsService {
  constructor(private configService: ConfigService) {}

  async sendSms(phone: string, message: string) {
    const provider = this.configService.get('SMS_PROVIDER', 'aliyun')
    const accessKey = this.configService.get('SMS_ACCESS_KEY')
    const secretKey = this.configService.get('SMS_SECRET_KEY')
    const signName = this.configService.get('SMS_SIGN_NAME', 'EV Cart')

    if (!accessKey || !secretKey) {
      return { success: false, error: 'SMS credentials not configured' }
    }

    // 模拟发送 (实际需对接阿里云/腾讯云 SMS API)
    console.log(`Sending SMS to ${phone}: ${message}`)
    
    return {
      success: true,
      message: 'SMS sent successfully (mock)',
      provider,
    }
  }

  async sendVerificationCode(phone: string) {
    const code = Math.random().toString().slice(2, 8)
    const message = `【${this.configService.get('SMS_SIGN_NAME', 'EV Cart')}】您的验证码是${code}，5 分钟内有效，请勿泄露。`
    
    const result = await this.sendSms(phone, message)
    
    if (result.success) {
      return { success: true, code }
    }
    return result
  }

  async sendLeadNotification(phone: string, lead: any) {
    const message = `【${this.configService.get('SMS_SIGN_NAME', 'EV Cart')}】新线索：${lead.name}(${lead.phone}) 对${lead.productInterest || '产品'}感兴趣，请及时跟进。`
    return this.sendSms(phone, message)
  }
}
