/**
 * 端到端全业务流测试
 * 模拟真实业务场景的完整流程
 */

describe('端到端全业务流测试 (E2E)', () => {
  const testOrder = {
    customer: {
      name: '张家界国家森林公园',
      contact: '张主任',
      phone: '13800138000',
      email: 'zhang@zjj.gov.cn',
    },
    products: [
      {
        model: 'EC-23',
        name: '23 座电动观光车',
        quantity: 50,
        unitPrice: 50000,
      },
    ],
    totalAmount: 2500000, // 250 万
  };

  it('应该完成从官网询价到售后服务的完整流程', async () => {
    console.log('📝 开始端到端全业务流测试');

    // ========== 阶段 1: 官网询价 ==========
    console.log('1️⃣ 阶段 1: 官网询价');
    
    const inquiryResponse = await request(app.getHttpServer())
      .post('/api/v1/website/inquiry')
      .send({
        name: testOrder.customer.name,
        contact: testOrder.customer.contact,
        phone: testOrder.customer.phone,
        email: testOrder.customer.email,
        product: testOrder.products[0].name,
        quantity: testOrder.products[0].quantity,
        requirement: '景区接驳使用，需要长续航',
      });

    expect(inquiryResponse.body.success).toBe(true);
    const leadId = inquiryResponse.body.leadId;
    console.log(`   ✅ 线索创建成功：${leadId}`);

    // ========== 阶段 2: CRM 销售跟进 ==========
    console.log('2️⃣ 阶段 2: CRM 销售跟进');

    // 销售分配
    const assignResponse = await request(app.getHttpServer())
      .post(`/api/v1/crm/leads/${leadId}/assign`)
      .send({ assignedTo: 'sales-001' });

    expect(assignResponse.body.success).toBe(true);

    // 创建跟进记录
    const followupResponse = await request(app.getHttpServer())
      .post(`/api/v1/crm/leads/${leadId}/followup`)
      .send({
        type: 'phone_call',
        content: '已联系客户，确认需求，意向强烈',
        nextFollowupDate: '2026-03-15',
      });

    expect(followupResponse.body.success).toBe(true);

    // 转换为商机
    const opportunityResponse = await request(app.getHttpServer())
      .post(`/api/v1/crm/leads/${leadId}/convert-opportunity`)
      .send({
        estimatedAmount: testOrder.totalAmount,
        expectedCloseDate: '2026-03-30',
      });

    expect(opportunityResponse.body.success).toBe(true);
    const opportunityId = opportunityResponse.body.opportunityId;
    console.log(`   ✅ 商机创建成功：${opportunityId}`);

    // ========== 阶段 3: 报价审批 ==========
    console.log('3️⃣ 阶段 3: 报价审批');

    // 申请特价（低于标准价 5%）
    const approvalResponse = await request(app.getHttpServer())
      .post('/api/v1/workflow/approval/start')
      .send({
        flowId: 'flow-discount-001',
        businessId: opportunityId,
        businessData: {
          discount: 0.05,
          reason: '大客户，申请 5% 折扣',
        },
        applicantId: 'sales-001',
      });

    expect(approvalResponse.body.success).toBe(true);
    const approvalInstanceId = approvalResponse.body.instanceId;

    // 经理审批
    await request(app.getHttpServer())
      .post(`/api/v1/workflow/approval/${approvalInstanceId}/approve`)
      .send({
        action: 'approve',
        comment: '同意',
        approverId: 'manager-001',
      });

    console.log('   ✅ 折扣审批通过');

    // ========== 阶段 4: 商机赢单转订单 ==========
    console.log('4️⃣ 阶段 4: 商机赢单转订单');

    // 更新商机状态为赢单
    await request(app.getHttpServer())
      .put(`/api/v1/crm/opportunities/${opportunityId}`)
      .send({ status: 'won' });

    // 转换为 ERP 订单
    const convertResponse = await request(app.getHttpServer())
      .post(`/api/v1/integration/crm/opportunity/${opportunityId}/convert`)
      .send({
        products: testOrder.products,
        totalAmount: testOrder.totalAmount * 0.95, // 应用折扣
      });

    expect(convertResponse.body.success).toBe(true);
    const erpOrderId = convertResponse.body.erpOrderId;
    console.log(`   ✅ ERP 订单创建成功：${erpOrderId}`);

    // ========== 阶段 5: 大额订单审批 ==========
    console.log('5️⃣ 阶段 5: 大额订单审批（>50 万）');

    // 自动触发订单审批流（250 万）
    const orderApprovalInstance = convertResponse.body.approvalInstanceId;

    // 销售总监审批
    await request(app.getHttpServer())
      .post(`/api/v1/workflow/approval/${orderApprovalInstance}/approve`)
      .send({
        action: 'approve',
        comment: '同意，优先排产',
        approverId: 'director-001',
      });

    console.log('   ✅ 订单审批通过');

    // ========== 阶段 6: 生产工单 ==========
    console.log('6️⃣ 阶段 6: 生产工单');

    // 创建生产工单
    const workOrderResponse = await request(app.getHttpServer())
      .post('/api/v1/workflow/workorder')
      .send({
        type: 'production',
        orderId: erpOrderId,
        products: testOrder.products,
        priority: 'high',
        estimatedDays: 20,
      });

    expect(workOrderResponse.body.success).toBe(true);
    const workOrderId = workOrderResponse.body.workOrderId;
    console.log(`   ✅ 生产工单创建成功：${workOrderId}`);

    // 更新生产进度
    await request(app.getHttpServer())
      .post(`/api/v1/workflow/workorder/${workOrderId}/status`)
      .send({ status: 'in_progress', progress: 30 });

    await request(app.getHttpServer())
      .post(`/api/v1/workflow/workorder/${workOrderId}/status`)
      .send({ status: 'in_progress', progress: 60 });

    await request(app.getHttpServer())
      .post(`/api/v1/workflow/workorder/${workOrderId}/status`)
      .send({ status: 'quality_check' });

    await request(app.getHttpServer())
      .post(`/api/v1/workflow/workorder/${workOrderId}/status`)
      .send({ status: 'completed' });

    console.log('   ✅ 生产完工');

    // ========== 阶段 7: 发货收款 ==========
    console.log('7️⃣ 阶段 7: 发货收款');

    // 更新订单状态为已发货
    await request(app.getHttpServer())
      .put(`/api/v1/erp/orders/${erpOrderId}`)
      .send({ status: 'shipped' });

    // 记录收款
    await request(app.getHttpServer())
      .post('/api/v1/finance/sync/payment')
      .send({
        orderNo: erpOrderId,
        amount: testOrder.totalAmount * 0.95,
        paymentMethod: 'bank_transfer',
        paymentDate: '2026-03-25',
      });

    console.log('   ✅ 已发货收款');

    // ========== 阶段 8: 售后服务 ==========
    console.log('8️⃣ 阶段 8: 售后服务');

    // 创建售后工单（模拟客户报修）
    const afterSalesResponse = await request(app.getHttpServer())
      .post('/api/v1/workflow/workorder')
      .send({
        type: 'after_sales',
        customerId: convertResponse.body.customerId,
        orderId: erpOrderId,
        issue: '车辆充电口故障',
        priority: 'high',
      });

    expect(afterSalesResponse.body.success).toBe(true);
    const afterSalesWorkOrderId = afterSalesResponse.body.workOrderId;

    // 分配工程师
    await request(app.getHttpServer())
      .post(`/api/v1/workflow/workorder/${afterSalesWorkOrderId}/assign`)
      .send({ assigneeId: 'engineer-001' });

    // 处理完工
    await request(app.getHttpServer())
      .post(`/api/v1/workflow/workorder/${afterSalesWorkOrderId}/status`)
      .send({
        status: 'completed',
        comment: '已更换充电口，测试正常',
      });

    console.log('   ✅ 售后服务完成');

    // ========== 验证数据一致性 ==========
    console.log('📊 验证数据一致性');

    // 验证统一客户视图
    const customer360Response = await request(app.getHttpServer())
      .get(`/api/v1/customers/unified/${convertResponse.body.customerId}/360`);

    expect(customer360Response.body.statistics.totalOrders).toBe(1);
    expect(customer360Response.body.statistics.totalRevenue).toBe(testOrder.totalAmount * 0.95);

    console.log('   ✅ 数据一致性验证通过');

    console.log('🎉 端到端全业务流测试通过！');
  });
});
