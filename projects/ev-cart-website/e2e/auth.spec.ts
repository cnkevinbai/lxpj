import { test, expect } from '@playwright/test'

test.describe('认证系统', () => {
  test('应该能够访问登录页面', async ({ page }) => {
    await page.goto('/crm/login')
    await expect(page).toHaveTitle(/道达 CRM/)
  })

  test('应该能够登录系统', async ({ page }) => {
    await page.goto('/crm/login')
    
    // 填写登录表单
    await page.fill('input[type="email"]', 'admin@daoda-auto.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // 等待跳转
    await page.waitForURL(/\/crm\/dashboard|\/crm\/foreign-dashboard/)
    
    // 验证登录成功
    expect(page.url()).toContain('/crm/')
  })

  test('应该显示错误提示 (错误密码)', async ({ page }) => {
    await page.goto('/crm/login')
    
    // 填写错误密码
    await page.fill('input[type="email"]', 'admin@daoda-auto.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // 等待错误提示
    await page.waitForSelector('text=登录失败')
  })

  test('应该验证必填字段', async ({ page }) => {
    await page.goto('/crm/login')
    
    // 不填写直接提交
    await page.click('button[type="submit"]')
    
    // 应该显示验证错误
    await page.waitForSelector('text=邮箱')
  })

  test('应该能够退出登录', async ({ page }) => {
    // 先登录
    await page.goto('/crm/login')
    await page.fill('input[type="email"]', 'admin@daoda-auto.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/crm\/dashboard|\/crm\/foreign-dashboard/)
    
    // 退出登录
    await page.click('text=退出登录')
    await page.waitForURL(/\/crm\/login/)
  })
})
