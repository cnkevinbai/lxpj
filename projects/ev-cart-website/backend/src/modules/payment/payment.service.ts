import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * 支付服务
 * 支持支付宝、微信支付、银联
 */
@Injectable()
export class PaymentService {
  constructor(private configService: ConfigService) {}

  /**
   * 支付宝支付
   */
  async alipay(orderNo: string, amount: number, subject: string) {
    const appId = this.configService.get('ALIPAY_APP_ID')
    const privateKey = this.configService.get('ALIPAY_PRIVATE_KEY')

    // 构建支付宝支付参数
    const bizContent = {
      out_trade_no: orderNo,
      total_amount: amount,
      subject: subject,
      product_code: 'FAST_INSTANT_TRADE_PAY',
    }

    // TODO: 实现支付宝签名和 API 调用
    return {
      success: true,
      payUrl: `https://openapi.alipay.com/gateway.do?app_id=${appId}&biz_content=${JSON.stringify(bizContent)}`,
      orderNo,
      amount,
    }
  }

  /**
   * 微信支付
   */
  async wechatPay(orderNo: string, amount: number, description: string) {
    const appId = this.configService.get('WECHAT_APP_ID')
    const mchId = this.configService.get('WECHAT_MCH_ID')
    const apiKey = this.configService.get('WECHAT_API_KEY')

    // 构建微信支付参数
    const unifiedOrder = {
      appid: appId,
      mch_id: mchId,
      nonce_str: this.generateNonce(),
      body: description,
      out_trade_no: orderNo,
      total_fee: Math.round(amount * 100), // 单位：分
      spbill_create_ip: '127.0.0.1',
      notify_url: this.configService.get('WECHAT_NOTIFY_URL'),
      trade_type: 'JSAPI',
    }

    // TODO: 实现微信支付签名和 API 调用
    return {
      success: true,
      payParams: {
        appId,
        timeStamp: Date.now().toString(),
        nonceStr: unifiedOrder.nonce_str,
        package: `prepay_id=xxx`,
        signType: 'RSA',
      },
      orderNo,
      amount,
    }
  }

  /**
   * 银联支付
   */
  async unionPay(orderNo: string, amount: number, productName: string) {
    const merId = this.configService.get('UNION_MER_ID')

    // 构建银联支付参数
    const params = {
      version: '5.1.0',
      encoding: 'UTF-8',
      signature: 'RSA',
      txnType: '01', // 消费
      txnSubType: '01',
      bizType: '000201',
      accessType: '0',
      channelId: '07',
      merId: merId,
      orderId: orderNo,
      txnTime: this.getCurrentTime(),
      txnAmt: Math.round(amount * 100), // 单位：分
      currencyCode: '156',
      frontUrl: this.configService.get('UNION_FRONT_URL'),
      backUrl: this.configService.get('UNION_BACK_URL'),
    }

    // TODO: 实现银联签名和 API 调用
    return {
      success: true,
      payUrl: `https://gateway.95516.com/gateway/api/frontTransReq.do`,
      params,
      orderNo,
      amount,
    }
  }

  /**
   * 支付结果查询
   */
  async queryPayment(orderNo: string, channel: 'alipay' | 'wechat' | 'union') {
    // TODO: 实现支付结果查询
    return {
      success: true,
      status: 'paid', // paid/unpaid/refunded
      orderNo,
      channel,
      paidAt: new Date().toISOString(),
    }
  }

  /**
   * 退款
   */
  async refund(orderNo: string, amount: number, reason: string, channel: 'alipay' | 'wechat' | 'union') {
    // TODO: 实现退款功能
    return {
      success: true,
      refundNo: `REF_${orderNo}`,
      orderNo,
      amount,
      reason,
      channel,
    }
  }

  /**
   * 生成随机字符串
   */
  private generateNonce(): string {
    return Math.random().toString(36).substr(2, 16)
  }

  /**
   * 获取当前时间 (YYYYMMDDHHmmss)
   */
  private getCurrentTime(): string {
    const now = new Date()
    return now.toISOString().replace(/[-:T.]/g, '').substr(0, 14)
  }
}
