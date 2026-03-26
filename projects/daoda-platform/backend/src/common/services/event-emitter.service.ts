import { Injectable } from '@nestjs/common'
import { WebhookService } from '../../modules/webhook/webhook.service'

@Injectable()
export class EventEmitterService {
  constructor(private webhookService: WebhookService) {}

  // 定义事件类型
  static EVENTS = {
    // CRM 事件
    CUSTOMER_CREATED: 'customer.created',
    CUSTOMER_UPDATED: 'customer.updated',
    LEAD_CREATED: 'lead.created',
    OPPORTUNITY_WON: 'opportunity.won',
    ORDER_CREATED: 'order.created',
    
    // ERP 事件
    PURCHASE_COMPLETED: 'purchase.completed',
    PRODUCTION_STARTED: 'production.started',
    INVENTORY_LOW: 'inventory.low',
    
    // 财务事件
    INVOICE_ISSUED: 'invoice.issued',
    PAYMENT_RECEIVED: 'payment.received',
  }

  async emit(event: string, payload: any): Promise<void> {
    // 触发所有订阅该事件的 Webhook
    await this.webhookService.trigger(event, payload)
  }
}
