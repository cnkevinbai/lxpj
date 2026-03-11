import { Controller, Post, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PaymentService } from './payment.service'

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('alipay')
  @ApiOperation({ summary: '支付宝支付' })
  alipay(@Body('orderNo') orderNo: string, @Body('amount') amount: number, @Body('subject') subject: string) {
    return this.paymentService.alipay(orderNo, amount, subject)
  }

  @Post('wechat')
  @ApiOperation({ summary: '微信支付' })
  wechatPay(@Body('orderNo') orderNo: string, @Body('amount') amount: number, @Body('description') description: string) {
    return this.paymentService.wechatPay(orderNo, amount, description)
  }

  @Post('union')
  @ApiOperation({ summary: '银联支付' })
  unionPay(@Body('orderNo') orderNo: string, @Body('amount') amount: number, @Body('productName') productName: string) {
    return this.paymentService.unionPay(orderNo, amount, productName)
  }

  @Get('query')
  @ApiOperation({ summary: '查询支付结果' })
  queryPayment(@Query('orderNo') orderNo: string, @Query('channel') channel: 'alipay' | 'wechat' | 'union') {
    return this.paymentService.queryPayment(orderNo, channel)
  }

  @Post('refund')
  @ApiOperation({ summary: '退款' })
  refund(
    @Body('orderNo') orderNo: string,
    @Body('amount') amount: number,
    @Body('reason') reason: string,
    @Body('channel') channel: 'alipay' | 'wechat' | 'union',
  ) {
    return this.paymentService.refund(orderNo, amount, reason, channel)
  }
}
