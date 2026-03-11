import { test, expect } from '@playwright/test'

test.describe('API Integration', () => {
  const API_BASE = 'http://localhost:3001/api/v1'

  test('should get health status', async ({ request }) => {
    const response = await request.get(`${API_BASE}/health`)
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.status).toBe('ok')
  })

  test('should login and get token', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: {
        email: 'admin@daoda-auto.com',
        password: 'admin123',
      },
    })
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.accessToken).toBeDefined()
  })

  test('should get products list', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products`)
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  test('should create lead', async ({ request }) => {
    const response = await request.post(`${API_BASE}/leads`, {
      data: {
        name: '测试用户',
        phone: '13800138000',
        email: 'test@example.com',
        company: '测试公司',
        productInterest: 'EC-11',
      },
    })
    expect(response.status()).toBe(201)
    const data = await response.json()
    expect(data.success).toBe(true)
  })

  test('should get dealers map', async ({ request }) => {
    const response = await request.get(`${API_BASE}/dealers/map?province=四川省`)
    expect(response.status()).toBe(200)
  })

  test('should send dingtalk message', async ({ request }) => {
    const response = await request.post(`${API_BASE}/integration/dingtalk/send`, {
      data: {
        webhook: 'https://test.com/webhook',
        content: {
          title: '测试消息',
          content: '这是一条测试消息',
        },
      },
    })
    expect(response.status()).toBe(201)
  })
})
