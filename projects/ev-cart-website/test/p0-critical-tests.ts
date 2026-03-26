/**
 * P0 级核心功能测试 - 补充核心功能覆盖
 */

import { AutomatedTestSystem } from './automated-test-system';

export class P0CriticalTests extends AutomatedTestSystem {
  
  /**
   * CRM P0 测试 (4 个用例)
   */
  async testCRMP0() {
    console.log('\n📊 补充 CRM P0 测试...');
    
    await this.runTestCase('CRM-009: 客户详情查看', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("查看")', '查看客户详情');
      await this.simulateWait(2000);
      
      const hasDetail = await this.page.isVisible('text=客户详情');
      if (!hasDetail) throw new Error('客户详情查看失败');
    });

    await this.runTestCase('CRM-010: 客户合并', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("合并")', '合并客户');
      await this.simulateWait(500);
      
      // 验证合并对话框
      const hasDialog = await this.page.isVisible('text=合并客户');
      if (!hasDialog) throw new Error('客户合并功能异常');
    });

    await this.runTestCase('CRM-011: 商机详情', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/opportunities`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("查看")', '查看商机');
      await this.simulateWait(2000);
      
      const hasDetail = await this.page.isVisible('text=商机详情');
      if (!hasDetail) throw new Error('商机详情查看失败');
    });

    await this.runTestCase('CRM-012: 订单详情', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/orders`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("查看")', '查看订单');
      await this.simulateWait(2000);
      
      const hasDetail = await this.page.isVisible('text=订单详情');
      if (!hasDetail) throw new Error('订单详情查看失败');
    });
  }

  /**
   * ERP P0 测试 (4 个用例)
   */
  async testERPP0() {
    console.log('\n🏭 补充 ERP P0 测试...');
    
    await this.runTestCase('ERP-017: 生产计划创建', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/production`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("计划")', '创建生产计划');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="plannedStartDate"]', '2026-03-20', '计划开始日期');
      await this.simulateType('input[name="plannedEndDate"]', '2026-03-25', '计划结束日期');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=计划创建成功');
      if (!success) throw new Error('生产计划创建失败');
    });

    await this.runTestCase('ERP-018: 生产完工入库', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/production`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("完工")', '生产完工');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="actualQuantity"]', '100', '完工数量');
      await this.simulateClick('button:has-text("入库")', '确认入库');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=完工入库成功');
      if (!success) throw new Error('生产完工入库失败');
    });

    await this.runTestCase('ERP-019: 采购审批', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/purchase`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("审批")', '采购审批');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("通过")', '审批通过');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=审批通过');
      if (!success) throw new Error('采购审批失败');
    });

    await this.runTestCase('ERP-020: 库存预警', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/inventory`);
      await this.simulateWait(1000);
      
      // 验证预警标识显示
      const hasWarning = await this.page.isVisible('[class*="warning"]');
      if (!hasWarning) throw new Error('库存预警显示失败');
    });
  }

  /**
   * 售后 P0 测试 (2 个用例)
   */
  async testAfterSalesP0() {
    console.log('\n🔧 补充售后 P0 测试...');
    
    await this.runTestCase('AS-004: 工单评价', async () => {
      await this.page.goto(`${this.baseUrl}/portal/aftersales`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("评价")', '工单评价');
      await this.simulateWait(500);
      
      // 选择星级
      await this.simulateClick('.ant-rate-star:nth-child(5)', '5 星好评');
      await this.simulateType('textarea[name="comment"]', '服务很好', '评价内容');
      await this.simulateClick('button:has-text("提交")', '提交');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=评价成功');
      if (!success) throw new Error('工单评价失败');
    });

    await this.runTestCase('AS-005: 工单分配', async () => {
      await this.page.goto(`${this.baseUrl}/portal/aftersales`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("分配")', '分配工单');
      await this.simulateWait(500);
      
      await this.simulateSelect('select[name="assignee"]', 'engineer1', '选择工程师');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=分配成功');
      if (!success) throw new Error('工单分配失败');
    });
  }

  /**
   * 财务 P0 测试 (2 个用例)
   */
  async testFinanceP0() {
    console.log('\n💰 补充财务 P0 测试...');
    
    await this.runTestCase('FIN-006: 收款核销', async () => {
      await this.page.goto(`${this.baseUrl}/portal/finance/receivables`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("核销")', '收款核销');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="amount"]', '1000', '核销金额');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=核销成功');
      if (!success) throw new Error('收款核销失败');
    });

    await this.runTestCase('FIN-007: 付款核销', async () => {
      await this.page.goto(`${this.baseUrl}/portal/finance/payables`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("核销")', '付款核销');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="amount"]', '500', '核销金额');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=核销成功');
      if (!success) throw new Error('付款核销失败');
    });
  }

  /**
   * HR P0 测试 (2 个用例)
   */
  async testHRP0() {
    console.log('\n👥 补充 HR P0 测试...');
    
    await this.runTestCase('HR-006: 员工转正', async () => {
      await this.page.goto(`${this.baseUrl}/portal/hr/employees`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("转正")', '员工转正');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="reviewDate"]', '2026-03-14', '转正日期');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=转正成功');
      if (!success) throw new Error('员工转正失败');
    });

    await this.runTestCase('HR-007: 考勤统计', async () => {
      await this.page.goto(`${this.baseUrl}/portal/hr/attendance`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("统计")', '考勤统计');
      await this.simulateWait(2000);
      
      const hasChart = await this.page.isVisible('[class*="chart"]');
      if (!hasChart) throw new Error('考勤统计显示失败');
    });
  }

  /**
   * 系统 P0 测试 (2 个用例)
   */
  async testAdminP0() {
    console.log('\n⚙️  补充系统 P0 测试...');
    
    await this.runTestCase('ADM-004: 用户禁用', async () => {
      await this.page.goto(`${this.baseUrl}/portal/admin/users`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("禁用")', '禁用用户');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=禁用成功');
      if (!success) throw new Error('用户禁用失败');
    });

    await this.runTestCase('ADM-005: 权限分配', async () => {
      await this.page.goto(`${this.baseUrl}/portal/admin/roles`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("权限")', '权限分配');
      await this.simulateWait(500);
      
      // 勾选权限
      await this.simulateClick('input[type="checkbox"]', '勾选权限');
      await this.simulateClick('button:has-text("保存")', '保存');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=保存成功');
      if (!success) throw new Error('权限分配失败');
    });
  }

  /**
   * 运行所有 P0 测试
   */
  async runP0Tests() {
    console.log('\n🚀 开始运行 P0 级核心功能测试...\n');
    
    await this.testCRMP0();
    await this.testERPP0();
    await this.testAfterSalesP0();
    await this.testFinanceP0();
    await this.testHRP0();
    await this.testAdminP0();
    
    console.log('\n✅ P0 级核心功能测试完成！');
  }
}
