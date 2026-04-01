/**
 * 联调测试配置
 * 用于前后端集成测试
 *
 * @version 1.0.0
 * @since 2026-03-31
 */

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaModule } from '../../common/prisma/prisma.module'

// ============================================
// 测试数据库配置
// ============================================

const testDatabaseConfig = {
  database: {
    url: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/daoda_test',
  },
  redis: {
    url: process.env.TEST_REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: 'test-jwt-secret-key-for-integration-testing',
    expiresIn: '2h',
  },
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => testDatabaseConfig],
    }),
    PrismaModule,
  ],
  providers: [],
  exports: [],
})
export class IntegrationTestModule {}

// ============================================
// 联调测试清单
// ============================================

/**
 * P0 核心模块联调测试项
 */
export const P0_INTEGRATION_TESTS = [
  // Auth 模块
  {
    module: 'auth',
    endpoint: '/api/v1/auth/login',
    method: 'POST',
    expected: 'accessToken + refreshToken',
  },
  { module: 'auth', endpoint: '/api/v1/auth/register', method: 'POST', expected: 'user created' },
  { module: 'auth', endpoint: '/api/v1/auth/me', method: 'GET', expected: 'current user info' },

  // User 模块
  { module: 'user', endpoint: '/api/v1/users', method: 'GET', expected: 'user list' },
  { module: 'user', endpoint: '/api/v1/users/:id', method: 'GET', expected: 'user detail' },
  { module: 'user', endpoint: '/api/v1/users', method: 'POST', expected: 'user created' },

  // Role 模块
  { module: 'role', endpoint: '/api/v1/roles', method: 'GET', expected: 'role list' },
  { module: 'role', endpoint: '/api/v1/roles', method: 'POST', expected: 'role created' },

  // Tenant 模块
  { module: 'tenant', endpoint: '/api/v1/tenants', method: 'GET', expected: 'tenant list' },
  { module: 'tenant', endpoint: '/api/v1/tenants', method: 'POST', expected: 'tenant created' },
]

/**
 * P2 扩展模块联调测试项
 */
export const P2_INTEGRATION_TESTS = [
  // API Key 模块
  {
    module: 'api-key',
    endpoint: '/api/v1/api-keys',
    method: 'POST',
    expected: 'apiKey created with key string',
  },
  {
    module: 'api-key',
    endpoint: '/api/v1/api-keys',
    method: 'GET',
    expected: 'apiKey list (without full key)',
  },
  {
    module: 'api-key',
    endpoint: '/api/v1/api-keys/:id/regenerate',
    method: 'POST',
    expected: 'new key string',
  },

  // Webhook 模块
  { module: 'webhook', endpoint: '/api/v1/webhooks', method: 'POST', expected: 'webhook created' },
  {
    module: 'webhook',
    endpoint: '/api/v1/webhooks/:id/test',
    method: 'POST',
    expected: 'test result + log',
  },
  {
    module: 'webhook',
    endpoint: '/api/v1/webhooks/:id/logs',
    method: 'GET',
    expected: 'webhook logs',
  },

  // Public API 模块
  {
    module: 'public-api',
    endpoint: '/api/v1/public/news',
    method: 'GET',
    expected: 'news list',
    requiresApiKey: true,
  },
  {
    module: 'public-api',
    endpoint: '/api/v1/public/products',
    method: 'GET',
    expected: 'products list',
    requiresApiKey: true,
  },
  {
    module: 'public-api',
    endpoint: '/api/v1/public/leads',
    method: 'POST',
    expected: 'lead created',
    requiresApiKey: true,
  },

  // Contract 模块
  {
    module: 'contract',
    endpoint: '/api/v1/contracts',
    method: 'POST',
    expected: 'contract created',
  },
  { module: 'contract', endpoint: '/api/v1/contracts', method: 'GET', expected: 'contract list' },
  {
    module: 'contract',
    endpoint: '/api/v1/contracts/upcoming',
    method: 'GET',
    expected: 'upcoming contracts',
  },
  {
    module: 'contract',
    endpoint: '/api/v1/contracts/stats',
    method: 'GET',
    expected: 'contract stats',
  },
]

/**
 * 前端页面联调测试项
 */
export const FRONTEND_INTEGRATION_TESTS = [
  // Workflow 页面
  { page: '/workflow/pending', expected: 'PendingApproval component loads' },
  { page: '/workflow/initiated', expected: 'WorkflowInitiated component loads' },
  { page: '/workflow/approved', expected: 'WorkflowApproved component loads' },
  { page: '/workflow/definitions', expected: 'WorkflowDefinitionList component loads' },

  // Notification 页面
  { page: '/notification/center', expected: 'NotificationCenter component loads' },
  { page: '/notification/templates', expected: 'NotificationTemplates component loads' },
  { page: '/notification/preferences', expected: 'NotificationPreference component loads' },
]

// ============================================
// 测试配置导出
// ============================================

export const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  frontendUrl: 'http://localhost:5173',
  timeout: 10000,
  retries: 3,
}
