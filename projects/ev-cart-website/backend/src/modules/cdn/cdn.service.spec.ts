import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { CdnService } from './cdn.service'

describe('CdnService', () => {
  let service: CdnService
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CdnService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              const config: Record<string, string> = {
                CDN_PROVIDER: 'aliyun',
                CDN_ACCESS_KEY: 'test_access_key',
                CDN_SECRET_KEY: 'test_secret_key',
              }
              return config[key] || defaultValue
            }),
          },
        },
      ],
    }).compile()

    service = module.get<CdnService>(CdnService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('refreshCache', () => {
    it('should refresh CDN cache', async () => {
      const urls = ['https://example.com/image.jpg']
      const result = await service.refreshCache(urls)
      expect(result.success).toBe(true)
      expect(result.urls).toEqual(urls)
      expect(result.taskId).toBeDefined()
    })
  })

  describe('prefetchCache', () => {
    it('should prefetch CDN cache', async () => {
      const urls = ['https://example.com/video.mp4']
      const result = await service.prefetchCache(urls)
      expect(result.success).toBe(true)
      expect(result.urls).toEqual(urls)
      expect(result.taskId).toBeDefined()
    })
  })

  describe('getUsage', () => {
    it('should return CDN usage statistics', async () => {
      const result = await service.getUsage('2026-03-01', '2026-03-11')
      expect(result.success).toBe(true)
      expect(result.startDate).toBe('2026-03-01')
      expect(result.endDate).toBe('2026-03-11')
      expect(result.data).toBeDefined()
      expect(result.data.traffic).toBe(1000)
      expect(result.data.requests).toBe(1000000)
    })
  })
})
