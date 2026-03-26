/**
 * 补充测试用例 - 覆盖所有遗漏功能点
 */

import { AutomatedTestSystem } from './automated-test-system';

export class SupplementaryTests extends AutomatedTestSystem {
  
  /**
   * CRM 补充测试 (5 个用例)
   */
  async testCRMSupplementary() {
    console.log('\n📊 补充 CRM 测试...');
    
    await this.runTestCase('CRM-004: 客户删除', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("删除")', '删除客户');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("确认")', '确认删除');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=删除成功');
      if (!success) throw new Error('客户删除失败');
    });

    await this.runTestCase('CRM-005: 客户导入', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("导入")', '导入客户');
      await this.simulateWait(500);
      
      // 验证导入对话框显示
      const hasDialog = await this.page.isVisible('text=导入客户');
      if (!hasDialog) throw new Error('客户导入对话框显示失败');
    });

    await this.runTestCase('CRM-006: 客户导出', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("导出")', '导出客户');
      await this.simulateWait(2000);
      
      // 验证导出成功
      const success = await this.page.isVisible('text=导出成功');
      if (!success) throw new Error('客户导出失败');
    });

    await this.runTestCase('CRM-007: 商机详情', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/opportunities`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("查看")', '查看商机');
      await this.simulateWait(2000);
      
      const hasDetail = await this.page.isVisible('text=商机详情');
      if (!hasDetail) throw new Error('商机详情显示失败');
    });

    await this.runTestCase('CRM-008: 订单发货', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/orders`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("发货")', '订单发货');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="trackingNumber"]', 'SF1234567890', '快递单号');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=发货成功');
      if (!success) throw new Error('订单发货失败');
    });
  }

  /**
   * ERP 补充测试 (6 个用例)
   */
  async testERPSupplementary() {
    console.log('\n🏭 补充 ERP 测试...');
    
    await this.runTestCase('ERP-011: 生产订单编辑', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/production`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("编辑")', '编辑订单');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="quantity"]', '150', '新数量');
      await this.simulateClick('button:has-text("保存")', '保存');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=保存成功');
      if (!success) throw new Error('生产订单编辑失败');
    });

    await this.runTestCase('ERP-012: 生产订单删除', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/production`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("删除")', '删除订单');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=删除成功');
      if (!success) throw new Error('生产订单删除失败');
    });

    await this.runTestCase('ERP-013: 采购退货', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/purchase`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("退货")', '采购退货');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="quantity"]', '10', '退货数量');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=退货成功');
      if (!success) throw new Error('采购退货失败');
    });

    await this.runTestCase('ERP-014: 库存锁定', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/inventory`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("锁定")', '库存锁定');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=锁定成功');
      if (!success) throw new Error('库存锁定失败');
    });

    await this.runTestCase('ERP-015: 库存解锁', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/inventory`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("解锁")', '库存解锁');
      await this.simulateWait(500);
      
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=解锁成功');
      if (!success) throw new Error('库存解锁失败');
    });

    await this.runTestCase('ERP-016: 库存盘点', async () => {
      await this.page.goto(`${this.baseUrl}/portal/erp/inventory`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("盘点")', '库存盘点');
      await this.simulateWait(500);
      
      await this.simulateType('input[name="actualQuantity"]', '100', '实际数量');
      await this.simulateClick('button:has-text("确认")', '确认');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=盘点成功');
      if (!success) throw new Error('库存盘点失败');
    });
  }

  /**
   * 公共功能测试 (5 个用例)
   */
  async testCommonFeatures() {
    console.log('\n🔧 测试公共功能...');
    
    await this.runTestCase('COM-001: 登出功能', async () => {
      await this.page.goto(`${this.baseUrl}/portal`);
      await this.simulateWait(1000);
      
      await this.simulateClick('text=退出登录', '退出登录');
      await this.simulateWait(2000);
      
      const isLoginPage = this.page.url().includes('/login');
      if (!isLoginPage) throw new Error('登出失败');
    });

    await this.runTestCase('COM-002: 消息通知', async () => {
      await this.page.goto(`${this.baseUrl}/portal`);
      await this.simulateWait(1000);
      
      const hasNotification = await this.page.isVisible('[class*="notification"]');
      if (!hasNotification) throw new Error('消息通知显示失败');
    });

    await this.runTestCase('COM-003: 数据导出 - Excel', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("导出")', '导出');
      await this.simulateWait(500);
      
      await this.simulateClick('text=Excel', '导出 Excel');
      await this.simulateWait(2000);
      
      const success = await this.page.isVisible('text=导出成功');
      if (!success) throw new Error('Excel 导出失败');
    });

    await this.runTestCase('COM-004: 数据导入 - Excel', async () => {
      await this.page.goto(`${this.baseUrl}/portal/crm/customers`);
      await this.simulateWait(1000);
      
      await this.simulateClick('button:has-text("导入")', '导入');
      await this.simulateWait(500);
      
      await this.simulateClick('text=Excel', '导入 Excel');
      await this.simulateWait(2000);
      
      const hasUpload = await this.page.isVisible('input[type="file"]');
      if (!hasUpload) throw new Error('Excel 导入对话框显示失败');
    });

    await this.runTestCase('COM-005: 权限验证', async () => {
      await this.page.goto(`${this.baseUrl}/portal/admin/users`);
      await this.simulateWait(1000);
      
      // 验证是否有权限访问
      const hasAccess = await this.page.isVisible('table');
      if (!hasAccess) throw new Error('权限验证失败');
    });
  }

  /**
   * 运行所有补充测试
   */
  async runSupplementaryTests() {
    console.log('\n🚀 开始运行补充测试...\n');
    
    await this.testCRMSupplementary();
    await this.testERPSupplementary();
    await this.testCommonFeatures();
  }
}
