/**
 * 第 3 个失败用例修复 - HR-006 员工转正
 * 
 * 问题：转正按钮未显示
 * 原因：该员工已过试用期
 * 修复：使用试用期内的员工测试
 */

import { AutomatedTestSystem } from './automated-test-system';

export class HR006Fix extends AutomatedTestSystem {
  
  /**
   * 修复 HR-006: 员工转正
   */
  async testHR006Fixed() {
    console.log('\n🔧 修复 HR-006: 员工转正...');
    
    await this.runTestCase('HR-006-FIXED: 员工转正 (试用期员工)', async () => {
      await this.page.goto(`${this.baseUrl}/portal/hr/employees`);
      await this.simulateWait(1000);
      
      // 查找试用期内的员工
      const employeeRows = await this.page.$$('table tbody tr');
      if (employeeRows.length === 0) {
        throw new Error('员工列表为空');
      }
      
      // 遍历员工行，找到试用期内的员工
      let targetEmployeeIndex = -1;
      for (let i = 0; i < employeeRows.length; i++) {
        const status = await employeeRows[i].$eval('td:last-child', el => el.textContent);
        if (status && status.includes('试用')) {
          targetEmployeeIndex = i;
          break;
        }
      }
      
      if (targetEmployeeIndex === -1) {
        // 如果没有试用期员工，创建一个
        console.log('未找到试用期员工，创建测试员工...');
        await this.simulateClick('button:has-text("新建")', '新建员工');
        await this.simulateWait(500);
        
        await this.simulateType('input[name="name"]', '试用员工', '姓名');
        await this.simulateType('input[name="email"]', 'trial@test.com', '邮箱');
        await this.simulateSelect('select[name="status"]', 'TRIAL', '员工状态');
        
        await this.simulateClick('button:has-text("保存")', '保存');
        await this.simulateWait(2000);
        
        targetEmployeeIndex = 0;
      }
      
      // 找到目标员工的转正按钮
      const targetRow = employeeRows[targetEmployeeIndex];
      const trialButton = await targetRow.$('button:has-text("转正")');
      
      if (!trialButton) {
        throw new Error('未找到转正按钮');
      }
      
      // 点击转正
      await trialButton.click();
      await this.simulateWait(500);
      
      // 填写转正日期
      const today = new Date().toISOString().split('T')[0];
      await this.simulateType('input[name="reviewDate"]', today, '转正日期');
      
      // 确认转正
      const confirmButton = await this.page.$('button:has-text("确认")');
      if (confirmButton) {
        await confirmButton.click();
        await this.simulateWait(2000);
        
        // 验证转正成功
        const success = await this.page.isVisible('text=转正成功');
        if (!success) throw new Error('员工转正失败');
      } else {
        throw new Error('未找到确认按钮');
      }
    });
  }

  /**
   * 运行修复测试
   */
  async runFixTest() {
    console.log('\n🚀 开始运行 HR-006 修复测试...\n');
    await this.testHR006Fixed();
    console.log('\n✅ HR-006 修复完成！');
  }
}

// 运行修复
(async () => {
  const fixer = new HR006Fix();
  await fixer.runFixTest();
})();
