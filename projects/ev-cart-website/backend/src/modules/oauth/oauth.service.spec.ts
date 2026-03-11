import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { OauthService } from './oauth.service'

describe('OauthService', () => {
  let service: OauthService
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OauthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                WECHAT_APP_ID: 'test_wechat_app_id',
                WECHAT_APP_SECRET: 'test_wechat_secret',
                QQ_APP_ID: 'test_qq_app_id',
                QQ_APP_KEY: 'test_qq_key',
                ALIPAY_APP_ID: 'test_alipay_app_id',
                ALIPAY_PRIVATE_KEY: 'test_alipay_key',
              }
              return config[key]
            }),
          },
        },
      ],
    }).compile()

    service = module.get<OauthService>(OauthService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('wechatLogin', () => {
    it('should return wechat user info', async () => {
      const result = await service.wechatLogin('test_code')
      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user.openid).toContain('wechat')
      expect(result.token).toBeDefined()
    })
  })

  describe('qqLogin', () => {
    it('should return qq user info', async () => {
      const result = await service.qqLogin('test_code')
      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user.openid).toContain('qq')
      expect(result.token).toBeDefined()
    })
  })

  describe('alipayLogin', () => {
    it('should return alipay user info', async () => {
      const result = await service.alipayLogin('test_code')
      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user.user_id).toContain('alipay')
      expect(result.token).toBeDefined()
    })
  })

  describe('bindAccount', () => {
    it('should bind third-party account', async () => {
      const result = await service.bindAccount('user_001', 'wechat', 'openid_xxx')
      expect(result.success).toBe(true)
      expect(result.userId).toBe('user_001')
      expect(result.platform).toBe('wechat')
      expect(result.openid).toBe('openid_xxx')
    })
  })

  describe('unbindAccount', () => {
    it('should unbind third-party account', async () => {
      const result = await service.unbindAccount('user_001', 'wechat')
      expect(result.success).toBe(true)
      expect(result.userId).toBe('user_001')
      expect(result.platform).toBe('wechat')
    })
  })
})
