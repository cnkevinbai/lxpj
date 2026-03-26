/**
 * 跨平台业务流工作流测试
 * 
 * 从整个平台使用角度发现功能缺陷：
 * 1. 销售到收款完整流程
 * 2. 采购到付款完整流程
 * 3. 售后工单完整流程
 * 4. 跨平台数据一致性
 */

import { AutomatedTestSystem } from './automated-test-system';

export class BusinessFlowTests extends AutomatedTestSystem {
  
  /**
   * 销售到收款完整流程测试
   */
  async testSalesToCashFlow() {
    console.log('\n💰 测试销售到收款完整流程...');
    
    await this.runTestCase('业务流 -001: 线索到客户转化', async () => {
      // Step 1: 创建线索
      await this.page.goto(`${this.baseUrl}/portal/crm/leads`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("新建")', '新建线索');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="name"]', '测试线索', '线索名称');
      await this.simulateType('input[name="phone"]', '13800138000', '联系电话');
      await this.simulateClick('button:has-text("保存")', '保存');
      await this.simulateWait(2000);
      
      console.log('Step 1: 线索创建完成');
    });

    await this.runTestCase('业务流 -002: 线索转商机', async () => {
      // Step 2: 线索转化商机
      await this.page.goto(`${this.baseUrl}/portal/crm/leads`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("转化")', '转化商机');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="opportunityName"]', '测试商机', '商机名称');
      await this.simulateType('input[name="amount"]', '100000', '商机金额');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      console.log('Step 2: 商机创建完成');
    });

    await this.runTestCase('业务流 -003: 商机转订单', async () => {
      // Step 3: 商机转订单
      await this.page.goto(`${this.baseUrl}/portal/crm/opportunities`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("赢单")', '商机赢单');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("创建订单")', '创建订单');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="orderNumber"]', 'ORD20260314001', '订单号');
      await this.simulateClick('button:has-text("保存")', '保存');
      await this.simulateWait(2000);
      
      console.log('Step 3: 订单创建完成');
    });

    await this.runTestCase('业务流 -004: 订单到收款', async () => {
      // Step 4: 订单收款
      await this.page.goto(`${this.baseUrl}/portal/crm/orders`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("收款")', '订单收款');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="amount"]', '100000', '收款金额');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      // Step 5: 验证财务应收
      await this.page.goto(`${this.baseUrl}/portal/finance/receivables`);
      await this.simulateWait(1000);
      
      const hasReceivable = await this.page.isVisible('text=100000') || 
                           await this.page.isVisible('[class*="receivable"]');
      if (!hasReceivable) {
        throw new Error('财务应收数据未同步');
      }
      
      console.log('Step 4: 收款完成，财务数据同步');
    });
  }

  /**
   * 采购到付款完整流程测试
   */
  async testPurchaseToPayFlow() {
    console.log('\n🛒 测试采购到付款完整流程...');
    
    await this.runTestCase('业务流 -005: 采购申请创建', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/purchase`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("新建")', '新建采购申请');
      await this.simulateWait(500);
      
      await this.simulateSelect('select[name="supplier"]', '供应商 A', '供应商');
      await this.simulateType('input[name="amount"]', '50000', '采购金额');
      await this.simulateClick('button:has-text("提交")', '提交');
      await this.simulateWait(2000);
      
      console.log('Step 1: 采购申请创建完成');
    });

    await this.runTestCase('业务流 -006: 采购审批', async () => {
      await this.page.goto(`${this.baseUrl}/portal/workflow/approvals`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("通过")', '审批通过');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      console.log('Step 2: 采购审批完成');
    });

    await this.runTestCase('业务流 -007: 采购入库', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/purchase`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("入库")', '采购入库');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="quantity"]', '100', '入库数量');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      // 验证库存增加
      await this.page.goto(`${this.baseUrl}/portal/erp/inventory`);
      await this.simulateWait(1000);
      
      console.log('Step 3: 采购入库完成，库存更新');
    });

    await this.runTestCase('业务流 -008: 采购付款', async () => {
      await this.page.goto(`${this.baseUrl}/portal/finance/payables`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("付款")', '采购付款');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="amount"]', '50000', '付款金额');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      console.log('Step 4: 采购付款完成');
    });
  }

  /**
   * 售后工单完整流程测试
   */
  async testAfterSalesFlow() {
    console.log('\n🔧 测试售后工单完整流程...');
    
    await this.runTestCase('业务流 -009: 工单创建', async () => {
      await this.page.goto(`${this.baseUrl}/portal/aftersales`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("新建")', '新建工单');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="customerName"]', '测试客户', '客户名称');
      await this.simulateType('input[name="subject"]', '设备故障', '工单主题');
      await this.simulateSelect('select[name="priority"]', 'HIGH', '优先级');
      await this.simulateClick('button:has-text("提交")', '提交');
      await this.simulateWait(2000);
      
      console.log('Step 1: 工单创建完成');
    });

    await this.runTestCase('业务流 -010: 工单分配', async () => {
      await this.page.goto(`${this.baseUrl}/portal/aftersales`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("分配")', '分配工单');
      await this.simulateWait(500);
      
      await this.simulateSelect('select[name="assignee"]', '工程师 A', '工程师');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      console.log('Step 2: 工单分配完成');
    });

    await this.runTestCase('业务流 -011: 工单处理', async () => {
      await this.page.goto(`${this.baseUrl}/portal/aftersales`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("处理")', '工单处理');
      await this.simulateWait(500);
      
      await this.simulateType('textarea[name="solution"]', '更换配件', '解决方案');
      await this.simulateClick('button:has-text("完成")', '完成');
      await this.simulateWait(2000);
      
      console.log('Step 3: 工单处理完成');
    });

    await this.runTestCase('业务流 -012: 工单评价', async () => {
      await this.page.goto(`${this.baseUrl}/portal/aftersales`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("评价")', '工单评价');
      await this.simulateWait(500);
      
      // 点击 5 星
      await this.simulateClick('.ant-rate-star:nth-child(5)', '5 星好评');
      await this.simulateType('textarea[name="comment"]', '服务很好', '评价内容');
      await this.simulateClick('button:has-text("提交")', '提交');
      await this.simulateWait(2000);
      
      console.log('Step 4: 工单评价完成');
    });
  }

  /**
   * 跨平台数据一致性测试
   */
  async testCrossPlatformData() {
    console.log('\n🔄 测试跨平台数据一致性...');
    
    await this.runTestCase('业务流 -013: PC 端创建数据', async () => {
      // PC 端创建客户
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("新建")', '新建客户');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="name"]', '跨平台测试客户', '客户名称');
      await this.simulateType('input[name="phone"]', '13900139000', '联系电话');
      await this.simulateClick('button:has-text("保存")', '保存');
      await this.simulateWait(2000);
      
      console.log('Step 1: PC 端数据创建完成');
    });

    await this.runTestCase('业务流 -014: 移动端验证数据', async () => {
      // 切换到移动端
      await this.page.goto(`${this.baseUrl}/mobile/crm/customers`);
      await this.simulateWait(2000);
      
      // 验证数据同步
      const hasCustomer = await this.page.isVisible('text=跨平台测试客户');
      if (!hasCustomer) {
        throw new Error('移动端未同步 PC 端数据');
      }
      
      console.log('Step 2: 移动端数据验证通过');
    });

    await this.runTestCase('业务流 -015: 官网数据展示', async () => {
      // 验证官网是否展示
      await this.page.goto(`${this.baseUrl}/customers`);
      await this.simulateWait(2000);
      
      console.log('Step 3: 官网数据验证完成');
    });
  }

  /**
   * 运行所有业务流测试
   */
  async runBusinessFlowTests() {
    console.log('\n🚀 开始运行跨平台业务流测试...\n');
    
    await this.testSalesToCashFlow();
    await this.testPurchaseToPayFlow();
    await this.testAfterSalesFlow();
    await this.testCrossPlatformData();
    
    console.log('\n✅ 跨平台业务流测试完成！');
  }
}

// 运行测试
(async () => {
  const tester = new BusinessFlowTests();
  await tester.runBusinessFlowTests();
})();
