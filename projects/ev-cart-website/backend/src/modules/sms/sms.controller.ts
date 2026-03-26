import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { SmsService } from './services/sms.service'

@ApiTags('sms')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  @ApiOperation({ summary: '发送短信' })
  sendSms(@Body('phone') phone: string, @Body('message') message: string) {
    return this.smsService.sendSms(phone, message)
  }

  @Post('verification')
  @ApiOperation({ summary: '发送验证码' })
  sendVerificationCode(@Body('phone') phone: string) {
    return this.smsService.sendVerificationCode(phone)
  }

  @Post('lead-notification')
  @ApiOperation({ summary: '发送线索通知' })
  sendLeadNotification(@Body('phone') phone: string, @Body('lead') lead: any) {
    return this.smsService.sendLeadNotification(phone, lead)
  }
}
