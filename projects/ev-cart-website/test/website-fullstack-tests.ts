/**
 * 网站前后端全栈测试
 * 
 * 测试范围:
 * 1. 官网前后端完整流程
 * 2. 门户前后端完整流程
 * 3. API 与前端数据一致性
 * 4. 前后端错误处理
 */

import { AutomatedTestSystem } from './automated-test-system';

export class WebsiteFullStackTests extends AutomatedTestSystem {
  
  /**
   * 官网前后端测试
   */
  async testWebsiteFullStack() {
    console.log('\n🌐 测试官网前后端...');
    
    await this.runTestCase('网站全栈 -001: 官网首页数据加载', async () => {
      // 前端访问
      await this.page.goto(`${this.baseUrl}/`);
      await this.simulateWait(2000);
      
      // 验证前端显示
      const hasHero = await this.page.isVisible('text=道达智能');
      if (!hasHero) throw new Error('官网首页显示异常');
      
      // 验证 API 数据
      const apiResponse = await this.page.evaluate(async () => {
        const res = await fetch('/api/cms/news?limit=5');
        return await res.json();
      });
      
      console.log(`官网新闻 API 返回：${apiResponse.data?.length || 0}条`);
    });

    await this.runTestCase('网站全栈 -002: 官网产品列表', async () => {
      await this.page.goto(`${this.baseUrl}/products`);
      await this.simulateWait(2000);
      
      // 验证产品列表显示
      const hasProducts = await this.page.isVisible('[class*="product"]');
      if (!hasProducts) throw new Error('产品列表显示异常');
      
      // 验证产品数据
      const productCount = await this.page.evaluate(() => {
        return document.querySelectorAll('[class*="product"]').length;
      });
      
      console.log(`官网产品数量：${productCount}个`);
      if (productCount === 0) {
        console.log('⚠️ 官网产品数据为空');
      }
    });

    await this.runTestCase('网站全栈 -003: 官网联系表单提交', async () => {
      await this.page.goto(`${this.baseUrl}/contact`);
      await this.simulateWait(1000);
      
      // 填写联系表单
      const formExists = await this.page.isVisible('form');
      if (!formExists) {
        console.log('联系表单不存在');
        return;
      }
      
      await this.simulateType('input[name="name"]', '测试用户', '姓名');
      await this.simulateType('input[name="email"]', 'test@test.com', '邮箱');
      await this.simulateType('textarea[name="message"]', '测试消息', '消息内容');
      
      // 提交表单
      await this.simulateClick('button[type="submit"]', '提交');
      await this.simulateWait(2000);
      
      // 验证提交结果
      const success = await this.page.isVisible('text=提交成功') || 
                     await this.page.isVisible('text=发送成功');
      if (!success) {
        console.log('⚠️ 联系表单提交失败');
      } else {
        console.log('联系表单提交成功');
      }
    });

    await this.runTestCase('网站全栈 -004: 官网 SEO 优化', async () => {
      await this.page.goto(`${this.baseUrl}/`);
      await this.simulateWait(1000);
      
      // 检查 SEO 元素
      const seoCheck = await this.page.evaluate(() => {
        return {
          title: document.title,
          metaDescription: document.querySelector('meta[name="description"]')?.content,
          metaKeywords: document.querySelector('meta[name="keywords"]')?.content,
          h1Count: document.getElementsByTagName('h1').length,
        };
      });
      
      console.log('官网 SEO 检查:');
      console.log(`  - 标题：${seoCheck.title}`);
      console.log(`  - 描述：${seoCheck.metaDescription ? '有' : '无'}`);
      console.log(`  - 关键词：${seoCheck.metaKeywords ? '有' : '无'}`);
      console.log(`  - H1 标签：${seoCheck.h1Count}个`);
      
      if (!seoCheck.metaDescription) {
        console.log('⚠️ 缺少 meta description');
      }
      if (seoCheck.h1Count === 0) {
        console.log('⚠️ 缺少 H1 标签');
      }
    });
  }

  /**
   * 门户前后端测试
   */
  async testPortalFullStack() {
    console.log('\n🖥️  测试门户前后端...');
    
    await this.runTestCase('门户全栈 -001: 登录认证流程', async () => {
      // 测试登录
      await this.page.goto(`${this.baseUrl}/login`);
      await this.simulateWait(1000);
      
      await this.simulateType('input[name="username"]', 'admin', '用户名');
      await this.simulateType('input[name="password"]', 'admin123', '密码');
      await this.simulateClick('button[type="submit"]', '登录');
      await this.simulateWait(3000);
      
      // 验证登录成功
      const isSuccess = await this.page.isVisible('text=工作台') || 
                       await this.page.isVisible('text=登录成功');
      if (!isSuccess) {
        throw new Error('登录失败');
      }
      
      // 验证 Token
      const token = await this.page.evaluate(() => {
        return localStorage.getItem('token');
      });
      
      if (!token) {
        console.log('⚠️ 未找到认证 Token');
      } else {
        console.log('登录 Token 已保存');
      }
    });

    await this.runTestCase('门户全栈 -002: CRM 客户列表加载', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(2000);
      
      // 验证前端列表
      const hasTable = await this.page.isVisible('table');
      if (!hasTable) throw new Error('客户列表显示异常');
      
      // 验证 API 调用
      const customerData = await this.page.evaluate(async () => {
        const res = await fetch('/api/crm/customers?page=1&pageSize=10');
        return await res.json();
      });
      
      console.log(`CRM 客户 API 返回：${customerData.data?.length || 0}个客户`);
    });

    await this.runTestCase('门户全栈 -003: ERP 生产订单创建', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/production`);
      await this.simulateWait(1000);
      
      // 创建生产订单
      await this.simulateClick('button:has-text("新建")', '新建订单');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="productName"]', '测试产品', '产品名称');
      await this.simulateType('input[name="quantity"]', '100', '数量');
      
      await this.simulateClick('button:has-text("保存")', '保存');
      await this.simulateWait(2000);
      
      // 验证创建成功
      const success = await this.page.isVisible('text=创建成功') || 
                     await this.page.isVisible('text=保存成功');
      if (!success) {
        console.log('⚠️ 生产订单创建失败');
      } else {
        console.log('生产订单创建成功');
      }
    });

    await this.runTestCase('门户全栈 -004: 财务数据同步', async () => {
      await this.page.goto(`${this.baseUrl}/portal/finance/receivables`);
      await this.simulateWait(2000);
      
      // 验证前端显示
      const hasReceivables = await this.page.isVisible('[class*="receivable"]');
      
      // 验证 API 数据
      const apiData = await this.page.evaluate(async () => {
        const res = await fetch('/api/finance/receivables');
        return await res.json();
      });
      
      console.log(`财务应收 API 返回：${apiData.data?.length || 0}条记录`);
      
      if (!hasReceivables && apiData.data?.length > 0) {
        console.log('⚠️ 前端未显示后端数据');
      }
    });
  }

  /**
   * 前后端数据一致性测试
   */
  async testDataConsistency() {
    console.log('\n🔄 测试前后端数据一致性...');
    
    await this.runTestCase('数据一致 -001: 客户数据一致性', async () => {
      // 后端创建客户
      const apiResult = await this.page.evaluate(async () => {
        const res = await fetch('/api/crm/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'API 测试客户',
            type: 'ENTERPRISE',
            phone: '13800138000',
          }),
        });
        return await res.json();
      });
      
      console.log(`API 创建客户 ID: ${apiResult.id}`);
      
      // 前端验证
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(2000);
      
      const hasCustomer = await this.page.isVisible('text=API 测试客户');
      if (!hasCustomer) {
        console.log('⚠️ 前端未显示 API 创建的客户');
      } else {
        console.log('前后端数据一致');
      }
    });

    await this.runTestCase('数据一致 -002: 库存数据一致性', async () => {
      // 获取后端库存数据
      const apiInventory = await this.page.evaluate(async () => {
        const res = await fetch('/api/erp/inventory');
        return await res.json();
      });
      
      // 前端获取库存数据
      await this.page.goto(`${this.baseUrl}/portal/erp/inventory`);
      await this.simulateWait(2000);
      
      const frontInventory = await this.page.evaluate(() => {
        const rows = document.querySelectorAll('table tbody tr');
        return rows.length;
      });
      
      console.log(`后端库存记录：${apiInventory.data?.length || 0}条`);
      console.log(`前端库存记录：${frontInventory}条`);
      
      if (apiInventory.data?.length !== frontInventory) {
        console.log('⚠️ 前后端库存数据不一致');
      }
    });
  }

  /**
   * 前后端错误处理测试
   */
  async testErrorHandling() {
    console.log('\n❌ 测试前后端错误处理...');
    
    await this.runTestCase('错误处理 -001: API 错误处理', async () => {
      // 测试无效 API 请求
      const errorResult = await this.page.evaluate(async () => {
        try {
          const res = await fetch('/api/invalid-endpoint');
          return { status: res.status, ok: res.ok };
        } catch (e: any) {
          return { error: e.message };
        }
      });
      
      console.log(`无效 API 请求结果：${JSON.stringify(errorResult)}`);
    });

    await this.runTestCase('错误处理 -002: 表单验证错误', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      // 尝试提交空表单
      await this.simulateClick('button:has-text("新建")', '新建客户');
      await this.simulateWait(500);
      
      // 不填写必填项，直接提交
      await this.simulateClick('button:has-text("保存")', '保存');
      await this.simulateWait(1000);
      
      // 验证错误提示
      const hasError = await this.page.isVisible('[class*="error"]') || 
                      await this.page.isVisible('text=必填') ||
                      await this.page.isVisible('text=不能为空');
      
      if (hasError) {
        console.log('表单验证错误提示正常');
      } else {
        console.log('⚠️ 缺少表单验证提示');
      }
    });

    await this.runTestCase('错误处理 -003: 网络错误处理', async () => {
      // 模拟网络错误
      await this.page.route('**/api/**', route => {
        route.abort('failed');
      });
      
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(3000);
      
      // 验证错误提示
      const hasError = await this.page.isVisible('text=网络错误') || 
                      await this.page.isVisible('text=加载失败');
      
      if (hasError) {
        console.log('网络错误提示正常');
      } else {
        console.log('⚠️ 缺少网络错误提示');
      }
      
      // 恢复网络
      await this.page.unroute('**/api/**');
    });
  }

  /**
   * 运行所有网站全栈测试
   */
  async runWebsiteFullStackTests() {
    console.log('\n🚀 开始运行网站前后端全栈测试...\n');
    
    await this.testWebsiteFullStack();
    await this.testPortalFullStack();
    await this.testDataConsistency();
    await this.testErrorHandling();
    
    console.log('\n✅ 网站前后端全栈测试完成！');
  }
}

// 运行测试
(async () => {
  const tester = new WebsiteFullStackTests();
  await tester.runWebsiteFullStackTests();
})();
