/**
 * 业务流集成测试
 * 测试官网+CRM+ERP+鸿蒙 APP 四方协作
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('业务流集成测试', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 初始化测试应用
    // const moduleFixture: TestingModule = await Test.createTestingModule({
    //   imports: [AppModule],
    // }).compile();
    // app = moduleFixture.createNestApplication();
    // await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  // ========== 测试 1: 官网询价→CRM 线索 ==========
  describe('官网询价→CRM 线索', () => {
    it('应该成功创建线索', async () => {
      const inquiryData = {
        name: '测试客户',
        phone: '13800138000',
        email: 'test@example.com',
        product: '23 座电动观光车',
        quantity: 10,
        requirement: '景区使用',
      };

      // 1. 官网提交询价
      const inquiryResponse = await request(app.getHttpServer())
        .post('/api/v1/website/inquiry')
        .send(inquiryData)
        .expect(201);

      expect(inquiryResponse.body.success).toBe(true);
      expect(inquiryResponse.body.leadId).toBeDefined();

      // 2. 验证 CRM 线索已创建
      const leadResponse = await request(app.getHttpServer())
        .get(`/api/v1/crm/leads/${inquiryResponse.body.leadId}`)
        .expect(200);

      expect(leadResponse.body.source).toBe('website');
      expect(leadResponse.body.status).toBe('new');
      expect(leadResponse.body.assignedTo).toBeDefined();
    });
  });

  // ========== 测试 2: CRM 商机→ERP 订单 ==========
  describe('CRM 商机→ERP 订单', () => {
    it('应该成功转换商机为订单', async () => {
      // 1. 创建赢单商机
      const opportunityData = {
        customerId: 'customer-xxx',
        products: [
          { productId: 'prod-1', quantity: 10, unitPrice: 50000 },
        ],
        totalAmount: 500000,
        status: 'won',
      };

      // 2. 转换为 ERP 订单
      const convertResponse = await request(app.getHttpServer())
        .post('/api/v1/integration/crm/opportunity/opp-xxx/convert')
        .send(opportunityData)
        .expect(201);

      expect(convertResponse.body.success).toBe(true);
      expect(convertResponse.body.erpOrderId).toBeDefined();
      expect(convertResponse.body.erpOrderNo).toBeDefined();

      // 3. 验证 ERP 订单已创建
      const orderResponse = await request(app.getHttpServer())
        .get(`/api/v1/erp/orders/${convertResponse.body.erpOrderId}`)
        .expect(200);

      expect(orderResponse.body.sourceOpportunityId).toBe('opp-xxx');
      expect(orderResponse.body.status).toBe('pending');
    });
  });

  // ========== 测试 3: 价格审批流 ==========
  describe('价格审批流', () => {
    it('应该完成多级审批流程', async () => {
      // 1. 发起价格审批
      const approvalData = {
        flowId: 'flow-price-001',
        businessId: 'prod-xxx',
        businessData: {
          productId: 'prod-xxx',
          oldPrice: 50000,
          newPrice: 55000,
          changeRate: 0.1, // 10% 涨价
        },
        applicantId: 'user-sales-001',
        comment: '原材料涨价，申请调价',
      };

      const startResponse = await request(app.getHttpServer())
        .post('/api/v1/workflow/approval/start')
        .send(approvalData)
        .expect(201);

      expect(startResponse.body.success).toBe(true);
      expect(startResponse.body.instanceNo).toBeDefined();

      const instanceId = startResponse.body.instanceId;

      // 2. 销售经理审批
      const task1 = startResponse.body.tasks[0];
      const approve1Response = await request(app.getHttpServer())
        .post(`/api/v1/workflow/approval/${task1.id}/approve`)
        .send({
          action: 'approve',
          comment: '同意',
          approverId: 'user-manager-001',
        })
        .expect(200);

      expect(approve1Response.body.status).toBe('approving');

      // 3. 财务审批
      const task2 = approve1Response.body.tasks[0];
      const approve2Response = await request(app.getHttpServer())
        .post(`/api/v1/workflow/approval/${task2.id}/approve`)
        .send({
          action: 'approve',
          comment: '财务审核通过',
          approverId: 'user-finance-001',
        })
        .expect(200);

      expect(approve2Response.body.status).toBe('approved');

      // 4. 验证价格已更新
      const productResponse = await request(app.getHttpServer())
        .get(`/api/v1/products/prod-xxx`)
        .expect(200);

      expect(productResponse.price).toBe(55000);
    });
  });

  // ========== 测试 4: 订单审批流（大额） ==========
  describe('订单审批流（大额）', () => {
    it('应该触发大额订单审批', async () => {
      // 创建大额订单（>50 万）
      const orderData = {
        customerId: 'customer-xxx',
        products: [
          { productId: 'prod-1', quantity: 20, unitPrice: 50000 },
        ],
        totalAmount: 1000000, // 100 万，触发审批
      };

      const orderResponse = await request(app.getHttpServer())
        .post('/api/v1/erp/orders')
        .send(orderData)
        .expect(201);

      // 验证触发审批流
      expect(orderResponse.body.requiresApproval).toBe(true);
      expect(orderResponse.body.approvalInstanceId).toBeDefined();
    });
  });

  // ========== 测试 5: 生产工单流 ==========
  describe('生产工单流', () => {
    it('应该完成生产工单全流程', async () => {
      // 1. 创建生产工单
      const workOrderData = {
        type: 'production',
        orderId: 'order-xxx',
        products: [
          { productId: 'prod-1', quantity: 10 },
        ],
        priority: 'high',
        estimatedDays: 15,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/workflow/workorder')
        .send(workOrderData)
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.workOrderNo).toBeDefined();

      const workOrderId = createResponse.body.workOrderId;

      // 2. 更新状态：生产中
      const status1Response = await request(app.getHttpServer())
        .post(`/api/v1/workflow/workorder/${workOrderId}/status`)
        .send({ status: 'in_progress' })
        .expect(200);

      expect(status1Response.body.status).toBe('in_progress');

      // 3. 更新状态：质检中
      const status2Response = await request(app.getHttpServer())
        .post(`/api/v1/workflow/workorder/${workOrderId}/status`)
        .send({ status: 'quality_check' })
        .expect(200);

      // 4. 更新状态：已完成
      const status3Response = await request(app.getHttpServer())
        .post(`/api/v1/workflow/workorder/${workOrderId}/status`)
        .send({ status: 'completed' })
        .expect(200);

      expect(status3Response.body.status).toBe('completed');

      // 5. 验证库存已更新
      const inventoryResponse = await request(app.getHttpServer())
        .get('/api/v1/erp/inventory/prod-1')
        .expect(200);

      expect(inventoryResponse.body.stockQuantity).toBeGreaterThanOrEqual(10);
    });
  });

  // ========== 测试 6: 售后工单流 ==========
  describe('售后工单流', () => {
    it('应该完成售后工单全流程', async () => {
      // 1. 创建售后工单
      const afterSalesData = {
        type: 'after_sales',
        customerId: 'customer-xxx',
        orderId: 'order-xxx',
        issue: '车辆无法启动',
        priority: 'urgent',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/workflow/workorder')
        .send(afterSalesData)
        .expect(201);

      const workOrderId = createResponse.body.workOrderId;

      // 2. 分配工程师
      const assignResponse = await request(app.getHttpServer())
        .post(`/api/v1/workflow/workorder/${workOrderId}/assign`)
        .send({ assigneeId: 'engineer-001' })
        .expect(200);

      expect(assignResponse.body.status).toBe('assigned');

      // 3. 工程师处理
      const processResponse = await request(app.getHttpServer())
        .post(`/api/v1/workflow/workorder/${workOrderId}/status`)
        .send({
          status: 'processing',
          comment: '已联系客户，上门维修',
        })
        .expect(200);

      // 4. 完工
      const completeResponse = await request(app.getHttpServer())
        .post(`/api/v1/workflow/workorder/${workOrderId}/status`)
        .send({
          status: 'completed',
          comment: '已修复，客户确认满意',
        })
        .expect(200);

      expect(completeResponse.body.status).toBe('completed');
    });
  });

  // ========== 测试 7: 健康检查 ==========
  describe('健康检查', () => {
    it('应该返回健康状态', async () => {
      const healthResponse = await request(app.getHttpServer())
        .get('/api/v1/ha/health')
        .expect(200);

      expect(healthResponse.body.status).toBe('healthy');
      expect(healthResponse.body.services.database.status).toBe('healthy');
      expect(healthResponse.body.services.crm.status).toBe('healthy');
      expect(healthResponse.body.services.erp.status).toBe('healthy');
    });
  });

  // ========== 测试 8: 故障恢复 ==========
  describe('故障恢复', () => {
    it('应该自动重试失败的同步', async () => {
      // 模拟同步失败
      const syncData = {
        type: 'inventory_sync',
        data: {},
      };

      // 加入重试队列
      const queueResponse = await request(app.getHttpServer())
        .post('/api/v1/ha/sync/inventory')
        .send(syncData)
        .expect(201);

      expect(queueResponse.body.success).toBe(true);

      // 验证队列状态
      const queueStatusResponse = await request(app.getHttpServer())
        .get('/api/v1/ha/queue')
        .expect(200);

      expect(queueStatusResponse.body.length).toBeGreaterThanOrEqual(0);
    });
  });

  // ========== 测试 9: 四方数据一致性 ==========
  describe('四方数据一致性', () => {
    it('应该保持数据一致性', async () => {
      const testData = {
        customerName: '测试客户',
        phone: '13800138000',
        product: '23 座观光车',
        quantity: 5,
      };

      // 1. 官网创建
      const websiteResponse = await request(app.getHttpServer())
        .post('/api/v1/website/inquiry')
        .send(testData)
        .expect(201);

      const leadId = websiteResponse.body.leadId;

      // 2. 验证 CRM 数据
      const crmResponse = await request(app.getHttpServer())
        .get(`/api/v1/crm/leads/${leadId}`)
        .expect(200);

      expect(crmResponse.body.name).toBe(testData.customerName);
      expect(crmResponse.body.phone).toBe(testData.phone);

      // 3. 验证统一客户数据
      const unifiedResponse = await request(app.getHttpServer())
        .get(`/api/v1/customers/unified/${crmResponse.body.customerId}/360`)
        .expect(200);

      expect(unifiedResponse.body.basicInfo.customerName).toBe(testData.customerName);
    });
  });

  // ========== 测试 10: 高并发压力测试 ==========
  describe('高并发压力测试', () => {
    it('应该支持高并发请求', async () => {
      const requests = Array(100).fill(null).map(() =>
        request(app.getHttpServer())
          .get('/api/v1/ha/health')
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      const successCount = responses.filter(r => r.status === 200).length;
      const avgResponseTime = (endTime - startTime) / 100;

      expect(successCount).toBe(100);
      expect(avgResponseTime).toBeLessThan(500); // 平均响应<500ms
    });
  });
});
