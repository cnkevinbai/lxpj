import { test, expect } from '@playwright/test';

test.describe('道达智能门户 E2E 测试', () => {
  // 登录测试
  test('应该能够登录系统', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // 填写登录表单
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    
    // 提交登录
    await page.click('button[type="submit"]');
    
    // 验证登录成功
    await expect(page).toHaveURL('http://localhost:5173/portal');
    await expect(page.locator('text=工作台')).toBeVisible();
  });

  // CRM 客户管理测试
  test.describe('CRM 客户管理', () => {
    test.beforeEach(async ({ page }) => {
      // 登录
      await page.goto('http://localhost:5173/login');
      await page.fill('input[name="username"]', 'admin');
      await page.fill('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('http://localhost:5173/portal');
    });

    test('应该能够创建客户', async ({ page }) => {
      // 导航到客户管理
      await page.goto('http://localhost:5173/portal/crm/customers');
      
      // 点击新建客户
      await page.click('button:has-text("新建客户")');
      
      // 填写表单
      await page.fill('input[name="name"]', 'E2E 测试客户');
      await page.selectOption('select[name="type"]', 'ENTERPRISE');
      await page.fill('input[name="email"]', 'e2e@test.com');
      await page.fill('input[name="phone"]', '13800138000');
      
      // 提交
      await page.click('button:has-text("确定")');
      
      // 验证创建成功
      await expect(page.locator('text=E2E 测试客户')).toBeVisible();
    });

    test('应该能够搜索客户', async ({ page }) => {
      await page.goto('http://localhost:5173/portal/crm/customers');
      
      // 输入搜索关键词
      await page.fill('input[placeholder*="搜索"]', '测试');
      await page.press('input[placeholder*="搜索"]', 'Enter');
      
      // 验证搜索结果
      await expect(page.locator('text=测试')).toBeVisible();
    });

    test('应该能够查看客户详情', async ({ page }) => {
      await page.goto('http://localhost:5173/portal/crm/customers');
      
      // 点击查看详情
      await page.click('button:has-text("查看")');
      
      // 验证详情页面
      await expect(page.locator('text=客户详情')).toBeVisible();
    });
  });

  // ERP 生产管理测试
  test.describe('ERP 生产管理', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[name="username"]', 'admin');
      await page.fill('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('http://localhost:5173/portal');
    });

    test('应该能够查看生产订单列表', async ({ page }) => {
      await page.goto('http://localhost:5173/portal/erp/production');
      
      // 验证列表显示
      await expect(page.locator('text=生产订单号')).toBeVisible();
      await expect(page.locator('text=产品名称')).toBeVisible();
      await expect(page.locator('text=数量')).toBeVisible();
    });

    test('应该能够创建生产订单', async ({ page }) => {
      await page.goto('http://localhost:5173/portal/erp/production');
      
      // 点击新建
      await page.click('button:has-text("新建")');
      
      // 填写表单
      await page.fill('input[name="productName"]', 'E2E 测试产品');
      await page.fill('input[name="quantity"]', '100');
      
      // 提交
      await page.click('button:has-text("确定")');
      
      // 验证创建成功
      await expect(page.locator('text=E2E 测试产品')).toBeVisible();
    });
  });

  // 售后工单测试
  test.describe('售后工单管理', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[name="username"]', 'admin');
      await page.fill('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('http://localhost:5173/portal');
    });

    test('应该能够创建工单', async ({ page }) => {
      await page.goto('http://localhost:5173/portal/aftersales');
      
      // 点击新建工单
      await page.click('button:has-text("新建工单")');
      
      // 填写表单
      await page.fill('input[name="customerName"]', 'E2E 测试客户');
      await page.fill('input[name="subject"]', 'E2E 测试工单');
      await page.selectOption('select[name="type"]', 'REPAIR');
      
      // 提交
      await page.click('button:has-text("确定")');
      
      // 验证创建成功
      await expect(page.locator('text=E2E 测试工单')).toBeVisible();
    });
  });

  // 智能决策测试
  test.describe('智能决策', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.fill('input[name="username"]', 'admin');
      await page.fill('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('http://localhost:5173/portal');
    });

    test('应该能够获取服务方式推荐', async ({ page }) => {
      await page.goto('http://localhost:5173/portal/service-tickets/new');
      
      // 填写工单信息
      await page.fill('input[name="type"]', 'INSTALLATION');
      await page.fill('input[name="productModel"]', '大型设备 X1000');
      
      // 触发智能决策
      await page.click('button:has-text("智能推荐")');
      
      // 验证推荐结果
      await expect(page.locator('text=现场服务')).toBeVisible();
      await expect(page.locator('text=置信度')).toBeVisible();
    });
  });

  // 权限控制测试
  test.describe('权限控制', () => {
    test('未登录用户应该被重定向到登录页', async ({ page }) => {
      await page.goto('http://localhost:5173/portal');
      
      // 验证被重定向到登录页
      await expect(page).toHaveURL('http://localhost:5173/login');
    });

    test('普通用户不能访问管理员页面', async ({ page }) => {
      // 使用普通用户登录
      await page.goto('http://localhost:5173/login');
      await page.fill('input[name="username"]', 'user');
      await page.fill('input[name="password"]', 'user123');
      await page.click('button[type="submit"]');
      
      // 尝试访问管理员页面
      await page.goto('http://localhost:5173/portal/admin');
      
      // 验证无权限
      await expect(page.locator('text=403')).toBeVisible();
    });
  });

  // 响应式设计测试
  test.describe('响应式设计', () => {
    test('应该在移动端正常显示', async ({ page }) => {
      // 设置为移动端视口
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('http://localhost:5173/login');
      
      // 验证登录表单正常显示
      await expect(page.locator('input[name="username"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('应该在平板端正常显示', async ({ page }) => {
      // 设置为平板视口
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('http://localhost:5173/portal');
      
      // 验证侧边栏正常显示
      await expect(page.locator('text=工作台')).toBeVisible();
      await expect(page.locator('text=CRM')).toBeVisible();
      await expect(page.locator('text=ERP')).toBeVisible();
    });
  });
});
