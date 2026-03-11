import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '10s', target: 50 },  // Ramp up to 50 users
    { duration: '30s', target: 100 }, // Stay at 100 users
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% 请求 < 200ms
    http_req_failed: ['rate<0.01'],   // 错误率 < 1%
  },
}

export default function () {
  const API_BASE = 'http://localhost:3001/api/v1'

  // Test login API
  const loginRes = http.post(`${API_BASE}/auth/login`, JSON.stringify({
    email: 'admin@daoda-auto.com',
    password: 'admin123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  })
  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login returns token': (r) => JSON.parse(r.body).data.accessToken !== undefined,
  })
  sleep(1)

  // Test products API
  const productsRes = http.get(`${API_BASE}/products`)
  check(productsRes, {
    'products status is 200': (r) => r.status === 200,
    'products load time < 200ms': (r) => r.timings.duration < 200,
  })
  sleep(1)

  // Test customers API
  const customersRes = http.get(`${API_BASE}/customers`)
  check(customersRes, {
    'customers status is 200': (r) => r.status === 200,
    'customers load time < 200ms': (r) => r.timings.duration < 200,
  })
  sleep(1)
}
