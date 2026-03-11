import { test, expect } from '@playwright/test'

test.describe('CRM System', () => {
  test('should login to CRM', async ({ page }) => {
    await page.goto('/crm/login')
    await page.fill('input[type="email"]', 'admin@daoda-auto.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/crm\/dashboard/)
  })

  test('should display dashboard after login', async ({ page }) => {
    await page.goto('/crm/login')
    await page.fill('input[type="email"]', 'admin@daoda-auto.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=仪表盘')).toBeVisible()
  })

  test('should create customer', async ({ page }) => {
    // Login
    await page.goto('/crm/login')
    await page.fill('input[type="email"]', 'admin@daoda-auto.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // Navigate to customers
    await page.click('text=客户管理')
    await expect(page).toHaveURL(/\/crm\/customers/)
    
    // Create customer
    await page.click('text=新建客户')
    await page.fill('input[name="name"]', '测试客户')
    await page.fill('input[name="contactPerson"]', '联系人')
    await page.fill('input[name="contactPhone"]', '13800138000')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=创建成功')).toBeVisible()
  })

  test('should search customers', async ({ page }) => {
    await page.goto('/crm/customers')
    await page.fill('input[placeholder*="搜索"]', '测试')
    await page.press('input[placeholder*="搜索"]', 'Enter')
    await expect(page.locator('table')).toBeVisible()
  })

  test('should export data', async ({ page }) => {
    await page.goto('/crm/export')
    await expect(page.locator('text=数据导出')).toBeVisible()
    await page.click('text=导出 Excel')
    // Verify download starts
    await expect(page.locator('text=导出成功')).toBeVisible()
  })
})
