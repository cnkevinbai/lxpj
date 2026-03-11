import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter: any

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST', 'smtp.qq.com'),
      port: this.configService.get('MAIL_PORT', 465),
      secure: true,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    })
  }

  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: this.configService.get('MAIL_FROM', 'EV Cart <noreply@evcart.com>'),
      to,
      subject,
      html,
    }

    try {
      const info = await this.transporter.sendMail(mailOptions)
      return { success: true, messageId: info.messageId }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async sendVerificationCode(email: string, code: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>验证码</h2>
        <p>您的验证码是：<strong style="font-size: 24px; color: #1890ff;">${code}</strong></p>
        <p>验证码 5 分钟内有效，请勿泄露给他人。</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
      </div>
    `

    return this.sendMail(email, '验证码', html)
  }

  async sendLeadNotification(lead: any, recipientEmail: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>新线索通知</h2>
        <p>您有一条新的销售线索：</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0;"><strong>姓名：</strong></td><td>${lead.name}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>手机：</strong></td><td>${lead.phone}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>公司：</strong></td><td>${lead.company || '-'}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>意向产品：</strong></td><td>${lead.productInterest || '-'}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">请及时跟进处理。</p>
      </div>
    `

    return this.sendMail(recipientEmail, '新线索通知', html)
  }
}
