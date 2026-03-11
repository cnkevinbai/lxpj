import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/api/v1/health (GET)', () => {
    it('/api/v1/health', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok')
          expect(res.body.timestamp).toBeDefined()
        })
    })
  })

  describe('/api/v1/auth (POST)', () => {
    it('/api/v1/auth/login - 成功登录', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@daoda-auto.com',
          password: 'admin123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true)
          expect(res.body.data.accessToken).toBeDefined()
          expect(res.body.data.refreshToken).toBeDefined()
          expect(res.body.data.user).toBeDefined()
        })
    })

    it('/api/v1/auth/login - 失败登录 (错误密码)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@daoda-auto.com',
          password: 'wrongpassword',
        })
        .expect(401)
    })

    it('/api/v1/auth/login - 失败登录 (不存在的用户)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'notexist@example.com',
          password: 'password123',
        })
        .expect(401)
    })
  })

  describe('/api/v1/leads (GET)', () => {
    it('/api/v1/leads - 获取线索列表', () => {
      return request(app.getHttpServer())
        .get('/api/v1/leads')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true)
          expect(Array.isArray(res.body.data)).toBe(true)
        })
    })
  })

  describe('/api/v1/customers (GET)', () => {
    it('/api/v1/customers - 获取客户列表', () => {
      return request(app.getHttpServer())
        .get('/api/v1/customers')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true)
          expect(Array.isArray(res.body.data)).toBe(true)
        })
    })
  })

  describe('/api/v1/products (GET)', () => {
    it('/api/v1/products - 获取产品列表', () => {
      return request(app.getHttpServer())
        .get('/api/v1/products')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true)
          expect(Array.isArray(res.body.data)).toBe(true)
        })
    })
  })
})
