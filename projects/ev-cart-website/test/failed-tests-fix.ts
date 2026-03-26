/**
 * 失败用例修复补丁
 * 
 * 修复的测试用例 (3 个):
 * 1. ERP-012: 生产订单删除 - 权限问题
 * 2. HR-006: 员工转正 - 试用期问题
 * 3. ADM-004: 用户禁用 - 不能禁用当前用户
 */

import { AutomatedTestSystem } from './automated-test-system';
import { HR006Fix } from './hr006-fix';

export class FailedTestsFix extends AutomatedTestSystem {
  
  /**
   * 修复 ERP-012: 生产订单删除
   * 
   * 问题：删除按钮未找到
   * 原因：权限不足，需要管理员角色
   * 修复：使用管理员账号重新测试
   */
  async testERP012Fixed() {
    console.log('\n🔧 修复 ERP-012: 生产订单删除...');
    
    await this.runTestCase('ERP-012-FIXED: 生产订单删除 (管理员权限)', async () => {
      // 先登出
      await this.page.goto(`${this.baseUrl}/portal`);
      await this.simulateWait(500);
      
      // 点击退出登录
      await this.simulateClick('text=退出登录', '退出登录');
      await this.simulateWait(2000);
      
      // 使用管理员账号重新登录
      await this.page.goto(`${this.baseUrl}/login`);
      await this.simulateType('input[name="username"]', 'admin', '用户名');
      await this.simulateType('input[name="password"]', 'admin123', '密码');
      await this.simulateClick('button[type="submit"]', '登录');
      await this.simulateWait(3000);
      
      // 验证登录成功
      const isLoginPage = this.page.url().includes('/login');
      if (isLoginPage) throw new Error('管理员登录失败');
      
      // 导航到生产管理
      await this.page.goto(`${this.baseUrl}/portal/erp/production`);
      await this.simulateWait(1000);
      
      // 查找删除按钮（可能有多个，选择第一个有权限的）
      const deleteButtons = await this.page.$$('button:has-text("删除")');
      if (deleteButtons.length === 0) {
        throw new Error('未找到删除按钮');
      }
      
      // 点击第一个删除按钮
      await deleteButtons[0].click();
      await this.simulateWait(500);
      
      // 确认删除
      const confirmButton = await this.page.$('button:has-text("确认")');
      if (confirmButton) {
        await confirmButton.click();
        await this.simulateWait(2000);
        
        // 验证删除成功
        const success = await this.page.isVisible('text=删除成功');
        if (!success) throw new Error('生产订单删除失败');
      } else {
        throw new Error('未找到确认按钮');
      }
    });
  }

  /**
   * 修复 ADM-004: 用户禁用
   * 
   * 问题：禁用操作失败
   * 原因：不能禁用当前登录用户
   * 修复：选择其他用户进行禁用测试
   */
  async testADM004Fixed() {
    console.log('\n🔧 修复 ADM-004: 用户禁用...');
    
    await this.runTestCase('ADM-004-FIXED: 用户禁用 (非当前用户)', async () => {
      await this.page.goto(`${this.baseUrl}/portal/admin/users`);
      await this.simulateWait(1000);
      
      // 查找用户列表，排除当前登录用户 (admin)
      const userRows = await this.page.$$('table tbody tr');
      if (userRows.length === 0) {
        throw new Error('用户列表为空');
      }
      
      // 遍历用户行，找到非 admin 用户
      let targetUserIndex = -1;
      for (let i = 0; i < userRows.length; i++) {
        const username = await userRows[i].$eval('td:first-child', el => el.textContent);
        if (username && !username.includes('admin')) {
          targetUserIndex = i;
          break;
        }
      }
      
      if (targetUserIndex === -1) {
        // 如果没有其他用户，创建一个测试用户
        console.log('未找到其他用户，创建测试用户...');
        await this.simulateClick('button:has-text("新建")', '新建用户');
        await this.simulateWait(500);
        
        await this.simulateType('input[name="username"]', 'testuser', '用户名');
        await this.simulateType('input[name="password"]', 'Test123456', '密码');
        await this.simulateType('input[name="email"]', 'test@test.com', '邮箱');
        await this.simulateType('input[name="name"]', '测试用户', '姓名');
        
        await this.simulateClick('button:has-text("保存")', '保存');
        await this.simulateWait(2000);
        
        targetUserIndex = 0;
      }
      
      // 找到目标用户的禁用按钮
      const targetRow = userRows[targetUserIndex];
      const disableButton = await targetRow.$('button:has-text("禁用")');
      
      if (!disableButton) {
        throw new Error('未找到禁用按钮');
      }
      
      // 点击禁用
      await disableButton.click();
      await this.simulateWait(500);
      
      // 确认禁用
      const confirmButton = await this.page.$('button:has-text("确认")');
      if (confirmButton) {
        await confirmButton.click();
        await this.simulateWait(2000);
        
        // 验证禁用成功
        const success = await this.page.isVisible('text=禁用成功');
        if (!success) throw new Error('用户禁用失败');
      } else {
        throw new Error('未找到确认按钮');
      }
    });
  }

  /**
   * 运行所有修复测试
   */
  async runFixTests() {
    console.log('\n🚀 开始运行修复测试...\n');
    
    await this.testERP012Fixed();
    await this.testADM004Fixed();
    
    // 运行 HR-006 修复
    const hrFixer = new HR006Fix();
    await hrFixer.testHR006Fixed();
    
    console.log('\n✅ 所有修复测试完成！');
  }
}

// 运行修复
(async () => {
  const fixer = new FailedTestsFix();
  await fixer.runFixTests();
})();
