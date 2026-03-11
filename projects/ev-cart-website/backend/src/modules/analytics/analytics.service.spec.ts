import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { AnalyticsService } from './analytics.service'

describe('AnalyticsService', () => {
  let service: AnalyticsService
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                SENSORS_PROJECT_ID: 'test_project',
                SENSORS_SERVER_URL: 'https://test.sensorsdata.cn',
                GROWINGIO_ACCOUNT_ID: 'test_account',
              }
              return config[key]
            }),
          },
        },
      ],
    }).compile()

    service = module.get<AnalyticsService>(AnalyticsService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('sensorsTrack', () => {
    it('should track event to Sensors Data', async () => {
      const result = await service.sensorsTrack('page_view', { url: '/home' })
      expect(result.success).toBe(true)
      expect(result.event).toBe('page_view')
      expect(result.properties).toEqual({ url: '/home' })
    })
  })

  describe('sensorsProfileSet', () => {
    it('should set user profile', async () => {
      const result = await service.sensorsProfileSet('user_001', { name: 'Test' })
      expect(result.success).toBe(true)
      expect(result.distinctId).toBe('user_001')
      expect(result.properties).toEqual({ name: 'Test' })
    })
  })

  describe('growingioTrack', () => {
    it('should track event to GrowingIO', async () => {
      const result = await service.growingioTrack('click', { element: 'button' })
      expect(result.success).toBe(true)
      expect(result.event).toBe('click')
      expect(result.data).toEqual({ element: 'button' })
    })
  })

  describe('growingioVisitorSet', () => {
    it('should set visitor properties', async () => {
      const result = await service.growingioVisitorSet('visitor_001', { device: 'mobile' })
      expect(result.success).toBe(true)
      expect(result.visitorId).toBe('visitor_001')
      expect(result.data).toEqual({ device: 'mobile' })
    })
  })

  describe('getReport', () => {
    it('should return analytics report', async () => {
      const result = await service.getReport('traffic', '2026-03-01', '2026-03-11')
      expect(result.success).toBe(true)
      expect(result.type).toBe('traffic')
      expect(result.data).toBeDefined()
      expect(result.data.pv).toBe(10000)
      expect(result.data.uv).toBe(5000)
    })
  })
})
