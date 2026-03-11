import { test, expect } from '@playwright/test'

test.describe('导航系统', () => {
  test.beforeEach(async ({ page }) => {
    // 先登录
    await page.goto('/crm/login')
    await page.fill('input[type="email"]', 'admin@daoda-auto.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/crm\/dashboard|\/crm\/foreign-dashboard/)
  })

  test('应该能够访问仪表盘', async ({ page }) => {
    await expect(page.locator('text=仪表盘')).toBeVisible()
  })

  test('应该能够访问线索管理', async ({ page }) => {
    await page.click('text=线索管理')
    await expect(page.locator('text=线索')).toBeVisible()
  })

  test('应该能够访问客户管理', async ({ page }) => {
    await page.click('text=客户管理')
    await expect(page.locator('text=客户')).toBeVisible()
  })

  test('应该能够访问订单管理', async ({ page }) => {
    await page.click('text=订单管理')
    await expect(page.locator('text=订单')).toBeVisible()
  })

  test('应该能够访问业绩看板', async ({ page }) => {
    await page.click('text=业绩看板')
    await expect(page.locator('text=业绩')).toBeVisible()
  })

  test('应该能够访问 AI 客服', async ({ page }) => {
    await page.click('text=AI 客服')
    await expect(page.locator('text=智能客服')).toBeVisible()
  })

  test('快捷键应该工作', async ({ page }) => {
    // 测试 Ctrl+D 跳转到仪表盘
    await page.keyboard.press('Control+D')
    await expect(page.locator('text=仪表盘')).toBeVisible()
  })
})
