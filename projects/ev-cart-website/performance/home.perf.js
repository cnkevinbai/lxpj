import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 100,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% 请求 < 500ms
    http_req_failed: ['rate<0.01'], // 错误率 < 1%
  },
}

export default function () {
  // Test homepage
  const res = http.get('http://localhost:3000')
  check(res, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage load time < 500ms': (r) => r.timings.duration < 500,
  })
  sleep(1)

  // Test products page
  const productsRes = http.get('http://localhost:3000/products')
  check(productsRes, {
    'products status is 200': (r) => r.status === 200,
    'products load time < 500ms': (r) => r.timings.duration < 500,
  })
  sleep(1)

  // Test API health
  const apiRes = http.get('http://localhost:3001/api/v1/health')
  check(apiRes, {
    'api health status is 200': (r) => r.status === 200,
    'api health load time < 100ms': (r) => r.timings.duration < 100,
  })
  sleep(1)
}
