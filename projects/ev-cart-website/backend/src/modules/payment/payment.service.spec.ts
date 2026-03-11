import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { PaymentService } from './payment.service'

describe('PaymentService', () => {
  let service: PaymentService
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                ALIPAY_APP_ID: 'test_app_id',
                ALIPAY_PRIVATE_KEY: 'test_private_key',
                WECHAT_APP_ID: 'test_wechat_app_id',
                WECHAT_MCH_ID: 'test_mch_id',
                WECHAT_API_KEY: 'test_api_key',
                WECHAT_NOTIFY_URL: 'https://test.com/notify',
                UNION_MER_ID: 'test_mer_id',
                UNION_FRONT_URL: 'https://test.com/success',
                UNION_BACK_URL: 'https://test.com/notify',
              }
              return config[key]
            }),
          },
        },
      ],
    }).compile()

    service = module.get<PaymentService>(PaymentService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('alipay', () => {
    it('should return alipay payment url', async () => {
      const result = await service.alipay('ORDER_001', 100, 'Test Product')
      expect(result.success).toBe(true)
      expect(result.orderNo).toBe('ORDER_001')
      expect(result.amount).toBe(100)
      expect(result.payUrl).toContain('alipay')
    })
  })

  describe('wechatPay', () => {
    it('should return wechat payment params', async () => {
      const result = await service.wechatPay('ORDER_002', 200, 'Test Product')
      expect(result.success).toBe(true)
      expect(result.orderNo).toBe('ORDER_002')
      expect(result.amount).toBe(200)
      expect(result.payParams).toBeDefined()
    })
  })

  describe('unionPay', () => {
    it('should return union payment url', async () => {
      const result = await service.unionPay('ORDER_003', 300, 'Test Product')
      expect(result.success).toBe(true)
      expect(result.orderNo).toBe('ORDER_003')
      expect(result.amount).toBe(300)
      expect(result.payUrl).toContain('95516')
    })
  })

  describe('queryPayment', () => {
    it('should return payment status', async () => {
      const result = await service.queryPayment('ORDER_001', 'alipay')
      expect(result.success).toBe(true)
      expect(result.status).toBe('paid')
      expect(result.orderNo).toBe('ORDER_001')
    })
  })

  describe('refund', () => {
    it('should return refund result', async () => {
      const result = await service.refund('ORDER_001', 100, 'Customer request', 'alipay')
      expect(result.success).toBe(true)
      expect(result.refundNo).toContain('REF_')
      expect(result.amount).toBe(100)
    })
  })
})
