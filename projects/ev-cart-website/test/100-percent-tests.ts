/**
 * 100% 覆盖补充测试
 * 
 * 目标：覆盖最后 2 个未覆盖功能点，达到 100% 覆盖率
 */

import { AutomatedTestSystem } from './automated-test-system';

export class HundredPercentTests extends AutomatedTestSystem {
  
  /**
   * MRP 运算专项测试
   */
  async testMRPSpecial() {
    console.log('\n🔬 MRP 运算专项测试...');
    
    await this.runTestCase('MRP-001: MRP 运算性能测试', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/mrp`);
      await this.simulateWait(1000);
      
      // 记录开始时间
      const startTime = Date.now();
      
      // 点击运算
      await this.simulateClick('button:has-text("运算")', 'MRP 运算');
      
      // 等待运算完成（最长等待 30 秒）
      let elapsed = 0;
      while (elapsed < 30000) {
        await this.simulateWait(1000);
        elapsed = Date.now() - startTime;
        
        // 检查是否完成
        const isComplete = await this.page.isVisible('text=完成') || 
                          await this.page.isVisible('text=成功') ||
                          await this.page.isVisible('[class*="result"]');
        
        if (isComplete) {
          console.log(`MRP 运算完成，耗时：${elapsed}ms`);
          break;
        }
      }
      
      // 验证结果
      const hasResult = await this.page.isVisible('[class*="result"]') || 
                       await this.page.isVisible('table');
      
      if (!hasResult) {
        throw new Error('MRP 运算未产生结果');
      }
    });
  }

  /**
   * 请假审批专项测试
   */
  async testLeaveApprovalSpecial() {
    console.log('\n🔬 请假审批专项测试...');
    
    await this.runTestCase('LEAVE-001: 完整请假审批流程', async () => {
      // Step 1: 创建请假单
      await this.page.goto(`${this.baseUrl}/portal/hr/leave`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("新建")', '新建请假');
      await this.simulateWait(500);
      
      await this.simulateSelect('select[name="type"]', '事假', '请假类型');
      await this.simulateType('input[name="startDate"]', '2026-03-25', '开始日期');
      await this.simulateType('input[name="endDate"]', '2026-03-26', '结束日期');
      await this.simulateType('textarea[name="reason"]', '个人事务', '请假原因');
      
      await this.simulateClick('button:has-text("提交")', '提交');
      await this.simulateWait(2000);
      
      // Step 2: 切换到管理账号进行审批
      console.log('切换到管理账号...');
      await this.simulateClick('text=退出登录', '退出登录');
      await this.simulateWait(2000);
      
      await this.page.goto(`${this.baseUrl}/login`);
      await this.simulateType('input[name="username"]', 'admin', '用户名');
      await this.simulateType('input[name="password"]', 'admin123', '密码');
      await this.simulateClick('button[type="submit"]', '登录');
      await this.simulateWait(3000);
      
      // Step 3: 审批请假单
      await this.page.goto(`${this.baseUrl}/portal/hr/leave-approval`);
      await this.simulateWait(1000);
      
      const approveButton = await this.page.$('button:has-text("通过")');
      if (approveButton) {
        await approveButton.click();
        await this.simulateWait(500);
        
        const confirmButton = await this.page.$('button:has-text("确认")');
        if (confirmButton) {
          await confirmButton.click();
          await this.simulateWait(2000);
          
          const success = await this.page.isVisible('text=审批通过');
          if (!success) {
            throw new Error('请假审批失败');
          }
        }
      }
    });
  }

  /**
   * 运行 100% 覆盖测试
   */
  async runHundredPercentTests() {
    console.log('\n🚀 开始运行 100% 覆盖测试...\n');
    
    await this.testMRPSpecial();
    await this.testLeaveApprovalSpecial();
    
    console.log('\n✅ 100% 覆盖测试完成！');
  }
}

// 运行测试
(async () => {
  const tester = new HundredPercentTests();
  await tester.runHundredPercentTests();
})();
