import { Injectable } from '@nestjs/common'

/**
 * AI 客服服务
 * 基于规则的简单客服 (后续可接入大模型)
 */
@Injectable()
export class AiChatService {
  private readonly knowledgeBase = {
    greetings: [
      '您好！欢迎咨询四川道达智能，请问有什么可以帮您？',
      '您好！我是道达智能客服助手，请问您想了解什么？',
    ],
    products: {
      '观光车': '我们的电动观光车系列包括 EC-11(11 座)、EC-14(14 座)、EC-23(23 座巴士) 等车型，续航 80-120km，支持定制。',
      '巡逻车': 'EP-2 电动巡逻车适合园区、景区安保巡逻使用，灵活便捷。',
      '货车': 'EF-1 电动货车适合园区内货物运输，载重能力强。',
      '价格': '价格根据车型和配置不同，一般在 3-15 万元之间，具体请咨询销售人员。',
      '续航': '我们的车型续航在 80-120km 之间，具体取决于车型和使用环境。',
      '定制': '我们支持车身颜色、座椅布局、电池容量等全方位定制服务。',
      '售后': '我们提供 1 年质保，终身维护，全国 200+ 经销商服务网络。',
      '交货': '标准车型 7-15 天交货，定制车型 20-30 天交货。',
      '付款': '支持 T/T、L/C、Western Union、PayPal 等多种付款方式。',
    },
    faq: {
      '保修期多久': '整车质保 1 年，电池质保 2 年。',
      '多久充满电': '标准充电 6-8 小时，快充 3-4 小时。',
      '最高时速': '根据车型不同，最高时速 25-35km/h。',
      '爬坡能力': '标准车型爬坡能力 15-20 度。',
      '适用温度': '-20°C 到 50°C 均可正常使用。',
    },
  }

  /**
   * 智能回复
   */
  async getReply(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase()

    // 问候
    if (/你好 | 您好 | hello|hi/.test(lowerMessage)) {
      return this.knowledgeBase.greetings[Math.floor(Math.random() * this.knowledgeBase.greetings.length)]
    }

    // 产品相关
    for (const [keyword, reply] of Object.entries(this.knowledgeBase.products)) {
      if (lowerMessage.includes(keyword)) {
        return reply
      }
    }

    // 常见问题
    for (const [keyword, reply] of Object.entries(this.knowledgeBase.faq)) {
      if (lowerMessage.includes(keyword)) {
        return reply
      }
    }

    // 默认回复
    return '感谢您的咨询！为了给您提供更准确的信息，建议您联系我们的销售人员：400-XXX-XXXX，或留下您的联系方式，我们会尽快与您联系。'
  }

  /**
   * 推荐问题
   */
  getSuggestedQuestions(): string[] {
    return [
      '观光车有哪些车型？',
      '价格是多少？',
      '续航能力如何？',
      '支持定制吗？',
      '保修期多久？',
      '多久能交货？',
    ]
  }
}
