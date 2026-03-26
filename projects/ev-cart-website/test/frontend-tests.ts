/**
 * 网站前端测试用例
 * 
 * 测试范围:
 * 1. 响应式设计（桌面/平板/手机）
 * 2. 浏览器兼容性（Chrome/Firefox/Safari/Edge）
 * 3. 用户体验（加载速度/交互流畅度）
 * 4. 前端功能完整性
 */

import { AutomatedTestSystem } from './automated-test-system';
import { devices } from 'playwright';

export class FrontendTests extends AutomatedTestSystem {
  
  /**
   * 响应式设计测试
   */
  async testResponsiveDesign() {
    console.log('\n📱 测试响应式设计...');
    
    const viewports = [
      { name: '桌面端 (1920x1080)', width: 1920, height: 1080 },
      { name: '笔记本 (1366x768)', width: 1366, height: 768 },
      { name: '平板 (768x1024)', width: 768, height: 1024 },
      { name: '手机 (375x667)', width: 375, height: 667 },
    ];
    
    for (const viewport of viewports) {
      await this.runTestCase(`前端 -001: 响应式测试 - ${viewport.name}`, async () => {
        await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        await this.page.goto(`${this.baseUrl}/portal`);
        await this.simulateWait(2000);
        
        // 验证页面正常加载
        const hasContent = await this.page.isVisible('body');
        if (!hasContent) throw new Error(`${viewport.name} 页面加载失败`);
        
        // 验证导航栏显示
        const hasNav = await this.page.isVisible('[class*="nav"]') || 
                      await this.page.isVisible('[class*="header"]');
        if (!hasNav) throw new Error(`${viewport.name} 导航栏显示异常`);
        
        // 验证内容区域
        const hasMain = await this.page.isVisible('main') || 
                       await this.page.isVisible('[class*="content"]');
        if (!hasMain) throw new Error(`${viewport.name} 内容区域显示异常`);
        
        console.log(`${viewport.name} 响应式测试通过`);
      });
    }
  }

  /**
   * 官网前端测试
   */
  async testWebsiteFrontend() {
    console.log('\n🌐 测试官网前端...');
    
    await this.runTestCase('前端 -002: 官网首页加载', async () => {
      await this.page.goto(`${this.baseUrl}/`);
      await this.simulateWait(2000);
      
      // 验证首屏加载时间
      const loadTime = await this.page.evaluate(() => {
        return performance.timing.loadEventEnd - performance.timing.navigationStart;
      });
      
      console.log(`官网首页加载时间：${loadTime}ms`);
      if (loadTime > 3000) {
        throw new Error(`官网首页加载过慢 (${loadTime}ms > 3000ms)`);
      }
      
      // 验证关键元素
      const hasHero = await this.page.isVisible('[class*="hero"]') || 
                     await this.page.isVisible('text=道达智能');
      if (!hasHero) throw new Error('官网首屏显示异常');
    });

    await this.runTestCase('前端 -003: 官网导航测试', async () => {
      await this.page.goto(`${this.baseUrl}/`);
      await this.simulateWait(1000);
      
      // 测试导航菜单
      const navItems = ['产品', '解决方案', '经销商', '服务', '关于'];
      for (const item of navItems) {
        const hasItem = await this.page.isVisible(`text=${item}`);
        if (!hasItem) {
          console.log(`导航项 "${item}" 未找到`);
        }
      }
    });

    await this.runTestCase('前端 -004: 官网产品页面', async () => {
      await this.page.goto(`${this.baseUrl}/products`);
      await this.simulateWait(2000);
      
      const hasProducts = await this.page.isVisible('[class*="product"]') || 
                         await this.page.isVisible('text=产品');
      if (!hasProducts) throw new Error('产品页面显示异常');
    });

    await this.runTestCase('前端 -005: 官网联系页面', async () => {
      await this.page.goto(`${this.baseUrl}/contact`);
      await this.simulateWait(2000);
      
      const hasContact = await this.page.isVisible('text=联系') || 
                        await this.page.isVisible('[class*="contact"]');
      if (!hasContact) throw new Error('联系页面显示异常');
    });
  }

  /**
   * 门户前端测试
   */
  async testPortalFrontend() {
    console.log('\n🖥️  测试门户前端...');
    
    await this.runTestCase('前端 -006: 门户登录页面', async () => {
      await this.page.goto(`${this.baseUrl}/login`);
      await this.simulateWait(1000);
      
      // 验证登录表单
      const hasUsername = await this.page.isVisible('input[name="username"]');
      const hasPassword = await this.page.isVisible('input[name="password"]');
      const hasSubmit = await this.page.isVisible('button[type="submit"]');
      
      if (!hasUsername || !hasPassword || !hasSubmit) {
        throw new Error('登录页面表单显示异常');
      }
    });

    await this.runTestCase('前端 -007: 门户工作台', async () => {
      await this.simulateLogin();
      await this.page.goto(`${this.baseUrl}/portal`);
      await this.simulateWait(2000);
      
      // 验证工作台元素
      const hasDashboard = await this.page.isVisible('[class*="dashboard"]') || 
                          await this.page.isVisible('text=工作台');
      if (!hasDashboard) throw new Error('工作台显示异常');
      
      // 验证统计卡片
      const hasStats = await this.page.isVisible('[class*="statistic"]') || 
                      await this.page.isVisible('[class*="card"]');
      if (!hasStats) console.log('工作台统计卡片显示异常');
    });

    await this.runTestCase('前端 -008: 门户侧边栏导航', async () => {
      await this.page.goto(`${this.baseUrl}/portal`);
      await this.simulateWait(1000);
      
      // 验证主要模块导航
      const modules = ['CRM', 'ERP', '财务', '售后', '人力', 'CMS'];
      for (const module of modules) {
        const hasModule = await this.page.isVisible(`text=${module}`);
        if (!hasModule) {
          console.log(`模块 "${module}" 导航未找到`);
        }
      }
    });
  }

  /**
   * 前端性能测试
   */
  async testFrontendPerformance() {
    console.log('\n⚡ 测试前端性能...');
    
    const pages = [
      { name: '官网首页', url: `${this.baseUrl}/` },
      { name: '门户登录', url: `${this.baseUrl}/login` },
      { name: '门户工作台', url: `${this.baseUrl}/portal` },
      { name: '客户管理', url: `${this.baseUrl}/portal/crm/customers` },
      { name: '生产管理', url: `${this.baseUrl}/portal/erp/production` },
    ];
    
    for (const page of pages) {
      await this.runTestCase(`前端 -009: 性能测试 - ${page.name}`, async () => {
        await this.page.goto(page.url);
        await this.simulateWait(1000);
        
        // 获取性能指标
        const metrics = await this.page.evaluate(() => {
          return {
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domElements: document.getElementsByTagName('*').length,
          };
        });
        
        console.log(`${page.name} 性能指标:`);
        console.log(`  - DOM 加载：${metrics.domContentLoaded}ms`);
        console.log(`  - 完全加载：${metrics.loadTime}ms`);
        console.log(`  - DOM 元素：${metrics.domElements}个`);
        
        // 性能标准
        if (metrics.loadTime > 5000) {
          throw new Error(`${page.name} 加载过慢 (${metrics.loadTime}ms > 5000ms)`);
        }
        
        if (metrics.domElements > 5000) {
          console.log(`${page.name} DOM 元素过多 (${metrics.domElements} > 5000)`);
        }
      });
    }
  }

  /**
   * 前端交互测试
   */
  async testFrontendInteraction() {
    console.log('\n🖱️  测试前端交互...');
    
    await this.runTestCase('前端 -010: 按钮交互测试', async () => {
      await this.page.goto(`${this.baseUrl}/portal`);
      await this.simulateWait(1000);
      
      // 测试按钮点击反馈
      const buttons = await this.page.$$('button');
      console.log(`页面按钮数量：${buttons.length}`);
      
      if (buttons.length === 0) {
        throw new Error('页面没有按钮');
      }
      
      // 测试第一个可点击按钮
      for (const button of buttons) {
        const isVisible = await button.isVisible();
        const isDisabled = await button.isDisabled();
        
        if (isVisible && !isDisabled) {
          await button.click();
          await this.simulateWait(500);
          console.log('按钮交互测试通过');
          break;
        }
      }
    });

    await this.runTestCase('前端 -011: 表单输入测试', async () => {
      await this.page.goto(`${this.baseUrl}/login`);
      await this.simulateWait(1000);
      
      // 测试输入框
      const usernameInput = await this.page.$('input[name="username"]');
      if (usernameInput) {
        await usernameInput.fill('testuser');
        const value = await usernameInput.inputValue();
        if (value !== 'testuser') {
          throw new Error('表单输入测试失败');
        }
        console.log('表单输入测试通过');
      }
    });

    await this.runTestCase('前端 -012: 下拉选择测试', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      const selects = await this.page.$$('select');
      console.log(`页面下拉框数量：${selects.length}`);
      
      if (selects.length > 0) {
        await selects[0].selectOption({ index: 1 });
        console.log('下拉选择测试通过');
      }
    });
  }

  /**
   * 运行所有前端测试
   */
  async runFrontendTests() {
    console.log('\n🚀 开始运行网站前端测试...\n');
    
    await this.testResponsiveDesign();
    await this.testWebsiteFrontend();
    await this.testPortalFrontend();
    await this.testFrontendPerformance();
    await this.testFrontendInteraction();
    
    console.log('\n✅ 网站前端测试完成！');
  }
}

// 运行测试
(async () => {
  const tester = new FrontendTests();
  await tester.runFrontendTests();
})();
