import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AuthModule (e2e)', () => {
  let app: INestApplication
  let accessToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    // 登录获取 token
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@daoda-auto.com',
        password: 'admin123',
      })
    
    accessToken = loginRes.body.data.accessToken
  })

  afterAll(async () => {
    await app.close()
  })

  describe('认证相关接口', () => {
    it('/api/v1/auth/refresh - 刷新 Token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'test-refresh-token' })
        .expect(401) // Token 无效，但接口正常
    })

    it('/api/v1/auth/validate - 验证 Token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/validate')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })
  })

  describe('权限控制', () => {
    it('/api/v1/users - 未授权访问', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(401)
    })

    it('/api/v1/users - 授权访问', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })
  })
})
