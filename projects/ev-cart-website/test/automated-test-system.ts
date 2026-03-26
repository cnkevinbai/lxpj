/**
 * 全自动模拟人工测试系统
 * 
 * 功能:
 * 1. 自动启动开发服务器
 * 2. 模拟真实用户操作
 * 3. 无死角覆盖所有功能
 * 4. 自动验证测试结果
 * 5. 自动生成测试报告
 * 
 * 技术栈: Playwright + Node.js
 */

import { chromium, Page, Browser, BrowserContext } from 'playwright';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { ExtendedTestModule } from './extended-tests';
import { SupplementaryTests } from './supplementary-tests';
import { P0CriticalTests } from './p0-critical-tests';
import { P1ImportantTests } from './p1-important-tests';
import { P2SecondaryTests } from './p2-secondary-tests';
import { FinalGapTests } from './final-gap-tests';
import { TestEngineerEvolution } from './test-engineer-evolution';
import { CoverageAnalyzer } from './coverage-analyzer';

interface TestResult {
  testCase: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
}

interface TestReport {
  timestamp: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: TestResult[];
}

class AutomatedTestSystem extends FinalGapTests {
  private browser: Browser;
  private context: BrowserContext;
  private page: Page;
  private backendProcess: ChildProcess | null = null;
  private frontendProcess: ChildProcess | null = null;
  private results: TestResult[] = [];
  private baseUrl: string = 'http://localhost:5173';
  private evolution: TestEngineerEvolution;
  private coverageAnalyzer: CoverageAnalyzer;

  /**
   * 初始化测试系统
   */
  async initialize() {
    console.log('🚀 初始化测试系统...');
    
    // 初始化进化系统
    this.evolution = new TestEngineerEvolution();
    this.evolution.loadEvolutionState();
    
    // 初始化覆盖度分析
    this.coverageAnalyzer = new CoverageAnalyzer();
    
    this.browser = await chromium.launch({
      headless: false,
      slowMo: 100,
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });
    
    this.page = await this.context.newPage();
    console.log('✅ 测试系统初始化完成');
  }

  /**
   * 启动开发环境
   */
  async startDevEnvironment() {
    console.log('🔧 启动开发环境...');

    // 启动后端
    if (fs.existsSync(path.join(process.cwd(), 'backend/package.json'))) {
      console.log('📦 启动后端服务...');
      this.backendProcess = spawn('npm', ['run', 'start:dev'], {
        cwd: path.join(process.cwd(), 'backend'),
        stdio: 'pipe',
      });
      
      await this.waitForService('http://localhost:3001/api', 60000);
      console.log('✅ 后端服务已启动');
    }

    // 启动前端
    if (fs.existsSync(path.join(process.cwd(), 'portal/package.json'))) {
      console.log('📦 启动前端服务...');
      this.frontendProcess = spawn('npm', ['run', 'dev'], {
        cwd: path.join(process.cwd(), 'portal'),
        stdio: 'pipe',
      });
      
      await this.waitForService(this.baseUrl, 60000);
      console.log('✅ 前端服务已启动');
    }

    console.log('✅ 开发环境启动完成');
  }

  /**
   * 等待服务就绪
   */
  private async waitForService(url: string, timeout: number) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const response = await fetch(url);
        if (response.ok) return;
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    throw new Error(`服务启动超时：${url}`);
  }

  /**
   * 模拟人工登录
   */
  async simulateLogin(username: string = 'admin', password: string = 'admin123') {
    console.log('👤 模拟人工登录...');
    
    await this.page.goto(`${this.baseUrl}/login`, { waitUntil: 'networkidle' });
    
    // 模拟人工输入
    await this.page.type('input[name="username"]', username, { delay: 100 });
    await this.page.type('input[name="password"]', password, { delay: 100 });
    
    // 模拟人工点击
    await this.page.click('button[type="submit"]');
    
    // 等待登录成功
    await this.page.waitForURL(`${this.baseUrl}/portal`, { timeout: 10000 });
    
    console.log('✅ 登录成功');
  }

  /**
   * 模拟人工点击
   */
  async simulateClick(selector: string, description: string = '') {
    console.log(`👆 点击：${description || selector}`);
    await this.page.click(selector, { delay: 200 });
  }

  /**
   * 模拟人工输入
   */
  async simulateType(selector: string, text: string, description: string = '') {
    console.log(`✍️  输入：${description || selector} = ${text}`);
    await this.page.type(selector, text, { delay: 50 });
  }

  /**
   * 模拟人工选择
   */
  async simulateSelect(selector: string, value: string, description: string = '') {
    console.log(`📋 选择：${description || selector} = ${value}`);
    await this.page.selectOption(selector, value);
  }

  /**
   * 模拟人工滚动
   */
  async simulateScroll(x: number, y: number) {
    console.log(`📜 滚动：x=${x}, y=${y}`);
    await this.page.evaluate((x, y) => window.scrollBy(x, y), x, y);
  }

  /**
   * 模拟人工等待
   */
  async simulateWait(ms: number = 1000) {
    console.log(`⏳ 等待：${ms}ms`);
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 执行测试用例
   */
  async runTestCase(name: string, testFn: () => Promise<void>) {
    console.log(`\n🧪 执行测试：${name}`);
    const startTime = Date.now();
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({
        testCase: name,
        status: 'passed',
        duration,
      });
      console.log(`✅ 通过：${name} (${duration}ms)`);
      
      // 记录到进化系统
      const module = name.split('-')[0];
      await this.evolution.recordTestExecution(module, true, duration);
      
      // 标记覆盖度
      this.markCoverage(name);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const screenshot = `screenshots/${name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.png`;
      await this.page.screenshot({ path: screenshot });
      
      this.results.push({
        testCase: name,
        status: 'failed',
        duration,
        error: error.message,
        screenshot,
      });
      console.log(`❌ 失败：${name} - ${error.message}`);
      
      // 记录到进化系统
      const module = name.split('-')[0];
      await this.evolution.recordTestExecution(module, false, duration);
    }
  }

  /**
   * 标记测试覆盖
   */
  private markCoverage(testCaseName: string) {
    const parts = testCaseName.split(':');
    if (parts.length >= 2) {
      const moduleName = parts[0].trim();
      const featureName = parts[1].trim();
      
      // 简单映射
      const moduleMap: Record<string, string> = {
        'CRM': 'CRM',
        'ERP': 'ERP',
        'AS': '售后',
        'FIN': '财务',
        'HR': 'HR',
        'CMS': 'CMS',
        'WF': '工作流',
        'ADM': '系统',
        'COM': '公共',
      };
      
      const module = moduleMap[moduleName] || moduleName;
      this.coverageAnalyzer.markCovered(testCaseName, module, featureName, '测试');
    }
  }

  /**
   * CRM 模块测试
   */
  async testCRMModule() {
    console.log('\n📊 测试 CRM 模块...');
    
    await this.runTestCase('CRM-001: 客户创建', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      // 点击新建客户
      await this.simulateClick('button:has-text("新建客户")', '新建客户');
      await this.simulateWait(500);
      
      // 填写表单
      await this.simulateType('input[name="name"]', '测试企业有限公司', '客户名称');
      await this.simulateSelect('select[name="type"]', 'ENTERPRISE', '客户类型');
      await this.simulateType('input[name="email"]', 'test@test.com', '邮箱');
      await this.simulateType('input[name="phone"]', '13800138000', '电话');
      
      // 提交
      await this.simulateClick('button:has-text("确定")', '提交');
      await this.simulateWait(2000);
      
      // 验证
      const success = await this.page.isVisible('text=创建成功');
      if (!success) throw new Error('客户创建失败');
    });

    await this.runTestCase('CRM-002: 客户查询', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      
      // 搜索
      await this.simulateType('input[placeholder*="搜索"]', '测试', '搜索关键词');
      await this.simulateWait(1000);
      
      // 验证结果
      const hasResults = await this.page.isVisible('text=测试');
      if (!hasResults) throw new Error('客户查询失败');
    });

    await this.runTestCase('CRM-003: 客户编辑', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      // 点击编辑
      await this.simulateClick('button:has-text("编辑")', '编辑客户');
      await this.simulateWait(500);
      
      // 修改名称
      await this.simulateType('input[name="name"]', '新名称', '新名称');
      
      // 保存
      await this.simulateClick('button:has-text("保存")', '保存');
      await this.simulateWait(2000);
      
      // 验证
      const success = await this.page.isVisible('text=保存成功');
      if (!success) throw new Error('客户编辑失败');
    });
  }

  /**
   * ERP 模块测试
   */
  async testERPModule() {
    console.log('\n🏭 测试 ERP 模块...');
    
    await this.runTestCase('ERP-001: 生产订单创建', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/production`);
      await this.simulateWait(1000);
      
      // 点击新建
      await this.simulateClick('button:has-text("新建")', '新建生产订单');
      await this.simulateWait(500);
      
      // 填写表单
      await this.simulateType('input[name="productName"]', '测试产品', '产品名称');
      await this.simulateType('input[name="quantity"]', '100', '数量');
      
      // 提交
      await this.simulateClick('button:has-text("确定")', '提交');
      await this.simulateWait(2000);
      
      // 验证
      const success = await this.page.isVisible('text=创建成功');
      if (!success) throw new Error('生产订单创建失败');
    });

    await this.runTestCase('ERP-002: 库存查询', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/inventory`);
      await this.simulateWait(1000);
      
      // 验证列表显示
      const hasTable = await this.page.isVisible('table');
      if (!hasTable) throw new Error('库存列表显示失败');
    });
  }

  /**
   * 售后模块测试
   */
  async testAfterSalesModule() {
    console.log('\n🔧 测试售后模块...');
    
    await this.runTestCase('AS-001: 工单创建', async () => {
      await this.page.goto(`${this.baseUrl}/portal/aftersales`);
      await this.simulateWait(1000);
      
      // 点击新建工单
      await this.simulateClick('button:has-text("新建工单")', '新建工单');
      await this.simulateWait(500);
      
      // 填写表单
      await this.simulateType('input[name="customerName"]', '测试客户', '客户名称');
      await this.simulateType('input[name="subject"]', '测试工单', '工单主题');
      
      // 提交
      await this.simulateClick('button:has-text("确定")', '提交');
      await this.simulateWait(2000);
      
      // 验证
      const success = await this.page.isVisible('text=创建成功');
      if (!success) throw new Error('工单创建失败');
    });
  }

  /**
   * 运行全部测试
   */
  async runAllTests() {
    console.log('\n🚀 开始运行全部测试...\n');
    
    await this.initialize();
    await this.startDevEnvironment();
    await this.simulateLogin();
    
    // 基础模块测试
    await this.testCRMModule();
    await this.testERPModule();
    await this.testAfterSalesModule();
    
    // 扩展模块测试
    await this.runExtendedTests();
    
    // 补充测试
    await this.runSupplementaryTests();
    
    // P0 级核心功能测试
    await this.runP0Tests();
    
    // P1 级重要功能测试
    await this.runP1Tests();
    
    // P2 级次要功能测试
    await this.runP2Tests();
    
    // 遗漏功能点补充测试
    await this.runGapTests();
    
    // 覆盖度分析
    console.log('\n📊 生成覆盖度报告...\n');
    const coverageReport = this.coverageAnalyzer.generateReport();
    console.log(coverageReport);
    
    // 保存覆盖度报告
    const coverageJson = this.coverageAnalyzer.exportToJson();
    const coveragePath = path.join(process.cwd(), 'test', 'coverage-report.json');
    fs.writeFileSync(coveragePath, coverageJson);
    
    // 进化系统
    await this.evolution.optimizeTestStrategy();
    this.evolution.generateEvolutionReport();
    this.evolution.saveEvolutionState();
    
    await this.generateReport();
    await this.cleanup();
  }

  /**
   * 生成测试报告
   */
  async generateReport() {
    console.log('\n📊 生成测试报告...\n');
    
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const total = this.results.length;
    const duration = this.results.reduce((sum, r) => sum + r.duration, 0);

    const report: TestReport = {
      timestamp: new Date().toISOString(),
      total,
      passed,
      failed,
      skipped: 0,
      duration,
      results: this.results,
    };

    // 保存报告
    const reportPath = path.join(process.cwd(), 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // 生成 HTML 报告
    const htmlReport = this.generateHTMLReport(report);
    const htmlPath = path.join(process.cwd(), 'test-report.html');
    fs.writeFileSync(htmlPath, htmlReport);

    console.log('='.repeat(60));
    console.log('📊 测试报告');
    console.log('='.repeat(60));
    console.log(`总用例数：${total}`);
    console.log(`通过：${passed} (${(passed/total*100).toFixed(2)}%)`);
    console.log(`失败：${failed} (${(failed/total*100).toFixed(2)}%)`);
    console.log(`总耗时：${duration}ms`);
    console.log('='.repeat(60));
    console.log(`📄 报告已保存：${reportPath}`);
    console.log(`📄 HTML 报告：${htmlPath}`);
    console.log('='.repeat(60));
  }

  /**
   * 生成 HTML 报告
   */
  private generateHTMLReport(report: TestReport): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>自动化测试报告</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    .summary { margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 8px; }
    .passed { color: #52c41a; }
    .failed { color: #ff4d4f; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #fafafa; }
    .status-passed { color: #52c41a; font-weight: bold; }
    .status-failed { color: #ff4d4f; font-weight: bold; }
  </style>
</head>
<body>
  <h1>🤖 自动化测试报告</h1>
  <div class="summary">
    <h2>测试概览</h2>
    <p><strong>时间:</strong> ${report.timestamp}</p>
    <p><strong>总用例:</strong> ${report.total}</p>
    <p class="passed"><strong>通过:</strong> ${report.passed}</p>
    <p class="failed"><strong>失败:</strong> ${report.failed}</p>
    <p><strong>总耗时:</strong> ${report.duration}ms</p>
  </div>
  <h2>测试详情</h2>
  <table>
    <tr>
      <th>用例名称</th>
      <th>状态</th>
      <th>耗时 (ms)</th>
      <th>错误信息</th>
    </tr>
    ${report.results.map(r => `
      <tr>
        <td>${r.testCase}</td>
        <td class="status-${r.status}">${r.status.toUpperCase()}</td>
        <td>${r.duration}</td>
        <td>${r.error || '-'}</td>
      </tr>
    `).join('')}
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * 清理资源
   */
  async cleanup() {
    console.log('\n🧹 清理资源...');
    
    if (this.browser) {
      await this.browser.close();
    }
    
    if (this.backendProcess) {
      this.backendProcess.kill();
    }
    
    if (this.frontendProcess) {
      this.frontendProcess.kill();
    }
    
    console.log('✅ 清理完成');
  }
}

// 运行测试
(async () => {
  const testSystem = new AutomatedTestSystem();
  await testSystem.runAllTests();
})();
