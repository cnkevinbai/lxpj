/**
 * P1 级重要功能测试 - 补充重要功能覆盖
 */

import { AutomatedTestSystem } from './automated-test-system';

export class P1ImportantTests extends AutomatedTestSystem {
  
  /**
   * CRM P1 测试 (4 个用例)
   */
  async testCRMP1() {
    console.log('\n📊 补充 CRM P1 测试...');
    
    await this.runTestCase('CRM-013: 客户批量导出', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      // 选择多条记录
      await this.simulateClick('input[type="checkbox"]', '选择客户');
      await this.simulateClick('button:has-text("导出")', '批量导出');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=导出成功');
      if (!success) throw new Error('客户批量导出失败');
    });

    await this.runTestCase('CRM-014: 商机批量编辑', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/opportunities`);
      await this.simulateWait(1000);
      
      await this.simulateClick('input[type="checkbox"]', '选择商机');
      await this.simulateClick('button:has-text("批量编辑")', '批量编辑');
      await this.simulateWait(500);
      
      await this.simulateSelect('select[name="stage"]', 'PROPOSAL', '新阶段');
      await this.simulateClick('button:has-text("保存")', '保存');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=保存成功');
      if (!success) throw new Error('商机批量编辑失败');
    });

    await this.runTestCase('CRM-015: 订单批量确认', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/orders`);
      await this.simulateWait(1000);
      
      await this.simulateClick('input[type="checkbox"]', '选择订单');
      await this.simulateClick('button:has-text("批量确认")', '批量确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=确认成功');
      if (!success) throw new Error('订单批量确认失败');
    });

    await this.runTestCase('CRM-016: 客户高级搜索', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("高级搜索")', '高级搜索');
      await this.simulateWait(500);
      
      await this.simulateSelect('select[name="type"]', 'ENTERPRISE', '客户类型');
      await this.simulateSelect('select[name="level"]', 'A', '客户等级');
      await this.simulateClick('button:has-text("搜索")', '搜索');
      await this.simulateWait(2000);
      
      const hasResults = await this.page.isVisible('table');
      if (!hasResults) throw new Error('客户高级搜索失败');
    });
  }

  /**
   * ERP P1 测试 (4 个用例)
   */
  async testERPP1() {
    console.log('\n🏭 补充 ERP P1 测试...');
    
    await this.runTestCase('ERP-021: 生产订单批量删除', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/production`);
      await this.simulateWait(1000);
      
      await this.simulateClick('input[type="checkbox"]', '选择订单');
      await this.simulateClick('button:has-text("批量删除")', '批量删除');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=删除成功');
      if (!success) throw new Error('生产订单批量删除失败');
    });

    await this.runTestCase('ERP-022: 采购订单导出', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/purchase`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("导出")', '导出采购单');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=导出成功');
      if (!success) throw new Error('采购订单导出失败');
    });

    await this.runTestCase('ERP-023: 库存预警设置', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/inventory`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("预警设置")', '预警设置');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="minStock"]', '50', '最低库存');
      await this.simulateType('input[name="maxStock"]', '500', '最高库存');
      await this.simulateClick('button:has-text("保存")', '保存');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=保存成功');
      if (!success) throw new Error('库存预警设置失败');
    });

    await this.runTestCase('ERP-024: 库存报表', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/inventory`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("报表")', '库存报表');
      await this.simulateWait(2000);
      
      const hasReport = await this.page.isVisible('[class*="report"]');
      if (!hasReport) throw new Error('库存报表显示失败');
    });
  }

  /**
   * 财务 P1 测试 (4 个用例)
   */
  async testFinanceP1() {
    console.log('\n💰 补充财务 P1 测试...');
    
    await this.runTestCase('FIN-008: 费用审批', async () => {
      await this.page.goto(`${this.baseUrl}/portal/finance/expenses`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("审批")', '费用审批');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("通过")', '审批通过');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=审批通过');
      if (!success) throw new Error('费用审批失败');
    });

    await this.runTestCase('FIN-009: 财务报表导出', async () => {
      await this.page.goto(`${this.baseUrl}/portal/finance/statistics`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("导出")', '导出报表');
      await this.simulateSelect('select[name="format"]', 'PDF', 'PDF 格式');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=导出成功');
      if (!success) throw new Error('财务报表导出失败');
    });

    await this.runTestCase('FIN-010: 应收账龄分析', async () => {
      await this.page.goto(`${this.baseUrl}/portal/finance/receivables`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("账龄分析")', '账龄分析');
      await this.simulateWait(2000);
      
      const hasChart = await this.page.isVisible('[class*="chart"]');
      if (!hasChart) throw new Error('应收账龄分析显示失败');
    });

    await this.runTestCase('FIN-011: 应付账龄分析', async () => {
      await this.page.goto(`${this.baseUrl}/portal/finance/payables`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("账龄分析")', '账龄分析');
      await this.simulateWait(2000);
      
      const hasChart = await this.page.isVisible('[class*="chart"]');
      if (!hasChart) throw new Error('应付账龄分析显示失败');
    });
  }

  /**
   * HR P1 测试 (4 个用例)
   */
  async testHRP1() {
    console.log('\n👥 补充 HR P1 测试...');
    
    await this.runTestCase('HR-008: 员工批量导入', async () => {
      await this.page.goto(`${this.baseUrl}/portal/hr/employees`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("导入")', '导入员工');
      await this.simulateWait(500);
      
      const hasUpload = await this.page.isVisible('input[type="file"]');
      if (!hasUpload) throw new Error('员工批量导入对话框显示失败');
    });

    await this.runTestCase('HR-009: 考勤导出', async () => {
      await this.page.goto(`${this.baseUrl}/portal/hr/attendance`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("导出")', '导出考勤');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=导出成功');
      if (!success) throw new Error('考勤导出失败');
    });

    await this.runTestCase('HR-010: 绩效考核', async () => {
      await this.page.goto(`${this.baseUrl}/portal/hr/performance`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("评分")', '绩效评分');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="score"]', '90', '评分');
      await this.simulateClick('button:has-text("提交")', '提交');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=提交成功');
      if (!success) throw new Error('绩效考核失败');
    });

    await this.runTestCase('HR-011: 薪酬计算', async () => {
      await this.page.goto(`${this.baseUrl}/portal/hr/salary`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("计算")', '薪酬计算');
      await this.simulateWait(2000);
      
      const hasResult = await this.page.isVisible('[class*="salary-result"]');
      if (!hasResult) throw new Error('薪酬计算失败');
    });
  }

  /**
   * CMS P1 测试 (4 个用例)
   */
  async testCMSP1() {
    console.log('\n📰 补充 CMS P1 测试...');
    
    await this.runTestCase('CMS-006: 新闻发布', async () => {
      await this.page.goto(`${this.baseUrl}/portal/cms/news`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("发布")', '发布新闻');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=发布成功');
      if (!success) throw new Error('新闻发布失败');
    });

    await this.runTestCase('CMS-007: 新闻下架', async () => {
      await this.page.goto(`${this.baseUrl}/portal/cms/news`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("下架")', '下架新闻');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=下架成功');
      if (!success) throw new Error('新闻下架失败');
    });

    await this.runTestCase('CMS-008: 案例推荐', async () => {
      await this.page.goto(`${this.baseUrl}/portal/cms/cases`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("推荐")', '推荐案例');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=推荐成功');
      if (!success) throw new Error('案例推荐失败');
    });

    await this.runTestCase('CMS-009: 页面预览', async () => {
      await this.page.goto(`${this.baseUrl}/portal/cms/pages`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("预览")', '页面预览');
      await this.simulateWait(2000);
      
      const hasPreview = await this.page.isVisible('[class*="preview"]');
      if (!hasPreview) throw new Error('页面预览失败');
    });
  }

  /**
   * 工作流 P1 测试 (2 个用例)
   */
  async testWorkflowP1() {
    console.log('\n🔄 补充工作流 P1 测试...');
    
    await this.runTestCase('WF-004: 审批转交', async () => {
      await this.page.goto(`${this.baseUrl}/portal/workflow/approvals`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("转交")', '审批转交');
      await this.simulateWait(500);
      
      await this.simulateSelect('select[name="assignee"]', 'user2', '转交给');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=转交成功');
      if (!success) throw new Error('审批转交失败');
    });

    await this.runTestCase('WF-005: 审批加签', async () => {
      await this.page.goto(`${this.baseUrl}/portal/workflow/approvals`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("加签")', '审批加签');
      await this.simulateWait(500);
      
      await this.simulateSelect('select[name="approver"]', 'user3', '加签人');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=加签成功');
      if (!success) throw new Error('审批加签失败');
    });
  }

  /**
   * 运行所有 P1 测试
   */
  async runP1Tests() {
    console.log('\n🚀 开始运行 P1 级重要功能测试...\n');
    
    await this.testCRMP1();
    await this.testERPP1();
    await this.testFinanceP1();
    await this.testHRP1();
    await this.testCMSP1();
    await this.testWorkflowP1();
    
    console.log('\n✅ P1 级重要功能测试完成！');
  }
}
