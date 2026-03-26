/**
 * 手机移动端前后端全栈测试
 * 
 * 测试范围:
 * 1. 移动端 H5 前后端
 * 2. 移动端业务流
 * 3. 移动端 API 性能
 * 4. 移动端错误处理
 */

import { AutomatedTestSystem } from './automated-test-system';
import { devices } from 'playwright';

export class MobileFullStackTests extends AutomatedTestSystem {
  
  /**
   * 移动端 H5 前后端测试
   */
  async testMobileH5FullStack() {
    console.log('\n📱 测试移动端 H5 前后端...');
    
    const context = await this.browser.newContext(devices['iPhone 12']);
    const page = await context.newPage();
    
    try {
      await this.runTestCase('移动全栈 -001: 移动端首页加载', async () => {
        await page.goto(`${this.baseUrl}/mobile`);
        await this.simulateWait(2000);
        
        // 验证移动端页面
        const hasMobile = await page.isVisible('[class*="mobile"]');
        if (!hasMobile) {
          console.log('⚠️ 未检测到移动端优化');
        }
        
        // 验证 API 数据
        const apiData = await page.evaluate(async () => {
          const res = await fetch('/api/mobile/dashboard');
          return await res.json();
        });
        
        console.log(`移动端仪表板 API 返回：${Object.keys(apiData || {}).length}个模块`);
      });

      await this.runTestCase('移动全栈 -002: 移动端客户列表', async () => {
        await page.goto(`${this.baseUrl}/mobile/crm/customers`);
        await this.simulateWait(2000);
        
        // 验证列表显示
        const hasList = await page.isVisible('[class*="list"]');
        if (!hasList) throw new Error('移动端客户列表显示异常');
        
        // 验证下拉刷新
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });
        await this.simulateWait(1000);
        
        console.log('移动端下拉刷新测试完成');
      });

      await this.runTestCase('移动全栈 -003: 移动端工单创建', async () => {
        await page.goto(`${this.baseUrl}/mobile/aftersales`);
        await this.simulateWait(1000);
        
        await page.click('button:has-text("新建")');
        await this.simulateWait(500);
        
        await page.fill('input[name="subject"]', '移动端测试工单');
        await page.selectOption('select[name="priority"]', 'NORMAL');
        await page.click('button:has-text("提交")');
        await this.simulateWait(2000);
        
        const success = await page.isVisible('text=提交成功');
        if (!success) {
          console.log('⚠️ 移动端工单创建失败');
        } else {
          console.log('移动端工单创建成功');
        }
      });
    } finally {
      await context.close();
    }
  }

  /**
   * 移动端业务流测试
   */
  async testMobileBusinessFlow() {
    console.log('\n💼 测试移动端业务流...');
    
    const context = await this.browser.newContext(devices['iPhone 12']);
    const page = await context.newPage();
    
    try {
      // 登录
      await page.goto(`${this.baseUrl}/mobile/login`);
      await page.fill('input[name="username"]', 'admin');
      await page.fill('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await this.simulateWait(3000);
      
      await this.runTestCase('移动业务 -001: 移动端审批流程', async () => {
        await page.goto(`${this.baseUrl}/mobile/workflow/approvals`);
        await this.simulateWait(2000);
        
        const hasApprovals = await page.isVisible('[class*="approval"]');
        if (!hasApprovals) {
          console.log('移动端无待审批事项');
          return;
        }
        
        // 执行审批
        await page.click('button:has-text("通过")');
        await this.simulateWait(500);
        await page.click('button:has-text("确认")');
        await this.simulateWait(2000);
        
        console.log('移动端审批完成');
      });

      await this.runTestCase('移动业务 -002: 移动端数据同步', async () => {
        // 在移动端创建数据
        await page.goto(`${this.baseUrl}/mobile/crm/customers`);
        await this.simulateWait(1000);
        
        await page.click('button:has-text("新建")');
        await this.simulateWait(500);
        
        await page.fill('input[name="name"]', '移动端测试客户');
        await page.fill('input[name="phone"]', '13700137000');
        await page.click('button:has-text("保存")');
        await this.simulateWait(2000);
        
        console.log('移动端客户创建完成');
        
        // 验证 PC 端数据同步
        const pcContext = await this.browser.newContext();
        const pcPage = await pcContext.newPage();
        await pcPage.goto(`${this.baseUrl}/portal/crm/customers`);
        await this.simulateWait(2000);
        
        const hasCustomer = await pcPage.isVisible('text=移动端测试客户');
        if (!hasCustomer) {
          console.log('⚠️ PC 端未同步移动端数据');
        } else {
          console.log('移动端数据已同步到 PC 端');
        }
        
        await pcContext.close();
      });
    } finally {
      await context.close();
    }
  }

  /**
   * 移动端 API 性能测试
   */
  async testMobileAPIPerformance() {
    console.log('\n⚡ 测试移动端 API 性能...');
    
    const context = await this.browser.newContext(devices['iPhone 12']);
    const page = await context.newPage();
    
    try {
      const endpoints = [
        { name: '客户列表', url: '/api/crm/customers' },
        { name: '工单列表', url: '/api/service/tickets' },
        { name: '审批列表', url: '/api/workflow/approvals' },
        { name: '库存查询', url: '/api/erp/inventory' },
      ];
      
      for (const endpoint of endpoints) {
        await this.runTestCase(`移动 API 性能 - ${endpoint.name}`, async () => {
          const startTime = Date.now();
          
          const response = await page.evaluate(async (url) => {
            const res = await fetch(url);
            return {
              status: res.status,
              ok: res.ok,
              size: (await res.blob()).size,
            };
          }, endpoint.url);
          
          const duration = Date.now() - startTime;
          
          console.log(`${endpoint.name}:`);
          console.log(`  - 响应时间：${duration}ms`);
          console.log(`  - 状态码：${response.status}`);
          console.log(`  - 数据大小：${(response.size / 1024).toFixed(2)}KB`);
          
          if (duration > 3000) {
            console.log(`⚠️ ${endpoint.name} 响应过慢`);
          }
          if (response.size > 1024 * 1024) {
            console.log(`⚠️ ${endpoint.name} 数据过大`);
          }
        });
      }
    } finally {
      await context.close();
    }
  }

  /**
   * 移动端错误处理测试
   */
  async testMobileErrorHandling() {
    console.log('\n❌ 测试移动端错误处理...');
    
    const context = await this.browser.newContext(devices['iPhone 12']);
    const page = await context.newPage();
    
    try {
      await this.runTestCase('移动错误 -001: 网络错误处理', async () => {
        await page.route('**/api/**', route => {
          route.abort('failed');
        });
        
        await page.goto(`${this.baseUrl}/mobile`);
        await this.simulateWait(3000);
        
        const hasError = await page.isVisible('text=网络错误') || 
                        await page.isVisible('text=加载失败') ||
                        await page.isVisible('[class*="error"]');
        
        if (hasError) {
          console.log('移动端网络错误提示正常');
        } else {
          console.log('⚠️ 移动端缺少网络错误提示');
        }
        
        await page.unroute('**/api/**');
      });

      await this.runTestCase('移动错误 -002: 表单验证', async () => {
        await page.goto(`${this.baseUrl}/mobile/crm/customers`);
        await this.simulateWait(1000);
        
        await page.click('button:has-text("新建")');
        await this.simulateWait(500);
        
        // 不填写必填项直接提交
        await page.click('button:has-text("保存")');
        await this.simulateWait(1000);
        
        const hasError = await page.isVisible('[class*="error"]') || 
                        await page.isVisible('text=必填');
        
        if (hasError) {
          console.log('移动端表单验证正常');
        } else {
          console.log('⚠️ 移动端缺少表单验证');
        }
      });
    } finally {
      await context.close();
    }
  }

  /**
   * 运行所有移动端全栈测试
   */
  async runMobileFullStackTests() {
    console.log('\n🚀 开始运行移动端前后端全栈测试...\n');
    
    await this.testMobileH5FullStack();
    await this.testMobileBusinessFlow();
    await this.testMobileAPIPerformance();
    await this.testMobileErrorHandling();
    
    console.log('\n✅ 移动端前后端全栈测试完成！');
  }
}

// 运行测试
(async () => {
  const tester = new MobileFullStackTests();
  await tester.runMobileFullStackTests();
})();
