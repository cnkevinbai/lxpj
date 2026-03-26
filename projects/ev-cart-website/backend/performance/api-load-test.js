import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// 自定义指标
const errorRate = new Rate('errors');
const apiResponseTime = new Trend('api_response_time');

// 测试配置
export const options = {
  stages: [
    { duration: '30s', target: 50 },   // 热身阶段：50 用户
    { duration: '1m', target: 100 },   // 负载阶段：100 用户
    { duration: '30s', target: 200 },  // 压力阶段：200 用户
    { duration: '30s', target: 0 },    // 恢复阶段：0 用户
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% 请求<500ms
    errors: ['rate<0.1'],              // 错误率<10%
    api_response_time: ['p(95)<300'],  // API 响应时间<300ms
  },
};

// API 基准测试
export default function () {
  const baseUrl = 'http://localhost:3001/api';

  // 测试 1: 获取客户列表
  const customersRes = http.get(`${baseUrl}/crm/customers`);
  check(customersRes, {
    'GET /crm/customers status is 200': (r) => r.status === 200,
    'GET /crm/customers response time < 300ms': (r) => r.timings.duration < 300,
  });
  errorRate.add(customersRes.status !== 200);
  apiResponseTime.add(customersRes.timings.duration);
  sleep(1);

  // 测试 2: 创建客户
  const newCustomer = {
    name: '性能测试客户',
    type: 'ENTERPRISE',
    email: `perf${Date.now()}@test.com`,
  };
  const createRes = http.post(
    `${baseUrl}/crm/customers`,
    JSON.stringify(newCustomer),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(createRes, {
    'POST /crm/customers status is 201': (r) => r.status === 201,
    'POST /crm/customers response time < 500ms': (r) => r.timings.duration < 500,
  });
  errorRate.add(createRes.status !== 201);
  sleep(1);

  // 测试 3: 获取生产订单列表
  const productionRes = http.get(`${baseUrl}/erp/production`);
  check(productionRes, {
    'GET /erp/production status is 200': (r) => r.status === 200,
  });
  sleep(1);

  // 测试 4: 获取工单列表
  const ticketsRes = http.get(`${baseUrl}/service/tickets`);
  check(ticketsRes, {
    'GET /service/tickets status is 200': (r) => r.status === 200,
  });
  sleep(1);
}

// 性能测试报告
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    './performance-report.json': JSON.stringify(data),
  };
}

function textSummary(data, options) {
  return `
╔═══════════════════════════════════════════════════════════╗
║              性能测试报告                                  ║
╠═══════════════════════════════════════════════════════════╣
║ 请求总数：${data.metrics.http_reqs.values.count.toString().padEnd(35)}║
║ 错误率：${(data.metrics.errors.values.rate * 100).toFixed(2)}%${' '.repeat(30)}║
║ P95 响应时间：${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms${' '.repeat(24)}║
║ P99 响应时间：${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms${' '.repeat(24)}║
║ 平均响应时间：${data.metrics.http_req_duration.values.avg.toFixed(2)}ms${' '.repeat(24)}║
╚═══════════════════════════════════════════════════════════╝
`;
}
