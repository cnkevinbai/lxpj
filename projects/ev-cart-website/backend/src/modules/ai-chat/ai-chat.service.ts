import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatMessage } from './entities/chat-message.entity'

/**
 * AI 客服服务
 * 基于规则 + 知识库的智能客服 (后续可接入大模型)
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

  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  /**
   * 智能回复
   */
  async getReply(message: string, userId?: string): Promise<string> {
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

    // 意图识别 - 销售咨询
    if (/价格 | 报价 | 多少钱 | 费用/.test(lowerMessage)) {
      return '价格根据车型和配置不同，一般在 3-15 万元之间。具体报价需要根据您的具体需求来定，您可以留下联系方式，我们的销售人员会为您提供详细报价方案。'
    }

    // 意图识别 - 技术支持
    if (/技术 | 参数 | 规格 | 配置/.test(lowerMessage)) {
      return '我们提供详细的技术参数表，包括续航里程、最高时速、爬坡能力、充电时间等。您关注哪方面的参数呢？'
    }

    // 意图识别 - 售后服务
    if (/售后 | 维修 | 保养 | 质保/.test(lowerMessage)) {
      return '我们提供完善的售后服务：1 年整车质保，2 年电池质保，终身维护，全国 200+ 经销商服务网络，24 小时响应。'
    }

    // 意图识别 - 定制服务
    if (/定制 | 定做 | 特殊/.test(lowerMessage)) {
      return '我们支持全方位定制服务：车身颜色、座椅布局、电池容量、Logo 印刷等都可以根据您的需求定制。请问您有什么特殊需求？'
    }

    // 保存聊天记录
    if (userId) {
      await this.saveChatMessage(userId, message, 'user')
    }

    // 默认回复
    const defaultReply = '感谢您的咨询！为了给您提供更准确的信息，建议您联系我们的销售人员：400-XXX-XXXX，或留下您的联系方式，我们会尽快与您联系。'
    
    if (userId) {
      await this.saveChatMessage(userId, defaultReply, 'bot')
    }

    return defaultReply
  }

  /**
   * 保存聊天记录
   */
  async saveChatMessage(userId: string, content: string, sender: 'user' | 'bot'): Promise<void> {
    const message = this.chatMessageRepository.create({
      userId,
      content,
      sender,
    })
    await this.chatMessageRepository.save(message)
  }

  /**
   * 获取聊天历史
   */
  async getChatHistory(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    })
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

  /**
   * 转人工客服 (创建工单)
   */
  async transferToHuman(userId: string, reason: string): Promise<any> {
    // TODO: 创建工单逻辑
    return {
      success: true,
      ticketId: 'TICKET-' + Date.now(),
      message: '已为您创建工单，客服人员将尽快与您联系。',
    }
  }

  /**
   * 满意度评价
   */
  async submitFeedback(userId: string, rating: number, comment?: string): Promise<void> {
    // TODO: 保存满意度评价
    console.log(`用户${userId}评分：${rating}分，评论：${comment}`)
  }
}
