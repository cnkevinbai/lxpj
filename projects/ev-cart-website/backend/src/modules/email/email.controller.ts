import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { EmailService } from './services/email.service'

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({ summary: '发送邮件' })
  sendMail(@Body('to') to: string, @Body('subject') subject: string, @Body('html') html: string) {
    return this.emailService.sendMail(to, subject, html)
  }

  @Post('verification')
  @ApiOperation({ summary: '发送验证码' })
  sendVerificationCode(@Body('email') email: string) {
    const code = Math.random().toString().slice(2, 8)
    return this.emailService.sendVerificationCode(email, code)
  }

  @Post('lead-notification')
  @ApiOperation({ summary: '发送线索通知' })
  sendLeadNotification(@Body('lead') lead: any, @Body('recipientEmail') recipientEmail: string) {
    return this.emailService.sendLeadNotification(lead, recipientEmail)
  }
}
