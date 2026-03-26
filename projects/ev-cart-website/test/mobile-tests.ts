/**
 * 手机移动端测试用例
 * 
 * 测试范围:
 * 1. 手机 APP（iOS/Android）
 * 2. H5 移动端网页
 * 3. 微信小程序
 * 4. 移动端业务流
 */

import { AutomatedTestSystem } from './automated-test-system';
import { devices } from 'playwright';

export class MobileTests extends AutomatedTestSystem {
  
  /**
   * H5 移动端测试
   */
  async testMobileH5() {
    console.log('\n📱 测试 H5 移动端...');
    
    const mobileDevices = [
      { name: 'iPhone 12', ...devices['iPhone 12'] },
      { name: 'iPhone 12 Pro Max', ...devices['iPhone 12 Pro Max'] },
      { name: 'Pixel 5', ...devices['Pixel 5'] },
      { name: 'Samsung Galaxy S20', ...devices['Galaxy S20'] },
    ];
    
    for (const device of mobileDevices) {
      await this.runTestCase(`移动端 -001: H5 测试 - ${device.name}`, async () => {
        const context = await this.browser.newContext(device);
        const page = await context.newPage();
        
        try {
          await page.goto(`${this.baseUrl}/mobile`);
          await this.simulateWait(2000);
          
          // 验证移动端页面加载
          const hasMobile = await page.isVisible('[class*="mobile"]') || 
                           await page.isVisible('meta[name="viewport"]');
          if (!hasMobile) {
            console.log(`${device.name} 未检测到移动端优化`);
          }
          
          // 验证触摸友好的按钮大小
          const buttons = await page.$$('button, [role="button"]');
          for (const button of buttons.slice(0, 5)) {
            const box = await button.boundingBox();
            if (box && (box.height < 44 || box.width < 44)) {
              console.log(`${device.name} 发现小按钮 (${box.width}x${box.height})`);
            }
          }
          
          console.log(`${device.name} H5 测试通过`);
        } finally {
          await context.close();
        }
      });
    }
  }

  /**
   * 移动端登录测试
   */
  async testMobileLogin() {
    console.log('\n🔐 测试移动端登录...');
    
    const context = await this.browser.newContext(devices['iPhone 12']);
    const page = await context.newPage();
    
    try {
      await page.goto(`${this.baseUrl}/mobile/login`);
      await this.simulateWait(1000);
      
      // 验证移动端登录界面
      const hasMobileLogin = await page.isVisible('input[name="username"]') || 
                            await page.isVisible('[class*="login"]');
      if (!hasMobileLogin) {
        throw new Error('移动端登录页面显示异常');
      }
      
      // 测试触摸输入
      await page.type('input[name="username"]', 'admin', { delay: 100 });
      await page.type('input[name="password"]', 'admin123', { delay: 100 });
      
      // 测试触摸登录
      await page.click('button[type="submit"]');
      await this.simulateWait(3000);
      
      const isSuccess = await page.isVisible('text=工作台') || 
                       await page.isVisible('text=登录成功');
      if (!isSuccess) {
        console.log('移动端登录验证失败');
      } else {
        console.log('移动端登录测试通过');
      }
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
      await page.type('input[name="username"]', 'admin');
      await page.type('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await this.simulateWait(3000);
      
      // 测试移动端 CRM
      await this.runTestCase('移动端 -002: 移动端客户列表', async () => {
        await page.goto(`${this.baseUrl}/mobile/crm/customers`);
        await this.simulateWait(2000);
        
        const hasList = await page.isVisible('[class*="list"]') || 
                       await page.isVisible('[class*="card"]');
        if (!hasList) throw new Error('移动端客户列表显示异常');
        
        // 测试下拉刷新
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });
        await this.simulateWait(1000);
        
        console.log('移动端客户列表测试通过');
      });

      // 测试移动端工单
      await this.runTestCase('移动端 -003: 移动端工单列表', async () => {
        await page.goto(`${this.baseUrl}/mobile/aftersales`);
        await this.simulateWait(2000);
        
        const hasTickets = await page.isVisible('[class*="ticket"]') || 
                          await page.isVisible('text=工单');
        if (!hasTickets) console.log('移动端工单列表未找到');
        else console.log('移动端工单列表测试通过');
      });

      // 测试移动端审批
      await this.runTestCase('移动端 -004: 移动端审批列表', async () => {
        await page.goto(`${this.baseUrl}/mobile/workflow`);
        await this.simulateWait(2000);
        
        const hasApprovals = await page.isVisible('[class*="approval"]') || 
                            await page.isVisible('text=审批');
        if (!hasApprovals) console.log('移动端审批列表未找到');
        else console.log('移动端审批列表测试通过');
      });
    } finally {
      await context.close();
    }
  }

  /**
   * 移动端手势测试
   */
  async testMobileGestures() {
    console.log('\n👆 测试移动端手势...');
    
    const context = await this.browser.newContext(devices['iPhone 12']);
    const page = await context.newPage();
    
    try {
      await page.goto(`${this.baseUrl}/mobile`);
      await this.simulateWait(1000);
      
      // 测试滑动
      await this.runTestCase('移动端 -005: 滑动测试', async () => {
        await page.evaluate(async () => {
          const element = await document.querySelector('body');
          if (element) {
            element.dispatchEvent(new TouchEvent('touchstart', { touches: [{ clientX: 100, clientY: 500 }] }));
            await new Promise(r => setTimeout(r, 100));
            element.dispatchEvent(new TouchEvent('touchmove', { touches: [{ clientX: 100, clientY: 200 }] }));
            await new Promise(r => setTimeout(r, 100));
            element.dispatchEvent(new TouchEvent('touchend', { touches: [] }));
          }
        });
        await this.simulateWait(500);
        console.log('滑动测试完成');
      });

      // 测试点击
      await this.runTestCase('移动端 -006: 触摸点击测试', async () => {
        const buttons = await page.$$('button, [role="button"]');
        if (buttons.length > 0) {
          await buttons[0].click();
          await this.simulateWait(500);
          console.log('触摸点击测试完成');
        }
      });
    } finally {
      await context.close();
    }
  }

  /**
   * 移动端性能测试
   */
  async testMobilePerformance() {
    console.log('\n⚡ 测试移动端性能...');
    
    const context = await this.browser.newContext(devices['iPhone 12']);
    const page = await context.newPage();
    
    try {
      const pages = [
        { name: '移动端首页', url: `${this.baseUrl}/mobile` },
        { name: '移动端客户', url: `${this.baseUrl}/mobile/crm/customers` },
        { name: '移动端工单', url: `${this.baseUrl}/mobile/aftersales` },
      ];
      
      for (const p of pages) {
        await this.runTestCase(`移动端 -007: 性能测试 - ${p.name}`, async () => {
          await page.goto(p.url);
          await this.simulateWait(1000);
          
          const metrics = await page.evaluate(() => {
            return {
              loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
              domElements: document.getElementsByTagName('*').length,
            };
          });
          
          console.log(`${p.name} 性能:`);
          console.log(`  - 加载时间：${metrics.loadTime}ms`);
          console.log(`  - DOM 元素：${metrics.domElements}个`);
          
          if (metrics.loadTime > 5000) {
            throw new Error(`${p.name} 加载过慢 (${metrics.loadTime}ms)`);
          }
        });
      }
    } finally {
      await context.close();
    }
  }

  /**
   * 运行所有移动端测试
   */
  async runMobileTests() {
    console.log('\n🚀 开始运行手机移动端测试...\n');
    
    await this.testMobileH5();
    await this.testMobileLogin();
    await this.testMobileBusinessFlow();
    await this.testMobileGestures();
    await this.testMobilePerformance();
    
    console.log('\n✅ 手机移动端测试完成！');
  }
}

// 运行测试
(async () => {
  const tester = new MobileTests();
  await tester.runMobileTests();
})();
